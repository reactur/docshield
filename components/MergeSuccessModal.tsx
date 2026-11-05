'use client';

import { CheckCircle2, Download, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AdSenseBanner } from '@/components/AdSenseBanner';
import { AD_SLOTS } from '@/lib/adsense';

type MergeSuccessModalProps = {
  open: boolean;
  onClose: () => void;
  result: {
    originalPages: number;
    outputPages: number;
    outputBytes: number;
  } | null;
};

export function MergeSuccessModal({ open, onClose, result }: MergeSuccessModalProps) {
  if (!open || !result) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md rounded-xl border border-border bg-card p-6 shadow-2xl animate-float-in"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-sm text-muted-foreground transition-colors hover:text-foreground"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex flex-col items-center text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-success/15">
            <CheckCircle2 className="h-7 w-7 text-success" />
          </div>
          <h3 className="mt-4 text-lg font-bold text-foreground">
            Your Combined PDF is Ready!
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            {result.outputPages > 0
              ? `${result.originalPages} pages merged into one file.`
              : 'Your merged PDF has been downloaded.'}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            100% processed in your browser — no file was uploaded.
          </p>
        </div>

        <div className="mt-5 flex justify-center">
          <AdSenseBanner
            slotId={AD_SLOTS.rectangle}
            width={300}
            height={250}
            format="rectangle"
            label="SPONSORED"
          />
        </div>

        <div className="mt-5 flex justify-center gap-3">
          <Button variant="secondary" size="sm" onClick={onClose}>
            <Download className="mr-1.5 h-4 w-4" />
            Done
          </Button>
        </div>
      </div>
    </div>
  );
}
