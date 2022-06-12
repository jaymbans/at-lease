import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAye33X921godwdKTzcRrnC6q8WYslcpnc",
  authDomain: "at-ease-at-lease.firebaseapp.com",
  projectId: "at-ease-at-lease",
  storageBucket: "at-ease-at-lease.appspot.com",
  messagingSenderId: "753471926530",
  appId: "1:753471926530:web:974220db9e7fe0bbd7d21b"
};

// Initialize Firebase
initializeApp(firebaseConfig);
export const db = getFirestore();