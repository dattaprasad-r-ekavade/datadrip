import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    // 1. Fetch user and agency
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { id: true, agencyId: true, isSuperAdmin: true },
    });

    if (!user?.agencyId) {
      return NextResponse.json({ error: "User not associated with any agency" }, { status: 400 });
    }

    // 2. Fetch invoice
    const invoice = await prisma.invoice.findUnique({
      where: { orderId: id },
      include: {
        agency: {
          select: {
            name: true,
            billingAddress: true,
            gstin: true,
          },
        },
      },
    });

    if (!invoice) {
      return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
    }

    // 3. Authorization check
    if (!user.isSuperAdmin && user.agencyId !== invoice.agencyId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // 4. Generate a clean, printable HTML receipt
    const formattedDate = new Date(invoice.createdAt).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    const amount = Number(invoice.amount);
    const invoiceHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Receipt - ${invoice.orderId}</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      color: #333;
      margin: 40px;
      line-height: 1.6;
    }
    .invoice-container {
      max-width: 800px;
      margin: 0 auto;
      border: 1px solid #eaeaea;
      padding: 40px;
      border-radius: 8px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
    }
    .header {
      display: flex;
      justify-content: space-between;
      border-bottom: 2px solid #eaeaea;
      padding-bottom: 20px;
      margin-bottom: 30px;
    }
    .header h1 {
      margin: 0;
      font-size: 24px;
      color: #0F172A;
    }
    .header-details {
      text-align: right;
    }
    .header-details p {
      margin: 2px 0;
      font-size: 14px;
      color: #64748B;
    }
    .billing-section {
      display: flex;
      justify-content: space-between;
      margin-bottom: 40px;
    }
    .billing-box h3 {
      margin-top: 0;
      color: #334155;
      font-size: 14px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .billing-box p {
      margin: 4px 0;
      font-size: 14px;
      color: #475569;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 40px;
    }
    th, td {
      padding: 12px;
      text-align: left;
      border-bottom: 1px solid #eaeaea;
    }
    th {
      background-color: #F8FAFC;
      color: #475569;
      font-weight: 600;
    }
    .total-row td {
      font-weight: bold;
      font-size: 16px;
      color: #0F172A;
      border-bottom: 2px solid #0F172A;
    }
    .footer {
      text-align: center;
      margin-top: 50px;
      font-size: 12px;
      color: #94A3B8;
      border-top: 1px solid #eaeaea;
      padding-top: 20px;
    }
    .print-button {
      margin-bottom: 20px;
      display: inline-block;
      padding: 8px 16px;
      background-color: #0F172A;
      color: #fff;
      text-decoration: none;
      border-radius: 4px;
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
      border: none;
    }
    @media print {
      .print-button {
        display: none;
      }
      body {
        margin: 0;
      }
      .invoice-container {
        border: none;
        box-shadow: none;
        padding: 0;
      }
    }
  </style>
</head>
<body>
  <div style="max-width: 800px; margin: 0 auto; text-align: right;">
    <button class="print-button" onclick="window.print()">Print / Save as PDF</button>
  </div>
  <div class="invoice-container">
    <div class="header">
      <div>
        <h1>SuperAdverts</h1>
        <p style="font-size: 14px; color: #64748B; margin: 4px 0;">Digital Marketing Analytics Platform</p>
      </div>
      <div class="header-details">
        <p><strong>Receipt ID:</strong> ${invoice.orderId}</p>
        <p><strong>Date:</strong> ${formattedDate}</p>
        <p><strong>Status:</strong> <span style="color: #16A34A; font-weight: bold;">${invoice.status}</span></p>
      </div>
    </div>

    <div class="billing-section">
      <div class="billing-box">
        <h3>Issued By</h3>
        <p><strong>SuperAdverts</strong></p>
        <p>Website: superadverts.in</p>
        <p>Email: support@superadverts.in</p>
      </div>
      <div class="billing-box" style="text-align: right;">
        <h3>Bill To</h3>
        <p><strong>${invoice.agency.name}</strong></p>
        ${invoice.agency.billingAddress ? `<p>${invoice.agency.billingAddress}</p>` : ""}
        ${invoice.agency.gstin ? `<p>GSTIN: ${invoice.agency.gstin}</p>` : ""}
      </div>
    </div>

    <table>
      <thead>
        <tr>
          <th>Description</th>
          <th style="text-align: right;">Billing Cycle</th>
          <th style="text-align: right;">Amount</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>
            <strong>SuperAdverts ${invoice.planTier.charAt(0) + invoice.planTier.slice(1).toLowerCase()} Plan</strong><br>
            <span style="font-size: 12px; color: #64748B;">Prepaid marketing data synchronizations and AI insights.</span>
          </td>
          <td style="text-align: right;">30 Days</td>
          <td style="text-align: right;">₹${amount.toLocaleString("en-IN")}</td>
        </tr>
        <tr class="total-row">
          <td>Total Paid (INR)</td>
          <td></td>
          <td style="text-align: right;">₹${amount.toLocaleString("en-IN")}</td>
        </tr>
      </tbody>
    </table>

    <div class="footer">
      <p>Thank you for using SuperAdverts! This is an electronically generated receipt; no physical signature is required.</p>
      <p>© ${new Date().getFullYear()} SuperAdverts. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
    `;

    return new NextResponse(invoiceHtml, {
      headers: {
        "Content-Type": "text/html",
      },
    });
  } catch (error) {
    console.error("Failed to generate invoice download:", error);
    return NextResponse.json({ error: "Failed to load receipt page" }, { status: 500 });
  }
}
