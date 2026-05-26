export const AVATAR_CROP_VIEWPORT = 280;
export const AVATAR_CROP_OUTPUT = 512;

export function getCoverScale(
  naturalWidth: number,
  naturalHeight: number,
  viewport: number,
): number {
  return Math.max(viewport / naturalWidth, viewport / naturalHeight);
}

export function clampPan(
  offsetX: number,
  offsetY: number,
  naturalWidth: number,
  naturalHeight: number,
  viewport: number,
  userScale: number,
): { x: number; y: number } {
  const scale = getCoverScale(naturalWidth, naturalHeight, viewport) * userScale;
  const width = naturalWidth * scale;
  const height = naturalHeight * scale;
  const maxX = Math.max(0, (width - viewport) / 2);
  const maxY = Math.max(0, (height - viewport) / 2);

  return {
    x: Math.min(maxX, Math.max(-maxX, offsetX)),
    y: Math.min(maxY, Math.max(-maxY, offsetY)),
  };
}

export async function cropAvatarToBlob(
  image: HTMLImageElement,
  options: {
    offsetX: number;
    offsetY: number;
    userScale: number;
    viewport?: number;
    outputSize?: number;
    type?: string;
    quality?: number;
  },
): Promise<Blob> {
  const viewport = options.viewport ?? AVATAR_CROP_VIEWPORT;
  const outputSize = options.outputSize ?? AVATAR_CROP_OUTPUT;
  const type = options.type ?? "image/jpeg";
  const quality = options.quality ?? 0.92;

  const canvas = document.createElement("canvas");
  canvas.width = outputSize;
  canvas.height = outputSize;

  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas not supported");

  const scale = getCoverScale(image.naturalWidth, image.naturalHeight, viewport) * options.userScale;
  const ratio = outputSize / viewport;
  const drawWidth = image.naturalWidth * scale * ratio;
  const drawHeight = image.naturalHeight * scale * ratio;
  const centerX = outputSize / 2 + options.offsetX * ratio;
  const centerY = outputSize / 2 + options.offsetY * ratio;

  ctx.drawImage(
    image,
    centerX - drawWidth / 2,
    centerY - drawHeight / 2,
    drawWidth,
    drawHeight,
  );

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error("Could not export image"))),
      type,
      quality,
    );
  });
}

export function loadImageSource(source: string | File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    let objectUrl: string | undefined;

    img.onload = () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
      resolve(img);
    };

    img.onerror = () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
      reject(new Error("Could not load image"));
    };

    if (typeof source === "string") {
      img.crossOrigin = "anonymous";
      img.src = source;
      return;
    }

    objectUrl = URL.createObjectURL(source);
    img.src = objectUrl;
  });
}
