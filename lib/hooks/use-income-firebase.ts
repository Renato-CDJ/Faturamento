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
  orderBy,
  Timestamp,
  type DocumentData,
} from "firebase/firestore"
import { db } from "@/lib/firebase/client"
import type { Income } from "@/lib/types"

export function useIncomeFirebase() {
  const [incomes, setIncomes] = useState<Income[]>([])
  const [loading, setLoading] = useState(true)

  const fetchIncomes = async () => {
    try {
      const incomesRef = collection(db, "incomes")
      const q = query(incomesRef, orderBy("date", "desc"))
      const querySnapshot = await getDocs(q)

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

      setIncomes(incomesData)
    } catch (error) {
      console.error("[v0] Error fetching incomes from Firebase:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchIncomes()
  }, [])

  const addIncome = async (income: Omit<Income, "id" | "created_at" | "updated_at">) => {
    try {
      const incomesRef = collection(db, "incomes")
      const incomeData = {
        ...income,
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
