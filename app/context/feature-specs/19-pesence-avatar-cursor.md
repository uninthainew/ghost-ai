Show active room praticipant in side the editor canvas view, with out changing the editor home navbar.

## Implemntation

1.Keep the existing navbar vehavior as-is.
    -do not change the editor home navbar 
    -do not move or redisign the shared navbar component globally
    -it the editor home and editor canvas use the same navbar component, make sure this presence UI only appear in the editor/canvas room view 

2.Add the participant avatar group inside the editor canvas area.
    -position it in the top-right corner of the editor canvas view 
    -keep it visually seprate form the main navbar actions
    -get the current user's ID room the active Clerk sessin
    -filter the liveblocks presence list to exclude any entry whose user ID matches the current Clerk user ID 
    -render the filtered list as collabortor avatar only 
    -render the current user separately using the existing clerk UserButton - do not render a second avatar for them from the liveblock presence list
    -keep the collaborator avatar and the Clerk UserButton the same size so the group look visuallly consistent 
    -collaborator avatar are display-only, not interactive 
    -show the divider between collaborator avatars and the Clerk UserButton only when at least one collaborator exists
    -if no collaborator are prosent, show only the Clerk UserButton with no divider 

3.Render collaborator avatars.
    -uer profile photo when avilable 
    -fall back to initails when these no image 
    -show up to five collaborator avatars in an overlapping stack 
    -show a +N overflow chip when there are more than five 
    -add a subtle ring so avatar stay readable on the dark canvas 

4.Add live cursors to the canvas.
    -render cursors for another panrticipant only, never the current user 
    -use the existing liveblocks prsence state to brosdcast cursor position 
    -update cursor position on React Flow's onMouseMove event 
    -clear cursor to null on mouse leave 
    -show a small colored pointer with a name bage attached 
    -match the pointer and bage color to the participant's presence color

5.Define the shared prsence type in `liveblocks.config.ts`.
    
    Presence should include:
    -`cursor`:`{x: number; y:number} | null` 
    -`thinking`: boolean 

## Scope Limits 

-do not add partiscipant avatars to the shared navbar globally 
-do not remove existing navbar action like Save, Import, Share, Or AI 
-do not replace Clerk user/profile/layout/behavior 
-do not make collaborator avatar interactive 
-do not change cnavas node or edge behavior 

