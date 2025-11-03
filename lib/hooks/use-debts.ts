"use client"

import { useState, useEffect } from "react"
import { createBrowserClient } from "@/lib/supabase/client"
import type { Debt, DebtParticipant } from "@/lib/types"

export function useDebts() {
  const [debts, setDebts] = useState<Debt[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createBrowserClient()

  const fetchDebts = async () => {
    try {
      const { data, error } = await supabase.from("debts").select("*").order("created_at", { ascending: false })

      if (error) {
        console.error("[v0] Error fetching debts:", error)
        return
      }

      setDebts(data || [])
    } catch (error) {
      console.error("[v0] Error in fetchDebts:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDebts()
  }, [])

  const addDebt = async (
    debt: Omit<Debt, "id" | "created_at" | "updated_at">,
    participants?: { name: string; parts: number }[],
  ) => {
    try {
      const { data: debtData, error: debtError } = await supabase.from("debts").insert([debt]).select().single()

      if (debtError) {
        console.error("[v0] Error adding debt:", debtError)
        return null
      }

      // If debt is split, add participants
      if (debt.is_split && participants && participants.length > 0) {
        const totalParts = participants.reduce((sum, p) => sum + p.parts, 0)
        const participantsData = participants.map((p) => ({
          debt_id: debtData.id,
          name: p.name,
          parts: p.parts,
          amount_owed: (debt.total_amount * p.parts) / totalParts,
          is_paid: false,
        }))

        const { error: participantsError } = await supabase.from("debt_participants").insert(participantsData)

        if (participantsError) {
          console.error("[v0] Error adding debt participants:", participantsError)
        }
      }

      await fetchDebts()
      return debtData
    } catch (error) {
      console.error("[v0] Error in addDebt:", error)
      return null
    }
  }

  const updateDebt = async (id: string, updates: Partial<Debt>) => {
    try {
      const { error } = await supabase.from("debts").update(updates).eq("id", id)

      if (error) {
        console.error("[v0] Error updating debt:", error)
        return false
      }

      await fetchDebts()
      return true
    } catch (error) {
      console.error("[v0] Error in updateDebt:", error)
      return false
    }
  }

  const deleteDebt = async (id: string) => {
    try {
      const { error } = await supabase.from("debts").delete().eq("id", id)

      if (error) {
        console.error("[v0] Error deleting debt:", error)
        return false
      }

      await fetchDebts()
      return true
    } catch (error) {
      console.error("[v0] Error in deleteDebt:", error)
      return false
    }
  }

  const getDebtParticipants = async (debtId: string): Promise<DebtParticipant[]> => {
    try {
      const { data, error } = await supabase.from("debt_participants").select("*").eq("debt_id", debtId)

      if (error) {
        console.error("[v0] Error fetching debt participants:", error)
        return []
      }

      return data || []
    } catch (error) {
      console.error("[v0] Error in getDebtParticipants:", error)
      return []
    }
  }

  return { debts, loading, addDebt, updateDebt, deleteDebt, getDebtParticipants, refetch: fetchDebts }
}
