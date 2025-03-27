// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAOV1M9LdmK67O2xR5J1yqM8Bb84oFK11M",
  authDomain: "todo-8b5d9.firebaseapp.com",
  projectId: "todo-8b5d9",
  storageBucket: "todo-8b5d9.firebasestorage.app",
  messagingSenderId: "425301474494",
  appId: "1:425301474494:web:e6d554ada4f291644372ef",
  measurementId: "G-RHZYZXR2W2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

const db = getFirestore(app);

export { db };