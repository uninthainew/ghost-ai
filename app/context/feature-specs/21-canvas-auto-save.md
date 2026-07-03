Add autosave and loading for the collaborator canvas so project state is persisted before adding AI generation canvas JSON should be store in Vercel Blob, and the save Blob URL should be stored on the prisma project record.

## What to install 
-`@vercel/blob`

## Implementation  

1.Check the existing project schema.
    -review `prisma/model/project.prisma` 
    -add or reuse a field for the canvas blob URL 
    -keep Prisma responsable for metadata only 

2.Add canvas save/load API routes.
  Create:`PUT/api/projects/[projectId]/canvas`
  This route should:
  -recive the leatest canvas JSON 
  -update the JSON to Vercel Blob
  -store the returned Blob URL on teh matching Prisma project record 

  Create:`GET/api/projects/[projectId]/canvas`
  This route should:
  -read the project's saved blob URL from Prisma
  -fetch the saved canvas JSON from Vercel Blob 
  -return the canvas state to the editor 

3.Add an autosave hook in teh `/hook` folder.
  -watch the canvas node and edges 
  -debounce the save to avoid excessive writes
  -save through the canvas  API route 
  -track save status: saving, saved, error

4.Load saved canvas state in the editor.
-when the editor loads, check if the Liveblocks room has any existing nodes or edges 
-if the room is empty and project has a saved canvas blob URL, fetch and saved the load canvas state
-if the room already has nodes or edges, skip the loadign entirely to avoid overwritting active collaboration 

5.Add a small save status indicator in teh editor save button. 
  -show saving, saved, or error states

## Storage Pattern 

-Prisma store project metadata and the canvas blob URL.
-Vecel Blob store the actual canvas JSON.


