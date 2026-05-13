import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | SuperAdverts",
  description: "Read how SuperAdverts collects, uses, and protects personal data.",
};

const effectiveDate = "May 13, 2026";

export default function PrivacyPage() {
  return (
    <main className="container mx-auto max-w-4xl px-4 py-12">
      <h1 className="text-3xl font-bold">Privacy Policy</h1>
      <p className="mt-2 text-sm text-muted-foreground">Effective Date: {effectiveDate}</p>
      <p className="text-sm text-muted-foreground">Last Updated: {effectiveDate}</p>

      <div className="prose prose-neutral mt-8 max-w-none dark:prose-invert">
        <p>
          SuperAdverts (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) operates the website
          https://superadverts.in (the &quot;Service&quot;). This page informs you of our policies
          regarding the collection, use, and disclosure of personal information when you use our
          Service.
        </p>
        <p>
          By using the Service, you agree to the collection and use of information in accordance
          with this policy.
        </p>

        <h2>1. Information We Collect</h2>
        <h3>Information You Provide Directly</h3>
        <ul>
          <li>Account Information: name, email address, company name, and password.</li>
          <li>
            Payment Information: payments are processed by payment partners
            (Cashfree/Razorpay). We do not store full card details.
          </li>
          <li>Communications: messages sent via email, contact forms, or support requests.</li>
        </ul>

        <h3>Information We Collect Automatically</h3>
        <ul>
          <li>Usage Data: pages visited, features used, browser type, device info, and IP.</li>
          <li>Cookies: session and preference cookies used to run and improve the Service.</li>
        </ul>

        <h3>Information from Third-Party Services</h3>
        <p>When you connect Meta Ads or Google Ads accounts, we may access:</p>
        <ul>
          <li>Ad account details (account ID, name, currency)</li>
          <li>Campaign data (names, status, budgets, spend)</li>
          <li>Performance metrics (impressions, clicks, conversions, costs, ROAS)</li>
          <li>Ad creative metadata (not raw creative files unless explicitly authorized)</li>
        </ul>
        <p>We access this data via OAuth and never store Meta/Google passwords.</p>

        <h2>2. How We Use Your Information</h2>
        <ul>
          <li>Provide and maintain the Service</li>
          <li>Generate reports and AI-powered insights</li>
          <li>Process subscriptions and billing</li>
          <li>Communicate account, product, and support updates</li>
          <li>Improve product reliability and features</li>
          <li>Detect abuse, fraud, or technical issues</li>
          <li>Comply with legal obligations</li>
        </ul>

        <h2>3. How We Share Your Information</h2>
        <p>We do not sell personal data. We share data only as needed for:</p>
        <ul>
          <li>
            Service providers: hosting, database, billing, analytics, and AI model providers.
          </li>
          <li>Legal compliance: court orders or lawful government requests.</li>
          <li>Business transfers: merger, acquisition, or asset transfer.</li>
        </ul>

        <h2>4. Data from Meta and Google</h2>
        <ul>
          <li>We only request permissions you grant.</li>
          <li>Data is used to provide your reports and insights.</li>
          <li>We do not share your ad data with other customers.</li>
          <li>We do not use your ad data to train foundation models.</li>
          <li>After disconnection, stored ad data is deleted within 30 days.</li>
        </ul>

        <h2>5. Data Retention</h2>
        <ul>
          <li>Account data: retained while account is active; deleted within 30 days after closure.</li>
          <li>Ad account data: retained during connection; deleted within 30 days after disconnect.</li>
          <li>Encrypted backups: retained up to 90 days before automatic purge.</li>
          <li>Billing/tax records: retained as required by applicable law.</li>
        </ul>

        <h2>6. Data Security</h2>
        <ul>
          <li>HTTPS/TLS in transit</li>
          <li>Encryption at rest for sensitive data</li>
          <li>Role-based access controls and authentication</li>
          <li>Periodic security reviews</li>
        </ul>
        <p>No internet transmission method is 100% secure.</p>

        <h2>7. Your Rights</h2>
        <ul>
          <li>Access your personal data</li>
          <li>Correct inaccurate information</li>
          <li>Request deletion (subject to legal obligations)</li>
          <li>Withdraw consent where applicable</li>
          <li>Export data in a portable format</li>
          <li>Disconnect Meta/Google accounts at any time</li>
        </ul>
        <p>To exercise these rights, contact us at support@superadverts.in.</p>

        <h2>8. Cookies and Tracking</h2>
        <ul>
          <li>Essential cookies: login and core product functionality</li>
          <li>Analytics cookies: usage metrics to improve the product</li>
          <li>Preference cookies: saved UI and account preferences</li>
        </ul>

        <h2>9. Children&apos;s Privacy</h2>
        <p>Our Service is not intended for users under 18.</p>

        <h2>10. International Data Transfers</h2>
        <p>
          Our infrastructure may process data in India and other jurisdictions where our service
          providers operate.
        </p>

        <h2>11. Compliance</h2>
        <ul>
          <li>Information Technology Act, 2000 (India)</li>
          <li>Digital Personal Data Protection Act, 2023 (India)</li>
          <li>Meta Platform Terms and Developer Policies</li>
          <li>Google API Services User Data Policy</li>
        </ul>

        <h2>12. Changes to This Policy</h2>
        <p>We may update this policy and will update the Last Updated date on this page.</p>

        <h2>13. Contact Us</h2>
        <p>Email: support@superadverts.in</p>
        <p>Website: https://superadverts.in</p>
      </div>
    </main>
  );
}
