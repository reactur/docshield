'use client';

import * as pdfjsLib from 'pdfjs-dist';
// Bundled by webpack 5 via new URL(..., import.meta.url), so the worker ships
// in the deployment itself. A public/ or CDN copy can 404 or be blocked after
// deployment (Netlify routing, MIME type, CSP, ad blockers).
let configured = false;

export async function getPdfjs(): Promise<typeof pdfjsLib> {
  if (typeof window === 'undefined') {
    throw new Error('pdfjs can only be used in the browser');
  }
  if (!configured) {
    pdfjsLib.GlobalWorkerOptions.workerPort = new Worker(
      new URL('pdfjs-dist/build/pdf.worker.min.mjs', import.meta.url),
    );
    configured = true;
  }
  return pdfjsLib;
}

export async function loadPdfDocument(data: ArrayBuffer | Uint8Array) {
  const pdfjs = await getPdfjs();
  const bytes = data instanceof Uint8Array ? data : new Uint8Array(data);
  const loadingTask = pdfjs.getDocument({ data: bytes.slice() });
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
