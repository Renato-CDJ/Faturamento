"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import type { Income } from "@/lib/types"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

interface IncomeDetailModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  incomes: Income[]
  month: string
}

export function IncomeDetailModal({ open, onOpenChange, incomes, month }: IncomeDetailModalProps) {
  const monthIncomes = incomes.filter((income) => {
    const incomeMonth = income.date.substring(0, 7)
    return incomeMonth === month
  })

  const total = monthIncomes.reduce((sum, income) => sum + income.amount, 0)
  const recurringTotal = monthIncomes.filter((i) => i.is_recurring).reduce((sum, i) => sum + i.amount, 0)
  const oneTimeTotal = monthIncomes.filter((i) => !i.is_recurring).reduce((sum, i) => sum + i.amount, 0)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Receitas do Mês</DialogTitle>
          <p className="text-sm text-muted-foreground">
            {format(new Date(month + "-01"), "MMMM 'de' yyyy", { locale: ptBR })}
          </p>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-lg bg-muted p-4">
              <p className="text-sm text-muted-foreground">Total</p>
              <p className="text-xl font-bold">
                {total.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
              </p>
            </div>
            <div className="rounded-lg bg-muted p-4">
              <p className="text-sm text-muted-foreground">Recorrente</p>
              <p className="text-xl font-bold">
                {recurringTotal.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
              </p>
            </div>
            <div className="rounded-lg bg-muted p-4">
              <p className="text-sm text-muted-foreground">Única</p>
              <p className="text-xl font-bold">
                {oneTimeTotal.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
              </p>
            </div>
          </div>

          <ScrollArea className="h-[400px] pr-4">
            {monthIncomes.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p>Nenhuma receita registrada neste mês</p>
              </div>
            ) : (
              <div className="space-y-2">
                {monthIncomes.map((income) => (
                  <div key={income.id} className="flex items-center justify-between rounded-lg border bg-card p-4">
                    <div className="flex-1">
                      <p className="font-medium">{income.source}</p>
                      <p className="text-sm text-muted-foreground">{format(new Date(income.date), "dd/MM/yyyy")}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      {income.is_recurring && (
                        <Badge variant="secondary" className="text-xs">
                          Recorrente
                        </Badge>
                      )}
                      <span className="text-lg font-semibold text-accent">
                        {income.amount.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  )
}
