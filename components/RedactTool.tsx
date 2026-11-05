'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import {
  ZoomIn,
  ZoomOut,
  Maximize,
  ChevronLeft,
  ChevronRight,
  Download,
  Loader2,
  ShieldCheck,
  Eraser,
  X,
  Trash2,
  FileText,
} from 'lucide-react';
import { Dropzone } from '@/components/Dropzone';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { downloadBlob, formatBytes, readFileAsArrayBuffer } from '@/lib/pdf-helpers';
import { applyRedactions, getPageSizes, type RedactionBox } from '@/lib/pdf-lib-utils';
import { loadPdfDocument, renderPageToCanvas } from '@/lib/pdfjs';
import { fireConfetti } from '@/lib/confetti';

type DrawnBox = {
  // Stored in canvas pixel coords at renderScale=1 reference; converted on export.
  x: number;
  y: number;
  width: number;
  height: number;
};

type Props = {
  onResult: (info: { originalPages: number; outputPages: number; outputBytes: number; action: string }) => void;
};

type PageState = {
  boxes: DrawnBox[];
};

export function RedactTool({ onResult }: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [fileBytes, setFileBytes] = useState<ArrayBuffer | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [zoom, setZoom] = useState(1.2);
  const [busy, setBusy] = useState(false);
  const [rendering, setRendering] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pages, setPages] = useState<Record<number, PageState>>({});
  const [pageViewport, setPageViewport] = useState({ width: 0, height: 0 });
  // Bumped each time a new PDF document is loaded so the render effect re-runs.
  const [docVersion, setDocVersion] = useState(0);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const pdfDocRef = useRef<Awaited<ReturnType<typeof loadPdfDocument>> | null>(null);
  const drawStateRef = useRef<{
    drawing: boolean;
    startX: number;
    startY: number;
    boxEl: HTMLDivElement | null;
  }>({ drawing: false, startX: 0, startY: 0, boxEl: null });

  const reset = () => {
    setFile(null);
    setFileBytes(null);
    setPageCount(0);
    setCurrentPage(1);
    setPages({});
    setPageViewport({ width: 0, height: 0 });
    setError(null);
    pdfDocRef.current = null;
    setDocVersion((v) => v + 1);
  };

  const handleFile = useCallback(async (files: File[]) => {
    setError(null);
    const f = files[0];
    if (!f) return;
    reset();
    setFile(f);
    setBusy(true);
    try {
      const buf = await readFileAsArrayBuffer(f);
      setFileBytes(buf);
      const pdf = await loadPdfDocument(buf.slice(0));
      pdfDocRef.current = pdf;
      setPageCount(pdf.numPages);
      setCurrentPage(1);
      setPages({});
      setDocVersion((v) => v + 1);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not open this PDF.');
    } finally {
      setBusy(false);
    }
  }, []);

  // Render current page whenever page or zoom changes.
  useEffect(() => {
    let cancelled = false;
    const render = async () => {
      const pdf = pdfDocRef.current;
      const canvas = canvasRef.current;
      if (!pdf || !canvas) return;
      setRendering(true);
      try {
        const { width, height } = await renderPageToCanvas(pdf, currentPage, canvas, zoom);
        if (!cancelled) {
          setPageViewport({ width, height });
          drawExistingBoxes();
        }
      } catch (e) {
        if (!cancelled)
          setError(e instanceof Error ? e.message : 'Failed to render page.');
      } finally {
        if (!cancelled) setRendering(false);
      }
    };
    void render();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, zoom, docVersion]);

  const drawExistingBoxes = useCallback(() => {
    const overlay = overlayRef.current;
    if (!overlay) return;
    // Clear dynamic boxes (keep none static).
    overlay
      .querySelectorAll('[data-redact-box]')
      .forEach((el) => el.remove());
    const boxes = pages[currentPage]?.boxes ?? [];
    for (const box of boxes) {
      const el = document.createElement('div');
      el.setAttribute('data-redact-box', 'true');
      el.className =
        'absolute border-2 border-emerald-400/70 bg-black/90 cursor-pointer group/box';
      el.style.left = `${box.x * zoom}px`;
      el.style.top = `${box.y * zoom}px`;
      el.style.width = `${box.width * zoom}px`;
      el.style.height = `${box.height * zoom}px`;
      el.addEventListener('click', () => removeBoxAt(box.x, box.y));
      // delete button
      const delBtn = document.createElement('div');
      delBtn.className =
        'absolute -right-2 -top-2 hidden h-5 w-5 items-center justify-center rounded-full bg-destructive text-destructive-foreground shadow group-hover/box:flex';
      delBtn.innerHTML = '×';
      delBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        removeBoxAt(box.x, box.y);
      });
      el.appendChild(delBtn);
      overlay.appendChild(el);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pages, currentPage, zoom]);

  useEffect(() => {
    drawExistingBoxes();
  }, [drawExistingBoxes]);

  const removeBoxAt = useCallback(
    (x: number, y: number) => {
      setPages((prev) => {
        const page = prev[currentPage];
        if (!page) return prev;
        const boxes = page.boxes.filter((b) => !(b.x === x && b.y === y));
        return { ...prev, [currentPage]: { boxes } };
      });
    },
    [currentPage],
  );

  const onOverlayMouseDown = (e: React.MouseEvent) => {
    const overlay = overlayRef.current;
    if (!overlay) return;
    if (e.button !== 0) return;
    const rect = overlay.getBoundingClientRect();
    const startX = e.clientX - rect.left;
    const startY = e.clientY - rect.top;
    const boxEl = document.createElement('div');
    boxEl.className =
      'absolute border-2 border-dashed border-emerald-400 bg-black/70 pointer-events-none';
    boxEl.style.left = `${startX}px`;
    boxEl.style.top = `${startY}px`;
    overlay.appendChild(boxEl);
    drawStateRef.current = { drawing: true, startX, startY, boxEl };
  };

  const onOverlayMouseMove = (e: React.MouseEvent) => {
    const state = drawStateRef.current;
    if (!state.drawing || !state.boxEl) return;
    const overlay = overlayRef.current;
    if (!overlay) return;
    const rect = overlay.getBoundingClientRect();
    const curX = e.clientX - rect.left;
    const curY = e.clientY - rect.top;
    const left = Math.min(state.startX, curX);
    const top = Math.min(state.startY, curY);
    const width = Math.abs(curX - state.startX);
    const height = Math.abs(curY - state.startY);
    state.boxEl.style.left = `${left}px`;
    state.boxEl.style.top = `${top}px`;
    state.boxEl.style.width = `${width}px`;
    state.boxEl.style.height = `${height}px`;
  };

  const onOverlayMouseUp = (e: React.MouseEvent) => {
    const state = drawStateRef.current;
    if (!state.drawing || !state.boxEl) return;
    const overlay = overlayRef.current;
    if (!overlay) return;
    const rect = overlay.getBoundingClientRect();
    const curX = e.clientX - rect.left;
    const curY = e.clientY - rect.top;
    const left = Math.min(state.startX, curX);
    const top = Math.min(state.startY, curY);
    const width = Math.abs(curX - state.startX);
    const height = Math.abs(curY - state.startY);
    state.boxEl.remove();
    drawStateRef.current = { drawing: false, startX: 0, startY: 0, boxEl: null };
    // Discard tiny drags (accidental clicks).
    if (width < 6 || height < 6) return;
    // Store in base-scale (zoom=1) coordinates.
    const box: DrawnBox = {
      x: left / zoom,
      y: top / zoom,
      width: width / zoom,
      height: height / zoom,
    };
    setPages((prev) => {
      const page = prev[currentPage] ?? { boxes: [] };
      return { ...prev, [currentPage]: { boxes: [...page.boxes, box] } };
    });
  };

  const clearPageBoxes = () => {
    setPages((prev) => ({ ...prev, [currentPage]: { boxes: [] } }));
  };

  const totalBoxes = Object.values(pages).reduce(
    (s, p) => s + p.boxes.length,
    0,
  );

  const doExport = async () => {
    if (!fileBytes) return;
    setExporting(true);
    setError(null);
    try {
      // Convert canvas boxes (base scale, top-left origin) to PDF user-space
      // (bottom-left origin). We need the page size in PDF units, which we
      // get from pdf-lib via the shared helper.
      const pageSizes = await getPageSizes(fileBytes);
      const pdf = pdfDocRef.current!;

      // For each page, compute scale factor from PDF units -> canvas base px.
      const redactionsByPage: Record<number, RedactionBox[]> = {};
      for (const [pageKeyStr, pageState] of Object.entries(pages)) {
        const pageIndex = parseInt(pageKeyStr, 10) - 1;
        const size = pageSizes[pageIndex];
        if (!size) continue;
        if (pageState.boxes.length === 0) continue;
        const { width: pdfW, height: pdfH } = size;
        // Render this page at scale 1 to learn the canvas size in base px.
        const page = await pdf.getPage(pageIndex + 1);
        const baseViewport = page.getViewport({ scale: 1 });
        const scaleX = pdfW / baseViewport.width;
        const scaleY = pdfH / baseViewport.height;

        redactionsByPage[pageIndex] = pageState.boxes.map((b) => ({
          x: b.x * scaleX,
          y: b.y * scaleY,
          width: b.width * scaleX,
          height: b.height * scaleY,
        }));
      }

      const out = await applyRedactions(fileBytes, redactionsByPage);
      downloadBlob(out, 'docshield-redacted.pdf');
      onResult({
        originalPages: pageCount,
        outputPages: pageCount,
        outputBytes: out.byteLength,
        action: 'Redact & flatten',
      });
      await fireConfetti();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Export failed.');
    } finally {
      setExporting(false);
    }
  };

  const zoomPresets = [
    { label: 'Fit', value: 1.2 },
    { label: '100%', value: 1.0 },
    { label: '150%', value: 1.5 },
  ];

  return (
    <div className="space-y-5">
      {!file ? (
        <Dropzone onFiles={handleFile} hint="Draw blackout boxes over sensitive text — flattened on export" />
      ) : (
        <Card className="border-border/60">
          <CardHeader className="flex flex-row items-center justify-between gap-3 space-y-0">
            <div className="min-w-0">
              <CardTitle className="flex items-center gap-2 truncate text-base">
                <FileText className="h-4 w-4 shrink-0 text-primary" />
                <span className="truncate">{file.name}</span>
              </CardTitle>
              <p className="mt-1 text-xs text-muted-foreground">
                {pageCount} pages · {formatBytes(file.size)} · {totalBoxes} redaction box{totalBoxes !== 1 ? 'es' : ''}
              </p>
            </div>
            <Button variant="ghost" size="sm" onClick={reset} className="shrink-0">
              <X className="mr-1 h-4 w-4" /> Change file
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {error && (
              <div className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                {error}
              </div>
            )}

            {/* Toolbar */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-1">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage <= 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="px-2 text-sm font-medium tabular-nums">
                  {currentPage} / {pageCount}
                </span>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setCurrentPage((p) => Math.min(pageCount, p + 1))}
                  disabled={currentPage >= pageCount}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>

              <div className="mx-1 h-6 w-px bg-border" />

              <div className="flex items-center gap-1">
                <Button variant="secondary" size="sm" onClick={() => setZoom((z) => Math.max(0.5, z - 0.2))}>
                  <ZoomOut className="h-4 w-4" />
                </Button>
                <span className="px-2 text-xs tabular-nums text-muted-foreground">
                  {Math.round(zoom * 100)}%
                </span>
                <Button variant="secondary" size="sm" onClick={() => setZoom((z) => Math.min(3, z + 0.2))}>
                  <ZoomIn className="h-4 w-4" />
                </Button>
                {zoomPresets.map((preset) => (
                  <Button
                    key={preset.label}
                    variant="ghost"
                    size="sm"
                    onClick={() => setZoom(preset.value)}
                    className="hidden sm:inline-flex"
                  >
                    <Maximize className="mr-1 h-3.5 w-3.5" />
                    {preset.label}
                  </Button>
                ))}
              </div>

              <Button variant="ghost" size="sm" onClick={clearPageBoxes} className="ml-auto">
                <Eraser className="mr-1 h-4 w-4" /> Clear page boxes
              </Button>
            </div>

            {/* Viewer */}
            <div className="overflow-auto rounded-lg border border-border bg-secondary/10 p-4 scrollbar-thin">
              <div className="mx-auto relative inline-block" style={{ width: pageViewport.width || 'auto' }}>
                {rendering && (
                  <div className="absolute inset-0 z-10 flex items-center justify-center bg-secondary/40 backdrop-blur-sm">
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  </div>
                )}
                <canvas
                  ref={canvasRef}
                  className="block max-w-none rounded shadow-lg"
                  style={{ width: pageViewport.width, height: pageViewport.height }}
                />
                <div
                  ref={overlayRef}
                  onMouseDown={onOverlayMouseDown}
                  onMouseMove={onOverlayMouseMove}
                  onMouseUp={onOverlayMouseUp}
                  onMouseLeave={onOverlayMouseUp}
                  className="absolute inset-0 cursor-crosshair"
                  style={{ width: pageViewport.width, height: pageViewport.height }}
                />
                <div className="pointer-events-none absolute -left-2 top-0 hidden h-full w-1 -translate-x-full flex-col justify-center text-[10px] text-muted-foreground/50 sm:flex">
                  Draw boxes
                </div>
              </div>
            </div>

            <p className="text-center text-xs text-muted-foreground">
              Click and drag over sensitive content to draw a blackout box. Click an existing box to remove it.
            </p>

            {/* Export */}
            <div className="flex flex-wrap items-center gap-3 border-t border-border pt-4">
              <div className="flex items-center gap-2 rounded-lg border border-success/30 bg-success/10 px-3 py-2 text-sm text-success">
                <ShieldCheck className="h-4 w-4" />
                <span className="font-medium">Redactions Flattened</span>
                <span className="text-success/80">— Text cannot be extracted</span>
              </div>
              <Button onClick={doExport} disabled={exporting || totalBoxes === 0} className="ml-auto">
                {exporting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Download className="mr-2 h-4 w-4" />}
                Export Redacted PDF ({totalBoxes})
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}