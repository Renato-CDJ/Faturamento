"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import type { Expense } from "@/lib/types"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { ChevronDown, ChevronUp } from "lucide-react"
import { useState } from "react"

interface ExpensesDetailModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  expenses: Expense[]
  month: string
}

export function ExpensesDetailModal({ open, onOpenChange, expenses, month }: ExpensesDetailModalProps) {
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null)

  const monthExpenses = expenses.filter((expense) => {
    const expenseMonth = expense.date.substring(0, 7)
    return expenseMonth === month
  })

  const total = monthExpenses.reduce((sum, expense) => sum + Number(expense.amount), 0)

  const groupedByCategory = monthExpenses.reduce(
    (acc, expense) => {
      if (!acc[expense.category]) {
        acc[expense.category] = []
      }
      acc[expense.category].push(expense)
      return acc
    },
    {} as Record<string, Expense[]>,
  )

  const toggleCategory = (category: string) => {
    setExpandedCategory(expandedCategory === category ? null : category)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[85vh] flex flex-col">
        <DialogHeader className="pb-4">
          <DialogTitle className="text-2xl">Despesas do Mês</DialogTitle>
          <p className="text-sm text-muted-foreground">
            {format(new Date(month + "-01"), "MMMM 'de' yyyy", { locale: ptBR })}
          </p>
        </DialogHeader>

        <div className="rounded-lg bg-gradient-to-br from-destructive/10 to-destructive/5 border border-destructive/20 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Total de Despesas</p>
              <p className="text-3xl font-bold text-foreground">
                {total.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
              </p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-destructive">{monthExpenses.length}</p>
              <p className="text-sm text-muted-foreground">despesas</p>
            </div>
          </div>
        </div>

        <ScrollArea className="flex-1 pr-4 -mr-4">
          {Object.keys(groupedByCategory).length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <p className="text-lg">Nenhuma despesa registrada neste mês</p>
              <p className="text-sm mt-2">Adicione despesas para começar a acompanhar seus gastos</p>
            </div>
          ) : (
            <div className="space-y-3 pb-4">
              {Object.entries(groupedByCategory).map(([category, categoryExpenses]) => {
                const categoryTotal = categoryExpenses.reduce((sum, exp) => sum + Number(exp.amount), 0)
                const categoryPercentage = (categoryTotal / total) * 100
                const isExpanded = expandedCategory === category

                return (
                  <div key={category} className="space-y-0 rounded-lg border border-border bg-card overflow-hidden">
                    <button
                      type="button"
                      onClick={() => toggleCategory(category)}
                      className="w-full text-left px-4 py-3 hover:bg-muted/50 transition-colors flex items-center justify-between"
                    >
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-foreground">{category}</h3>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <span className="text-lg font-bold text-foreground">
                            {categoryTotal.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                          </span>
                          <p className="text-xs text-muted-foreground">{categoryPercentage.toFixed(1)}% do total</p>
                        </div>
                        {isExpanded ? (
                          <ChevronUp className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                        ) : (
                          <ChevronDown className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                        )}
                      </div>
                    </button>

                    {/* Progress bar */}
                    <div className="px-4 pb-3 pt-0">
                      <Progress value={categoryPercentage} className="h-2" />
                    </div>

                    {isExpanded && (
                      <div className="border-t border-border px-4 py-3 space-y-3 bg-muted/30">
                        {categoryExpenses.map((expense) => (
                          <div
                            key={expense.id}
                            className="flex items-center justify-between rounded-lg bg-card p-3 border border-border hover:border-accent transition-colors"
                          >
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-foreground truncate">{expense.description}</p>
                              <div className="flex items-center gap-2 mt-1">
                                <p className="text-sm text-muted-foreground">
                                  {format(new Date(expense.date), "dd/MM/yyyy")}
                                </p>
                                {expense.is_split && (
                                  <Badge variant="secondary" className="text-xs">
                                    Dividido em {expense.split_parts}x
                                  </Badge>
                                )}
                              </div>
                            </div>
                            <div className="text-right ml-4">
                              <span className="text-lg font-semibold text-foreground whitespace-nowrap">
                                {Number(expense.amount).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
