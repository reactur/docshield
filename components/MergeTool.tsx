'use client';

import { useState } from 'react';
import {
  Combine,
  Download,
  Loader2,
  Trash2,
  ChevronUp,
  ChevronDown,
  FileText,
  X,
} from 'lucide-react';
import { Dropzone } from '@/components/Dropzone';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { downloadBlob, formatBytes, readFileAsArrayBuffer } from '@/lib/pdf-helpers';
import { mergePdfs } from '@/lib/pdf-lib-utils';
import { loadPdfDocument } from '@/lib/pdfjs';
import { fireConfetti } from '@/lib/confetti';

type MergeFile = {
  id: string;
  name: string;
  size: number;
  pages: number;
  bytes: ArrayBuffer;
};

type Props = {
  onResult: (info: { originalPages: number; outputPages: number; outputBytes: number; action: string }) => void;
  onMergeComplete?: (info: { originalPages: number; outputPages: number; outputBytes: number }) => void;
};

export function MergeTool({ onResult, onMergeComplete }: Props) {
  const [files, setFiles] = useState<MergeFile[]>([]);
  const [busy, setBusy] = useState(false);
  const [merging, setMerging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragIndex, setDragIndex] = useState<number | null>(null);

  const handleFiles = async (incoming: File[]) => {
    setError(null);
    setBusy(true);
    try {
      const additions: MergeFile[] = [];
      for (const f of incoming) {
        const buf = await readFileAsArrayBuffer(f);
        let pages = 0;
        try {
          const pdf = await loadPdfDocument(buf.slice(0));
          pages = pdf.numPages;
        } catch {
          pages = 0;
        }
        additions.push({
          id: `${f.name}-${f.size}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
          name: f.name,
          size: f.size,
          pages,
          bytes: buf,
        });
      }
      setFiles((prev) => [...prev, ...additions]);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not read files.');
    } finally {
      setBusy(false);
    }
  };

  const move = (index: number, dir: -1 | 1) => {
    setFiles((prev) => {
      const next = [...prev];
      const target = index + dir;
      if (target < 0 || target >= next.length) return prev;
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  };

  const remove = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const clearAll = () => setFiles([]);

  const onDragStart = (i: number) => setDragIndex(i);
  const onDrop = (i: number) => {
    if (dragIndex === null || dragIndex === i) {
      setDragIndex(null);
      return;
    }
    setFiles((prev) => {
      const next = [...prev];
      const [moved] = next.splice(dragIndex, 1);
      next.splice(i, 0, moved);
      return next;
    });
    setDragIndex(null);
  };

  const doMerge = async () => {
    if (files.length < 2) return;
    setMerging(true);
    setError(null);
    try {
      const out = await mergePdfs(files.map((f) => ({ name: f.name, bytes: f.bytes })));
      downloadBlob(out, 'docshield-merged.pdf');
      const totalPages = files.reduce((s, f) => s + f.pages, 0);
      onResult({
        originalPages: totalPages,
        outputPages: totalPages,
        outputBytes: out.byteLength,
        action: 'Merge PDFs',
      });
      onMergeComplete?.({
        originalPages: totalPages,
        outputPages: totalPages,
        outputBytes: out.byteLength,
      });
      await fireConfetti();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Merge failed.');
    } finally {
      setMerging(false);
    }
  };

  const totalPages = files.reduce((s, f) => s + f.pages, 0);
  const totalSize = files.reduce((s, f) => s + f.size, 0);

  return (
    <div className="space-y-5">
      <Dropzone
        multiple
        onFiles={handleFiles}
        label="Drop multiple PDFs here or click to add"
        hint="Reorder them below, then merge into one file"
      />

      {error && (
        <div className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {error}
        </div>
      )}

      {files.length > 0 && (
        <Card className="border-border/60">
          <CardHeader className="flex flex-row items-center justify-between gap-3 space-y-0">
            <CardTitle className="text-base">
              <Combine className="mr-2 inline h-4 w-4 text-primary" />
              {files.length} document{files.length !== 1 ? 's' : ''} queued
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={clearAll}>
              <X className="mr-1 h-4 w-4" /> Clear all
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {busy && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" /> Reading files…
              </div>
            )}
            <ul className="space-y-2">
              {files.map((f, i) => (
                <li
                  key={f.id}
                  draggable
                  onDragStart={() => onDragStart(i)}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={() => onDrop(i)}
                  className={cn(
                    'flex items-center gap-3 rounded-lg border border-border bg-secondary/20 px-3 py-2.5 transition-colors hover:border-primary/40',
                    dragIndex === i && 'opacity-50',
                  )}
                >
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-primary/15 text-xs font-semibold text-primary">
                    {i + 1}
                  </span>
                  <FileText className="h-5 w-5 shrink-0 text-muted-foreground" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{f.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {f.pages > 0 ? `${f.pages} pages · ` : ''}
                      {formatBytes(f.size)}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-1">
                    <button
                      disabled={i === 0}
                      onClick={() => move(i, -1)}
                      className="rounded p-1.5 text-muted-foreground hover:bg-secondary hover:text-foreground disabled:opacity-30"
                      aria-label="Move up"
                    >
                      <ChevronUp className="h-4 w-4" />
                    </button>
                    <button
                      disabled={i === files.length - 1}
                      onClick={() => move(i, 1)}
                      className="rounded p-1.5 text-muted-foreground hover:bg-secondary hover:text-foreground disabled:opacity-30"
                      aria-label="Move down"
                    >
                      <ChevronDown className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => remove(f.id)}
                      className="rounded p-1.5 text-muted-foreground hover:bg-destructive/15 hover:text-destructive"
                      aria-label="Remove"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </li>
              ))}
            </ul>

            <div className="flex flex-wrap items-center gap-2 border-t border-border pt-4">
              <Badge variant="secondary">{totalPages} total pages</Badge>
              <Badge variant="secondary">{formatBytes(totalSize)}</Badge>
              <Button
                onClick={doMerge}
                disabled={merging || files.length < 2}
                className="ml-auto"
              >
                {merging ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Download className="mr-2 h-4 w-4" />}
                Merge & Download Combined PDF
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}