// firebaseConfig.js
import { initializeApp } from 'firebase/app';
// import { getAuth } from 'firebase/auth'; // if you use authentication
// import { getFirestore } from 'firebase/firestore'; // already imported in DoctorScreen.js

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDriBSnhQUYTwqNTDkJdnUPGonVCxQTrH4",
  authDomain: "lungguard-app-95885.firebaseapp.com",
  projectId: "lungguard-app-95885",
  storageBucket: "lungguard-app-95885.firebasestorage.app",
  messagingSenderId: "704129147431",
  appId: "1:704129147431:web:9bca1d6f84411ad9dc6402",
  measurementId: "G-YEZ7ZGYM74"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const auth = getAuth(app); // if you use authentication
// const db = getFirestore(app); // No need to export from here if importing `app` in DoctorScreen

export { app }; // Export the initialized app
// export { auth, db }; // Export other services if needed globally