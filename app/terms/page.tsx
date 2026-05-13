import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service | SuperAdverts",
  description: "Terms governing your use of SuperAdverts.",
};

const effectiveDate = "May 13, 2026";

export default function TermsPage() {
  return (
    <main className="container mx-auto max-w-4xl px-4 py-12">
      <h1 className="text-3xl font-bold">Terms of Service</h1>
      <p className="mt-2 text-sm text-muted-foreground">Effective Date: {effectiveDate}</p>
      <p className="text-sm text-muted-foreground">Last Updated: {effectiveDate}</p>

      <div className="prose prose-neutral mt-8 max-w-none dark:prose-invert">
        <p>
          These Terms of Service (&quot;Terms&quot;) govern your access to and use of SuperAdverts
          (&quot;Service&quot;, &quot;we&quot;, &quot;us&quot;, &quot;our&quot;), operated at
          https://superadverts.in.
        </p>
        <p>By accessing or using SuperAdverts, you agree to these Terms.</p>

        <h2>1. The Service</h2>
        <ul>
          <li>Connects to Meta Ads and Google Ads accounts via OAuth</li>
          <li>Aggregates campaign performance in unified dashboards</li>
          <li>Generates AI-powered insights and recommendations</li>
          <li>Produces client-facing reports for agencies and freelancers</li>
        </ul>

        <h2>2. Account Registration</h2>
        <ul>
          <li>You must be at least 18 years old.</li>
          <li>You must provide accurate information.</li>
          <li>You are responsible for account credential security.</li>
          <li>You must be authorized to connect linked ad accounts.</li>
        </ul>

        <h2>3. Subscription and Payment</h2>
        <h3>Pricing</h3>
        <p>
          Pricing is listed at https://superadverts.in/pricing. We may update pricing with prior
          notice.
        </p>
        <h3>Billing</h3>
        <ul>
          <li>Subscriptions are billed monthly or annually in advance.</li>
          <li>Payments are processed by supported third-party providers.</li>
          <li>Fees are in INR unless stated otherwise.</li>
          <li>Applicable taxes (including GST) may apply.</li>
        </ul>
        <h3>Refunds</h3>
        <ul>
          <li>Monthly plans: non-refundable after first 7 days.</li>
          <li>Annual plans: pro-rated refund within first 30 days.</li>
          <li>No refunds for partial billing periods or unused features.</li>
        </ul>
        <h3>Cancellation</h3>
        <ul>
          <li>Cancel anytime via account settings.</li>
          <li>Access continues through the paid billing period.</li>
        </ul>

        <h2>4. Connecting Third-Party Accounts</h2>
        <ul>
          <li>You grant permission to read ad data via OAuth.</li>
          <li>You confirm authority over linked accounts.</li>
          <li>We access only data necessary to provide the Service.</li>
          <li>Data can be disconnected anytime and removed per retention policy.</li>
        </ul>

        <h2>5. Acceptable Use</h2>
        <p>You agree not to:</p>
        <ul>
          <li>Use the Service unlawfully</li>
          <li>Reverse-engineer or attempt source extraction</li>
          <li>Abuse automation without permission</li>
          <li>Resell or sublicense unauthorized access</li>
          <li>Upload malicious code or disrupt platform security</li>
          <li>Violate Meta or Google terms using this Service</li>
        </ul>

        <h2>6. Intellectual Property</h2>
        <p>
          SuperAdverts software, branding, and product content remain our property. You retain
          rights to your connected ad account data.
        </p>

        <h2>7. Service Availability</h2>
        <p>
          We aim for high uptime but cannot guarantee uninterrupted service. Third-party outages
          may affect functionality.
        </p>

        <h2>8. Limitation of Liability</h2>
        <ul>
          <li>Service is provided as-is, without guarantees of business outcomes.</li>
          <li>We are not liable for indirect or consequential damages.</li>
          <li>Maximum liability is limited to fees paid in the prior 12 months.</li>
        </ul>

        <h2>9. Indemnification</h2>
        <p>
          You agree to indemnify SuperAdverts for claims arising from your misuse of the Service or
          violations of applicable rules and third-party rights.
        </p>

        <h2>10. Third-Party Services</h2>
        <p>
          Usage is also subject to third-party terms, including Meta and Google platform policies.
        </p>

        <h2>11. Termination</h2>
        <p>
          Either party may terminate under these Terms. We may suspend or terminate for violations,
          non-payment, or abuse.
        </p>

        <h2>12. Changes to Service and Terms</h2>
        <p>
          We may update features and Terms. Continued use after updates constitutes acceptance.
        </p>

        <h2>13. Governing Law</h2>
        <p>
          These Terms are governed by the laws of India. Courts in Pune, Maharashtra have
          jurisdiction, subject to applicable law.
        </p>

        <h2>14. Beta Features</h2>
        <p>
          Beta or experimental features are provided as-is and may change or be removed without
          notice.
        </p>

        <h2>15. Contact</h2>
        <p>Email: support@superadverts.in</p>
        <p>Website: https://superadverts.in</p>
        <p>Address: Pune, Maharashtra, India</p>
      </div>
    </main>
  );
}
