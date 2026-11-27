import type { Metadata } from 'next';
import { ContactForm } from '@/components/ContactForm';
import { LegalPage } from '@/components/LegalPage';
import { CONTACT_WHATSAPP, DEVELOPER_NAME, DEVELOPER_WEBSITE } from '@/lib/site-content';

export const metadata: Metadata = {
  title: 'Contact DocShield PDF',
  description: 'Get in touch with the DocShield PDF team via WhatsApp or email. We respond to questions, bug reports, and privacy requests.',
  alternates: { canonical: '/contact' },
};

export default function ContactPage() {
  const whatsappLink = `https://wa.me/${CONTACT_WHATSAPP}`;
  return (
    <LegalPage title="Contact us" updated="November 27, 2026">
      <p>
        Questions, bug reports, and feature requests are welcome. Please do not send confidential
        documents here. This form accepts text only, and your PDFs never leave your device.
      </p>

      <h2>Reach us on WhatsApp</h2>
      <p>
        For quick responses, message us on WhatsApp at{' '}
        <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
          +91 95500 66495
        </a>
        . We typically reply within a few hours during the day.
      </p>

      <h2>Built by</h2>
      <p>
        DocShield PDF is developed by{' '}
        <a href={DEVELOPER_WEBSITE} target="_blank" rel="noopener noreferrer">
          {DEVELOPER_NAME}
        </a>
        . If you have a project that needs a similar tool or custom PDF workflow, reach out.
      </p>

      <ContactForm />
    </LegalPage>
  );
}
