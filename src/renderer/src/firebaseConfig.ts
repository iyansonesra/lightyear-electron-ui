// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
// import firebase from 'firebase/compat/app';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBYiAKeBJOHE5SOsRoNsGd7yCawX4ElnJ4",
  authDomain: "ly-machine-auth.firebaseapp.com",
  projectId: "ly-machine-auth",
  storageBucket: "ly-machine-auth.appspot.com",
  messagingSenderId: "166289128145",
  appId: "1:166289128145:web:176ada9176c0c9c76f63f0",
  measurementId: "G-N63B7ZY43B"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
