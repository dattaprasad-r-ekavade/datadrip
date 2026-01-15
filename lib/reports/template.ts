interface ReportMetric {
  platform: string;
  spend: number;
  impressions: number;
  clicks: number;
  conversions: number;
}

interface ReportTemplateInput {
  clientName: string;
  periodStart: Date;
  periodEnd: Date;
  summary: string;
  metrics: ReportMetric[];
}

const formatDate = (date: Date) =>
  new Intl.DateTimeFormat("en-IN", { dateStyle: "medium" }).format(date);

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR" }).format(value);

export const renderReportHtml = ({
  clientName,
  periodStart,
  periodEnd,
  summary,
  metrics,
}: ReportTemplateInput) => {
  const rows = metrics
    .map(
      (metric) => `
        <tr>
          <td>${metric.platform}</td>
          <td>${formatCurrency(metric.spend)}</td>
          <td>${metric.impressions}</td>
          <td>${metric.clicks}</td>
          <td>${metric.conversions}</td>
        </tr>
      `
    )
    .join("");

  return `
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; color: #111827; }
          .container { max-width: 640px; margin: 0 auto; padding: 24px; }
          h1 { font-size: 20px; margin-bottom: 8px; }
          p { font-size: 14px; line-height: 1.6; }
          table { width: 100%; border-collapse: collapse; margin-top: 16px; }
          th, td { text-align: left; padding: 8px; border-bottom: 1px solid #e5e7eb; font-size: 13px; }
          th { background: #f9fafb; }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Weekly performance report: ${clientName}</h1>
          <p>${formatDate(periodStart)} – ${formatDate(periodEnd)}</p>
          <p>${summary}</p>
          <table>
            <thead>
              <tr>
                <th>Platform</th>
                <th>Spend</th>
                <th>Impressions</th>
                <th>Clicks</th>
                <th>Conversions</th>
              </tr>
            </thead>
            <tbody>${rows}</tbody>
          </table>
        </div>
      </body>
    </html>
  `;
};
