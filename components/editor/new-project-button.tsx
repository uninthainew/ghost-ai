"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { useProjectDialogs } from "@/components/editor/project-context"

export function NewProjectButton() {
  const { openCreateDialog } = useProjectDialogs()

  return (
    <Button
      onClick={openCreateDialog}
      className="flex items-center gap-2 mt-2 transition-all duration-200"
    >
      <Plus className="h-4.5 w-4.5" />
      New Project
    </Button>
  )
}
