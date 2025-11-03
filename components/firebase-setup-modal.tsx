"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ExternalLink, Copy, Check, AlertCircle } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const FIREBASE_RULES = `rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    match /debts/{debtId} {
      allow read, write: if true;
    }
    match /debt_participants/{participantId} {
      allow read, write: if true;
    }
    match /expenses/{expenseId} {
      allow read, write: if true;
    }
    match /expense_participants/{participantId} {
      allow read, write: if true;
    }
    match /installments/{installmentId} {
      allow read, write: if true;
    }
    match /categories/{categoryId} {
      allow read, write: if true;
    }
    match /{document=**} {
      allow read, write: if false;
    }
  }
}`

interface FirebaseSetupModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function FirebaseSetupModal({ open, onOpenChange }: FirebaseSetupModalProps) {
  const [copied, setCopied] = useState(false)

  const copyRules = async () => {
    await navigator.clipboard.writeText(FIREBASE_RULES)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-destructive" />
            Firebase Setup Required
          </DialogTitle>
          <DialogDescription>
            Your Firestore database needs security rules configured before you can use the app.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="quick" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="quick">Quick Setup (5 min)</TabsTrigger>
            <TabsTrigger value="detailed">Detailed Guide</TabsTrigger>
          </TabsList>

          <TabsContent value="quick" className="space-y-4">
            <Alert>
              <AlertDescription>
                Follow these steps to configure your Firebase project and enable data access.
              </AlertDescription>
            </Alert>

            <div className="space-y-4">
              <div className="space-y-2">
                <h4 className="font-semibold flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm">
                    1
                  </span>
                  Open Firebase Console
                </h4>
                <p className="text-sm text-muted-foreground ml-8">
                  Click the button below to open your Firebase project in a new tab.
                </p>
                <div className="ml-8">
                  <Button variant="outline" size="sm" asChild>
                    <a
                      href="https://console.firebase.google.com/project/faturamento-7d690/firestore/rules"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Open Firestore Rules
                      <ExternalLink className="ml-2 h-4 w-4" />
                    </a>
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-semibold flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm">
                    2
                  </span>
                  Copy the Security Rules
                </h4>
                <p className="text-sm text-muted-foreground ml-8">
                  Click the button below to copy the rules to your clipboard.
                </p>
                <div className="ml-8">
                  <Button variant="outline" size="sm" onClick={copyRules}>
                    {copied ? (
                      <>
                        <Check className="mr-2 h-4 w-4" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="mr-2 h-4 w-4" />
                        Copy Rules
                      </>
                    )}
                  </Button>
                </div>
                <div className="ml-8 mt-2">
                  <pre className="bg-muted p-4 rounded-lg text-xs overflow-x-auto max-h-48">
                    <code>{FIREBASE_RULES}</code>
                  </pre>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-semibold flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm">
                    3
                  </span>
                  Paste and Publish
                </h4>
                <p className="text-sm text-muted-foreground ml-8">In the Firebase Console:</p>
                <ul className="text-sm text-muted-foreground ml-8 list-disc list-inside space-y-1">
                  <li>Replace all existing rules with the copied rules</li>
                  <li>Click the "Publish" button</li>
                  <li>Wait for the confirmation message</li>
                </ul>
              </div>

              <div className="space-y-2">
                <h4 className="font-semibold flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm">
                    4
                  </span>
                  Refresh This Page
                </h4>
                <p className="text-sm text-muted-foreground ml-8">
                  After publishing the rules, refresh this page to start using the app.
                </p>
                <div className="ml-8">
                  <Button variant="default" size="sm" onClick={() => window.location.reload()}>
                    Refresh Page
                  </Button>
                </div>
              </div>
            </div>

            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-xs">
                <strong>Development Rules Warning:</strong> These rules allow unrestricted access to your database. Only
                use them for development. Before deploying to production, implement proper authentication and security
                rules.
              </AlertDescription>
            </Alert>
          </TabsContent>

          <TabsContent value="detailed" className="space-y-4">
            <div className="space-y-4 text-sm">
              <div>
                <h4 className="font-semibold mb-2">What are Firestore Security Rules?</h4>
                <p className="text-muted-foreground">
                  Firestore Security Rules control who can read and write data in your database. By default, all access
                  is denied until you configure rules. This error occurs because your database doesn't have any rules
                  set up yet.
                </p>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Why do I need to do this?</h4>
                <p className="text-muted-foreground">
                  Firebase requires you to explicitly configure security rules through the Firebase Console. This
                  ensures you're aware of who can access your data and prevents accidental data exposure.
                </p>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Is this safe?</h4>
                <p className="text-muted-foreground">
                  The rules provided are for <strong>development only</strong> and allow anyone to read/write your data.
                  This is fine for testing, but you should implement proper authentication and user-specific rules
                  before deploying to production.
                </p>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Troubleshooting</h4>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>Make sure you're logged into the correct Google account</li>
                  <li>Verify you have permission to edit the Firebase project</li>
                  <li>Wait 10-30 seconds after publishing for rules to take effect</li>
                  <li>Check the Firebase Console for any error messages</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Need Help?</h4>
                <p className="text-muted-foreground">
                  Check the <code className="bg-muted px-1 py-0.5 rounded">QUICK_START.md</code> file in your project
                  for more detailed instructions and screenshots.
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            I'll Do This Later
          </Button>
          <Button variant="default" asChild>
            <a
              href="https://console.firebase.google.com/project/faturamento-7d690/firestore/rules"
              target="_blank"
              rel="noopener noreferrer"
            >
              Open Firebase Console
              <ExternalLink className="ml-2 h-4 w-4" />
            </a>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
