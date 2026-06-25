"use client"

import * as React from "react"

export default function EditorPage() {
  return (
    <main className="flex-1 overflow-auto p-8 flex flex-col items-center justify-center bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] dark:bg-[radial-gradient(#1f2937_1px,transparent_1px)]">
      <div className="max-w-md text-center p-8 border border-border/40 bg-card/60 backdrop-blur-xs rounded-xl shadow-lg">
        <h1 className="font-heading text-xl font-bold tracking-tight mb-2">
          Editor Canvas
        </h1>
        <p className="text-sm text-muted-foreground">
          Toggle the project sidebar using the button in the top left to see your workspace settings and projects.
        </p>
      </div>
    </main>
  )
}
