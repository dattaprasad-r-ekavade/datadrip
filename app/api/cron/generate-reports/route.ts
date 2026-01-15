import { NextRequest, NextResponse } from "next/server";
import { env } from "@/lib/env";
import { prisma } from "@/lib/prisma";
import { ReportService } from "@/lib/services/report";
import { sendEmail } from "@/lib/services/email";

const isAuthorized = (request: NextRequest) => {
  const authHeader = request.headers.get("authorization");
  if (!authHeader) {
    return false;
  }
  const [, token] = authHeader.split(" ");
  return token === env.CRON_SECRET;
};

export async function POST(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const clients = await prisma.client.findMany({
    include: {
      agency: {
        include: {
          users: {
            select: { email: true, role: true },
          },
        },
      },
    },
  });

  let generated = 0;
  let emailed = 0;

  for (const client of clients) {
    try {
      const report = await ReportService.generateForClient(client.id, 7);
      generated += 1;

      const recipient =
        client.agency.users.find((user) => user.role !== "MEMBER")?.email ??
        client.agency.users[0]?.email;

      if (recipient) {
        await sendEmail({
          to: recipient,
          subject: `Weekly report: ${client.name}`,
          html: report.reportHtml,
        });
        emailed += 1;
      }
    } catch (error) {
      console.error("Report generation failed:", error);
    }
  }

  return NextResponse.json({ generated, emailed });
}
