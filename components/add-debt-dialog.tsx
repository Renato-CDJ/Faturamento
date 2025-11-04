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
import { Checkbox } from "@/components/ui/checkbox"
import { Plus, X } from "lucide-react"
import { useState } from "react"
import { useDebts } from "@/lib/hooks/use-debts-firebase"
import { useCategories } from "@/lib/hooks/use-categories-firebase"

interface AddDebtDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

interface Participant {
  id: string
  name: string
  parts: number
}

export function AddDebtDialog({ open, onOpenChange }: AddDebtDialogProps) {
  const { addDebt } = useDebts()
  const { categories, loading: categoriesLoading } = useCategories("debt")
  const [name, setName] = useState("")
  const [total, setTotal] = useState("")
  const [paid, setPaid] = useState("")
  const [dueDate, setDueDate] = useState("")
  const [category, setCategory] = useState("")
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
    const totalAmount = Number.parseFloat(total) || 0
    return participants.map((p) => ({
      ...p,
      amount_owed: (totalAmount * p.parts) / totalParts,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const debtData = {
        name,
        total_amount: Number.parseFloat(total),
        paid_amount: Number.parseFloat(paid) || 0,
        due_date: dueDate || null,
        category,
        is_split: isSplit,
        split_parts: isSplit ? participants.reduce((sum, p) => sum + p.parts, 0) : 1,
        is_paid: false,
      }

      const participantsData =
        isSplit && participants.length > 0 ? participants.map((p) => ({ name: p.name, parts: p.parts })) : undefined

      await addDebt(debtData, participantsData)

      // Reset form
      setName("")
      setTotal("")
      setPaid("")
      setDueDate("")
      setCategory("")
      setIsSplit(false)
      setParticipants([])
      onOpenChange(false)
    } catch (error) {
      console.error("[v0] Error adding debt:", error)
      alert("Erro ao adicionar dívida. Tente novamente.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Nova Dívida</DialogTitle>
          <DialogDescription>Adicione uma nova dívida para acompanhar o pagamento.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="debt-name">Nome da Dívida</Label>
              <Input
                id="debt-name"
                placeholder="Ex: Cartão de Crédito"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="debt-total">Valor Total</Label>
              <Input
                id="debt-total"
                type="number"
                step="0.01"
                placeholder="0,00"
                value={total}
                onChange={(e) => setTotal(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="debt-paid">Valor Pago</Label>
              <Input
                id="debt-paid"
                type="number"
                step="0.01"
                placeholder="0,00"
                value={paid}
                onChange={(e) => setPaid(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="debt-duedate">Data de Vencimento</Label>
              <Input id="debt-duedate" type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="debt-category">Categoria</Label>
              <Select value={category} onValueChange={setCategory} required disabled={categoriesLoading}>
                <SelectTrigger id="debt-category">
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
            <div className="flex items-center space-x-2">
              <Checkbox
                id="split-debt"
                checked={isSplit}
                onCheckedChange={(checked) => setIsSplit(checked as boolean)}
              />
              <Label htmlFor="split-debt" className="text-sm font-normal cursor-pointer">
                Dividir dívida com outras pessoas (até 5x)
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
                {participants.length > 0 && total && (
                  <div className="mt-3 space-y-1 rounded-md bg-muted p-3 text-sm">
                    <p className="font-medium">Divisão:</p>
                    {calculateSplit().map((p) => (
                      <p key={p.id} className="text-muted-foreground">
                        {p.name}: R$ {p.amount_owed.toFixed(2)}
                      </p>
                    ))}
                  </div>
                )}
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
