Review the editor workspace implementation and fix the following issues. Check `Components/editor` first. Do not break existing features.

## Issues 

### 1. Save button in Workspacec navbar [Pending to test]

Read teh navbar component and the autosave hook before implemeting.

The workspace navbar is missing the save button. The autosave hook already exist and tracks saving/saved/error staes - wire the button to it. 

Add the Save Button to teh workspace navbar only. The navbar is shared with editor home so conditonally render the button base on workspace context - it must not appear o the editor home navbar. 

Button behavior:

-defualt state:shows "Save"
-while saving: show "saving..."
-after successful save: shows "saved" beriefly then returns to "Save"
-on error: shows "Error" briefly then returns to "Save"
-clicking it triggers a manual save through the same save function the autosave hook uses

Also fix the canvas save API route. Open the route file at `app/api/projects/[projectId]/canvas/route.ts` and make these change:
-in teh PUT heandler change `access: ";ublic"` to `access: "private"` in the Vercel Blob put call 
-in teh GET handler replace any raw fetch call with teh Vercel Blob SDK to retrieve te blob content using teh sored URL 

Do not anything else.

### 2.Delete Nodes and Edges

Read Liveblacks agent skills before implementing this.
Then read the canvas warpper component and the existing node and edge mutation helpers.

Selected nodes and edges can be deleted from the canvas.

Add a keydown listener to the canvas wrapper that:

-listens for delete and backspace keys 
-does not fire when the event target is an input, textarea, or contenteditable element
-get currently selected nodes using useNodes() filtered 
-get currently selected edges using useEdges() filtered
-remove them using the existing liveblocks collaborative mutation helpers

I see two save buttons, remove the one without the word save in it.

Do not use React Flow's built-in deleteKeyCode or any React Flow Keyboard deletion behavior. All deletions must go through the existing Liveblocks collaborative state so  they sync across all connected clients in real time.

Do not change anything else.

### 3. Node Connection Handles [Pending to test]

Read Liveblocks agent skill before implement this.

Nodes connected from the top handle. All four handles - top, right, buttom , left - should be active and connectable. Check the existing Handles component in the custom node renderer. Verify each handle has the correct position prop and that no CSS  is hiding or disabling the non-top handles. Connection between any two handles on any two nodes should work and sync through the existing Liveblocks edges state.

### 4.Drag and Drop Position Offset [Pending to test]

Read Liveblocks agent skills before implementing this. 

When dropping a shape from the shape panel onto the canvas, the node places below where the cursor actually is. 

Check the drop handler in the canvas wrapper. The position calculation must account for:

-the drag offset from where the user grabbed the shape inside the drag element, not just the element's top-left corner
-the canvas container's bounding rect 
-the current React Flow pan offset and zoom scale vai screenToFlowPosition or project 

The node should appear with its center at the exact cursor position on drop.

### 5. Auto Zoom on First Node Drop [Pending to test]

Read Liveblocks agent skills before implementing this.

Dropping the first node onto a fully empty canvas causes an automatic zoom-in. This dose not happen when other node exist. Check the drop handler and any fitView or fitbounds calls that maybe triggered after the first node is added. Disable or guard any automatic fit/zoom behavior os it does not fire during a drop event. The viewport should stay exactly where the user left it after dropping a node.

### 6.Collaborator Avatar Image Error [Pending to test]

Check Clerk agent skill before implementing this.

Add img.clerk.com to the allowed image hostnames in next. config.js using the correct remotepattern configuration.

### 7. Romve UerButton from workspace Navabr [Pending to test]

Check Clerk agent skills before implementign this.

Remove the UserButton from the workspace navbar only. the navbar is shared so make sure the UserButton remains on the editor home navbar. Conditionally render it base on whether the component is being used in the workspace context or editor home context.

## Spoce 

-fix only what is listen above 
-do not change canvas node or edge rendering behavior 
-do not modify the editor home navbar layout 
-do not barak existing autosave, prsence, or collaborator logic 
-`npm run build` passes 




