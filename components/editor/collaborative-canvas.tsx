"use client"

import * as React from "react"
import {
  ReactFlow,
  MiniMap,
  Background,
  ConnectionMode,
  BackgroundVariant,
  useReactFlow,
} from "@xyflow/react"
import { useLiveblocksFlow } from "@liveblocks/react-flow"
import { Square, Circle, Hexagon, Diamond, Pill, Cylinder } from "lucide-react"
import { CanvasNodeComponent } from "./canvas-node"
import type { CanvasNode, CanvasEdge } from "@/types/canvas"
import "@xyflow/react/dist/style.css"

const nodeTypes = {
  canvasNode: CanvasNodeComponent,
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

  const { screenToFlowPosition } = useReactFlow()
  const nodeCounterRef = React.useRef(0)

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
          nodeColor={() => "#3b82f6"}
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
    </div>
  )
}
