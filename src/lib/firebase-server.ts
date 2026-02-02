/**
 * Firestore access from the server (API routes) using the same config as the client.
 * No service account needed - uses NEXT_PUBLIC_FIREBASE_* from .env.local.
 * Firestore rules must allow read on the admincred collection.
 */
import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
import { getFirestore, doc, getDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

function getServerApp(): FirebaseApp | null {
  const apps = getApps();
  if (apps.length > 0) return apps[0] as FirebaseApp;
  if (!firebaseConfig.apiKey || !firebaseConfig.projectId) return null;
  return initializeApp(firebaseConfig);
}

const serverApp = getServerApp();

export function getServerFirestore() {
  if (!serverApp) return null;
  return getFirestore(serverApp);
}

export async function getAdminCredDoc() {
  const db = getServerFirestore();
  if (!db) return null;
  const ref = doc(db, "admincred", "admin");
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  return snap.data();
}
