import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import firebaseConfig from "../../firebase-applet-config.json";

// Check if Firebase config is populated and valid
export const isFirebaseConfigured = !!(firebaseConfig && (firebaseConfig as any).apiKey);

let app;
let authInstance: any = null;
let dbInstance: any = null;

if (isFirebaseConfigured) {
  try {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
    authInstance = getAuth(app);
    dbInstance = getFirestore(app, (firebaseConfig as any).firestoreDatabaseId);
    console.log("Firebase initialized successfully with config.");
  } catch (error) {
    console.error("Firebase failed to initialize:", error);
  }
} else {
  console.log("Firebase is not configured yet. Operating in local state fallback mode.");
}

// Export Auth & Firestore safely (with local fallback mock shapes)
export const auth = authInstance || {
  currentUser: {
    uid: "local_user_ceo",
    displayName: "Executive Guest",
    email: "guest@boardmind.ai",
    emailVerified: true
  },
  onAuthStateChanged: (callback: any) => {
    // Mock immediate login for local sandbox
    setTimeout(() => {
      callback({
        uid: "local_user_ceo",
        displayName: "Executive Guest",
        email: "guest@boardmind.ai",
        emailVerified: true
      });
    }, 100);
    return () => {};
  },
  signInWithPopup: async () => {
    return {
      user: {
        uid: "local_user_ceo",
        displayName: "Executive Guest",
        email: "guest@boardmind.ai",
        emailVerified: true
      }
    };
  },
  signOut: async () => {
    return true;
  }
};

export const db = dbInstance;
