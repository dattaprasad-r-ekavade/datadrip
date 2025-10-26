interface MagicLinkTemplateProps {
  email: string;
  url: string;
}

export const magicLinkSubject = "Your secure access link";

export function renderMagicLinkEmail({ email, url }: MagicLinkTemplateProps) {
  const escapedEmail = email.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Login to DataDrip</title>
    <style>
      body {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        background-color: #f9fafb;
        color: #111827;
        margin: 0;
        padding: 0;
      }
      .container {
        max-width: 480px;
        margin: 0 auto;
        padding: 40px 24px;
      }
      .card {
        background: #ffffff;
        border-radius: 16px;
        border: 1px solid rgba(15, 23, 42, 0.08);
        padding: 32px;
        box-shadow: 0 12px 32px rgba(15, 23, 42, 0.08);
      }
      h1 {
        font-size: 24px;
        margin: 0 0 16px 0;
      }
      p {
        line-height: 1.6;
        margin: 12px 0;
      }
      a.button {
        display: inline-block;
        background: #111827;
        color: #ffffff !important;
        text-decoration: none;
        padding: 12px 24px;
        border-radius: 9999px;
        font-weight: 600;
        margin-top: 24px;
      }
      .footer {
        font-size: 12px;
        color: #6b7280;
        margin-top: 32px;
        text-align: center;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="card">
        <h1>One-click access to DataDrip</h1>
        <p>Hello ${escapedEmail},</p>
        <p>
          Use the secure magic link below to sign in to your DataDrip dashboard.
          This link will expire in 24 hours and can only be used once.
        </p>
        <p style="text-align: center;">
          <a class="button" href="${url}" target="_blank" rel="noopener noreferrer">
            Sign in to DataDrip
          </a>
        </p>
        <p>
          If you did not request this email, you can safely ignore it. Someone may have
          entered your email address by mistake.
        </p>
      </div>
      <p class="footer">
        � ${new Date().getFullYear()} DataDrip. All rights reserved.
      </p>
    </div>
  </body>
</html>`;
}
