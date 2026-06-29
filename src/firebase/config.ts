import { initializeApp, getApps, FirebaseApp } from "firebase/app";
import { getFirestore, Firestore } from "firebase/firestore";
import { getAuth, Auth } from "firebase/auth";
import { getStorage, FirebaseStorage } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyApNAm2JL0hYr4JOUk9pFTcd2YFo_tQHqs",
  authDomain: "project-friendai.firebaseapp.com",
  projectId: "project-friendai",
  storageBucket: "project-friendai.firebasestorage.app",
  messagingSenderId: "338304332450",
  appId: "1:338304332450:web:a07aa780f2db37fce51dfb",
  measurementId: "G-WEDVHQJGT5",
};

let app: FirebaseApp | undefined;
let db: Firestore | undefined;
let auth: Auth | undefined;
let storage: FirebaseStorage | undefined;

const hasConfig = true;

if (!getApps().length) {
  app = initializeApp(firebaseConfig);
  db = getFirestore(app);
  auth = getAuth(app);
  storage = getStorage(app);
  getAnalytics(app);
}

export { app, db, auth, storage, hasConfig };
