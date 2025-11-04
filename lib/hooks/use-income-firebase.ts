"use client"

import { useState, useEffect } from "react"
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  getDocs,
  Timestamp,
  type DocumentData,
} from "firebase/firestore"
import { db } from "@/lib/firebase/client"
import { useAuth } from "@/lib/contexts/auth-context"
import type { Income } from "@/lib/types"

export function useIncomeFirebase() {
  const [incomes, setIncomes] = useState<Income[]>([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  const fetchIncomes = async () => {
    try {
      if (!user?.uid) {
        console.log("[v0] No user authenticated, skipping income fetch")
        setIncomes([])
        setLoading(false)
        return
      }

      const incomesRef = collection(db, "incomes")
      const q = query(incomesRef, where("user_id", "==", user.uid))

      console.log("[v0] Fetching incomes for user:", user.uid)
      const querySnapshot = await getDocs(q)
      console.log("[v0] Query successful, docs found:", querySnapshot.docs.length)

      const incomesData = querySnapshot.docs.map((doc) => {
        const data = doc.data()
        return {
          id: doc.id,
          ...data,
          date: data.date?.toDate?.()?.toISOString() || new Date().toISOString(),
          created_at: data.created_at?.toDate?.()?.toISOString() || new Date().toISOString(),
          updated_at: data.updated_at?.toDate?.()?.toISOString() || new Date().toISOString(),
        } as Income
      })

      incomesData.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

      setIncomes(incomesData)
      console.log("[v0] Incomes loaded successfully:", incomesData.length)
    } catch (error) {
      console.error("[v0] Error fetching incomes from Firebase:", error)
      setIncomes([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchIncomes()
  }, [user?.uid])

  const addIncome = async (income: Omit<Income, "id" | "created_at" | "updated_at">) => {
    try {
      if (!user?.uid) {
        throw new Error("User must be authenticated to add income")
      }

      const incomesRef = collection(db, "incomes")
      const incomeData = {
        ...income,
        user_id: user.uid,
        date: Timestamp.fromDate(new Date(income.date)),
        created_at: Timestamp.now(),
        updated_at: Timestamp.now(),
      }

      const docRef = await addDoc(incomesRef, incomeData)
      await fetchIncomes()
      return { id: docRef.id, ...incomeData }
    } catch (error) {
      console.error("[v0] Error adding income to Firebase:", error)
      throw error
    }
  }

  const updateIncome = async (id: string, updates: Partial<Income>) => {
    try {
      if (!user?.uid) {
        throw new Error("User must be authenticated to update income")
      }

      const incomeRef = doc(db, "incomes", id)
      const updateData: DocumentData = {
        ...updates,
        updated_at: Timestamp.now(),
      }

      if (updates.date) {
        updateData.date = Timestamp.fromDate(new Date(updates.date))
      }

      await updateDoc(incomeRef, updateData)
      await fetchIncomes()
      return true
    } catch (error) {
      console.error("[v0] Error updating income in Firebase:", error)
      return false
    }
  }

  const deleteIncome = async (id: string) => {
    try {
      if (!user?.uid) {
        throw new Error("User must be authenticated to delete income")
      }

      const incomeRef = doc(db, "incomes", id)
      await deleteDoc(incomeRef)
      await fetchIncomes()
      return true
    } catch (error) {
      console.error("[v0] Error deleting income from Firebase:", error)
      return false
    }
  }

  return {
    incomes,
    loading,
    addIncome,
    updateIncome,
    deleteIncome,
    refetch: fetchIncomes,
  }
}

export { useIncomeFirebase as useIncome }
