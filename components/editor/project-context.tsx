"use client"

import * as React from "react"

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

const INITIAL_PROJECTS: Project[] = [
  {
    id: "1",
    name: "E-Commerce System",
    slug: "e-commerce-system",
    owner: "me",
    isOwned: true,
  },
  {
    id: "2",
    name: "Analytics Dashboard",
    slug: "analytics-dashboard",
    owner: "me",
    isOwned: true,
  },
  {
    id: "3",
    name: "Marketing Website",
    slug: "marketing-website",
    owner: "Sarah",
    isOwned: false,
  },
  {
    id: "4",
    name: "Database Migration",
    slug: "database-migration",
    owner: "Alex",
    isOwned: false,
  },
]

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

export function ProjectProvider({ children }: { children: React.ReactNode }) {
  const [projects, setProjects] = React.useState<Project[]>(INITIAL_PROJECTS)
  const [dialog, setDialog] = React.useState<DialogState>({
    type: null,
    project: null,
    isLoading: false,
  })
  const [formName, setFormNameState] = React.useState("")
  const [formSlug, setFormSlug] = React.useState("")

  const setFormName = (name: string) => {
    setFormNameState(name)
    if (dialog.type === "create") {
      setFormSlug(generateSlug(name))
    }
  }

  const openCreateDialog = () => {
    setFormNameState("")
    setFormSlug("")
    setDialog({ type: "create", project: null, isLoading: false })
  }

  const openRenameDialog = (project: Project) => {
    setFormNameState(project.name)
    setFormSlug(project.slug)
    setDialog({ type: "rename", project, isLoading: false })
  }

  const openDeleteDialog = (project: Project) => {
    setFormNameState("")
    setFormSlug("")
    setDialog({ type: "delete", project, isLoading: false })
  }

  const closeDialog = () => {
    if (dialog.isLoading) return // prevent closing while loading
    setDialog({ type: null, project: null, isLoading: false })
    setFormNameState("")
    setFormSlug("")
  }

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    if (!dialog.type || dialog.isLoading) return

    setDialog(prev => ({ ...prev, isLoading: true }))

    // Simulate load state delay (600ms)
    await new Promise(resolve => setTimeout(resolve, 600))

    if (dialog.type === "create") {
      if (!formName.trim()) {
        setDialog(prev => ({ ...prev, isLoading: false }))
        return
      }
      const newProject: Project = {
        id: Math.random().toString(36).substring(2, 11),
        name: formName.trim(),
        slug: formSlug || generateSlug(formName),
        owner: "me",
        isOwned: true,
      }
      setProjects(prev => [...prev, newProject])
    } else if (dialog.type === "rename" && dialog.project) {
      if (!formName.trim()) {
        setDialog(prev => ({ ...prev, isLoading: false }))
        return
      }
      const targetId = dialog.project.id
      setProjects(prev =>
        prev.map(p =>
          p.id === targetId
            ? { ...p, name: formName.trim(), slug: generateSlug(formName) }
            : p
        )
      )
    } else if (dialog.type === "delete" && dialog.project) {
      const targetId = dialog.project.id
      setProjects(prev => prev.filter(p => p.id !== targetId))
    }

    setDialog({ type: null, project: null, isLoading: false })
    setFormNameState("")
    setFormSlug("")
  }

  return (
    <ProjectContext.Provider
      value={{
        projects,
        dialog,
        formName,
        formSlug,
        openCreateDialog,
        openRenameDialog,
        openDeleteDialog,
        closeDialog,
        setFormName,
        handleSubmit,
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
