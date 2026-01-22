export interface DogProfile {
  name: string;
  age: string;
  birthday: string;
  createdAt: string;
}

const KEY = "dogProfile_v1";

export function saveDogProfile(profile: DogProfile) {
  localStorage.setItem(KEY, JSON.stringify(profile));
}

export function getDogProfile(): DogProfile | null {
  try {
    const data = localStorage.getItem(KEY);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
}

export function clearDogProfile() {
  localStorage.removeItem(KEY);
}
