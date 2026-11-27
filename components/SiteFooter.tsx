import Link from 'next/link';
import { PDF_TOOLS } from '@/lib/site-content';

const legalLinks = [
  { href: '/privacy', label: 'Privacy Policy' },
  { href: '/terms', label: 'Terms of Service' },
  { href: '/about', label: 'About & Security' },
  { href: '/contact', label: 'Contact' },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-secondary/30">
      <div className="mx-auto max-w-7xl px-4 py-10">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <h3 className="text-sm font-semibold text-foreground">PDF Tools</h3>
            <ul className="mt-3 space-y-2">
              {PDF_TOOLS.map((tool) => (
                <li key={tool.path}>
                  <Link href={tool.path} className="text-xs text-muted-foreground transition-colors hover:text-foreground">
                    {tool.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground">Company</h3>
            <ul className="mt-3 space-y-2">
              {legalLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-xs text-muted-foreground transition-colors hover:text-foreground">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground">About DocShield PDF</h3>
            <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
              Free, private PDF tools that run entirely in your browser. No uploads, no sign-up,
              no watermarks. Your files never leave your device.
            </p>
          </div>
        </div>
        <p className="mt-8 text-center text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} DocShield PDF. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
