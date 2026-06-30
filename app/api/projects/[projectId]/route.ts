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
    const body = await req.json().catch(() => null);
    if (!body || typeof body !== "object" || Array.isArray(body)) {
      return Response.json({ error: "Bad Request: Invalid body payload" }, { status: 400 });
    }

    if (typeof body.name !== "string" || !body.name.trim()) {
      return Response.json({ error: "Bad Request: 'name' is required and must be a non-empty string" }, { status: 400 });
    }
    const name = body.name.trim();

    // Perform atomic update restricted to owner
    const result = await prisma.project.updateMany({
      where: {
        id: projectId,
        ownerId: userId,
      },
      data: { name },
    });

    if (result.count === 0) {
      const exists = await prisma.project.findUnique({
        where: { id: projectId },
      });
      if (!exists) {
        return Response.json({ error: "Project not found" }, { status: 404 });
      }
      return Response.json({ error: "Forbidden" }, { status: 403 });
    }

    // Retrieve the updated project to return
    const updatedProject = await prisma.project.findUnique({
      where: { id: projectId },
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
  console.log("[DELETE API] Hit with params");
  const { userId } = await auth();
  console.log("[DELETE API] Authenticated userId:", userId);
  if (!userId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { projectId } = await params;
    console.log("[DELETE API] Target projectId:", projectId);

    // Check project existence and ownership
    const project = await prisma.project.findUnique({
      where: { id: projectId },
    });

    console.log("[DELETE API] Found project:", project ? { id: project.id, ownerId: project.ownerId, name: project.name } : null);

    if (!project) {
      console.log("[DELETE API] Project not found");
      return Response.json({ error: "Project not found" }, { status: 404 });
    }

    if (project.ownerId !== userId) {
      console.log("[DELETE API] Owner mismatch! project.ownerId:", project.ownerId, "userId:", userId);
      return Response.json({ error: "Forbidden" }, { status: 403 });
    }

    console.log("[DELETE API] Executing deletion transaction...");
    // Perform transaction delete to clear collaborators and the project safely
    await prisma.$transaction([
      prisma.projectCollaborator.deleteMany({
        where: { projectId },
      }),
      prisma.project.delete({
        where: { id: projectId },
      }),
    ]);
    console.log("[DELETE API] Deletion transaction completed successfully!");

    return Response.json({ success: true });
  } catch (error) {
    console.error("[DELETE API] Error deleting project:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
