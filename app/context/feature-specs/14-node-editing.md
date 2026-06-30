Add resizing and inline label editing to canvas nodes.

## Implememntation

1.Add resizing.
    -select node should show resize handles
    -prevent node from being resize below a minumum size
    -keep resize handles subtle and consistent with the dark canvas UI 

2.Add inline label editing.
    -keep the node label centered inside the node 
    -double-click center /label area of a node to edit its label
    -show placholder text in the same centered postition when the label is empty 
    -keep editing smooth without causing layout shifts
    -show a textarea directly over the label while editing 
    -update the label as the user type 
    -close the editing on blur o `Escape`
    -prevent text editing interaction from dragging or panning the canvas 

3.Keep all node updates connected to the existing collaborative canvas state.

## Scope Limits 

-do not change shape rendering from the previous unit 
-do not change the shape panel or drag preview 
-do not change how dropped node are created 
-keep this focused on resize and label editing only 

## Check When Done 

-selected node how resize handles.
-`npm run build` passes without type errors.
