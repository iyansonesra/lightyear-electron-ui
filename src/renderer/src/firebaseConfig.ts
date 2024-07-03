// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBcQxp6cQJlEDpXRKH4552YTeOt2RTkZEM",
  authDomain: "lightyear-app-login.firebaseapp.com",
  projectId: "lightyear-app-login",
  storageBucket: "lightyear-app-login.appspot.com",
  messagingSenderId: "319238927043",
  appId: "1:319238927043:web:4e775bf078486843e5a876",
  measurementId: "G-GN3X0164YV"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
