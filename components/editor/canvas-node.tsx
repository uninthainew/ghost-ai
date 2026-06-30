import * as React from "react"
import { Handle, Position, type NodeProps, NodeResizer, useReactFlow } from "@xyflow/react"
import { cn } from "@/lib/utils"
import { type CanvasNode, NODE_COLOR_PALETTE } from "@/types/canvas"

function renderSvgShape(shape: string, borderColor: string, fillColor: string) {
  const commonProps = {
    width: "100%",
    height: "100%",
    viewBox: "0 0 100 100",
    preserveAspectRatio: "none",
    fill: fillColor,
    stroke: borderColor,
    strokeWidth: 1.5,
    className: "overflow-visible",
  }

  if (shape === "diamond") {
    return (
      <svg {...commonProps}>
        <path
          d="M 50 1.5 L 98.5 50 L 50 98.5 L 1.5 50 Z"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    )
  }

  if (shape === "hexagon") {
    return (
      <svg {...commonProps}>
        <path
          d="M 25 1.5 L 75 1.5 L 98.5 50 L 75 98.5 L 25 98.5 L 1.5 50 Z"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    )
  }

  if (shape === "cylinder") {
    return (
      <svg {...commonProps}>
        <path
          d="M 1.5 15 A 48.5 12 0 0 1 98.5 15 V 85 A 48.5 12 0 0 1 1.5 85 Z"
          vectorEffect="non-scaling-stroke"
        />
        <path
          d="M 98.5 15 A 48.5 12 0 0 1 1.5 15"
          fill="none"
          stroke={borderColor}
          strokeWidth={1.5}
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    )
  }

  return null
}

export function CanvasNodeComponent({ id, data, selected }: NodeProps<CanvasNode>) {
  const shape = data.shape || "rectangle"
  const defaultBorderColor = "rgba(255, 255, 255, 0.08)"
  const borderColor = selected ? "rgba(255, 255, 255, 0.4)" : defaultBorderColor

  const isSvgShape = ["diamond", "hexagon", "cylinder"].includes(shape)

  const { setNodes } = useReactFlow()
  const [isEditing, setIsEditing] = React.useState(false)
  const [inputValue, setInputValue] = React.useState(data.label || "")
  const textareaRef = React.useRef<HTMLTextAreaElement>(null)
  const [hoveredSwatchId, setHoveredSwatchId] = React.useState<string | null>(null)

  // Resolve current color pair
  const currentColor = React.useMemo(() => {
    return (
      NODE_COLOR_PALETTE.find((opt) => opt.backgroundColor === data.color) ||
      NODE_COLOR_PALETTE[0]
    )
  }, [data.color])

  const handleColorSelect = (option: typeof NODE_COLOR_PALETTE[number]) => {
    setNodes((nodes) =>
      nodes.map((n) => {
        if (n.id === id) {
          return {
            ...n,
            data: {
              ...n.data,
              color: option.backgroundColor,
              textColor: option.textColor,
            },
          }
        }
        return n
      })
    )
  }

  // Focus and select textarea text on start editing
  React.useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus()
      textareaRef.current.select()
    }
  }, [isEditing])

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    setInputValue(data.label || "")
    setIsEditing(true)
  }

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value
    setInputValue(newValue)
    
    // Update label in collaborative state in real-time
    setNodes((nodes) =>
      nodes.map((n) => {
        if (n.id === id) {
          return {
            ...n,
            data: {
              ...n.data,
              label: newValue,
            },
          }
        }
        return n
      })
    )
  }

  const handleBlur = () => {
    setIsEditing(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    e.stopPropagation()
    if (e.key === "Escape") {
      setIsEditing(false)
    } else if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      setIsEditing(false)
    }
  }

  return (
    <div
      className={cn(
        "group w-full h-full min-w-[60px] min-h-[30px] flex items-center justify-center relative font-medium text-sm select-none transition-all duration-200",
        !isSvgShape && "border shadow-lg",
        !isSvgShape && selected && "shadow-[0_0_12px_rgba(255,255,255,0.03)]",
        shape === "rectangle" && "rounded-lg",
        shape === "circle" && "rounded-full",
        shape === "pill" && "rounded-full",
        isSvgShape && "bg-transparent border-none shadow-none"
      )}
      style={{
        ...(!isSvgShape
          ? {
              borderColor: borderColor,
              backgroundColor: currentColor.backgroundColor,
            }
          : {}),
        color: currentColor.textColor,
      }}
    >
      {/* Node Resizer */}
      <NodeResizer
        isVisible={!!selected}
        minWidth={60}
        minHeight={30}
        handleClassName="h-2 w-2 bg-[#18181c] border border-zinc-500 hover:border-zinc-300 rounded-sm"
        lineClassName="border-zinc-500/50"
      />

      {isSvgShape && (
        <div className="absolute inset-0 w-full h-full pointer-events-none z-0 animate-in fade-in duration-200">
          {renderSvgShape(shape, borderColor, currentColor.backgroundColor)}
        </div>
      )}

      {/* Floating Color Toolbar */}
      {selected && !isEditing && (
        <div
          className="absolute bottom-[calc(100%+14px)] left-1/2 -translate-x-1/2 z-50 nodrag nopan flex items-center gap-1.5 bg-[#18181c]/95 backdrop-blur-md border border-zinc-800/80 px-2 py-1.5 rounded-full shadow-[0_4px_20px_rgba(0,0,0,0.4)] animate-in fade-in-50 slide-in-from-bottom-1 duration-150"
          onClick={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
          onPointerDown={(e) => e.stopPropagation()}
        >
          {NODE_COLOR_PALETTE.map((option) => {
            const isActive = currentColor.id === option.id
            const isHovered = hoveredSwatchId === option.id
            return (
              <button
                key={option.id}
                type="button"
                className={cn(
                  "w-5 h-5 rounded-full cursor-pointer transition-all duration-150 relative border border-white/10",
                  isActive && "ring-2 ring-white ring-offset-2 ring-offset-[#18181c]"
                )}
                style={{
                  backgroundColor: option.backgroundColor,
                  boxShadow: isHovered 
                    ? `0 0 6px 1px ${option.textColor}` 
                    : undefined,
                  transform: isHovered ? "scale(1.15)" : "scale(1)",
                }}
                onClick={(e) => {
                  e.stopPropagation()
                  handleColorSelect(option)
                }}
                onMouseEnter={() => setHoveredSwatchId(option.id)}
                onMouseLeave={() => setHoveredSwatchId(null)}
                title={option.name}
              />
            )
          })}
        </div>
      )}

      {/* Label - centered inside/over the shape */}
      <div className="z-10 w-full h-full flex items-center justify-center pointer-events-none">
        {isEditing ? (
          <textarea
            ref={textareaRef}
            value={inputValue}
            onChange={handleChange}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            // Prevents dragging/panning during label interaction
            className="nodrag nopan w-full bg-transparent border-none outline-none resize-none text-center font-medium text-sm focus:ring-0 focus:outline-none p-3 pointer-events-auto"
            style={{ height: 'auto', maxHeight: '100%', color: currentColor.textColor }}
          />
        ) : (
          <div
            onDoubleClick={handleDoubleClick}
            className={cn(
              "px-3 py-2 text-center w-full text-sm font-medium pointer-events-auto cursor-text select-none break-words line-clamp-3",
              data.label ? "" : "opacity-60 italic"
            )}
            style={{ color: currentColor.textColor }}
          >
            {data.label || "Double-click to edit"}
          </div>
        )}
      </div>

      {/* Connection Handles - hidden by default, visible on hover */}
      <Handle
        type="source"
        position={Position.Top}
        id="top"
        className="w-1.5 h-1.5 !bg-white border border-zinc-950 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-150 hover:scale-125"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id="bottom"
        className="w-1.5 h-1.5 !bg-white border border-zinc-950 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-150 hover:scale-125"
      />
      <Handle
        type="source"
        position={Position.Left}
        id="left"
        className="w-1.5 h-1.5 !bg-white border border-zinc-950 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-150 hover:scale-125"
      />
      <Handle
        type="source"
        position={Position.Right}
        id="right"
        className="w-1.5 h-1.5 !bg-white border border-zinc-950 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-150 hover:scale-125"
      />
    </div>
  )
}
