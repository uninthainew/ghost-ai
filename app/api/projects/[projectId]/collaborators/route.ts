import { auth, clerkClient } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { checkProjectAccess } from "@/lib/project-access";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ projectId: string }> }
) {
  const { userId } = await auth();
  if (!userId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { projectId } = await params;
    const { hasAccess, project } = await checkProjectAccess(projectId);

    if (!hasAccess || !project) {
      return Response.json({ error: "Forbidden" }, { status: 403 });
    }

    // Get all collaborators
    const collaborators = await prisma.projectCollaborator.findMany({
      where: { projectId },
      orderBy: { createdAt: "asc" },
    });

    const emails = collaborators.map((c) => c.email);
    let ownerDetails = {
      id: project.ownerId,
      email: "",
      name: "Owner",
      imageUrl: null as string | null,
    };

    let enrichedCollaborators = collaborators.map((c) => ({
      id: c.id,
      email: c.email,
      name: null as string | null,
      imageUrl: null as string | null,
      createdAt: c.createdAt,
    }));

    try {
      const client = await clerkClient();

      // Fetch owner details
      try {
        const ownerUser = await client.users.getUser(project.ownerId);
        const ownerEmail = ownerUser.emailAddresses.find(
          (e) => e.id === ownerUser.primaryEmailAddressId
        )?.emailAddress || ownerUser.emailAddresses[0]?.emailAddress || "";
        const ownerName = [ownerUser.firstName, ownerUser.lastName].filter(Boolean).join(" ") || ownerUser.username || "Owner";
        ownerDetails = {
          id: project.ownerId,
          email: ownerEmail,
          name: ownerName,
          imageUrl: ownerUser.imageUrl || null,
        };
      } catch (err) {
        console.error("Failed to fetch owner details from Clerk:", err);
      }

      // Fetch collaborators details
      if (emails.length > 0) {
        const response = await client.users.getUserList({ emailAddress: emails });
        const clerkUsers = response.data;
        enrichedCollaborators = collaborators.map((c) => {
          const matchingUser = clerkUsers.find((u) =>
            u.emailAddresses.some((e) => e.emailAddress.toLowerCase() === c.email.toLowerCase())
          );
          if (matchingUser) {
            const displayName = [matchingUser.firstName, matchingUser.lastName].filter(Boolean).join(" ") || matchingUser.username || c.email.split("@")[0];
            return {
              id: c.id,
              email: c.email,
              name: displayName,
              imageUrl: matchingUser.imageUrl || null,
              createdAt: c.createdAt,
            };
          }
          return {
            id: c.id,
            email: c.email,
            name: null,
            imageUrl: null,
            createdAt: c.createdAt,
          };
        });
      }
    } catch (err) {
      console.error("Clerk API enrichment failed:", err);
    }

    return Response.json({
      owner: ownerDetails,
      collaborators: enrichedCollaborators,
    });
  } catch (error) {
    console.error("Error fetching collaborators:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ projectId: string }> }
) {
  const { userId } = await auth();
  if (!userId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { projectId } = await params;
    const { isOwner, project } = await checkProjectAccess(projectId);

    if (!project) {
      return Response.json({ error: "Project not found" }, { status: 404 });
    }

    if (!isOwner) {
      return Response.json({ error: "Forbidden: Only the owner can invite collaborators" }, { status: 403 });
    }

    const body = await req.json().catch(() => null);
    const email = body?.email?.trim().toLowerCase();
    if (!email) {
      return Response.json({ error: "Email is required" }, { status: 400 });
    }

    // Simple email regex validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return Response.json({ error: "Invalid email format" }, { status: 400 });
    }

    // Check if the invited email belongs to the project owner
    try {
      const client = await clerkClient();
      const ownerUser = await client.users.getUser(project.ownerId);
      const ownerEmails = ownerUser.emailAddresses.map(e => e.emailAddress.toLowerCase());
      if (ownerEmails.includes(email)) {
        return Response.json({ error: "You cannot invite yourself as a collaborator" }, { status: 400 });
      }
    } catch (err) {
      console.error("Failed to check owner email against invite email:", err);
    }

    // Create the collaborator record idempotently
    const collaborator = await prisma.projectCollaborator.upsert({
      where: {
        projectId_email: {
          projectId,
          email,
        },
      },
      update: {},
      create: {
        projectId,
        email,
      },
    });

    return Response.json(collaborator, { status: 201 });
  } catch (error) {
    console.error("Error inviting collaborator:", error);
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
    const { isOwner, project } = await checkProjectAccess(projectId);

    if (!project) {
      return Response.json({ error: "Project not found" }, { status: 404 });
    }

    if (!isOwner) {
      return Response.json({ error: "Forbidden: Only the owner can remove collaborators" }, { status: 403 });
    }

    const url = new URL(req.url);
    const emailQuery = url.searchParams.get("email");
    const idQuery = url.searchParams.get("id");

    let email = emailQuery?.trim().toLowerCase();
    let id = idQuery?.trim();

    if (!email && !id) {
      const body = await req.json().catch(() => null);
      email = body?.email?.trim().toLowerCase();
      id = body?.id?.trim();
    }

    if (!email && !id) {
      return Response.json({ error: "Email or ID is required" }, { status: 400 });
    }

    if (id) {
      await prisma.projectCollaborator.deleteMany({
        where: {
          id,
          projectId,
        },
      });
    } else if (email) {
      await prisma.projectCollaborator.deleteMany({
        where: {
          projectId,
          email,
        },
      });
    }

    return Response.json({ success: true });
  } catch (error) {
    console.error("Error removing collaborator:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
