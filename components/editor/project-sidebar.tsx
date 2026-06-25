"use client"

import * as React from "react"
import { X, Plus, Folder, Users, FolderKanban } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"

interface ProjectSidebarProps {
  isOpen: boolean
  onClose: () => void
}

export function ProjectSidebar({ isOpen, onClose }: ProjectSidebarProps) {
  return (
    <>
      {/* Backdrop overlay (clicking it closes the sidebar) */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/40 backdrop-blur-xs transition-opacity duration-300 md:bg-black/20"
          onClick={onClose}
        />
      )}

      {/* Floating Sidebar Shell */}
      <aside
        className={cn(
          "fixed top-14 left-0 bottom-0 z-40 flex w-80 flex-col border-r border-border/40 bg-card/95 text-card-foreground backdrop-blur-md transition-transform duration-300 ease-in-out shadow-2xl",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Sidebar Header */}
        <div className="flex h-14 items-center justify-between px-4 border-b border-border/40">
          <div className="flex items-center gap-2">
            <FolderKanban className="h-4.5 w-4.5 text-muted-foreground" />
            <h2 className="font-heading text-sm font-semibold tracking-tight text-foreground">
              Projects
            </h2>
          </div>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={onClose}
            aria-label="Close sidebar"
            className="h-8 w-8 rounded-md hover:bg-accent hover:text-accent-foreground"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Sidebar Navigation/Tabs */}
        <div className="flex-1 overflow-hidden p-4">
          <Tabs defaultValue="my-projects" className="flex h-full flex-col">
            <TabsList className="grid w-full grid-cols-2 bg-muted/40 p-1 border border-border/10 rounded-lg">
              <TabsTrigger value="my-projects" className="text-xs">
                My Projects
              </TabsTrigger>
              <TabsTrigger value="shared" className="text-xs">
                Shared
              </TabsTrigger>
            </TabsList>

            {/* My Projects Tab Content */}
            <TabsContent value="my-projects" className="flex-1 mt-4 outline-none">
              <div className="flex h-[300px] flex-col items-center justify-center rounded-lg border border-dashed border-border/50 bg-muted/10 p-6 text-center transition-colors hover:bg-muted/20">
                <div className="rounded-full bg-muted/30 p-3 mb-3 border border-border/10">
                  <Folder className="h-6 w-6 text-muted-foreground/80" />
                </div>
                <h3 className="text-sm font-medium text-foreground/90">No projects yet</h3>
                <p className="text-xs text-muted-foreground mt-1 max-w-[180px]">
                  Get started by creating your first workspace.
                </p>
              </div>
            </TabsContent>

            {/* Shared Tab Content */}
            <TabsContent value="shared" className="flex-1 mt-4 outline-none">
              <div className="flex h-[300px] flex-col items-center justify-center rounded-lg border border-dashed border-border/50 bg-muted/10 p-6 text-center transition-colors hover:bg-muted/20">
                <div className="rounded-full bg-muted/30 p-3 mb-3 border border-border/10">
                  <Users className="h-6 w-6 text-muted-foreground/80" />
                </div>
                <h3 className="text-sm font-medium text-foreground/90">No shared projects</h3>
                <p className="text-xs text-muted-foreground mt-1 max-w-[180px]">
                  Projects shared with you by others will appear here.
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar Footer with Create Button */}
        <div className="p-4 border-t border-border/40 bg-muted/10">
          <Button className="w-full flex items-center justify-center gap-2 text-xs font-semibold py-2 transition-all duration-200">
            <Plus className="h-4 w-4" />
            New Project
          </Button>
        </div>
      </aside>
    </>
  )
}
