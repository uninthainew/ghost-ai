import { Liveblocks } from "@liveblocks/node"

const globalForLiveblocks = global as unknown as { liveblocks: Liveblocks }

export const liveblocks =
  globalForLiveblocks.liveblocks ||
  new Liveblocks({
    secret: process.env.LIVEBLOCKS_SECRET_KEY!,
  })

if (process.env.NODE_ENV !== "production") {
  globalForLiveblocks.liveblocks = liveblocks
}

// Curated palette of vibrant, harmonious colors
const PALETTE = [
  "#e11d48", // rose-600
  "#db2777", // pink-600
  "#9333ea", // purple-600
  "#7c3aed", // violet-600
  "#2563eb", // blue-600
  "#0891b2", // cyan-600
  "#0d9488", // teal-600
  "#059669", // emerald-600
  "#16a34a", // green-600
  "#d97706", // amber-600
  "#ea580c", // orange-600
]

/**
 * Deterministically maps a user ID to a consistent HSL-adjacent hex color from a fixed palette.
 */
export function getDeterministicColor(userId: string): string {
  let hash = 0
  for (let i = 0; i < userId.length; i++) {
    hash = userId.charCodeAt(i) + ((hash << 5) - hash)
  }
  const index = Math.abs(hash) % PALETTE.length
  return PALETTE[index]
}
