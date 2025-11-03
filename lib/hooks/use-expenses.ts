"use client"

import { useState, useEffect } from "react"
import { createBrowserClient } from "@/lib/supabase/client"
import type { Expense, ExpenseParticipant } from "@/lib/types"

export function useExpenses() {
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createBrowserClient()

  const fetchExpenses = async () => {
    try {
      const { data, error } = await supabase.from("expenses").select("*").order("created_at", { ascending: false })

      if (error) {
        console.error("[v0] Error fetching expenses:", error)
        return
      }

      setExpenses(data || [])
    } catch (error) {
      console.error("[v0] Error in fetchExpenses:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchExpenses()
  }, [])

  const addExpense = async (
    expense: Omit<Expense, "id" | "created_at" | "updated_at">,
    participants?: { name: string; parts: number }[],
  ) => {
    try {
      const { data: expenseData, error: expenseError } = await supabase
        .from("expenses")
        .insert([expense])
        .select()
        .single()

      if (expenseError) {
        console.error("[v0] Error adding expense:", expenseError)
        return null
      }

      // If expense is split, add participants
      if (expense.is_split && participants && participants.length > 0) {
        const totalParts = participants.reduce((sum, p) => sum + p.parts, 0)
        const participantsData = participants.map((p) => ({
          expense_id: expenseData.id,
          name: p.name,
          parts: p.parts,
          amount_owed: (expense.amount * p.parts) / totalParts,
          is_paid: false,
        }))

        const { error: participantsError } = await supabase.from("expense_participants").insert(participantsData)

        if (participantsError) {
          console.error("[v0] Error adding expense participants:", participantsError)
        }
      }

      await fetchExpenses()
      return expenseData
    } catch (error) {
      console.error("[v0] Error in addExpense:", error)
      return null
    }
  }

  const updateExpense = async (id: string, updates: Partial<Expense>) => {
    try {
      const { error } = await supabase.from("expenses").update(updates).eq("id", id)

      if (error) {
        console.error("[v0] Error updating expense:", error)
        return false
      }

      await fetchExpenses()
      return true
    } catch (error) {
      console.error("[v0] Error in updateExpense:", error)
      return false
    }
  }

  const deleteExpense = async (id: string) => {
    try {
      const { error } = await supabase.from("expenses").delete().eq("id", id)

      if (error) {
        console.error("[v0] Error deleting expense:", error)
        return false
      }

      await fetchExpenses()
      return true
    } catch (error) {
      console.error("[v0] Error in deleteExpense:", error)
      return false
    }
  }

  const getExpenseParticipants = async (expenseId: string): Promise<ExpenseParticipant[]> => {
    try {
      const { data, error } = await supabase.from("expense_participants").select("*").eq("expense_id", expenseId)

      if (error) {
        console.error("[v0] Error fetching expense participants:", error)
        return []
      }

      return data || []
    } catch (error) {
      console.error("[v0] Error in getExpenseParticipants:", error)
      return []
    }
  }

  return { expenses, loading, addExpense, updateExpense, deleteExpense, getExpenseParticipants, refetch: fetchExpenses }
}
