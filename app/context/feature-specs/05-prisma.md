Prisma is already installed. add the project data models, Prisma client singleton, and first migration.

## Models

Create `prisma/model/project.prisma`.

Add `Project`:

-owner ID mapped to clerk user
-name
-optional description
-status enum: `DRAFT`, `ARCHIVED`
-`cancasJsonPath` for future canvas blob storage
-timestamps
-indexes on owner ID and creation date

Add `ProjectCollaborator`:

-project ralateion with cascade delete 
-collaborator email 
-creation timestamp 
-unique constraint on project/email
-indexes on email and project/date

Do not add extra fiels unless required by Prisma.

## Prisma Client 

Create `lib/prisma.ts` as a cached singleton.

Branch by `DATABASE_URL`:

-if it starts with `prisma+postgres://`, use Accelerate 
-otherwise use direct `@prisma/adapter-pg`

Cache the client on `global`in development for hot reloads.

## Migration 

Run the migration and generate the client.

## Dependenceis

Alreay installed:

-`prisma`
-`@prisma/adapter-pg`
-`@prisma/client`
-`pg`

## Check When Done 

-schema as both modals with correct rateions and indexes 
-`lib/prisam.ts` exprots one cached Prisma instance
-migration runs successfully  
-`npm run build`passes
