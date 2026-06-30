import * as React from "react"
import { type EdgeProps, getSmoothStepPath, EdgeLabelRenderer, useReactFlow } from "@xyflow/react"
import { cn } from "@/lib/utils"

export function CustomEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
  selected,
  data,
}: EdgeProps) {
  const { setEdges } = useReactFlow()
  const [edgePath, labelX, labelY] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
    borderRadius: 8,
  })

  const [isHovered, setIsHovered] = React.useState(false)
  const [isEditing, setIsEditing] = React.useState(false)
  const [inputValue, setInputValue] = React.useState((data?.label as string) || "")
  
  const spanRef = React.useRef<HTMLSpanElement>(null)
  const inputRef = React.useRef<HTMLInputElement>(null)
  const [inputWidth, setInputWidth] = React.useState(60)

  // Sync internal state with data.label updates (collaborators' changes)
  React.useEffect(() => {
    setInputValue((data?.label as string) || "")
  }, [data?.label])

  // Adjust input width based on current text width
  React.useEffect(() => {
    if (spanRef.current) {
      const width = spanRef.current.offsetWidth
      // Minimum width 60px, add a bit of padding/buffer
      setInputWidth(Math.max(60, width + 16))
    }
  }, [inputValue, isEditing])

  // Focus and select input text when entering edit mode
  React.useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus()
      inputRef.current.select()
    }
  }, [isEditing])

  const edgeColor = selected
    ? "#e4e4e7" // zinc-200
    : isHovered
      ? "#a1a1aa" // zinc-400
      : "#52525b" // zinc-600

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsEditing(true)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    setInputValue(val)

    // Sync to React Flow and Liveblocks state in real-time
    setEdges((edges) =>
      edges.map((edge) => {
        if (edge.id === id) {
          return {
            ...edge,
            data: {
              ...edge.data,
              label: val,
            },
          }
        }
        return edge
      })
    )
  }

  const handleBlur = () => {
    setIsEditing(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    e.stopPropagation()
    if (e.key === "Escape") {
      setIsEditing(false)
    } else if (e.key === "Enter") {
      e.preventDefault()
      setIsEditing(false)
    }
  }

  const hasLabel = !!data?.label
  const shouldShowLabel = isEditing || hasLabel || isHovered || selected

  return (
    <>
      {/* Invisible thick path for mouse interaction */}
      <path
        d={edgePath}
        fill="none"
        stroke="transparent"
        strokeWidth={15}
        className="react-flow__edge-interaction cursor-pointer"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onDoubleClick={handleDoubleClick}
        style={{ pointerEvents: "stroke" }}
      />

      {/* Visible thin path */}
      <path
        id={id}
        d={edgePath}
        fill="none"
        stroke={edgeColor}
        strokeWidth={2}
        strokeLinecap="round"
        className="react-flow__edge-path pointer-events-none"
        markerEnd={markerEnd}
        style={{
          transition: "stroke 0.2s ease",
          ...style,
        }}
      />

      {shouldShowLabel && (
        <EdgeLabelRenderer>
          <div
            style={{
              position: "absolute",
              transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
              pointerEvents: "all",
            }}
            className="nodrag nopan select-none z-50 flex items-center justify-center"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            {isEditing ? (
              <div className="relative flex items-center">
                {/* Hidden span for width measurement */}
                <span
                  ref={spanRef}
                  className="absolute invisible whitespace-pre px-2.5 py-1 text-xs font-semibold"
                  style={{
                    fontFamily: "inherit",
                    fontSize: "0.75rem",
                    fontWeight: 600,
                  }}
                >
                  {inputValue || "Add label..."}
                </span>
                <input
                  ref={inputRef}
                  type="text"
                  value={inputValue}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  onKeyDown={handleKeyDown}
                  placeholder="Add label..."
                  className="bg-[#18181c] border border-zinc-700 text-zinc-200 text-xs font-semibold px-2.5 py-1 rounded-md shadow-md focus:outline-none focus:ring-1 focus:ring-zinc-500 text-center"
                  style={{ width: inputWidth }}
                />
              </div>
            ) : (
              <div
                onDoubleClick={handleDoubleClick}
                className={cn(
                  "bg-[#18181c]/90 border border-zinc-800 text-zinc-300 text-xs font-semibold px-2.5 py-1 rounded-md shadow-md cursor-text hover:bg-[#202024] hover:border-zinc-700 transition-all select-none text-center",
                  !hasLabel && "opacity-50 italic text-zinc-400 border-dashed"
                )}
              >
                {data?.label ? (data.label as string) : "Add label"}
              </div>
            )}
          </div>
        </EdgeLabelRenderer>
      )}
    </>
  )
}
