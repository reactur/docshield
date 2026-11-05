'use client';

import { cn } from '@/lib/utils';

type AdSlotProps = {
  width: number;
  height: number;
  label?: string;
  className?: string;
  sticky?: boolean;
};

export function AdSlot({ width, height, label = 'Sponsored Advertisement', className, sticky }: AdSlotProps) {
  return (
    <div
      className={cn(
        'flex items-center justify-center rounded-lg border border-dashed border-border/60 bg-secondary/20',
        sticky && 'sticky top-4',
        className,
      )}
      style={{ minWidth: width, minHeight: height, width, height }}
      aria-hidden="true"
    >
      <div className="flex flex-col items-center gap-1 text-center">
        <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground/70">
          Ad
        </span>
        <span className="px-2 text-[11px] text-muted-foreground/60">{label}</span>
        <span className="text-[10px] text-muted-foreground/40">
          {width}×{height}
        </span>
      </div>
    </div>
  );
}

export function SidebarAdRail() {
  return (
    <aside className="hidden w-[160px] shrink-0 flex-col gap-4 lg:flex xl:w-[300px]">
      <AdSlot width={160} height={600} sticky className="mx-auto xl:hidden" />
      <AdSlot width={300} height={600} sticky className="hidden xl:flex mx-auto" />
      <AdSlot width={160} height={250} className="mx-auto xl:hidden" />
      <AdSlot width={300} height={250} className="hidden xl:flex mx-auto" />
    </aside>
  );
}

export function AnchorBannerAd() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-30 flex justify-center border-t border-border bg-background/95 px-2 py-2 backdrop-blur md:px-4">
      <div className="w-full max-w-[728px]">
        <AdSlot
          width={728}
          height={90}
          label="Sponsored Advertisement"
          className="hidden md:flex w-full"
        />
        <AdSlot
          width={320}
          height={50}
          label="Sponsored"
          className="flex w-full md:hidden"
        />
      </div>
    </div>
  );
}