"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

type ViewMode = "editor" | "viewer"

interface ViewModeContextType {
  mode: ViewMode
  setMode: (mode: ViewMode) => void
  isEditorMode: boolean
}

const ViewModeContext = createContext<ViewModeContextType | undefined>(undefined)

export function ViewModeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<ViewMode>("editor")

  return (
    <ViewModeContext.Provider
      value={{
        mode,
        setMode,
        isEditorMode: mode === "editor",
      }}
    >
      {children}
    </ViewModeContext.Provider>
  )
}

export function useViewMode() {
  const context = useContext(ViewModeContext)
  if (context === undefined) {
    throw new Error("useViewMode must be used within a ViewModeProvider")
  }
  return context
}
