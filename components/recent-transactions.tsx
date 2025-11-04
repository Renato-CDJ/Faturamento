"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowUpRight, ArrowDownRight, Pencil, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useViewMode } from "@/lib/view-mode-context"

export function RecentTransactions() {
  const { isEditorMode } = useViewMode()

  const [transactions, setTransactions] = useState([])
  const [deleteId, setDeleteId] = useState<number | null>(null)

  const handleDelete = () => {
    if (deleteId !== null) {
      setTransactions(transactions.filter((transaction) => transaction.id !== deleteId))
      setDeleteId(null)
    }
  }

  const handleEdit = (id: number) => {
    console.log("[v0] Edit transaction:", id)
  }

  return (
    <>
      <Card className="border-border">
        <CardHeader>
          <CardTitle className="text-foreground">Transações Recentes</CardTitle>
          <CardDescription className="text-muted-foreground">Suas últimas movimentações financeiras</CardDescription>
        </CardHeader>
        <CardContent>
          {transactions.length === 0 ? (
            <div className="flex h-32 items-center justify-center text-muted-foreground">
              Nenhuma transação registrada
            </div>
          ) : (
            <div className="space-y-3">
              {transactions.map((transaction) => {
                const Icon = transaction.icon
                const isIncome = transaction.amount > 0
                return (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between rounded-lg border border-border p-4 transition-colors hover:bg-muted/50"
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`flex h-12 w-12 items-center justify-center rounded-lg ${
                          isIncome ? "bg-accent/20 text-accent" : "bg-muted text-muted-foreground"
                        }`}
                      >
                        <Icon className="h-6 w-6" />
                      </div>
                      <div className="space-y-1">
                        <p className="font-semibold text-foreground">{transaction.name}</p>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span>{transaction.category}</span>
                          <span>•</span>
                          <span>{transaction.date}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        <p className={`text-lg font-bold ${isIncome ? "text-accent" : "text-foreground"}`}>
                          {isIncome ? "+" : ""}R$ {Math.abs(transaction.amount).toFixed(2)}
                        </p>
                        {isIncome ? (
                          <ArrowUpRight className="h-5 w-5 text-accent" />
                        ) : (
                          <ArrowDownRight className="h-5 w-5 text-muted-foreground" />
                        )}
                      </div>
                      {isEditorMode && (
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handleEdit(transaction.id)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive"
                            onClick={() => setDeleteId(transaction.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={deleteId !== null} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir esta transação? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
