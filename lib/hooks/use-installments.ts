"use client"

import { useState, useEffect } from "react"
import { createBrowserClient } from "@/lib/supabase/client"
import type { Installment, InstallmentParticipant } from "@/lib/types"

export function useInstallments() {
  const [installments, setInstallments] = useState<Installment[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createBrowserClient()

  const fetchInstallments = async () => {
    try {
      const { data, error } = await supabase.from("installments").select("*").order("created_at", { ascending: false })

      if (error) {
        console.error("[v0] Error fetching installments:", error)
        return
      }

      setInstallments(data || [])
    } catch (error) {
      console.error("[v0] Error in fetchInstallments:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchInstallments()
  }, [])

  const addInstallment = async (
    installment: Omit<Installment, "id" | "created_at" | "updated_at">,
    participants?: { name: string; parts: number }[],
  ) => {
    try {
      const { data: installmentData, error: installmentError } = await supabase
        .from("installments")
        .insert([installment])
        .select()
        .single()

      if (installmentError) {
        console.error("[v0] Error adding installment:", installmentError)
        return null
      }

      // If installment is split, add participants
      if (installment.is_split && participants && participants.length > 0) {
        const totalParts = participants.reduce((sum, p) => sum + p.parts, 0)
        const participantsData = participants.map((p) => ({
          installment_id: installmentData.id,
          name: p.name,
          parts: p.parts,
          amount_owed: (installment.installment_value * p.parts) / totalParts,
        }))

        const { error: participantsError } = await supabase.from("installment_participants").insert(participantsData)

        if (participantsError) {
          console.error("[v0] Error adding installment participants:", participantsError)
        }
      }

      await fetchInstallments()
      return installmentData
    } catch (error) {
      console.error("[v0] Error in addInstallment:", error)
      return null
    }
  }

  const updateInstallment = async (id: string, updates: Partial<Installment>) => {
    try {
      const { error } = await supabase.from("installments").update(updates).eq("id", id)

      if (error) {
        console.error("[v0] Error updating installment:", error)
        return false
      }

      await fetchInstallments()
      return true
    } catch (error) {
      console.error("[v0] Error in updateInstallment:", error)
      return false
    }
  }

  const deleteInstallment = async (id: string) => {
    try {
      const { error } = await supabase.from("installments").delete().eq("id", id)

      if (error) {
        console.error("[v0] Error deleting installment:", error)
        return false
      }

      await fetchInstallments()
      return true
    } catch (error) {
      console.error("[v0] Error in deleteInstallment:", error)
      return false
    }
  }

  const getInstallmentParticipants = async (installmentId: string): Promise<InstallmentParticipant[]> => {
    try {
      const { data, error } = await supabase
        .from("installment_participants")
        .select("*")
        .eq("installment_id", installmentId)

      if (error) {
        console.error("[v0] Error fetching installment participants:", error)
        return []
      }

      return data || []
    } catch (error) {
      console.error("[v0] Error in getInstallmentParticipants:", error)
      return []
    }
  }

  return {
    installments,
    loading,
    addInstallment,
    updateInstallment,
    deleteInstallment,
    getInstallmentParticipants,
    refetch: fetchInstallments,
  }
}
