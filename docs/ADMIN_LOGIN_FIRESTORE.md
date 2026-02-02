# Admin login table in Firestore

Create the admin credentials in Firebase Console so the app can verify login.

## Steps

1. Open **[Firebase Console](https://console.firebase.google.com/)** → your project → **Firestore Database**.
2. Click **Start collection** (or **+ Start collection**).
3. **Collection ID:** type `admincred` → click **Next**.
4. **Document ID:** type `admin` → click **Next**.
5. Add two fields:
   - Field name: `username` | Type: **string** | Value: `admin@society.com`
   - Field name: `password` | Type: **string** | Value: `Pass@123`
6. Click **Save**.

## Result

- Collection: `admincred`
- Document ID: `admin`
- Fields: `username` = `admin@society.com`, `password` = `Pass@123`

The app will read this document when you log in and check the email and password you enter.

## API access

The login API runs on the server and needs a **Firebase service account key** to read Firestore. In `.env.local` set one of:

- `FIREBASE_SERVICE_ACCOUNT_KEY_JSON` = full JSON of the service account key (single line), or  
- `GOOGLE_APPLICATION_CREDENTIALS` = path to the key file (e.g. `scripts/society-parking-serviceAccountKey.json`).

Get the key from Firebase Console → Project settings → Service accounts → **Generate new private key**.
