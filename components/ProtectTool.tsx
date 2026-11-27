'use client';

import { useCallback, useState } from 'react';
import { Download, Loader2, X, Lock, Eye, EyeOff, ShieldCheck } from 'lucide-react';
import { Dropzone } from '@/components/Dropzone';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { downloadBlob, formatBytes, readFileAsArrayBuffer } from '@/lib/pdf-helpers';
import { protectPdf } from '@/lib/pdf-lib-utils';
import { fireConfetti } from '@/lib/confetti';

type Props = {
  onResult: (info: { originalPages: number; outputPages: number; outputBytes: number; action: string }) => void;
};

export function ProtectTool({ onResult }: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [fileBytes, setFileBytes] = useState<Uint8Array | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [busy, setBusy] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const reset = () => {
    setFile(null); setFileBytes(null); setPageCount(0); setError(null);
    setPassword(''); setConfirmPassword('');
  };

  const handleFile = useCallback(async (files: File[]) => {
    setError(null);
    const f = files[0];
    if (!f) return;
    reset(); setFile(f); setBusy(true);
    try {
      const buf = await readFileAsArrayBuffer(f);
      setFileBytes(new Uint8Array(buf));
      const pdfjs = await import('@/lib/pdfjs');
      const pdf = await pdfjs.loadPdfDocument(new Uint8Array(buf));
      setPageCount(pdf.numPages);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not open this PDF.');
    } finally {
      setBusy(false);
    }
  }, []);

  const passwordsMatch = password === confirmPassword && password.length > 0;

  const doExport = async () => {
    if (!fileBytes || !passwordsMatch) return;
    setExporting(true);
    setError(null);
    try {
      const out = await protectPdf(fileBytes, password);
      downloadBlob(out, 'docshield-protected.pdf');
      onResult({
        originalPages: pageCount,
        outputPages: pageCount,
        outputBytes: out.byteLength,
        action: 'Protect with password',
      });
      await fireConfetti();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not protect the PDF.');
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
                <Lock className="h-4 w-4 shrink-0 text-primary" />
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
                <Label htmlFor="pwd">Password</Label>
                <div className="relative">
                  <Input
                    id="pwd"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter a password"
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="pwd-confirm">Confirm password</Label>
                <Input
                  id="pwd-confirm"
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter the password"
                />
              </div>
            </div>

            {confirmPassword.length > 0 && !passwordsMatch && (
              <p className="text-sm text-destructive">Passwords do not match.</p>
            )}

            <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
              <div className="flex items-start gap-2">
                <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                <div className="text-sm text-muted-foreground">
                  <p className="font-medium text-foreground">How this works</p>
                  <p className="mt-1">
                    The PDF is encrypted with your password right in your browser. Anyone who opens
                    the file will need the password to view it. Make sure you remember it — there is
                    no way to recover a lost password.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 border-t border-border pt-4">
              <Button onClick={doExport} disabled={exporting || !passwordsMatch}>
                {exporting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Lock className="mr-2 h-4 w-4" />}
                Download protected PDF
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
