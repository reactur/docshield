import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export function LegalPage({
  title,
  updated,
  children,
}: {
  title: string;
  updated: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background bg-grid">
      <header className="mx-auto max-w-3xl px-4 pt-10">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to DocShield PDF
        </Link>
      </header>
      <main className="mx-auto max-w-3xl px-4 pb-16 pt-6">
        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">{title}</h1>
        <p className="mt-2 text-xs text-muted-foreground">Last updated {updated}</p>
        <div className="mt-8 space-y-4 text-sm leading-relaxed text-muted-foreground sm:text-base [&_a]:text-primary [&_a]:underline [&_h2]:mt-8 [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-foreground [&_ul]:ml-5 [&_ul]:list-disc [&_ul]:space-y-2">
          {children}
        </div>
      </main>
    </div>
  );
}
