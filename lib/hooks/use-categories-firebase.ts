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

        console.log("[v0] Categories updated:", categoriesData.length)
        setCategories(categoriesData)
        setLoading(false)
      },
      (error) => {
        console.error("[v0] Error fetching categories:", error.message)
        setLoading(false)
      },
    )

    return () => unsubscribe()
  }, [])

  const addCategory = async (name: string, icon?: string) => {
    try {
      console.log("[v0] Adding category:", name)
      await addDoc(collection(db, "categories"), {
        name,
        icon: icon || "📁",
        created_at: Timestamp.now(),
      })
      console.log("[v0] Category added successfully")
    } catch (error) {
      console.error("[v0] Error adding category:", error)
      throw error
    }
  }

  const updateCategory = async (id: string, updates: Partial<Omit<Category, "id" | "created_at">>) => {
    try {
      console.log("[v0] Updating category:", id)
      const categoryRef = doc(db, "categories", id)
      await updateDoc(categoryRef, updates)
      console.log("[v0] Category updated successfully")
    } catch (error) {
      console.error("[v0] Error updating category:", error)
      throw error
    }
  }

  const deleteCategory = async (id: string) => {
    try {
      console.log("[v0] Deleting category:", id)
      const categoryRef = doc(db, "categories", id)
      await deleteDoc(categoryRef)
      console.log("[v0] Category deleted successfully")
    } catch (error) {
      console.error("[v0] Error deleting category:", error)
      throw error
    }
  }

  return {
    categories,
    loading,
    addCategory,
    updateCategory,
    deleteCategory,
  }
}
