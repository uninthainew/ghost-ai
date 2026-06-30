import { useEffect } from "react"
import { useReactFlow } from "@xyflow/react"

type ReactFlowInstance = ReturnType<typeof useReactFlow>

export function useKeyboardShortcuts(
  reactFlowInstance: ReactFlowInstance,
  undo: () => void,
  redo: () => void,
  disabled = false
) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (disabled) {
        return
      }

      // 1. Ignore shortcuts when typing in inputs, textareas, or editable elements, or if inside a dialog
      const target = event.target as HTMLElement | null
      const activeEl = document.activeElement as HTMLElement | null

      const isEditable = (el: HTMLElement | null) => {
        if (!el) return false
        const tagName = el.tagName.toUpperCase()
        return (
          tagName === "INPUT" ||
          tagName === "TEXTAREA" ||
          tagName === "SELECT" ||
          el.getAttribute("contenteditable") === "true" ||
          el.isContentEditable
        )
      }

      const isInsideDialog = (el: HTMLElement | null) => {
        if (!el) return false
        return !!el.closest("dialog, [role=\"dialog\"]")
      }

      if (
        isEditable(target) ||
        isEditable(activeEl) ||
        isInsideDialog(target) ||
        isInsideDialog(activeEl)
      ) {
        return
      }

      // Check modifier keys
      const isCtrlOrCmd = event.ctrlKey || event.metaKey

      // 2. Supported shortcuts:
      // - Cmd/Ctrl + z to undo
      if (isCtrlOrCmd && event.key.toLowerCase() === "z" && !event.shiftKey) {
        event.preventDefault()
        undo()
        return
      }

      // - Cmd/Ctrl + Shift + z to redo
      if (isCtrlOrCmd && event.key.toLowerCase() === "z" && event.shiftKey) {
        event.preventDefault()
        redo()
        return
      }

      // - Cmd/Ctrl + y to redo
      if (isCtrlOrCmd && event.key.toLowerCase() === "y") {
        event.preventDefault()
        redo()
        return
      }

      // - Cmd/Ctrl + 0 to fit view
      if (isCtrlOrCmd && event.key === "0") {
        event.preventDefault()
        reactFlowInstance.fitView({ duration: 300 })
        return
      }

      // - + or = to zoom in
      if (event.key === "+" || event.key === "=") {
        event.preventDefault()
        reactFlowInstance.zoomIn({ duration: 300 })
        return
      }

      // - - to zoom out
      if (event.key === "-") {
        event.preventDefault()
        reactFlowInstance.zoomOut({ duration: 300 })
        return
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [reactFlowInstance, undo, redo, disabled])
}
