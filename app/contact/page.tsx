import type { Metadata } from 'next';
import { ContactForm } from '@/components/ContactForm';
import { LegalPage } from '@/components/LegalPage';

export const metadata: Metadata = {
  title: 'Contact DocShield PDF',
  description: 'Send a question, bug report, or privacy request to the DocShield PDF team.',
  alternates: { canonical: '/contact' },
};

export default function ContactPage() {
  return (
    <LegalPage title="Contact us" updated="November 5, 2026">
      <p>
        Questions, bug reports, and privacy requests are welcome. Please do not send confidential
        documents here. This form accepts text only, and your PDFs never leave your device.
      </p>
      <ContactForm />
    </LegalPage>
  );
}
