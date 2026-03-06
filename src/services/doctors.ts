
import { getDb } from "@/lib/firebase";
import { collection, doc, getDoc, getDocs, query, where } from "firebase/firestore";

export interface DoctorProfile {
    id: string;
    name: string;
    role: 'counselor' | 'on-campus-counselor';
    specialization?: string;
    bio?: string;
    availability?: string;
    email?: string;
    phoneNumber?: string;
    institution?: string; // For on-campus counselors
}

export const getDoctors = async (): Promise<DoctorProfile[]> => {
    try {
        const db = await getDb();
        const q = query(
            collection(db, 'users'),
            where('role', 'in', ['counselor', 'on-campus-counselor'])
        );
        const snap = await getDocs(q);
        return snap.docs.map(d => ({
            id: d.id,
            ...(d.data() as Omit<DoctorProfile, 'id'>)
        }));
    } catch (error) {
        console.error("Error fetching doctors:", error);
        return [];
    }
};

export const getDoctorById = async (id: string): Promise<DoctorProfile | null> => {
    try {
        const db = await getDb();
        const snap = await getDoc(doc(db, 'users', id));
        if (snap.exists()) {
            return { id: snap.id, ...snap.data() } as DoctorProfile;
        }
        return null;
    } catch (error) {
        console.error("Error fetching doctor details:", error);
        return null;
    }
};
