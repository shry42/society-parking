/**
 * One-time script: Remove all col_7, col_9, col_10 … col_102 fields from
 * parking_master documents in Firestore.
 * Run: node scripts/remove-col-columns.mjs
 */
import { config as loadEnv } from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { readFileSync, existsSync } from "fs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
loadEnv({ path: join(root, ".env.local") });

import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore, FieldValue } from "firebase-admin/firestore";
import { initializeApp as initClientApp } from "firebase/app";
import { getFirestore as getClientFirestore, collection, getDocs, writeBatch, deleteField } from "firebase/firestore";

const COLLECTION = "parking_master";
const BATCH_SIZE = 500;
const COL_PATTERN = /^col_\d+$/;

const SERVICE_ACCOUNT_PATHS = [
  process.env.GOOGLE_APPLICATION_CREDENTIALS,
  join(root, "scripts", "society-parking-serviceAccountKey.json"),
  join(root, "scripts", "serviceAccountKey.json"),
].filter(Boolean);

async function main() {
  let db;
  let useAdmin = false;
  const keyPath = SERVICE_ACCOUNT_PATHS.find((p) => existsSync(p));
  if (keyPath) {
    const serviceAccount = JSON.parse(readFileSync(keyPath, "utf8"));
    initializeApp({ credential: cert(serviceAccount) });
    db = getFirestore();
    useAdmin = true;
  } else {
    const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
    const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
    if (!apiKey || !projectId) {
      console.error("Missing Firebase config. Add .env.local or use a service account key.");
      process.exit(1);
    }
    initClientApp({
      apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
      authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    });
    db = getClientFirestore();
  }

  let snap;
  if (useAdmin) {
    snap = await db.collection(COLLECTION).get();
  } else {
    snap = await getDocs(collection(db, COLLECTION));
  }
  const toUpdate = [];
  for (const d of snap.docs) {
    const data = d.data();
    const colKeys = Object.keys(data).filter((k) => COL_PATTERN.test(k));
    if (colKeys.length === 0) continue;
    toUpdate.push({ ref: d.ref, id: d.id, colKeys });
  }

  console.log("Documents with col_* fields:", toUpdate.length);
  if (toUpdate.length === 0) {
    console.log("Nothing to remove.");
    process.exit(0);
  }

  if (useAdmin) {
    for (let i = 0; i < toUpdate.length; i += BATCH_SIZE) {
      const batch = db.batch();
      const chunk = toUpdate.slice(i, i + BATCH_SIZE);
      for (const { ref, colKeys } of chunk) {
        const updates = {};
        for (const k of colKeys) updates[k] = FieldValue.delete();
        batch.update(ref, updates);
      }
      await batch.commit();
      console.log("  removed col_* from", Math.min(i + BATCH_SIZE, toUpdate.length), "/", toUpdate.length);
    }
  } else {
    for (let i = 0; i < toUpdate.length; i += BATCH_SIZE) {
      const batch = writeBatch(db);
      const chunk = toUpdate.slice(i, i + BATCH_SIZE);
      for (const { ref, colKeys } of chunk) {
        const updates = {};
        for (const k of colKeys) updates[k] = deleteField();
        batch.update(ref, updates);
      }
      await batch.commit();
      console.log("  removed col_* from", Math.min(i + BATCH_SIZE, toUpdate.length), "/", toUpdate.length);
    }
  }
  console.log("Done. col_* fields removed from", toUpdate.length, "documents.");
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
