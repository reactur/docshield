'use client';

import { useCallback, useState } from 'react';
import { Download, Loader2, X, LockOpen, CheckCircle2, Eye, EyeOff, ShieldAlert } from 'lucide-react';
import { Dropzone } from '@/components/Dropzone';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatBytes, readFileAsArrayBuffer } from '@/lib/pdf-helpers';
import { isPdfEncrypted, unlockPdf } from '@/lib/pdf-lib-utils';
import { fireConfetti } from '@/lib/confetti';

type Props = {
  onResult: (info: {
    originalPages: number;
    outputPages: number;
    outputBytes: number;
    action: string;
  }) => void;
};

export function UnlockTool({ onResult }: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [fileBytes, setFileBytes] = useState<Uint8Array | null>(null);
  const [encrypted, setEncrypted] = useState<boolean | null>(null);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [working, setWorking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState<string | null>(null);

  const reset = () => {
    setFile(null);
    setFileBytes(null);
    setEncrypted(null);
    setPassword('');
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
    setWorking(true);
    try {
      const buf = await readFileAsArrayBuffer(f);
      const bytes = new Uint8Array(buf);
      setFileBytes(bytes);
      const isEnc = await isPdfEncrypted(bytes);
      setEncrypted(isEnc);
      if (!isEnc) {
        setError('This PDF is not password-protected. You can use it right away — no need to unlock it.');
      }
    } catch (e) {
      setEncrypted(null);
      setError(
        e instanceof Error
          ? `This file could not be opened as a PDF. It may be corrupted. (${e.message})`
          : 'This file could not be opened as a PDF.',
      );
    } finally {
      setWorking(false);
    }
  }, []);

  const doUnlock = async () => {
    if (!fileBytes || !password) return;
    setWorking(true);
    setError(null);
    try {
      const out = await unlockPdf(fileBytes, password);
      const blob = new Blob([out as BlobPart], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'docshield-unlocked.pdf';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(url), 4000);
      setDone(`Unlocked successfully (${formatBytes(out.byteLength)}). Your download has started.`);
      onResult({
        originalPages: 0,
        outputPages: 0,
        outputBytes: out.byteLength,
        action: 'Unlock PDF',
      });
      await fireConfetti();
    } catch (e) {
      const msg = e instanceof Error ? e.message : '';
      if (msg === 'Password incorrect') {
        setError('That password is not correct. Check it and try again.');
      } else if (msg.includes('password')) {
        setError('This PDF uses a type of encryption that cannot be removed in the browser. Try opening and re-saving it in a desktop PDF reader first.');
      } else {
        setError('Something went wrong while unlocking this PDF. It may be corrupted or use unsupported encryption.');
      }
    } finally {
      setWorking(false);
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
                <LockOpen className="h-4 w-4 shrink-0 text-primary" />
                <span className="truncate">{file.name}</span>
              </CardTitle>
              <p className="mt-1 text-xs text-muted-foreground">{formatBytes(file.size)}</p>
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

            {working && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" /> Checking PDF…
              </div>
            )}

            {encrypted && (
              <div className="space-y-1.5">
                <Label htmlFor="unlock-pass">Enter the document password</Label>
                <div className="flex gap-2">
                  <Input
                    id="unlock-pass"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="PDF password"
                    autoComplete="off"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setShowPassword((v) => !v)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
                <p className="flex items-start gap-1.5 text-xs text-muted-foreground">
                  <ShieldAlert className="mt-0.5 h-3 w-3 shrink-0 text-primary" />
                  The password is used only in your browser to open the file. It is never sent anywhere.
                </p>
                <Button onClick={doUnlock} disabled={working || !password} className="mt-2">
                  {working ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Download className="mr-2 h-4 w-4" />
                  )}
                  Unlock and download
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
