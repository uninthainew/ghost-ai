Set up the realtime collaboration infrstructure using liveblocks.

## Configuretion 

Configre the `liveblocks.config.ts` at the project root.

Define:

### Presence 

-cursor position 
-`isThinking` boolean 

### UserMeta

-user ID 
-display name 
-avatar URL  
-cursor color 

## LiveBlocks Client 

Create al cached Liveblocks node client in `lib`.

Add a helper that deterministically maps a uer ID to a consistent color from a fixed palette.

## Auth Route 

Creat `POST/api/liveblocks-auth`.

Use the project ID as the Liveblocks room ID.

This route must:

1.require Clerk authentiacation 
2.verify project access using the existing access helper
3.ensure the Liveblocks room existing (create only if needed)
4.return the session token with:
-user name 
-avatar 
-generated cursor color

Return `403` for unauthorized access.

