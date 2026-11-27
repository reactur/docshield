'use client';

import { useCallback, useRef, useState } from 'react';
import {
  Download,
  Loader2,
  X,
  FileImage,
  CheckCircle2,
  Trash2,
  RotateCw,
  GripVertical,
  Plus,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { downloadBlob, formatBytes } from '@/lib/pdf-helpers';
import { buildPdfFromImages } from '@/lib/pdf-lib-utils';
import { fireConfetti } from '@/lib/confetti';

const ACCEPTED = 'image/jpeg,image/png,image/webp';
const isSupported = (f: File) =>
  ['image/jpeg', 'image/png', 'image/webp'].includes(f.type) ||
  /\.(jpe?g|png|webp)$/i.test(f.name);

type PageSize = 'a4' | 'a3' | 'letter' | 'legal' | 'original';
type Orientation = 'portrait' | 'landscape';
type Margin = 'none' | 'small' | 'medium' | 'large';
type Fit = 'contain' | 'cover';

const PAGE_SIZES: Record<Exclude<PageSize, 'original'>, [number, number]> = {
  a4: [595.28, 841.89],
  a3: [841.89, 1190.55],
  letter: [612, 792],
  legal: [612, 1008],
};

const MARGINS: Record<Margin, number> = { none: 0, small: 24, medium: 48, large: 84 };

type ImageItem = {
  id: string;
  file: File;
  previewUrl: string;
  rotated: boolean;
};

type Props = {
  onResult: (info: {
    originalPages: number;
    outputPages: number;
    outputBytes: number;
    action: string;
  }) => void;
};

export function JpgToPdfTool({ onResult }: Props) {
  const [images, setImages] = useState<ImageItem[]>([]);
  const [pageSize, setPageSize] = useState<PageSize>('a4');
  const [orientation, setOrientation] = useState<Orientation>('portrait');
  const [margin, setMargin] = useState<Margin>('small');
  const [fit, setFit] = useState<Fit>('contain');
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState<string | null>(null);
  const [dragFrom, setDragFrom] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const addFiles = useCallback((fileList: FileList | File[] | null) => {
    if (!fileList) return;
    const incoming = Array.from(fileList);
    const supported = incoming.filter(isSupported);
    const rejected = incoming.length - supported.length;
    if (rejected > 0) {
      setError(
        `${rejected} file${rejected !== 1 ? 's were' : ' was'} skipped. Only JPG, PNG, and WebP images are supported.`,
      );
    } else {
      setError(null);
    }
    if (supported.length === 0) return;
    setImages((prev) => [
      ...prev,
      ...supported.map((f) => ({
        id: `${f.name}-${f.size}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        file: f,
        previewUrl: URL.createObjectURL(f),
        rotated: false,
      })),
    ]);
    setDone(null);
  }, []);

  const reset = () => {
    images.forEach((img) => URL.revokeObjectURL(img.previewUrl));
    setImages([]);
    setError(null);
    setDone(null);
  };

  const removeImage = (id: string) => {
    setImages((prev) => {
      const target = prev.find((i) => i.id === id);
      if (target) URL.revokeObjectURL(target.previewUrl);
      return prev.filter((i) => i.id !== id);
    });
  };

  const rotateImage = (id: string) => {
    setImages((prev) => prev.map((i) => (i.id === id ? { ...i, rotated: !i.rotated } : i)));
  };

  const move = (from: number, to: number) => {
    setImages((prev) => {
      const next = [...prev];
      const [item] = next.splice(from, 1);
      next.splice(to, 0, item);
      return next;
    });
  };

  const doExport = async () => {
    if (images.length === 0) return;
    setExporting(true);
    setError(null);
    try {
      const payloads = await Promise.all(
        images.map(async (img) => ({
          bytes: new Uint8Array(await img.file.arrayBuffer()),
          type: img.file.type,
          rotated: img.rotated,
        })),
      );
      const out = await buildPdfFromImages(payloads, {
        pageSize,
        orientation,
        margin: MARGINS[margin],
        fit,
      });
      downloadBlob(out, 'docshield-images.pdf');
      setDone(`PDF created from ${images.length} image${images.length !== 1 ? 's' : ''} (${formatBytes(out.byteLength)}). Your download has started.`);
      onResult({
        originalPages: images.length,
        outputPages: images.length,
        outputBytes: out.byteLength,
        action: 'Convert images to PDF',
      });
      await fireConfetti();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not build the PDF.');
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="space-y-5">
      {images.length === 0 ? (
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            addFiles(e.dataTransfer.files);
          }}
        >
          <DropzoneMulti onPick={() => inputRef.current?.click()} />
          <input
            ref={inputRef}
            type="file"
            accept={ACCEPTED}
            multiple
            className="hidden"
            onChange={(e) => {
              addFiles(e.target.files);
              e.target.value = '';
            }}
          />
        </div>
      ) : (
        <Card className="border-border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between gap-3 space-y-0">
            <div className="min-w-0">
              <CardTitle className="flex items-center gap-2 truncate text-base">
                <FileImage className="h-4 w-4 shrink-0 text-primary" />
                {images.length} image{images.length !== 1 ? 's' : ''} selected
              </CardTitle>
              <p className="mt-1 text-xs text-muted-foreground">
                Total {formatBytes(images.reduce((s, i) => s + i.file.size, 0))}
              </p>
            </div>
            <Button variant="ghost" size="sm" onClick={reset} className="shrink-0">
              <X className="mr-1 h-4 w-4" /> Start over
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {error && (
              <div className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                {error}
              </div>
            )}

            {done && (
              <div className="flex items-center gap-2 rounded-md border border-primary/30 bg-primary/5 px-3 py-2 text-sm text-foreground">
                <CheckCircle2 className="h-4 w-4 text-success" />
                {done}
              </div>
            )}

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {images.map((img, idx) => (
                <div
                  key={img.id}
                  draggable
                  onDragStart={() => setDragFrom(idx)}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    if (dragFrom !== null && dragFrom !== idx) move(dragFrom, idx);
                    setDragFrom(null);
                  }}
                  className="group relative cursor-grab overflow-hidden rounded-lg border-2 border-border transition-all hover:border-primary/50 active:cursor-grabbing"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={img.previewUrl}
                    alt={img.file.name}
                    className={cn(
                      'aspect-square w-full bg-secondary/20 object-contain',
                      img.rotated && 'rotate-90',
                    )}
                  />
                  <span className="pointer-events-none absolute left-1 top-1 flex items-center gap-1 rounded bg-white/85 px-1.5 py-0.5 text-[10px] font-medium text-foreground">
                    <GripVertical className="h-3 w-3" /> {idx + 1}
                  </span>
                  <div className="absolute bottom-1 right-1 flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                    <button
                      title="Rotate 90°"
                      onClick={() => rotateImage(img.id)}
                      className="flex h-7 w-7 items-center justify-center rounded bg-white/90 text-foreground shadow hover:text-primary"
                    >
                      <RotateCw className="h-3.5 w-3.5" />
                    </button>
                    <button
                      title="Remove image"
                      onClick={() => removeImage(img.id)}
                      className="flex h-7 w-7 items-center justify-center rounded bg-white/90 text-foreground shadow hover:text-destructive"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ))}
              <button
                onClick={() => inputRef.current?.click()}
                className="flex aspect-square w-full flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed border-border text-muted-foreground transition-colors hover:border-primary/50 hover:text-primary"
              >
                <Plus className="h-5 w-5" />
                <span className="text-xs font-medium">Add more</span>
              </button>
              <input
                ref={inputRef}
                type="file"
                accept={ACCEPTED}
                multiple
                className="hidden"
                onChange={(e) => {
                  addFiles(e.target.files);
                  e.target.value = '';
                }}
              />
            </div>

            <div className="grid gap-4 border-t border-border pt-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label>Page size</Label>
                <div className="flex flex-wrap gap-1.5">
                  {(['a4', 'a3', 'letter', 'legal', 'original'] as PageSize[]).map((s) => (
                    <SizePill key={s} active={pageSize === s} onClick={() => setPageSize(s)} label={s === 'original' ? 'Original' : s.toUpperCase()} />
                  ))}
                </div>
              </div>
              <div className="space-y-1.5">
                <Label>Orientation</Label>
                <div className="flex flex-wrap gap-1.5">
                  <SizePill active={orientation === 'portrait'} onClick={() => setOrientation('portrait')} label="Portrait" />
                  <SizePill active={orientation === 'landscape'} onClick={() => setOrientation('landscape')} label="Landscape" />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label>Margin</Label>
                <div className="flex flex-wrap gap-1.5">
                  {(['none', 'small', 'medium', 'large'] as Margin[]).map((m) => (
                    <SizePill key={m} active={margin === m} onClick={() => setMargin(m)} label={m[0].toUpperCase() + m.slice(1)} />
                  ))}
                </div>
              </div>
              <div className="space-y-1.5">
                <Label>Image fit</Label>
                <div className="flex flex-wrap gap-1.5">
                  <SizePill active={fit === 'contain'} onClick={() => setFit('contain')} label="Contain (whole image visible)" />
                  <SizePill active={fit === 'cover'} onClick={() => setFit('cover')} label="Cover (fill page)" />
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 border-t border-border pt-4">
              <Button onClick={doExport} disabled={exporting || images.length === 0}>
                {exporting ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Download className="mr-2 h-4 w-4" />
                )}
                {exporting ? 'Building PDF…' : `Download PDF (${images.length} page${images.length !== 1 ? 's' : ''})`}
              </Button>
              <p className="text-xs text-muted-foreground">
                Everything runs in your browser — your images are never uploaded.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function SizePill({ active, onClick, label }: { active: boolean; onClick: () => void; label: string }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'rounded-full border px-3 py-1 text-xs font-medium transition-colors',
        active
          ? 'border-primary bg-primary/10 text-primary'
          : 'border-border text-muted-foreground hover:border-primary/50 hover:text-foreground',
      )}
    >
      {label}
    </button>
  );
}

function DropzoneMulti({ onPick }: { onPick: () => void }) {
  return (
    <div
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => e.preventDefault()}
      onClick={onPick}
      className="group flex cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-border bg-secondary/30 px-6 py-12 text-center transition-colors hover:border-primary/50 hover:bg-secondary/50"
    >
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary transition-transform group-hover:scale-110">
        <FileImage className="h-7 w-7" />
      </div>
      <div>
        <p className="text-sm font-medium text-foreground">Drop JPG, PNG, or WebP images here, or click to browse</p>
        <p className="mt-1 text-xs text-muted-foreground">Pick several at once. Your images stay on your device.</p>
      </div>
    </div>
  );
}
