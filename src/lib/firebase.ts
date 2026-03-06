// Dynamic Firebase initialization to avoid Vite pre-transform errors
// until the firebase package is installed. Uses env vars prefixed with VITE_.

const config = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

let appPromise: Promise<any> | null = null;

export const getFirebaseApp = async () => {
  if (!appPromise) {
    appPromise = (async () => {
      const { initializeApp, getApps } = await import('firebase/app');
      const existing = getApps();
      return existing.length ? existing[0] : initializeApp(config);
    })();
  }
  return appPromise;
};

export const getAuthInstance = async () => {
  const app = await getFirebaseApp();
  const { getAuth, setPersistence, browserLocalPersistence } = await import('firebase/auth');
  const auth = getAuth(app);
  try { await setPersistence(auth, browserLocalPersistence); } catch { }
  return auth;
};

export const getDb = async () => {
  const app = await getFirebaseApp();
  const { getFirestore } = await import('firebase/firestore');
  return getFirestore(app);
};

export const getStorage = async () => {
  const app = await getFirebaseApp();
  const { getStorage } = await import('firebase/storage');
  return getStorage(app);
};


