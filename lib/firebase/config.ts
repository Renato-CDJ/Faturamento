import { initializeApp, getApps, type FirebaseApp } from "firebase/app"
import { getFirestore, type Firestore } from "firebase/firestore"
import { getAuth, type Auth } from "firebase/auth"

const firebaseConfig = {
  apiKey: "AIzaSyARZ4Oz1-OFqlLQH7YwE_J_mMpgmLkyaUI",
  authDomain: "faturamento-7d690.firebaseapp.com",
  projectId: "faturamento-7d690",
  storageBucket: "faturamento-7d690.firebasestorage.app",
  messagingSenderId: "746669001469",
  appId: "1:746669001469:web:ab0c84187a7dbd07dfcc94",
  measurementId: "G-JF4ZE1GWRT",
}

let app: FirebaseApp
let db: Firestore
let auth: Auth

// Initialize Firebase (singleton pattern)
export function initializeFirebase() {
  if (!getApps().length) {
    app = initializeApp(firebaseConfig)
    db = getFirestore(app)
    auth = getAuth(app)
  } else {
    app = getApps()[0]
    db = getFirestore(app)
    auth = getAuth(app)
  }

  return { app, db, auth }
}

// Export initialized instances
export function getFirebaseApp() {
  if (!app) {
    initializeFirebase()
  }
  return app
}

export function getFirebaseDb() {
  if (!db) {
    initializeFirebase()
  }
  return db
}

export function getFirebaseAuth() {
  if (!auth) {
    initializeFirebase()
  }
  return auth
}
