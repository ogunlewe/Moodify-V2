import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBw1pZXA0nm-OEucknTcqiQCHa2wzFgkZ4",
  authDomain: "moodapp-5880e.firebaseapp.com",
  projectId: "moodapp-5880e",
  storageBucket: "moodapp-5880e.firebasestorage.app",
  messagingSenderId: "1004337981527",
  appId: "1:1004337981527:web:b8c6c9ae20d6e2de9a1b12"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage };