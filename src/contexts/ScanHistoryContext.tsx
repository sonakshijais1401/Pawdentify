import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { saveScanResult, getUserScanHistory } from '../services/firebaseData';
import { getCurrentUser } from '../services/firebaseAuth';

export interface ScanResult {
  id: string;
  image: string;
  breed: string;
  confidence: number;
  timestamp: Date;
  predictions?: Array<{
    breed: string;
    probability: number;
  }>;
  breedInfo?: {
    description: string;
    temperament: string;
    lifespan: string;
    care: string;
  };
}

interface ScanHistoryContextType {
  scanHistory: ScanResult[];
  addScanResult: (result: Omit<ScanResult, 'id' | 'timestamp'>) => void;
  clearHistory: () => void;
  loading: boolean;
  loadScanHistory: () => void;
}

const ScanHistoryContext = createContext<ScanHistoryContextType | undefined>(undefined);

export function ScanHistoryProvider({ children }: { children: ReactNode }) {
  const [scanHistory, setScanHistory] = useState<ScanResult[]>([]);
  const [loading, setLoading] = useState(false);

  // Load scan history when component mounts
  useEffect(() => {
    loadScanHistory();
  }, []);

  const loadScanHistory = async () => {
    const user = getCurrentUser();
    if (!user) return;

    setLoading(true);
    try {
      const result = await getUserScanHistory(user.uid);
      if (result.success) {
        const formattedScans = result.data.map(scan => ({
          ...scan,
          timestamp: scan.timestamp.toDate ? scan.timestamp.toDate() : new Date(scan.timestamp)
        }));
        setScanHistory(formattedScans);
      }
    } catch (error) {
      console.error('Error loading scan history:', error);
    } finally {
      setLoading(false);
    }
  };

  const addScanResult = async (result: Omit<ScanResult, 'id' | 'timestamp'>) => {
    const newResult: ScanResult = {
      ...result,
      id: Date.now().toString(),
      timestamp: new Date(),
    };
    
    // Add to local state immediately
    setScanHistory(prev => [newResult, ...prev]);
    
    // Save to Firebase
    const user = getCurrentUser();
    if (user) {
      try {
        await saveScanResult(user.uid, newResult);
      } catch (error) {
        console.error('Error saving scan result:', error);
      }
    }
  };

  const clearHistory = () => {
    setScanHistory([]);
  };

  return (
    <ScanHistoryContext.Provider value={{ scanHistory, addScanResult, clearHistory, loading, loadScanHistory }}>
      {children}
    </ScanHistoryContext.Provider>
  );
}

export function useScanHistory() {
  const context = useContext(ScanHistoryContext);
  if (!context) {
    throw new Error('useScanHistory must be used within a ScanHistoryProvider');
  }
  return context;
}