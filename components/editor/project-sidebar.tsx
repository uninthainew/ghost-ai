"use client"

import * as React from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { X, Plus, Folder, Users, FolderKanban, Pencil, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"
import { useProjectDialogs } from "./project-context"

interface ProjectSidebarProps {
  isOpen: boolean
  onClose: () => void
}

export function ProjectSidebar({ isOpen, onClose }: ProjectSidebarProps) {
  const {
    projects,
    openCreateDialog,
    openRenameDialog,
    openDeleteDialog,
  } = useProjectDialogs()

  const params = useParams()
  const activeProjectId = params?.projectId as string | undefined

  const myProjects = projects.filter((p) => p.isOwned)
  const sharedProjects = projects.filter((p) => !p.isOwned)

  return (
    <>
      {/* Backdrop overlay (clicking it closes the sidebar) - only on mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/40 backdrop-blur-xs transition-opacity duration-300 md:hidden"
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
        <div className="flex-1 overflow-hidden p-4 flex flex-col">
          <Tabs defaultValue="my-projects" className="flex h-full flex-col">
            <TabsList className="grid w-full grid-cols-2 bg-muted/40 p-1 border border-border/10 rounded-lg shrink-0">
              <TabsTrigger value="my-projects" className="text-xs">
                My Projects
              </TabsTrigger>
              <TabsTrigger value="shared" className="text-xs">
                Shared
              </TabsTrigger>
            </TabsList>

            {/* My Projects Tab Content */}
            <TabsContent value="my-projects" className="flex-1 mt-4 outline-none overflow-hidden flex flex-col">
              {myProjects.length === 0 ? (
                <div className="flex h-[300px] flex-col items-center justify-center rounded-lg border border-dashed border-border/50 bg-muted/10 p-6 text-center transition-colors hover:bg-muted/20">
                  <div className="rounded-full bg-muted/30 p-3 mb-3 border border-border/10">
                    <Folder className="h-6 w-6 text-muted-foreground/80" />
                  </div>
                  <h3 className="text-sm font-medium text-foreground/90">No projects yet</h3>
                  <p className="text-xs text-muted-foreground mt-1 max-w-[180px]">
                    Get started by creating your first workspace.
                  </p>
                </div>
              ) : (
                <div className="flex-1 overflow-y-auto pr-1 space-y-1">
                  {myProjects.map((project) => (
                    <div
                      key={project.id}
                      className={cn(
                        "group relative flex items-center justify-between rounded-lg hover:bg-accent/50 transition-all duration-200 animate-in fade-in-50",
                        project.id === activeProjectId && "bg-accent/80 text-accent-foreground font-semibold"
                      )}
                    >
                      <Link
                        href={`/editor/${project.id}`}
                        onClick={onClose}
                        className="flex flex-1 items-center gap-2.5 min-w-0 px-3 py-2 pr-14 text-sm text-foreground cursor-pointer"
                      >
                        <Folder className={cn(
                          "h-4.5 w-4.5 shrink-0 text-muted-foreground group-hover:text-foreground transition-colors",
                          project.id === activeProjectId && "text-primary"
                        )} />
                        <span className="truncate font-medium text-foreground/90" title={project.name}>
                          {project.name}
                        </span>
                      </Link>
                      <div className="absolute right-2 flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                        <Button
                          variant="ghost"
                          size="icon-xs"
                          onClick={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            openRenameDialog(project)
                          }}
                          aria-label={`Rename ${project.name}`}
                          className="h-6 w-6 rounded-md hover:bg-accent hover:text-accent-foreground"
                        >
                          <Pencil className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon-xs"
                          onClick={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            openDeleteDialog(project)
                          }}
                          aria-label={`Delete ${project.name}`}
                          className="h-6 w-6 rounded-md text-destructive hover:bg-destructive/10 hover:text-destructive"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>

            {/* Shared Tab Content */}
            <TabsContent value="shared" className="flex-1 mt-4 outline-none overflow-hidden flex flex-col">
              {sharedProjects.length === 0 ? (
                <div className="flex h-[300px] flex-col items-center justify-center rounded-lg border border-dashed border-border/50 bg-muted/10 p-6 text-center transition-colors hover:bg-muted/20">
                  <div className="rounded-full bg-muted/30 p-3 mb-3 border border-border/10">
                    <Users className="h-6 w-6 text-muted-foreground/80" />
                  </div>
                  <h3 className="text-sm font-medium text-foreground/90">No shared projects</h3>
                  <p className="text-xs text-muted-foreground mt-1 max-w-[180px]">
                    Projects shared with you by others will appear here.
                  </p>
                </div>
              ) : (
                <div className="flex-1 overflow-y-auto pr-1 space-y-1">
                  {sharedProjects.map((project) => (
                    <Link
                      key={project.id}
                      href={`/editor/${project.id}`}
                      onClick={onClose}
                      className={cn(
                        "group flex items-center justify-between rounded-lg px-3 py-2 text-sm text-foreground hover:bg-accent/50 transition-all duration-200 cursor-pointer",
                        project.id === activeProjectId && "bg-accent/80 text-accent-foreground font-semibold"
                      )}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <Folder className={cn(
                          "h-4.5 w-4.5 shrink-0 text-muted-foreground group-hover:text-foreground transition-colors",
                          project.id === activeProjectId && "text-primary"
                        )} />
                        <div className="flex flex-col min-w-0">
                          <span className="truncate font-medium text-foreground/90" title={project.name}>
                            {project.name}
                          </span>
                          <span className="text-[10px] text-muted-foreground truncate">
                            By {project.owner}
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar Footer with Create Button */}
        <div className="p-4 border-t border-border/40 bg-muted/10">
          <Button
            onClick={openCreateDialog}
            className="w-full flex items-center justify-center gap-2 text-xs font-semibold py-2 transition-all duration-200"
          >
            <Plus className="h-4 w-4" />
            New Project
          </Button>
        </div>
      </aside>
    </>
  )
}
