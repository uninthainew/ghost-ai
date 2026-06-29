"use client"

import * as React from "react"
import { LiveblocksProvider, RoomProvider, ClientSideSuspense } from "@liveblocks/react"
import { ReactFlowProvider } from "@xyflow/react"
import { CanvasErrorBoundary } from "./canvas-error-boundary"
import { CollaborativeCanvas } from "./collaborative-canvas"

interface CanvasWrapperProps {
  roomId: string
}

function CanvasLoading() {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#0f0f11] text-muted-foreground animate-in fade-in duration-200">
      <div className="h-8 w-8 rounded-full border-2 border-primary/20 border-t-primary animate-spin mb-3" />
      <span className="text-xs font-medium tracking-wide font-mono uppercase opacity-75">
        Connecting to room...
      </span>
    </div>
  )
}

// Match feature spec expected name
const ClientSuspense = ClientSideSuspense

export function CanvasWrapper({ roomId }: CanvasWrapperProps) {
  return (
    <CanvasErrorBoundary>
      <LiveblocksProvider authEndpoint="/api/liveblocks-auth">
        <RoomProvider
          id={roomId}
          initialPresence={{
            cursor: null,
            isThinking: false,
          }}
        >
          <ReactFlowProvider>
            <ClientSuspense fallback={<CanvasLoading />}>
              <CollaborativeCanvas />
            </ClientSuspense>
          </ReactFlowProvider>
        </RoomProvider>
      </LiveblocksProvider>
    </CanvasErrorBoundary>
  )
}
