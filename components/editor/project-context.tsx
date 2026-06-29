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

export type DialogType = "create" | "rename" | "delete" | "share" | null

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

import { useUser } from "@clerk/nextjs"

interface ProjectContextType {
  projects: Project[]
  dialog: DialogState
  formName: string
  formSlug: string
  isAiOpen: boolean
  toggleAiSidebar: () => void
  isSidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
  openCreateDialog: () => void
  openRenameDialog: (project: Project) => void
  openDeleteDialog: (project: Project) => void
  openShareDialog: (project: Project) => void
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
  const [projects, setProjects] = React.useState<Project[]>(initialProjects)
  const [isAiOpen, setAiOpen] = React.useState(false)
  const [isSidebarOpen, setSidebarOpen] = React.useState(false)
  const { user } = useUser()

  const refreshProjects = React.useCallback(async () => {
    if (!user) return
    try {
      const res = await fetch("/api/projects")
      if (res.ok) {
        const dbProjects = await res.json()
        const emailAddresses = user.emailAddresses.map((e) => e.emailAddress)
        const userId = user.id

        const mapped: Project[] = dbProjects.map((p: any) => {
          const isOwned = p.ownerId === userId
          let owner = "me"
          if (!isOwned) {
            const colEmail = p.collaborators.find((c: any) => emailAddresses.includes(c.email))?.email
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
        setProjects(mapped)
      }
    } catch (err) {
      console.error("Failed to refresh projects:", err)
    }
  }, [user])

  // Sync initialProjects when they change (e.g. from SSR)
  React.useEffect(() => {
    if (initialProjects && initialProjects.length > 0) {
      setProjects(initialProjects)
    }
  }, [initialProjects])

  const actions = useProjectAction(refreshProjects, () => setSidebarOpen(false))

  const toggleAiSidebar = () => setAiOpen((prev) => !prev)

  return (
    <ProjectContext.Provider
      value={{
        projects,
        isAiOpen,
        toggleAiSidebar,
        isSidebarOpen,
        setSidebarOpen,
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
