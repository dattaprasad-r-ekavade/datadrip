import { env } from "@/lib/env";

const GOOGLE_AUTH_BASE = "https://accounts.google.com/o/oauth2/v2/auth";
const GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token";
const GOOGLE_ADS_BASE = "https://googleads.googleapis.com/v18";

export const buildGoogleAuthUrl = (state: string) => {
  const url = new URL(GOOGLE_AUTH_BASE);
  url.searchParams.set("client_id", env.GOOGLE_CLIENT_ID);
  url.searchParams.set("redirect_uri", env.GOOGLE_REDIRECT_URI);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("scope", "https://www.googleapis.com/auth/adwords");
  url.searchParams.set("access_type", "offline");
  url.searchParams.set("prompt", "consent");
  url.searchParams.set("include_granted_scopes", "true");
  url.searchParams.set("state", state);
  return url.toString();
};

export interface GoogleTokenResponse {
  access_token: string;
  expires_in: number;
  refresh_token?: string;
  token_type: string;
}

export const exchangeGoogleCode = async (code: string) => {
  const body = new URLSearchParams({
    code,
    client_id: env.GOOGLE_CLIENT_ID,
    client_secret: env.GOOGLE_CLIENT_SECRET,
    redirect_uri: env.GOOGLE_REDIRECT_URI,
    grant_type: "authorization_code",
  });

  const response = await fetch(GOOGLE_TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Google token exchange failed: ${text}`);
  }

  return response.json() as Promise<GoogleTokenResponse>;
};

export const refreshGoogleToken = async (refreshToken: string) => {
  const body = new URLSearchParams({
    refresh_token: refreshToken,
    client_id: env.GOOGLE_CLIENT_ID,
    client_secret: env.GOOGLE_CLIENT_SECRET,
    grant_type: "refresh_token",
  });

  const response = await fetch(GOOGLE_TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Google token refresh failed: ${text}`);
  }

  return response.json() as Promise<GoogleTokenResponse>;
};

export const fetchAccessibleCustomerId = async (accessToken: string) => {
  const response = await fetch(`${GOOGLE_ADS_BASE}/customers:listAccessibleCustomers`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "developer-token": env.GOOGLE_ADS_DEVELOPER_TOKEN,
    },
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Google Ads customer fetch failed: ${text}`);
  }

  const data = (await response.json()) as {
    resourceNames?: string[];
  };

  const customer = data.resourceNames?.[0];
  return customer ? customer.split("/")[1] : null;
};

export interface GoogleCampaignMetricRow {
  campaignId: string;
  date: Date;
  spend: number;
  impressions: number;
  clicks: number;
  conversions: number;
}

export const fetchGoogleCampaignMetrics = async (accessToken: string, customerId: string) => {
  const query = `
    SELECT
      campaign.id,
      segments.date,
      metrics.impressions,
      metrics.clicks,
      metrics.cost_micros,
      metrics.conversions
    FROM campaign
    WHERE segments.date DURING LAST_7_DAYS
  `;

  const response = await fetch(
    `${GOOGLE_ADS_BASE}/customers/${customerId}/googleAds:searchStream`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "developer-token": env.GOOGLE_ADS_DEVELOPER_TOKEN,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query }),
    }
  );

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Google Ads metrics fetch failed: ${text}`);
  }

  const data = (await response.json()) as Array<{
    results?: Array<{
      campaign?: { id?: string | number };
      segments?: { date?: string };
      metrics?: {
        impressions?: string;
        clicks?: string;
        costMicros?: string;
        conversions?: string;
      };
    }>;
  }>;

  const rows: GoogleCampaignMetricRow[] = [];
  for (const stream of data ?? []) {
    for (const result of stream.results ?? []) {
      const metrics = result.metrics ?? {};
      rows.push({
        campaignId: String(result.campaign?.id ?? ""),
        date: new Date(result.segments?.date ?? new Date().toISOString()),
        spend: Number(metrics.costMicros ?? 0) / 1_000_000,
        impressions: Number(metrics.impressions ?? 0),
        clicks: Number(metrics.clicks ?? 0),
        conversions: Number(metrics.conversions ?? 0),
      });
    }
  }

  return rows.filter((row) => row.campaignId);
};
