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

  const addInstallment = async (installment: Omit<Installment, "id" | "created_at" | "updated_at">) => {
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

  return { installments, loading, addInstallment, updateInstallment, deleteInstallment, refetch: fetchInstallments }
}

export { useInstallmentsFirebase as useInstallments }
