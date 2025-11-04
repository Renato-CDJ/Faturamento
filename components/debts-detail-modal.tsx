"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import type { Debt } from "@/lib/types"
import { format } from "date-fns"

interface DebtsDetailModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  debts: Debt[]
}

export function DebtsDetailModal({ open, onOpenChange, debts }: DebtsDetailModalProps) {
  const totalDebt = debts.reduce((sum, debt) => sum + debt.total_amount, 0)
  const totalPaid = debts.reduce((sum, debt) => sum + debt.paid_amount, 0)
  const totalRemaining = totalDebt - totalPaid
  const activeDebts = debts.filter((d) => !d.is_paid)
  const paidDebts = debts.filter((d) => d.is_paid)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Dívidas Totais</DialogTitle>
          <DialogDescription>
            Visualize todas as suas dívidas ativas e pagas com detalhes de progresso.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-lg bg-muted p-4">
              <p className="text-sm text-muted-foreground">Total</p>
              <p className="text-xl font-bold">
                {totalDebt.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
              </p>
            </div>
            <div className="rounded-lg bg-muted p-4">
              <p className="text-sm text-muted-foreground">Pago</p>
              <p className="text-xl font-bold text-accent">
                {totalPaid.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
              </p>
            </div>
            <div className="rounded-lg bg-muted p-4">
              <p className="text-sm text-muted-foreground">Restante</p>
              <p className="text-xl font-bold text-destructive">
                {totalRemaining.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
              </p>
            </div>
          </div>

          <ScrollArea className="h-[400px] pr-4">
            {debts.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p>Nenhuma dívida registrada</p>
              </div>
            ) : (
              <div className="space-y-6">
                {activeDebts.length > 0 && (
                  <div className="space-y-3">
                    <h3 className="font-semibold text-sm text-muted-foreground">Dívidas Ativas</h3>
                    <div className="space-y-2">
                      {activeDebts.map((debt) => {
                        const progress = (debt.paid_amount / debt.total_amount) * 100
                        return (
                          <div key={debt.id} className="rounded-lg border bg-card p-4 space-y-3">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <p className="font-medium">{debt.name}</p>
                                <p className="text-sm text-muted-foreground">{debt.category}</p>
                                {debt.due_date && (
                                  <p className="text-xs text-muted-foreground mt-1">
                                    Vencimento: {format(new Date(debt.due_date), "dd/MM/yyyy")}
                                  </p>
                                )}
                              </div>
                              <div className="text-right">
                                <p className="font-semibold">
                                  {debt.total_amount.toLocaleString("pt-BR", {
                                    style: "currency",
                                    currency: "BRL",
                                  })}
                                </p>
                                {debt.is_split && (
                                  <Badge variant="secondary" className="text-xs mt-1">
                                    Dividido
                                  </Badge>
                                )}
                              </div>
                            </div>
                            <div className="space-y-1">
                              <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Progresso</span>
                                <span className="font-medium">{progress.toFixed(0)}%</span>
                              </div>
                              <Progress value={progress} className="h-2" />
                              <p className="text-xs text-muted-foreground">
                                Pago: {debt.paid_amount.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}{" "}
                                de {debt.total_amount.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                              </p>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}

                {paidDebts.length > 0 && (
                  <div className="space-y-3">
                    <h3 className="font-semibold text-sm text-muted-foreground">Dívidas Pagas</h3>
                    <div className="space-y-2">
                      {paidDebts.map((debt) => (
                        <div key={debt.id} className="rounded-lg border bg-muted/50 p-4 opacity-60">
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <p className="font-medium">{debt.name}</p>
                              <p className="text-sm text-muted-foreground">{debt.category}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold line-through">
                                {debt.total_amount.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                              </p>
                              <Badge variant="default" className="text-xs mt-1">
                                Pago
                              </Badge>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  )
}
