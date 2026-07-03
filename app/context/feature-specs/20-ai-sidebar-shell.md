Complate the existing AI sidebar placeholder and turn it into a proper floating chat sidebar component. The sidebar already exists, so keep the current floating placement and smooth slide-in behavior from the right side. this unit is focused on bilding out the sidebar UI inside it.

## Implementation 

1.Separate the AI sidebar into its own component.
    -keep the open/close state controlled by the parent 
    -preserve the existing slide animation, floating positon, border, background, and shwo styling 
    -use sidebar surface style like `bg-base/95`, `border-surface-border`, and the current shadow treatment 

2.Add the sidebar header.
    -title:`AI Workspace`
    -subtitle:`Collaborator with Ghost AI`
    -small bot icon 
    -close button aligned to the right 
    -use `text-primary-text ` for the title 
    -use `text-secondary-text ` for the subtitle 

3.Add a tabbed layout with two tab.

  Use shadcn `Tabs`.
  -`AI Architect`
  -`Specs`
  -active tab should use the accent styling, like `bg-accent`and `text-accent`
  -inactive tab text shoud stay muted with `text-muted-text`

4.Build the AI Arcitect tab.
  
  Use shadcn component where they fit, especially `Button` and `textarea`
  -scrollable chat area
  -empty state with bot icon, short description, and starter prompt chips 
  -starter chips:
    -` Design an e-commerce backend`
    -`Create a chat app architecture`
    -`Build a CI/CD pipeline`
  -style starter chips as soft pills using `bg-suble`and `text-accent-text`
  -user messages should be right-align with `bg-brand-dim border-brand/50 border-2 text-copy-primary`
  -assistant massages should be left-align with `bg-elevated border border-surface-border text-accent-text`
  -input area with an auto-resizing textarea, around 72px min height and 160px max height 
  -`Enter` submits, `Sift+Enter` Adds a newline 

5.build the specs tap.
  -show a `Generate spec` button using `bg-accent text-white`
  -show a demo spec card for now 
  -style the card with `bg-elevated` and `border-surface-border`
  -include a file/spec icom, title, short snippet, and disabled download action 

## Spoce Limits

-do not rebuid the existing sidebar open/close behavior 
-do not add backend logic 
-do not add Liveblocks or AI generation logic yet
-keep this focused on the sidebar UI structure 
