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
import { useState } from "react"
import { X, Plus } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { useExpenses } from "@/lib/hooks/use-expenses-firebase"
import { useCategories } from "@/lib/hooks/use-categories-firebase"

interface AddExpenseDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

interface Person {
  id: string
  name: string
  share: number
}

export function AddExpenseDialog({ open, onOpenChange }: AddExpenseDialogProps) {
  const { addExpense } = useExpenses()
  const { categories, loading: categoriesLoading } = useCategories("expense")
  const [description, setDescription] = useState("")
  const [amount, setAmount] = useState("")
  const [category, setCategory] = useState("")
  const [isSplit, setIsSplit] = useState(false)
  const [people, setPeople] = useState<Person[]>([{ id: "1", name: "", share: 1 }])
  const [isSubmitting, setIsSubmitting] = useState(false)

  const addPerson = () => {
    if (people.length < 5) {
      setPeople([...people, { id: Date.now().toString(), name: "", share: 1 }])
    }
  }

  const removePerson = (id: string) => {
    if (people.length > 1) {
      setPeople(people.filter((p) => p.id !== id))
    }
  }

  const updatePerson = (id: string, field: "name" | "share", value: string | number) => {
    setPeople(people.map((p) => (p.id === id ? { ...p, [field]: value } : p)))
  }

  const totalShares = people.reduce((sum, p) => sum + p.share, 0)
  const amountPerShare = amount ? Number.parseFloat(amount) / totalShares : 0

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      console.log("[v0] Adding expense:", {
        description,
        amount,
        category,
        isSplit,
        people: isSplit ? people : undefined,
        totalShares: isSplit ? totalShares : undefined,
      })

      const expenseData = {
        description,
        amount: Number.parseFloat(amount),
        category,
        date: new Date().toISOString().split("T")[0],
        is_split: isSplit,
        split_parts: isSplit ? totalShares : 1,
      }

      const participantsData = isSplit
        ? people.map((p) => ({
            name: p.name,
            parts: p.share,
          }))
        : undefined

      await addExpense(expenseData, participantsData)

      // Reset form
      setDescription("")
      setAmount("")
      setCategory("")
      setIsSplit(false)
      setPeople([{ id: "1", name: "", share: 1 }])
      onOpenChange(false)
    } catch (error) {
      console.error("[v0] Error adding expense:", error)
      alert("Erro ao adicionar despesa. Tente novamente.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Nova Despesa</DialogTitle>
          <DialogDescription>Adicione uma nova despesa ao seu controle financeiro.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="description">Descrição</Label>
              <Input
                id="description"
                placeholder="Ex: Conta de luz"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="amount">Valor</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                placeholder="0,00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="category">Categoria</Label>
              <Select value={category} onValueChange={setCategory} required disabled={categoriesLoading}>
                <SelectTrigger>
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

            <div className="flex items-center justify-between rounded-lg border border-border p-4">
              <div className="space-y-0.5">
                <Label htmlFor="split-mode">Dividir despesa</Label>
                <p className="text-sm text-muted-foreground">Dividir com outras pessoas (até 5x)</p>
              </div>
              <Switch id="split-mode" checked={isSplit} onCheckedChange={setIsSplit} />
            </div>

            {isSplit && (
              <div className="space-y-4 rounded-lg border border-border p-4">
                <div className="flex items-center justify-between">
                  <Label>Pessoas na divisão</Label>
                  {people.length < 5 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={addPerson}
                      className="gap-2 bg-transparent"
                    >
                      <Plus className="h-3 w-3" />
                      Adicionar pessoa
                    </Button>
                  )}
                </div>

                <div className="space-y-3">
                  {people.map((person, index) => (
                    <div key={person.id} className="flex gap-2 items-start">
                      <div className="flex-1 space-y-2">
                        <Input
                          placeholder={`Nome da pessoa ${index + 1}`}
                          value={person.name}
                          onChange={(e) => updatePerson(person.id, "name", e.target.value)}
                          required={isSplit}
                        />
                        <div className="flex gap-2 items-center">
                          <Input
                            type="number"
                            min="1"
                            max="5"
                            placeholder="Partes"
                            value={person.share}
                            onChange={(e) => updatePerson(person.id, "share", Number.parseInt(e.target.value) || 1)}
                            className="w-24"
                            required={isSplit}
                          />
                          <span className="text-sm text-muted-foreground">
                            = R$ {(amountPerShare * person.share).toFixed(2)}
                          </span>
                        </div>
                      </div>
                      {people.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removePerson(person.id)}
                          className="mt-1"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>

                {amount && (
                  <div className="pt-2 border-t border-border text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Total de partes:</span>
                      <span className="font-medium">{totalShares}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Valor por parte:</span>
                      <span className="font-medium">R$ {amountPerShare.toFixed(2)}</span>
                    </div>
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
