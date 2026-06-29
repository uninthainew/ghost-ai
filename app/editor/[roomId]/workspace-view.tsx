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
  Sparkles,
  Send
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { CanvasWrapper } from "@/components/editor/canvas-wrapper"

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
  const [activeTool, setActiveTool] = React.useState<"select" | "rect" | "circle" | "text" | "image" | "line">("select")
  const [aiInput, setAiInput] = React.useState("")

  return (
    <div className="flex flex-1 overflow-hidden h-[calc(100vh-3.5rem)] relative">
      {/* Central Canvas Workspace */}
      <main className="flex-1 flex flex-col bg-[#0f0f11] relative overflow-hidden select-none">

        {/* Liveblocks Collaborative React Flow Canvas */}
        <CanvasWrapper roomId={project.id} />

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
