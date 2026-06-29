import type { Node, Edge } from "@xyflow/react"

export interface CanvasNodeData extends Record<string, unknown> {
  label: string
  color?: string
  shape?: string
}

export type CanvasNode = Node<CanvasNodeData>
export type CanvasEdge = Edge

// Lowercase aliases as specified in the feature spec
export type canvasNode = CanvasNode
export type canvasEdge = CanvasEdge
