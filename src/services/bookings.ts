import { getAuthInstance, getDb } from "@/lib/firebase";
import {
  addDoc,
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
  getDocs,
  getDoc
} from "firebase/firestore";

export interface CounselorProfile {
  id: string;
  name: string;
  role: 'counselor' | 'on-campus-counselor';
  specialization?: string;
  availability?: string;
  email?: string;
  phoneNumber?: string;
  bio?: string;
  institution?: string;
}

export interface Booking {
  id: string;
  userId: string;
  counselorId: string;
  status: 'pending' | 'accepted' | 'rejected' | 'cancelled' | 'completed';
  scheduledTime?: string;
  createdAt?: any;
  isEmergency?: boolean;
  completedAt?: string;
  notes?: string;
  studentName?: string;
  counselorName?: string;
}

export const getStudentsByInstitution = async (university: string): Promise<any[]> => {
  try {
    const db = await getDb();
    const q = query(
      collection(db, 'users'),
      where('role', '==', 'student')
    );
    const snap = await getDocs(q);
    return snap.docs
      .map(doc => ({ id: doc.id, ...doc.data() }))
      .filter((student: any) => 
        student.university && 
        student.university.trim().toLowerCase() === university.trim().toLowerCase()
      );
  } catch (error) {
    console.error('Error getting students by institution:', error);
    throw new Error('Failed to load students.');
  }
};

export const listCounselors = async (): Promise<CounselorProfile[]> => {
  try {
    const db = await getDb();
    const q = query(
      collection(db, 'users'),
      where('role', 'in', ['counselor', 'on-campus-counselor'])
    );
    const snap = await getDocs(q);
    const counselors = snap.docs.map(d => ({
      id: d.id,
      ...(d.data() as Omit<CounselorProfile, 'id'>)
    }));

    console.log(`Found ${counselors.length} counselors`);
    return counselors;
  } catch (error) {
    console.error('Error listing counselors:', error);
    throw new Error('Failed to load counselors. Please try again.');
  }
};

export const createBooking = async (counselorId: string): Promise<string> => {
  try {
    if (!counselorId) throw new Error('Counselor ID is required');
    console.log('Creating booking for counselor:', counselorId);
    const auth = await getAuthInstance();
    const user = auth.currentUser;

    if (!user) {
      throw new Error('Not authenticated. Please sign in again.');
    }

    const db = await getDb();

    // Get student profile for name
    const studentProfile = await getUserProfileById(user.uid);

    const bookingData = {
      userId: user.uid,
      counselorId: counselorId,
      status: 'pending',
      createdAt: serverTimestamp(),
      isEmergency: false,
      studentName: 'Anonymous Student',
    };

    console.log('Booking data:', {
      ...bookingData,
      studentId: user.uid,
      counselorId: counselorId
    });

    const docRef = await addDoc(collection(db, 'bookings'), bookingData);

    console.log('✅ Booking created successfully with ID:', docRef.id);
    console.log('Booking details:', {
      id: docRef.id,
      student: user.uid,
      counselor: counselorId,
      status: 'pending'
    });

    return docRef.id;
  } catch (error) {
    console.error('❌ Error creating booking:', error);
    throw new Error(error instanceof Error ? error.message : 'Failed to create booking');
  }
};

export const listenBookingsForCounselor = async (
  cb: (bookings: Booking[]) => void
): Promise<() => void> => {
  try {
    const auth = await getAuthInstance();
    const user = auth.currentUser;

    if (!user) {
      console.log('No authenticated user found for counselor booking listener');
      cb([]);
      return () => { };
    }

    console.log('Setting up counselor booking listener for user:', user.uid);
    const db = await getDb();

    // Use unordered query with client-side sorting to avoid index issues ("failed-precondition")
    // This is safer for prototyping and small datasets
    const q = query(
      collection(db, 'bookings'),
      where('counselorId', '==', user.uid)
    );

    const unsubscribe = onSnapshot(q,
      (snapshot) => {
        const bookings = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Booking[];

        // Sort by createdAt desc (newest first)
        bookings.sort((a, b) => {
          const dateA = a.createdAt?.toDate ? a.createdAt.toDate().getTime() : (a.createdAt ? new Date(a.createdAt).getTime() : 0);
          const dateB = b.createdAt?.toDate ? b.createdAt.toDate().getTime() : (b.createdAt ? new Date(b.createdAt).getTime() : 0);
          return dateB - dateA;
        });

        console.log(`✅ Found ${bookings.length} bookings for counselor ${user.uid}`);
        cb(bookings);
      },
      (error) => {
        console.error('❌ Error in booking listener:', error);
        cb([]);
      }
    );

    return unsubscribe;

  } catch (error) {
    console.error('❌ Failed to setup counselor booking listener:', error);
    cb([]);
    return () => { };
  }
};

export const acceptBooking = async (bookingId: string, scheduledTime: string): Promise<void> => {
  try {
    const db = await getDb();
    const updateData = {
      status: 'accepted',
      scheduledTime: scheduledTime,
    };

    await updateDoc(doc(db, 'bookings', bookingId), updateData);
    console.log('✅ Booking accepted:', bookingId);
  } catch (error) {
    console.error('❌ Error accepting booking:', error);
    throw new Error('Failed to accept booking');
  }
};

export const rejectBooking = async (bookingId: string): Promise<void> => {
  try {
    const db = await getDb();
    await updateDoc(doc(db, 'bookings', bookingId), {
      status: 'rejected'
    });
    console.log('✅ Booking rejected:', bookingId);
  } catch (error) {
    console.error('❌ Error rejecting booking:', error);
    throw new Error('Failed to reject booking');
  }
};

export const completeSession = async (bookingId: string, notes?: string): Promise<void> => {
  try {
    const db = await getDb();
    const updateData: any = {
      status: 'completed',
      completedAt: new Date().toISOString(),
    };

    if (notes) {
      updateData.notes = notes;
    }

    await updateDoc(doc(db, 'bookings', bookingId), updateData);
    console.log('✅ Session completed:', bookingId);
  } catch (error) {
    console.error('❌ Error completing session:', error);
    throw new Error('Failed to complete session');
  }
};

export const getUserProfileById = async (userId: string): Promise<any | null> => {
  try {
    const db = await getDb();
    const userDoc = await getDoc(doc(db, 'users', userId));

    if (!userDoc.exists()) {
      console.log('User profile not found:', userId);
      return null;
    }

    const data = userDoc.data();
    return {
      id: userId,
      name: data.name || 'Unknown User',
      ...data
    };
  } catch (error) {
    console.error('Error getting user profile:', error);
    return null;
  }
};

export const listenBookingsForStudent = async (
  cb: (bookings: Booking[]) => void
): Promise<() => void> => {
  try {
    const auth = await getAuthInstance();
    const user = auth.currentUser;

    if (!user) {
      console.log('No authenticated user found for student booking listener');
      cb([]);
      return () => { };
    }

    const db = await getDb();

    // Try ordered query first
    const tryOrderedQuery = () => {
      try {
        const orderedQuery = query(
          collection(db, 'bookings'),
          where('userId', '==', user.uid),
          orderBy('createdAt', 'desc')
        );

        return onSnapshot(orderedQuery,
          (snapshot) => {
            const bookings = snapshot.docs.map(doc => ({
              id: doc.id,
              ...doc.data()
            })) as Booking[];

            console.log(`✅ Student ordered query: Found ${bookings.length} bookings`);
            cb(bookings);
          },
          (error) => {
            if (error.code === 'failed-precondition') {
              console.log('⚠️ Student index not ready, falling back...');
              tryUnorderedQuery();
            } else {
              console.error('❌ Error in student ordered query:', error);
              cb([]);
            }
          }
        );
      } catch (error) {
        console.error('❌ Failed to create student ordered query:', error);
        tryUnorderedQuery();
        return () => { };
      }
    };

    // Fallback: unordered query
    const tryUnorderedQuery = () => {
      try {
        const unorderedQuery = query(
          collection(db, 'bookings'),
          where('userId', '==', user.uid)
        );

        return onSnapshot(unorderedQuery,
          (snapshot) => {
            const bookings = snapshot.docs.map(doc => ({
              id: doc.id,
              ...doc.data()
            })) as Booking[];

            // Manual sorting
            bookings.sort((a, b) => {
              const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
              const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
              return dateB - dateA;
            });

            console.log(`⚠️ Student unordered query: Found ${bookings.length} bookings`);
            cb(bookings);
          },
          (error) => {
            console.error('❌ Error in student unordered query:', error);
            cb([]);
          }
        );
      } catch (error) {
        console.error('❌ Failed to create student unordered query:', error);
        cb([]);
        return () => { };
      }
    };

    return tryOrderedQuery();

  } catch (error) {
    console.error('❌ Failed to setup student booking listener:', error);
    cb([]);
    return () => { };
  }
};

// Debug and utility functions
export const debugCounselorBookings = async (): Promise<void> => {
  try {
    const auth = await getAuthInstance();
    const user = auth.currentUser;

    if (!user) {
      console.log('❌ No authenticated user found');
      return;
    }

    console.log('=== 🔍 COUNSELOR BOOKING DEBUG ===');
    console.log('Current user ID:', user.uid);

    const db = await getDb();

    // Check user role
    const userDoc = await getDoc(doc(db, 'users', user.uid));
    if (userDoc.exists()) {
      const userData = userDoc.data();
      console.log('User role:', userData.role);
      console.log('User name:', userData.name);
    } else {
      console.log('❌ User document not found in users collection');
    }

    // Get all bookings
    const allBookings = await getDocs(collection(db, 'bookings'));
    console.log(`Total bookings in database: ${allBookings.docs.length}`);

    allBookings.docs.forEach(doc => {
      const data = doc.data();
      console.log(`📋 Booking ${doc.id}:`, {
        counselorId: data.counselorId,
        userId: data.userId,
        status: data.status,
        createdAt: data.createdAt ? new Date(data.createdAt).toLocaleString() : 'No date'
      });
    });

    // Get bookings specifically for this counselor
    const counselorBookings = await getDocs(
      query(collection(db, 'bookings'), where('counselorId', '==', user.uid))
    );

    console.log(`Bookings assigned to counselor ${user.uid}: ${counselorBookings.docs.length}`);
    counselorBookings.docs.forEach(doc => {
      const data = doc.data();
      console.log(`👤 Counselor booking ${doc.id}:`, {
        status: data.status,
        studentId: data.userId,
        scheduledTime: data.scheduledTime
      });
    });

    console.log('=== ✅ DEBUG COMPLETE ===');

  } catch (error) {
    console.error('❌ Debug error:', error);
  }
};

export const fixCounselorIdMismatch = async (): Promise<number> => {
  try {
    const auth = await getAuthInstance();
    const user = auth.currentUser;

    if (!user) {
      console.log('❌ No authenticated user found');
      return 0;
    }

    console.log('=== 🔧 FIXING COUNSELOR ID MISMATCH ===');
    console.log('Current counselor ID:', user.uid);

    const db = await getDb();

    // Verify user is a counselor
    const userDoc = await getDoc(doc(db, 'users', user.uid));
    if (!userDoc.exists() || !['counselor', 'on-campus-counselor'].includes(userDoc.data().role)) {
      console.log('❌ Current user is not a counselor');
      return 0;
    }

    // Find pending bookings with incorrect or missing counselor IDs
    const pendingBookings = await getDocs(
      query(collection(db, 'bookings'), where('status', '==', 'pending'))
    );

    let fixedCount = 0;

    for (const bookingDoc of pendingBookings.docs) {
      const data = bookingDoc.data();

      if (!data.counselorId || data.counselorId !== user.uid) {
        console.log(`🛠️ Fixing booking ${bookingDoc.id}:`, {
          oldCounselorId: data.counselorId,
          newCounselorId: user.uid
        });

        await updateDoc(doc(db, 'bookings', bookingDoc.id), {
          counselorId: user.uid
        });

        fixedCount++;
      }
    }

    console.log(`✅ Fixed ${fixedCount} bookings`);
    console.log('=== ✅ FIX COMPLETE ===');

    return fixedCount;

  } catch (error) {
    console.error('❌ Fix error:', error);
    return 0;
  }
};

export const assignPendingBookingsToCounselor = async (): Promise<number> => {
  try {
    const auth = await getAuthInstance();
    const user = auth.currentUser;

    if (!user) {
      console.log('❌ No authenticated user found');
      return 0;
    }

    console.log('=== 📋 ASSIGNING PENDING BOOKINGS ===');
    console.log('Current counselor ID:', user.uid);

    const db = await getDb();

    // Verify counselor role
    const userDoc = await getDoc(doc(db, 'users', user.uid));
    const userData = userDoc.data();

    if (!userDoc.exists() || !['counselor', 'on-campus-counselor'].includes(userData?.role)) {
      console.log('❌ Current user is not a counselor');
      return 0;
    }

    // Get all pending bookings
    const pendingBookings = await getDocs(
      query(collection(db, 'bookings'), where('status', '==', 'pending'))
    );

    let assignedCount = 0;

    for (const bookingDoc of pendingBookings.docs) {
      const data = bookingDoc.data();

      // Assign to current counselor if no counselor is set
      if (!data.counselorId) {
        console.log(`📋 Assigning booking ${bookingDoc.id} to counselor ${user.uid}`);

        await updateDoc(doc(db, 'bookings', bookingDoc.id), {
          counselorId: user.uid,
          counselorName: userData.name
        });

        assignedCount++;
      }
    }

    console.log(`✅ Assigned ${assignedCount} bookings to counselor`);
    console.log('=== ✅ ASSIGNMENT COMPLETE ===');

    return assignedCount;

  } catch (error) {
    console.error('❌ Assignment error:', error);
    return 0;
  }
};

export const createTestBooking = async (counselorId: string): Promise<string> => {
  try {
    console.log('=== 🧪 CREATING TEST BOOKING ===');
    console.log('Counselor ID:', counselorId);

    const auth = await getAuthInstance();
    const user = auth.currentUser;

    if (!user) {
      throw new Error('Not authenticated');
    }

    const db = await getDb();

    // Get counselor info
    const counselorDoc = await getDoc(doc(db, 'users', counselorId));
    const counselorData = counselorDoc.data();

    // Get student info
    const studentDoc = await getDoc(doc(db, 'users', user.uid));
    const studentData = studentDoc.data();

    const bookingData = {
      userId: user.uid,
      counselorId: counselorId,
      status: 'pending',
      createdAt: serverTimestamp(),
      isEmergency: false,
      studentName: studentData?.name || 'Test Student',
      counselorName: counselorData?.name || 'Test Counselor',
    };

    console.log('Test booking data:', bookingData);

    const docRef = await addDoc(collection(db, 'bookings'), bookingData);

    console.log('✅ Test booking created with ID:', docRef.id);
    console.log('=== ✅ TEST COMPLETE ===');

    return docRef.id;

  } catch (error) {
    console.error('❌ Test booking creation error:', error);
    throw error;
  }
};

// Helper function to check if index is ready
export const checkIndexStatus = async (): Promise<boolean> => {
  // ... existing checkIndexStatus ...
  try {
    const auth = await getAuthInstance();
    const user = auth.currentUser;

    if (!user) return false;

    const db = await getDb();

    // Try the ordered query to see if index is ready
    const testQuery = query(
      collection(db, 'bookings'),
      where('counselorId', '==', user.uid),
      orderBy('createdAt', 'desc')
    );

    // Just get one document to test the query
    const testSnapshot = await getDocs(testQuery);
    console.log('✅ Index is ready and working');
    return true;

  } catch (error: any) {
    if (error.code === 'failed-precondition') {
      console.log('⚠️ Index is not ready yet');
      return false;
    }
    console.error('❌ Error checking index status:', error);
    return false;
  }
};

export interface MedicalReview {
  id: string;
  counselorName: string;
  date: string;
  notes: string;
}

export const getStudentMedicalReviews = async (studentId: string): Promise<MedicalReview[]> => {
  try {
    const db = await getDb();
    const q = query(collection(db, 'bookings'), where('userId', '==', studentId), where('status', '==', 'completed'));
    const snap = await getDocs(q);

    const reviews: MedicalReview[] = [];
    for (const doc of snap.docs) {
      const data = doc.data() as Booking;
      if (data.notes && data.notes.trim() !== '') {
        let cName = data.counselorName || 'Counselor';
        if (!data.counselorName && data.counselorId) {
          const profile = await getUserProfileById(data.counselorId);
          if (profile) cName = profile.name;
        }
        reviews.push({
          id: doc.id,
          counselorName: cName,
          date: data.completedAt || data.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
          notes: data.notes
        });
      }
    }

    return reviews.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  } catch (error) {
    console.error('Error fetching medical reviews:', error);
    return [];
  }
};