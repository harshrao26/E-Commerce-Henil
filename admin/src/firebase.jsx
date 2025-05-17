// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDgOu03EgxnmjjJ7AwjXyyOkCNoOwaCR_w",
  authDomain: "henilecommerce.firebaseapp.com",
  projectId: "henilecommerce",
  storageBucket: "henilecommerce.firebasestorage.app",
  messagingSenderId: "650483440358",
  appId: "1:650483440358:web:a84e12463d9133855eb927"
};

// Initialize Firebase
export const firebaseApp = initializeApp(firebaseConfig);