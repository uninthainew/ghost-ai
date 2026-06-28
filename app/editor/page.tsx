import * as React from "react"
import { NewProjectButton } from "@/components/editor/new-project-button"

export default function EditorPage() {
  return (
    <main className="flex-1 overflow-auto p-8 flex flex-col items-center justify-center bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] dark:bg-[radial-gradient(#1f2937_1px,transparent_1px)]">
      <div className="max-w-md text-center flex flex-col items-center gap-4">
        <h1 className="font-heading text-2xl font-bold tracking-tight text-foreground/95 leading-tight">
          Create a project or open an existing one
        </h1>
        <p className="text-sm text-muted-foreground max-w-xs">
          Start a new architecture workspace, or choose a project from the sidebar.
        </p>
        <NewProjectButton />
      </div>
    </main>
  )
}
