import * as React from "react"
import Link from "next/link"
import { Lock } from "lucide-react"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function AccessDenied() {
  return (
    <main className="flex-1 overflow-auto p-4 flex flex-col items-center justify-center bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] dark:bg-[radial-gradient(#1f2937_1px,transparent_1px)] bg-background">
      <div className="max-w-md w-full text-center flex flex-col items-center gap-6 p-8 rounded-2xl border border-border/40 bg-card/60 backdrop-blur-md shadow-xl animate-in fade-in-50 slide-in-from-bottom-4 duration-300">
        <div className="rounded-full bg-destructive/10 p-4 border border-destructive/20 text-destructive animate-pulse">
          <Lock className="h-8 w-8" />
        </div>
        
        <div className="space-y-2">
          <h1 className="font-heading text-2xl font-bold tracking-tight text-foreground/95">
            Access Denied
          </h1>
          <p className="text-sm text-muted-foreground max-w-sm leading-relaxed">
            You do not have permission to access this project workspace, or it may not exist. Please check the URL or contact the workspace owner.
          </p>
        </div>

        <Link
          href="/editor"
          className={cn(
            buttonVariants({ variant: "default" }),
            "w-full sm:w-auto font-medium"
          )}
        >
          Return to Editor Home
        </Link>
      </div>
    </main>
  )
}
