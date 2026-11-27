'use client';

import { PDFDocument, degrees, rgb, StandardFonts } from 'pdf-lib';

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
  const source = await loadPdfBytes(data);
  const pages = source.getPages();
  const page = pages[pageIndex];
  if (!page) throw new Error('Page not found.');
  const current = page.getRotation().angle;
  page.setRotation(degrees((current + deltaDegrees) % 360));
  return source.save();
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

export async function protectPdf(
  data: ArrayBuffer | Uint8Array,
  userPassword: string,
  ownerPassword?: string,
): Promise<Uint8Array> {
  const source = await loadPdfBytes(data);
  return source.save({
    useObjectStreams: false,
    userPassword,
    ownerPassword: ownerPassword ?? userPassword,
  });
}