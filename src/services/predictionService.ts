import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { ref, set } from "firebase/database";
import { db, rtdb } from "../firebaseConfig";

export interface PredictionResult {
  predicted_breed: string;
  confidence: number;
  info?: {
    nature?: string | string[];
    diet?: string;
    healthcare_tips?: string | string[];
  };
  top3?: Array<{ breed: string; confidence: number }>;
  [key: string]: any;
}

export interface SavePredictionPayload {
  userId: string;
  imageUrl: string;
  predictionResult: PredictionResult;
}

/**
 * Save prediction data to both Firestore and Realtime Database
 * @param userId - User's Firebase UID
 * @param imageUrl - Base64 or Firebase Storage URL
 * @param predictionResult - Prediction response from FastAPI
 */
export async function savePredictionData(
  userId: string,
  imageUrl: string,
  predictionResult: PredictionResult
) {
  console.log("=== PREDICTION SERVICE: Starting Save ===");
  console.log("User ID =", userId);
  console.log("Prediction Result =", predictionResult);

  const predictedBreed = predictionResult.predicted_breed || "Unknown";
  const confidence = predictionResult.confidence || 0;
  const timestamp = new Date().toISOString();

  // Final data object
  const predictionData = {
    userId,
    imageUrl,
    predicted_breed: predictedBreed,
    confidence,
    info: predictionResult.info || {},
    top3: predictionResult.top3 || [],
    timestamp,
  };

  let firestoreSuccess = false;
  let rtdbSuccess = false;

  // ===== FIRESTORE SAVE =====
  try {
    const docRef = await addDoc(collection(db, "predictions"), {
      ...predictionData,
      firestoreTimestamp: serverTimestamp(),
    });

    console.log("✅ Firestore Write Success");
    console.log("Document ID:", docRef.id);
    firestoreSuccess = true;
  } catch (error) {
    console.error("❌ Firestore Write Failed:", error);
  }

  // ===== REALTIME DATABASE SAVE =====
  try {
    const predictionId = `prediction_${Date.now()}`;
    const dbRef = ref(rtdb, `predictions/${userId}/${predictionId}`);

    await set(dbRef, {
      ...predictionData,
      rtdbTimestamp: Date.now(), // FIXED
    });

    console.log("✅ Realtime DB Write Success");
    rtdbSuccess = true;
  } catch (error) {
    console.error("❌ Realtime DB Write Failed:", error);
  }

  // ===== SUMMARY =====
  console.log("=== SAVE COMPLETE ===");
  console.log("Firestore:", firestoreSuccess ? "OK" : "FAILED");
  console.log("Realtime DB:", rtdbSuccess ? "OK" : "FAILED");

  return {
    success: firestoreSuccess && rtdbSuccess,
    firestoreSuccess,
    rtdbSuccess,
  };
}
