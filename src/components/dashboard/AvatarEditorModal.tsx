import { useCallback, useEffect, useRef, useState } from "react";
import AvatarEditor, { type AvatarEditorRef, type Position } from "react-avatar-editor";

const CROP_SIZE = 260;
const BORDER = 10;

export type AvatarEditorOpenOptions = {
  file?: File;
  url?: string;
  hasSource?: boolean;
  onConfirm: (blob: Blob) => Promise<void>;
  onCancel?: () => void;
  onLoadError?: () => void;
};

declare global {
  interface Window {
    openAvatarCropEditor?: (options: AvatarEditorOpenOptions) => void;
  }
}

export default function AvatarEditorModal() {
  const editorRef = useRef<AvatarEditorRef>(null);
  const callbacksRef = useRef<AvatarEditorOpenOptions | null>(null);
  const [open, setOpen] = useState(false);
  const [image, setImage] = useState<string | File | undefined>(undefined);
  const [scale, setScale] = useState(1.2);
  const [position, setPosition] = useState<Position>({ x: 0.5, y: 0.5 });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const close = useCallback(() => {
    setOpen(false);
    setImage(undefined);
    setError("");
    setSaving(false);
    callbacksRef.current?.onCancel?.();
    callbacksRef.current = null;
  }, []);

  useEffect(() => {
    window.openAvatarCropEditor = (options) => {
      callbacksRef.current = options;
      setError("");
      setSaving(false);
      setPosition({ x: 0.5, y: 0.5 });
      setScale(options.file || options.hasSource ? 1.2 : 1.5);
      setImage(options.file ?? options.url);
      setOpen(true);
    };

    return () => {
      delete window.openAvatarCropEditor;
    };
  }, []);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [close, open]);

  async function handleSave() {
    if (!editorRef.current || !callbacksRef.current) return;

    setSaving(true);
    setError("");

    try {
      const canvas = editorRef.current.getImageScaledToCanvas();
      const blob = await new Promise<Blob | null>((resolve) => {
        canvas.toBlob((value) => resolve(value), "image/jpeg", 0.92);
      });

      if (!blob) throw new Error("Could not export image");

      await callbacksRef.current.onConfirm(blob);
      setOpen(false);
      setImage(undefined);
      callbacksRef.current = null;
    } catch {
      setError("Could not save this image. If it is an external URL, upload the file instead.");
    } finally {
      setSaving(false);
    }
  }

  if (!open || !image) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgb(20 18 16 / 0.55)" }}
      onClick={(event) => {
        if (event.target === event.currentTarget) close();
      }}
      role="presentation"
    >
      <div
        className="hl-card w-full max-w-[360px] p-5 shadow-xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="avatar-editor-title"
      >
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <div id="avatar-editor-title" className="hl-display text-[20px]">
              Adjust photo
            </div>
            <p className="mt-1 text-[12.5px]" style={{ color: "var(--hl-ink-2)" }}>
              Drag to reposition. Pinch, scroll, or use the slider to zoom.
            </p>
          </div>
          <button type="button" className="hl-btn hl-btn-ghost px-2 py-1 text-lg leading-none" onClick={close}>
            ×
          </button>
        </div>

        <div className="mx-auto w-fit overflow-hidden rounded-[var(--hl-radius)]">
          <AvatarEditor
            ref={editorRef}
            image={image}
            width={CROP_SIZE}
            height={CROP_SIZE}
            border={BORDER}
            borderRadius={CROP_SIZE / 2}
            scale={scale}
            position={position}
            onPositionChange={setPosition}
            onRequestScaleChange={setScale}
            enableWheelZoom
            crossOrigin="anonymous"
            onLoadFailure={() => {
              callbacksRef.current?.onLoadError?.();
              close();
            }}
          />
        </div>

        <div className="mt-5">
          <label className="hl-label" htmlFor="avatar-editor-zoom">
            Zoom
          </label>
          <input
            id="avatar-editor-zoom"
            type="range"
            min={1}
            max={3}
            step={0.01}
            value={scale}
            onChange={(event) => setScale(Number(event.target.value))}
            className="mt-2 w-full accent-[var(--hl-sage-deep)]"
          />
        </div>

        {error ? (
          <p className="mt-3 text-sm" style={{ color: "#b91c1c" }}>
            {error}
          </p>
        ) : null}

        <div className="mt-5 flex justify-end gap-2">
          <button type="button" className="hl-btn hl-btn-soft px-4 py-2 text-[13px]" onClick={close}>
            Cancel
          </button>
          <button
            type="button"
            className="hl-btn hl-btn-primary px-4 py-2 text-[13px]"
            disabled={saving}
            onClick={handleSave}
          >
            {saving ? "Saving…" : "Save photo"}
          </button>
        </div>
      </div>
    </div>
  );
}
