import { env } from "@/lib/env";

export interface CashfreeCustomerDetails {
  customerId: string;
  customerPhone: string;
  customerEmail?: string;
  customerName?: string;
}

export interface CashfreeOrderResponse {
  cf_order_id: string;
  order_id: string;
  entity: string;
  order_status: "ACTIVE" | "PAID" | "EXPIRED" | "TERMINATED";
  order_amount: number;
  order_currency: string;
  payment_session_id: string;
  order_expiry_time: string;
  order_meta?: {
    return_url: string;
  };
}

export class CashfreeService {
  private static getBaseUrl(): string {
    return env.CASHFREE_ENV === "production"
      ? "https://api.cashfree.com/pg"
      : "https://sandbox.cashfree.com/pg";
  }

  private static getHeaders(): Record<string, string> {
    const clientId = env.CASHFREE_CLIENT_ID || "TEST102928681d4a6de1456d95abf6c986829201"; // Sandbox default test client ID if none configured
    const clientSecret = env.CASHFREE_CLIENT_SECRET || "TESTa438259db1451f28b2deea31a0e8d08cb5ee0a3a"; // Sandbox default test secret if none configured

    return {
      "Content-Type": "application/json",
      "x-api-version": "2023-08-01", // Stabilized API version for PG orders
      "x-client-id": clientId,
      "x-client-secret": clientSecret,
    };
  }

  static async createOrder(
    orderId: string,
    amount: number,
    customerDetails: CashfreeCustomerDetails,
    returnUrl: string
  ): Promise<CashfreeOrderResponse> {
    const url = `${this.getBaseUrl()}/orders`;
    const headers = this.getHeaders();

    // Ensure phone number has exactly 10 digits and is valid
    let phone = customerDetails.customerPhone.replace(/\D/g, "");
    if (phone.length > 10) phone = phone.slice(-10);
    if (phone.length < 10) phone = "9999999999"; // Fallback dummy phone for test compliance

    const body = {
      order_amount: amount,
      order_currency: "INR",
      order_id: orderId,
      customer_details: {
        customer_id: customerDetails.customerId,
        customer_phone: phone,
        customer_email: customerDetails.customerEmail || undefined,
        customer_name: customerDetails.customerName || undefined,
      },
      order_meta: {
        return_url: returnUrl,
      },
    };

    const response = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Cashfree create order error:", errorText);
      throw new Error(`Failed to create Cashfree order: ${response.statusText} (${errorText})`);
    }

    return response.json() as Promise<CashfreeOrderResponse>;
  }

  static async verifyOrder(orderId: string): Promise<CashfreeOrderResponse> {
    const url = `${this.getBaseUrl()}/orders/${orderId}`;
    const headers = this.getHeaders();

    const response = await fetch(url, {
      method: "GET",
      headers,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Cashfree verify order error:", errorText);
      throw new Error(`Failed to verify Cashfree order: ${response.statusText} (${errorText})`);
    }

    return response.json() as Promise<CashfreeOrderResponse>;
  }
}
