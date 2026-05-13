import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Security | SuperAdverts",
  description: "Security practices and controls used by SuperAdverts.",
};

const lastUpdated = "May 13, 2026";

export default function SecurityPage() {
  return (
    <main className="container mx-auto max-w-4xl px-4 py-12">
      <h1 className="text-3xl font-bold">Security</h1>
      <p className="mt-2 text-sm text-muted-foreground">Last Updated: {lastUpdated}</p>

      <div className="prose prose-neutral mt-8 max-w-none dark:prose-invert">
        <p>
          SuperAdverts is built for agencies managing sensitive campaign and account data. This
          page summarizes our security controls, data handling practices, and incident response
          approach.
        </p>

        <h2>1. Security Principles</h2>
        <ul>
          <li>Least-privilege access across infrastructure and application roles</li>
          <li>Encryption by default for data in transit and at rest</li>
          <li>Separation of environments for development and production</li>
          <li>Continuous improvement through reviews, logging, and monitoring</li>
        </ul>

        <h2>2. Authentication and Access Control</h2>
        <ul>
          <li>Secure session-based authentication with role-based authorization</li>
          <li>Password hashing for stored credentials</li>
          <li>Scoped OAuth access for connected Meta and Google Ads accounts</li>
          <li>Administrative actions restricted by role and auditability</li>
        </ul>

        <h2>3. Data Protection</h2>
        <ul>
          <li>TLS (HTTPS) for data in transit</li>
          <li>Encryption at rest for stored customer and integration data</li>
          <li>Secret management for API keys and integration credentials</li>
          <li>Routine backups with controlled retention windows</li>
        </ul>

        <h2>4. Infrastructure Security</h2>
        <ul>
          <li>Managed cloud hosting with network-level protections</li>
          <li>Access to production systems limited to authorized operators</li>
          <li>Dependency and framework updates applied on a regular schedule</li>
          <li>Monitoring for abnormal traffic and operational anomalies</li>
        </ul>

        <h2>5. Application Security</h2>
        <ul>
          <li>Input validation and server-side authorization checks</li>
          <li>Protection against common web risks (XSS, CSRF, injection patterns)</li>
          <li>Secure coding reviews before production release</li>
          <li>Error handling designed to avoid leaking sensitive internals</li>
        </ul>

        <h2>6. Third-Party Integrations</h2>
        <p>
          SuperAdverts integrates with Meta and Google through OAuth and uses trusted third-party
          providers for infrastructure and billing. We request only the permissions needed to
          deliver the Service.
        </p>

        <h2>7. Incident Response</h2>
        <ul>
          <li>Security incidents are triaged with defined severity levels</li>
          <li>Containment, remediation, and post-incident review are required steps</li>
          <li>Affected customers are notified when legally or contractually required</li>
        </ul>

        <h2>8. Responsible Disclosure</h2>
        <p>
          If you believe you found a vulnerability, email a report to
          {" "}security@superadverts.in{" "}
          with reproduction details, impact, and affected endpoints. Please avoid public disclosure
          until remediation is complete.
        </p>

        <h2>9. Compliance and Policy Alignment</h2>
        <ul>
          <li>Information Technology Act, 2000 (India)</li>
          <li>Digital Personal Data Protection Act, 2023 (India)</li>
          <li>Meta Platform and Google API data policy requirements</li>
        </ul>

        <h2>10. Contact</h2>
        <p>Security Team: security@superadverts.in</p>
        <p>General Support: support@superadverts.in</p>
      </div>
    </main>
  );
}
