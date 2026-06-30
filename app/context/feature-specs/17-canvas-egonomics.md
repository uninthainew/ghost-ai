Add a floating control bar for zoom and undo/redo, then wire the same action to keyboard shortcuts

## Implementation 

1.Add a pill-shape controll bar at the bottum-left of the canvs .

    It should sit above the shape panel and include two groups:
    -zoom controls: zoom out, fit view, zoom in
    -History controls: undo, redo

    Seprate the two group wiht a thin divider.

2.Wire the zoom controls to the React Flow instace.
    -zoom in 
    -zoom out
    -fit view
    -use a short animation so the movement feels smooth 

3.Wire undo and redo to Lievblocks history.
    -use the existing Liveblocks undo/redo hooks
    -disable undo when there is nothing to undo 
    -desable redo when there is nothing to redo 
    -keep disable buutons visually dimmed

4.Create a `useKeyboardShortcuts` hook in `hooks/`.
    
    The hook should:
    -recice the React Flow instance 
    -recice undo and redo handlers 
    -listen for keyboard shortcut on `windows`
    -ignore shortcut while typing in inputs, textarea, or editale text fields

5.Support these shortcuts:
    -`+`Or`=` to zoom in 
    -`-`to zoom out 
    -`Cmd/Ctrl + z` to undo
    -`Cmd/Crtl + Shift + z`to redo
    -`Cmd/Ctrl + 0` to fit view
    -`Cmd/Ctrl + y`to redo 

## Scope Limits

-do not change shpae panel 
-do not change node or edge rendering 
-do not add extra canvas controls
-do not change the existing collaborative state setup 

## Check When Done

-Control bar is added to the canvas.
-Zoom actions use the React Flow instance .
-Undo and redo use Liveblocks history.
-Keyboard shortcuts are handled in `hooks/useKeyboardShortcuts`.
-Shortcut handling skips editable fields.
-`npm run build` passes.

