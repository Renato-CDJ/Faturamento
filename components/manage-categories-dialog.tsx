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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useCategories } from "@/lib/hooks/use-categories-firebase"
import { Pencil, Trash2, Plus } from "lucide-react"
import { useState } from "react"
import { ScrollArea } from "@/components/ui/scroll-area"

interface ManageCategoriesDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ManageCategoriesDialog({ open, onOpenChange }: ManageCategoriesDialogProps) {
  const { categories, loading, addCategory, updateCategory, deleteCategory } = useCategories()
  const [isAdding, setIsAdding] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [newCategory, setNewCategory] = useState({ name: "", type: "all" as const, color: "#6b7280" })
  const [editData, setEditData] = useState({ name: "", type: "all" as const, color: "#6b7280" })

  const handleAdd = async () => {
    if (!newCategory.name.trim()) return

    try {
      await addCategory(newCategory)
      setNewCategory({ name: "", type: "all", color: "#6b7280" })
      setIsAdding(false)
    } catch (error) {
      alert("Erro ao adicionar categoria. Verifique se o nome já existe.")
    }
  }

  const handleEdit = async (id: string) => {
    if (!editData.name.trim()) return

    try {
      await updateCategory(id, editData)
      setEditingId(null)
    } catch (error) {
      alert("Erro ao atualizar categoria.")
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm("Tem certeza que deseja excluir esta categoria?")) {
      try {
        await deleteCategory(id)
      } catch (error) {
        alert("Erro ao excluir categoria. Ela pode estar em uso.")
      }
    }
  }

  const startEdit = (category: any) => {
    setEditingId(category.id)
    setEditData({ name: category.name, type: category.type, color: category.color || "#6b7280" })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Gerenciar Categorias</DialogTitle>
          <DialogDescription>Adicione, edite ou exclua categorias para organizar suas finanças.</DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[50vh] pr-4">
          <div className="space-y-4 py-4">
            {/* Add new category */}
            {isAdding ? (
              <div className="space-y-3 rounded-lg border border-border p-4 bg-muted/50">
                <div className="grid gap-3">
                  <div className="grid gap-2">
                    <Label htmlFor="new-name">Nome da Categoria</Label>
                    <Input
                      id="new-name"
                      placeholder="Ex: Investimentos"
                      value={newCategory.name}
                      onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="grid gap-2">
                      <Label htmlFor="new-type">Tipo</Label>
                      <Select
                        value={newCategory.type}
                        onValueChange={(value: any) => setNewCategory({ ...newCategory, type: value })}
                      >
                        <SelectTrigger id="new-type">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Todos</SelectItem>
                          <SelectItem value="expense">Despesas</SelectItem>
                          <SelectItem value="debt">Dívidas</SelectItem>
                          <SelectItem value="installment">Parcelamentos</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="new-color">Cor</Label>
                      <Input
                        id="new-color"
                        type="color"
                        value={newCategory.color}
                        onChange={(e) => setNewCategory({ ...newCategory, color: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleAdd} size="sm" className="flex-1">
                    Salvar
                  </Button>
                  <Button onClick={() => setIsAdding(false)} variant="outline" size="sm" className="flex-1">
                    Cancelar
                  </Button>
                </div>
              </div>
            ) : (
              <Button onClick={() => setIsAdding(true)} variant="outline" className="w-full gap-2">
                <Plus className="h-4 w-4" />
                Adicionar Nova Categoria
              </Button>
            )}

            {/* Categories list */}
            <div className="space-y-2">
              {loading ? (
                <p className="text-sm text-muted-foreground text-center py-4">Carregando categorias...</p>
              ) : categories.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">Nenhuma categoria encontrada.</p>
              ) : (
                categories.map((category) => (
                  <div key={category.id} className="rounded-lg border border-border p-3">
                    {editingId === category.id ? (
                      <div className="space-y-3">
                        <div className="grid gap-3">
                          <Input
                            placeholder="Nome"
                            value={editData.name}
                            onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                          />
                          <div className="grid grid-cols-2 gap-3">
                            <Select
                              value={editData.type}
                              onValueChange={(value: any) => setEditData({ ...editData, type: value })}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="all">Todos</SelectItem>
                                <SelectItem value="expense">Despesas</SelectItem>
                                <SelectItem value="debt">Dívidas</SelectItem>
                                <SelectItem value="installment">Parcelamentos</SelectItem>
                              </SelectContent>
                            </Select>
                            <Input
                              type="color"
                              value={editData.color}
                              onChange={(e) => setEditData({ ...editData, color: e.target.value })}
                            />
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button onClick={() => handleEdit(category.id)} size="sm" className="flex-1">
                            Salvar
                          </Button>
                          <Button onClick={() => setEditingId(null)} variant="outline" size="sm" className="flex-1">
                            Cancelar
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div
                            className="h-4 w-4 rounded-full"
                            style={{ backgroundColor: category.color || "#6b7280" }}
                          />
                          <div>
                            <p className="font-medium">{category.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {category.type === "all"
                                ? "Todos"
                                : category.type === "expense"
                                  ? "Despesas"
                                  : category.type === "debt"
                                    ? "Dívidas"
                                    : "Parcelamentos"}
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="icon" onClick={() => startEdit(category)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDelete(category.id)}>
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </ScrollArea>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Fechar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
