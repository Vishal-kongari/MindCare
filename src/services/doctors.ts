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

/**
 * Get all counselors (both independent and on‑campus).
 */
export const getDoctors = async (): Promise<DoctorProfile[]> => {
    try {
        const db = await getDb();
        const q = query(
            collection(db, 'users'),
            where('role', 'in', ['counselor', 'on-campus-counselor'])
        );
        const snap = await getDocs(q);
        return snap.docs.map(d => ({ id: d.id, ...(d.data() as Omit<DoctorProfile, 'id'>) }));
    } catch (error) {
        console.error("Error fetching doctors:", error);
        return [];
    }
};

/**
 * Get counselors appropriate for a given student.
 * The student document must contain a `university` field.
 * Returns:
 *   - All independent counselors (no `institution` field)
 *   - On‑campus counselors whose `institution` matches the student's university.
 */
export const getCounselorsForStudent = async (studentUid: string): Promise<DoctorProfile[]> => {
    try {
        const db = await getDb();
        // Fetch the student's university
        const studentSnap = await getDoc(doc(db, 'users', studentUid));
        const studentData = studentSnap.exists() ? (studentSnap.data() as any) : {};
        const studentUniversity = studentData.university || '';

        const q = query(
            collection(db, 'users'),
            where('role', 'in', ['counselor', 'on-campus-counselor'])
        );
        const snap = await getDocs(q);
        const counselors = snap.docs.map(d => ({ id: d.id, ...(d.data() as Omit<DoctorProfile, 'id'>) }));
        // Filter according to institution
        return counselors.filter(c => {
            // Independent counselors have no institution field
            if (!c.institution) return true;
            // On‑campus counselors must match the student's university
            return c.institution === studentUniversity;
        });
    } catch (error) {
        console.error("Error fetching counselors for student:", error);
        return [];
    }
};

/**
 * Get a single doctor by UID.
 */
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
