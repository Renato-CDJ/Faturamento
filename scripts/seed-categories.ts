// Script para adicionar categorias iniciais ao Firebase
// Execute este script uma vez para popular o banco de dados

import { initializeApp } from "firebase/app"
import { getFirestore, collection, addDoc, serverTimestamp } from "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyARZ4Oz1-OFqlLQH7YwE_J_mMpgmLkyaUI",
  authDomain: "faturamento-7d690.firebaseapp.com",
  projectId: "faturamento-7d690",
  storageBucket: "faturamento-7d690.firebasestorage.app",
  messagingSenderId: "746669001469",
  appId: "1:746669001469:web:ab0c84187a7dbd07dfcc94",
  measurementId: "G-JF4ZE1GWRT",
}

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

const defaultCategories = [
  { name: "Alimentação", type: "all", color: "#10b981" },
  { name: "Transporte", type: "all", color: "#3b82f6" },
  { name: "Moradia", type: "all", color: "#8b5cf6" },
  { name: "Saúde", type: "all", color: "#ef4444" },
  { name: "Lazer", type: "all", color: "#f59e0b" },
  { name: "Educação", type: "all", color: "#06b6d4" },
  { name: "Vestuário", type: "all", color: "#ec4899" },
  { name: "Outros", type: "all", color: "#6b7280" },
]

async function seedCategories() {
  console.log("🌱 Iniciando seed de categorias...")

  try {
    const categoriesRef = collection(db, "categories")

    for (const category of defaultCategories) {
      const docRef = await addDoc(categoriesRef, {
        ...category,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      })
      console.log(`✅ Categoria "${category.name}" adicionada com ID: ${docRef.id}`)
    }

    console.log("🎉 Seed concluído com sucesso!")
  } catch (error) {
    console.error("❌ Erro ao fazer seed:", error)
  }
}

seedCategories()
