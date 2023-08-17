// Import the functions you need from the SDKs you need
import 'firebase/firestore';
import 'firebase/auth';

import { getAuth } from 'firebase/auth';
import firebase, { firestore } from 'firebase/app';

import { getFirestore } from "firebase/firestore";


// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBSQ_8EO8PFLrZbGJSrIgkHTTSN4yGwzMI",
  authDomain: "educoach-4f143.firebaseapp.com",
  projectId: "educoach-4f143",
  storageBucket: "educoach-4f143.appspot.com",
  messagingSenderId: "561338648704",
  appId: "1:561338648704:web:499c6a80d87a0d8ebbbe65"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig); 
export const db = getFirestore(app);
export const AUTH = getAuth();
