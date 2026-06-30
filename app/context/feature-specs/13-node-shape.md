Replace the placeholder node renderer with proper shape rendering and a drag preview.

## Implementation 

1.Replace the placeholder node shape rendering.
    -Rectangle, pill, and circle should use css stylign
    -diamond, hexagon, and cylinder should render wiht SVG shapes
    -SVG shape should scale with node size
    -keep borders subtle at rest and brighter shen selected

2.Add a shape drag preview.
    -when dragging a shape from the shape panel, show a ghost preview of that shape
    -keep the prview attached to the cursor while dragging 
    -use the same spae type and defualt size that will be used on drop 
    -hide the prview after the shape is dropped or the drag is cancelled
    -keep this limited to drag preview behavior only 

3.Keep node rendering connected to the existing collaboratvie canvas state.

## Scope Limits

-do not rebuild shape panel layout 
-doon not change how dropped node are created 
-do not add resize or label editing yet
-keep drag/drop change limited or the ghost preview only

## Check When Done 

-Node render the correct shape variant for each type.
-CSS shape render correctly for rectangle, circle and pill.
-SVG shapes render and scale correctly for diamond, hexagon, and cylinder.
-Shape dragging show a ghost preview matching the dragged shape.
-`npm run build` passes without type errors.
