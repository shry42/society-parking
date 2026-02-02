/**
 * Upload "Parking Final 29012026.xlsx" to Firebase Firestore (Society-parking).
 * Run from project root: npm run upload-excel
 * Connects via .env.local (NEXT_PUBLIC_FIREBASE_*) or a service account key file.
 */
import { config as loadEnv } from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { readFileSync, existsSync } from "fs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
loadEnv({ path: join(root, ".env.local") });

import XLSX from "xlsx";
import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore as getAdminFirestore } from "firebase-admin/firestore";
import { initializeApp as initClientApp } from "firebase/app";
import { getFirestore as getClientFirestore, collection, doc, writeBatch } from "firebase/firestore";

const EXCEL_FILE = "Parking Final 29012026.xlsx";
const COLLECTION = "parking_master";
const READ_RANGE = "A1:CY5000";
const BATCH_SIZE = 500;
const DRY_RUN = process.env.DRY_RUN === "1" || process.argv.includes("--dry-run");

const SERVICE_ACCOUNT_PATHS = [
  process.env.GOOGLE_APPLICATION_CREDENTIALS,
  join(root, "scripts", "society-parking-serviceAccountKey.json"),
  join(root, "scripts", "serviceAccountKey.json"),
].filter(Boolean);

function normalizeKey(header, index) {
  const s = header != null ? String(header).trim() : "";
  if (s === "") return `col_${index}`;
  return s
    .replace(/[\s'()\/\-]+/g, " ")
    .trim()
    .split(" ")
    .map((w, i) => (i === 0 ? w.toLowerCase() : w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()))
    .join("")
    .replace(/[^a-zA-Z0-9]/g, "") || `col_${index}`;
}

function cellToFirestoreValue(val) {
  if (val === undefined || val === null) return null;
  if (typeof val === "number" && !Number.isNaN(val)) return val;
  if (typeof val === "boolean") return val;
  const s = String(val).trim();
  return s === "" ? null : s;
}

function safeKey(key) {
  if (!key || typeof key !== "string") return "col_unknown";
  const k = key.replace(/[^a-zA-Z0-9_]/g, "_").slice(0, 150);
  return k || "col_unknown";
}

async function main() {
  let db = null;
  let useClientSdk = false;
  if (!DRY_RUN) {
    const keyPath = SERVICE_ACCOUNT_PATHS.find((p) => existsSync(p));
    if (keyPath) {
      const serviceAccount = JSON.parse(readFileSync(keyPath, "utf8"));
      initializeApp({ credential: cert(serviceAccount) });
      db = getAdminFirestore();
    } else {
      const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
      const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
      if (!apiKey || !projectId) {
        console.error("Firebase config missing. Add .env.local with NEXT_PUBLIC_FIREBASE_* or use a service account key.");
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
      useClientSdk = true;
    }
  }

  const filePath = join(root, EXCEL_FILE);
  console.log("Reading", filePath, "...");
  const workbook = XLSX.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];

  const raw = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: "", range: READ_RANGE });
  const headers = raw[0];
  const keyForIndex = [];
  const seen = new Set();
  for (let i = 0; i < headers.length; i++) {
    let k = normalizeKey(headers[i], i);
    if (seen.has(k)) k = `${k}_${i}`;
    seen.add(k);
    keyForIndex.push(k);
  }

  const dataRows = raw.slice(1).filter((row) => {
    const flatVal = row[1];
    return flatVal != null && String(flatVal).trim() !== "";
  });

  console.log("Sheet:", sheetName, "| Headers:", headers.length, "| Data rows:", dataRows.length);

  const docs = dataRows.map((row, rowIndex) => {
    const obj = {
      _source: EXCEL_FILE,
      _sheet: sheetName,
      _rowIndex: rowIndex + 1,
    };
    for (let i = 0; i < Math.max(row.length, keyForIndex.length); i++) {
      const header = headers[i];
      if (header == null || String(header).trim() === "") continue;
      const key = safeKey(keyForIndex[i]);
      const val = i < row.length ? cellToFirestoreValue(row[i]) : null;
      obj[key] = val;
    }
    return obj;
  });

  if (DRY_RUN) {
    console.log("Would upload", docs.length, "documents to Firestore collection:", COLLECTION);
    console.log("Sample doc keys (first row):", Object.keys(docs[0] || {}).slice(0, 20));
    process.exit(0);
  }

  console.log("Uploading", docs.length, "documents to Firestore collection:", COLLECTION);
  let written = 0;
  if (useClientSdk) {
    const colRef = collection(db, COLLECTION);
    for (let i = 0; i < docs.length; i += BATCH_SIZE) {
      const batch = writeBatch(db);
      const chunk = docs.slice(i, i + BATCH_SIZE);
      for (const d of chunk) {
        const { _rowIndex, ...rest } = d;
        const ref = doc(colRef);
        batch.set(ref, { _rowIndex, ...rest });
      }
      await batch.commit();
      written += chunk.length;
      console.log("  committed", written, "/", docs.length);
    }
  } else {
    const colRef = db.collection(COLLECTION);
    for (let i = 0; i < docs.length; i += BATCH_SIZE) {
      const batch = db.batch();
      const chunk = docs.slice(i, i + BATCH_SIZE);
      for (const d of chunk) {
        const { _rowIndex, ...rest } = d;
        const ref = colRef.doc();
        batch.set(ref, { _rowIndex, ...rest });
      }
      await batch.commit();
      written += chunk.length;
      console.log("  committed", written, "/", docs.length);
    }
  }
  console.log("Done. Total documents written:", written);
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
