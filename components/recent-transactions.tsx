"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowUpRight, ArrowDownRight, Pencil, Trash2, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState, useMemo } from "react"
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
import { useExpenses } from "@/lib/hooks/use-expenses-firebase"
import { useIncome } from "@/lib/hooks/use-income-firebase"
import { EditExpenseDialog } from "@/components/edit-expense-dialog"
import { EditIncomeDialog } from "@/components/edit-income-dialog"
import { AllTransactionsModal } from "@/components/all-transactions-modal"
import type { Expense, Income } from "@/lib/types"

type Transaction = {
  id: string
  name: string
  category: string
  amount: number
  date: string
  type: "income" | "expense"
  originalData: Expense | Income
}

export function RecentTransactions() {
  const { isEditorMode } = useViewMode()
  const { expenses, deleteExpense } = useExpenses()
  const { incomes, deleteIncome } = useIncome()

  const [deleteId, setDeleteId] = useState<{ id: string; type: "income" | "expense" } | null>(null)
  const [editExpense, setEditExpense] = useState<Expense | null>(null)
  const [editIncome, setEditIncome] = useState<Income | null>(null)
  const [editExpenseDialogOpen, setEditExpenseDialogOpen] = useState(false)
  const [editIncomeDialogOpen, setEditIncomeDialogOpen] = useState(false)
  const [allTransactionsOpen, setAllTransactionsOpen] = useState(false)

  const transactions = useMemo(() => {
    const combined: Transaction[] = [
      ...expenses.map((expense) => ({
        id: expense.id,
        name: expense.description,
        category: expense.category,
        amount: -expense.amount,
        date: expense.date,
        type: "expense" as const,
        originalData: expense,
      })),
      ...incomes.map((income) => ({
        id: income.id,
        name: income.source,
        category: "Receita",
        amount: income.amount,
        date: income.date,
        type: "income" as const,
        originalData: income,
      })),
    ]

    // Sort by date, most recent first
    combined.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

    // Return only the 10 most recent
    return combined.slice(0, 10)
  }, [expenses, incomes])

  const handleDelete = async () => {
    if (deleteId) {
      if (deleteId.type === "expense") {
        await deleteExpense(deleteId.id)
      } else {
        await deleteIncome(deleteId.id)
      }
      setDeleteId(null)
    }
  }

  const handleEdit = (transaction: Transaction) => {
    if (transaction.type === "expense") {
      setEditExpense(transaction.originalData as Expense)
      setEditExpenseDialogOpen(true)
    } else {
      setEditIncome(transaction.originalData as Income)
      setEditIncomeDialogOpen(true)
    }
  }

  return (
    <>
      <Card className="border-border">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-foreground">Transações Recentes</CardTitle>
              <CardDescription className="text-muted-foreground">
                Suas últimas movimentações financeiras
              </CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={() => setAllTransactionsOpen(true)} className="gap-2">
              Ver Todas
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {transactions.length === 0 ? (
            <div className="flex h-32 items-center justify-center text-muted-foreground">
              Nenhuma transação registrada
            </div>
          ) : (
            <div className="space-y-3">
              {transactions.map((transaction) => {
                const isIncome = transaction.amount > 0
                const Icon = isIncome ? ArrowUpRight : ArrowDownRight
                return (
                  <div
                    key={`${transaction.type}-${transaction.id}`}
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
                          <span>{new Date(transaction.date).toLocaleDateString("pt-BR")}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        <p className={`text-lg font-bold ${isIncome ? "text-accent" : "text-foreground"}`}>
                          {isIncome ? "+" : ""}
                          {Math.abs(transaction.amount).toLocaleString("pt-BR", {
                            style: "currency",
                            currency: "BRL",
                          })}
                        </p>
                      </div>
                      {isEditorMode && (
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handleEdit(transaction)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive"
                            onClick={() => setDeleteId({ id: transaction.id, type: transaction.type })}
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

      <EditExpenseDialog open={editExpenseDialogOpen} onOpenChange={setEditExpenseDialogOpen} expense={editExpense} />

      <EditIncomeDialog open={editIncomeDialogOpen} onOpenChange={setEditIncomeDialogOpen} income={editIncome} />

      <AllTransactionsModal open={allTransactionsOpen} onOpenChange={setAllTransactionsOpen} />

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
