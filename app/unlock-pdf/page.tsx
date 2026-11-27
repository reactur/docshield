import type { Metadata } from 'next';
import { UnlockPage } from '@/components/UnlockPage';

export const metadata: Metadata = {
  title: 'Unlock PDF Online Free | Remove PDF Password',
  description:
    'Remove a password from a PDF you own. Enter the document password and download an unlocked copy — processed entirely in your browser, never uploaded.',
  keywords: ['unlock pdf', 'remove pdf password', 'decrypt pdf', 'pdf password remover'],
  alternates: { canonical: '/unlock-pdf' },
  openGraph: {
    title: 'Unlock PDF Online Free | DocShield PDF',
    description: 'Remove a password from a PDF you own, right in your browser. No uploads.',
    url: '/unlock-pdf',
  },
  twitter: {
    card: 'summary',
    title: 'Unlock PDF Online Free | DocShield PDF',
    description: 'Remove a password from a PDF you own, right in your browser. No uploads.',
  },
};

export default function UnlockPdfRoute() {
  return <UnlockPage />;
}
