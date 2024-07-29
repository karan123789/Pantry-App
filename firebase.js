// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirestore} from 'firebase/firestore'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAWn2WKkLVp3jU7UkKOEAPlCvLlhFsFT5g",
  authDomain: "pantryapp-9b9a8.firebaseapp.com",
  projectId: "pantryapp-9b9a8",
  storageBucket: "pantryapp-9b9a8.appspot.com",
  messagingSenderId: "114946344836",
  appId: "1:114946344836:web:d14cca7aab7384ab0d3fd1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app)
export {app, firestore}
