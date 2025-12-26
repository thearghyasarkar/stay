import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User
} from 'firebase/auth';
import { 
  getFirestore, 
  collection, 
  addDoc, 
  query, 
  where, 
  onSnapshot,
  updateDoc,
  doc,
  deleteDoc,
  setDoc,
  getDoc,
  orderBy,
  serverTimestamp
} from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PID,
  storageBucket: process.env.FIREBASE_SB,
  messagingSenderId: process.env.FIREBASE_MSI ,
  appId: process.env.FIREBASE_APPID,
  measurementId: process.env.FIREBASE_MS1
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { 
  auth, 
  db, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  collection,
  addDoc,
  query,
  where,
  onSnapshot,
  updateDoc,
  doc,
  deleteDoc,
  setDoc,
  getDoc,
  orderBy,
  serverTimestamp
};
export type { User };