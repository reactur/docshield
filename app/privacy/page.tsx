import type { Metadata } from 'next';
import { LegalPage } from '@/components/LegalPage';
import { ADSENSE_CLIENT_ID } from '@/lib/adsense';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description:
    'How DocShield PDF handles your files, contact messages, and advertising cookies. Your PDFs are processed entirely in your browser.',
  alternates: { canonical: '/privacy' },
};

export default function PrivacyPage() {
  return (
    <LegalPage title="Privacy Policy" updated="November 5, 2026">
      <p>
        This policy explains what information DocShield PDF handles when you use this website and
        its PDF tools.
      </p>

      <h2>Your PDF files stay on your device</h2>
      <p>
        All splitting, merging, and redacting happens 100% client-side. The code that runs in your
        browser (using WebAssembly and HTML5 Canvas) reads your PDF into your device&apos;s memory,
        processes it there, and lets you download the result. DocShield PDF never transmits your PDF
        files to any server and does not store them. Closing the tab clears them from memory.
      </p>

      <h2>Information you send us</h2>
      <p>
        If you use the contact form, we store your name, email address, and message so we can reply.
        We keep these only as long as needed to respond to your request, then delete them.
      </p>

      <h2>Advertising and cookies</h2>
      <p>
        This site shows ads served by Google AdSense (publisher ID {ADSENSE_CLIENT_ID}). Google and
        its partners use cookies, including the DART cookie, to show ads based on your visits to
        this and other websites. You can opt out of personalized advertising by visiting{' '}
        <a href="https://adssettings.google.com" rel="noopener noreferrer" target="_blank">
          Google Ads Settings
        </a>
        . You can also learn more about how Google uses data at{' '}
        <a href="https://policies.google.com/technologies/ads" rel="noopener noreferrer" target="_blank">
          policies.google.com
        </a>
        .
      </p>

      <h2>Technical data</h2>
      <p>
        Like most websites, our hosting and advertising providers may process standard technical
        data, such as your IP address, browser type, and the pages you visit, to deliver the site.
      </p>

      <h2>Children</h2>
      <p>
        DocShield PDF is a general-purpose tool and is not directed at children under 16. If you
        believe a child has sent us personal information, contact us and we will delete it.
      </p>

      <h2>Your rights</h2>
      <p>
        Depending on where you live, you may have the right to access, correct, or delete personal
        information we hold about you, and to object to certain processing. Send a request through
        the <a href="/contact">contact page</a>.
      </p>

      <h2>Changes to this policy</h2>
      <p>
        We may update this policy from time to time. The date at the top of the page shows when it
        last changed.
      </p>
    </LegalPage>
  );
}
