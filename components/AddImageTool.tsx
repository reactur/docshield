'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import {
  Download, Loader2, X, Image as ImageIcon, ChevronLeft, ChevronRight,
  ZoomIn, ZoomOut, Copy, Trash2, FileText,
} from 'lucide-react';
import { Dropzone } from '@/components/Dropzone';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { downloadBlob, formatBytes, readFileAsArrayBuffer } from '@/lib/pdf-helpers';
import { addImageToPages, getPageSizes, type ImagePlacement } from '@/lib/pdf-lib-utils';
import { loadPdfDocument, renderPageToCanvas } from '@/lib/pdfjs';
import { fireConfetti } from '@/lib/confetti';

type PlacedImage = {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  src: string;
  bytes: Uint8Array;
  type: 'png' | 'jpg';
};

type Props = {
  onResult: (info: { originalPages: number; outputPages: number; outputBytes: number; action: string }) => void;
};

export function AddImageTool({ onResult }: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [fileBytes, setFileBytes] = useState<Uint8Array | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [zoom, setZoom] = useState(1.2);
  const [busy, setBusy] = useState(false);
  const [rendering, setRendering] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [applyAll, setApplyAll] = useState(false);
  const [pageImages, setPageImages] = useState<Record<number, PlacedImage[]>>({});
  const [pageViewport, setPageViewport] = useState({ width: 0, height: 0 });
  const [docVersion, setDocVersion] = useState(0);
  const [selectedImageId, setSelectedImageId] = useState<string | null>(null);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const pdfDocRef = useRef<Awaited<ReturnType<typeof loadPdfDocument>> | null>(null);
  const dragStateRef = useRef<{
    dragging: boolean;
    startX: number;
    startY: number;
    imgId: string;
    origX: number;
    origY: number;
    origW: number;
    origH: number;
    resizing: boolean;
  }>({ dragging: false, startX: 0, startY: 0, imgId: '', origX: 0, origY: 0, origW: 0, origH: 0, resizing: false });

  const reset = () => {
    setFile(null);
    setFileBytes(null);
    setPageCount(0);
    setCurrentPage(1);
    setPageImages({});
    setPageViewport({ width: 0, height: 0 });
    setError(null);
    setSelectedImageId(null);
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
      const bytes = new Uint8Array(buf);
      setFileBytes(bytes);
      const pdf = await loadPdfDocument(bytes);
      pdfDocRef.current = pdf;
      setPageCount(pdf.numPages);
      setCurrentPage(1);
      setPageImages({});
      setDocVersion((v) => v + 1);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not open this PDF.');
    } finally {
      setBusy(false);
    }
  }, []);

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
        }
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : 'Failed to render page.');
      } finally {
        if (!cancelled) setRendering(false);
      }
    };
    void render();
    return () => { cancelled = true; };
  }, [currentPage, zoom, docVersion]);

  const handleImageUpload = async (files: File[]) => {
    const f = files[0];
    if (!f) return;
    const isPng = f.type === 'image/png' || f.name.toLowerCase().endsWith('.png');
    const isJpg = f.type === 'image/jpeg' || f.name.toLowerCase().endsWith('.jpg') || f.name.toLowerCase().endsWith('.jpeg');
    if (!isPng && !isJpg) {
      setError('Please use a PNG or JPG image.');
      return;
    }
    const buf = await f.arrayBuffer();
    const bytes = new Uint8Array(buf);
    const src = URL.createObjectURL(f);
    const id = `img-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const pageW = pageViewport.width;
    const defaultW = Math.min(pageW * 0.25, 200);
    const img = new Image();
    img.src = src;
    await new Promise((resolve) => { img.onload = resolve; img.onerror = resolve; });
    const aspect = img.naturalWidth && img.naturalHeight ? img.naturalWidth / img.naturalHeight : 1;
    const defaultH = defaultW / aspect;
    const placed: PlacedImage = {
      id,
      x: (pageW - defaultW) / 2,
      y: (pageViewport.height - defaultH) / 2,
      width: defaultW,
      height: defaultH,
      src,
      bytes,
      type: isPng ? 'png' : 'jpg',
    };
    setPageImages((prev) => ({
      ...prev,
      [currentPage]: [...(prev[currentPage] ?? []), placed],
    }));
    setSelectedImageId(id);
    setError(null);
  };

  const renderOverlays = useCallback(() => {
    const overlay = overlayRef.current;
    if (!overlay) return;
    overlay.querySelectorAll('[data-placed-img]').forEach((el) => el.remove());
    const images = pageImages[currentPage] ?? [];
    for (const img of images) {
      const wrapper = document.createElement('div');
      wrapper.setAttribute('data-placed-img', img.id);
      wrapper.className = cn(
        'absolute cursor-move border-2',
        selectedImageId === img.id ? 'border-primary' : 'border-transparent',
      );
      wrapper.style.left = `${img.x * zoom}px`;
      wrapper.style.top = `${img.y * zoom}px`;
      wrapper.style.width = `${img.width * zoom}px`;
      wrapper.style.height = `${img.height * zoom}px`;
      const imgEl = document.createElement('img');
      imgEl.src = img.src;
      imgEl.className = 'pointer-events-none h-full w-full object-contain';
      imgEl.draggable = false;
      wrapper.appendChild(imgEl);

      if (selectedImageId === img.id) {
        const delBtn = document.createElement('div');
        delBtn.className = 'absolute -right-2 -top-2 flex h-6 w-6 cursor-pointer items-center justify-center rounded-full bg-destructive text-destructive-foreground shadow';
        delBtn.innerHTML = '×';
        delBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          setPageImages((prev) => ({
            ...prev,
            [currentPage]: (prev[currentPage] ?? []).filter((i) => i.id !== img.id),
          }));
          setSelectedImageId(null);
        });
        wrapper.appendChild(delBtn);

        const resizeHandle = document.createElement('div');
        resizeHandle.className = 'absolute -bottom-1.5 -right-1.5 h-4 w-4 cursor-se-resize rounded-full border-2 border-primary bg-white shadow';
        resizeHandle.addEventListener('mousedown', (e) => {
          e.stopPropagation();
          dragStateRef.current = {
            dragging: false, startX: e.clientX, startY: e.clientY,
            imgId: img.id, origX: img.x, origY: img.y, origW: img.width, origH: img.height, resizing: true,
          };
        });
        wrapper.appendChild(resizeHandle);

        const copyBtn = document.createElement('div');
        copyBtn.className = 'absolute -left-2 -top-2 flex h-6 w-6 cursor-pointer items-center justify-center rounded-full bg-primary text-primary-foreground shadow';
        copyBtn.innerHTML = '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>';
        copyBtn.title = 'Copy to all pages';
        copyBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          setPageImages((prev) => {
            const updated = { ...prev };
            const newId = `img-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
            const copy: PlacedImage = { ...img, id: newId, src: img.src, bytes: img.bytes };
            for (let p = 1; p <= pageCount; p++) {
              if (p === currentPage) continue;
              updated[p] = [...(updated[p] ?? []), { ...copy }];
            }
            return updated;
          });
        });
        wrapper.appendChild(copyBtn);
      }

      wrapper.addEventListener('mousedown', (e) => {
        if (e.button !== 0) return;
        setSelectedImageId(img.id);
        const overlayRect = overlay.getBoundingClientRect();
        dragStateRef.current = {
          dragging: true,
          startX: e.clientX - overlayRect.left,
          startY: e.clientY - overlayRect.top,
          imgId: img.id,
          origX: img.x,
          origY: img.y,
          origW: img.width,
          origH: img.height,
          resizing: false,
        };
      });
      overlay.appendChild(wrapper);
    }
  }, [pageImages, currentPage, zoom, selectedImageId, pageCount]);

  useEffect(() => { renderOverlays(); }, [renderOverlays]);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const state = dragStateRef.current;
      const overlay = overlayRef.current;
      if (!overlay) return;
      if (!state.dragging && !state.resizing) return;
      const rect = overlay.getBoundingClientRect();
      const cx = e.clientX - rect.left;
      const cy = e.clientY - rect.top;
      const dx = (cx - state.startX) / zoom;
      const dy = (cy - state.startY) / zoom;
      setPageImages((prev) => {
        const imgs = prev[currentPage] ?? [];
        return {
          ...prev,
          [currentPage]: imgs.map((i) => {
            if (i.id !== state.imgId) return i;
            if (state.resizing) {
              const newW = Math.max(20, state.origW + dx);
              const newH = Math.max(20, state.origH + dy);
              return { ...i, width: newW, height: newH };
            }
            return { ...i, x: state.origX + dx, y: state.origY + dy };
          }),
        };
      });
    };
    const onUp = () => {
      dragStateRef.current = { dragging: false, startX: 0, startY: 0, imgId: '', origX: 0, origY: 0, origW: 0, origH: 0, resizing: false };
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
  }, [zoom, currentPage]);

  const totalImages = Object.values(pageImages).reduce((s, imgs) => s + imgs.length, 0);

  const doExport = async () => {
    if (!fileBytes || totalImages === 0) return;
    setExporting(true);
    setError(null);
    try {
      const pageSizes = await getPageSizes(fileBytes);
      const pdf = pdfDocRef.current!;
      const placements: Record<number, ImagePlacement> = {};
      for (const [pageKey, imgs] of Object.entries(pageImages)) {
        const pageIndex = parseInt(pageKey, 10) - 1;
        const size = pageSizes[pageIndex];
        if (!size || imgs.length === 0) continue;
        const pdfPage = await pdf.getPage(parseInt(pageKey, 10));
        const baseVp = pdfPage.getViewport({ scale: 1 });
        const scaleX = size.width / baseVp.width;
        const scaleY = size.height / baseVp.height;
        for (const img of imgs) {
          placements[pageIndex] = {
            x: img.x * scaleX,
            y: size.height - (img.y + img.height) * scaleY,
            width: img.width * scaleX,
            height: img.height * scaleY,
          };
          const out = await addImageToPages(fileBytes, img.bytes, img.type, { [pageIndex]: placements[pageIndex] });
          setFileBytes(out);
        }
      }
      const finalBytes = fileBytes!;
      downloadBlob(finalBytes, 'docshield-images-added.pdf');
      onResult({
        originalPages: pageCount,
        outputPages: pageCount,
        outputBytes: finalBytes.byteLength,
        action: 'Add images',
      });
      await fireConfetti();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Export failed.');
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="space-y-5">
      {!file ? (
        <Dropzone onFiles={handleFile} hint="Your PDF stays on your device. Nothing is uploaded." />
      ) : (
        <Card className="border-border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between gap-3 space-y-0">
            <div className="min-w-0">
              <CardTitle className="flex items-center gap-2 truncate text-base">
                <ImageIcon className="h-4 w-4 shrink-0 text-primary" />
                <span className="truncate">{file.name}</span>
              </CardTitle>
              <p className="mt-1 text-xs text-muted-foreground">
                {pageCount} pages · {formatBytes(file.size)}
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

            {(busy || rendering) && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                {rendering ? 'Loading page…' : 'Working…'}
              </div>
            )}

            <div className="flex flex-wrap items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const input = document.createElement('input');
                  input.type = 'file';
                  input.accept = 'image/png,image/jpeg';
                  input.onchange = () => {
                    if (input.files && input.files.length > 0) handleImageUpload(Array.from(input.files));
                  };
                  input.click();
                }}
                disabled={busy || rendering}
              >
                <ImageIcon className="mr-1.5 h-4 w-4" /> Add image to page {currentPage}
              </Button>
              <span className="text-xs text-muted-foreground">
                {totalImages} image{totalImages !== 1 ? 's' : ''} placed across all pages
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage <= 1}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm font-medium">Page {currentPage} of {pageCount}</span>
              <Button variant="ghost" size="sm" onClick={() => setCurrentPage((p) => Math.min(pageCount, p + 1))} disabled={currentPage >= pageCount}>
                <ChevronRight className="h-4 w-4" />
              </Button>
              <div className="ml-auto flex items-center gap-1">
                <Button variant="ghost" size="sm" onClick={() => setZoom((z) => Math.max(0.5, z - 0.2))}>
                  <ZoomOut className="h-4 w-4" />
                </Button>
                <span className="text-xs text-muted-foreground">{Math.round(zoom * 100)}%</span>
                <Button variant="ghost" size="sm" onClick={() => setZoom((z) => Math.min(3, z + 0.2))}>
                  <ZoomIn className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="relative inline-block" style={{ width: pageViewport.width || '100%' }}>
              <canvas ref={canvasRef} className="rounded-lg border border-border shadow-sm" />
              <div
                ref={overlayRef}
                className="absolute inset-0"
                style={{ width: pageViewport.width, height: pageViewport.height }}
              />
            </div>

            <p className="text-xs text-muted-foreground">
              Drag images to reposition. Use the handle in the bottom-right corner to resize.
              Click the copy button (top-left) to place the same image on all pages.
            </p>

            <div className="flex flex-wrap items-center gap-3 border-t border-border pt-4">
              <Button onClick={doExport} disabled={exporting || totalImages === 0}>
                {exporting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Download className="mr-2 h-4 w-4" />}
                Download PDF with images
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
