# Progress Tracker

Update this file after every meaningful implementation
change.

## Current Phase

- Completed (Phase 12: Shape Panel)

## Current Goal

- Ready for next spec instructions.

## Completed

- Implemented Phase 12: Shape Panel feature:
  - Created custom node rendering component `components/editor/canvas-node.tsx` supporting border styling based on node color, empty label placeholders, and 4-way handles (Top, Bottom, Left, Right).
  - Wrapped canvas room wrapper in `ReactFlowProvider` inside `components/editor/canvas-wrapper.tsx` to enable Coordinate conversion utility hooks.
  - Implemented floating pill-shape shape panel at the bottom center of the canvas in `components/editor/collaborative-canvas.tsx` with drag hooks for rectangle, diamond, circle, pill, cylinder, and hexagon shapes.
  - Handled drag-and-drop mechanics to convert mouse coordinates to canvas positions, generate deterministic node IDs using shape names, timestamps and counters, and append new `canvasNode` objects to the Liveblocks synced state.
  - Verified a clean compilation and type checking via Next.js production build (`npm run build`).

- Implemented Phase 11: Base Canvas Setup for realtime collaboration:
  - Defined shared types in `types/canvas.ts` including node data properties (`label`, `color`, `shape`) and canvas node/edge types.
  - Implemented `components/editor/canvas-error-boundary.tsx` to handle React Flow and Liveblocks client connection and rendering errors.
  - Created a modular `components/editor/collaborative-canvas.tsx` component that retrieves synced state via `@liveblocks/react-flow` hook `useLiveblocksFlow` and renders `<ReactFlow>` with dot background and MiniMap.
  - Developed a client-side room wrapper `components/editor/canvas-wrapper.tsx` configuring `LiveblocksProvider` with `/api/liveblocks-auth` authEndpoint, initializing room presence, and rendering a React Suspense loading state.
  - Refactored `app/editor/[roomId]/workspace-view.tsx` to embed the collaborative canvas, replacing the static mockup architecture nodes and custom zoom controls.

- Implemented Phase 10: Liveblocks Setup for realtime collaboration:
  - Installed `@liveblocks/node` dependency to interact with Liveblocks REST APIs on the server side.
  - Configured `liveblocks.config.ts` defining user `Presence` (with cursor position and `isThinking` flag) and `UserMeta` (with user id, display name, avatar, and cursor color details).
  - Created a cached Liveblocks client singleton and a deterministic HSL color palette helper in `lib/liveblocks.ts`.
  - Created `POST /api/liveblocks-auth/route.ts` authentication endpoint that requires Clerk auth, checks project access permissions via existing helper, automatically provisions Liveblocks room if needed, and returns the session token (with name, avatar, and color).
  - Added a mock/placeholder `LIVEBLOCKS_SECRET_KEY` in `.env.local` to enable local compilation and local development.


- Implemented Project Share Dialog enabling project collaboration:
  - Created backend endpoints (`app/api/projects/[projectId]/collaborators/route.ts`) supporting GET (listing members), POST (inviting collaborator), and DELETE (removing collaborator).
  - Enforced server-side checks restricting invite/remove actions to the project owner, and restricted member listing to users with access (owner/collaborators).
  - Integrated Clerk backend API (`clerkClient()`) to enrich collaborator emails with real display names and avatars where available, falling back to email-only for non-registered users.
  - Extended project context (`project-context.tsx`) and hook (`use-project-action.ts`) to manage share dialog lifecycle state.
  - Implemented `<ShareDialog />` modal (`components/editor/share-dialog.tsx`) that retrieves member list, lets owners invite/delete collaborators and copy the workspace link (with a 2-second clipboard feedback notification), and shows a read-only member list to collaborators.
  - Registered `<ShareDialog />` in the global `ProjectDialogs` manager (`components/editor/project-dialogs.tsx`) and wired the Editor navbar "Share" button (`components/editor/editor-navbar.tsx`) to open it.
  - Repaired a syntax corruption in the sidebar workspace items list (`components/editor/project-sidebar.tsx`).
  - Verified a clean compilation and TypeScript type checking using `npm run build`.

- Implemented `/editor/[roomId]` workspace shell layout and server-side access control checks:
  - Created `lib/project-access.ts` to fetch Clerk identity and verify user access permissions (owner/collaborator) for a project.
  - Implemented `<AccessDenied />` screen styled with a custom layout, lock icon, and back-navigation link.
  - Renamed the dynamic folder path from `[projectId]` to `[roomId]` and refactored route references in `project-sidebar.tsx` and `use-project-action.ts` to use the `roomId` path parameter.
  - Implemented `app/editor/[roomId]/page.tsx` and `workspace-view.tsx` representing a server-checked shell holding a dark canvas node diagram mockup, and an interactive right-sidebar AI Chat panel.
  - Customized `editor-navbar.tsx` to dynamically show the project name, a dummy "Share" action, and a "AI Assistant" toggle button wired to the chat sidebar context.
  - Resolved dynamic project updates in the sidebar by implementing client-side projects state in `ProjectProvider` synced with Clerk client context and updated upon successful mutations.
  - Linked the navbar project title back to `/editor` to support workspace exit navigation.
  - Automated sidebar closure upon project creation by managing sidebar open state globally in `ProjectProvider` and closing it via programmatic callback in `useProjectAction`.
  - Verified a clean compilation and TypeScript type checking using `npm run build`.

- Wired the editor home sidebar and dialogs to the real database-backed project API:
  - Created a database access helper `lib/projects.ts` to fetch user-related (owned and collaborator) projects.
  - Converted the editor home page `/editor` and layout to Server Components, loading project lists server-side with no client-side fetching on initial load.
  - Implemented the client-side interactive layout shell in `app/editor/layout-client.tsx` and custom client button `components/editor/new-project-button.tsx`.
  - Created the custom React hook `hooks/use-project-action.ts` to handle project mutations (Create, Rename, Delete) and dialog states.
  - Configured project ID and Liveblocks room ID alignment during project creation (uses slugified name + a short unique 5-char random suffix).
  - Implemented dynamic project workspace route at `/editor/[projectId]` that verifies access rights (owner/collaborator) and displays details.
  - Wired Sidebar project items as navigation links with active workspace styling.
  - Verified compilation and type checking are fully clean with `npm run build`.

- Initialized Next.js project with Tailwind v4
- Installed and configured shadcn/ui (v4, base-nova style)
- Created `lib/utils.ts` with `cn()` helper (clsx + tailwind-merge)
- Installed lucide-react for icons
- Added shadcn UI primitives: Button, Card, Dialog, Input, Tabs, Textarea, ScrollArea
- Globals.css updated with shadcn theme tokens (light + dark)
- Build verified clean
- Implemented base chrome frame: `EditorNavbar` (with responsive sidebar toggle) and `ProjectSidebar` (floating slide-in panel with tab navigation, empty states, and action buttons)
- Page layout integration and Turbopack production compilation verified clean
- ESLint checks verified clean
- Integrated Clerk authentication:
  - Configured `@clerk/nextjs` with root layout `<ClerkProvider>` wrapping, utilizing base `dark` theme overlaid dynamically with existing CSS variables (`--primary`, `--background`, etc.)
  - Created root-level `proxy.ts` to protect all routes by default, while allowing `/sign-in` and `/sign-up` public auth routes defined using existing env variables
  - Implemented conditional root path redirect in `app/page.tsx` (authenticated to `/editor`, unauthenticated to `/sign-in`)
  - Created responsive, minimal custom `/sign-in` and `/sign-up` pages (two-panel on large screens, single panel Clerk form on small screens) with no gradients or oversized hero elements
  - Added Clerk's built-in `UserButton` to the right section of the `EditorNavbar`
  - Verified production build compile and TypeScript type check passes cleanly
- Implemented `/editor` minimalist home screen with centered heading and "New Project" trigger.
- Implemented Project Dialogs (Create, Rename, Delete) using React Context state, live slug previews, autofocus fields, Enter-key submission forms, and simulated loading states.
- Updated slug generator (generateSlug) to preserve special characters (such as !!!) so they are displayed in the slug preview block rather than stripping them into empty strings.
- Integrated sidebar actions (rename & delete icons on hover) exclusively for owned projects, and hid actions for collaborator/shared projects.
- Configured Prisma database models and singleton client setup:
  - Created `prisma/model/project.prisma` containing Project (ownerId, name, description, status, `cancasJsonPath`, timestamps, indexes) and ProjectCollaborator (cascade delete relation to Project, collaborator email, creation timestamp, unique constraint, indexes) schemas using Prisma's multi-file schema feature
  - Configured `lib/prisma.ts` as a cached client singleton with dynamic branching for standard PostgreSQL or Prisma Accelerate depending on the `DATABASE_URL` protocol
  - Executed first migration and regenerated Prisma Client successfully
  - Verified production Next.js build compilation is clean
- Implemented backend-only project API routes (`/api/projects` and `/api/projects/[projectId]`):
  - `GET /api/projects`: Lists current user's owned and collaborator projects, querying the database using their Clerk authentication ID and email addresses.
  - `POST /api/projects`: Creates a new project, defaulting missing project names to "Untitled Project".
  - `PATCH /api/projects/[projectId]`: Renames a project, enforcing ownership checks (returns `403` for non-owners, `401` for unauthenticated requests).
  - `DELETE /api/projects/[projectId]`: Deletes a project, enforcing ownership checks (returns `403` for non-owners, `401` for unauthenticated requests).
  - Configured route handlers to support Next.js 16 dynamic parameters by treating `params` as a `Promise`.
  - Verified compilation and type checking are fully clean with `npm run build`.

## In Progress

- None.

## Next Up

- Ready for next spec instructions.

## Open Questions

- None.

## Architecture Decisions

- Using shadcn/ui base-nova style (newest v4 design) with dark theme support
- CSS variables from shadcn cover both `:root` (light) and `.dark` variants
- Components live in `components/ui/`, utils in `lib/utils.ts`
- Icon library: lucide-react (configured in components.json)
