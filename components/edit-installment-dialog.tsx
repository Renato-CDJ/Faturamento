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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState, useEffect } from "react"
import { useInstallments } from "@/lib/hooks/use-installments-firebase"
import { useCategories } from "@/lib/hooks/use-categories-firebase"
import type { Installment } from "@/lib/types"

interface EditInstallmentDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  installment: Installment | null
  onInstallmentUpdated?: () => void
}

export function EditInstallmentDialog({
  open,
  onOpenChange,
  installment,
  onInstallmentUpdated,
}: EditInstallmentDialogProps) {
  const { updateInstallment } = useInstallments()
  const { categories, loading: categoriesLoading } = useCategories("installment")
  const [name, setName] = useState("")
  const [installmentCount, setInstallmentCount] = useState("")
  const [installmentValue, setInstallmentValue] = useState("")
  const [dueDate, setDueDate] = useState("")
  const [category, setCategory] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (installment && open) {
      setName(installment.name)
      setInstallmentCount(String(installment.total_installments))
      setInstallmentValue(String(installment.installment_value))
      setDueDate(installment.due_date.split("T")[0])
      setCategory(installment.category)
    }
  }, [installment, open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!installment) return

    setIsSubmitting(true)
    try {
      const count = Number.parseInt(installmentCount)
      const value = Number.parseFloat(installmentValue)
      const totalAmount = count * value

      await updateInstallment(installment.id, {
        name,
        total_amount: totalAmount,
        total_installments: count,
        installment_value: value,
        due_date: dueDate,
        category: category || "Outros",
      })

      onOpenChange(false)
      onInstallmentUpdated?.()
    } catch (error) {
      console.error("[v0] Error updating installment:", error)
      alert("Erro ao atualizar parcelamento. Tente novamente.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Editar Parcelamento</DialogTitle>
          <DialogDescription>Atualize os detalhes do parcelamento.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-installment-name">Nome do Parcelamento</Label>
              <Input
                id="edit-installment-name"
                placeholder="Ex: Notebook Dell"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-installment-count">Número de Parcelas</Label>
                <Input
                  id="edit-installment-count"
                  type="number"
                  min="1"
                  placeholder="12"
                  value={installmentCount}
                  onChange={(e) => setInstallmentCount(e.target.value)}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-installment-value">Valor da Parcela</Label>
                <Input
                  id="edit-installment-value"
                  type="number"
                  step="0.01"
                  placeholder="0,00"
                  value={installmentValue}
                  onChange={(e) => setInstallmentValue(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-duedate">Data de Vencimento</Label>
              <Input
                id="edit-duedate"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-installment-category">Categoria</Label>
              <Select value={category} onValueChange={setCategory} required disabled={categoriesLoading}>
                <SelectTrigger id="edit-installment-category">
                  <SelectValue placeholder={categoriesLoading ? "Carregando..." : "Selecione uma categoria"} />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.name}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {installmentCount && installmentValue && (
              <div className="rounded-md bg-muted p-3 text-sm">
                <p className="font-medium">
                  Total: R$ {(Number.parseInt(installmentCount) * Number.parseFloat(installmentValue)).toFixed(2)}
                </p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Atualizando..." : "Atualizar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
