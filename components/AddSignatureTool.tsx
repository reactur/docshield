'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import {
  Download, Loader2, X, PenTool, ChevronLeft, ChevronRight,
  ZoomIn, ZoomOut, Eraser,
} from 'lucide-react';
import { Dropzone } from '@/components/Dropzone';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { downloadBlob, formatBytes, readFileAsArrayBuffer } from '@/lib/pdf-helpers';
import { addImageToPages, getPageSizes, type ImagePlacement } from '@/lib/pdf-lib-utils';
import { loadPdfDocument, renderPageToCanvas } from '@/lib/pdfjs';
import { fireConfetti } from '@/lib/confetti';

type PlacedSignature = {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  src: string;
  bytes: Uint8Array;
};

type Props = {
  onResult: (info: { originalPages: number; outputPages: number; outputBytes: number; action: string }) => void;
};

export function AddSignatureTool({ onResult }: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [fileBytes, setFileBytes] = useState<Uint8Array | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [zoom, setZoom] = useState(1.2);
  const [busy, setBusy] = useState(false);
  const [rendering, setRendering] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pageSignatures, setPageSignatures] = useState<Record<number, PlacedSignature[]>>({});
  const [pageViewport, setPageViewport] = useState({ width: 0, height: 0 });
  const [docVersion, setDocVersion] = useState(0);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showSignaturePad, setShowSignaturePad] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const pdfDocRef = useRef<Awaited<ReturnType<typeof loadPdfDocument>> | null>(null);
  const sigPadRef = useRef<HTMLCanvasElement>(null);
  const sigCtxRef = useRef<CanvasRenderingContext2D | null>(null);
  const drawingRef = useRef(false);
  const lastPtRef = useRef<{ x: number; y: number } | null>(null);
  const dragStateRef = useRef<{
    dragging: boolean; startX: number; startY: number; id: string;
    origX: number; origY: number; origW: number; origH: number; resizing: boolean;
  }>({ dragging: false, startX: 0, startY: 0, id: '', origX: 0, origY: 0, origW: 0, origH: 0, resizing: false });

  const reset = () => {
    setFile(null); setFileBytes(null); setPageCount(0); setCurrentPage(1);
    setPageSignatures({}); setPageViewport({ width: 0, height: 0 });
    setError(null); setSelectedId(null); setShowSignaturePad(false);
    pdfDocRef.current = null; setDocVersion((v) => v + 1);
  };

  const handleFile = useCallback(async (files: File[]) => {
    setError(null);
    const f = files[0];
    if (!f) return;
    reset(); setFile(f); setBusy(true);
    try {
      const buf = await readFileAsArrayBuffer(f);
      const bytes = new Uint8Array(buf);
      setFileBytes(bytes);
      const pdf = await loadPdfDocument(bytes);
      pdfDocRef.current = pdf;
      setPageCount(pdf.numPages);
      setCurrentPage(1); setPageSignatures({});
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
        if (!cancelled) setPageViewport({ width, height });
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : 'Failed to render page.');
      } finally {
        if (!cancelled) setRendering(false);
      }
    };
    void render();
    return () => { cancelled = true; };
  }, [currentPage, zoom, docVersion]);

  // Signature pad setup
  const initSigPad = useCallback(() => {
    const canvas = sigPadRef.current;
    if (!canvas) return;
    canvas.width = 400;
    canvas.height = 150;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    sigCtxRef.current = ctx;
  }, []);

  useEffect(() => {
    if (showSignaturePad) initSigPad();
  }, [showSignaturePad, initSigPad]);

  const sigPadDown = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = sigPadRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    let px: number, py: number;
    if ('touches' in e) {
      px = e.touches[0].clientX - rect.left;
      py = e.touches[0].clientY - rect.top;
    } else {
      px = e.clientX - rect.left;
      py = e.clientY - rect.top;
    }
    drawingRef.current = true;
    lastPtRef.current = { x: px * (canvas.width / rect.width), y: py * (canvas.height / rect.height) };
  };

  const sigPadMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!drawingRef.current) return;
    const canvas = sigPadRef.current;
    const ctx = sigCtxRef.current;
    if (!canvas || !ctx) return;
    const rect = canvas.getBoundingClientRect();
    let px: number, py: number;
    if ('touches' in e) {
      px = e.touches[0].clientX - rect.left;
      py = e.touches[0].clientY - rect.top;
    } else {
      px = e.clientX - rect.left;
      py = e.clientY - rect.top;
    }
    const x = px * (canvas.width / rect.width);
    const y = py * (canvas.height / rect.height);
    const last = lastPtRef.current;
    if (last) {
      ctx.beginPath();
      ctx.moveTo(last.x, last.y);
      ctx.lineTo(x, y);
      ctx.stroke();
    }
    lastPtRef.current = { x, y };
  };

  const sigPadUp = () => {
    drawingRef.current = false;
    lastPtRef.current = null;
  };

  const clearSigPad = () => {
    const canvas = sigPadRef.current;
    const ctx = sigCtxRef.current;
    if (!canvas || !ctx) return;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };

  const placeSignature = async () => {
    const canvas = sigPadRef.current;
    if (!canvas) return;
    const dataUrl = canvas.toDataURL('image/png');
    const resp = await fetch(dataUrl);
    const buf = await resp.arrayBuffer();
    const bytes = new Uint8Array(buf);
    const id = `sig-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const defaultW = Math.min(pageViewport.width * 0.25, 200);
    const defaultH = defaultW * (canvas.height / canvas.width);
    const placed: PlacedSignature = {
      id,
      x: (pageViewport.width - defaultW) / 2,
      y: pageViewport.height * 0.7,
      width: defaultW,
      height: defaultH,
      src: dataUrl,
      bytes,
    };
    setPageSignatures((prev) => ({
      ...prev,
      [currentPage]: [...(prev[currentPage] ?? []), placed],
    }));
    setSelectedId(id);
    setShowSignaturePad(false);
    clearSigPad();
  };

  const handleSignatureUpload = async (files: File[]) => {
    const f = files[0];
    if (!f) return;
    if (!f.type.startsWith('image/')) {
      setError('Please use an image file (PNG or JPG).');
      return;
    }
    const buf = await f.arrayBuffer();
    const bytes = new Uint8Array(buf);
    const src = URL.createObjectURL(f);
    const id = `sig-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const img = new Image();
    img.src = src;
    await new Promise((resolve) => { img.onload = resolve; img.onerror = resolve; });
    const aspect = img.naturalWidth && img.naturalHeight ? img.naturalWidth / img.naturalHeight : 3;
    const defaultW = Math.min(pageViewport.width * 0.25, 200);
    const defaultH = defaultW / aspect;
    const placed: PlacedSignature = {
      id,
      x: (pageViewport.width - defaultW) / 2,
      y: pageViewport.height * 0.7,
      width: defaultW,
      height: defaultH,
      src,
      bytes,
    };
    setPageSignatures((prev) => ({
      ...prev,
      [currentPage]: [...(prev[currentPage] ?? []), placed],
    }));
    setSelectedId(id);
  };

  const copyToAllPages = (sig: PlacedSignature) => {
    setPageSignatures((prev) => {
      const updated = { ...prev };
      for (let p = 1; p <= pageCount; p++) {
        if (p === currentPage) continue;
        const newId = `sig-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
        updated[p] = [...(updated[p] ?? []), { ...sig, id: newId }];
      }
      return updated;
    });
  };

  const renderOverlays = useCallback(() => {
    const overlay = overlayRef.current;
    if (!overlay) return;
    overlay.querySelectorAll('[data-placed-sig]').forEach((el) => el.remove());
    const sigs = pageSignatures[currentPage] ?? [];
    for (const sig of sigs) {
      const wrapper = document.createElement('div');
      wrapper.setAttribute('data-placed-sig', sig.id);
      wrapper.className = cn(
        'absolute cursor-move border-2',
        selectedId === sig.id ? 'border-primary' : 'border-transparent',
      );
      wrapper.style.left = `${sig.x * zoom}px`;
      wrapper.style.top = `${sig.y * zoom}px`;
      wrapper.style.width = `${sig.width * zoom}px`;
      wrapper.style.height = `${sig.height * zoom}px`;
      const imgEl = document.createElement('img');
      imgEl.src = sig.src;
      imgEl.className = 'pointer-events-none h-full w-full object-contain';
      imgEl.draggable = false;
      wrapper.appendChild(imgEl);

      if (selectedId === sig.id) {
        const delBtn = document.createElement('div');
        delBtn.className = 'absolute -right-2 -top-2 flex h-6 w-6 cursor-pointer items-center justify-center rounded-full bg-destructive text-destructive-foreground shadow';
        delBtn.innerHTML = '×';
        delBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          setPageSignatures((prev) => ({
            ...prev,
            [currentPage]: (prev[currentPage] ?? []).filter((i) => i.id !== sig.id),
          }));
          setSelectedId(null);
        });
        wrapper.appendChild(delBtn);

        const resizeHandle = document.createElement('div');
        resizeHandle.className = 'absolute -bottom-1.5 -right-1.5 h-4 w-4 cursor-se-resize rounded-full border-2 border-primary bg-white shadow';
        resizeHandle.addEventListener('mousedown', (e) => {
          e.stopPropagation();
          dragStateRef.current = {
            dragging: false, startX: e.clientX, startY: e.clientY,
            id: sig.id, origX: sig.x, origY: sig.y, origW: sig.width, origH: sig.height, resizing: true,
          };
        });
        wrapper.appendChild(resizeHandle);

        const copyBtn = document.createElement('div');
        copyBtn.className = 'absolute -left-2 -top-2 flex h-6 w-6 cursor-pointer items-center justify-center rounded-full bg-primary text-primary-foreground shadow';
        copyBtn.innerHTML = '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>';
        copyBtn.title = 'Copy to all pages';
        copyBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          copyToAllPages(sig);
        });
        wrapper.appendChild(copyBtn);
      }

      wrapper.addEventListener('mousedown', (e) => {
        if (e.button !== 0) return;
        setSelectedId(sig.id);
        const overlayRect = overlay.getBoundingClientRect();
        dragStateRef.current = {
          dragging: true,
          startX: e.clientX - overlayRect.left,
          startY: e.clientY - overlayRect.top,
          id: sig.id,
          origX: sig.x,
          origY: sig.y,
          origW: sig.width,
          origH: sig.height,
          resizing: false,
        };
      });
      overlay.appendChild(wrapper);
    }
  }, [pageSignatures, currentPage, zoom, selectedId, pageCount]);

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
      setPageSignatures((prev) => ({
        ...prev,
        [currentPage]: (prev[currentPage] ?? []).map((s) => {
          if (s.id !== state.id) return s;
          if (state.resizing) {
            return { ...s, width: Math.max(30, state.origW + dx), height: Math.max(20, state.origH + dy) };
          }
          return { ...s, x: state.origX + dx, y: state.origY + dy };
        }),
      }));
    };
    const onUp = () => {
      dragStateRef.current = { dragging: false, startX: 0, startY: 0, id: '', origX: 0, origY: 0, origW: 0, origH: 0, resizing: false };
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
  }, [zoom, currentPage]);

  const totalSigs = Object.values(pageSignatures).reduce((s, sigs) => s + sigs.length, 0);

  const doExport = async () => {
    if (!fileBytes || totalSigs === 0) return;
    setExporting(true);
    setError(null);
    try {
      const pageSizes = await getPageSizes(fileBytes);
      const pdf = pdfDocRef.current!;
      let workingBytes = fileBytes;
      for (const [pageKey, sigs] of Object.entries(pageSignatures)) {
        const pageIndex = parseInt(pageKey, 10) - 1;
        const size = pageSizes[pageIndex];
        if (!size || sigs.length === 0) continue;
        const pdfPage = await pdf.getPage(parseInt(pageKey, 10));
        const baseVp = pdfPage.getViewport({ scale: 1 });
        const scaleX = size.width / baseVp.width;
        const scaleY = size.height / baseVp.height;
        for (const sig of sigs) {
          const placement: ImagePlacement = {
            x: sig.x * scaleX,
            y: size.height - (sig.y + sig.height) * scaleY,
            width: sig.width * scaleX,
            height: sig.height * scaleY,
          };
          workingBytes = await addImageToPages(workingBytes, sig.bytes, 'png', { [pageIndex]: placement });
        }
      }
      downloadBlob(workingBytes, 'docshield-signed.pdf');
      onResult({
        originalPages: pageCount,
        outputPages: pageCount,
        outputBytes: workingBytes.byteLength,
        action: 'Add signature',
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
                <PenTool className="h-4 w-4 shrink-0 text-primary" />
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
              <Button variant="outline" size="sm" onClick={() => setShowSignaturePad(true)} disabled={busy || rendering}>
                <PenTool className="mr-1.5 h-4 w-4" /> Draw signature
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const input = document.createElement('input');
                  input.type = 'file';
                  input.accept = 'image/png,image/jpeg';
                  input.onchange = () => {
                    if (input.files && input.files.length > 0) handleSignatureUpload(Array.from(input.files));
                  };
                  input.click();
                }}
                disabled={busy || rendering}
              >
                Upload signature image
              </Button>
              <span className="text-xs text-muted-foreground">
                {totalSigs} signature{totalSigs !== 1 ? 's' : ''} placed
              </span>
            </div>

            {showSignaturePad && (
              <div className="space-y-3 rounded-lg border border-border bg-secondary/20 p-4">
                <p className="text-sm font-medium text-foreground">Draw your signature</p>
                <canvas
                  ref={sigPadRef}
                  onMouseDown={sigPadDown}
                  onMouseMove={sigPadMove}
                  onMouseUp={sigPadUp}
                  onMouseLeave={sigPadUp}
                  onTouchStart={sigPadDown}
                  onTouchMove={sigPadMove}
                  onTouchEnd={sigPadUp}
                  className="w-full max-w-md rounded-lg border-2 border-border bg-white touch-none"
                  style={{ aspectRatio: '400/150' }}
                />
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={clearSigPad}>
                    <Eraser className="mr-1 h-4 w-4" /> Clear
                  </Button>
                  <Button size="sm" onClick={placeSignature}>
                    Place on page {currentPage}
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => setShowSignaturePad(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            )}

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
              Drag to move. Use the bottom-right handle to resize. Click the copy button to place on all pages.
            </p>

            <div className="flex flex-wrap items-center gap-3 border-t border-border pt-4">
              <Button onClick={doExport} disabled={exporting || totalSigs === 0}>
                {exporting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Download className="mr-2 h-4 w-4" />}
                Download signed PDF
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
