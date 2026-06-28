import { prisma } from "@/lib/prisma";

export async function getProjects(userId: string, emailAddresses: string[]) {
  return await prisma.project.findMany({
    where: {
      OR: [
        { ownerId: userId },
        {
          collaborators: {
            some: {
              email: {
                in: emailAddresses,
              },
            },
          },
        },
      ],
    },
    include: {
      collaborators: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}
