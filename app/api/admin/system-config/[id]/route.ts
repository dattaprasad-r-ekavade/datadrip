import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { SystemConfigService, UpdateSystemConfigInput } from "@/lib/services/system-config";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  const session = await auth();
  if (!session?.user?.isSuperAdmin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const { id } = await params;
    const body = (await request.json()) as UpdateSystemConfigInput;
    const config = await SystemConfigService.update(id, body, session.user.id);
    return NextResponse.json(config);
  } catch (error) {
    console.error("Failed to update config:", error);
    return NextResponse.json({ error: "Failed to update config" }, { status: 400 });
  }
}

export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  const session = await auth();
  if (!session?.user?.isSuperAdmin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const { id } = await params;
    await SystemConfigService.remove(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete config:", error);
    return NextResponse.json({ error: "Failed to delete config" }, { status: 400 });
  }
}
