import { SignIn } from "@clerk/nextjs";
import { Sparkles, Users2, FileText } from "lucide-react";

export default function SignInPage() {
  return (
    <main className="min-h-screen grid lg:grid-cols-2 bg-black text-foreground font-sans">
      {/* Left panel: visible only on lg screens */}
      <div className="hidden lg:flex flex-col justify-between p-16 border-r border-[#1c1f26] bg-[#0e0f12]">
        {/* Logo and branding */}
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-[#00d2d2] flex items-center justify-center text-black font-extrabold text-sm">
            G
          </div>
          <span className="font-heading font-semibold text-lg tracking-tight text-white">
            Ghost AI
          </span>
        </div>

        {/* Feature presentation */}
        <div className="max-w-lg my-auto space-y-10">
          <div className="space-y-4">
            <h2 className="text-3xl xl:text-4xl font-bold tracking-tight text-white font-heading leading-tight">
              Design systems at the speed of thought.
            </h2>
            <p className="text-[#8a929e] text-sm leading-relaxed">
              Describe your architecture in plain English. Ghost AI maps it to a shared canvas your whole team can refine in real time.
            </p>
          </div>

          <div className="space-y-6">
            {/* Feature 1 */}
            <div className="flex gap-4">
              <div className="flex-none h-9 w-9 rounded-lg bg-[#141b25] border border-[#1e2a39] flex items-center justify-center text-[#00d2d2]">
                <Sparkles className="h-4 w-4" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-semibold text-white">
                  AI Architecture Generation
                </h3>
                <p className="text-xs text-[#8a929e] leading-relaxed">
                  Describe your system, AI maps it to nodes and edges on a live canvas.
                </p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="flex gap-4">
              <div className="flex-none h-9 w-9 rounded-lg bg-[#141b25] border border-[#1e2a39] flex items-center justify-center text-[#00d2d2]">
                <Users2 className="h-4 w-4" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-semibold text-white">
                  Real-time Collaboration
                </h3>
                <p className="text-xs text-[#8a929e] leading-relaxed">
                  Live cursors, presence indicators, and shared node editing across your team.
                </p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="flex gap-4">
              <div className="flex-none h-9 w-9 rounded-lg bg-[#141b25] border border-[#1e2a39] flex items-center justify-center text-[#00d2d2]">
                <FileText className="h-4 w-4" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-semibold text-white">
                  Instant Spec Generation
                </h3>
                <p className="text-xs text-[#8a929e] leading-relaxed">
                  Export a complete Markdown technical spec directly from the canvas graph.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-xs text-[#525866]">
          &copy; {new Date().getFullYear()} Ghost AI. All rights reserved.
        </div>
      </div>

      {/* Right panel: Centered Clerk form */}
      <div className="flex flex-col justify-center items-center p-6 lg:p-12 bg-black">
        <div className="w-full max-w-[400px] flex flex-col items-center gap-8">
          {/* Logo visible on small screens only */}
          <div className="flex items-center gap-3 lg:hidden">
            <div className="h-8 w-8 rounded-lg bg-[#00d2d2] flex items-center justify-center text-black font-extrabold text-sm">
              G
            </div>
            <span className="font-heading font-semibold text-lg tracking-tight text-white">
              Ghost AI
            </span>
          </div>
          <SignIn />
        </div>
      </div>
    </main>
  );
}
