export const AVATAR_CROP_STAGE = 280;
export const AVATAR_CROP_CIRCLE = 260;
export const AVATAR_CROP_OUTPUT = 512;

export function getCoverScale(
  naturalWidth: number,
  naturalHeight: number,
  diameter: number,
): number {
  return Math.max(diameter / naturalWidth, diameter / naturalHeight);
}

export function clampCircle(
  circleX: number,
  circleY: number,
  naturalWidth: number,
  naturalHeight: number,
  stage: number,
  circle: number,
  userScale: number,
): { x: number; y: number } {
  const scale = getCoverScale(naturalWidth, naturalHeight, circle) * userScale;
  const displayWidth = naturalWidth * scale;
  const displayHeight = naturalHeight * scale;
  const imageLeft = stage / 2 - displayWidth / 2;
  const imageTop = stage / 2 - displayHeight / 2;
  const imageRight = imageLeft + displayWidth;
  const imageBottom = imageTop + displayHeight;
  const radius = circle / 2;

  const minX = imageLeft + radius - stage / 2;
  const maxX = imageRight - radius - stage / 2;
  const minY = imageTop + radius - stage / 2;
  const maxY = imageBottom - radius - stage / 2;

  return {
    x: Math.min(maxX, Math.max(minX, circleX)),
    y: Math.min(maxY, Math.max(minY, circleY)),
  };
}

export async function cropAvatarToBlob(
  image: HTMLImageElement,
  options: {
    circleX: number;
    circleY: number;
    userScale: number;
    stage?: number;
    circle?: number;
    outputSize?: number;
    type?: string;
    quality?: number;
  },
): Promise<Blob> {
  const stage = options.stage ?? AVATAR_CROP_STAGE;
  const circle = options.circle ?? AVATAR_CROP_CIRCLE;
  const outputSize = options.outputSize ?? AVATAR_CROP_OUTPUT;
  const type = options.type ?? "image/jpeg";
  const quality = options.quality ?? 0.92;

  const scale = getCoverScale(image.naturalWidth, image.naturalHeight, circle) * options.userScale;
  const circleCenterX = stage / 2 + options.circleX;
  const circleCenterY = stage / 2 + options.circleY;
  const imageLeft = stage / 2 - (image.naturalWidth * scale) / 2;
  const imageTop = stage / 2 - (image.naturalHeight * scale) / 2;
  const sourceSize = circle / scale;
  const sourceX = (circleCenterX - circle / 2 - imageLeft) / scale;
  const sourceY = (circleCenterY - circle / 2 - imageTop) / scale;

  const canvas = document.createElement("canvas");
  canvas.width = outputSize;
  canvas.height = outputSize;

  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas not supported");

  ctx.drawImage(
    image,
    sourceX,
    sourceY,
    sourceSize,
    sourceSize,
    0,
    0,
    outputSize,
    outputSize,
  );

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error("Could not export image"))),
      type,
      quality,
    );
  });
}

function loadImageElement(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Could not load image"));
    img.src = src;
  });
}

export async function loadImageSource(source: string | File): Promise<HTMLImageElement> {
  if (source instanceof File) {
    const objectUrl = URL.createObjectURL(source);
    try {
      return await loadImageElement(objectUrl);
    } finally {
      URL.revokeObjectURL(objectUrl);
    }
  }

  const resolved = new URL(source, window.location.origin);
  const isSameOrigin = resolved.origin === window.location.origin;

  if (isSameOrigin) {
    const response = await fetch(resolved.href, { credentials: "same-origin" });
    if (!response.ok) throw new Error("Could not load image");
    const blob = await response.blob();
    const objectUrl = URL.createObjectURL(blob);
    try {
      return await loadImageElement(objectUrl);
    } finally {
      URL.revokeObjectURL(objectUrl);
    }
  }

  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Could not load image"));
    img.src = source;
  });
}
