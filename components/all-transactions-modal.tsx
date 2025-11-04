"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { ArrowUpRight, ArrowDownRight, Pencil, Trash2 } from "lucide-react"
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
import type { Expense, Income } from "@/lib/types"
import { format } from "date-fns"

type Transaction = {
  id: string
  name: string
  category: string
  amount: number
  date: string
  type: "income" | "expense"
  originalData: Expense | Income
}

interface AllTransactionsModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AllTransactionsModal({ open, onOpenChange }: AllTransactionsModalProps) {
  const { isEditorMode } = useViewMode()
  const { expenses, deleteExpense } = useExpenses()
  const { incomes, deleteIncome } = useIncome()

  const [deleteId, setDeleteId] = useState<{ id: string; type: "income" | "expense" } | null>(null)
  const [editExpense, setEditExpense] = useState<Expense | null>(null)
  const [editIncome, setEditIncome] = useState<Income | null>(null)
  const [editExpenseDialogOpen, setEditExpenseDialogOpen] = useState(false)
  const [editIncomeDialogOpen, setEditIncomeDialogOpen] = useState(false)

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

    return combined
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

  const totalIncome = transactions.filter((t) => t.type === "income").reduce((sum, t) => sum + t.amount, 0)
  const totalExpenses = Math.abs(transactions.filter((t) => t.type === "expense").reduce((sum, t) => sum + t.amount, 0))
  const balance = totalIncome - totalExpenses

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-5xl max-h-[90vh] flex flex-col overflow-hidden">
          <DialogHeader className="pb-6">
            <DialogTitle className="text-3xl font-bold">Todas as Transações</DialogTitle>
            <DialogDescription className="text-base">
              Visualize todo o histórico de receitas e despesas
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-3 gap-3 mb-4 shrink-0">
            <div className="rounded-xl bg-gradient-to-br from-accent/15 to-accent/5 border-2 border-accent/30 p-4">
              <p className="text-xs font-semibold text-muted-foreground mb-1 uppercase tracking-wide">Receitas</p>
              <p className="text-xl font-bold text-accent">
                {totalIncome.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
              </p>
            </div>
            <div className="rounded-xl bg-gradient-to-br from-destructive/15 to-destructive/5 border-2 border-destructive/30 p-4">
              <p className="text-xs font-semibold text-muted-foreground mb-1 uppercase tracking-wide">Despesas</p>
              <p className="text-xl font-bold text-destructive">
                {totalExpenses.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
              </p>
            </div>
            <div className="rounded-xl bg-gradient-to-br from-primary/15 to-primary/5 border-2 border-primary/30 p-4">
              <p className="text-xs font-semibold text-muted-foreground mb-1 uppercase tracking-wide">Saldo</p>
              <p className={`text-xl font-bold ${balance >= 0 ? "text-accent" : "text-destructive"}`}>
                {balance.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
              </p>
            </div>
          </div>

          <ScrollArea className="flex-1 -mr-4">
            {transactions.length === 0 ? (
              <div className="flex h-64 items-center justify-center text-muted-foreground">
                <div className="text-center">
                  <p className="text-xl font-medium">Nenhuma transação registrada</p>
                  <p className="text-sm mt-2">Adicione receitas ou despesas para começar</p>
                </div>
              </div>
            ) : (
              <div className="space-y-3 pb-4 pr-4">
                {transactions.map((transaction) => {
                  const isIncome = transaction.amount > 0
                  const Icon = isIncome ? ArrowUpRight : ArrowDownRight
                  return (
                    <div
                      key={`${transaction.type}-${transaction.id}`}
                      className="flex items-center gap-4 rounded-xl border-2 border-border bg-card p-4 transition-all hover:bg-muted/50 hover:border-accent hover:shadow-sm overflow-hidden"
                    >
                      <div
                        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${
                          isIncome ? "bg-accent/20 text-accent" : "bg-destructive/20 text-destructive"
                        }`}
                      >
                        <Icon className="h-6 w-6" />
                      </div>
                      <div className="flex-1 min-w-0 space-y-1">
                        <p className="font-bold text-base text-foreground truncate">{transaction.name}</p>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground flex-wrap">
                          <Badge variant="outline" className="font-medium text-xs">
                            {transaction.category}
                          </Badge>
                          <span className="hidden sm:inline">•</span>
                          <span className="font-medium text-xs">
                            {format(new Date(transaction.date), "dd/MM/yyyy")}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        <p className={`text-lg font-bold ${isIncome ? "text-accent" : "text-destructive"}`}>
                          {isIncome ? "+" : "-"}
                          {Math.abs(transaction.amount).toLocaleString("pt-BR", {
                            style: "currency",
                            currency: "BRL",
                          })}
                        </p>
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
          </ScrollArea>
        </DialogContent>
      </Dialog>

      <EditExpenseDialog open={editExpenseDialogOpen} onOpenChange={setEditExpenseDialogOpen} expense={editExpense} />

      <EditIncomeDialog open={editIncomeDialogOpen} onOpenChange={setEditIncomeDialogOpen} income={editIncome} />

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
