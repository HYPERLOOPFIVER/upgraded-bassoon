// Importing necessary Firebase services
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";  // Import Firebase Authentication
import { getFirestore } from "firebase/firestore";  // Import Firestore

// Firebase configuration object
const firebaseConfig = {
    apiKey: "AIzaSyBgLeEOLxBUwJBDwXsynTEz0L9YlXHmksw",
    authDomain: "bvm-nehru-house.firebaseapp.com",
    projectId: "bvm-nehru-house",
    storageBucket: "bvm-nehru-house.firebasestorage.app",
    messagingSenderId: "643164493163",
    appId: "1:643164493163:web:717005f30fb4cd0a46282e",
    measurementId: "G-ZDHW5KWMKE"
};

// Initialize Firebase app
const firebaseApp = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and Firestore
const auth = getAuth(firebaseApp);
const db = getFirestore(firebaseApp);

// Exporting Firebase Auth and Firestore for use in other parts of the app
export { auth, db };
export default firebaseApp;
