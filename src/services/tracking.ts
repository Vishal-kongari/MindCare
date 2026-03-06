import { getAuthInstance, getDb } from "@/lib/firebase";
import {
    doc,
    getDoc,
    setDoc,
    updateDoc,
    serverTimestamp,
    arrayUnion,
    increment,
    onSnapshot
} from "firebase/firestore";

export interface UserTracking {
    userId: string;
    moodHistory: { date: string; mood: 'good' | 'okay' | 'stressed' }[];
    weeklyGoals: {
        mindfulness: { current: number; target: number };
        checkins: { current: number; target: number };
        peerSupport: { current: number; target: number };
    };
    habits: {
        meditation: { current: number; target: number };
        journal: { current: number; target: number };
    };
    progressScore: number;
    streak: number;
    lastActive: any;
    lastUpdated: any;
}

const DEFAULT_TRACKING: Omit<UserTracking, 'userId'> = {
    moodHistory: [],
    weeklyGoals: {
        mindfulness: { current: 0, target: 5 },
        checkins: { current: 0, target: 7 },
        peerSupport: { current: 0, target: 3 },
    },
    habits: {
        meditation: { current: 0, target: 7 },
        journal: { current: 0, target: 7 },
    },
    progressScore: 0,
    streak: 0,
    lastActive: serverTimestamp(),
    lastUpdated: serverTimestamp()
};

/**
 * Initializes tracking for a user if it doesn't exist, and handles daily streak logic.
 */
export const initializeOrGetTracking = async (userId: string): Promise<UserTracking> => {
    const db = await getDb();
    const docRef = doc(db, 'tracking', userId);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
        // Create new tracking document
        const newTracking = { ...DEFAULT_TRACKING, userId };
        await setDoc(docRef, newTracking);
        return newTracking as UserTracking;
    }

    const data = docSnap.data() as UserTracking;

    // Basic streak logic (checks if last active was yesterday)
    // Note: For a production app, checking by precise local date strings is more reliable
    const lastActiveDate = data.lastActive?.toDate?.() || new Date();
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - lastActiveDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    let newStreak = data.streak || 0;

    if (diffDays === 1) {
        // Kept streak alive
        newStreak += 1;
        await updateDoc(docRef, {
            streak: newStreak,
            lastActive: serverTimestamp()
        });
    } else if (diffDays > 1) {
        // Lost streak
        newStreak = 1;
        await updateDoc(docRef, {
            streak: newStreak,
            lastActive: serverTimestamp()
        });
    }

    return { ...data, streak: newStreak };
};

/**
 * Listens to realtime updates for a user's tracking document
 */
export const listenToTracking = async (
    userId: string,
    cb: (data: UserTracking | null) => void
): Promise<() => void> => {
    try {
        const db = await getDb();

        // Ensure it's initialized first
        await initializeOrGetTracking(userId);

        const docRef = doc(db, 'tracking', userId);

        return onSnapshot(docRef, (doc) => {
            if (doc.exists()) {
                cb(doc.data() as UserTracking);
            } else {
                cb(null);
            }
        }, (error) => {
            console.error("Error listening to tracking data:", error);
            cb(null);
        });

    } catch (error) {
        console.error("Failed to setup tracking listener:", error);
        cb(null);
        return () => { };
    }
};

/**
 * Logs a new mood for today
 */
export const logMood = async (userId: string, mood: 'good' | 'okay' | 'stressed') => {
    const db = await getDb();
    const docRef = doc(db, 'tracking', userId);

    await updateDoc(docRef, {
        moodHistory: arrayUnion({
            date: new Date().toISOString(),
            mood
        }),
        progressScore: increment(5), // Reward 5 points for checking in
        lastUpdated: serverTimestamp()
    });
};

/**
 * Increments a specific weekly goal
 */
export const incrementWeeklyGoal = async (
    userId: string,
    goalType: 'mindfulness' | 'checkins' | 'peerSupport'
) => {
    const db = await getDb();
    const docRef = doc(db, 'tracking', userId);

    await updateDoc(docRef, {
        [`weeklyGoals.${goalType}.current`]: increment(1),
        progressScore: increment(10), // Reward 10 points for a goal
        lastUpdated: serverTimestamp()
    });
};

/**
 * Increments a specific habit
 */
export const incrementHabit = async (
    userId: string,
    habitType: 'meditation' | 'journal'
) => {
    const db = await getDb();
    const docRef = doc(db, 'tracking', userId);

    await updateDoc(docRef, {
        [`habits.${habitType}.current`]: increment(1),
        progressScore: increment(10), // Reward 10 points for a habit
        lastUpdated: serverTimestamp()
    });
};
