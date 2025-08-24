// Import the functions you need from the SDKs you need
import { initializeApp, getApp, getApps } from "firebase/app";
import { getAuth} from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyCEZRa5e73W524P9qmrU-3b6C8Z2AauwRI",
    authDomain: "preply-28e8a.firebaseapp.com",
    projectId: "preply-28e8a",
    storageBucket: "preply-28e8a.firebasestorage.app",
    messagingSenderId: "821673229907",
    appId: "1:821673229907:web:c3f5366f2d771744fad0a6",
    measurementId: "G-HH9CLZFS9F"
};

// Initialize Firebase
const app = !getApps.length ? initializeApp(firebaseConfig) :getApp();

export const auth = getAuth(app);
export const db = getFirestore(app);