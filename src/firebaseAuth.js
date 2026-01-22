// firebaseAuth.js
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut
} from "firebase/auth";

import app from "./firebaseConfig";

const auth = getAuth(app);

// LOGIN
export const loginUser = (email, password) => {
  return signInWithEmailAndPassword(auth, email, password);
};

// REGISTER
export const registerUser = (email, password) => {
  return createUserWithEmailAndPassword(auth, email, password);
};

// LOGOUT
export const logoutUser = () => {
  return signOut(auth);
};

export default auth;
