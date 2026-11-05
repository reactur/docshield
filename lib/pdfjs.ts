'use client';

import * as pdfjsLib from 'pdfjs-dist';

// Lazily configure the worker only in the browser.
let configured = false;

export async function getPdfjs(): Promise<typeof pdfjsLib> {
  if (typeof window === 'undefined') {
    throw new Error('pdfjs can only be used in the browser');
  }
  if (!configured) {
    // Use the CDN worker that matches the installed version. This avoids
    // Next.js SSR/build errors and keeps the bundle small.
    pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdn.jsdelivr.net/npm/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;
    configured = true;
  }
  return pdfjsLib;
}

export async function loadPdfDocument(data: ArrayBuffer) {
  const pdfjs = await getPdfjs();
  const loadingTask = pdfjs.getDocument({ data });
  return loadingTask.promise;
}

export async function renderPageToCanvas(
  pdf: pdfjsLib.PDFDocumentProxy,
  pageNumber: number,
  target: HTMLCanvasElement,
  renderScale = 1.2,
): Promise<{ width: number; height: number }> {
  const page = await pdf.getPage(pageNumber);
  const viewport = page.getViewport({ scale: renderScale });
  const ctx = target.getContext('2d');
  if (!ctx) throw new Error('Canvas 2D context unavailable');
  target.width = viewport.width;
  target.height = viewport.height;
  const renderTask = page.render({ canvas: target, canvasContext: ctx, viewport });
  await renderTask.promise;
  return { width: viewport.width, height: viewport.height };
}

export async function generateThumbnailDataUrl(
  pdf: pdfjsLib.PDFDocumentProxy,
  pageNumber: number,
  scale = 0.4,
): Promise<string> {
  const offscreen = document.createElement('canvas');
  await renderPageToCanvas(pdf, pageNumber, offscreen, scale);
  return offscreen.toDataURL('image/jpeg', 0.6);
}