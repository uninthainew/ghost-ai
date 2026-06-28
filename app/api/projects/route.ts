import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { getProjects } from "@/lib/projects";

export async function GET() {
  const { userId } = await auth();
  if (!userId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const user = await currentUser();
    const emailAddresses = user?.emailAddresses.map((e) => e.emailAddress) || [];

    const projects = await getProjects(userId, emailAddresses);

    return Response.json(projects);
  } catch (error) {
    console.error("Error fetching projects:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json().catch(() => ({}));
    const name = body.name?.trim() || "Untitled Project";
    const id = body.id?.trim();

    const project = await prisma.project.create({
      data: {
        id: id || undefined,
        ownerId: userId,
        name: name,
      },
    });

    return Response.json(project, { status: 201 });
  } catch (error) {
    console.error("Error creating project:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
