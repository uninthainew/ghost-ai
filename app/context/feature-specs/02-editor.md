We need the base chrome component that frame every editor screen - the top navbar and the left sidebar shell. These will be reused and extened in every chapter that follows.

### Editor navbar

Create `components/editor/editor-navbar.txs`.

Requiments:

-fixed-height top navbr
-left, center, and right sections
-left section contains sidebar toggle button
-use `PaneleftOpen` / `Paneleftclose` icons based on sidebar state
-right section stays empty for now 
-dark background with subtle button border


### Project sidebar

Create `components/editor/project-sidebar.tsx`

Requiment:

-sidebar should float above the editor canvas
-opening it should not push page content 
-slides in from the left
-accept `isOpen` prop `onClose` props
-header with    `Projects` title + close button
-shadcn `Tabs`:
 -My Projects
 -Shared 
-both tabs show empty placeholder state
-full-width `New Project` button at the bottom with `Plus` icon

### Dialog Pattern

use the existing color tokens from `global.css` for dialog styling.

Support:

-title 
-description
-footer action 

Do not build actual dialog yet.

### Check when done

-new component compile without TypeScript errors
-no lint error
-dialog pattern is ready for feature use 


