"use client"

import * as React from "react"
import { useRouter, useParams } from "next/navigation"
import { Project, DialogState } from "@/components/editor/project-context"
import { generateSlug } from "@/components/editor/project-context"

export function useProjectAction() {
  const router = useRouter()
  const params = useParams()
  const activeProjectId = params?.projectId as string | undefined

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
    if (dialog.isLoading) return
    setDialog({ type: null, project: null, isLoading: false })
    setFormNameState("")
    setFormSlug("")
  }

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    if (!dialog.type || dialog.isLoading) return

    setDialog((prev) => ({ ...prev, isLoading: true }))

    try {
      if (dialog.type === "create") {
        if (!formName.trim()) {
          setDialog((prev) => ({ ...prev, isLoading: false }))
          return
        }

        // Generate short unique suffix
        const suffix = Math.random().toString(36).substring(2, 7)
        const baseSlug = generateSlug(formName)
        const roomId = `${baseSlug}-${suffix}`

        const res = await fetch("/api/projects", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: formName.trim(),
            id: roomId,
          }),
        })

        if (!res.ok) {
          throw new Error("Failed to create project")
        }

        const project = await res.json()
        closeDialog()
        router.refresh()
        router.push(`/editor/${project.id}`)
      } else if (dialog.type === "rename" && dialog.project) {
        if (!formName.trim()) {
          setDialog((prev) => ({ ...prev, isLoading: false }))
          return
        }

        const res = await fetch(`/api/projects/${dialog.project.id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: formName.trim(),
          }),
        })

        if (!res.ok) {
          throw new Error("Failed to rename project")
        }

        closeDialog()
        router.refresh()
      } else if (dialog.type === "delete" && dialog.project) {
        const targetId = dialog.project.id
        const res = await fetch(`/api/projects/${targetId}`, {
          method: "DELETE",
        })

        if (!res.ok) {
          throw new Error("Failed to delete project")
        }

        closeDialog()
        if (activeProjectId === targetId) {
          router.push("/editor")
          router.refresh()
        } else {
          router.refresh()
        }
      }
    } catch (error) {
      console.error("Mutation error:", error)
      setDialog((prev) => ({ ...prev, isLoading: false }))
    }
  }

  return {
    dialog,
    formName,
    formSlug,
    openCreateDialog,
    openRenameDialog,
    openDeleteDialog,
    closeDialog,
    setFormName,
    handleSubmit,
  }
}
