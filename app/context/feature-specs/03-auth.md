Claerk is already installed and connected. Write it onto the next.js app: prodivder, auth pages,
redirects, route protection, and user menu.

## Design 

Use Clerk's `dark` them from the `@clerk/ui/them` as the base

Override Clerk appearences varibles using the app's exsiting CSS varibles. Do not hardcore colors.

### sign-in and sign-up pages:

-large screens: simple two-panel layout
-left: compect logo, tagline, shot text-only feature list
-right: centered Clerk form
-small screens: form only
-no gardinents
-no oversized hero section
-nofeature card
-no scroll-heavy layouts

Keep the loyout minimal and professional.

## Implementation 

Warp the root layout with `ClerkProvider` using Clerk's `dark` theme.

Create sign-in and sign-up pages using Clerk components.

Use `proxy.ts`at the project root, not `middleware.ts`.

Difine public routes using the exsiting sign-in and sign-up env var. Protect everything else by default.

Update`/`:

-authentication users redirects to`/editor`
-unauthenticated users  redirected to`/sign-in`

Add Clerk's built-in `UserButton` to the editor navbar right section for profile sittings and internals.

Use existing Clerk env var. Do not rename or invent new ones.

## Dependencies:

install:@clerk/ui

## Check When Done

-`proxy.ts`exist at the root
-all routes are protected except public auth paths
-auth pages use CSS varibles with no hardcore colors
-`ClerkProvider`warp the root layout
-`npm run build `passes
