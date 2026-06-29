"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { AlertCircle } from "lucide-react"

interface Props {
  children?: React.ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export class CanvasErrorBoundary extends React.Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  public componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Canvas error caught:", error, errorInfo)
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null })
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-[#0f0f11] z-50 animate-in fade-in duration-300">
          <div className="max-w-md p-6 rounded-2xl border border-destructive/20 bg-destructive/5 backdrop-blur-md shadow-2xl flex flex-col items-center">
            <div className="p-3 rounded-full bg-destructive/15 text-destructive mb-4">
              <AlertCircle className="h-6 w-6" />
            </div>
            <h3 className="text-base font-semibold text-foreground mb-2">
              Canvas Connection Error
            </h3>
            <p className="text-xs text-muted-foreground mb-6 leading-relaxed">
              {this.state.error?.message ||
                "Failed to connect to the real-time canvas room. Please check your network and try again."}
            </p>
            <Button
              variant="outline"
              onClick={this.handleReset}
              className="text-xs font-medium rounded-lg px-4 border-border/40 hover:bg-muted/50"
            >
              Try Reconnecting
            </Button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
