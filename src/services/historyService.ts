import { addDoc, collection, query, where, orderBy, getDocs, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebaseConfig';

export interface HistoryRecord {
  id: string;
  userId: string;
  imageUrl: string;
  predictedBreed: string;
  timestamp?: any;
}

export async function saveHistoryItem(userId: string, imageUrl: string, breed: string) {
  try {
    const ref = collection(db, 'history');
    const docRef = await addDoc(ref, {
      userId,
      imageUrl,
      predictedBreed: breed,
      timestamp: serverTimestamp(),
    });
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error('saveHistoryItem error', error);
    return { success: false, error };
  }
}

export async function getHistoryItems(userId: string) : Promise<HistoryRecord[]> {
  try {
    const ref = collection(db, 'history');
    const q = query(ref, where('userId', '==', userId), orderBy('timestamp', 'desc'));
    const snap = await getDocs(q);
    const items: HistoryRecord[] = snap.docs.map(d => ({ id: d.id, ...(d.data() as any) }));
    return items;
  } catch (error) {
    console.error('getHistoryItems error', error);
    return [];
  }
}
