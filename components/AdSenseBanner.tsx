'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { ADSENSE_CLIENT_ID } from '@/lib/adsense';
import { cn } from '@/lib/utils';

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

type AdSenseBannerProps = {
  slotId: string;
  width: number;
  height: number;
  format?: 'auto' | 'rectangle' | 'vertical' | 'horizontal';
  responsive?: boolean;
  label?: 'ADVERTISEMENT' | 'SPONSORED';
  className?: string;
};

export function AdSenseBanner({
  slotId,
  width,
  height,
  format = 'auto',
  responsive = false,
  label = 'ADVERTISEMENT',
  className,
}: AdSenseBannerProps) {
  const pathname = usePathname();
  const isLive = slotId !== '' && process.env.NODE_ENV === 'production';

  useEffect(() => {
    if (!isLive) return;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      // AdSense throws when a slot already holds an ad; the existing ad stays in place.
    }
  }, [isLive, pathname]);

  const boxWidth = responsive ? '100%' : width;

  return (
    <div className={cn('flex flex-col items-center gap-1', className)} style={{ maxWidth: '100%' }}>
      <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground/70">
        {label}
      </span>
      <div
        className="flex items-center justify-center overflow-hidden rounded-lg"
        style={{ width: boxWidth, maxWidth: '100%', minHeight: height }}
      >
        {isLive ? (
          <ins
            className="adsbygoogle"
            style={{ display: 'block', width: boxWidth, minHeight: height }}
            data-ad-client={ADSENSE_CLIENT_ID}
            data-ad-slot={slotId}
            data-ad-format={format}
            data-full-width-responsive={responsive ? 'true' : 'false'}
          />
        ) : (
          <div
            className="flex h-full w-full items-center justify-center rounded-lg border border-dashed border-border/60 bg-secondary/20"
            style={{ minHeight: height }}
          >
            <span className="px-2 text-center text-[11px] text-muted-foreground/60">
              {width}×{height} ad space
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
