'use client';

import { useCallback, useRef, useState } from 'react';
import {
  Download,
  Loader2,
  X,
  ArrowLeftRight,
  CheckCircle2,
  Trash2,
  RotateCw,
  GripVertical,
} from 'lucide-react';
import { Dropzone } from '@/components/Dropzone';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { downloadBlob, formatBytes, readFileAsArrayBuffer } from '@/lib/pdf-helpers';
import { rotatePage, deleteAndRearrangePdf } from '@/lib/pdf-lib-utils';
import { generateThumbnailDataUrl, loadPdfDocument } from '@/lib/pdfjs';
import { fireConfetti } from '@/lib/confetti';

type Thumb = { page: number; src: string; rotated: boolean };

type Props = {
  onResult: (info: {
    originalPages: number;
    outputPages: number;
    outputBytes: number;
    action: string;
  }) => void;
};

export function OrganizeTool({ onResult }: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [fileBytes, setFileBytes] = useState<Uint8Array | null>(null);
  const [order, setOrder] = useState<number[]>([]);
  const [rotations, setRotations] = useState<Record<number, boolean>>({});
  const [thumbs, setThumbs] = useState<Record<number, string>>({});
  const [pageCount, setPageCount] = useState(0);
  const [busy, setBusy] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const dragFrom = useRef<number | null>(null);

  const reset = () => {
    setFile(null);
    setFileBytes(null);
    setOrder([]);
    setRotations({});
    setThumbs({});
    setPageCount(0);
    setError(null);
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
      const count = pdf.numPages;
      setPageCount(count);
      setOrder(Array.from({ length: count }, (_, i) => i + 1));
      const map: Record<number, string> = {};
      for (let i = 1; i <= count; i++) {
        map[i] = await generateThumbnailDataUrl(pdf, i, 0.4);
        setThumbs({ ...map });
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not open this PDF.');
    } finally {
      setBusy(false);
    }
  }, []);

  const move = (from: number, to: number) => {
    setOrder((prev) => {
      const next = [...prev];
      const [item] = next.splice(from, 1);
      next.splice(to, 0, item);
      return next;
    });
  };

  const doRotate = async (page: number) => {
    if (!fileBytes) return;
    setBusy(true);
    setError(null);
    try {
      const out = await rotatePage(fileBytes, page - 1, 90);
      setFileBytes(out);
      setRotations((prev) => ({ ...prev, [page]: !prev[page] }));
      const pdf = await loadPdfDocument(out);
      const src = await generateThumbnailDataUrl(pdf, page, 0.4);
      setThumbs((prev) => ({ ...prev, [page]: src }));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not rotate page.');
    } finally {
      setBusy(false);
    }
  };

  const doDelete = async (page: number) => {
    if (!fileBytes || order.length <= 1) return;
    setBusy(true);
    setError(null);
    try {
      const remaining = order.filter((p) => p !== page).map((p) => p - 1);
      const out = await deleteAndRearrangePdf(fileBytes, remaining);
      setFileBytes(out);
      setOrder((prev) => prev.filter((p) => p !== page));
      setPageCount((c) => c - 1);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not delete page.');
    } finally {
      setBusy(false);
    }
  };

  const doExport = async () => {
    if (!fileBytes || order.length === 0) return;
    setExporting(true);
    setError(null);
    try {
      const out = await deleteAndRearrangePdf(fileBytes, order.map((p) => p - 1));
      downloadBlob(out, 'docshield-organized.pdf');
      onResult({
        originalPages: pageCount,
        outputPages: order.length,
        outputBytes: out.byteLength,
        action: 'Organize pages',
      });
      await fireConfetti();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not build the organized PDF.');
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
                <ArrowLeftRight className="h-4 w-4 shrink-0 text-primary" />
                <span className="truncate">{file.name}</span>
              </CardTitle>
              <p className="mt-1 text-xs text-muted-foreground">
                {order.length} pages · {formatBytes(file.size)}
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

            {busy && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" /> Working…
              </div>
            )}

            <p className="text-sm text-muted-foreground">
              Drag pages to reorder. Hover a page for rotate and delete buttons. The download reflects
              exactly what you see below.
            </p>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {order.map((page, idx) => (
                <div
                  key={`${page}-${idx}`}
                  draggable
                  onDragStart={(e) => {
                    dragFrom.current = idx;
                    e.dataTransfer.effectAllowed = 'move';
                  }}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    if (dragFrom.current !== null && dragFrom.current !== idx) move(dragFrom.current, idx);
                    dragFrom.current = null;
                  }}
                  className={cn(
                    'group relative cursor-grab overflow-hidden rounded-lg border-2 border-border transition-all hover:border-primary/50 active:cursor-grabbing',
                  )}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={thumbs[page]}
                    alt={`Page ${page}`}
                    className={cn(
                      'aspect-[3/4] w-full bg-white object-contain',
                      rotations[page] && 'rotate-90',
                    )}
                  />
                  <span className="pointer-events-none absolute left-1 top-1 flex items-center gap-1 rounded bg-white/85 px-1.5 py-0.5 text-[10px] font-medium text-foreground">
                    <GripVertical className="h-3 w-3" /> {idx + 1}
                  </span>
                  <div className="pointer-events-auto absolute bottom-1 right-1 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                    <button
                      title="Rotate 90°"
                      onClick={() => doRotate(page)}
                      className="flex h-7 w-7 items-center justify-center rounded bg-white/90 text-foreground shadow hover:text-primary"
                    >
                      <RotateCw className="h-3.5 w-3.5" />
                    </button>
                    <button
                      title="Delete this page"
                      onClick={() => doDelete(page)}
                      className="flex h-7 w-7 items-center justify-center rounded bg-white/90 text-foreground shadow hover:text-destructive"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-3 border-t border-border pt-4">
              <Button onClick={doExport} disabled={exporting || busy || order.length === 0}>
                {exporting ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                )}
                Download organized PDF
              </Button>
              <p className="text-xs text-muted-foreground">
                Everything runs in your browser — your file is never uploaded.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
