/**
 * Create Firestore collection "admincred" with document "admin" (username + password).
 * Run once from project root: npm run create-admincred
 * Needs: service account key file in scripts/ or GOOGLE_APPLICATION_CREDENTIALS.
 */
import { config as loadEnv } from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { readFileSync, existsSync } from "fs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
loadEnv({ path: join(root, ".env.local") });

import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

const COLLECTION = "admincred";
const DOC_ID = "admin";
const USERNAME = "admin@society.com";
const PASSWORD = "Pass@123";

const SERVICE_ACCOUNT_PATHS = [
  process.env.GOOGLE_APPLICATION_CREDENTIALS,
  join(root, "scripts", "society-parking-serviceAccountKey.json"),
  join(root, "scripts", "serviceAccountKey.json"),
].filter(Boolean);

// Also support JSON in env (for CI or when key file is not used)
function getServiceAccount() {
  const keyPath = SERVICE_ACCOUNT_PATHS.find((p) => existsSync(p));
  if (keyPath) {
    return JSON.parse(readFileSync(keyPath, "utf8"));
  }
  const keyJson = process.env.FIREBASE_SERVICE_ACCOUNT_KEY_JSON;
  if (keyJson) {
    return JSON.parse(keyJson);
  }
  return null;
}

async function main() {
  const serviceAccount = getServiceAccount();
  if (!serviceAccount) {
    console.error("No service account key found.");
    console.error("Set GOOGLE_APPLICATION_CREDENTIALS or add scripts/society-parking-serviceAccountKey.json");
    console.error("Or set FIREBASE_SERVICE_ACCOUNT_KEY_JSON in .env.local");
    process.exit(1);
  }

  initializeApp({ credential: cert(serviceAccount) });
  const db = getFirestore();

  await db.collection(COLLECTION).doc(DOC_ID).set({
    username: USERNAME,
    password: PASSWORD,
  });

  console.log("Done. Created Firestore:");
  console.log("  Collection:", COLLECTION);
  console.log("  Document:", DOC_ID);
  console.log("  username:", USERNAME);
  console.log("  password:", PASSWORD);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
