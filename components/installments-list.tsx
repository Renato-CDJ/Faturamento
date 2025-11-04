"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, Clock, Pencil, Trash2 } from "lucide-react"
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
import { useInstallments } from "@/lib/hooks/use-installments-firebase"
import { EditInstallmentDialog } from "@/components/edit-installment-dialog"
import type { Installment } from "@/lib/types"

export function InstallmentsList() {
  const { isEditorMode } = useViewMode()
  const { installments, loading, deleteInstallment, updateInstallment } = useInstallments()
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [editingInstallment, setEditingInstallment] = useState<Installment | null>(null)
  const [editDialogOpen, setEditDialogOpen] = useState(false)

  const handleDelete = async () => {
    if (deleteId !== null) {
      await deleteInstallment(deleteId)
      setDeleteId(null)
    }
  }

  const handleEdit = (installment: Installment) => {
    setEditingInstallment(installment)
    setEditDialogOpen(true)
  }

  const handleTogglePaid = async (id: string, currentPaid: boolean) => {
    try {
      await updateInstallment(id, { paid: !currentPaid })
    } catch (error) {
      console.error("[v0] Error toggling paid status:", error)
    }
  }

  if (loading) {
    return (
      <Card className="border-border">
        <CardHeader>
          <CardTitle className="text-foreground">Parcelamentos</CardTitle>
          <CardDescription className="text-muted-foreground">Carregando...</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <>
      <Card className="border-border">
        <CardHeader>
          <CardTitle className="text-foreground">Parcelamentos</CardTitle>
          <CardDescription className="text-muted-foreground">Próximas parcelas a vencer</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {installments.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">Nenhum parcelamento cadastrado</p>
          ) : (
            installments.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between rounded-lg border border-border bg-muted/50 p-4"
              >
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => handleTogglePaid(item.id, item.paid)}
                    className={`flex h-10 w-10 items-center justify-center rounded-lg transition-colors ${
                      item.paid
                        ? "bg-accent/20 text-accent hover:bg-accent/30"
                        : "bg-primary/20 text-primary hover:bg-primary/30"
                    }`}
                  >
                    {item.paid ? <CheckCircle2 className="h-5 w-5" /> : <Clock className="h-5 w-5" />}
                  </button>
                  <div className="space-y-1">
                    <p className="font-semibold text-foreground">{item.name}</p>
                    <p className="text-sm text-muted-foreground">
                      Parcela {item.current_installment}/{item.total_installments} • Vence em{" "}
                      {new Date(item.due_date).toLocaleDateString("pt-BR")}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-lg font-bold text-foreground">
                      R$ {item.installment_value.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                    </p>
                    <Badge variant={item.paid ? "default" : "secondary"} className="mt-1">
                      {item.paid ? "Pago" : "Pendente"}
                    </Badge>
                  </div>
                  {isEditorMode && (
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEdit(item)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive"
                        onClick={() => setDeleteId(item.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      <AlertDialog open={deleteId !== null} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este parcelamento? Esta ação não pode ser desfeita.
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

      <EditInstallmentDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        installment={editingInstallment}
        onInstallmentUpdated={() => {
          setEditingInstallment(null)
          setEditDialogOpen(false)
        }}
      />
    </>
  )
}
