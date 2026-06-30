import { auth, currentUser } from "@clerk/nextjs/server"
import { checkProjectAccess } from "@/lib/project-access"
import { liveblocks, getDeterministicColor } from "@/lib/liveblocks"

export async function POST(request: Request) {
  try {
    // 1. Require Clerk authentication
    const { userId } = await auth()
    const user = await currentUser()

    if (!userId || !user) {
      return new Response("Unauthorized", { status: 401 })
    }

    const body = await request.json().catch(() => ({}))
    const { room } = body

    if (!room || typeof room !== "string") {
      return new Response("Room ID is required", { status: 400 })
    }

    // 2. Verify project access using the existing access helper
    const { hasAccess, project } = await checkProjectAccess(room)

    if (!hasAccess || !project) {
      return new Response("Forbidden", { status: 403 })
    }

    // 3. Ensure the Liveblocks room exists (create only if needed)
    try {
      await liveblocks.getRoom(room)
    } catch (err: any) {
      if (err.status === 404) {
        // Room doesn't exist, create it.
        // We set defaultAccesses to empty array (private) or room:write.
        // Since we check project access inside this endpoint, setting defaultAccesses to [] (private)
        // is recommended, and then we grant FULL_ACCESS dynamically in this session.
        await liveblocks.createRoom(room, {
          defaultAccesses: [],
        })
      } else {
        throw err
      }
    }

    // Fetch user details
    const email = user.emailAddresses.find(
      (e) => e.id === user.primaryEmailAddressId
    )?.emailAddress || user.emailAddresses[0]?.emailAddress || ""

    const name = [user.firstName, user.lastName].filter(Boolean).join(" ") || user.username || email.split("@")[0] || "Guest"
    const avatar = user.imageUrl || ""
    const color = getDeterministicColor(userId)

    // 4. Return the session token
    const session = liveblocks.prepareSession(userId, {
      userInfo: {
        name,
        avatar,
        color,
      },
    })

    // Grant write access to the specific room requested
    session.allow(room, session.FULL_ACCESS)

    const { status, body: responseBody } = await session.authorize()
    return new Response(responseBody, { status })
  } catch (error: any) {
    console.error("Liveblocks auth error:", error)
    return new Response("Internal Server Error", { status: 500 })
  }
}
