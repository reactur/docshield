import type { Metadata } from 'next';
import { LegalPage } from '@/components/LegalPage';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'Terms for using DocShield PDF, including acceptable use and limits of liability.',
  alternates: { canonical: '/terms' },
};

export default function TermsPage() {
  return (
    <LegalPage title="Terms of Service" updated="November 5, 2026">
      <p>
        By using DocShield PDF, you agree to these terms. If you do not agree, please do not use the
        site.
      </p>

      <h2>Acceptable use</h2>
      <ul>
        <li>Use the tools only with documents you have the right to process.</li>
        <li>Do not use the site for unlawful activity or to attempt to disrupt or reverse engineer it.</li>
        <li>Do not use the site to process content that infringes someone else&apos;s rights.</li>
      </ul>

      <h2>Your files and your responsibility</h2>
      <p>
        You keep full ownership of your documents. Because files are processed on your device, you
        are responsible for keeping your own copies and backups. You are also responsible for
        checking every output file, especially redacted documents, before you share it or rely on it
        to meet a legal or contractual obligation. Redaction boxes may not remove the underlying
        text.
      </p>

      <h2>No warranty</h2>
      <p>
        DocShield PDF is provided &quot;as is&quot; and &quot;as available&quot;, without warranties of any kind,
        express or implied, including fitness for a particular purpose and uninterrupted operation.
      </p>

      <h2>Limitation of liability</h2>
      <p>
        To the maximum extent permitted by applicable law, DocShield PDF and its operators are not
        liable for any indirect, incidental, special, or consequential damages, including lost data,
        lost profits, or disclosure of information, arising from your use of the site or its tools.
      </p>

      <h2>Third-party services</h2>
      <p>
        The site displays third-party advertising and loads some open-source components from content
        delivery networks. Those services are governed by their own terms and policies.
      </p>

      <h2>Changes and governing law</h2>
      <p>
        We may update these terms at any time. Continued use after a change means you accept the
        updated terms. These terms are governed by the laws that apply where the site operator is
        based, without regard to conflict-of-law rules.
      </p>
    </LegalPage>
  );
}
