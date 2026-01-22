import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { onAuthChange } from '../services/firebaseAuth';
import { getDogProfile, saveDogProfile, clearDogProfile, DogProfile } from '../services/dogProfileStorage';

interface User {
  uid: string;
  email: string;
  profile?: any;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (user: any) => void;
  logout: () => void;
  updateProfile: (profileData: any) => void;
  dogProfile: DogProfile | null;
  setDogProfile: (p: DogProfile | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [dogProfile, setDogProfile] = useState<DogProfile | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthChange(async (firebaseUser) => {
      if (firebaseUser) {
        // Load dog profile from localStorage (no Firestore for dog profile)
        const stored = getDogProfile();
        setDogProfile(stored);
        setUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email || '',
          profile: stored || null,
        });
        // If no dog profile, push onboarding path so app can respond
        if (!stored) {
          try { window.history.pushState({}, '', '/onboarding'); } catch(e) {}
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const login = (firebaseUser: any) => {
    setUser({
      uid: firebaseUser.uid,
      email: firebaseUser.email || '',
      profile: null
    });
    // load dog profile from localStorage on explicit login
    const stored = getDogProfile();
    setDogProfile(stored);
    if (!stored) {
      try { window.history.pushState({}, '', '/onboarding'); } catch(e) {}
    }
  };

  const logout = () => {
    setUser(null);
    setDogProfile(null);
    try { clearDogProfile(); } catch(e) {}
  };

  const updateProfile = async (profileData: any) => {
    // Save dog profile into local storage and update context (no Firestore)
    try {
      const p: DogProfile = {
        name: profileData.name,
        age: profileData.age,
        birthday: profileData.birthday,
        createdAt: new Date().toISOString(),
      };
      saveDogProfile(p);
      setDogProfile(p);
      setUser(prev => prev ? { ...prev, profile: p } : null);
    } catch (e) {
      // ignore
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, updateProfile, dogProfile, setDogProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}