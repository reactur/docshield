'use client';

import { useCallback, useState } from 'react';
import { Download, Loader2, X, Stamp } from 'lucide-react';
import { Dropzone } from '@/components/Dropzone';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { downloadBlob, formatBytes, readFileAsArrayBuffer } from '@/lib/pdf-helpers';
import { addWatermarkToPages } from '@/lib/pdf-lib-utils';
import { fireConfetti } from '@/lib/confetti';

const PRESET_COLORS = [
  { label: 'Gray', value: { r: 0.5, g: 0.5, b: 0.5 } },
  { label: 'Red', value: { r: 0.8, g: 0.1, b: 0.1 } },
  { label: 'Blue', value: { r: 0.1, g: 0.2, b: 0.6 } },
  { label: 'Black', value: { r: 0, g: 0, b: 0 } },
];

type Props = {
  onResult: (info: { originalPages: number; outputPages: number; outputBytes: number; action: string }) => void;
};

export function WatermarkTool({ onResult }: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [fileBytes, setFileBytes] = useState<Uint8Array | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [busy, setBusy] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [watermarkText, setWatermarkText] = useState('CONFIDENTIAL');
  const [fontSize, setFontSize] = useState(50);
  const [opacity, setOpacity] = useState(0.15);
  const [rotation, setRotation] = useState(45);
  const [color, setColor] = useState(PRESET_COLORS[0].value);

  const reset = () => {
    setFile(null); setFileBytes(null); setPageCount(0); setError(null);
  };

  const handleFile = useCallback(async (files: File[]) => {
    setError(null);
    const f = files[0];
    if (!f) return;
    reset(); setFile(f); setBusy(true);
    try {
      const buf = await readFileAsArrayBuffer(f);
      setFileBytes(new Uint8Array(buf));
      setPageCount(0);
      const pdfjs = await import('@/lib/pdfjs');
      const pdf = await pdfjs.loadPdfDocument(new Uint8Array(buf));
      setPageCount(pdf.numPages);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not open this PDF.');
    } finally {
      setBusy(false);
    }
  }, []);

  const doExport = async () => {
    if (!fileBytes || !watermarkText.trim()) return;
    setExporting(true);
    setError(null);
    try {
      const out = await addWatermarkToPages(fileBytes, watermarkText.trim(), {
        fontSize,
        opacity,
        rotation,
        color,
      });
      downloadBlob(out, 'docshield-watermarked.pdf');
      onResult({
        originalPages: pageCount,
        outputPages: pageCount,
        outputBytes: out.byteLength,
        action: 'Add watermark',
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
                <Stamp className="h-4 w-4 shrink-0 text-primary" />
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

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="wm-text">Watermark text</Label>
                <Input
                  id="wm-text"
                  value={watermarkText}
                  onChange={(e) => setWatermarkText(e.target.value)}
                  placeholder="e.g. CONFIDENTIAL, DRAFT, DO NOT COPY"
                />
              </div>
              <div className="space-y-1.5">
                <Label>Color</Label>
                <div className="flex items-center gap-2">
                  {PRESET_COLORS.map((c) => (
                    <button
                      key={c.label}
                      title={c.label}
                      onClick={() => setColor(c.value)}
                      className={cn(
                        'h-8 w-8 rounded-full border-2',
                        color === c.value ? 'border-primary ring-2 ring-primary/20' : 'border-border',
                      )}
                      style={{ background: `rgb(${Math.round(c.value.r * 255)}, ${Math.round(c.value.g * 255)}, ${Math.round(c.value.b * 255)})` }}
                    />
                  ))}
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="wm-size">Font size: {fontSize}px</Label>
                <input
                  id="wm-size"
                  type="range"
                  min={12}
                  max={120}
                  value={fontSize}
                  onChange={(e) => setFontSize(parseInt(e.target.value, 10))}
                  className="w-full"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="wm-opacity">Opacity: {Math.round(opacity * 100)}%</Label>
                <input
                  id="wm-opacity"
                  type="range"
                  min={5}
                  max={80}
                  value={Math.round(opacity * 100)}
                  onChange={(e) => setOpacity(parseInt(e.target.value, 10) / 100)}
                  className="w-full"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="wm-rotation">Rotation: {rotation}°</Label>
                <input
                  id="wm-rotation"
                  type="range"
                  min={0}
                  max={90}
                  value={rotation}
                  onChange={(e) => setRotation(parseInt(e.target.value, 10))}
                  className="w-full"
                />
              </div>
            </div>

            <p className="text-xs text-muted-foreground">
              The watermark is applied to every page in the PDF, centered diagonally.
            </p>

            <div className="flex flex-wrap items-center gap-3 border-t border-border pt-4">
              <Button onClick={doExport} disabled={exporting || !watermarkText.trim()}>
                {exporting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Download className="mr-2 h-4 w-4" />}
                Download watermarked PDF
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
