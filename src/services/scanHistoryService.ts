// Persistent scan history service using localStorage
// Stores identified dog breeds with images, confidence, and timestamps
// User-specific: each userId has isolated scan history

export interface ScanHistoryEntry {
  id: string;
  image: string; // data URL
  predictedBreed: string;
  confidence: number | null;
  timestamp: string; // ISO 8601 format
  userId: string; // User ID for isolating history per user
}

const STORAGE_KEY = 'paw_scanHistory_v1';

/**
 * Get all scan history entries for a specific user from localStorage (newest first)
 */
export function getScanHistory(userId: string): ScanHistoryEntry[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    const parsed = JSON.parse(stored);
    if (!Array.isArray(parsed)) return [];
    // Filter to only return entries for this userId
    return parsed.filter((entry: ScanHistoryEntry) => entry.userId === userId);
  } catch (err) {
    console.error('Error reading scan history from localStorage', err);
    return [];
  }
}

/**
 * Add a new scan entry to the history for a specific user (prepends to array, newest first)
 */
export function addScanHistory(
  entry: Omit<ScanHistoryEntry, 'id' | 'timestamp' | 'userId'>,
  userId: string
): ScanHistoryEntry {
  try {
    // Get all history (across all users) so we preserve other users' data
    const allHistory: ScanHistoryEntry[] = [];
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          allHistory.push(...parsed);
        }
      }
    } catch (e) {
      // ignore parse errors
    }

    const newEntry: ScanHistoryEntry = {
      ...entry,
      id: generateId(),
      timestamp: new Date().toISOString(),
      userId,
    };

    // Prepend new entry (newest first)
    const updated = [newEntry, ...allHistory];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

    return newEntry;
  } catch (err) {
    console.error('Error saving scan to history', err);
    throw err;
  }
}

/**
 * Clear scan history for a specific user (preserves other users' history)
 */
export function clearScanHistory(userId: string): void {
  try {
    // Get all history and filter out entries for this userId
    const allHistory: ScanHistoryEntry[] = [];
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          allHistory.push(...parsed);
        }
      }
    } catch (e) {
      // ignore parse errors
    }

    // Keep only entries from other users
    const filtered = allHistory.filter((entry: ScanHistoryEntry) => entry.userId !== userId);

    if (filtered.length === 0) {
      localStorage.removeItem(STORAGE_KEY);
    } else {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    }
  } catch (err) {
    console.error('Error clearing scan history', err);
  }
}

// Backwards-compatible alias requested: export as `saveScanHistory`
export const saveScanHistory = addScanHistory;

/**
 * Generate a unique ID for each scan
 */
function generateId(): string {
  return `scan_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}
