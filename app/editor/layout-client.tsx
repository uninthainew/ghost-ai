"use client"

import * as React from "react"
import { EditorNavbar } from "@/components/editor/editor-navbar"
import { ProjectSidebar } from "@/components/editor/project-sidebar"
import { ProjectProvider } from "@/components/editor/project-context"
import { ProjectDialogs } from "@/components/editor/project-dialogs"
import { Project } from "@/components/editor/project-context"

export function EditorLayoutClient({
  children,
  initialProjects,
}: {
  children: React.ReactNode
  initialProjects: Project[]
}) {
  const [sidebarOpen, setSidebarOpen] = React.useState(false)

  return (
    <ProjectProvider initialProjects={initialProjects}>
      <div className="flex min-h-screen flex-col bg-background">
        <EditorNavbar
          sidebarOpen={sidebarOpen}
          onToggleSidebar={() => setSidebarOpen((prev) => !prev)}
        />
        <div className="relative flex flex-1 overflow-hidden">
          <ProjectSidebar
            isOpen={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
          />
          {children}
        </div>
      </div>
      <ProjectDialogs />
    </ProjectProvider>
  )
}
