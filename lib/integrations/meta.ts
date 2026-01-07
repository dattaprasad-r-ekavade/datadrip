import { env } from "@/lib/env";

const META_GRAPH_BASE = `https://graph.facebook.com/${env.META_API_VERSION}`;
const META_OAUTH_BASE = `https://www.facebook.com/${env.META_API_VERSION}/dialog/oauth`;

export const buildMetaAuthUrl = (state: string) => {
  const url = new URL(META_OAUTH_BASE);
  url.searchParams.set("client_id", env.META_APP_ID);
  url.searchParams.set("redirect_uri", env.META_REDIRECT_URI);
  url.searchParams.set("state", state);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("scope", env.META_SCOPES);
  return url.toString();
};

export const exchangeMetaCode = async (code: string) => {
  const url = new URL(`${META_GRAPH_BASE}/oauth/access_token`);
  url.searchParams.set("client_id", env.META_APP_ID);
  url.searchParams.set("redirect_uri", env.META_REDIRECT_URI);
  url.searchParams.set("client_secret", env.META_APP_SECRET);
  url.searchParams.set("code", code);

  const response = await fetch(url.toString());
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Meta token exchange failed: ${text}`);
  }

  return response.json() as Promise<{ access_token: string; expires_in: number }>;
};

export const exchangeForLongLivedToken = async (accessToken: string) => {
  const url = new URL(`${META_GRAPH_BASE}/oauth/access_token`);
  url.searchParams.set("grant_type", "fb_exchange_token");
  url.searchParams.set("client_id", env.META_APP_ID);
  url.searchParams.set("client_secret", env.META_APP_SECRET);
  url.searchParams.set("fb_exchange_token", accessToken);

  const response = await fetch(url.toString());
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Meta long-lived token exchange failed: ${text}`);
  }

  return response.json() as Promise<{ access_token: string; expires_in: number }>;
};

export const fetchMetaAdAccountId = async (accessToken: string) => {
  const url = new URL(`${META_GRAPH_BASE}/me/adaccounts`);
  url.searchParams.set("fields", "account_id");
  url.searchParams.set("access_token", accessToken);

  const response = await fetch(url.toString());
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Meta ad accounts fetch failed: ${text}`);
  }

  const data = (await response.json()) as {
    data: Array<{ account_id: string }>;
  };

  return data.data?.[0]?.account_id ?? null;
};

export interface MetaInsightRow {
  campaignId: string;
  date: Date;
  spend: number;
  impressions: number;
  clicks: number;
  conversions: number;
}

export const fetchMetaInsights = async (accessToken: string, accountId: string) => {
  const url = new URL(`${META_GRAPH_BASE}/act_${accountId}/insights`);
  url.searchParams.set(
    "fields",
    "campaign_id,spend,impressions,clicks,actions,date_start"
  );
  url.searchParams.set("time_increment", "1");
  url.searchParams.set("date_preset", "last_7d");
  url.searchParams.set("access_token", accessToken);

  const response = await fetch(url.toString());
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Meta insights fetch failed: ${text}`);
  }

  const data = (await response.json()) as {
    data: Array<{
      campaign_id: string;
      spend: string;
      impressions: string;
      clicks: string;
      actions?: Array<{ action_type: string; value: string }>;
      date_start: string;
    }>;
  };

  return (data.data ?? []).map((row) => ({
    campaignId: row.campaign_id,
    date: new Date(row.date_start),
    spend: Number(row.spend ?? 0),
    impressions: Number(row.impressions ?? 0),
    clicks: Number(row.clicks ?? 0),
    conversions: (row.actions ?? []).reduce(
      (sum, action) => sum + Number(action.value ?? 0),
      0
    ),
  })) as MetaInsightRow[];
};
