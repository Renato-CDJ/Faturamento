"use client"

import { useState, useEffect } from "react"
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
  Timestamp,
  type DocumentData,
} from "firebase/firestore"
import { db } from "@/lib/firebase/client"
import { useAuth } from "@/lib/contexts/auth-context"
import type { Installment } from "@/lib/types"

export function useInstallmentsFirebase() {
  const [installments, setInstallments] = useState<Installment[]>([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  const fetchInstallments = async () => {
    try {
      if (!user) {
        setInstallments([])
        setLoading(false)
        return
      }

      const installmentsRef = collection(db, "installments")
      const q = query(installmentsRef, where("user_id", "==", user.uid))
      const querySnapshot = await getDocs(q)

      const installmentsData = querySnapshot.docs.map((doc) => {
        const data = doc.data()
        return {
          id: doc.id,
          ...data,
          due_date: data.due_date?.toDate?.()?.toISOString() || new Date().toISOString(),
          created_at: data.created_at?.toDate?.()?.toISOString() || new Date().toISOString(),
        } as Installment
      })

      installmentsData.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())

      setInstallments(installmentsData)
    } catch (error) {
      console.error("[v0] Error fetching installments from Firebase:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (user) {
      fetchInstallments()
    }
  }, [user])

  const addInstallment = async (
    installment: Omit<Installment, "id" | "created_at" | "updated_at">,
    participants?: { name: string; parts: number }[],
  ) => {
    try {
      if (!user) throw new Error("User not authenticated")

      const installmentsRef = collection(db, "installments")
      const installmentData = {
        ...installment,
        user_id: user.uid,
        due_date: Timestamp.fromDate(new Date(installment.due_date)),
        created_at: Timestamp.now(),
        updated_at: Timestamp.now(),
      }

      const docRef = await addDoc(installmentsRef, installmentData)

      if (installment.is_split && participants && participants.length > 0) {
        const totalParts = participants.reduce((sum, p) => sum + p.parts, 0)
        const participantsRef = collection(db, "installment_participants")

        for (const p of participants) {
          await addDoc(participantsRef, {
            installment_id: docRef.id,
            name: p.name,
            parts: p.parts,
            amount_owed: (installment.installment_value * p.parts) / totalParts,
            created_at: Timestamp.now(),
          })
        }
      }

      await fetchInstallments()
      return { id: docRef.id, ...installmentData }
    } catch (error) {
      console.error("[v0] Error adding installment to Firebase:", error)
      return null
    }
  }

  const updateInstallment = async (id: string, updates: Partial<Installment>) => {
    try {
      const installmentRef = doc(db, "installments", id)
      const updateData: DocumentData = {
        ...updates,
        updated_at: Timestamp.now(),
      }

      if (updates.due_date) {
        updateData.due_date = Timestamp.fromDate(new Date(updates.due_date))
      }

      await updateDoc(installmentRef, updateData)
      await fetchInstallments()
      return true
    } catch (error) {
      console.error("[v0] Error updating installment in Firebase:", error)
      return false
    }
  }

  const deleteInstallment = async (id: string) => {
    try {
      const installmentRef = doc(db, "installments", id)
      await deleteDoc(installmentRef)
      await fetchInstallments()
      return true
    } catch (error) {
      console.error("[v0] Error deleting installment from Firebase:", error)
      return false
    }
  }

  const getInstallmentParticipants = async (installmentId: string) => {
    try {
      const participantsRef = collection(db, "installment_participants")
      const querySnapshot = await getDocs(participantsRef)

      const participants = querySnapshot.docs
        .filter((doc) => doc.data().installment_id === installmentId)
        .map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))

      return participants
    } catch (error) {
      console.error("[v0] Error fetching installment participants from Firebase:", error)
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

export { useInstallmentsFirebase as useInstallments }
