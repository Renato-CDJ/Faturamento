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
import type { Installment } from "@/lib/types"

export function useInstallmentsFirebase() {
  const [installments, setInstallments] = useState<Installment[]>([])
  const [loading, setLoading] = useState(true)

  const fetchInstallments = async () => {
    try {
      const installmentsRef = collection(db, "installments")
      const q = query(installmentsRef, orderBy("created_at", "desc"))
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

      setInstallments(installmentsData)
    } catch (error) {
      console.error("[v0] Error fetching installments from Firebase:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchInstallments()
  }, [])

  const addInstallment = async (installment: Omit<Installment, "id" | "created_at" | "updated_at">) => {
    try {
      const installmentsRef = collection(db, "installments")
      const installmentData = {
        ...installment,
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
