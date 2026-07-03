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
  useViewport,
  useNodes,
  useEdges,
} from "@xyflow/react"
import { useLiveblocksFlow } from "@liveblocks/react-flow"
import { useUndo, useRedo, useCanUndo, useCanRedo, useOthers, useUpdateMyPresence } from "@liveblocks/react"
import { useUser, UserButton } from "@clerk/nextjs"
import { Square, Circle, Hexagon, Diamond, Pill, Cylinder, ZoomIn, ZoomOut, Maximize, Undo, Redo, LayoutTemplate } from "lucide-react"
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts"
import { CanvasNodeComponent } from "./canvas-node"
import { CustomEdge } from "./custom-edge"
import type { CanvasNode, CanvasEdge } from "@/types/canvas"
import { StarterTemplateModal } from "./starter-template-modal"
import { type CanvasTemplate } from "./starter-template"
import { useProjectDialogs } from "@/components/editor/project-context"
import { useCanvasAutosave } from "@/hooks/useCanvasAutosave"
import "@xyflow/react/dist/style.css"

const getInitials = (name?: string) => {
  if (!name) return "?"
  const parts = name.trim().split(/\s+/)
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase()
  }
  return name.slice(0, 2).toUpperCase()
}

interface LiveCursorsProps {
  currentUserId?: string
}

function LiveCursors({ currentUserId }: LiveCursorsProps) {
  const { x: transformX, y: transformY, zoom } = useViewport()

  const cursors = useOthers(
    (others) =>
      others
        .filter((other) => other.id !== currentUserId && other.presence?.cursor)
        .map((other) => ({
          connectionId: other.connectionId,
          name: other.info?.name || "Collaborator",
          color: other.info?.color || "#3b82f6",
          cursor: other.presence.cursor!,
        })),
    (a, b) => {
      if (a.length !== b.length) return false
      for (let i = 0; i < a.length; i++) {
        if (a[i].connectionId !== b[i].connectionId) return false
        if (a[i].name !== b[i].name) return false
        if (a[i].color !== b[i].color) return false
        if (a[i].cursor.x !== b[i].cursor.x) return false
        if (a[i].cursor.y !== b[i].cursor.y) return false
      }
      return true
    }
  )

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-20">
      {cursors.map(({ connectionId, name, color, cursor }) => {
        const screenX = cursor.x * zoom + transformX
        const screenY = cursor.y * zoom + transformY
        return (
          <div
            key={connectionId}
            className="absolute left-0 top-0 pointer-events-none transition-transform duration-75 ease-out"
            style={{
              transform: `translate(${screenX}px, ${screenY}px)`,
            }}
          >
            <svg
              className="h-5 w-5 drop-shadow-md"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M3 3L10.07 19.97L12.58 12.58L19.97 10.07L3 3Z"
                fill={color}
                stroke="white"
                strokeWidth={1.5}
                strokeLinejoin="round"
              />
            </svg>
            <div
              className="ml-4 mt-1 px-2.5 py-1 text-xs font-semibold text-white rounded-lg shadow-lg whitespace-nowrap animate-in fade-in-50 zoom-in-95 duration-150 border border-white/10 backdrop-blur-sm bg-opacity-95"
              style={{
                backgroundColor: color,
              }}
            >
              {name}
            </div>
          </div>
        )
      })}
    </div>
  )
}

interface CollaboratorAvatarStackProps {
  currentUserId?: string
}

function CollaboratorAvatarStack({ currentUserId }: CollaboratorAvatarStackProps) {
  const collaborators = useOthers(
    (others) =>
      others
        .filter((other) => other.id !== currentUserId)
        .map((other) => ({
          connectionId: other.connectionId,
          id: other.id,
          info: other.info,
        })),
    (a, b) => {
      if (a.length !== b.length) return false
      for (let i = 0; i < a.length; i++) {
        if (a[i].connectionId !== b[i].connectionId) return false
        if (a[i].id !== b[i].id) return false
        if (a[i].info?.name !== b[i].info?.name) return false
        if (a[i].info?.avatar !== b[i].info?.avatar) return false
        if (a[i].info?.color !== b[i].info?.color) return false
      }
      return true
    }
  )

  const visibleCollaborators = collaborators.slice(0, 5)
  const overflowCount = collaborators.length - 5

  return (
    <div className="absolute top-4 right-4 z-30 flex items-center gap-3 bg-[#18181c]/80 backdrop-blur-md border border-zinc-800/60 px-3 py-1.5 rounded-full shadow-xl select-none animate-in fade-in-50 slide-in-from-top-2 duration-300">
      {collaborators.length > 0 && (
        <div className="flex -space-x-2">
          {visibleCollaborators.map((other) => (
            <div
              key={other.connectionId}
              className="relative w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold ring-2 ring-[#121214] select-none text-white shrink-0"
              style={{ backgroundColor: other.info?.color || "#3b82f6" }}
              title={other.info?.name || "Collaborator"}
            >
              {getInitials(other.info?.name)}
              {other.info?.avatar && (
                <img
                  src={other.info.avatar}
                  alt={other.info.name}
                  className="absolute inset-0 w-full h-full rounded-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).remove()
                  }}
                />
              )}
            </div>
          ))}
          {overflowCount > 0 && (
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold bg-zinc-800 text-zinc-300 ring-2 ring-[#121214] shrink-0 select-none"
              title={`${overflowCount} more collaborators`}
            >
              +{overflowCount}
            </div>
          )}
        </div>
      )}
      {collaborators.length > 0 && (
        <div className="w-[1px] h-5 bg-zinc-800" />
      )}
      <div className="shrink-0 flex items-center justify-center w-8 h-8">
        <UserButton appearance={{ elements: { avatarBox: "h-8 w-8" } }} />
      </div>
    </div>
  )
}

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

interface CollaborativeCanvasProps {
  project: {
    id: string
    name: string
    description?: string | null
    cancasJsonPath?: string | null
  }
}

export function CollaborativeCanvas({ project }: CollaborativeCanvasProps) {
  const {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    onDelete,
  } = useLiveblocksFlow<CanvasNode, CanvasEdge>({
    suspense: true,
    nodes: {
      initial: [],
    },
    edges: {
      initial: [],
    },
  })

  const allNodes = useNodes()
  const allEdges = useEdges()

  const reactFlowInstance = useReactFlow()
  const { screenToFlowPosition, zoomIn, zoomOut, fitView } = reactFlowInstance
  const nodeCounterRef = React.useRef(0)
  const canvasRef = React.useRef<HTMLDivElement>(null)

  const { setSaveStatus } = useProjectDialogs()
  const [isInitialLoadDone, setIsInitialLoadDone] = React.useState(false)

  // 1. Initial Load of saved state from Vercel Blob (only if room is empty)
  React.useEffect(() => {
    if (isInitialLoadDone) return

    const loadInitialCanvas = async () => {
      try {
        const currentNodes = reactFlowInstance.getNodes()
        const currentEdges = reactFlowInstance.getEdges()
        const isRoomEmpty = currentNodes.length === 0 && currentEdges.length === 0

        if (!isRoomEmpty) {
          setIsInitialLoadDone(true)
          return
        }

        if (project.cancasJsonPath) {
          const res = await fetch(`/api/projects/${project.id}/canvas`)
          if (res.ok) {
            const data = await res.json()
            
            // Re-verify room is still empty after async fetch
            const postFetchNodes = reactFlowInstance.getNodes()
            const postFetchEdges = reactFlowInstance.getEdges()
            const isStillEmpty = postFetchNodes.length === 0 && postFetchEdges.length === 0

            if (isStillEmpty && data && (data.nodes || data.edges)) {
              reactFlowInstance.setNodes(data.nodes || [])
              reactFlowInstance.setEdges(data.edges || [])
              
              if (data.nodes && data.nodes.length > 0) {
                setTimeout(() => {
                  fitView({ padding: 0.2, duration: 400 })
                }, 50)
              }
            }
          }
        }
      } catch (err) {
        console.error("Error loading initial canvas from Vercel Blob:", err)
      } finally {
        setIsInitialLoadDone(true)
      }
    }

    loadInitialCanvas()
  }, [project.id, project.cancasJsonPath, reactFlowInstance, fitView, isInitialLoadDone])

  // 2. Autosave watcher
  useCanvasAutosave(project.id, nodes, edges, isInitialLoadDone, setSaveStatus)

  const { user } = useUser()
  const currentUserId = user?.id
  const updateMyPresence = useUpdateMyPresence()

  const onMouseMove = React.useCallback(
    (event: React.MouseEvent) => {
      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      })
      updateMyPresence({ cursor: position })
    },
    [screenToFlowPosition, updateMyPresence]
  )

  const onMouseLeave = React.useCallback(() => {
    updateMyPresence({ cursor: null })
  }, [updateMyPresence])

  const undo = useUndo()
  const redo = useRedo()
  const canUndo = useCanUndo()
  const canRedo = useCanRedo()

  const [isTemplateModalOpen, setIsTemplateModalOpen] = React.useState(false)

  useKeyboardShortcuts(reactFlowInstance, undo, redo, isTemplateModalOpen)

  const handleImportTemplate = React.useCallback(
    (template: CanvasTemplate) => {
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

      const flowPosition = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      })

      const position = {
        x: flowPosition.x - width / 2,
        y: flowPosition.y - height / 2,
      }

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

  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement
      
      // Ignore if typing in editable element
      if (
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable ||
        target.closest("[contenteditable]")
      ) {
        return
      }

      if (event.key === "Delete" || event.key === "Backspace") {
        // Verify target is inside canvas wrapper OR focus is on body (general viewport shortcut)
        const isInsideCanvas = canvasRef.current?.contains(target)
        if (!isInsideCanvas && target !== document.body) {
          return
        }

        const selectedNodes = allNodes.filter((n) => n.selected) as unknown as CanvasNode[]
        const selectedEdges = allEdges.filter((e) => e.selected) as unknown as CanvasEdge[]

        if (selectedNodes.length > 0 || selectedEdges.length > 0) {
          event.preventDefault()
          onDelete({ nodes: selectedNodes, edges: selectedEdges })
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [allNodes, allEdges, onDelete])

  return (
    <div
      ref={canvasRef}
      className="w-full h-full relative"
      onDragOver={onDragOver}
      onDrop={onDrop}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
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
        deleteKeyCode={null}
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
            aria-label="Zoom Out"
          >
            <ZoomOut className="h-4 w-4" />
          </button>
          <button
            onClick={() => fitView({ duration: 300 })}
            className="flex items-center justify-center h-8 w-8 rounded-full hover:bg-zinc-800/60 text-zinc-400 hover:text-zinc-200 transition-all duration-200 hover:scale-110 active:scale-95 cursor-pointer"
            title="Fit View (Cmd/Ctrl + 0)"
            aria-label="Fit View"
          >
            <Maximize className="h-4 w-4" />
          </button>
          <button
            onClick={() => zoomIn({ duration: 300 })}
            className="flex items-center justify-center h-8 w-8 rounded-full hover:bg-zinc-800/60 text-zinc-400 hover:text-zinc-200 transition-all duration-200 hover:scale-110 active:scale-95 cursor-pointer"
            title="Zoom In (+)"
            aria-label="Zoom In"
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
            aria-label="Undo"
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
            aria-label="Redo"
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

      {/* Live Cursors Overlay */}
      <LiveCursors currentUserId={currentUserId} />

      {/* Collaborator Avatar Stack */}
      <CollaboratorAvatarStack currentUserId={currentUserId} />

      {/* Starter Template Modal */}
      <StarterTemplateModal
        isOpen={isTemplateModalOpen}
        onClose={() => setIsTemplateModalOpen(false)}
        onImport={handleImportTemplate}
      />
    </div>
  )
}
