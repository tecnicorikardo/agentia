import { initializeApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyCZjXTXdcUtbqn99OhfCexeksK1qLglK6c",
  authDomain: "agentai-5585e.firebaseapp.com",
  projectId: "agentai-5585e",
  storageBucket: "agentai-5585e.firebasestorage.app",
  messagingSenderId: "885503100054",
  appId: "1:885503100054:web:8bdb9aeada295c1b2caeb7",
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };
