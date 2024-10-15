// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCrUa_pqtiOYQG3BG08x_PWhfbcaewcwc4",
    authDomain: "todoapp-6495f.firebaseapp.com",
    projectId: "todoapp-6495f",
    storageBucket: "todoapp-6495f.appspot.com",
    messagingSenderId: "486470252052",
    appId: "1:486470252052:web:d8f03c71230ca38bca5901"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };