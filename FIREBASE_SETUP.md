# Firebase Setup & Prediction Service Guide

## Project Structure Overview

```
src/
├── firebaseConfig.js           ✅ [Firestore + Realtime DB Config]
├── services/
│   ├── predictionService.ts    ✅ [Saves to Firestore + RTDB]
│   ├── historyService.ts       ✅ [Legacy history collection]
│   └── firebaseData.js         [Other Firebase operations]
├── components/
│   └── CameraScreen.tsx        ✅ [Calls predictionService after prediction]
└── contexts/
    ├── AuthContext.tsx         [Provides user info]
    └── ScanHistoryContext.tsx  [Local state management]
```

---

## Files & Their Responsibilities

### 1. **firebaseConfig.js** - Initialization Hub
- ✅ Initializes Firebase app
- ✅ Exports Firestore (`db`)
- ✅ Exports Realtime Database (`rtdb`)
- ✅ Exports Storage (`storage`)
- ✅ Exports Auth (`auth`)
- **Key addition**: `getDatabase()` import + `rtdb` export

### 2. **predictionService.ts** - Data Persistence Layer
- Saves prediction data to **Firestore** collection: `predictions`
- Saves prediction data to **Realtime DB** node: `predictions/{userId}/{predictionId}`
- Includes comprehensive console logging for debugging
- **Entry point**: `savePredictionData(userId, imageUrl, predictionResult)`

### 3. **CameraScreen.tsx** - Prediction Trigger
- Calls FastAPI endpoint at `http://127.0.0.1:8000/predict/`
- On successful prediction:
  - Sets `predictionData` state (displays result on screen)
  - Calls `savePredictionData()` to save data
  - **NO navigation** - user stays on CameraScreen
- Shows prediction inline in `{predictionData && (...)}` block

---

## Setup Instructions

### Step 1: Update `.env` File
Add the Realtime Database URL to your `.env`:

```dotenv
VITE_FIREBASE_API_KEY=AIzaSyAg4G9kgye6Q7JEX7wFOqseqqzcXrBisLc
VITE_FIREBASE_AUTH_DOMAIN=final-paw.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=final-paw
VITE_FIREBASE_STORAGE_BUCKET=final-paw.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=959932830494
VITE_FIREBASE_APP_ID=1:959932830494:web:b0864c300046ad5faf6f0f
VITE_FIREBASE_MEASUREMENT_ID=G-6YJ28Z9F9L
VITE_FIREBASE_DATABASE_URL=https://final-paw.firebaseio.com
```

**To find your database URL:**
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project: `final-paw`
3. Go to **Realtime Database**
4. Copy the URL from the top (usually `https://[project-name].firebaseio.com`)

### Step 2: Files Already Updated ✅
- ✅ `firebaseConfig.js` - Added RTDB
- ✅ `predictionService.ts` - Created (NEW FILE)
- ✅ `CameraScreen.tsx` - Updated to call predictionService

### Step 3: Verify Imports
Check that these imports exist in each file:

**firebaseConfig.js:**
```javascript
import { getDatabase } from "firebase/database";
export const rtdb = getDatabase(app);
```

**predictionService.ts:**
```typescript
import { ref, set, serverTimestamp as rtdbTimestamp } from "firebase/database";
import { db, rtdb } from "../firebaseConfig";
```

**CameraScreen.tsx:**
```typescript
import { savePredictionData } from "../services/predictionService";
```

---

## Data Flow Diagram

```
User uploads image
        ↓
CameraScreen.tsx (handleFileSelect)
        ↓
classifyDog(file) → FastAPI /predict/
        ↓
predictionResult received
        ↓
setPredictionData(prediction) [Shows result on screen]
        ↓
savePredictionData(userId, imageUrl, prediction) [Non-blocking]
        ├→ Firestore: /predictions/{docId}
        ├→ RTDB: /predictions/{userId}/{predictionId}
        └→ Console logs all debug info
        ↓
User sees prediction on same screen (NO navigation)
```

---

## What Gets Saved

### Firestore Collection: `predictions`
```javascript
{
  userId: "user123",
  imageUrl: "data:image/jpeg;base64,...",
  predicted_breed: "Golden Retriever",
  confidence: 92.5,
  info: {
    nature: ["Friendly", "Intelligent"],
    diet: "High-quality dog food",
    healthcare_tips: "Regular exercise required"
  },
  top3: [
    { breed: "Golden Retriever", confidence: 92.5 },
    { breed: "Labrador", confidence: 5.2 },
    { breed: "Light Retriever", confidence: 2.3 }
  ],
  timestamp: "2025-11-25T10:30:45.123Z",
  firestoreTimestamp: <Firestore server timestamp>
}
```

### Realtime Database Node: `predictions/{userId}/{predictionId}`
```json
{
  "userId": "user123",
  "imageUrl": "data:image/jpeg;base64,...",
  "predicted_breed": "Golden Retriever",
  "confidence": 92.5,
  "info": { ... },
  "top3": [ ... ],
  "timestamp": "2025-11-25T10:30:45.123Z",
  "rtdbTimestamp": 1700902245123
}
```

---

## Testing & Debugging

### Browser Console Output
When a prediction is made, you'll see:

```
=== PREDICTION SERVICE: Starting Save ===
User ID = ePbD8YvXwLqZ5vV8vJ7Y9rP2kJ4
Prediction Result = {
  predicted_breed: "Golden Retriever",
  confidence: 92.5,
  info: {...},
  top3: [...]
}
✅ Firestore Write Success
   Document ID: 9KzL8mNoPq1Rs2Tu3Vw4
   Collection: predictions
✅ Realtime DB Write Success
   Node Path: predictions/ePbD8YvXwLqZ5vV8vJ7Y9rP2kJ4/prediction_1700902245123
=== PREDICTION SERVICE: Save Complete ===
Firestore: ✅ Success
Realtime DB: ✅ Success
=====================================
```

### Step 1: Verify Firestore Data
1. Open [Firebase Console](https://console.firebase.google.com)
2. Go to your project: `final-paw`
3. Navigate to **Firestore Database**
4. Check collection: `predictions`
5. You should see a new document with the prediction data
6. Click on the document to verify all fields are saved

### Step 2: Verify Realtime Database Data
1. In Firebase Console, go to **Realtime Database**
2. Navigate to: `predictions` → `{userId}` → `prediction_*`
3. Verify the data matches what's in Firestore

### Step 3: Manual Test
1. Run the frontend: `npm run dev`
2. Upload a dog image from CameraScreen
3. Check browser console for the logs above
4. Open Firebase Console and verify data appears in both Firestore and RTDB
5. Confirm no page navigation happens (you stay on CameraScreen)

---

## Troubleshooting

### ❌ "RTDB is undefined"
- Make sure you added `VITE_FIREBASE_DATABASE_URL` to `.env`
- Verify `firebaseConfig.js` exports `rtdb`
- Restart the dev server after `.env` changes

### ❌ "Permission denied" error
- Go to Firebase Console → Realtime Database → Rules
- Set rules to (for testing):
```json
{
  "rules": {
    ".read": "auth != null",
    ".write": "auth != null"
  }
}
```
- For production, implement proper security rules

### ❌ No console logs appear
- Make sure you're authenticated (user is logged in)
- Check browser console (F12 → Console tab)
- Verify `predictionService` is being imported in CameraScreen
- Check that FastAPI endpoint returns valid prediction

### ❌ Data appears in Firestore but not RTDB (or vice versa)
- Check error message in console
- Verify database URL is correct in `.env`
- Ensure Firebase Realtime Database is enabled in Firebase Console
- Check Security Rules allow writes for authenticated users

---

## Code Locations Reference

| Task | File | Line/Section |
|------|------|---|
| Firebase init | `firebaseConfig.js` | Lines 1-23 |
| RTDB export | `firebaseConfig.js` | Line 22 |
| Prediction save logic | `predictionService.ts` | Lines 24-90 |
| Prediction call in UI | `CameraScreen.tsx` | Line 74-84 |
| User auth check | `CameraScreen.tsx` | Line 79 |
| Show prediction UI | `CameraScreen.tsx` | Lines 290-310 |

---

## Environment Variables Checklist

```
✅ VITE_FIREBASE_API_KEY
✅ VITE_FIREBASE_AUTH_DOMAIN
✅ VITE_FIREBASE_PROJECT_ID
✅ VITE_FIREBASE_STORAGE_BUCKET
✅ VITE_FIREBASE_MESSAGING_SENDER_ID
✅ VITE_FIREBASE_APP_ID
✅ VITE_FIREBASE_MEASUREMENT_ID
✅ VITE_FIREBASE_DATABASE_URL (NEW - Required for RTDB)
```

All values found in: [Firebase Console](https://console.firebase.google.com) → Project Settings → Your apps

---

## Next Steps

1. ✅ Update `.env` with `VITE_FIREBASE_DATABASE_URL`
2. ✅ Verify `firebaseConfig.js` has RTDB initialization
3. ✅ Ensure `predictionService.ts` exists with full content
4. ✅ Check `CameraScreen.tsx` imports `savePredictionData`
5. 🔄 Restart dev server: `npm run dev`
6. 🔄 Test by uploading an image
7. 🔄 Check Firebase Console for data

---

## Performance Notes

- All database saves are **non-blocking** (wrapped in `.catch()`)
- User sees prediction result immediately (no wait for database)
- Console logs help identify any save failures
- Both Firestore and RTDB save simultaneously for redundancy

---

**Last Updated:** November 25, 2025
**Status:** ✅ Ready for Testing
