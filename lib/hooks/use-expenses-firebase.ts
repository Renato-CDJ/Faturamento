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
import type { Expense, ExpenseParticipant } from "@/lib/types"

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

  const addExpense = async (
    expense: Omit<Expense, "id" | "created_at" | "updated_at">,
    participants?: { name: string; parts: number }[],
  ) => {
    try {
      const expensesRef = collection(db, "expenses")
      const expenseData = {
        ...expense,
        date: Timestamp.fromDate(new Date(expense.date)),
        created_at: Timestamp.now(),
        updated_at: Timestamp.now(),
      }

      console.log("[v0] Saving expense to Firebase:", expenseData)
      const docRef = await addDoc(expensesRef, expenseData)
      console.log("[v0] Expense saved with ID:", docRef.id)

      if (expense.is_split && participants && participants.length > 0) {
        const totalParts = participants.reduce((sum, p) => sum + p.parts, 0)
        const participantsRef = collection(db, "expense_participants")

        console.log("[v0] Saving expense participants:", participants)
        for (const p of participants) {
          await addDoc(participantsRef, {
            expense_id: docRef.id,
            name: p.name,
            parts: p.parts,
            amount_owed: (expense.amount * p.parts) / totalParts,
            is_paid: false,
            created_at: Timestamp.now(),
          })
        }
        console.log("[v0] Expense participants saved")
      }

      await fetchExpenses()
      return { id: docRef.id, ...expenseData }
    } catch (error) {
      console.error("[v0] Error adding expense to Firebase:", error)
      throw error
    }
  }

  const updateExpense = async (id: string, updates: Partial<Expense>) => {
    try {
      const expenseRef = doc(db, "expenses", id)
      const updateData: DocumentData = {
        ...updates,
        updated_at: Timestamp.now(),
      }

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

      // Delete associated participants
      const participantsRef = collection(db, "expense_participants")
      const q = query(participantsRef)
      const querySnapshot = await getDocs(q)

      const deletePromises = querySnapshot.docs
        .filter((doc) => doc.data().expense_id === id)
        .map((doc) => deleteDoc(doc.ref))

      await Promise.all(deletePromises)

      await fetchExpenses()
      return true
    } catch (error) {
      console.error("[v0] Error deleting expense from Firebase:", error)
      return false
    }
  }

  const getExpenseParticipants = async (expenseId: string): Promise<ExpenseParticipant[]> => {
    try {
      const participantsRef = collection(db, "expense_participants")
      const querySnapshot = await getDocs(participantsRef)

      const participants = querySnapshot.docs
        .filter((doc) => doc.data().expense_id === expenseId)
        .map((doc) => ({
          id: doc.id,
          ...doc.data(),
          created_at: doc.data().created_at?.toDate?.()?.toISOString() || new Date().toISOString(),
        })) as ExpenseParticipant[]

      return participants
    } catch (error) {
      console.error("[v0] Error fetching expense participants from Firebase:", error)
      return []
    }
  }

  return {
    expenses,
    loading,
    addExpense,
    updateExpense,
    deleteExpense,
    getExpenseParticipants,
    refetch: fetchExpenses,
  }
}

export { useExpensesFirebase as useExpenses }
