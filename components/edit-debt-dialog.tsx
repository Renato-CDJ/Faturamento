"use client"

import type React from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState, useEffect } from "react"
import { useDebts } from "@/lib/hooks/use-debts-firebase"
import type { Debt } from "@/lib/types"

interface EditDebtDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  debt: Debt | null
}

export function EditDebtDialog({ open, onOpenChange, debt }: EditDebtDialogProps) {
  const { updateDebt } = useDebts()
  const [name, setName] = useState("")
  const [total, setTotal] = useState("")
  const [paid, setPaid] = useState("")
  const [dueDate, setDueDate] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (debt) {
      setName(debt.name)
      setTotal(debt.total_amount.toString())
      setPaid(debt.paid_amount.toString())
      setDueDate(debt.due_date || "")
    }
  }, [debt])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!debt) return

    setIsSubmitting(true)

    try {
      await updateDebt(debt.id, {
        name,
        total_amount: Number.parseFloat(total),
        paid_amount: Number.parseFloat(paid) || 0,
        due_date: dueDate || null,
      })

      onOpenChange(false)
    } catch (error) {
      console.error("[v0] Error updating debt:", error)
      alert("Erro ao atualizar dívida. Tente novamente.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Editar Dívida</DialogTitle>
          <DialogDescription>Atualize as informações da dívida.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-debt-name">Nome da Dívida</Label>
              <Input
                id="edit-debt-name"
                placeholder="Ex: Cartão de Crédito"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-debt-total">Valor Total</Label>
              <Input
                id="edit-debt-total"
                type="number"
                step="0.01"
                placeholder="0,00"
                value={total}
                onChange={(e) => setTotal(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-debt-paid">Valor Pago</Label>
              <Input
                id="edit-debt-paid"
                type="number"
                step="0.01"
                placeholder="0,00"
                value={paid}
                onChange={(e) => setPaid(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-debt-duedate">Data de Vencimento</Label>
              <Input id="edit-debt-duedate" type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Salvando..." : "Salvar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
