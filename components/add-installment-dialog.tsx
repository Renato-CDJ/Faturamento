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
import { Plus, X } from "lucide-react"
import { useState } from "react"
import { createClient } from "@/lib/supabase/client"

interface AddInstallmentDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onInstallmentAdded?: () => void
}

interface Participant {
  id: string
  name: string
  parts: number
}

export function AddInstallmentDialog({ open, onOpenChange, onInstallmentAdded }: AddInstallmentDialogProps) {
  const [name, setName] = useState("")
  const [installmentCount, setInstallmentCount] = useState("")
  const [installmentValue, setInstallmentValue] = useState("")
  const [firstDueDate, setFirstDueDate] = useState("")
  const [isSplit, setIsSplit] = useState(false)
  const [participants, setParticipants] = useState<Participant[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  const addParticipant = () => {
    if (participants.length < 5) {
      setParticipants([...participants, { id: crypto.randomUUID(), name: "", parts: 1 }])
    }
  }

  const removeParticipant = (id: string) => {
    setParticipants(participants.filter((p) => p.id !== id))
  }

  const updateParticipant = (id: string, field: "name" | "parts", value: string | number) => {
    setParticipants(participants.map((p) => (p.id === id ? { ...p, [field]: value } : p)))
  }

  const calculateSplit = () => {
    const totalParts = participants.reduce((sum, p) => sum + p.parts, 0)
    const valuePerInstallment = Number.parseFloat(installmentValue) || 0
    return participants.map((p) => ({
      ...p,
      amount_owed: (valuePerInstallment * p.parts) / totalParts,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const supabase = createClient()
      const count = Number.parseInt(installmentCount)
      const value = Number.parseFloat(installmentValue)
      const totalAmount = count * value

      const { data: installmentData, error: installmentError } = await supabase
        .from("installments")
        .insert({
          name,
          total_amount: totalAmount,
          installment_count: count,
          paid_installments: 0,
          installment_value: value,
          is_split: isSplit,
          split_parts: isSplit ? participants.length : 1,
        })
        .select()
        .single()

      if (installmentError) throw installmentError

      const payments = []
      const baseDate = new Date(firstDueDate)
      for (let i = 0; i < count; i++) {
        const dueDate = new Date(baseDate)
        dueDate.setMonth(dueDate.getMonth() + i)
        payments.push({
          installment_id: installmentData.id,
          payment_number: i + 1,
          due_date: dueDate.toISOString().split("T")[0],
          is_paid: false,
        })
      }

      const { error: paymentsError } = await supabase.from("installment_payments").insert(payments)

      if (paymentsError) throw paymentsError

      if (isSplit && participants.length > 0) {
        const splitData = calculateSplit()
        const { error: participantsError } = await supabase.from("installment_participants").insert(
          splitData.map((p) => ({
            installment_id: installmentData.id,
            name: p.name,
            parts: p.parts,
            amount_owed: p.amount_owed,
          })),
        )

        if (participantsError) throw participantsError
      }

      await supabase.from("transactions").insert({
        description: `Parcelamento: ${name}`,
        amount: totalAmount,
        type: "installment",
        date: firstDueDate,
      })

      // Reset form
      setName("")
      setInstallmentCount("")
      setInstallmentValue("")
      setFirstDueDate("")
      setIsSplit(false)
      setParticipants([])
      onOpenChange(false)
      onInstallmentAdded?.()
    } catch (error) {
      console.error("[v0] Error adding installment:", error)
      alert("Erro ao adicionar parcelamento. Tente novamente.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Novo Parcelamento</DialogTitle>
          <DialogDescription>Adicione um novo parcelamento para acompanhar.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="installment-name">Nome do Parcelamento</Label>
              <Input
                id="installment-name"
                placeholder="Ex: Notebook Dell"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="installment-count">Número de Parcelas</Label>
                <Input
                  id="installment-count"
                  type="number"
                  min="1"
                  placeholder="12"
                  value={installmentCount}
                  onChange={(e) => setInstallmentCount(e.target.value)}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="installment-value">Valor da Parcela</Label>
                <Input
                  id="installment-value"
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
              <Label htmlFor="first-duedate">Primeira Data de Vencimento</Label>
              <Input
                id="first-duedate"
                type="date"
                value={firstDueDate}
                onChange={(e) => setFirstDueDate(e.target.value)}
                required
              />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="split-installment"
                checked={isSplit}
                onCheckedChange={(checked) => setIsSplit(checked as boolean)}
              />
              <Label htmlFor="split-installment" className="text-sm font-normal cursor-pointer">
                Dividir parcelamento com outras pessoas
              </Label>
            </div>

            {isSplit && (
              <div className="space-y-3 rounded-lg border border-border p-4">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium">Participantes (máx. 5)</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addParticipant}
                    disabled={participants.length >= 5}
                    className="h-8"
                  >
                    <Plus className="h-3 w-3 mr-1" />
                    Adicionar
                  </Button>
                </div>

                {participants.map((participant) => (
                  <div key={participant.id} className="flex gap-2">
                    <Input
                      placeholder="Nome"
                      value={participant.name}
                      onChange={(e) => updateParticipant(participant.id, "name", e.target.value)}
                      required
                      className="flex-1"
                    />
                    <Input
                      type="number"
                      min="1"
                      max="5"
                      placeholder="Partes"
                      value={participant.parts}
                      onChange={(e) => updateParticipant(participant.id, "parts", Number.parseInt(e.target.value) || 1)}
                      required
                      className="w-24"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeParticipant(participant.id)}
                      className="h-10 w-10"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}

                {participants.length > 0 && installmentValue && (
                  <div className="mt-3 space-y-1 rounded-md bg-muted p-3 text-sm">
                    <p className="font-medium">Divisão por parcela:</p>
                    {calculateSplit().map((p) => (
                      <p key={p.id} className="text-muted-foreground">
                        {p.name}: R$ {p.amount_owed.toFixed(2)}
                      </p>
                    ))}
                  </div>
                )}
              </div>
            )}

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
              {isSubmitting ? "Adicionando..." : "Adicionar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
