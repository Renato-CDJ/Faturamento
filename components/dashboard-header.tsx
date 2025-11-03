"use client"

import { Wallet, Plus, Settings, Eye, Edit, Calendar, FolderKanban } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState } from "react"
import { AddExpenseDialog } from "./add-expense-dialog"
import { AddIncomeDialog } from "./add-income-dialog"
import { SettingsDialog } from "./settings-dialog"
import { AddDebtDialog } from "./add-debt-dialog"
import { AddInstallmentDialog } from "./add-installment-dialog"
import { ManageCategoriesDialog } from "./manage-categories-dialog"
import { useViewMode } from "@/lib/view-mode-context"

interface DashboardHeaderProps {
  selectedMonth: string
  onMonthChange: (month: string) => void
}

export function DashboardHeader({ selectedMonth, onMonthChange }: DashboardHeaderProps) {
  const [expenseDialogOpen, setExpenseDialogOpen] = useState(false)
  const [incomeDialogOpen, setIncomeDialogOpen] = useState(false)
  const [settingsDialogOpen, setSettingsDialogOpen] = useState(false)
  const [debtDialogOpen, setDebtDialogOpen] = useState(false)
  const [installmentDialogOpen, setInstallmentDialogOpen] = useState(false)
  const [categoriesDialogOpen, setCategoriesDialogOpen] = useState(false)

  const { mode, setMode, isEditorMode } = useViewMode()

  const generateMonthOptions = () => {
    const months = []
    const currentDate = new Date()
    for (let i = 11; i >= 0; i--) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1)
      const value = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`
      const label = date.toLocaleDateString("pt-BR", { month: "long", year: "numeric" })
      months.push({ value, label })
    }
    return months
  }

  return (
    <>
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
                <Wallet className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-foreground">FinanceControl</h1>
                <p className="text-sm text-muted-foreground">Gerencie suas finanças</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <Select value={selectedMonth} onValueChange={onMonthChange}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Selecione o mês" />
                  </SelectTrigger>
                  <SelectContent>
                    {generateMonthOptions().map((month) => (
                      <SelectItem key={month.value} value={month.value}>
                        {month.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button
                variant={isEditorMode ? "default" : "outline"}
                size="sm"
                onClick={() => setMode(isEditorMode ? "viewer" : "editor")}
                className="gap-2"
              >
                {isEditorMode ? (
                  <>
                    <Edit className="h-4 w-4" />
                    Modo Editor
                  </>
                ) : (
                  <>
                    <Eye className="h-4 w-4" />
                    Modo Espectador
                  </>
                )}
              </Button>

              <Button variant="outline" size="sm" onClick={() => setCategoriesDialogOpen(true)} className="gap-2">
                <FolderKanban className="h-4 w-4" />
                Categorias
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button className="gap-2">
                    <Plus className="h-4 w-4" />
                    Adicionar
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem onClick={() => setExpenseDialogOpen(true)}>Nova Despesa</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setDebtDialogOpen(true)}>Nova Dívida</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setInstallmentDialogOpen(true)}>Novo Parcelamento</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setIncomeDialogOpen(true)}>Nova Receita</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Button variant="outline" size="icon" onClick={() => setSettingsDialogOpen(true)}>
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <AddExpenseDialog open={expenseDialogOpen} onOpenChange={setExpenseDialogOpen} />
      <AddIncomeDialog open={incomeDialogOpen} onOpenChange={setIncomeDialogOpen} />
      <SettingsDialog open={settingsDialogOpen} onOpenChange={setSettingsDialogOpen} />
      <AddDebtDialog open={debtDialogOpen} onOpenChange={setDebtDialogOpen} />
      <AddInstallmentDialog open={installmentDialogOpen} onOpenChange={setInstallmentDialogOpen} />
      <ManageCategoriesDialog open={categoriesDialogOpen} onOpenChange={setCategoriesDialogOpen} />
    </>
  )
}
