import { getDb } from "@/lib/firebase";
import { collection, addDoc, query, where, getDocs, serverTimestamp } from "firebase/firestore";

export interface SurveyResponseData {
  sectionA: number[];
  sectionB: number[];
  sectionC: number[];
  sectionD: number[];
  sectionE: number;
  prediction?: {
    level: string;
    suggestions: string;
  };
}

export const saveSurveyResponse = async (userId: string, data: SurveyResponseData): Promise<void> => {
  try {
    const db = await getDb();
    
    // Calculate simple total scores for analytics
    const phq9_gad7_score = data.sectionA.reduce((a, b) => a + b, 0);
    const behavior_score = data.sectionB.reduce((a, b) => a + b, 0);
    const stress_score = data.sectionC.reduce((a, b) => a + b, 0);

    await addDoc(collection(db, 'surveys'), {
      userId,
      timestamp: serverTimestamp(),
      answers: data,
      scores: {
        core_mental_state: phq9_gad7_score,
        behavior: behavior_score,
        stress: stress_score
      },
      prediction: data.prediction || null
    });
    console.log('✅ Survey response saved successfully for user:', userId);
  } catch (error) {
    console.error('❌ Error saving survey response:', error);
    throw new Error('Failed to save survey. Please try again.');
  }
};

export const checkSurveyRequired = async (userId: string): Promise<boolean> => {
  try {
    if (!userId) return false;

    const db = await getDb();
    const q = query(
      collection(db, 'surveys'),
      where('userId', '==', userId)
    );
    
    const snap = await getDocs(q);
    
    // If they have never taken a survey, it's required.
    if (snap.empty) {
      return true;
    }
    
    // Sort locally by timestamp descending to find the most recent one.
    // This avoids requiring a composite index on (userId, timestamp DESC).
    const surveys = snap.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        timeMs: data.timestamp?.toDate ? data.timestamp.toDate().getTime() : 0 
      };
    });
    
    surveys.sort((a, b) => b.timeMs - a.timeMs);
    
    const latestSurvey = surveys[0];
    if (!latestSurvey || latestSurvey.timeMs === 0) {
      return true;
    }
    
    const now = Date.now();
    const msIn14Days = 14 * 24 * 60 * 60 * 1000;
    
    // If the latest survey was more than 14 days ago, require it again.
    return (now - latestSurvey.timeMs) > msIn14Days;
    
  } catch (error) {
    console.error('❌ Error checking survey requirement:', error);
    // On error, safely allow them into the dashboard rather than blocking them permanently
    return false;
  }
};

export const getLatestSurveyResponse = async (userId: string): Promise<SurveyResponseData | null> => {
  try {
    const db = await getDb();
    const surveysRef = collection(db, "surveys");
    const userSurveysQuery = query(surveysRef, where("userId", "==", userId));
    const snapshot = await getDocs(userSurveysQuery);
    
    if (snapshot.empty) return null;
    
    const docs = snapshot.docs.map(doc => ({
      data: doc.data().answers as SurveyResponseData,
      time: doc.data().timestamp?.toMillis() || 0
    }));
    
    docs.sort((a, b) => b.time - a.time); // Descending order
    return docs[0].data;
  } catch (error) {
    console.error("Error fetching latest survey:", error);
    return null;
  }
};
