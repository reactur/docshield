import type { Metadata } from 'next';
import { ProtectPage } from '@/components/ProtectPage';

export const metadata: Metadata = {
  title: 'Protect PDF with Password Online Free | Encrypt PDF',
  description:
    'Add a password to your PDF so only people with the password can open it. Encrypted in your browser, never uploaded.',
  keywords: ['protect pdf', 'password protect pdf', 'encrypt pdf', 'lock pdf with password'],
  alternates: { canonical: '/protect-pdf' },
};

export default function ProtectPdfPage() {
  return <ProtectPage />;
}
