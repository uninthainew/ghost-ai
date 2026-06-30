import { redirect } from "next/navigation"
import { checkProjectAccess } from "@/lib/project-access"
import { AccessDenied } from "@/components/editor/access-denied"
import { WorkspaceView } from "./workspace-view"
import { auth } from "@clerk/nextjs/server"

interface WorkspacePageProps {
  params: Promise<{
    roomId: string
  }>
}

export default async function WorkspacePage({ params }: WorkspacePageProps) {
  const { userId } = await auth()
  if (!userId) {
    redirect("/sign-in")
  }

  const { roomId } = await params
  const { hasAccess, project } = await checkProjectAccess(roomId)

  if (!hasAccess || !project) {
    return <AccessDenied />
  }

  return <WorkspaceView project={project} />
}
