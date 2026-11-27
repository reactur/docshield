'use client';

import { useCallback, useState } from 'react';
import { Download, Loader2, X, Image as ImageIcon, CheckCircle2 } from 'lucide-react';
import { Dropzone } from '@/components/Dropzone';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { formatBytes, readFileAsArrayBuffer, triggerDownload } from '@/lib/pdf-helpers';
import { fireConfetti } from '@/lib/confetti';
import { loadPdfDocument, renderPageToCanvas } from '@/lib/pdfjs';
import JSZip from 'jszip';

type Props = {
  onResult: (info: {
    originalPages: number;
    outputPages: number;
    outputBytes: number;
    action: string;
  }) => void;
};

export function PdfToJpgTool({ onResult }: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [fileBytes, setFileBytes] = useState<Uint8Array | null>(null);
  const [thumbs, setThumbs] = useState<{ page: number; src: string }[]>([]);
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [pageCount, setPageCount] = useState(0);
  const [busy, setBusy] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState<string | null>(null);

  const reset = () => {
    setFile(null);
    setFileBytes(null);
    setThumbs([]);
    setSelected(new Set());
    setPageCount(0);
    setError(null);
    setDone(null);
  };

  const handleFile = useCallback(async (files: File[]) => {
    setError(null);
    setDone(null);
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
      setPageCount(pdf.numPages);
      setSelected(new Set(Array.from({ length: pdf.numPages }, (_, i) => i + 1)));
      const generated: { page: number; src: string }[] = [];
      for (let i = 1; i <= pdf.numPages; i++) {
        const src = await renderPageToJpegDataUrl(pdf, i);
        generated.push({ page: i, src });
        setThumbs([...generated]);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not open this PDF.');
    } finally {
      setBusy(false);
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

  const canvasToBlob = (canvas: HTMLCanvasElement, quality: number): Promise<Blob | null> =>
    new Promise((resolve) => canvas.toBlob((b) => resolve(b), 'image/jpeg', quality));

  const doExport = async (mode: 'zip' | 'single') => {
    if (!fileBytes) return;
    setExporting(true);
    setError(null);
    try {
      const pages = Array.from(selected).sort((a, b) => a - b);
      const pdf = await loadPdfDocument(fileBytes);
      const blobs: { page: number; blob: Blob }[] = [];
      for (const p of pages) {
        const canvas = document.createElement('canvas');
        await renderPageToCanvas(pdf, p, canvas, 2);
        const blob = await canvasToBlob(canvas, 0.92);
        if (blob) blobs.push({ page: p, blob });
      }
      if (blobs.length === 0) throw new Error('Nothing to export.');

      if (mode === 'single' && blobs.length === 1) {
        triggerDownload(URL.createObjectURL(blobs[0].blob), `page-${blobs[0].page}.jpg`);
      } else {
        const zip = new JSZip();
        for (const b of blobs) zip.file(`page-${b.page}.jpg`, b.blob);
        const zipBlob = await zip.generateAsync({ type: 'blob' });
        triggerDownload(URL.createObjectURL(zipBlob), 'docshield-pdf-to-jpg.zip');
      }
      setDone(`${blobs.length} image${blobs.length !== 1 ? 's' : ''} exported`);
      onResult({
        originalPages: pageCount,
        outputPages: blobs.length,
        outputBytes: blobs.reduce((sum, b) => sum + b.blob.size, 0),
        action: 'Convert to JPG',
      });
      await fireConfetti();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Conversion failed.');
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

            {busy && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" /> Rendering pages…
              </div>
            )}

            {done && (
              <div className="flex items-center gap-2 rounded-md border border-primary/30 bg-primary/5 px-3 py-2 text-sm text-foreground">
                <CheckCircle2 className="h-4 w-4 text-success" />
                {done}. Your download has started.
              </div>
            )}

            <div className="grid max-h-[420px] grid-cols-2 gap-3 overflow-y-auto scrollbar-thin pr-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {thumbs.map((t) => {
                const isSel = selected.has(t.page);
                return (
                  <button
                    key={`p${t.page}`}
                    onClick={() => togglePage(t.page)}
                    aria-pressed={isSel}
                    className={cn(
                      'group relative overflow-hidden rounded-lg border-2 transition-all',
                      isSel ? 'border-primary ring-2 ring-primary/20' : 'border-border hover:border-primary/50',
                    )}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={t.src}
                      alt={`Page ${t.page}`}
                      className={cn(
                        'aspect-[3/4] w-full bg-white object-contain transition-opacity',
                        isSel && 'opacity-50',
                      )}
                    />
                    {isSel && (
                      <span className="pointer-events-none absolute left-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground shadow">
                        <CheckCircle2 className="h-4 w-4" />
                      </span>
                    )}
                    <span className="absolute bottom-1 left-1 rounded bg-white/80 px-1.5 py-0.5 text-[10px] font-medium text-foreground">
                      {t.page}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="flex flex-wrap items-center gap-3 border-t border-border pt-4">
              <Button onClick={() => doExport('zip')} disabled={exporting || busy || selected.size === 0}>
                {exporting ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Download className="mr-2 h-4 w-4" />
                )}
                Download {selected.size > 0 ? `${selected.size} ` : ''}image{selected.size !== 1 ? 's' : ''} (ZIP)
              </Button>
              {selected.size === 1 && (
                <Button variant="secondary" onClick={() => doExport('single')} disabled={exporting || busy}>
                  <Download className="mr-2 h-4 w-4" /> Download single JPG
                </Button>
              )}
              <Button
                variant="ghost"
                onClick={() => setSelected(new Set(Array.from({ length: pageCount }, (_, i) => i + 1)))}
                disabled={busy}
              >
                Select all
              </Button>
              <Button variant="ghost" onClick={() => setSelected(new Set())} disabled={selected.size === 0 || busy}>
                Clear
              </Button>
              <p className="text-xs text-muted-foreground">
                Conversion runs entirely in your browser — your file is never uploaded.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

async function renderPageToJpegDataUrl(pdf: Awaited<ReturnType<typeof loadPdfDocument>>, page: number): Promise<string> {
  const canvas = document.createElement('canvas');
  await renderPageToCanvas(pdf, page, canvas, 0.4);
  return canvas.toDataURL('image/jpeg', 0.6);
}
