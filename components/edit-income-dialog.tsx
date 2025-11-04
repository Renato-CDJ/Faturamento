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
import { Checkbox } from "@/components/ui/checkbox"
import { useState, useEffect } from "react"
import { useIncome } from "@/lib/hooks/use-income-firebase"
import type { Income } from "@/lib/types"

interface EditIncomeDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  income: Income | null
}

export function EditIncomeDialog({ open, onOpenChange, income }: EditIncomeDialogProps) {
  const { updateIncome } = useIncome()
  const [source, setSource] = useState("")
  const [amount, setAmount] = useState("")
  const [date, setDate] = useState("")
  const [isRecurring, setIsRecurring] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (income) {
      setSource(income.source)
      setAmount(income.amount.toString())
      setDate(income.date)
      setIsRecurring(income.is_recurring)
    }
  }, [income])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!income) return

    setIsSubmitting(true)

    try {
      await updateIncome(income.id, {
        source,
        amount: Number.parseFloat(amount),
        date,
        is_recurring: isRecurring,
      })

      onOpenChange(false)
    } catch (error) {
      console.error("[v0] Error updating income:", error)
      alert("Erro ao atualizar receita. Tente novamente.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Editar Receita</DialogTitle>
          <DialogDescription>Atualize as informações da receita.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-income-source">Fonte</Label>
              <Input
                id="edit-income-source"
                placeholder="Ex: Salário - Empresa XYZ"
                value={source}
                onChange={(e) => setSource(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-income-amount">Valor</Label>
              <Input
                id="edit-income-amount"
                type="number"
                step="0.01"
                placeholder="0,00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-income-date">Data</Label>
              <Input
                id="edit-income-date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="edit-recurring-income"
                checked={isRecurring}
                onCheckedChange={(checked) => setIsRecurring(checked as boolean)}
              />
              <Label htmlFor="edit-recurring-income" className="text-sm font-normal cursor-pointer">
                Receita recorrente (mensal)
              </Label>
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
