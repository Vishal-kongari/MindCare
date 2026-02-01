
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Direct config to avoid import issues in script execution context if needed, 
// but since we are running in the browser context via 'npm run dev' we can't easily validly run this as a node script 
// without the proper environment. 
// Instead, I will create a component I can inject or just use the existing 'debugCounselorBookings' which seemingly wasn't run or didn't output what we wanted?
// Actually, I'll modify `bookings.ts` to include a `debugGlobalBookings` function that I can trigger from the UI.

export const debugGlobalBookings = async () => {
    console.log('=== 🌍 GLOBAL BOOKING DEBUG ===');
    try {
        const db = getFirestore();
        const snap = await getDocs(collection(db, 'bookings'));
        console.log(`Found ${snap.size} total bookings in the database:`);
        snap.forEach(doc => {
            const data = doc.data();
            console.log(`- Booking ${doc.id}:`);
            console.log(`  > counselorId: "${data.counselorId}"`);
            console.log(`  > studentId:   "${data.userId}"`);
            console.log(`  > status:      "${data.status}"`);
            console.log(`  > createdAt:   "${data.createdAt?.toDate ? data.createdAt.toDate() : data.createdAt}"`);
        });
        console.log('================================');
    } catch (e) {
        console.error('Failed to list bookings', e);
    }
};
