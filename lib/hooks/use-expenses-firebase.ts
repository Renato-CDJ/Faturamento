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
import type { Expense } from "@/lib/types"

export function useExpensesFirebase() {
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [loading, setLoading] = useState(true)

  const fetchExpenses = async () => {
    try {
      const expensesRef = collection(db, "expenses")
      const q = query(expensesRef, orderBy("date", "desc"))
      const querySnapshot = await getDocs(q)

      const expensesData = querySnapshot.docs.map((doc) => {
        const data = doc.data()
        return {
          id: doc.id,
          ...data,
          date: data.date?.toDate?.()?.toISOString() || new Date().toISOString(),
          created_at: data.created_at?.toDate?.()?.toISOString() || new Date().toISOString(),
        } as Expense
      })

      setExpenses(expensesData)
    } catch (error) {
      console.error("[v0] Error fetching expenses from Firebase:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchExpenses()
  }, [])

  const addExpense = async (expense: Omit<Expense, "id" | "created_at">) => {
    try {
      const expensesRef = collection(db, "expenses")
      const expenseData = {
        ...expense,
        date: Timestamp.fromDate(new Date(expense.date)),
        created_at: Timestamp.now(),
      }

      const docRef = await addDoc(expensesRef, expenseData)
      await fetchExpenses()
      return { id: docRef.id, ...expenseData }
    } catch (error) {
      console.error("[v0] Error adding expense to Firebase:", error)
      return null
    }
  }

  const updateExpense = async (id: string, updates: Partial<Expense>) => {
    try {
      const expenseRef = doc(db, "expenses", id)
      const updateData: DocumentData = { ...updates }

      if (updates.date) {
        updateData.date = Timestamp.fromDate(new Date(updates.date))
      }

      await updateDoc(expenseRef, updateData)
      await fetchExpenses()
      return true
    } catch (error) {
      console.error("[v0] Error updating expense in Firebase:", error)
      return false
    }
  }

  const deleteExpense = async (id: string) => {
    try {
      const expenseRef = doc(db, "expenses", id)
      await deleteDoc(expenseRef)
      await fetchExpenses()
      return true
    } catch (error) {
      console.error("[v0] Error deleting expense from Firebase:", error)
      return false
    }
  }

  return { expenses, loading, addExpense, updateExpense, deleteExpense, refetch: fetchExpenses }
}

export { useExpensesFirebase as useExpenses }
