import type { Metadata } from 'next';
import { LegalPage } from '@/components/LegalPage';

export const metadata: Metadata = {
  title: 'About & Security',
  description:
    'Why DocShield PDF processes PDFs in your browser, and how that supports GDPR data minimization and HIPAA-conscious workflows.',
  alternates: { canonical: '/about' },
};

export default function AboutPage() {
  return (
    <LegalPage title="About & Security" updated="November 5, 2026">
      <p>
        DocShield PDF was built to split, merge, and redact PDFs without making your documents
        someone else&apos;s data problem. Every tool runs inside your browser, so the file you open is
        never sent to our servers.
      </p>

      <h2>Why processing happens in your browser</h2>
      <p>
        Most online PDF tools upload your file, process it on a remote server, and store a copy for
        some period of time. Each upload creates another place where a document can be copied,
        retained, or exposed. DocShield PDF removes that step: the file stays on your device from
        start to finish.
      </p>

      <h2>GDPR and data minimization</h2>
      <p>
        Data protection rules such as the GDPR ask organizations to collect and keep only the personal
        data they actually need. Because DocShield PDF never receives your documents, it does not
        hold that data at all. The only information we store is what you choose to send through the
        contact form.
      </p>

      <h2>HIPAA and sensitive records</h2>
      <p>
        If your work involves protected health information, a tool that never receives the file
        reduces the data your organization shares with third parties. However, using this tool does
        not by itself make a workflow HIPAA compliant. Your organization still needs its own
        safeguards, policies, and agreements.
      </p>

      <h2>Known limits</h2>
      <ul>
        <li>
          Redaction draws black boxes over the page. The original text can remain in the file, so
          always check the exported PDF before sharing it.
        </li>
        <li>Your device&apos;s security matters. Anyone with access to your computer can open the files on it.</li>
        <li>Very large PDFs are limited by your device&apos;s memory.</li>
      </ul>
    </LegalPage>
  );
}
