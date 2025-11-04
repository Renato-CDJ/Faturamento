"use client"

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
import { Plus, Trash2 } from "lucide-react"
import { useState, useEffect } from "react"
import { useIncome } from "@/lib/hooks/use-income-firebase"

interface AddIncomeDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

interface Salary {
  id: string
  description: string
  amount: string
}

export function SettingsDialog({ open, onOpenChange }: AddIncomeDialogProps) {
  const { incomes, addIncome, loading } = useIncome()
  const [salaries, setSalaries] = useState<Salary[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (open && !loading) {
      const recurringIncomes = incomes.filter((income) => income.is_recurring)
      if (recurringIncomes.length > 0) {
        setSalaries(
          recurringIncomes.map((income) => ({
            id: income.id,
            description: income.source,
            amount: income.amount.toString(),
          })),
        )
      } else {
        setSalaries([{ id: "1", description: "", amount: "" }])
      }
    }
  }, [open, incomes, loading])

  const addSalary = () => {
    const newSalary: Salary = {
      id: Date.now().toString(),
      description: "",
      amount: "",
    }
    setSalaries([...salaries, newSalary])
  }

  const removeSalary = (id: string) => {
    setSalaries(salaries.filter((s) => s.id !== id))
  }

  const updateSalary = (id: string, field: "description" | "amount", value: string) => {
    setSalaries(salaries.map((s) => (s.id === id ? { ...s, [field]: value } : s)))
  }

  const handleSave = async () => {
    setIsSubmitting(true)
    try {
      // Save each salary as a recurring income
      for (const salary of salaries) {
        if (salary.description && salary.amount) {
          await addIncome({
            source: salary.description,
            amount: Number.parseFloat(salary.amount),
            date: new Date().toISOString().split("T")[0],
            is_recurring: true,
          })
        }
      }
      onOpenChange(false)
    } catch (error) {
      console.error("[v0] Error saving salaries:", error)
      alert("Erro ao salvar salários. Tente novamente.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Configurações</DialogTitle>
          <DialogDescription>Gerencie seus salários e outras configurações.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="flex items-center justify-between">
            <Label className="text-base font-semibold">Salários</Label>
            <Button type="button" size="sm" onClick={addSalary} className="gap-2">
              <Plus className="h-4 w-4" />
              Adicionar Salário
            </Button>
          </div>

          <div className="space-y-3">
            {salaries.map((salary, index) => (
              <div key={salary.id} className="grid gap-3 rounded-lg border border-border p-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-muted-foreground">Salário {index + 1}</span>
                  {salaries.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => removeSalary(salary.id)}
                      title="Excluir salário"
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  )}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor={`salary-desc-${salary.id}`}>Descrição</Label>
                  <Input
                    id={`salary-desc-${salary.id}`}
                    placeholder="Ex: Salário CLT, Freelance"
                    value={salary.description}
                    onChange={(e) => updateSalary(salary.id, "description", e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor={`salary-amount-${salary.id}`}>Valor</Label>
                  <Input
                    id={`salary-amount-${salary.id}`}
                    type="number"
                    step="0.01"
                    placeholder="0,00"
                    value={salary.amount}
                    onChange={(e) => updateSalary(salary.id, "amount", e.target.value)}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
            Cancelar
          </Button>
          <Button type="button" onClick={handleSave} disabled={isSubmitting}>
            {isSubmitting ? "Salvando..." : "Salvar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
