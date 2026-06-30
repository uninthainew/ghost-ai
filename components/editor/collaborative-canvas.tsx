"use client"

import * as React from "react"
import {
  ReactFlow,
  MiniMap,
  Background,
  ConnectionMode,
  BackgroundVariant,
  useReactFlow,
  MarkerType,
} from "@xyflow/react"
import { useLiveblocksFlow } from "@liveblocks/react-flow"
import { useUndo, useRedo, useCanUndo, useCanRedo } from "@liveblocks/react"
import { Square, Circle, Hexagon, Diamond, Pill, Cylinder, ZoomIn, ZoomOut, Maximize, Undo, Redo, LayoutTemplate } from "lucide-react"
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts"
import { CanvasNodeComponent } from "./canvas-node"
import { CustomEdge } from "./custom-edge"
import type { CanvasNode, CanvasEdge } from "@/types/canvas"
import { StarterTemplateModal } from "./starter-template-modal"
import { type CanvasTemplate } from "./starter-template"
import "@xyflow/react/dist/style.css"

const nodeTypes = {
  canvasNode: CanvasNodeComponent,
}

const edgeTypes = {
  customEdge: CustomEdge,
}

const defaultEdgeOptions = {
  type: "customEdge",
  markerEnd: {
    type: MarkerType.ArrowClosed,
    color: "#52525b",
    width: 16,
    height: 16,
  },
}

const onDragStart = (event: React.DragEvent, shape: string) => {
  let size = { width: 150, height: 80 }
  if (shape === "circle") {
    size = { width: 80, height: 80 }
  } else if (shape === "diamond") {
    size = { width: 100, height: 100 }
  } else if (shape === "pill") {
    size = { width: 120, height: 60 }
  } else if (shape === "cylinder") {
    size = { width: 100, height: 80 }
  } else if (shape === "hexagon") {
    size = { width: 100, height: 90 }
  }

  event.dataTransfer.setData("application/reactflow", JSON.stringify({ shape, ...size }))
  event.dataTransfer.effectAllowed = "move"

  // Set native drag image using the pre-rendered off-screen preview
  const element = document.getElementById(`drag-preview-${shape}`)
  if (element) {
    event.dataTransfer.setDragImage(element, size.width / 2, size.height / 2)
  }
}

export function CollaborativeCanvas() {
  const {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
  } = useLiveblocksFlow<CanvasNode, CanvasEdge>({
    suspense: true,
    nodes: {
      initial: [],
    },
    edges: {
      initial: [],
    },
  })

  const reactFlowInstance = useReactFlow()
  const { screenToFlowPosition, zoomIn, zoomOut, fitView } = reactFlowInstance
  const nodeCounterRef = React.useRef(0)

  const undo = useUndo()
  const redo = useRedo()
  const canUndo = useCanUndo()
  const canRedo = useCanRedo()

  useKeyboardShortcuts(reactFlowInstance, undo, redo)

  const [isTemplateModalOpen, setIsTemplateModalOpen] = React.useState(false)

  const handleImportTemplate = React.useCallback(
    (template: CanvasTemplate) => {
      // Replace nodes & edges
      reactFlowInstance.setNodes(template.nodes)
      reactFlowInstance.setEdges(template.edges)

      // Fit the view to show the new template nicely
      setTimeout(() => {
        fitView({ padding: 0.2, duration: 400 })
      }, 50)
    },
    [reactFlowInstance, fitView]
  )

  const onDragOver = React.useCallback((event: React.DragEvent) => {
    event.preventDefault()
    event.dataTransfer.dropEffect = "move"
  }, [])

  const onDrop = React.useCallback(
    (event: React.DragEvent) => {
      event.preventDefault()

      const payload = event.dataTransfer.getData("application/reactflow")
      if (!payload) return

      const { shape, width, height } = JSON.parse(payload)

      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      })

      nodeCounterRef.current += 1
      const id = `${shape}_${Date.now()}_${nodeCounterRef.current}`

      const newNode: CanvasNode = {
        id,
        type: "canvasNode",
        position,
        data: {
          label: "",
          shape,
          color: "#3b82f6", // default node color
        },
        width,
        height,
      }

      onNodesChange([{ type: "add", item: newNode }])
    },
    [screenToFlowPosition, onNodesChange]
  )

  return (
    <div
      className="w-full h-full relative"
      onDragOver={onDragOver}
      onDrop={onDrop}
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        defaultEdgeOptions={defaultEdgeOptions}
        connectionMode={ConnectionMode.Loose}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        colorMode="dark"
        className="bg-[#121214]"
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={24}
          size={1}
          color="rgba(255, 255, 255, 0.16)"
        />
        <MiniMap
          style={{
            backgroundColor: "#1c1c21",
            borderColor: "rgba(255, 255, 255, 0.08)",
          }}
          nodeColor={(node) => (node.data?.color as string) || "#3b82f6"}
          maskColor="rgba(0, 0, 0, 0.6)"
          className="border border-border/40 rounded-xl overflow-hidden shadow-2xl"
        />
      </ReactFlow>

      {/* Floating Pill-Shape Shape Panel at Bottom-Center */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center">
        <div className="flex items-center gap-2 bg-[#18181c] border border-zinc-800/60 px-4 py-1.5 rounded-full shadow-2xl select-none animate-in fade-in-50 slide-in-from-bottom-3 duration-300">
          {/* Rectangle */}
          <div
            draggable
            onDragStart={(e) => onDragStart(e, "rectangle")}
            className="flex items-center justify-center h-8 w-8 rounded-full cursor-grab active:cursor-grabbing hover:bg-zinc-800/60 text-zinc-450 hover:text-zinc-200 transition-all duration-200 hover:scale-110 active:scale-95"
            title="Drag Rectangle"
          >
            <Square className="h-4 w-4" />
          </div>

          {/* Diamond */}
          <div
            draggable
            onDragStart={(e) => onDragStart(e, "diamond")}
            className="flex items-center justify-center h-8 w-8 rounded-full cursor-grab active:cursor-grabbing hover:bg-zinc-800/60 text-zinc-450 hover:text-zinc-200 transition-all duration-200 hover:scale-110 active:scale-95"
            title="Drag Diamond"
          >
            <Diamond className="h-4 w-4" />
          </div>

          {/* Circle */}
          <div
            draggable
            onDragStart={(e) => onDragStart(e, "circle")}
            className="flex items-center justify-center h-8 w-8 rounded-full cursor-grab active:cursor-grabbing hover:bg-zinc-800/60 text-zinc-450 hover:text-zinc-200 transition-all duration-200 hover:scale-110 active:scale-95"
            title="Drag Circle"
          >
            <Circle className="h-4 w-4" />
          </div>

          {/* Pill */}
          <div
            draggable
            onDragStart={(e) => onDragStart(e, "pill")}
            className="flex items-center justify-center h-8 w-8 rounded-full cursor-grab active:cursor-grabbing hover:bg-zinc-800/60 text-zinc-450 hover:text-zinc-200 transition-all duration-200 hover:scale-110 active:scale-95"
            title="Drag Pill"
          >
            <Pill className="h-4 w-4" />
          </div>

          {/* Cylinder */}
          <div
            draggable
            onDragStart={(e) => onDragStart(e, "cylinder")}
            className="flex items-center justify-center h-8 w-8 rounded-full cursor-grab active:cursor-grabbing hover:bg-zinc-800/60 text-zinc-450 hover:text-zinc-200 transition-all duration-200 hover:scale-110 active:scale-95"
            title="Drag Cylinder"
          >
            <Cylinder className="h-4.5 w-4.5" />
          </div>

          {/* Hexagon */}
          <div
            draggable
            onDragStart={(e) => onDragStart(e, "hexagon")}
            className="flex items-center justify-center h-8 w-8 rounded-full cursor-grab active:cursor-grabbing hover:bg-zinc-800/60 text-zinc-450 hover:text-zinc-200 transition-all duration-200 hover:scale-110 active:scale-95"
            title="Drag Hexagon"
          >
            <Hexagon className="h-4 w-4" />
          </div>
        </div>
        
        {/* Tiny handle line below the pill */}
        <div className="w-5 h-0.75 bg-zinc-800 rounded-full mt-1.5 opacity-60" />
      </div>

      {/* Floating Pill-Shape Control Bar at Bottom-Left */}
      <div className="absolute bottom-6 left-6 z-10 flex items-center bg-[#18181c] border border-zinc-800/60 px-3 py-1.5 rounded-full shadow-2xl select-none animate-in fade-in-50 slide-in-from-bottom-3 duration-300 gap-2">
        {/* Zoom Controls */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => zoomOut({ duration: 300 })}
            className="flex items-center justify-center h-8 w-8 rounded-full hover:bg-zinc-800/60 text-zinc-400 hover:text-zinc-200 transition-all duration-200 hover:scale-110 active:scale-95 cursor-pointer"
            title="Zoom Out (-)"
          >
            <ZoomOut className="h-4 w-4" />
          </button>
          <button
            onClick={() => fitView({ duration: 300 })}
            className="flex items-center justify-center h-8 w-8 rounded-full hover:bg-zinc-800/60 text-zinc-400 hover:text-zinc-200 transition-all duration-200 hover:scale-110 active:scale-95 cursor-pointer"
            title="Fit View (Cmd/Ctrl + 0)"
          >
            <Maximize className="h-4 w-4" />
          </button>
          <button
            onClick={() => zoomIn({ duration: 300 })}
            className="flex items-center justify-center h-8 w-8 rounded-full hover:bg-zinc-800/60 text-zinc-400 hover:text-zinc-200 transition-all duration-200 hover:scale-110 active:scale-95 cursor-pointer"
            title="Zoom In (+)"
          >
            <ZoomIn className="h-4 w-4" />
          </button>
        </div>

        {/* Thin Divider */}
        <div className="w-[1px] h-5 bg-zinc-800/80" />

        {/* History Controls */}
        <div className="flex items-center gap-1">
          <button
            onClick={undo}
            disabled={!canUndo}
            className={`flex items-center justify-center h-8 w-8 rounded-full transition-all duration-200 ${
              canUndo
                ? "hover:bg-zinc-800/60 text-zinc-400 hover:text-zinc-200 hover:scale-110 active:scale-95 cursor-pointer"
                : "text-zinc-600 opacity-40 cursor-not-allowed"
            }`}
            title="Undo (Cmd/Ctrl + Z)"
          >
            <Undo className="h-4 w-4" />
          </button>
          <button
            onClick={redo}
            disabled={!canRedo}
            className={`flex items-center justify-center h-8 w-8 rounded-full transition-all duration-200 ${
              canRedo
                ? "hover:bg-zinc-800/60 text-zinc-400 hover:text-zinc-200 hover:scale-110 active:scale-95 cursor-pointer"
                : "text-zinc-600 opacity-40 cursor-not-allowed"
            }`}
            title="Redo (Cmd/Ctrl + Shift + Z / Cmd/Ctrl + Y)"
          >
            <Redo className="h-4 w-4" />
          </button>
        </div>

        {/* Thin Divider */}
        <div className="w-[1px] h-5 bg-zinc-800/80" />

        {/* Templates Control */}
        <div className="flex items-center">
          <button
            onClick={() => setIsTemplateModalOpen(true)}
            className="flex items-center justify-center h-8 px-2.5 rounded-full hover:bg-zinc-800/60 text-zinc-400 hover:text-zinc-200 hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer text-xs font-medium gap-1.5"
            title="Import Starter Template"
          >
            <LayoutTemplate className="h-3.5 w-3.5 text-primary" />
            <span>Templates</span>
          </button>
        </div>
      </div>

      {/* Hidden Drag Previews Container */}
      <div
        className="absolute pointer-events-none select-none"
        style={{ left: "-9999px", top: "-9999px" }}
      >
        {/* Rectangle Preview */}
        <div
          id="drag-preview-rectangle"
          className="bg-[#18181c] border border-[rgba(255,255,255,0.08)] rounded-lg shadow-lg"
          style={{ width: 150, height: 80 }}
        />

        {/* Circle Preview */}
        <div
          id="drag-preview-circle"
          className="bg-[#18181c] border border-[rgba(255,255,255,0.08)] rounded-full shadow-lg"
          style={{ width: 80, height: 80 }}
        />

        {/* Pill Preview */}
        <div
          id="drag-preview-pill"
          className="bg-[#18181c] border border-[rgba(255,255,255,0.08)] rounded-full shadow-lg"
          style={{ width: 120, height: 60 }}
        />

        {/* Diamond Preview */}
        <div id="drag-preview-diamond" style={{ width: 100, height: 100 }}>
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            fill="#18181c"
            stroke="rgba(255, 255, 255, 0.08)"
            strokeWidth={1.5}
            className="overflow-visible"
          >
            <path
              d="M 50 1.5 L 98.5 50 L 50 98.5 L 1.5 50 Z"
              vectorEffect="non-scaling-stroke"
            />
          </svg>
        </div>

        {/* Hexagon Preview */}
        <div id="drag-preview-hexagon" style={{ width: 100, height: 90 }}>
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            fill="#18181c"
            stroke="rgba(255, 255, 255, 0.08)"
            strokeWidth={1.5}
            className="overflow-visible"
          >
            <path
              d="M 25 1.5 L 75 1.5 L 98.5 50 L 75 98.5 L 25 98.5 L 1.5 50 Z"
              vectorEffect="non-scaling-stroke"
            />
          </svg>
        </div>

        {/* Cylinder Preview */}
        <div id="drag-preview-cylinder" style={{ width: 100, height: 80 }}>
          <svg
            width="100%"
            height="100%"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            fill="#18181c"
            stroke="rgba(255, 255, 255, 0.08)"
            strokeWidth={1.5}
            className="overflow-visible"
          >
            <path
              d="M 1.5 15 A 48.5 12 0 0 1 98.5 15 V 85 A 48.5 12 0 0 1 1.5 85 Z"
              vectorEffect="non-scaling-stroke"
            />
            <path
              d="M 98.5 15 A 48.5 12 0 0 1 1.5 15"
              fill="none"
              stroke="rgba(255, 255, 255, 0.08)"
              strokeWidth={1.5}
              vectorEffect="non-scaling-stroke"
            />
          </svg>
        </div>
      </div>

      {/* Starter Template Modal */}
      <StarterTemplateModal
        isOpen={isTemplateModalOpen}
        onClose={() => setIsTemplateModalOpen(false)}
        onImport={handleImportTemplate}
      />
    </div>
  )
}
