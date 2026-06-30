Add a small starter template library so users can strat a canvas from a pro-built diagram instead fo building form scratch.

## Implmentation

1.Create `component/editor/starter-template.ts`.  

 Include:
    -a `CanvasTemplate` type 
    -a `CANVAS_TEMPLAES` array
    -at lest three or more templates, suah as microservice, CI/CD pipline, and event-driven system or more.

 Each template should include:
    - `id`
    - `name`
    - `description` 
    - node
    - edges

 Use the shared canvas type and exsting node color palette. Add small helper functions if needed to keep the template data readable.

2.Create `component/editor/starter-template-model.tsx`.
 The modal should:
    -open as a dialog 
    -show template cards in a scrollable gird
    -show the template name and description
    -include an import button for each template 
    -call `onImport` with the selected template, then close 

3.Add a small diagram preview to each template card.
    -fit the preview to the fixed-size viewport
    -calculate the preview bounds from the template node positions
    -draw edges as simple line between node centers 
    -draw node using they shape and color data 
    -keep the prview lightweight, no React Flow instance needed 
    
