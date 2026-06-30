Add a button shape panel so users can drag shape onto the canvas and create new nodes.

## Implementation 

1.Add a flatinng pill-shape toolbar at the button-center of the canvas.

2.Add draggable icon button for these shapes:
    -rectangle 
    -diamond
    -circle 
    -pill
    -cylinder
    -hexagon

3.When dragging a shape, include the shape name and default size in the drag payload.

    Use senseble defult size:
    -rectangle should be wider than tall 
    -circle should be square 
    -diamond should be slightly larger so labels have room 

4.Add `dragover`and `drop` handling to canas wrapper.

5.On drop:
-read the draged shape payload
-convert the screen position to canvas coordinates usint React Flow
-create a new node at that position 
-use an empty label 
-use the drag shape value 
-use the default node color

6.Generate each node ID using the shape name, timstamp, and a counter. 

7.Add a basic renderer for the cutom canvas node type so new nodes are visible.

For this unit, render every shape as a simple bordered rectangle with the label centered.Shape-secific visuals will be added later.

## Check when done 

-Shape drag payload include the correct shape and size data.
-Drop logic creates new canvas nodes with the expexted shape data.
-New nodes use the custom canvas node type.
-`npm run build` passes without type errors.

