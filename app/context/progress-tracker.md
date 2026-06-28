# Progress Tracker

Update this file after every meaningful implementation
change.

## Current Phase

- Completed (Phase 7: Wire Editor Home)

## Current Goal

- Ready for next spec instructions.

## Completed

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

- [Next feature to build]

## Open Questions

- None.

## Architecture Decisions

- Using shadcn/ui base-nova style (newest v4 design) with dark theme support
- CSS variables from shadcn cover both `:root` (light) and `.dark` variants
- Components live in `components/ui/`, utils in `lib/utils.ts`
- Icon library: lucide-react (configured in components.json)
