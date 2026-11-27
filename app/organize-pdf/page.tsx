import type { Metadata } from 'next';
import { OrganizePage } from '@/components/OrganizePage';

export const metadata: Metadata = {
  title: 'Organize PDF Online Free | Reorder, Rotate & Delete Pages',
  description:
    'Reorganize PDF pages for free: drag to reorder, rotate, or delete pages, then download the result. Runs entirely in your browser — nothing is uploaded.',
  keywords: ['organize pdf', 'reorder pdf pages', 'rearrange pdf', 'rotate pdf pages', 'delete pdf pages'],
  alternates: { canonical: '/organize-pdf' },
  openGraph: {
    title: 'Organize PDF Online Free | DocShield PDF',
    description: 'Reorder, rotate, and delete PDF pages privately in your browser. No uploads, no sign-up.',
    url: '/organize-pdf',
  },
};

export default function OrganizePdfRoute() {
  return <OrganizePage />;
}
