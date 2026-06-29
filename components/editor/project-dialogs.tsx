"use client"

import * as React from "react"
import { useProjectDialogs } from "./project-context"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { ShareDialog } from "./share-dialog"

export function ProjectDialogs() {
  const {
    dialog,
    formName,
    formSlug,
    closeDialog,
    setFormName,
    handleSubmit,
  } = useProjectDialogs()

  return (
    <>
      {/* Create Project Dialog */}
      <Dialog
        open={dialog.type === "create"}
        onOpenChange={(open) => !open && closeDialog()}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Project</DialogTitle>
            <DialogDescription>
              Create a new architecture workspace to start planning your design.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 py-2">
            <div className="space-y-1.5">
              <label
                htmlFor="create-name"
                className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider"
              >
                Project Name
              </label>
              <Input
                id="create-name"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                placeholder="e.g. My E-commerce System"
                disabled={dialog.isLoading}
                required
                autoFocus
              />
            </div>

            {formName.trim() && (
              <div className="rounded-lg bg-muted/40 p-2.5 border border-border/10">
                <span className="text-[10px] text-muted-foreground uppercase tracking-wider block mb-1">
                  Live Slug Preview
                </span>
                <code className="text-xs font-mono font-medium text-primary select-all break-all">
                  {formSlug}
                </code>
              </div>
            )}

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={closeDialog}
                disabled={dialog.isLoading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={dialog.isLoading || !formName.trim()}
              >
                {dialog.isLoading && (
                  <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                )}
                Create Project
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Rename Project Dialog */}
      <Dialog
        open={dialog.type === "rename"}
        onOpenChange={(open) => !open && closeDialog()}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rename Project</DialogTitle>
            <DialogDescription>
              Renaming project: <span className="font-semibold text-foreground">&quot;{dialog.project?.name}&quot;</span>
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 py-2">
            <div className="space-y-1.5">
              <label
                htmlFor="rename-name"
                className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider"
              >
                New Project Name
              </label>
              <Input
                id="rename-name"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                placeholder="New project name"
                disabled={dialog.isLoading}
                required
                autoFocus
              />
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={closeDialog}
                disabled={dialog.isLoading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={dialog.isLoading || !formName.trim()}
              >
                {dialog.isLoading && (
                  <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                )}
                Rename
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Project Dialog */}
      <Dialog
        open={dialog.type === "delete"}
        onOpenChange={(open) => !open && closeDialog()}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Project</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete <span className="font-semibold text-foreground">&quot;{dialog.project?.name}&quot;</span>? This action cannot be undone and will permanently remove this project.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2 mt-4 pt-4 border-t border-border/10">
            <Button
              variant="outline"
              onClick={closeDialog}
              disabled={dialog.isLoading}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => handleSubmit()}
              disabled={dialog.isLoading}
            >
              {dialog.isLoading && (
                <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
              )}
              Delete Project
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      <ShareDialog />
    </>
  )
}
