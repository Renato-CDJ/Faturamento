"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Pencil, Trash2 } from "lucide-react"
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
import { useDebts } from "@/lib/hooks/use-debts-firebase"
import { EditDebtDialog } from "@/components/edit-debt-dialog"
import type { Debt } from "@/lib/types"

export function DebtsList() {
  const { isEditorMode } = useViewMode()
  const { debts, loading, deleteDebt } = useDebts()
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [editDebt, setEditDebt] = useState<Debt | null>(null)
  const [editDialogOpen, setEditDialogOpen] = useState(false)

  const handleDelete = async () => {
    if (deleteId !== null) {
      await deleteDebt(deleteId)
      setDeleteId(null)
    }
  }

  const handleEdit = (debt: Debt) => {
    console.log("[v0] Edit debt:", debt.id)
    setEditDebt(debt)
    setEditDialogOpen(true)
  }

  if (loading) {
    return (
      <Card className="border-border">
        <CardHeader>
          <CardTitle className="text-foreground">Dívidas Ativas</CardTitle>
          <CardDescription className="text-muted-foreground">Carregando...</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <>
      <Card className="border-border">
        <CardHeader>
          <CardTitle className="text-foreground">Dívidas Ativas</CardTitle>
          <CardDescription className="text-muted-foreground">Acompanhe o progresso de pagamento</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {debts.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">Nenhuma dívida cadastrada</p>
          ) : (
            debts.map((debt) => {
              const progress = (debt.paid_amount / debt.total_amount) * 100
              const isOverdue = debt.due_date && new Date(debt.due_date) < new Date()
              const status = isOverdue ? "atrasado" : "em dia"

              return (
                <div key={debt.id} className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1 flex-1">
                      <p className="font-semibold text-foreground">{debt.name}</p>
                      {debt.due_date && (
                        <p className="text-sm text-muted-foreground">
                          Vencimento: {new Date(debt.due_date).toLocaleDateString("pt-BR")}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={status === "em dia" ? "default" : "destructive"} className="shrink-0">
                        {status}
                      </Badge>
                      {isEditorMode && (
                        <>
                          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEdit(debt)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive"
                            onClick={() => setDeleteId(debt.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        R$ {debt.paid_amount.toLocaleString("pt-BR", { minimumFractionDigits: 2 })} de R${" "}
                        {debt.total_amount.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                      </span>
                      <span className="font-medium text-foreground">{progress.toFixed(0)}%</span>
                    </div>
                    <Progress value={progress} className="h-2" />
                  </div>
                </div>
              )
            })
          )}
        </CardContent>
      </Card>

      <EditDebtDialog open={editDialogOpen} onOpenChange={setEditDialogOpen} debt={editDebt} />

      <AlertDialog open={deleteId !== null} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir esta dívida? Esta ação não pode ser desfeita.
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
