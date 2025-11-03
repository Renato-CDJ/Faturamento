"use client"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { AlertCircle, ExternalLink } from "lucide-react"
import { useState } from "react"

export function FirebaseSetupBanner() {
  const [dismissed, setDismissed] = useState(false)

  if (dismissed) return null

  return (
    <Alert variant="destructive" className="mb-6">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Firebase Setup Required</AlertTitle>
      <AlertDescription className="mt-2 space-y-2">
        <p>Your Firestore database needs security rules configured. This takes 5 minutes:</p>
        <ol className="list-decimal list-inside space-y-1 text-sm">
          <li>
            Open{" "}
            <a
              href="https://console.firebase.google.com/project/faturamento-7d690/firestore"
              target="_blank"
              rel="noopener noreferrer"
              className="underline inline-flex items-center gap-1"
            >
              Firebase Console
              <ExternalLink className="h-3 w-3" />
            </a>
          </li>
          <li>Go to Firestore Database → Rules tab</li>
          <li>Copy rules from firebase-rules-development.rules file</li>
          <li>Click Publish</li>
        </ol>
        <div className="flex gap-2 mt-3">
          <Button variant="outline" size="sm" asChild>
            <a
              href="https://console.firebase.google.com/project/faturamento-7d690/firestore"
              target="_blank"
              rel="noopener noreferrer"
            >
              Open Firebase Console
              <ExternalLink className="ml-2 h-4 w-4" />
            </a>
          </Button>
          <Button variant="ghost" size="sm" onClick={() => setDismissed(true)}>
            Dismiss
          </Button>
        </div>
      </AlertDescription>
    </Alert>
  )
}
