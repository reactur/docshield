'use client';

import { useCallback, useState } from 'react';
import { Download, Loader2, X, FileDown, CheckCircle2 } from 'lucide-react';
import { Dropzone } from '@/components/Dropzone';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { downloadBlob, formatBytes, readFileAsArrayBuffer } from '@/lib/pdf-helpers';
import { compressPdf } from '@/lib/pdf-lib-utils';
import { fireConfetti } from '@/lib/confetti';

type Level = 'low' | 'medium' | 'high';

const LEVELS: { value: Level; label: string; blurb: string }[] = [
  { value: 'low', label: 'Less', blurb: 'Keeps quality high, saves some space' },
  { value: 'medium', label: 'Recommended', blurb: 'Good balance of quality and size' },
  { value: 'high', label: 'Extreme', blurb: 'Smallest file, lower fidelity' },
];

type Props = {
  onResult: (info: {
    originalPages: number;
    outputPages: number;
    outputBytes: number;
    action: string;
  }) => void;
};

export function CompressTool({ onResult }: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [fileBytes, setFileBytes] = useState<Uint8Array | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [busy, setBusy] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [level, setLevel] = useState<Level>('medium');
  const [done, setDone] = useState<{ from: number; to: number } | null>(null);

  const reset = () => {
    setFile(null);
    setFileBytes(null);
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
      setFileBytes(new Uint8Array(buf));
      const { loadPdfDocument } = await import('@/lib/pdfjs');
      const pdf = await loadPdfDocument(new Uint8Array(buf));
      setPageCount(pdf.numPages);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not open this PDF.');
    } finally {
      setBusy(false);
    }
  }, []);

  const doCompress = async () => {
    if (!fileBytes) return;
    setExporting(true);
    setError(null);
    try {
      const out = await compressPdf(fileBytes, level);
      downloadBlob(out, 'docshield-compressed.pdf');
      setDone({ from: fileBytes.byteLength, to: out.byteLength });
      onResult({
        originalPages: pageCount,
        outputPages: pageCount,
        outputBytes: out.byteLength,
        action: 'Compress PDF',
      });
      await fireConfetti();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Compression failed.');
    } finally {
      setExporting(false);
    }
  };

  const savedPercent =
    done && done.from > 0 ? Math.max(0, Math.round((1 - done.to / done.from) * 100)) : 0;

  return (
    <div className="space-y-5">
      {!file ? (
        <Dropzone onFiles={handleFile} hint="Your PDF stays on your device. Nothing is uploaded." />
      ) : (
        <Card className="border-border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between gap-3 space-y-0">
            <div className="min-w-0">
              <CardTitle className="flex items-center gap-2 truncate text-base">
                <FileDown className="h-4 w-4 shrink-0 text-primary" />
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
                <Loader2 className="h-4 w-4 animate-spin" /> Loading PDF…
              </div>
            )}

            {done && (
              <div className="flex items-center gap-2 rounded-md border border-primary/30 bg-primary/5 px-3 py-2 text-sm text-foreground">
                <CheckCircle2 className="h-4 w-4 text-success" />
                Saved {formatBytes(done.from - done.to)} ({savedPercent}% smaller). Your download has started.
              </div>
            )}

            <div className="space-y-1.5">
              <p className="text-sm font-medium text-foreground">Compression level</p>
              <div className="grid gap-2 sm:grid-cols-3">
                {LEVELS.map((l) => (
                  <button
                    key={l.value}
                    onClick={() => setLevel(l.value)}
                    className={cn(
                      'rounded-lg border-2 px-4 py-3 text-left transition-colors',
                      level === l.value
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50',
                    )}
                  >
                    <span className="block text-sm font-semibold text-foreground">{l.label}</span>
                    <span className="mt-0.5 block text-xs text-muted-foreground">{l.blurb}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 border-t border-border pt-4">
              <Button onClick={doCompress} disabled={exporting || busy}>
                {exporting ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Download className="mr-2 h-4 w-4" />
                )}
                {exporting ? 'Compressing…' : 'Compress and download'}
              </Button>
              <p className="text-xs text-muted-foreground">
                Compression runs entirely in your browser — your file is never uploaded.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
