"use client"

import { DashboardHeader } from "@/components/dashboard-header"
import { FinancialOverview } from "@/components/financial-overview"
import { ExpenseChart } from "@/components/expense-chart"
import { DebtsList } from "@/components/debts-list"
import { InstallmentsList } from "@/components/installments-list"
import { FinancialInsights } from "@/components/financial-insights"
import { RecentTransactions } from "@/components/recent-transactions"
import { FirebaseSetupModal } from "@/components/firebase-setup-modal"
import { ViewModeProvider } from "@/lib/view-mode-context"
import { ProtectedRoute } from "@/components/protected-route"
import { useCategories } from "@/lib/hooks/use-categories-firebase"
import { useState, useEffect } from "react"

export default function DashboardPage() {
  const { error } = useCategories()
  const [showSetupModal, setShowSetupModal] = useState(false)

  useEffect(() => {
    if (error?.includes("Missing or insufficient permissions")) {
      setShowSetupModal(true)
    }
  }, [error])

  return (
    <ProtectedRoute>
      <ViewModeProvider>
        <div className="min-h-screen bg-background">
          <DashboardHeader />

          <main className="container mx-auto px-4 py-8 space-y-8">
            <FinancialOverview />

            <div className="grid gap-6 lg:grid-cols-2">
              <ExpenseChart />
              <FinancialInsights />
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <DebtsList />
              <InstallmentsList />
            </div>

            <RecentTransactions />
          </main>

          <FirebaseSetupModal open={showSetupModal} onOpenChange={setShowSetupModal} />
        </div>
      </ViewModeProvider>
    </ProtectedRoute>
  )
}
