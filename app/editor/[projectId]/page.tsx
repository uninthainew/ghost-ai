import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { auth, currentUser } from "@clerk/nextjs/server"

interface ProjectPageProps {
  params: Promise<{
    projectId: string
  }>
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { userId } = await auth()
  if (!userId) {
    notFound()
  }

  const { projectId } = await params

  // Verify the project exists
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    include: {
      collaborators: true,
    },
  })

  if (!project) {
    notFound()
  }

  // Verify user has access (either owner or collaborator)
  const isOwner = project.ownerId === userId
  
  let hasAccess = isOwner
  if (!isOwner) {
    const user = await currentUser()
    const emailAddresses = user?.emailAddresses.map((e) => e.emailAddress) || []
    hasAccess = project.collaborators.some((c) => emailAddresses.includes(c.email))
  }

  if (!hasAccess) {
    notFound()
  }

  return (
    <main className="flex-1 overflow-auto p-8 flex flex-col gap-6 bg-background">
      <div className="flex flex-col gap-1 border-b border-border/40 pb-4">
        <h1 className="font-heading text-2xl font-bold tracking-tight text-foreground/95">
          {project.name}
        </h1>
        <p className="text-xs text-muted-foreground font-mono">
          Room ID / Project ID: <span className="text-primary font-medium">{project.id}</span>
        </p>
      </div>

      <div className="flex-1 rounded-xl border border-dashed border-border/50 bg-muted/10 flex flex-col items-center justify-center p-12 text-center">
        <div className="max-w-md space-y-2">
          <h2 className="font-semibold text-lg text-foreground/90">
            Architecture Canvas Placeholder
          </h2>
          <p className="text-sm text-muted-foreground">
            This workspace will house the interactive diagram editor and multiplayer canvas in subsequent chapters.
          </p>
        </div>
      </div>
    </main>
  )
}
