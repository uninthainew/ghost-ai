## Goal 

Build the `/editor`home screen and add project dialogs/sidbar actions. no API calls or persistence yet.

## Editor Home

Reuse the existing editor layout. Do not modify the navbr or sidebar behavior.

In the center of the page, add:

-heading: `Create a project or open an existing one`.
-description: `Start a new architecture workspace, or choose a project from the sidebar.`
-`New Project` button with a `Plus`icon

Keep the layout minimal. Do not wrap this content in cards.

Clicking `New Project`should open the Create Project dialog.

## Dialogs

### Create Project 

-project name input 
-live slug preivew based on the name
-preview updates as the user types

### Rename Project

-perfilled project name input 
-current project name show in the description
-input auto-focuses
-Enter submits

### Delete Project

-Desstructive confirmation only
-no input 
-confirm button uses destructive styling

## Sidebar

Add project item action:

-rename
-delete

Show actions only for owned projects.

hide actions for shared/collabrator projects.

on mobile:

-tapping outside the sidebar close it
-add a backdrop scrim

## Implementation 

Create a dedicated hook to manage:

-dialog stae 
-form state 
-loading state 

Wire:

-editor home `New Proejct` -> Create dialog 
-sidebar ceate -> Create dialog
-sidebar rename -> Rename dialog
-sidebar delete -> Delete dialog

Use mock project data only. Do not add API calls or persistence.

## Check When done

-sidebar actions are wired 
-slug proview works
-no TypeScript errors
-no lint errors