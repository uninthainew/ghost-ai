import * as React from "react"
import { auth, currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { getProjects } from "@/lib/projects"
import { EditorLayoutClient } from "./layout-client"
import { Project } from "@/components/editor/project-context"

export default async function EditorLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { userId } = await auth()
  if (!userId) {
    redirect("/sign-in")
  }

  const user = await currentUser()
  const emailAddresses = user?.emailAddresses.map((e) => e.emailAddress) || []

  // Fetch projects server-side
  const dbProjects = await getProjects(userId, emailAddresses)

  // Map to the client-side Project shape
  const projects: Project[] = dbProjects.map((p) => {
    const isOwned = p.ownerId === userId
    let owner = "me"
    if (!isOwned) {
      const colEmail = p.collaborators.find((c) => emailAddresses.includes(c.email))?.email
      owner = colEmail ? colEmail.split("@")[0] : "collaborator"
    }

    return {
      id: p.id,
      name: p.name,
      slug: p.id,
      owner,
      isOwned,
    }
  })

  return (
    <EditorLayoutClient initialProjects={projects}>
      {children}
    </EditorLayoutClient>
  )
}
