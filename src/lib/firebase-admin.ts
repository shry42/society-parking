import { readFileSync, existsSync } from "fs";
import { getApps, initializeApp, cert, type App } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

let adminApp: App | null = null;

function getServiceAccount(): object | null {
  const keyJson = process.env.FIREBASE_SERVICE_ACCOUNT_KEY_JSON;
  if (keyJson) {
    try {
      return JSON.parse(keyJson) as object;
    } catch {
      return null;
    }
  }
  const keyPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
  if (keyPath && existsSync(keyPath)) {
    try {
      return JSON.parse(readFileSync(keyPath, "utf8")) as object;
    } catch {
      return null;
    }
  }
  return null;
}

export function getAdminApp(): App | null {
  if (adminApp) return adminApp;
  const apps = getApps();
  if (apps.length > 0) {
    adminApp = apps[0] as App;
    return adminApp;
  }
  const serviceAccount = getServiceAccount();
  if (!serviceAccount) return null;
  adminApp = initializeApp({ credential: cert(serviceAccount) });
  return adminApp;
}

export function getAdminFirestore() {
  const app = getAdminApp();
  return app ? getFirestore(app) : null;
}
