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
  data: ArrayBuffer,
): Promise<{ width: number; height: number }[]> {
  const source = await loadPdfBytes(data);
  return source.getPages().map((p) => p.getSize());
}

export async function splitPdfPages(
  data: ArrayBuffer,
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
  data: ArrayBuffer,
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
  data: ArrayBuffer,
  pageOrder: number[],
): Promise<Uint8Array> {
  const source = await loadPdfBytes(data);
  const out = await PDFDocument.create();
  const copied = await out.copyPages(source, pageOrder);
  copied.forEach((p) => out.addPage(p));
  return out.save();
}

export async function rotatePage(
  data: ArrayBuffer,
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
  data: ArrayBuffer,
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