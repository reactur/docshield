import Link from 'next/link';
import { FileQuestion, Home, Scissors, Combine, FileDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PDF_TOOLS } from '@/lib/site-content';

export default function NotFound() {
  const suggestions = PDF_TOOLS.slice(0, 3);
  return (
    <div className="min-h-screen bg-background">
      <main className="mx-auto flex max-w-3xl flex-col items-center px-4 py-20 text-center sm:py-28">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <FileQuestion className="h-8 w-8" />
        </div>
        <p className="mt-6 text-sm font-semibold uppercase tracking-wide text-primary">Error 404</p>
        <h1 className="mt-2 text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          This page doesn&apos;t exist
        </h1>
        <p className="mt-3 max-w-xl text-balance text-base text-muted-foreground">
          The link may be outdated or the page may have moved. All of our tools are still right
          where you need them.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Button asChild size="lg">
            <Link href="/">
              <Home className="mr-2 h-4 w-4" /> Back to home
            </Link>
          </Button>
        </div>

        <div className="mt-14 w-full">
          <h2 className="text-sm font-semibold text-foreground">Popular tools</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            {suggestions.map((tool) => (
              <Link
                key={tool.slug}
                href={tool.path}
                className="group rounded-xl border border-border bg-card p-4 text-left shadow-sm transition-colors hover:border-primary/50"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  {tool.slug === 'split' ? (
                    <Scissors className="h-4 w-4" />
                  ) : tool.slug === 'merge' ? (
                    <Combine className="h-4 w-4" />
                  ) : (
                    <FileDown className="h-4 w-4" />
                  )}
                </span>
                <p className="mt-2.5 text-sm font-semibold text-foreground">{tool.name}</p>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{tool.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
