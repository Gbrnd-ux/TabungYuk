import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";   // <-- tambah ini

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD-3GPcSvUf59gZRIyt-lRGIffSFIqN4vg",
  authDomain: "tabungyuk-77965.firebaseapp.com",
  projectId: "tabungyuk-77965",
  storageBucket: "tabungyuk-77965.firebasestorage.app",
  messagingSenderId: "435439892344",
  appId: "1:435439892344:web:fcf1e67fada675622e3a8d",
  measurementId: "G-TMKNM2W00M"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);          // <-- export auth
