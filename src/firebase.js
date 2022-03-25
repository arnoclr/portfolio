// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore/lite";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDgti7R6tPmNhjOY4Kp_Qt9CBRAgxTWkKM",
  authDomain: "arno-cellarier.firebaseapp.com",
  projectId: "arno-cellarier",
  storageBucket: "arno-cellarier.appspot.com",
  messagingSenderId: "122339573172",
  appId: "1:122339573172:web:d377c096955a56e642c6e1",
  measurementId: "G-G6TCXRC95X"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const firestore = getFirestore(app);

export { auth, firestore }