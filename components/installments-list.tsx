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

export function InstallmentsList() {
  const { isEditorMode } = useViewMode()

  const [installments, setInstallments] = useState([
    {
      id: 1,
      name: "Notebook Dell",
      installment: 3,
      total: 12,
      value: 450,
      dueDate: "05/12/2025",
      paid: false,
    },
    {
      id: 2,
      name: "Curso Online",
      installment: 8,
      total: 10,
      value: 120,
      dueDate: "10/12/2025",
      paid: false,
    },
    {
      id: 3,
      name: "Celular Samsung",
      installment: 6,
      total: 12,
      value: 280,
      dueDate: "15/11/2025",
      paid: true,
    },
    {
      id: 4,
      name: "Academia",
      installment: 11,
      total: 12,
      value: 150,
      dueDate: "20/12/2025",
      paid: false,
    },
  ])
  const [deleteId, setDeleteId] = useState<number | null>(null)

  const handleDelete = () => {
    if (deleteId !== null) {
      setInstallments(installments.filter((item) => item.id !== deleteId))
      setDeleteId(null)
    }
  }

  const handleEdit = (id: number) => {
    console.log("[v0] Edit installment:", id)
  }

  return (
    <>
      <Card className="border-border">
        <CardHeader>
          <CardTitle className="text-foreground">Parcelamentos</CardTitle>
          <CardDescription className="text-muted-foreground">Próximas parcelas a vencer</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {installments.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between rounded-lg border border-border bg-muted/50 p-4"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                    item.paid ? "bg-accent/20 text-accent" : "bg-primary/20 text-primary"
                  }`}
                >
                  {item.paid ? <CheckCircle2 className="h-5 w-5" /> : <Clock className="h-5 w-5" />}
                </div>
                <div className="space-y-1">
                  <p className="font-semibold text-foreground">{item.name}</p>
                  <p className="text-sm text-muted-foreground">
                    Parcela {item.installment}/{item.total} • Vence em {item.dueDate}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-lg font-bold text-foreground">R$ {item.value.toFixed(2)}</p>
                  <Badge variant={item.paid ? "default" : "secondary"} className="mt-1">
                    {item.paid ? "Pago" : "Pendente"}
                  </Badge>
                </div>
                {isEditorMode && (
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEdit(item.id)}>
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
          ))}
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
    </>
  )
}
