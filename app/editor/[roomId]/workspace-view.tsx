"use client"

import * as React from "react"
import { useProjectDialogs } from "@/components/editor/project-context"
import { CanvasWrapper } from "@/components/editor/canvas-wrapper"
import { AiSidebar } from "@/components/editor/ai-sidebar"

interface ProjectType {
  id: string
  name: string
  description?: string | null
  cancasJsonPath?: string | null
}

interface WorkspaceViewProps {
  project: ProjectType
}

export function WorkspaceView({ project }: WorkspaceViewProps) {
  const { isAiOpen, toggleAiSidebar } = useProjectDialogs()

  return (
    <div className="flex flex-1 overflow-hidden h-[calc(100vh-3.5rem)] relative">
      {/* Central Canvas Workspace */}
      <main className="flex-1 flex flex-col bg-[#0f0f11] relative overflow-hidden select-none">

        {/* Liveblocks Collaborative React Flow Canvas */}
        <CanvasWrapper project={project} />
      </main>

      {/* AI Assistant Chat Panel (Right Sidebar) */}
      <AiSidebar isOpen={isAiOpen} onClose={toggleAiSidebar} />
    </div>
  )
}
