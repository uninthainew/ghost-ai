import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const signInUrl = process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL || "/sign-in";
const signUpUrl = process.env.NEXT_PUBLIC_CLERK_SIGN_UP_URL || "/sign-up";

// Match the sign-in and sign-up pages (and their sub-paths) as public routes
const isPublicRoute = createRouteMatcher([
  "/",
  signInUrl,
  `${signInUrl}(.*)`,
  signUpUrl,
  `${signUpUrl}(.*)`,
]);

export default clerkMiddleware(async (auth, req) => {
  if (!isPublicRoute(req)) {
    const isApiOrTrpc = req.nextUrl.pathname.startsWith("/api") || req.nextUrl.pathname.startsWith("/trpc");
    if (isApiOrTrpc) {
      const { userId } = await auth();
      if (!userId) {
        return new Response(
          JSON.stringify({ error: "Unauthorized" }),
          {
            status: 401,
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
      }
    } else {
      await auth.protect();
    }
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
