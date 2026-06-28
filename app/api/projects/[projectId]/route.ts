import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ projectId: string }> }
) {
  const { userId } = await auth();
  if (!userId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { projectId } = await params;
    const body = await req.json().catch(() => ({}));
    const name = body.name?.trim() || "Untitled Project";

    // 1. Fetch project to verify ownership
    const project = await prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project) {
      return Response.json({ error: "Project not found" }, { status: 404 });
    }

    if (project.ownerId !== userId) {
      return Response.json({ error: "Forbidden" }, { status: 403 });
    }

    // 2. Perform the update
    const updatedProject = await prisma.project.update({
      where: { id: projectId },
      data: { name },
    });

    return Response.json(updatedProject);
  } catch (error) {
    console.error("Error renaming project:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ projectId: string }> }
) {
  const { userId } = await auth();
  if (!userId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { projectId } = await params;

    // 1. Fetch project to verify ownership
    const project = await prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project) {
      return Response.json({ error: "Project not found" }, { status: 404 });
    }

    if (project.ownerId !== userId) {
      return Response.json({ error: "Forbidden" }, { status: 403 });
    }

    // 2. Perform delete
    await prisma.project.delete({
      where: { id: projectId },
    });

    return Response.json({ success: true });
  } catch (error) {
    console.error("Error deleting project:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
