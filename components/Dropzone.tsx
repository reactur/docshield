'use client';

import { useCallback, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { UploadCloud } from 'lucide-react';

type DropzoneProps = {
  onFiles: (files: File[]) => void;
  accept?: string;
  multiple?: boolean;
  className?: string;
  label?: string;
  hint?: string;
};

export function Dropzone({
  onFiles,
  accept = 'application/pdf',
  multiple = false,
  className,
  label = 'Drop PDF here or click to browse',
  hint = 'Your file stays on your device — nothing is uploaded',
}: DropzoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  const handleFiles = useCallback(
    (fileList: FileList | null) => {
      if (!fileList) return;
      const files = Array.from(fileList).filter((f) =>
        accept === 'application/pdf' ? f.type === 'application/pdf' || f.name.toLowerCase().endsWith('.pdf') : true,
      );
      if (files.length > 0) onFiles(files);
    },
    [onFiles, accept],
  );

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragging(false);
        handleFiles(e.dataTransfer.files);
      }}
      onClick={() => inputRef.current?.click()}
      className={cn(
        'group relative flex cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed px-6 py-12 text-center transition-colors',
        dragging
          ? 'border-primary bg-primary/10'
          : 'border-border bg-secondary/20 hover:border-primary/60 hover:bg-secondary/30',
        className,
      )}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/15 text-primary transition-transform group-hover:scale-110">
        <UploadCloud className="h-7 w-7" />
      </div>
      <div>
        <p className="text-sm font-medium text-foreground">{label}</p>
        <p className="mt-1 text-xs text-muted-foreground">{hint}</p>
      </div>
    </div>
  );
}