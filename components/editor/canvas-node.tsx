import * as React from "react"
import { Handle, Position, type NodeProps } from "@xyflow/react"
import { cn } from "@/lib/utils"
import type { CanvasNode } from "@/types/canvas"

export function CanvasNodeComponent({ data, selected }: NodeProps<CanvasNode>) {
  const defaultBorderColor = "rgba(255, 255, 255, 0.08)"
  const borderColor = selected ? "rgba(255, 255, 255, 0.25)" : defaultBorderColor

  return (
    <div
      className={cn(
        "group w-full h-full min-w-[60px] min-h-[30px] flex items-center justify-center rounded-2xl border bg-[#18181c] text-foreground transition-all duration-200 shadow-lg font-medium text-sm select-none",
        selected ? "shadow-[0_0_12px_rgba(255,255,255,0.03)]" : ""
      )}
      style={{
        borderColor: borderColor,
      }}
    >
      {data.label ? (
        <span className="px-3 py-2 truncate text-center w-full text-zinc-300">
          {data.label}
        </span>
      ) : null}

      {/* Connection Handles - hidden by default, visible on hover */}
      <Handle
        type="target"
        position={Position.Top}
        className="w-1.5 h-1.5 !bg-zinc-500 hover:!bg-zinc-300 border-none rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-150"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-1.5 h-1.5 !bg-zinc-500 hover:!bg-zinc-300 border-none rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-150"
      />
      <Handle
        type="target"
        position={Position.Left}
        className="w-1.5 h-1.5 !bg-zinc-500 hover:!bg-zinc-300 border-none rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-150"
      />
      <Handle
        type="source"
        position={Position.Right}
        className="w-1.5 h-1.5 !bg-zinc-500 hover:!bg-zinc-300 border-none rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-150"
      />
    </div>
  )
}
