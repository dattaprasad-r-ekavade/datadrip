import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { ClientService, UpdateClientInput } from "@/lib/services/client";

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const client = await ClientService.getById(id);

    if (!client) {
      return NextResponse.json({ error: "Client not found" }, { status: 404 });
    }

    // Check if user has access to this client's agency
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { agencyId: true, isSuperAdmin: true },
    });

    if (!user?.isSuperAdmin && user?.agencyId !== client.agencyId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    return NextResponse.json(client);
  } catch (error) {
    console.error("Error fetching client:", error);
    return NextResponse.json(
      { error: "Failed to fetch client" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get the client first to check agency access
    const existingClient = await ClientService.getById(id);

    if (!existingClient) {
      return NextResponse.json({ error: "Client not found" }, { status: 404 });
    }

    // Check if user has access to this client's agency
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { agencyId: true, isSuperAdmin: true },
    });

    if (!user?.isSuperAdmin && user?.agencyId !== existingClient.agencyId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body: UpdateClientInput = await request.json();
    const client = await ClientService.update(id, body);

    return NextResponse.json(client);
  } catch (error) {
    console.error("Error updating client:", error);
    return NextResponse.json(
      { error: "Failed to update client" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get the client first to check agency access
    const existingClient = await ClientService.getById(id);

    if (!existingClient) {
      return NextResponse.json({ error: "Client not found" }, { status: 404 });
    }

    // Check if user has access to this client's agency
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { agencyId: true, isSuperAdmin: true },
    });

    if (!user?.isSuperAdmin && user?.agencyId !== existingClient.agencyId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await ClientService.delete(id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting client:", error);
    return NextResponse.json(
      { error: "Failed to delete client" },
      { status: 500 }
    );
  }
}