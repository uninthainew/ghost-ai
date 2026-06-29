"use client"

import * as React from "react"
import { useProjectDialogs } from "@/components/editor/project-context"
import {
  MousePointer,
  Square,
  Circle,
  Type,
  Image as ImageIcon,
  ArrowRight,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Sparkles,
  Send,
  Globe,
  Cpu,
  Database,
  HelpCircle,
  Play,
  Layers,
  Settings
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface ProjectType {
  id: string
  name: string
  description?: string | null
}

interface WorkspaceViewProps {
  project: ProjectType
}

export function WorkspaceView({ project }: WorkspaceViewProps) {
  const { isAiOpen } = useProjectDialogs()
  const [zoom, setZoom] = React.useState(100)
  const [activeTool, setActiveTool] = React.useState<"select" | "rect" | "circle" | "text" | "image" | "line">("select")
  const [aiInput, setAiInput] = React.useState("")

  return (
    <div className="flex flex-1 overflow-hidden h-[calc(100vh-3.5rem)] relative">
      {/* Central Canvas Workspace */}
      <main className="flex-1 flex flex-col bg-[#0f0f11] relative overflow-hidden select-none">

        {/* SVG Dot Grid Background */}
        <div
          className="absolute inset-0 pointer-events-none opacity-50"
          style={{
            backgroundImage: "radial-gradient(rgba(255, 255, 255, 0.08) 1px, transparent 1px)",
            backgroundSize: "24px 24px"
          }}
        />

        {/* Canvas Toolbar (Floating at Top) */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 flex items-center gap-1 bg-background/80 backdrop-blur-md border border-border/40 p-1.5 rounded-xl shadow-xl animate-in fade-in-50 slide-in-from-top-2 duration-300">
          <Button
            variant={activeTool === "select" ? "default" : "ghost"}
            size="icon-sm"
            onClick={() => setActiveTool("select")}
            title="Select tool (V)"
            className="h-8 w-8 rounded-lg"
          >
            <MousePointer className="h-4 w-4" />
          </Button>
          <Button
            variant={activeTool === "rect" ? "default" : "ghost"}
            size="icon-sm"
            onClick={() => setActiveTool("rect")}
            title="Rectangle (R)"
            className="h-8 w-8 rounded-lg"
          >
            <Square className="h-4 w-4" />
          </Button>
          <Button
            variant={activeTool === "circle" ? "default" : "ghost"}
            size="icon-sm"
            onClick={() => setActiveTool("circle")}
            title="Circle (O)"
            className="h-8 w-8 rounded-lg"
          >
            <Circle className="h-4 w-4" />
          </Button>
          <Button
            variant={activeTool === "text" ? "default" : "ghost"}
            size="icon-sm"
            onClick={() => setActiveTool("text")}
            title="Text (T)"
            className="h-8 w-8 rounded-lg"
          >
            <Type className="h-4 w-4" />
          </Button>
          <Button
            variant={activeTool === "image" ? "default" : "ghost"}
            size="icon-sm"
            onClick={() => setActiveTool("image")}
            title="Image (I)"
            className="h-8 w-8 rounded-lg"
          >
            <ImageIcon className="h-4 w-4" />
          </Button>
          <div className="w-[1px] h-5 bg-border/40 mx-1 shrink-0" />
          <Button
            variant={activeTool === "line" ? "default" : "ghost"}
            size="icon-sm"
            onClick={() => setActiveTool("line")}
            title="Connector Line (L)"
            className="h-8 w-8 rounded-lg"
          >
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>

        {/* Mock Architecture Nodes (Visual Showcase) */}
        <div className="flex-1 relative flex items-center justify-center">

          {/* Connector SVGs */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="grad-web-api" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#a855f7" stopOpacity="0.4" />
              </linearGradient>
              <linearGradient id="grad-api-db" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#a855f7" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#10b981" stopOpacity="0.4" />
              </linearGradient>
            </defs>
            {/* Lines */}
            <path
              d="M 370 300 C 440 300, 440 300, 500 300"
              fill="none"
              stroke="url(#grad-web-api)"
              strokeWidth="2"
              strokeDasharray="4 4"
              className="animate-[dash_20s_linear_infinite]"
            />
            <path
              d="M 680 300 C 740 300, 740 300, 810 300"
              fill="none"
              stroke="url(#grad-api-db)"
              strokeWidth="2"
              strokeDasharray="4 4"
              className="animate-[dash_20s_linear_infinite]"
            />
          </svg>

          {/* Node 1: Next.js Client App */}
          <div className="absolute left-[160px] top-[250px] w-52 bg-blue-500/5 hover:bg-blue-500/10 border border-blue-500/30 hover:border-blue-500/60 rounded-xl p-4 shadow-[0_0_20px_rgba(59,130,246,0.1)] transition-all duration-300 group cursor-grab active:cursor-grabbing">
            <div className="flex items-center gap-2.5 mb-2">
              <div className="p-1.5 rounded-lg bg-blue-500/15 text-blue-400 group-hover:scale-105 transition-transform duration-200">
                <Globe className="h-4.5 w-4.5" />
              </div>
              <span className="font-heading text-xs font-semibold text-blue-100 tracking-wide">WEB CLIENT</span>
            </div>
            <h4 className="text-sm font-semibold text-foreground/90">Next.js Client</h4>
            <p className="text-[11px] text-muted-foreground mt-1">Vercel Edge Network</p>
          </div>

          {/* Node 2: API Gateway / Backend */}
          <div className="absolute left-[480px] top-[250px] w-52 bg-purple-500/5 hover:bg-purple-500/10 border border-purple-500/30 hover:border-purple-500/60 rounded-xl p-4 shadow-[0_0_20px_rgba(168,85,247,0.1)] transition-all duration-300 group cursor-grab active:cursor-grabbing">
            <div className="flex items-center gap-2.5 mb-2">
              <div className="p-1.5 rounded-lg bg-purple-500/15 text-purple-400 group-hover:scale-105 transition-transform duration-200">
                <Cpu className="h-4.5 w-4.5" />
              </div>
              <span className="font-heading text-xs font-semibold text-purple-100 tracking-wide">COMPUTE LAYER</span>
            </div>
            <h4 className="text-sm font-semibold text-foreground/90">API Server</h4>
            <p className="text-[11px] text-muted-foreground mt-1">Docker • Node.js ECS</p>
          </div>

          {/* Node 3: PostgreSQL Database */}
          <div className="absolute left-[800px] top-[250px] w-52 bg-emerald-500/5 hover:bg-emerald-500/10 border border-emerald-500/30 hover:border-emerald-500/60 rounded-xl p-4 shadow-[0_0_20px_rgba(16,185,129,0.1)] transition-all duration-300 group cursor-grab active:cursor-grabbing">
            <div className="flex items-center gap-2.5 mb-2">
              <div className="p-1.5 rounded-lg bg-emerald-500/15 text-emerald-400 group-hover:scale-105 transition-transform duration-200">
                <Database className="h-4.5 w-4.5" />
              </div>
              <span className="font-heading text-xs font-semibold text-emerald-100 tracking-wide">DATABASE</span>
            </div>
            <h4 className="text-sm font-semibold text-foreground/90">PostgreSQL DB</h4>
            <p className="text-[11px] text-muted-foreground mt-1">Prisma Schema • AWS RDS</p>
          </div>

          {/* Central Instruction Message */}
          <div className="absolute bottom-20 text-center max-w-sm pointer-events-none p-4 rounded-xl bg-background/5 border border-border/10 backdrop-blur-xs select-none">
            <p className="text-xs text-muted-foreground/80 leading-relaxed font-medium">
              Interact with the architectural nodes or use the AI Side Panel to add components.
            </p>
          </div>
        </div>

        {/* Zoom Controls (Floating Bottom Left) */}
        <div className="absolute bottom-4 left-4 z-10 flex items-center gap-1.5 bg-background/80 backdrop-blur-md border border-border/40 p-1 rounded-xl shadow-lg">
          <Button
            variant="ghost"
            size="icon-xs"
            onClick={() => setZoom(Math.max(50, zoom - 10))}
            title="Zoom Out"
            className="h-7 w-7 rounded-lg"
          >
            <ZoomOut className="h-3.5 w-3.5" />
          </Button>
          <span className="text-xs font-mono font-medium px-2 min-w-[3rem] text-center text-foreground/80">
            {zoom}%
          </span>
          <Button
            variant="ghost"
            size="icon-xs"
            onClick={() => setZoom(Math.min(200, zoom + 10))}
            title="Zoom In"
            className="h-7 w-7 rounded-lg"
          >
            <ZoomIn className="h-3.5 w-3.5" />
          </Button>
          <div className="w-[1px] h-4 bg-border/40 mx-0.5 shrink-0" />
          <Button
            variant="ghost"
            size="icon-xs"
            onClick={() => setZoom(100)}
            title="Reset Zoom"
            className="h-7 w-7 rounded-lg"
          >
            <Maximize2 className="h-3.5 w-3.5" />
          </Button>
        </div>

        {/* Layer / Status Indicator (Floating Bottom Right) */}
        <div className="absolute bottom-4 right-4 z-10 flex items-center gap-2 bg-background/80 backdrop-blur-md border border-border/40 px-3 py-1.5 rounded-xl shadow-lg">
          <Layers className="h-3.5 w-3.5 text-primary" />
          <span className="text-[10px] font-medium tracking-wide uppercase text-muted-foreground font-mono">
            3 Active Nodes
          </span>
        </div>
      </main>

      {/* AI Assistant Chat Panel (Right Sidebar) */}
      <aside
        className={cn(
          "h-full w-85 border-l border-border/40 bg-card text-card-foreground flex flex-col shrink-0 transition-all duration-300 ease-in-out shadow-2xl relative z-20",
          isAiOpen ? "translate-x-0 mr-0" : "translate-x-full absolute right-0"
        )}
        style={{ display: isAiOpen ? "flex" : "none" }}
      >
        {/* Sidebar Header */}
        <div className="flex h-14 items-center justify-between px-4 border-b border-border/40 shrink-0">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4.5 w-4.5 text-primary" />
            <h3 className="font-heading text-sm font-semibold tracking-tight text-foreground">
              Ghost AI Assistant
            </h3>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-[9px] font-semibold bg-primary/10 text-primary px-1.5 py-0.5 rounded-md border border-primary/20 uppercase tracking-widest font-mono">
              BETA
            </span>
          </div>
        </div>

        {/* Chat History Panel */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 flex flex-col justify-end">

          {/* Welcome Message */}
          <div className="flex gap-2.5 items-start">
            <div className="p-1.5 rounded-lg bg-primary/10 text-primary border border-primary/20 shrink-0">
              <Sparkles className="h-4 w-4" />
            </div>
            <div className="bg-muted/40 border border-border/20 rounded-2xl p-3.5 text-sm text-foreground/90 max-w-[85%] leading-relaxed">
              <p className="font-medium text-foreground mb-1">Welcome to your workspace!</p>
              I can help you build your infrastructure architecture diagrams. Try commands like:
              <ul className="list-disc pl-4 mt-2 space-y-1 text-xs text-muted-foreground">
                <li>"Add an AWS Lambda backend"</li>
                <li>"Connect the web client to the API server"</li>
                <li>"Design a basic serverless app"</li>
              </ul>
            </div>
          </div>

          <div className="flex-1" /> {/* Spacer */}
        </div>

        {/* Quick Action Suggestion Prompts */}
        <div className="px-4 pb-2 pt-1 shrink-0 flex flex-wrap gap-1.5">
          <Button
            variant="outline"
            size="xs"
            onClick={() => setAiInput("Design a scalable AWS VPC setup")}
            className="text-[10px] text-muted-foreground hover:text-foreground font-normal rounded-lg border-border/30"
          >
            AWS VPC Setup
          </Button>
          <Button
            variant="outline"
            size="xs"
            onClick={() => setAiInput("Add a Redis cache layer")}
            className="text-[10px] text-muted-foreground hover:text-foreground font-normal rounded-lg border-border/30"
          >
            + Redis Cache
          </Button>
        </div>

        {/* Message Input Area */}
        <div className="p-4 border-t border-border/40 bg-muted/10 shrink-0">
          <form
            onSubmit={(e) => {
              e.preventDefault()
              if (!aiInput.trim()) return
              setAiInput("")
            }}
            className="relative flex items-center"
          >
            <label htmlFor="workspace-ai-input" className="sr-only">
              Ask Ghost AI
            </label>
            <input
              id="workspace-ai-input"
              type="text"
              placeholder="Ask Ghost AI..."
              value={aiInput}
              onChange={(e) => setAiInput(e.target.value)}
              className="w-full bg-background/50 border border-border/30 rounded-xl px-4 py-2.5 pr-10 text-sm placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all font-medium"
            />
            <Button
              type="submit"
              variant="ghost"
              size="icon-xs"
              className="absolute right-2 text-muted-foreground hover:text-foreground hover:bg-muted/60 h-7 w-7 rounded-lg"
            >
              <Send className="h-3.5 w-3.5" />
            </Button>
          </form>
        </div>
      </aside>
    </div>
  )
}
