'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import {
  Download, Loader2, X, Type, ChevronLeft, ChevronRight,
  ZoomIn, ZoomOut, Trash2,
} from 'lucide-react';
import { Dropzone } from '@/components/Dropzone';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { downloadBlob, formatBytes, readFileAsArrayBuffer } from '@/lib/pdf-helpers';
import { addTextToPages, getPageSizes, type TextPlacement } from '@/lib/pdf-lib-utils';
import { loadPdfDocument, renderPageToCanvas } from '@/lib/pdfjs';
import { fireConfetti } from '@/lib/confetti';

type PlacedText = {
  id: string;
  x: number;
  y: number;
  text: string;
  size: number;
  color: { r: number; g: number; b: number };
};

const PRESET_COLORS = [
  { label: 'Black', value: { r: 0, g: 0, b: 0 } },
  { label: 'Red', value: { r: 0.8, g: 0, b: 0 } },
  { label: 'Blue', value: { r: 0, g: 0, b: 0.6 } },
  { label: 'White', value: { r: 1, g: 1, b: 1 } },
];

type Props = {
  onResult: (info: { originalPages: number; outputPages: number; outputBytes: number; action: string }) => void;
};

export function AddTextTool({ onResult }: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [fileBytes, setFileBytes] = useState<Uint8Array | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [zoom, setZoom] = useState(1.2);
  const [busy, setBusy] = useState(false);
  const [rendering, setRendering] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pageTexts, setPageTexts] = useState<Record<number, PlacedText[]>>({});
  const [pageViewport, setPageViewport] = useState({ width: 0, height: 0 });
  const [docVersion, setDocVersion] = useState(0);
  const [textInput, setTextInput] = useState('');
  const [fontSize, setFontSize] = useState(16);
  const [textColor, setTextColor] = useState(PRESET_COLORS[0].value);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const pdfDocRef = useRef<Awaited<ReturnType<typeof loadPdfDocument>> | null>(null);
  const dragStateRef = useRef<{
    dragging: boolean; startX: number; startY: number; id: string; origX: number; origY: number;
  }>({ dragging: false, startX: 0, startY: 0, id: '', origX: 0, origY: 0 });

  const reset = () => {
    setFile(null); setFileBytes(null); setPageCount(0); setCurrentPage(1);
    setPageTexts({}); setPageViewport({ width: 0, height: 0 });
    setError(null); setSelectedId(null); pdfDocRef.current = null;
    setDocVersion((v) => v + 1);
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
      setCurrentPage(1); setPageTexts({});
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

  const addText = () => {
    if (!textInput.trim()) return;
    const id = `txt-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const placed: PlacedText = {
      id,
      x: pageViewport.width * 0.1,
      y: pageViewport.height * 0.5,
      text: textInput.trim(),
      size: fontSize,
      color: textColor,
    };
    setPageTexts((prev) => ({
      ...prev,
      [currentPage]: [...(prev[currentPage] ?? []), placed],
    }));
    setSelectedId(id);
  };

  const copyToAllPages = (txt: PlacedText) => {
    setPageTexts((prev) => {
      const updated = { ...prev };
      for (let p = 1; p <= pageCount; p++) {
        if (p === currentPage) continue;
        const newId = `txt-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
        updated[p] = [...(updated[p] ?? []), { ...txt, id: newId }];
      }
      return updated;
    });
  };

  const renderOverlays = useCallback(() => {
    const overlay = overlayRef.current;
    if (!overlay) return;
    overlay.querySelectorAll('[data-placed-text]').forEach((el) => el.remove());
    const texts = pageTexts[currentPage] ?? [];
    for (const t of texts) {
      const el = document.createElement('div');
      el.setAttribute('data-placed-text', t.id);
      el.className = cn(
        'absolute cursor-move select-none whitespace-nowrap border-2 px-0.5',
        selectedId === t.id ? 'border-primary bg-primary/5' : 'border-transparent',
      );
      el.style.left = `${t.x * zoom}px`;
      el.style.top = `${t.y * zoom}px`;
      el.style.fontSize = `${t.size * zoom}px`;
      el.style.color = `rgb(${Math.round(t.color.r * 255)}, ${Math.round(t.color.g * 255)}, ${Math.round(t.color.b * 255)})`;
      el.style.fontFamily = 'Helvetica, Arial, sans-serif';
      el.textContent = t.text;

      if (selectedId === t.id) {
        const delBtn = document.createElement('div');
        delBtn.className = 'absolute -right-2 -top-2 flex h-6 w-6 cursor-pointer items-center justify-center rounded-full bg-destructive text-destructive-foreground shadow';
        delBtn.innerHTML = '×';
        delBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          setPageTexts((prev) => ({
            ...prev,
            [currentPage]: (prev[currentPage] ?? []).filter((i) => i.id !== t.id),
          }));
          setSelectedId(null);
        });
        el.appendChild(delBtn);

        const copyBtn = document.createElement('div');
        copyBtn.className = 'absolute -left-2 -top-2 flex h-6 w-6 cursor-pointer items-center justify-center rounded-full bg-primary text-primary-foreground shadow';
        copyBtn.innerHTML = '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>';
        copyBtn.title = 'Copy to all pages';
        copyBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          copyToAllPages(t);
        });
        el.appendChild(copyBtn);
      }

      el.addEventListener('mousedown', (e) => {
        if (e.button !== 0) return;
        setSelectedId(t.id);
        const rect = overlay.getBoundingClientRect();
        dragStateRef.current = {
          dragging: true,
          startX: e.clientX - rect.left,
          startY: e.clientY - rect.top,
          id: t.id,
          origX: t.x,
          origY: t.y,
        };
      });
      overlay.appendChild(el);
    }
  }, [pageTexts, currentPage, zoom, selectedId, pageCount]);

  useEffect(() => { renderOverlays(); }, [renderOverlays]);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const state = dragStateRef.current;
      const overlay = overlayRef.current;
      if (!overlay || !state.dragging) return;
      const rect = overlay.getBoundingClientRect();
      const cx = e.clientX - rect.left;
      const cy = e.clientY - rect.top;
      const dx = (cx - state.startX) / zoom;
      const dy = (cy - state.startY) / zoom;
      setPageTexts((prev) => ({
        ...prev,
        [currentPage]: (prev[currentPage] ?? []).map((t) =>
          t.id === state.id ? { ...t, x: state.origX + dx, y: state.origY + dy } : t,
        ),
      }));
    };
    const onUp = () => {
      dragStateRef.current = { dragging: false, startX: 0, startY: 0, id: '', origX: 0, origY: 0 };
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
  }, [zoom, currentPage]);

  const totalTexts = Object.values(pageTexts).reduce((s, ts) => s + ts.length, 0);

  const doExport = async () => {
    if (!fileBytes || totalTexts === 0) return;
    setExporting(true);
    setError(null);
    try {
      const pageSizes = await getPageSizes(fileBytes);
      const pdf = pdfDocRef.current!;
      const placements: Record<number, TextPlacement[]> = {};
      for (const [pageKey, texts] of Object.entries(pageTexts)) {
        const pageIndex = parseInt(pageKey, 10) - 1;
        const size = pageSizes[pageIndex];
        if (!size || texts.length === 0) continue;
        const pdfPage = await pdf.getPage(parseInt(pageKey, 10));
        const baseVp = pdfPage.getViewport({ scale: 1 });
        const scaleX = size.width / baseVp.width;
        const scaleY = size.height / baseVp.height;
        placements[pageIndex] = texts.map((t) => ({
          x: t.x * scaleX,
          y: size.height - (t.y + t.size) * scaleY,
          text: t.text,
          size: t.size * scaleX,
          color: t.color,
        }));
      }
      const out = await addTextToPages(fileBytes, placements);
      downloadBlob(out, 'docshield-text-added.pdf');
      onResult({
        originalPages: pageCount,
        outputPages: pageCount,
        outputBytes: out.byteLength,
        action: 'Add text',
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
                <Type className="h-4 w-4 shrink-0 text-primary" />
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

            <div className="grid gap-3 rounded-lg border border-border bg-secondary/20 p-4 sm:grid-cols-[1fr_auto_auto_auto]">
              <Input
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                placeholder="Type your text here"
                className="text-sm"
                onKeyDown={(e) => { if (e.key === 'Enter') addText(); }}
              />
              <Input
                type="number"
                value={fontSize}
                onChange={(e) => setFontSize(Math.max(4, Math.min(72, parseInt(e.target.value, 10) || 16)))}
                className="w-20 text-sm"
                min={4}
                max={72}
              />
              <div className="flex items-center gap-1">
                {PRESET_COLORS.map((c) => (
                  <button
                    key={c.label}
                    title={c.label}
                    onClick={() => setTextColor(c.value)}
                    className={cn(
                      'h-7 w-7 rounded-full border-2',
                      textColor === c.value ? 'border-primary' : 'border-border',
                    )}
                    style={{ background: `rgb(${Math.round(c.value.r * 255)}, ${Math.round(c.value.g * 255)}, ${Math.round(c.value.b * 255)})` }}
                  />
                ))}
              </div>
              <Button size="sm" onClick={addText} disabled={!textInput.trim() || busy || rendering}>
                <Type className="mr-1 h-4 w-4" /> Add to page {currentPage}
              </Button>
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
              Drag text to move it. Click the copy button (top-left) to place the same text on all pages.
            </p>

            <div className="flex flex-wrap items-center gap-3 border-t border-border pt-4">
              <Button onClick={doExport} disabled={exporting || totalTexts === 0}>
                {exporting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Download className="mr-2 h-4 w-4" />}
                Download PDF with text
              </Button>
              <span className="text-xs text-muted-foreground">
                {totalTexts} text{totalTexts !== 1 ? 's' : ''} placed
              </span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
