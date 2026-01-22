# 🚀 Quick Setup Checklist

## Files Modified ✅

- ✅ `firebaseConfig.js` - Added RTDB support
- ✅ `predictionService.ts` - Created NEW service
- ✅ `CameraScreen.tsx` - Integrated prediction save

---

## Step 1: Add to `.env` File

**File location:** `paw-front/.env`

**Add this line:**
```
VITE_FIREBASE_DATABASE_URL=https://final-paw.firebaseio.com
```

**How to find it:**
1. [Firebase Console](https://console.firebase.google.com) → final-paw project
2. Realtime Database → Copy URL from top

---

## Step 2: Restart Dev Server

```powershell
cd C:\Users\panig\OneDrive\Desktop\pythonTest\paw-front
npm run dev
```

---

## Step 3: Test Prediction Flow

1. **Upload a dog image** from CameraScreen
2. **Check browser console (F12)** for logs:
   ```
   ✅ Firestore Write Success
   ✅ Realtime DB Write Success
   ```
3. **Open Firebase Console** → Firestore Database → `predictions` collection
4. **Verify new document** appeared with your prediction data

---

## Debug Logs You'll See

```
User ID = [firebase-uid]
Prediction Result = { predicted_breed, confidence, info, top3 }
✅ Firestore Write Success - Document ID: [docId]
✅ Realtime DB Write Success - Node Path: predictions/[uid]/[predictionId]
```

---

## Data Locations

| Database | Path | Where to Find |
|----------|------|---|
| Firestore | `predictions/{docId}` | Firebase Console → Firestore → predictions |
| RTDB | `predictions/{userId}/{predictionId}` | Firebase Console → Realtime DB → predictions |

---

## What Gets Saved

```javascript
{
  userId: "user-uid",
  imageUrl: "base64-image-data",
  predicted_breed: "Golden Retriever",
  confidence: 92.5,
  info: { nature, diet, healthcare_tips },
  top3: [ {breed, confidence}, ... ],
  timestamp: "ISO-timestamp"
}
```

---

## No Navigation After Prediction

✅ User stays on CameraScreen
✅ Prediction shows in inline result box
✅ No page redirect
✅ Can upload another image

---

## If Something Goes Wrong

| Error | Fix |
|-------|-----|
| `rtdb is undefined` | Restart server after adding `.env` var |
| `Permission denied` | Set Firebase Realtime DB Rules (see docs) |
| `No logs in console` | Make sure you're logged in + check F12 console |
| `Data in Firestore but not RTDB` | Check Realtime Database URL in `.env` |

---

## File Locations

- Config: `paw-front/src/firebaseConfig.js`
- Service: `paw-front/src/services/predictionService.ts`
- UI: `paw-front/src/components/CameraScreen.tsx`
- Docs: `paw-front/FIREBASE_SETUP.md`

---

## Copy-Paste Ready Code Snippets

### Import in any component:
```typescript
import { savePredictionData } from "../services/predictionService";
```

### Call in event handler:
```typescript
savePredictionData(userId, imageData, predictionResult);
```

### Check success:
```typescript
const result = await savePredictionData(userId, imageData, predictionResult);
if (result.success) {
  console.log("Both Firestore and RTDB saved successfully!");
}
```

---

**Questions?** Check `FIREBASE_SETUP.md` for detailed troubleshooting.
