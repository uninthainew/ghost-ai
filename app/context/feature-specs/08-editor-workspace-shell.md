Build the `/editor/[roomID]` workspace shell with serve-side access check. No canvas logic yet.

## Access 

`/editor/[roomId]` must be server component. 

Before rendering :

-authentication user redirect to `/sign-in`
-users without project access see `AccessDenied`
-non-existent project also show `AccessDenied`

Create `component/editor/access-denied.tsx` with:

-centerd layout 
-lock icon 
short message 
-link back to `/editor`

## Access Helper

Create `lib/project-access.ts` with helper for:

-getting current Clerk identity: `userId`+ primary email 
-checking project access by owner or collaborator 

## Layout 

build a full-viewport workspace layout with:

-top navbar showing the project name 
-navbar action: share button and AI side toggle
-existing `ProjectSidebar` on the left 
-current room highlingted in the sidebar 
-central canvas placeholder with dark background and centered message
-right sidebar placeholder for future AI chat 

The canvas area should fill the remaining space.

## Scope 

Do not add real canvas logic, Liveblocks, AI cha, or sharing behavior yet.

## Check When Done 

-`/editor/[roomId]` build successfully 
-access helper exists outside the page component 
-`AccessDenied`is used for missing or unauthorized projects 
-workspace layout reder with current project contex
-no TypeScript errors 