'use client';

import { Download, FileText, Layers, Trash2, CheckCircle2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { formatBytes } from '@/lib/pdf-helpers';

export type ProcessResult = {
  originalPages: number;
  outputPages: number;
  outputBytes: number;
  action: string;
} | null;

export function BeforeAfterCard({ result }: { result: ProcessResult }) {
  if (!result) {
    return (
      <Card className="border-dashed border-border/60 bg-secondary/10">
        <CardContent className="flex flex-col items-center gap-2 py-10 text-center">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-muted-foreground">
            <Layers className="h-5 w-5" />
          </div>
          <p className="text-sm font-medium text-foreground">No processing yet</p>
          <p className="text-xs text-muted-foreground">
            After you split, merge, or redact, a summary of the result appears here.
          </p>
        </CardContent>
      </Card>
    );
  }

  const pagesChanged = result.originalPages - result.outputPages;
  return (
    <Card className="animate-float-in border-primary/30 bg-primary/5">
      <CardContent className="space-y-4 py-5">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="h-5 w-5 text-success" />
          <h3 className="text-sm font-semibold text-foreground">{result.action} complete</h3>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Stat icon={<FileText className="h-4 w-4" />} label="Original pages" value={String(result.originalPages)} />
          <Stat icon={<Layers className="h-4 w-4" />} label="Output pages" value={String(result.outputPages)} />
          <Stat
            icon={<Trash2 className="h-4 w-4" />}
            label="Pages removed"
            value={pagesChanged > 0 ? String(pagesChanged) : '0'}
          />
          <Stat icon={<Download className="h-4 w-4" />} label="Output size" value={formatBytes(result.outputBytes)} />
        </div>
        <p className="text-xs text-muted-foreground">
          Your download has started. The file was generated entirely in your browser and never touched a server.
        </p>
      </CardContent>
    </Card>
  );
}

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border/60 bg-secondary/20 px-3 py-2.5">
      <div className="flex items-center gap-1.5 text-muted-foreground">
        {icon}
        <span className="text-[11px] uppercase tracking-wide">{label}</span>
      </div>
      <p className="mt-1 text-lg font-semibold tabular-nums text-foreground">{value}</p>
    </div>
  );
}