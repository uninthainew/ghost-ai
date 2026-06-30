import { auth, currentUser } from "@clerk/nextjs/server"
import { prisma } from "@/lib/prisma"

export interface ClerkIdentity {
  userId: string
  primaryEmail: string
  emailAddresses: string[]
}

/**
 * Retrieves the current authenticated user's ID and email addresses.
 * Redirects or returns null if unauthenticated.
 */
export async function getClerkIdentity(): Promise<ClerkIdentity | null> {
  const { userId } = await auth()
  if (!userId) {
    return null
  }

  const user = await currentUser()
  if (!user) {
    return null
  }

  const primaryEmail = user.emailAddresses.find(
    (e) => e.id === user.primaryEmailAddressId
  )?.emailAddress || user.emailAddresses[0]?.emailAddress || ""

  const emailAddresses = user.emailAddresses.map((e) => e.emailAddress)

  return {
    userId,
    primaryEmail,
    emailAddresses,
  }
}

interface ProjectAccessResult {
  hasAccess: boolean
  isOwner: boolean
  project: any | null // Typing it loosely or import types from prisma if needed
}

/**
 * Checks if the current authenticated user has owner or collaborator access to the given project.
 */
export async function checkProjectAccess(projectId: string): Promise<ProjectAccessResult> {
  const identity = await getClerkIdentity()
  if (!identity) {
    return { hasAccess: false, isOwner: false, project: null }
  }

  const project = await prisma.project.findUnique({
    where: { id: projectId },
    include: {
      collaborators: true,
    },
  })

  if (!project) {
    return { hasAccess: false, isOwner: false, project: null }
  }

  const isOwner = project.ownerId === identity.userId
  const normalizedEmailAddresses = identity.emailAddresses.map((email) =>
    email.toLowerCase()
  )
  const isCollaborator = project.collaborators.some((c) =>
    normalizedEmailAddresses.includes(c.email.toLowerCase())
  )

  return {
    hasAccess: isOwner || isCollaborator,
    isOwner,
    project,
  }
}
