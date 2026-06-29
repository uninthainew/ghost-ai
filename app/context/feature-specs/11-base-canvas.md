Replace the canvas placeholder with a liveblocks-backed React Flow canvas.

## Implementation 

1.Kepp the workspace page server-side.

2.Create a client-side editor/canvas wrapper that sets up the liveblocks room.

 It should include:
 -`liveblocksProvider` using `/api/liveblock-auth`
 -`RoomProvider` using the current room ID 
 -initail presence with `cusor: null`
 -`ClientSuspense` with a simple loadign state 
 -an error fallback for Liveblocks connection issues.

3.Wire React Flow to Liveblocks state.

 -use `useLiveblocksFlow`
 -enable suspense
 -start with empty nodes and edges
 -pass the synced nodes, edges, and change handler into `ReactFlow`

4.Add shared canvas type in `type/canvas.ts`.

Node data should support:
-label
-color
-shape

Also define the custom node and edge types:
-`canvasNode`
-`canvasEdge`

5.Render the basic canvas.

Include:
-loose connection behavior 
-`fitView`
-`MiniMap`
-dot-pattern background 

## Scope limits 

-don't add controls yet 
-don't add custom node or edge rendering yet 
-don't add AI behavior 
-keep this focused on the collaborative canvas foundation.

## Check when Done 

-Client canvas wrapper sets up the Liveblocks room.
-Rect Flow use Liveblocks-synced node and edges.
-Shared canvas types exist in `types/canvas.ts`
-`npm run build` passes 
