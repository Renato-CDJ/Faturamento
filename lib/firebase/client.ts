"use client"

import { getFirebaseDb, getFirebaseAuth } from "./config"

export const db = getFirebaseDb()
export const auth = getFirebaseAuth()

// Keep the function for backward compatibility
export function createFirebaseClient() {
  return {
    db,
    auth,
  }
}
