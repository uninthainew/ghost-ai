import * as React from "react"
import { type CanvasNode, type CanvasEdge } from "@/types/canvas"
import { type SaveStatus, useProjectDialogs } from "@/components/editor/project-context"

export function useCanvasAutosave(
  projectId: string,
  nodes: CanvasNode[],
  edges: CanvasEdge[],
  isInitialLoadDone: boolean,
  setSaveStatus: (status: SaveStatus) => void
) {
  const lastSavedJsonRef = React.useRef<string>("")
  const debounceTimerRef = React.useRef<NodeJS.Timeout | null>(null)
  const { manualSaveRef } = useProjectDialogs()

  // Initialize lastSavedJsonRef when initial load is completed
  React.useEffect(() => {
    if (isInitialLoadDone && !lastSavedJsonRef.current) {
      lastSavedJsonRef.current = JSON.stringify({ nodes, edges })
    }
  }, [isInitialLoadDone, nodes, edges])

  // Immediate save function for manual trigger
  const saveCanvas = React.useCallback(async () => {
    if (!isInitialLoadDone) return

    const currentJson = JSON.stringify({ nodes, edges })
    
    // Clear any existing debounce timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current)
      debounceTimerRef.current = null
    }

    setSaveStatus("saving")

    try {
      const res = await fetch(`/api/projects/${projectId}/canvas`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: currentJson,
      })

      if (!res.ok) {
        const errorText = await res.text().catch(() => "")
        throw new Error(`Failed to save canvas: status ${res.status}, response: ${errorText}`)
      }

      lastSavedJsonRef.current = currentJson
      setSaveStatus("saved")
    } catch (error) {
      console.error("Manual save error:", error)
      setSaveStatus("error")
    }
  }, [nodes, edges, projectId, isInitialLoadDone, setSaveStatus])

  // Register the manual save function in the project context ref
  React.useEffect(() => {
    manualSaveRef.current = saveCanvas
    return () => {
      manualSaveRef.current = null
    }
  }, [saveCanvas, manualSaveRef])

  // Debounced auto-save effect
  React.useEffect(() => {
    if (!isInitialLoadDone) return

    const currentJson = JSON.stringify({ nodes, edges })
    
    // If the content is identical to what's already saved, do nothing
    if (currentJson === lastSavedJsonRef.current) {
      return
    }

    // Clear any existing debounce timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current)
    }

    setSaveStatus("saving")

    // Set a new debounce timer (2.5 seconds)
    debounceTimerRef.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/projects/${projectId}/canvas`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: currentJson,
        })

        if (!res.ok) {
          const errorText = await res.text().catch(() => "")
          throw new Error(`Failed to auto-save canvas: status ${res.status}, response: ${errorText}`)
        }

        lastSavedJsonRef.current = currentJson
        setSaveStatus("saved")
      } catch (error) {
        console.error("Autosave error:", error)
        setSaveStatus("error")
      }
    }, 2500)

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current)
      }
    }
  }, [nodes, edges, projectId, isInitialLoadDone, setSaveStatus])
}
