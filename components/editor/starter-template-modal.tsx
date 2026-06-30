"use client"

import * as React from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { CANVAS_TEMPLATES, type CanvasTemplate } from "./starter-template"
import { Download } from "lucide-react"

interface StarterTemplateModalProps {
  isOpen: boolean
  onClose: () => void
  onImport: (template: CanvasTemplate) => void
}

function TemplatePreview({ template }: { template: CanvasTemplate }) {
  const { nodes, edges } = template

  if (!nodes || nodes.length === 0) {
    return <span className="text-xs text-zinc-650">No nodes to preview</span>
  }

  // Calculate bounds
  const xs = nodes.map((n) => n.position.x)
  const ys = nodes.map((n) => n.position.y)
  const minX = Math.min(...xs)
  const maxX = Math.max(...nodes.map((n) => n.position.x + (n.width || 150)))
  const minY = Math.min(...ys)
  const maxY = Math.max(...nodes.map((n) => n.position.y + (n.height || 80)))

  const boundsWidth = maxX - minX
  const boundsHeight = maxY - minY

  const padding = 32
  const viewX = minX - padding
  const viewY = minY - padding
  const viewWidth = boundsWidth + padding * 2
  const viewHeight = boundsHeight + padding * 2

  // Pre-calculate node center points for edge lines
  const nodeCenters = new Map<string, { x: number; y: number }>()
  for (const node of nodes) {
    const w = node.width || 150
    const h = node.height || 80
    nodeCenters.set(node.id, {
      x: node.position.x + w / 2,
      y: node.position.y + h / 2,
    })
  }

  return (
    <svg
      viewBox={`${viewX} ${viewY} ${viewWidth} ${viewHeight}`}
      className="w-full h-full select-none pointer-events-none"
    >
      {/* Background Dots */}
      <defs>
        <pattern
          id="preview-dots"
          width="16"
          height="16"
          patternUnits="userSpaceOnUse"
        >
          <circle cx="1.5" cy="1.5" r="1" fill="rgba(255, 255, 255, 0.05)" />
        </pattern>
      </defs>
      <rect
        x={viewX - 100}
        y={viewY - 100}
        width={viewWidth + 200}
        height={viewHeight + 200}
        fill="url(#preview-dots)"
      />

      {/* Edges */}
      {edges.map((edge) => {
        const sourceCenter = nodeCenters.get(edge.source)
        const targetCenter = nodeCenters.get(edge.target)
        if (!sourceCenter || !targetCenter) return null

        return (
          <line
            key={edge.id}
            x1={sourceCenter.x}
            y1={sourceCenter.y}
            x2={targetCenter.x}
            y2={targetCenter.y}
            stroke="#52525b"
            strokeWidth={1.5}
            strokeOpacity={0.65}
          />
        )
      })}

      {/* Nodes */}
      {nodes.map((node) => {
        const x = node.position.x
        const y = node.position.y
        const w = node.width || 150
        const h = node.height || 80
        const shape = node.data.shape || "rectangle"
        const fillColor = node.data.color || "#3b82f6"

        return (
          <g key={node.id} transform={`translate(${x}, ${y})`}>
            {shape === "rectangle" && (
              <rect
                width={w}
                height={h}
                rx={8}
                fill={fillColor}
                fillOpacity={0.15}
                stroke={fillColor}
                strokeWidth={1.5}
              />
            )}
            {shape === "circle" && (
              <circle
                cx={w / 2}
                cy={h / 2}
                r={Math.min(w, h) / 2}
                fill={fillColor}
                fillOpacity={0.15}
                stroke={fillColor}
                strokeWidth={1.5}
              />
            )}
            {shape === "pill" && (
              <rect
                width={w}
                height={h}
                rx={h / 2}
                fill={fillColor}
                fillOpacity={0.15}
                stroke={fillColor}
                strokeWidth={1.5}
              />
            )}
            {shape === "diamond" && (
              <path
                d={`M ${w / 2} 1.5 L ${w - 1.5} ${h / 2} L ${w / 2} ${h - 1.5} L 1.5 ${h / 2} Z`}
                fill={fillColor}
                fillOpacity={0.15}
                stroke={fillColor}
                strokeWidth={1.5}
              />
            )}
            {shape === "hexagon" && (
              <path
                d={`M ${w * 0.25} 1.5 L ${w * 0.75} 1.5 L ${w - 1.5} ${h / 2} L ${w * 0.75} ${h - 1.5} L ${w * 0.25} ${h - 1.5} L 1.5 ${h / 2} Z`}
                fill={fillColor}
                fillOpacity={0.15}
                stroke={fillColor}
                strokeWidth={1.5}
              />
            )}
            {shape === "cylinder" && (
              <>
                <path
                  d={`M 1.5 ${h * 0.15} A ${w * 0.485} ${h * 0.12} 0 0 1 ${w - 1.5} ${h * 0.15} V ${h * 0.85} A ${w * 0.485} ${h * 0.12} 0 0 1 1.5 ${h * 0.85} Z`}
                  fill={fillColor}
                  fillOpacity={0.15}
                  stroke={fillColor}
                  strokeWidth={1.5}
                />
                <path
                  d={`M ${w - 1.5} ${h * 0.15} A ${w * 0.485} ${h * 0.12} 0 0 1 1.5 ${h * 0.15}`}
                  fill="none"
                  stroke={fillColor}
                  strokeWidth={1.5}
                />
              </>
            )}
          </g>
        )
      })}
    </svg>
  )
}

export function StarterTemplateModal({
  isOpen,
  onClose,
  onImport,
}: StarterTemplateModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-5xl max-h-[85vh] flex flex-col p-8 bg-[#18181c] border-zinc-800 text-foreground rounded-2xl shadow-2xl">
        <DialogHeader className="mb-6">
          <DialogTitle className="text-2xl font-bold text-zinc-100 tracking-tight">
            Import Template
          </DialogTitle>
          <DialogDescription className="text-sm text-zinc-400 mt-1.5 leading-relaxed">
            Choose a starter template to pre-populate your canvas. Any existing nodes will be replaced — use <kbd className="inline-flex items-center justify-center px-1.5 py-0.5 rounded bg-zinc-800/80 border border-zinc-750 text-zinc-300 text-[10px] font-mono font-medium mx-1">⌘Z</kbd> to undo.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="flex-1 pr-2 -mr-2">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-2">
            {CANVAS_TEMPLATES.map((template) => (
              <div
                key={template.id}
                className="group flex flex-col bg-[#121214] border border-zinc-800/80 rounded-2xl overflow-hidden hover:border-zinc-700/80 hover:shadow-xl hover:shadow-black/30 transition-all duration-300"
              >
                {/* Visual Preview */}
                <div className="w-full h-48 bg-[#0a0a0c]/80 border-b border-zinc-850 p-4 relative flex items-center justify-center overflow-hidden">
                  <TemplatePreview template={template} />
                </div>

                {/* Card Body */}
                <div className="flex-1 p-5 flex flex-col justify-between gap-4">
                  <div>
                    <h4 className="font-heading font-semibold text-base text-zinc-200 group-hover:text-foreground transition-colors mb-1.5">
                      {template.name}
                    </h4>
                    <p className="text-xs text-zinc-400 leading-relaxed">
                      {template.description}
                    </p>
                  </div>

                  <Button
                    onClick={() => {
                      onImport(template)
                      onClose()
                    }}
                    className="w-full mt-2 bg-[#18181c] hover:bg-zinc-800 text-zinc-200 border border-zinc-800 hover:border-zinc-700 rounded-xl text-xs font-medium py-2.5 transition-all duration-200 cursor-pointer flex items-center justify-center gap-2"
                  >
                    <Download className="h-4 w-4 text-zinc-400" />
                    <span>Import</span>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
