//File: lib/authHook/firebase
//Initialise firebase app
import { initializeApp } from "firebase/app";
import { getMessaging } from "firebase/messaging";

export const firebaseConfig = {
  apiKey: "AIzaSyAdeKbaD7nMY6ZXFTkpX6A031fFo2KTn84",
  authDomain: "atlantic-cd3f8.firebaseapp.com",
  //   databaseURL: "https://DATABASE_NAME.firebaseio.com",
  projectId: "atlantic-cd3f8",
  storageBucket: "atlantic-cd3f8.firebasestorage.app",
  messagingSenderId: "331934693621",
  appId: "1:331934693621:web:68f328a02d1dd04406edbc",
  measurementId: "G-3MSB7VB8NS",
};

const firebaseApp = initializeApp(firebaseConfig);

export default firebaseApp;