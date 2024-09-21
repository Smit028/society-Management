// lib/firebase.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyALKV9spVHbOvw9smok1I9tGDikusSW48U",
    authDomain: "society-7f38c.firebaseapp.com",
    projectId: "society-7f38c",
    storageBucket: "society-7f38c.appspot.com",
    messagingSenderId: "1044993994166",
    appId: "1:1044993994166:web:ee58e20f3123da8f802517",
    measurementId: "G-CP6PQ0NJC2"
  };
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
