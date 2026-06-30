"use client"

import * as React from "react"
import { useParams } from "next/navigation"
import { useProjectDialogs } from "@/components/editor/project-context"
import { Button } from "@/components/ui/button"
import { PanelLeftOpen, PanelLeftClose, Share2, Sparkles } from "lucide-react"
import { UserButton } from "@clerk/nextjs"
import { cn } from "@/lib/utils"

import Link from "next/link"

interface EditorNavbarProps {
  sidebarOpen?: boolean
  onToggleSidebar?: () => void
}

export function EditorNavbar({ sidebarOpen: propSidebarOpen, onToggleSidebar: propOnToggleSidebar }: EditorNavbarProps) {
  const params = useParams()
  const { projects, isAiOpen, toggleAiSidebar, isSidebarOpen, setSidebarOpen, openShareDialog } = useProjectDialogs()

  const sidebarOpen = propSidebarOpen !== undefined ? propSidebarOpen : isSidebarOpen
  const onToggleSidebar = propOnToggleSidebar || (() => setSidebarOpen(!isSidebarOpen))

  const activeProject = projects.find((p) => p.id === params?.roomId)

  return (
    <header className="sticky top-0 z-50 flex h-14 w-full items-center justify-between border-b border-border/40 bg-background/95 px-4 backdrop-blur-md supports-backdrop-filter:bg-background/60 shrink-0">
      {/* Left section: Sidebar toggle + Logo/Title */}
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={onToggleSidebar}
          aria-label={sidebarOpen ? "Close sidebar" : "Open sidebar"}
          className="h-8 w-8 rounded-md border border-border/30 hover:bg-accent hover:text-accent-foreground transition-all duration-200 shrink-0"
        >
          {sidebarOpen ? (
            <PanelLeftClose className="h-4 w-4" />
          ) : (
            <PanelLeftOpen className="h-4 w-4" />
          )}
        </Button>
        <Link 
          href="/editor" 
          className="font-heading text-sm font-semibold tracking-tight text-foreground/90 hover:text-foreground/75 transition-colors truncate max-w-[200px] xs:max-w-[300px] flex items-center gap-1.5"
        >
          {activeProject ? (
            <>
              <span className="text-muted-foreground/50 font-normal">Editor /</span>
              <span>{activeProject.name}</span>
            </>
          ) : (
            "Ghost AI Editor"
          )}
        </Link>
      </div>

      {/* Center section: Version / Page Context */}
      <div className="hidden md:flex items-center gap-2">
        {!activeProject && (
          <span className="text-xs text-muted-foreground font-mono bg-muted/40 px-2.5 py-0.5 rounded-full border border-border/10">
            v0.1.0
          </span>
        )}
      </div>

      {/* Right section: Actions (Share, AI Toggle) + UserButton */}
      <div className="flex items-center gap-2.5 justify-end">
        {activeProject && (
          <>
            <Button
              variant="outline"
              size="sm"
              className="hidden sm:flex items-center gap-1.5 rounded-lg border-border/40 font-medium"
              onClick={() => {
                openShareDialog(activeProject)
              }}
            >
              <Share2 className="h-3.5 w-3.5 text-muted-foreground" />
              Share
            </Button>
            <Button
              variant={isAiOpen ? "default" : "outline"}
              size="sm"
              className={cn(
                "flex items-center gap-1.5 rounded-lg font-medium",
                isAiOpen
                  ? "bg-primary text-primary-foreground hover:bg-primary/95"
                  : "border-border/40"
              )}
              onClick={toggleAiSidebar}
            >
              <Sparkles
                className={cn(
                  "h-3.5 w-3.5",
                  isAiOpen ? "text-primary-foreground animate-pulse" : "text-primary"
                )}
              />
              <span className="hidden xs:inline">AI Assistant</span>
            </Button>
            <div className="w-[1px] h-5 bg-border/40 mx-0.5 shrink-0" />
          </>
        )}
        <div className="shrink-0 flex items-center justify-center">
          <UserButton />
        </div>
      </div>
    </header>
  )
}
