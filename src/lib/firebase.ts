import { initializeApp } from "firebase/app";
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged, User } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import firebaseConfig from "../../firebase-applet-config.json";

// Initialize Firebase App
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// Configure Google Auth Provider
export const provider = new GoogleAuthProvider();
// Add required Workspace scopes for Gmail, picker, Sheets, Calendar, Docs, and Slides
provider.addScope("https://www.googleapis.com/auth/gmail.readonly");
provider.addScope("https://www.googleapis.com/auth/gmail.send");
provider.addScope("https://www.googleapis.com/auth/drive.file");
provider.addScope("https://www.googleapis.com/auth/drive.metadata.readonly");
provider.addScope("https://www.googleapis.com/auth/spreadsheets");
provider.addScope("https://www.googleapis.com/auth/calendar");
provider.addScope("https://www.googleapis.com/auth/documents");
provider.addScope("https://www.googleapis.com/auth/presentations");
provider.addScope("https://www.googleapis.com/auth/tasks");
provider.addScope("https://www.googleapis.com/auth/keep");

// Add newly registered scopes for Chat, Forms, Meet, Contacts, and Classroom
provider.addScope("https://www.googleapis.com/auth/contacts");
provider.addScope("https://www.googleapis.com/auth/chat.spaces");
provider.addScope("https://www.googleapis.com/auth/chat.spaces.readonly");
provider.addScope("https://www.googleapis.com/auth/chat.messages");
provider.addScope("https://www.googleapis.com/auth/forms.body");
provider.addScope("https://www.googleapis.com/auth/forms.responses.readonly");
provider.addScope("https://www.googleapis.com/auth/meetings.space.created");
provider.addScope("https://www.googleapis.com/auth/meetings.space.readonly");
provider.addScope("https://www.googleapis.com/auth/classroom.courses");
provider.addScope("https://www.googleapis.com/auth/classroom.courses.readonly");
provider.addScope("https://www.googleapis.com/auth/classroom.rosters");
provider.addScope("https://www.googleapis.com/auth/classroom.rosters.readonly");

// In-memory token caching to adhere to Workspace security guidelines
let isSigningIn = false;
let cachedAccessToken: string | null = null;

// Initialize auth state listener
export const initAuth = (
  onAuthSuccess?: (user: User, token: string) => void,
  onAuthFailure?: () => void
) => {
  return onAuthStateChanged(auth, async (user: User | null) => {
    if (user) {
      if (cachedAccessToken) {
        if (onAuthSuccess) onAuthSuccess(user, cachedAccessToken);
      } else if (!isSigningIn) {
        // Try to trigger signin or simple failure to prompt manual sign-in button
        cachedAccessToken = null;
        if (onAuthFailure) onAuthFailure();
      }
    } else {
      cachedAccessToken = null;
      if (onAuthFailure) onAuthFailure();
    }
  });
};

// Google Sign-In with popup
export const googleSignIn = async (): Promise<{ user: User; accessToken: string } | null> => {
  try {
    isSigningIn = true;
    const result = await signInWithPopup(auth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    if (!credential?.accessToken) {
      throw new Error("Failed to retrieve standard Google OAuth access token.");
    }
    cachedAccessToken = credential.accessToken;
    return { user: result.user, accessToken: cachedAccessToken };
  } catch (error: any) {
    console.error("Firebase/Google Sign-In Error:", error);
    throw error;
  } finally {
    isSigningIn = false;
  }
};

// Helper to fetch current token
export const getAccessToken = async (): Promise<string | null> => {
  return cachedAccessToken;
};

// Logout handler
export const logout = async () => {
  await auth.signOut();
  cachedAccessToken = null;
};
