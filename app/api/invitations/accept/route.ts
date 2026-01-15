import { NextRequest, NextResponse } from "next/server";
import { InvitationService } from "@/lib/services/invitations";

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as {
      token?: string;
      password?: string;
      name?: string;
    };

    if (!body.token || !body.password) {
      return NextResponse.json({ error: "Token and password required" }, { status: 400 });
    }

    const user = await InvitationService.accept(body.token, body.password, body.name);
    return NextResponse.json({ success: true, userId: user.id });
  } catch (error) {
    console.error("Invitation acceptance failed:", error);
    return NextResponse.json({ error: "Failed to accept invitation" }, { status: 400 });
  }
}
