import type { Node, Edge } from "@xyflow/react"

export interface ColorPaletteOption {
  id: string
  name: string
  backgroundColor: string
  textColor: string
}

export const NODE_COLOR_PALETTE: ColorPaletteOption[] = [
  {
    id: "default",
    name: "Default",
    backgroundColor: "#18181c",
    textColor: "#d4d4d8", // zinc-300
  },
  {
    id: "blue",
    name: "Blue",
    backgroundColor: "#3b82f6", // default node color
    textColor: "#ffffff",
  },
  {
    id: "green",
    name: "Green",
    backgroundColor: "#10b981",
    textColor: "#ffffff",
  },
  {
    id: "purple",
    name: "Purple",
    backgroundColor: "#8b5cf6",
    textColor: "#ffffff",
  },
  {
    id: "amber",
    name: "Amber",
    backgroundColor: "#f59e0b",
    textColor: "#1e293b", // slate-900 for readability
  },
  {
    id: "rose",
    name: "Rose",
    backgroundColor: "#ef4444",
    textColor: "#ffffff",
  },
]

export interface CanvasNodeData extends Record<string, unknown> {
  label: string
  color?: string
  textColor?: string
  shape?: string
}

export type CanvasNode = Node<CanvasNodeData>
export type CanvasEdge = Edge

// Lowercase aliases as specified in the feature spec
export type canvasNode = CanvasNode
export type canvasEdge = CanvasEdge

