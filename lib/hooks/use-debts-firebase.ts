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
import type { Debt, DebtParticipant } from "@/lib/types"

export function useDebtsFirebase() {
  const [debts, setDebts] = useState<Debt[]>([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  const fetchDebts = async () => {
    try {
      if (!user) {
        setDebts([])
        setLoading(false)
        return
      }

      const debtsRef = collection(db, "debts")
      const q = query(debtsRef, where("user_id", "==", user.uid))
      const querySnapshot = await getDocs(q)

      const debtsData = querySnapshot.docs.map((doc) => {
        const data = doc.data()
        return {
          id: doc.id,
          ...data,
          created_at: data.created_at?.toDate?.()?.toISOString() || new Date().toISOString(),
          updated_at: data.updated_at?.toDate?.()?.toISOString() || new Date().toISOString(),
          due_date: data.due_date?.toDate?.()?.toISOString() || null,
        } as Debt
      })

      debtsData.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())

      setDebts(debtsData)
    } catch (error) {
      console.error("[v0] Error fetching debts from Firebase:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (user) {
      fetchDebts()
    }
  }, [user])

  const addDebt = async (
    debt: Omit<Debt, "id" | "created_at" | "updated_at">,
    participants?: { name: string; parts: number }[],
  ) => {
    try {
      if (!user) throw new Error("User not authenticated")

      const debtsRef = collection(db, "debts")
      const debtData = {
        ...debt,
        user_id: user.uid,
        created_at: Timestamp.now(),
        updated_at: Timestamp.now(),
        due_date: debt.due_date ? Timestamp.fromDate(new Date(debt.due_date)) : null,
      }

      const docRef = await addDoc(debtsRef, debtData)

      if (debt.is_split && participants && participants.length > 0) {
        const totalParts = participants.reduce((sum, p) => sum + p.parts, 0)
        const participantsRef = collection(db, "debt_participants")

        for (const p of participants) {
          await addDoc(participantsRef, {
            debt_id: docRef.id,
            name: p.name,
            parts: p.parts,
            amount_owed: (debt.total_amount * p.parts) / totalParts,
            is_paid: false,
            created_at: Timestamp.now(),
          })
        }
      }

      await fetchDebts()
      return { id: docRef.id, ...debtData }
    } catch (error) {
      console.error("[v0] Error adding debt to Firebase:", error)
      return null
    }
  }

  const updateDebt = async (id: string, updates: Partial<Debt>) => {
    try {
      const debtRef = doc(db, "debts", id)
      const updateData: DocumentData = {
        ...updates,
        updated_at: Timestamp.now(),
      }

      if (updates.due_date) {
        updateData.due_date = Timestamp.fromDate(new Date(updates.due_date))
      }

      await updateDoc(debtRef, updateData)
      await fetchDebts()
      return true
    } catch (error) {
      console.error("[v0] Error updating debt in Firebase:", error)
      return false
    }
  }

  const deleteDebt = async (id: string) => {
    try {
      const debtRef = doc(db, "debts", id)
      await deleteDoc(debtRef)

      const participantsRef = collection(db, "debt_participants")
      const q = query(participantsRef)
      const querySnapshot = await getDocs(q)

      const deletePromises = querySnapshot.docs
        .filter((doc) => doc.data().debt_id === id)
        .map((doc) => deleteDoc(doc.ref))

      await Promise.all(deletePromises)

      await fetchDebts()
      return true
    } catch (error) {
      console.error("[v0] Error deleting debt from Firebase:", error)
      return false
    }
  }

  const getDebtParticipants = async (debtId: string): Promise<DebtParticipant[]> => {
    try {
      const participantsRef = collection(db, "debt_participants")
      const querySnapshot = await getDocs(participantsRef)

      const participants = querySnapshot.docs
        .filter((doc) => doc.data().debt_id === debtId)
        .map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as DebtParticipant[]

      return participants
    } catch (error) {
      console.error("[v0] Error fetching debt participants from Firebase:", error)
      return []
    }
  }

  return { debts, loading, addDebt, updateDebt, deleteDebt, getDebtParticipants, refetch: fetchDebts }
}

export { useDebtsFirebase as useDebts }
