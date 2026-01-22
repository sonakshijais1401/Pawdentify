import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy 
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "../firebaseConfig";

// User Profile Operations
export const saveUserProfile = async (userId, profileData) => {
  try {
    await setDoc(doc(db, "users", userId), profileData);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const getUserProfile = async (userId) => {
  try {
    const docRef = doc(db, "users", userId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { success: true, data: docSnap.data() };
    } else {
      return { success: false, error: "No profile found" };
    }
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Scan History Operations
export const saveScanResult = async (userId, scanData) => {
  try {
    const docRef = await addDoc(collection(db, "scanHistory"), {
      userId,
      ...scanData,
      timestamp: new Date()
    });
    return { success: true, id: docRef.id };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const getUserScanHistory = async (userId) => {
  try {
    const q = query(
      collection(db, "scanHistory"), 
      where("userId", "==", userId),
      orderBy("timestamp", "desc")
    );
    const querySnapshot = await getDocs(q);
    const scans = [];
    querySnapshot.forEach((doc) => {
      scans.push({ id: doc.id, ...doc.data() });
    });
    return { success: true, data: scans };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Image Upload
export const uploadImage = async (file, path) => {
  try {
    const storageRef = ref(storage, path);
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    return { success: true, url: downloadURL };
  } catch (error) {
    return { success: false, error: error.message };
  }
};