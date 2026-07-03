import { auth } from "@clerk/nextjs/server"
import { checkProjectAccess } from "@/lib/project-access"
import { prisma } from "@/lib/prisma"
import { put, del, get } from "@vercel/blob"
import fs from "fs"
import path from "path"

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ projectId: string }> }
) {
  const { userId } = await auth()
  if (!userId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { projectId } = await params
    
    // Check if the user has access to this project (owner or collaborator)
    const { hasAccess, project } = await checkProjectAccess(projectId)
    if (!hasAccess || !project) {
      return Response.json({ error: "Forbidden" }, { status: 403 })
    }

    const canvasData = await req.json().catch(() => null)
    if (!canvasData || typeof canvasData !== "object") {
      return Response.json({ error: "Bad Request: Invalid canvas data" }, { status: 400 })
    }

    let url: string = ""
    let updatedProject: any = null
    let blobUploadSuccess = false

    const token = process.env.BLOB_READ_WRITE_TOKEN
    if (token) {
      try {
        // Upload the canvas JSON to Vercel Blob
        const filename = `projects/${projectId}/canvas.json`
        const blob = await put(filename, JSON.stringify(canvasData), {
          access: "private",
          addRandomSuffix: true,
          token,
        })
        url = blob.url

        // Store the returned Blob URL on the matching Prisma project record
        updatedProject = await prisma.project.update({
          where: { id: projectId },
          data: { cancasJsonPath: url },
        })

        // Clean up the old blob to prevent leaking storage
        if (project.cancasJsonPath && project.cancasJsonPath.startsWith("http") && project.cancasJsonPath !== url) {
          try {
            await del(project.cancasJsonPath, { token })
          } catch (err) {
            console.error("Failed to delete old vercel blob:", err)
          }
        }
        blobUploadSuccess = true
      } catch (err) {
        console.warn("Vercel Blob upload failed, falling back to local storage:", err)
      }
    }

    if (!blobUploadSuccess) {
      // Fallback: Save to local filesystem
      const storageDir = path.join(process.cwd(), "storage", "projects")
      await fs.promises.mkdir(storageDir, { recursive: true })
      
      const filePath = path.join(storageDir, `${projectId}-canvas.json`)
      await fs.promises.writeFile(filePath, JSON.stringify(canvasData, null, 2))
      
      // Store a local path identifier in the database
      url = `/local-storage/projects/${projectId}-canvas.json`
      updatedProject = await prisma.project.update({
        where: { id: projectId },
        data: { cancasJsonPath: url },
      })
    }

    return Response.json({ success: true, url, project: updatedProject })
  } catch (error) {
    console.error("Error autosaving canvas:", error)
    return Response.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

export async function GET(
  req: Request,
  { params }: { params: Promise<{ projectId: string }> }
) {
  const { userId } = await auth()
  if (!userId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { projectId } = await params
    
    // Check access
    const { hasAccess, project } = await checkProjectAccess(projectId)
    if (!hasAccess || !project) {
      return Response.json({ error: "Forbidden" }, { status: 403 })
    }

    if (!project.cancasJsonPath) {
      return Response.json({ nodes: [], edges: [] })
    }

    // Check if it is a local path
    if (project.cancasJsonPath.startsWith("/local-storage/")) {
      const filePath = path.join(process.cwd(), "storage", "projects", `${projectId}-canvas.json`)
      try {
        const fileContent = await fs.promises.readFile(filePath, "utf-8")
        const canvasData = JSON.parse(fileContent)
        return Response.json(canvasData)
      } catch (err) {
        console.warn(`Local canvas file not found or unreadable: ${filePath}`)
        return Response.json({ nodes: [], edges: [] })
      }
    }

    // Fetch the saved canvas JSON from Vercel Blob
    const token = process.env.BLOB_READ_WRITE_TOKEN
    const blob = await get(project.cancasJsonPath, {
      access: "private",
      token,
    })

    if (!blob) {
      console.warn(`Canvas blob not found at ${project.cancasJsonPath}`)
      return Response.json({ nodes: [], edges: [] })
    }

    const response = new Response(blob.stream)
    const canvasData = await response.json()
    return Response.json(canvasData)
  } catch (error) {
    console.error("Error fetching canvas:", error)
    return Response.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
