Add a small floating color toolbar so seleted node can change both their background and text color directly on the canvas.

## Implementation 

1.Check `ui-context.md` for the node color palatte.
  Each palette option includes:
   -a node background color 
   -a matching text color 

Reuse existing theme color if they already exist in the `golbal.css`. Ontherwise, keep the paltte in the canvas type/constant, such as `type/canvas.ts`.

2.Add a toolbar above selected nodes.
   -only show it when the node is selected 
   -keep it slightly above the node without overlapping it 
   -show one swatch per color pair 
   -active swatch should feel clearly selected 
   -hovering a swatch should show a subtle glow based on its text color 
   -keep the glow tight and controlled, not overly blurred 
   -prevent toolbar interaction from dragging nodes or panning the canvas 

3.When a swatch is selected:
   -updated both the node background color and text color 
   -update the node UI immediately 
   -keep this inside the existing collaborative canvas state 
   -no server calls

4.Seleted node should visually reflect their active color pair.

  Teh node backgrounnd updates to the selected color, and the text automatically updates to its paired text color.

## Scope Limits 

-do not change drag/drop behavior 
-do not rebuild node selection logic 
-do not add a full color picker 
-keep this focused on prefined color themes only 