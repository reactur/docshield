import Link from 'next/link';

const legalLinks = [
  { href: '/privacy', label: 'Privacy Policy' },
  { href: '/terms', label: 'Terms of Service' },
  { href: '/about', label: 'About & Security' },
  { href: '/contact', label: 'Contact' },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-secondary/20">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-4 px-4 py-8 text-center text-xs text-muted-foreground">
        <nav aria-label="Legal and company" className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
          {legalLinks.map((link) => (
            <Link key={link.href} href={link.href} className="transition-colors hover:text-foreground">
              {link.label}
            </Link>
          ))}
        </nav>
        <p>
          &copy; {new Date().getFullYear()} DocShield PDF. All rights reserved. Free, private PDF tools that
          run entirely in your browser.
        </p>
      </div>
    </footer>
  );
}
