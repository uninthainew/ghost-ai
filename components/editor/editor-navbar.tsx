"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { PanelLeftOpen, PanelLeftClose } from "lucide-react"

interface EditorNavbarProps {
  sidebarOpen: boolean
  onToggleSidebar: () => void
}

export function EditorNavbar({ sidebarOpen, onToggleSidebar }: EditorNavbarProps) {
  return (
    <header className="sticky top-0 z-50 flex h-14 w-full items-center justify-between border-b border-border/40 bg-background/95 px-4 backdrop-blur-md supports-backdrop-filter:bg-background/60">
      {/* Left section: Sidebar toggle + Logo/Title */}
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={onToggleSidebar}
          aria-label={sidebarOpen ? "Close sidebar" : "Open sidebar"}
          className="h-8 w-8 rounded-md border border-border/30 hover:bg-accent hover:text-accent-foreground transition-all duration-200"
        >
          {sidebarOpen ? (
            <PanelLeftClose className="h-4 w-4" />
          ) : (
            <PanelLeftOpen className="h-4 w-4" />
          )}
        </Button>
        <span className="font-heading text-sm font-semibold tracking-tight text-foreground/90">
          Ghost AI Editor
        </span>
      </div>

      {/* Center section: Canvas/Editor state placeholder */}
      <div className="flex items-center gap-2">
        <span className="text-xs text-muted-foreground font-mono bg-muted/40 px-2.5 py-0.5 rounded-full border border-border/10">
          v0.1.0
        </span>
      </div>

      {/* Right section: Empty for now */}
      <div className="flex items-center gap-2 w-[100px] justify-end">
        {/* Intentionally left empty per specification */}
      </div>
    </header>
  )
}
