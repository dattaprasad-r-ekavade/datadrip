import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { SystemConfigService, CreateSystemConfigInput } from "@/lib/services/system-config";

export async function GET() {
  const session = await auth();
  if (!session?.user?.isSuperAdmin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const configs = await SystemConfigService.list();
  return NextResponse.json({ configs });
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.isSuperAdmin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const body = (await request.json()) as CreateSystemConfigInput;
    const config = await SystemConfigService.create(body, session.user.id);
    return NextResponse.json(config, { status: 201 });
  } catch (error) {
    console.error("Failed to create config:", error);
    return NextResponse.json({ error: "Failed to create config" }, { status: 400 });
  }
}
