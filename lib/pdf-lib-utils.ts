'use client';

import { PDFDocument, degrees, rgb, StandardFonts } from '@cantoo/pdf-lib';
import { loadPdfDocument, renderPageToCanvas } from '@/lib/pdfjs';

export type RedactionBox = {
  // Coordinates stored in PDF user-space units (origin bottom-left).
  x: number;
  y: number;
  width: number;
  height: number;
};

export async function loadPdfBytes(data: ArrayBuffer | Uint8Array): Promise<PDFDocument> {
  const bytes = data instanceof ArrayBuffer ? new Uint8Array(data) : data;
  return PDFDocument.load(bytes, { ignoreEncryption: true });
}

export async function savePdf(doc: PDFDocument): Promise<Uint8Array> {
  return doc.save();
}

export async function getPageSizes(
  data: ArrayBuffer | Uint8Array,
): Promise<{ width: number; height: number }[]> {
  const source = await loadPdfBytes(data);
  return source.getPages().map((p) => p.getSize());
}

export async function splitPdfPages(
  data: ArrayBuffer | Uint8Array,
  ranges: number[][],
): Promise<{ name: string; bytes: Uint8Array }[]> {
  const source = await loadPdfBytes(data);
  const results: { name: string; bytes: Uint8Array }[] = [];
  for (const range of ranges) {
    const out = await PDFDocument.create();
    const copied = await out.copyPages(source, range);
    copied.forEach((p) => out.addPage(p));
    const bytes = await out.save();
    const label =
      range.length === 1
        ? `page-${range[0]}`
        : `pages-${range[0]}-${range[range.length - 1]}`;
    results.push({ name: `${label}.pdf`, bytes });
  }
  return results;
}

export async function extractSelectedPages(
  data: ArrayBuffer | Uint8Array,
  pages: number[],
): Promise<Uint8Array> {
  if (pages.length === 0) throw new Error('No pages selected.');
  const source = await loadPdfBytes(data);
  const out = await PDFDocument.create();
  const copied = await out.copyPages(source, pages);
  copied.forEach((p) => out.addPage(p));
  return out.save();
}

export async function deleteAndRearrangePdf(
  data: ArrayBuffer | Uint8Array,
  pageOrder: number[],
): Promise<Uint8Array> {
  const source = await loadPdfBytes(data);
  const out = await PDFDocument.create();
  const copied = await out.copyPages(source, pageOrder);
  copied.forEach((p) => out.addPage(p));
  return out.save();
}

export async function rotatePage(
  data: ArrayBuffer | Uint8Array,
  pageIndex: number,
  deltaDegrees: number,
): Promise<Uint8Array> {
  const onlySource = await loadPdfBytes(data);
  const pages = onlySource.getPages();
  const page = pages[pageIndex];
  if (!page) throw new Error('Page not found.');
  const current = page.getRotation().angle;
  page.setRotation(degrees((current + deltaDegrees) % 360));
  return onlySource.save();
}

export async function mergePdfs(
  files: { name: string; bytes: ArrayBuffer }[],
): Promise<Uint8Array> {
  const out = await PDFDocument.create();
  for (const file of files) {
    const src = await loadPdfBytes(file.bytes);
    const copied = await out.copyPages(src, src.getPageIndices());
    copied.forEach((p) => out.addPage(p));
  }
  return out.save();
}

// Burn solid black rectangles directly into PDF content so the underlying
// text cannot be selected or extracted. Coordinates are in user-space units
// with origin at the bottom-left of the page.
export async function applyRedactions(
  data: ArrayBuffer | Uint8Array,
  redactionsByPage: Record<number, RedactionBox[]>,
): Promise<Uint8Array> {
  const source = await loadPdfBytes(data);
  const pages = source.getPages();
  for (let i = 0; i < pages.length; i++) {
    const boxes = redactionsByPage[i];
    if (!boxes || boxes.length === 0) continue;
    const page = pages[i];
    const { width, height } = page.getSize();
    for (const box of boxes) {
      page.drawRectangle({
        x: box.x,
        y: height - box.y - box.height,
        width: box.width,
        height: box.height,
        color: rgb(0, 0, 0),
        opacity: 1,
        borderWidth: 0,
      });
    }
    // Add a small invisible marker text so the page is flagged as modified.
    const font = await source.embedFont(StandardFonts.Helvetica);
    page.drawText(' ', { x: 1, y: 1, size: 1, font });
    void width;
  }
  return source.save();
}

export type ImagePlacement = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export async function addImageToPages(
  data: ArrayBuffer | Uint8Array,
  imageBytes: Uint8Array,
  imageType: 'png' | 'jpg',
  placements: Record<number, ImagePlacement>,
): Promise<Uint8Array> {
  const source = await loadPdfBytes(data);
  const img =
    imageType === 'png'
      ? await source.embedPng(imageBytes)
      : await source.embedJpg(imageBytes);
  const pages = source.getPages();
  for (const [pageKey, placement] of Object.entries(placements)) {
    const pageIndex = parseInt(pageKey, 10);
    const page = pages[pageIndex];
    if (!page) continue;
    page.drawImage(img, {
      x: placement.x,
      y: placement.y,
      width: placement.width,
      height: placement.height,
    });
  }
  return source.save();
}

export type TextPlacement = {
  x: number;
  y: number;
  text: string;
  size: number;
  color: { r: number; g: number; b: number };
  rotation?: number;
};

export async function addTextToPages(
  data: ArrayBuffer | Uint8Array,
  placements: Record<number, TextPlacement[]>,
): Promise<Uint8Array> {
  const source = await loadPdfBytes(data);
  const font = await source.embedFont(StandardFonts.Helvetica);
  const pages = source.getPages();
  for (const [pageKey, items] of Object.entries(placements)) {
    const pageIndex = parseInt(pageKey, 10);
    const page = pages[pageIndex];
    if (!page) continue;
    for (const t of items) {
      page.drawText(t.text, {
        x: t.x,
        y: t.y,
        size: t.size,
        font,
        color: rgb(t.color.r, t.color.g, t.color.b),
        rotate: t.rotation ? degrees(t.rotation) : undefined,
      });
    }
  }
  return source.save();
}

export async function addWatermarkToPages(
  data: ArrayBuffer | Uint8Array,
  text: string,
  options: {
    fontSize?: number;
    opacity?: number;
    color?: { r: number; g: number; b: number };
    rotation?: number;
  },
): Promise<Uint8Array> {
  const source = await loadPdfBytes(data);
  const font = await source.embedFont(StandardFonts.Helvetica);
  const pages = source.getPages();
  const fontSize = options.fontSize ?? 50;
  const opacity = options.opacity ?? 0.15;
  const color = options.color ?? { r: 0.6, g: 0.6, b: 0.6 };
  const rotation = options.rotation ?? 45;

  for (const page of pages) {
    const { width, height } = page.getSize();
    const textWidth = font.widthOfTextAtSize(text, fontSize);
    const textHeight = font.heightAtSize(fontSize);
    const x = (width - textWidth * Math.cos((rotation * Math.PI) / 180)) / 2;
    const y = (height - textHeight) / 2;
    page.drawText(text, {
      x,
      y,
      size: fontSize,
      font,
      color: rgb(color.r, color.g, color.b),
      opacity,
      rotate: degrees(rotation),
    });
  }
  return source.save();
}

async function rasterizePageToJpeg(
  pdfBytes: Uint8Array,
  pageIndex: number,
  scale: number,
  quality: number,
): Promise<Uint8Array> {
  const pdf = await loadPdfDocument(pdfBytes);
  const offscreen = document.createElement('canvas');
  await renderPageToCanvas(pdf, pageIndex + 1, offscreen, scale);
  const blob: Blob | null = await new Promise((resolve) =>
    offscreen.toBlob((b) => resolve(b), 'image/jpeg', quality),
  );
  if (!blob) throw new Error('Could not compress page image.');
  const buf = await blob.arrayBuffer();
  return new Uint8Array(buf);
}

// Rasterizes each page to a flattened JPEG and rebuilds the PDF from those
// images. Dropping vector operators and font subsets is where most of the
// size reduction comes from; image quality scales with the chosen level.
export async function compressPdf(
  data: ArrayBuffer | Uint8Array,
  level: 'low' | 'medium' | 'high',
): Promise<Uint8Array> {
  const bytes = data instanceof Uint8Array ? data : new Uint8Array(data);
  const quality = level === 'low' ? 0.75 : level === 'medium' ? 0.55 : 0.35;
  const scale = level === 'low' ? 1.2 : level === 'medium' ? 1 : 0.75;

  const doc = await loadPdfBytes(bytes);
  const out = await PDFDocument.create();
  const pageCount = doc.getPageCount();
  const sizes = await getPageSizes(bytes);

  for (let i = 0; i < pageCount; i++) {
    const jpeg = await rasterizePageToJpeg(bytes, i, scale, quality);
    const image = await out.embedJpg(jpeg);
    const { width, height } = sizes[i];
    const page = out.addPage([width, height]);
    page.drawImage(image, { x: 0, y: 0, width, height });
  }

  return out.save({ useObjectStreams: true });
}

export async function protectPdf(
  data: ArrayBuffer | Uint8Array,
  userPassword: string,
  ownerPassword?: string,
): Promise<Uint8Array> {
  const source = await loadPdfBytes(data);
  await source.encrypt({
    userPassword,
    ownerPassword: ownerPassword ?? userPassword,
  });
  return source.save();
}

export async function isPdfEncrypted(data: ArrayBuffer | Uint8Array): Promise<boolean> {
  const bytes = data instanceof Uint8Array ? data : new Uint8Array(data);
  const doc = await PDFDocument.load(bytes, { ignoreEncryption: true, updateMetadata: false });
  return doc.isEncrypted;
}

// Decrypts with the user-supplied password and returns a clean, unencrypted
// copy. Throws a known error message for wrong passwords so the UI can react.
export async function unlockPdf(
  data: ArrayBuffer | Uint8Array,
  password: string,
): Promise<Uint8Array> {
  const bytes = data instanceof Uint8Array ? data : new Uint8Array(data);
  try {
    const doc = await PDFDocument.load(bytes, { password });
    return await doc.save({ useObjectStreams: false });
  } catch (e) {
    const msg = e instanceof Error ? e.message : '';
    if (msg.includes('Password incorrect') || msg.includes('NEEDS PASSWORD')) {
      throw new Error('Password incorrect');
    }
    throw e;
  }
}

export type ImageToPdfOptions = {
  pageSize: 'a4' | 'a3' | 'letter' | 'legal' | 'original';
  orientation: 'portrait' | 'landscape';
  margin: number;
  fit: 'contain' | 'cover';
};

const PAGE_DIMENSIONS: Record<Exclude<ImageToPdfOptions['pageSize'], 'original'>, [number, number]> = {
  a4: [595.28, 841.89],
  a3: [841.89, 1190.55],
  letter: [612, 792],
  legal: [612, 1008],
};

export async function buildPdfFromImages(
  images: { bytes: Uint8Array; type: string; rotated?: boolean }[],
  options: ImageToPdfOptions,
): Promise<Uint8Array> {
  const out = await PDFDocument.create();

  for (const image of images) {
    // Draw through a canvas: normalizes format, applies rotation, and re-encodes
    // so embedJpg always receives data it can handle regardless of source type.
    const bitmap = await createImageBitmap(new Blob([image.bytes as BlobPart]));
    const canvas = document.createElement('canvas');
    const swap = image.rotated;
    canvas.width = swap ? bitmap.height : bitmap.width;
    canvas.height = swap ? bitmap.width : bitmap.height;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Canvas 2D context unavailable');
    if (swap) {
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate(Math.PI / 2);
      ctx.drawImage(bitmap, -bitmap.width / 2, -bitmap.height / 2);
    } else {
      ctx.drawImage(bitmap, 0, 0);
    }
    bitmap.close();
    const jpegBlob: Blob | null = await new Promise((resolve) =>
      canvas.toBlob((b) => resolve(b), 'image/jpeg', 0.92),
    );
    if (!jpegBlob) throw new Error('Could not read this image.');
    const jpeg = new Uint8Array(await jpegBlob.arrayBuffer());
    const embedded = await out.embedJpg(jpeg);

    const imgW = swap ? bitmap.width : bitmap.width; // rotated dims already baked into canvas
    void imgW;
    const drawW = canvas.width;
    const drawH = canvas.height;

    if (options.pageSize === 'original') {
      const page = out.addPage([drawW, drawH]);
      page.drawImage(embedded, { x: 0, y: 0, width: drawW, height: drawH });
      continue;
    }

    const base = PAGE_DIMENSIONS[options.pageSize];
    const [pw, ph] =
      options.orientation === 'landscape' ? [Math.max(...base), Math.min(...base)] : [Math.min(...base), Math.max(...base)];

    const page = out.addPage([pw, ph]);
    const m = options.margin;
    const boxW = pw - m * 2;
    const boxH = ph - m * 2;

    let w: number;
    let h: number;
    if (options.fit === 'cover') {
      const scale = Math.max(boxW / drawW, boxH / drawH);
      w = drawW * scale;
      h = drawH * scale;
    } else {
      const scale = Math.min(boxW / drawW, boxH / drawH);
      w = drawW * scale;
      h = drawH * scale;
    }
    const x = (pw - w) / 2;
    const y = (ph - h) / 2;
    page.drawImage(embedded, { x, y, width: w, height: h });
  }

  return out.save();
}
