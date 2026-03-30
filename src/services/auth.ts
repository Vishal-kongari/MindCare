import { getAuthInstance, getDb } from "@/lib/firebase";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";

export type AppRole = 'student' | 'counselor' | 'on-campus-counselor';

export interface AppUser {
  id: string;
  email: string;
  role: AppRole;
  name: string;
}

export const fetchRole = async (uid: string): Promise<{ role: AppRole, name: string }> => {
  const db = await getDb();
  const snap = await getDoc(doc(db, 'users', uid));
  if (snap.exists()) {
    const data = snap.data();
    return {
      role: (data.role as AppRole) || 'student',
      name: data.name || ''
    };
  }
  return { role: 'student', name: '' };
};

export const ensureProfile = async (uid: string, email: string, role: AppRole, name: string, phoneNumber?: string, university?: string, department?: string, additionalData?: any) => {
  const db = await getDb();
  const profileData: any = { email, role, name, ...additionalData };
  Object.keys(profileData).forEach(key => profileData[key] === undefined && delete profileData[key]);
  if (phoneNumber) {
    profileData.phoneNumber = phoneNumber;
  }
  if (university) {
    profileData.university = university;
  }
  if (department) {
    profileData.department = department;
  }
  await setDoc(doc(db, 'users', uid), profileData, { merge: true });
};

export const signInEmail = async (email: string, password: string): Promise<AppUser> => {
  const auth = await getAuthInstance();
  const cred = await signInWithEmailAndPassword(auth, email, password);
  const { role, name } = await fetchRole(cred.user.uid);
  const finalName = name || (cred.user.email || email).split('@')[0];
  return { id: cred.user.uid, email: cred.user.email || email, role, name: finalName };
};

export const signUpEmail = async (email: string, password: string, role: AppRole, displayName?: string, phoneNumber?: string, university?: string, department?: string, additionalData?: any): Promise<AppUser> => {
  try {
    const auth = await getAuthInstance();
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    const name = (displayName && displayName.trim()) ? displayName.trim() : email.split('@')[0];
    await ensureProfile(cred.user.uid, email, role, name, phoneNumber, university, department, additionalData);
    return { id: cred.user.uid, email, role, name };
  } catch (error: any) {
    console.error("SignUp Error Details:", error);
    throw error;
  }
};

export const signOutUser = async () => {
  const auth = await getAuthInstance();
  await signOut(auth);
};

export const listenAuth = (cb: (user: AppUser | null) => void) => {
  getAuthInstance().then((auth) => {
    onAuthStateChanged(auth, async (u) => {
      if (!u) return cb(null);
      const { role, name: firestoreName } = await fetchRole(u.uid);
      const email = u.email || '';
      const name = firestoreName || email.split('@')[0];
      // Sync local storage
      const { setName, setRole } = await import("@/lib/auth");
      setName(name);
      setRole(role);

      cb({ id: u.uid, email, role, name });
    });
  });
};


