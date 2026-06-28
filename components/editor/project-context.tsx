"use client"

import * as React from "react"
import { useProjectAction } from "@/hooks/use-project-action"

export interface Project {
  id: string
  name: string
  slug: string
  owner: string
  isOwned: boolean
}

export type DialogType = "create" | "rename" | "delete" | null

export interface DialogState {
  type: DialogType
  project: Project | null
  isLoading: boolean
}

export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[\s_]+/g, "-") // Replace spaces and underscores with hyphens
    .replace(/-+/g, "-") // Replace multiple hyphens with a single hyphen
    .replace(/^-+|-+$/g, "") // Remove leading/trailing hyphens (if any, like from spaces at start/end)
}

interface ProjectContextType {
  projects: Project[]
  dialog: DialogState
  formName: string
  formSlug: string
  openCreateDialog: () => void
  openRenameDialog: (project: Project) => void
  openDeleteDialog: (project: Project) => void
  closeDialog: () => void
  setFormName: (name: string) => void
  handleSubmit: (e?: React.FormEvent) => Promise<void>
}

const ProjectContext = React.createContext<ProjectContextType | undefined>(undefined)

export function ProjectProvider({
  children,
  initialProjects = [],
}: {
  children: React.ReactNode
  initialProjects?: Project[]
}) {
  const actions = useProjectAction()

  return (
    <ProjectContext.Provider
      value={{
        projects: initialProjects,
        ...actions,
      }}
    >
      {children}
    </ProjectContext.Provider>
  )
}

export function useProjectDialogs() {
  const context = React.useContext(ProjectContext)
  if (context === undefined) {
    throw new Error("useProjectDialogs must be used within a ProjectProvider")
  }
  return context
}
