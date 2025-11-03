"use client"

import { useState, useEffect } from "react"
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  orderBy,
  Timestamp,
} from "firebase/firestore"
import { db } from "@/lib/firebase/client"
import type { Category } from "@/lib/types"

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    console.log("[v0] Setting up categories listener")
    const q = query(collection(db, "categories"), orderBy("name", "asc"))

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const categoriesData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          created_at: doc.data().created_at?.toDate?.()?.toISOString() || new Date().toISOString(),
        })) as Category[]

        setCategories(categoriesData)
        setLoading(false)
        setError(null)
      },
      (error) => {
        console.error("[v0] Error fetching categories:", error.message)
        setError(error.message)
        setLoading(false)
      },
    )

    return () => unsubscribe()
  }, [])

  const addCategory = async (
    nameOrObject: string | { name: string; type: string; color: string },
    type?: "expense" | "debt" | "all" | "installment",
    color?: string,
  ) => {
    try {
      // Handle both object and individual parameter formats
      const categoryData =
        typeof nameOrObject === "string"
          ? { name: nameOrObject, type: type || "expense", color: color || "#6b7280" }
          : { name: nameOrObject.name, type: nameOrObject.type || "expense", color: nameOrObject.color || "#6b7280" }

      await addDoc(collection(db, "categories"), {
        ...categoryData,
        created_at: Timestamp.now(),
      })
    } catch (error: any) {
      console.error("[v0] Error adding category:", error)
      throw error
    }
  }

  const updateCategory = async (id: string, updates: Partial<Omit<Category, "id" | "created_at">>) => {
    try {
      const categoryRef = doc(db, "categories", id)
      await updateDoc(categoryRef, updates)
    } catch (error: any) {
      console.error("[v0] Error updating category:", error)
      throw error
    }
  }

  const deleteCategory = async (id: string) => {
    try {
      const categoryRef = doc(db, "categories", id)
      await deleteDoc(categoryRef)
    } catch (error: any) {
      console.error("[v0] Error deleting category:", error)
      throw error
    }
  }

  return {
    categories,
    loading,
    error,
    addCategory,
    updateCategory,
    deleteCategory,
  }
}
