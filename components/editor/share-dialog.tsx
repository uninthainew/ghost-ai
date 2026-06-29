"use client"

import * as React from "react"
import { useProjectDialogs } from "./project-context"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Loader2, Trash2, Copy, Check, User, Shield } from "lucide-react"

interface Collaborator {
  id: string
  email: string
  name: string | null
  imageUrl: string | null
  createdAt: string
}

interface Owner {
  id: string
  email: string
  name: string
  imageUrl: string | null
}

interface FetchResponse {
  owner: Owner
  collaborators: Collaborator[]
}

export function ShareDialog() {
  const { dialog, closeDialog } = useProjectDialogs()
  const project = dialog.project
  const isOpen = dialog.type === "share" && !!project?.isOwned

  React.useEffect(() => {
    if (dialog.type === "share" && project && !project.isOwned) {
      closeDialog()
    }
  }, [dialog.type, project, closeDialog])

  const [loading, setLoading] = React.useState(false)
  const [data, setData] = React.useState<FetchResponse | null>(null)
  const [inviteEmail, setInviteEmail] = React.useState("")
  const [isInviting, setIsInviting] = React.useState(false)
  const [removingId, setRemovingId] = React.useState<string | null>(null)
  const [error, setError] = React.useState<string | null>(null)
  const [copied, setCopied] = React.useState(false)

  const fetchCollaborators = React.useCallback(async (signal?: AbortSignal) => {
    if (!project?.id) return
    const currentProjectId = project.id
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`/api/projects/${currentProjectId}/collaborators`, { signal })
      if (!res.ok) throw new Error("Failed to fetch collaborators")
      const result = await res.json()
      if (project?.id === currentProjectId) {
        setData(result)
      }
    } catch (err: any) {
      if (err?.name === "AbortError") return
      console.error(err)
      if (project?.id === currentProjectId) {
        setError(err.message || "An error occurred while loading collaborators")
      }
    } finally {
      if (project?.id === currentProjectId) {
        setLoading(false)
      }
    }
  }, [project?.id])

  React.useEffect(() => {
    // Reset state immediately on open/close or project change
    setData(null)
    setError(null)
    setInviteEmail("")

    const controller = new AbortController()
    if (isOpen) {
      fetchCollaborators(controller.signal)
    }
    return () => controller.abort()
  }, [isOpen, fetchCollaborators])

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!project?.id || !inviteEmail.trim() || isInviting) return
    setIsInviting(true)
    setError(null)

    try {
      const res = await fetch(`/api/projects/${project.id}/collaborators`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: inviteEmail.trim() }),
      })

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}))
        throw new Error(errorData.error || "Failed to invite collaborator")
      }

      setInviteEmail("")
      await fetchCollaborators()
    } catch (err: any) {
      console.error(err)
      setError(err.message || "An error occurred during invitation")
    } finally {
      setIsInviting(false)
    }
  }

  const handleRemove = async (collab: Collaborator) => {
    if (!project?.id || removingId) return
    setRemovingId(collab.id)
    setError(null)

    try {
      const res = await fetch(`/api/projects/${project.id}/collaborators?id=${collab.id}`, {
        method: "DELETE",
      })

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}))
        throw new Error(errorData.error || "Failed to remove collaborator")
      }

      await fetchCollaborators()
    } catch (err: any) {
      console.error(err)
      setError(err.message || "An error occurred while removing collaborator")
    } finally {
      setRemovingId(null)
    }
  }

  const handleCopyLink = async () => {
    if (!project?.id) return
    const link = `${window.location.origin}/editor/${project.id}`
    try {
      await navigator.clipboard.writeText(link)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      setError("Failed to copy project link")
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && closeDialog()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share Project</DialogTitle>
          <DialogDescription>
            Manage who has access to <span className="font-semibold text-foreground">&quot;{project?.name}&quot;</span>.
          </DialogDescription>
        </DialogHeader>

        {/* Error Message */}
        {error && (
          <div className="rounded-lg bg-destructive/10 p-3 text-xs text-destructive border border-destructive/20 animate-in fade-in duration-200">
            {error}
          </div>
        )}

        {/* Invite Form (only for owners) */}
        {project?.isOwned && (
          <form onSubmit={handleInvite} className="flex gap-2 items-center">
            <Input
              type="email"
              placeholder="Collaborator email"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              disabled={isInviting || loading}
              required
              className="flex-1 h-9 rounded-lg"
            />
            <Button type="submit" disabled={isInviting || loading || !inviteEmail.trim()} size="sm" className="h-9">
              {isInviting ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                "Invite"
              )}
            </Button>
          </form>
        )}

        {/* Members List */}
        <div className="space-y-3 py-2">
          <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block">
            People with access
          </span>

          {loading && !data ? (
            <div className="flex flex-col items-center justify-center py-6 text-muted-foreground">
              <Loader2 className="h-6 w-6 animate-spin mb-2" />
              <span className="text-xs">Loading members...</span>
            </div>
          ) : (
            <div className="space-y-2.5 max-h-[220px] overflow-y-auto pr-1">
              {data && (
                <>
                  {/* Project Owner */}
                  <div className="flex items-center justify-between p-2 rounded-lg bg-muted/30 border border-border/10">
                    <div className="flex items-center gap-2.5 min-w-0">
                      {data.owner.imageUrl ? (
                        <img
                          src={data.owner.imageUrl}
                          alt={data.owner.name}
                          className="h-8 w-8 rounded-full object-cover border border-border/20 shrink-0"
                        />
                      ) : (
                        <div className="h-8 w-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                          <User className="h-4 w-4 text-primary" />
                        </div>
                      )}
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-medium text-foreground truncate max-w-[150px] sm:max-w-[200px]">
                            {data.owner.name}
                          </span>
                          <span className="inline-flex items-center gap-0.5 rounded px-1.5 py-0.5 text-[9px] font-medium bg-primary/10 text-primary border border-primary/20">
                            <Shield className="h-2.5 w-2.5" />
                            Owner
                          </span>
                        </div>
                        <span className="text-[10px] text-muted-foreground block truncate">
                          {data.owner.email || "Primary Owner"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Collaborators */}
                  {data.collaborators.length === 0 ? (
                    <div className="text-center py-6 border border-dashed border-border/20 rounded-lg text-muted-foreground text-xs">
                      No collaborators invited yet.
                    </div>
                  ) : (
                    data.collaborators.map((collab) => (
                      <div
                        key={collab.id}
                        className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/20 border border-border/5 transition-colors"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          {collab.imageUrl ? (
                            <img
                              src={collab.imageUrl}
                              alt={collab.name || collab.email}
                              className="h-8 w-8 rounded-full object-cover border border-border/10 shrink-0"
                            />
                          ) : (
                            <div className="h-8 w-8 rounded-full bg-muted border border-border/20 flex items-center justify-center shrink-0">
                              <User className="h-4 w-4 text-muted-foreground" />
                            </div>
                          )}
                          <div className="min-w-0">
                            {collab.name ? (
                              <>
                                <span className="text-xs font-medium text-foreground block truncate max-w-[150px] sm:max-w-[200px]">
                                  {collab.name}
                                </span>
                                <span className="text-[10px] text-muted-foreground block truncate">
                                  {collab.email}
                                </span>
                              </>
                            ) : (
                              <span className="text-xs font-medium text-foreground block truncate max-w-[220px]">
                                {collab.email}
                              </span>
                            )}
                          </div>
                        </div>

                        {project?.isOwned && (
                          <Button
                            variant="ghost"
                            size="icon-xs"
                            onClick={() => handleRemove(collab)}
                            disabled={removingId === collab.id || isInviting}
                            className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-md shrink-0 transition-colors"
                            title="Remove collaborator"
                          >
                            {removingId === collab.id ? (
                              <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            ) : (
                              <Trash2 className="h-3.5 w-3.5" />
                            )}
                          </Button>
                        )}
                      </div>
                    ))
                  )}
                </>
              )}
            </div>
          )}
        </div>

        {/* Copy Link Section (only for owners) */}
        {project?.isOwned && (
          <div className="pt-2 border-t border-border/10 flex items-center justify-between gap-4 mt-2">
            <div className="min-w-0">
              <span className="text-[10px] text-muted-foreground uppercase tracking-wider block mb-0.5">
                Project Link
              </span>
              <span className="text-xs text-foreground/80 truncate block max-w-[220px] sm:max-w-[280px]">
                {project ? `${window.location.origin}/editor/${project.id}` : ""}
              </span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopyLink}
              className="shrink-0 h-9 rounded-lg border-border/40 font-medium"
            >
              {copied ? (
                <>
                  <Check className="h-3.5 w-3.5 text-green-500 mr-1.5" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
                  Copy Link
                </>
              )}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
