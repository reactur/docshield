'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import {
  Download,
  FileArchive,
  Scissors,
  Trash2,
  RotateCw,
  Loader2,
  CheckCircle2,
  X,
} from 'lucide-react';
import { Dropzone } from '@/components/Dropzone';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { downloadBlob, formatBytes, parseRanges, readFileAsArrayBuffer, triggerDownload } from '@/lib/pdf-helpers';
import { extractSelectedPages, deleteAndRearrangePdf, rotatePage, splitPdfPages } from '@/lib/pdf-lib-utils';
import { generateThumbnailDataUrl, loadPdfDocument } from '@/lib/pdfjs';
import { fireConfetti } from '@/lib/confetti';
import JSZip from 'jszip';

type Thumb = { page: number; src: string };

type Props = {
  onResult: (info: { originalPages: number; outputPages: number; outputBytes: number; action: string }) => void;
};

export function SplitTool({ onResult }: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [fileBytes, setFileBytes] = useState<ArrayBuffer | null>(null);
  const [thumbs, setThumbs] = useState<Thumb[]>([]);
  const [pageCount, setPageCount] = useState(0);
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [rangeInput, setRangeInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [rendering, setRendering] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const pdfDocRef = useRef<Awaited<ReturnType<typeof loadPdfDocument>> | null>(null);

  const reset = () => {
    setFile(null);
    setFileBytes(null);
    setThumbs([]);
    setPageCount(0);
    setSelected(new Set());
    setRangeInput('');
    setError(null);
    pdfDocRef.current = null;
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
      const count = pdf.numPages;
      setPageCount(count);
      setRendering(true);
      const generated: Thumb[] = [];
      for (let i = 1; i <= count; i++) {
        const src = await generateThumbnailDataUrl(pdf, i, 0.4);
        generated.push({ page: i, src });
        setThumbs([...generated]);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not open this PDF.');
    } finally {
      setBusy(false);
      setRendering(false);
    }
  }, []);

  const togglePage = (p: number) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(p)) next.delete(p);
      else next.add(p);
      return next;
    });
  };

  const applyRange = () => {
    const pages = parseRanges(rangeInput, pageCount);
    setSelected(new Set(pages));
  };

  const clearSelection = () => {
    setSelected(new Set());
    setRangeInput('');
  };

  const doExtract = async () => {
    if (!fileBytes || selected.size === 0) return;
    setLoading(true);
    setError(null);
    try {
      const pages = Array.from(selected).sort((a, b) => a - b);
      const out = await extractSelectedPages(fileBytes, pages);
      downloadBlob(out, `docshield-extracted-${pages.length}-pages.pdf`);
      onResult({
        originalPages: pageCount,
        outputPages: pages.length,
        outputBytes: out.byteLength,
        action: 'Extract selected pages',
      });
      await fireConfetti();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Extraction failed.');
    } finally {
      setLoading(false);
    }
  };

  const doSplitAll = async () => {
    if (!fileBytes) return;
    setLoading(true);
    setError(null);
    try {
      const ranges = Array.from({ length: pageCount }, (_, i) => [i + 1]);
      // Build each single-page PDF and zip them.
      const zip = new JSZip();
      const results = await splitPdfPages(fileBytes, ranges);
      for (const r of results) {
        zip.file(r.name, r.bytes);
      }
      const blob = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(blob);
      triggerDownload(url, 'docshield-split-pages.zip');
      setTimeout(() => URL.revokeObjectURL(url), 4000);
      onResult({
        originalPages: pageCount,
        outputPages: pageCount,
        outputBytes: blob.size,
        action: 'Split into individual pages (ZIP)',
      });
      await fireConfetti();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Split failed.');
    } finally {
      setLoading(false);
    }
  };

  const doDeletePages = async (pagesToDelete: number[]) => {
    if (!fileBytes) return;
    setBusy(true);
    setError(null);
    try {
      const remaining = Array.from({ length: pageCount }, (_, i) => i).filter(
        (i) => !pagesToDelete.includes(i),
      );
      const out = await deleteAndRearrangePdf(fileBytes, remaining);
      // Reload preview from new bytes.
      const newBuf = out.buffer.slice(0) as ArrayBuffer;
      setFileBytes(newBuf);
      setSelected(new Set());
      setRangeInput('');
      const pdf = await loadPdfDocument(newBuf.slice(0));
      pdfDocRef.current = pdf;
      const count = pdf.numPages;
      setPageCount(count);
      setThumbs([]);
      const generated: Thumb[] = [];
      for (let i = 1; i <= count; i++) {
        const src = await generateThumbnailDataUrl(pdf, i, 0.4);
        generated.push({ page: i, src });
        setThumbs([...generated]);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Delete failed.');
    } finally {
      setBusy(false);
    }
  };

  const doRotate = async (pageIndex: number) => {
    if (!fileBytes) return;
    setBusy(true);
    setError(null);
    try {
      const out = await rotatePage(fileBytes, pageIndex, 90);
      const newBuf = out.buffer.slice(0) as ArrayBuffer;
      setFileBytes(newBuf);
      const pdf = await loadPdfDocument(newBuf.slice(0));
      pdfDocRef.current = pdf;
      // Re-render only the rotated thumbnail.
      const src = await generateThumbnailDataUrl(pdf, pageIndex + 1, 0.4);
      setThumbs((prev) => prev.map((t) => (t.page === pageIndex + 1 ? { ...t, src } : t)));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Rotate failed.');
    } finally {
      setBusy(false);
    }
  };

  const selectedCount = selected.size;

  return (
    <div className="space-y-5">
      {!file ? (
        <Dropzone onFiles={handleFile} hint="100% client-side — your file never leaves this device" />
      ) : (
        <Card className="border-border/60">
          <CardHeader className="flex flex-row items-center justify-between gap-3 space-y-0">
            <div className="min-w-0">
              <CardTitle className="flex items-center gap-2 truncate text-base">
                <FileArchive className="h-4 w-4 shrink-0 text-primary" />
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
                {rendering ? 'Rendering page previews…' : 'Processing…'}
              </div>
            )}

            <div className="flex flex-wrap items-end gap-3">
              <div className="flex-1 min-w-[200px]">
                <label className="mb-1 block text-xs font-medium text-muted-foreground">
                  Page ranges (e.g. 1-3, 5, 8-12)
                </label>
                <Input
                  value={rangeInput}
                  onChange={(e) => setRangeInput(e.target.value)}
                  placeholder="1-3, 5, 8-12"
                  className="font-mono text-sm"
                />
              </div>
              <Button variant="secondary" size="sm" onClick={applyRange}>
                Select ranges
              </Button>
              <Button variant="ghost" size="sm" onClick={clearSelection} disabled={selectedCount === 0}>
                Clear
              </Button>
            </div>

            <div className="grid max-h-[420px] grid-cols-2 gap-3 overflow-y-auto scrollbar-thin pr-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {thumbs.map((t) => {
                const isSel = selected.has(t.page);
                return (
                  <div
                    key={t.page}
                    className={cn(
                      'group relative overflow-hidden rounded-lg border-2 transition-all',
                      isSel
                        ? 'border-primary ring-2 ring-primary/30'
                        : 'border-border hover:border-primary/50',
                    )}
                  >
                    <button
                      onClick={() => togglePage(t.page)}
                      className="block w-full"
                      aria-pressed={isSel}
                    >
                      {t.src ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={t.src}
                          alt={`Page ${t.page}`}
                          className="aspect-[3/4] w-full object-contain bg-background"
                        />
                      ) : (
                        <div className="aspect-[3/4] w-full animate-shimmer rounded" />
                      )}
                    </button>
                    <div className="pointer-events-none absolute left-1 top-1 flex items-center gap-1">
                      {isSel && (
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground">
                          <CheckCircle2 className="h-3.5 w-3.5" />
                        </span>
                      )}
                    </div>
                    <div className="pointer-events-auto absolute bottom-1 right-1 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                      <button
                        title="Rotate 90°"
                        onClick={() => doRotate(t.page - 1)}
                        className="flex h-7 w-7 items-center justify-center rounded bg-background/90 text-foreground shadow hover:text-primary"
                      >
                        <RotateCw className="h-3.5 w-3.5" />
                      </button>
                      <button
                        title="Delete page"
                        onClick={() => doDeletePages([t.page - 1])}
                        className="flex h-7 w-7 items-center justify-center rounded bg-background/90 text-foreground shadow hover:text-destructive"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    <span className="absolute bottom-1 left-1 rounded bg-background/80 px-1.5 py-0.5 text-[10px] font-medium text-foreground">
                      Page {t.page}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="flex flex-wrap items-center gap-2 border-t border-border pt-4">
              <Badge variant="secondary" className="gap-1">
                <Scissors className="h-3 w-3" /> {selectedCount} selected
              </Badge>
              <div className="ml-auto flex flex-wrap gap-2">
                <Button onClick={doExtract} disabled={loading || selectedCount === 0}>
                  {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Download className="mr-2 h-4 w-4" />}
                  Extract selected ({selectedCount})
                </Button>
                <Button variant="secondary" onClick={doSplitAll} disabled={loading}>
                  {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <FileArchive className="mr-2 h-4 w-4" />}
                  Split all into ZIP
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}