Replace teh defualt canvas edges with custom edges that feel easier ot follow, easier to click, and support inline labels.

## Implementation 

1.Add connection handles to every node.
    -place handles on the top, right button, and left sides
    - users should be able to connect from any handle to any other handle
    -keep the handle subtle: small white dot with dark border 
    -hide them by default and fade them in when hovering the node 
    
2.Add a default style for new edages.
    -use a light stock with rounded ends 
    -add an arrowhead at the end of ecah edge 
    -make new connection use the custom canvas edge renderer

3.Create a custom edge renderer.
    -use clean right-angle routing 
    -keep edges slightly dimmed at rest 
    -brighten edges when hovered or selectedd 
    -make edges easier to hover and click without increasing the visible line thickness

4.Add inline edge label editing.
    -double-click an edge to edit its label
    -use React Flow `EdgelabelRenderer` and the path midpoint coordinates from `getSmoothStepPath` to position the label - do not calculate position manually
    -use an input that grows with the label text