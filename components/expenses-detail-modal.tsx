"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
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
      <DialogContent className="max-w-6xl max-h-[90vh] flex flex-col">
        <DialogHeader className="pb-6">
          <DialogTitle className="text-3xl font-bold">Despesas do Mês</DialogTitle>
          <DialogDescription className="text-base">
            Visualize todas as despesas de {format(new Date(month + "-01"), "MMMM 'de' yyyy", { locale: ptBR })}{" "}
            organizadas por categoria.
          </DialogDescription>
        </DialogHeader>

        <div className="rounded-xl bg-gradient-to-br from-destructive/15 via-destructive/10 to-destructive/5 border-2 border-destructive/30 p-8 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-muted-foreground mb-2 uppercase tracking-wide">
                Total de Despesas
              </p>
              <p className="text-4xl font-bold text-foreground">
                {total.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
              </p>
            </div>
            <div className="text-right">
              <p className="text-4xl font-bold text-destructive">{monthExpenses.length}</p>
              <p className="text-sm font-medium text-muted-foreground">despesas</p>
            </div>
          </div>
        </div>

        <ScrollArea className="flex-1 pr-4 -mr-4">
          {Object.keys(groupedByCategory).length === 0 ? (
            <div className="text-center py-16 text-muted-foreground">
              <p className="text-xl font-medium">Nenhuma despesa registrada neste mês</p>
              <p className="text-sm mt-2">Adicione despesas para começar a acompanhar seus gastos</p>
            </div>
          ) : (
            <div className="space-y-4 pb-4">
              {Object.entries(groupedByCategory).map(([category, categoryExpenses]) => {
                const categoryTotal = categoryExpenses.reduce((sum, exp) => sum + Number(exp.amount), 0)
                const categoryPercentage = (categoryTotal / total) * 100
                const isExpanded = expandedCategory === category

                return (
                  <div
                    key={category}
                    className="space-y-0 rounded-xl border-2 border-border bg-card overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                  >
                    <button
                      type="button"
                      onClick={() => toggleCategory(category)}
                      className="w-full text-left px-6 py-5 hover:bg-muted/50 transition-colors flex items-center justify-between"
                    >
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-foreground">{category}</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          {categoryExpenses.length} {categoryExpenses.length === 1 ? "despesa" : "despesas"}
                        </p>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="text-right">
                          <span className="text-2xl font-bold text-foreground">
                            {categoryTotal.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                          </span>
                          <p className="text-sm text-muted-foreground font-medium">
                            {categoryPercentage.toFixed(1)}% do total
                          </p>
                        </div>
                        {isExpanded ? (
                          <ChevronUp className="h-6 w-6 text-muted-foreground flex-shrink-0" />
                        ) : (
                          <ChevronDown className="h-6 w-6 text-muted-foreground flex-shrink-0" />
                        )}
                      </div>
                    </button>

                    <div className="px-6 pb-4 pt-0">
                      <Progress value={categoryPercentage} className="h-3" />
                    </div>

                    {isExpanded && (
                      <div className="border-t-2 border-border px-6 py-4 space-y-3 bg-muted/30">
                        {categoryExpenses.map((expense) => (
                          <div
                            key={expense.id}
                            className="flex items-center justify-between rounded-xl bg-card p-5 border-2 border-border hover:border-accent transition-all hover:shadow-sm"
                          >
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold text-lg text-foreground truncate">{expense.description}</p>
                              <div className="flex items-center gap-3 mt-2">
                                <p className="text-sm text-muted-foreground font-medium">
                                  {format(new Date(expense.date), "dd/MM/yyyy")}
                                </p>
                                {expense.is_split && (
                                  <Badge variant="secondary" className="text-xs font-semibold">
                                    Dividido em {expense.split_parts}x
                                  </Badge>
                                )}
                              </div>
                            </div>
                            <div className="text-right ml-6">
                              <span className="text-xl font-bold text-foreground whitespace-nowrap">
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
