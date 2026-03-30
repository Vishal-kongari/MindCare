import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getName, clearAuth } from "@/lib/auth";
import { signOutUser } from "@/services/auth";
import { useNavigate } from "react-router-dom";
import { Brain, Calendar, Star, Target, MessageCircle, BookOpen, Users, Smile, Music, Moon, PlayCircle, Book, Clock, User, Activity } from "lucide-react";
import { FaBrain, FaHeart, FaLeaf, FaFire, FaRocket, FaGem, FaSun, FaMoon, FaStar, FaTrophy, FaGamepad, FaBook, FaUsers, FaComments, FaCalendarAlt, FaChartLine, FaBullseye, FaLightbulb, FaMagic, FaRainbow, FaPalette, FaInfinity } from "react-icons/fa";
import { GiMeditation, GiFlowerPot, GiButterfly, GiTreeBranch, GiWaterDrop, GiSunrise, GiSunset, GiCrystalBall, GiMagicSwirl, GiStarFormation, GiHeartWings, GiPeaceDove, GiLotus, GiYinYang } from "react-icons/gi";
import { MdSelfImprovement, MdPsychology, MdNature, MdSpa, MdHealing, MdFavorite, MdEmojiNature, MdAutoAwesome, MdTrendingUp, MdInsights, MdExplore, MdCelebration, MdLocalFlorist, MdWbSunny, MdNightlight } from "react-icons/md";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { getAuthInstance } from "@/lib/firebase";
import { listenToTracking, logMood, incrementWeeklyGoal, incrementHabit, type UserTracking } from "@/services/tracking";
import { checkSurveyRequired, getLatestSurveyResponse, type SurveyResponseData } from "@/services/survey";
import { MentalHealthSurvey } from "@/components/survey/MentalHealthSurvey";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};
import { listCounselors, createBooking, listenBookingsForStudent, getUserProfileById, type CounselorProfile, type Booking } from "@/services/bookings";
import PopupChat from "@/components/PopupChat";
import { testBookingFlow } from "@/lib/bookingTest";
import { checkFirebaseConfig, getFirebaseConfigStatus } from "@/lib/firebaseConfigCheck";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { FaPhone, FaEnvelope, FaUniversity } from "react-icons/fa"; // Icons used in dialog

export const StudentDashboard = () => {
  const MotionCard = motion(Card);
  const { t } = useTranslation();
  const navigate = useNavigate();
  const name = getName();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [counselorNames, setCounselorNames] = useState<Record<string, string>>({});
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [tracking, setTracking] = useState<UserTracking | null>(null);
  const [loadingTracking, setLoadingTracking] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [showSurvey, setShowSurvey] = useState(false);
  const [latestSurvey, setLatestSurvey] = useState<SurveyResponseData | null>(null);

  const calculateScores = () => {
    if (!latestSurvey) return { mental: 0, stress: 0, lifestyle: 0, overall: 0 };

    // Mental Health (Section A + B)
    // Section A (0-18), Section B (0-12) Total 30.
    const mhSum = latestSurvey.sectionA.reduce((sum, v) => sum + (v >= 0 ? v : 0), 0) +
      latestSurvey.sectionB.reduce((sum, v) => sum + (v >= 0 ? v : 0), 0);
    const mentalScore = Math.max(0, Math.round(100 - (mhSum / 30) * 100));

    // Stress (Section C)
    const stressSum = latestSurvey.sectionC.reduce((sum, v) => sum + (v >= 0 ? v : 0), 0);
    const stressScore = Math.max(0, Math.round(100 - (stressSum / 20) * 100));

    // Lifestyle (Section D)
    const sleep = latestSurvey.sectionD?.[0] || 0;
    const exercise = latestSurvey.sectionD?.[1] || 0;
    const sleepScore = sleep >= 7 ? 50 : (sleep / 7) * 50;
    const exerciseScore = exercise >= 3 ? 50 : (exercise / 3) * 50;
    const lifestyleScore = Math.min(100, Math.round(sleepScore + exerciseScore));

    const overall = Math.round((mentalScore + stressScore + lifestyleScore) / 3);
    return { mental: mentalScore, stress: stressScore, lifestyle: lifestyleScore, overall };
  };

  const surveyScores = calculateScores();

  useEffect(() => {
    let unsubBookings: any;
    let unsubTracking: any;

    (async () => {
      const auth = await getAuthInstance();
      const user = auth.currentUser;
      if (user) {
        setUserId(user.uid);
        const required = await checkSurveyRequired(user.uid);
        setShowSurvey(required);

        const surveyData = await getLatestSurveyResponse(user.uid);
        setLatestSurvey(surveyData);
      }

      unsubBookings = await listenBookingsForStudent((list) => {
        setBookings(list);
        list.forEach(async (b) => {
          if (!counselorNames[b.counselorId]) {
            const profile = await getUserProfileById(b.counselorId);
            setCounselorNames((prev) => ({ ...prev, [b.counselorId]: profile?.name || 'Counselor' }));
          }
        });
      });

      if (user) {
        unsubTracking = await listenToTracking(user.uid, (data) => {
          setTracking(data);
          setLoadingTracking(false);
        });
      }
    })();

    return () => {
      if (unsubBookings) unsubBookings();
      if (unsubTracking) unsubTracking();
    };
  }, []);

  const handleMoodClick = async (mood: 'good' | 'okay' | 'stressed') => {
    const auth = await getAuthInstance();
    const user = auth.currentUser;
    if (user) {
      await logMood(user.uid, mood);
    }
  };

  const handleGoalClick = async (goalType: 'mindfulness' | 'checkins' | 'peerSupport') => {
    const auth = await getAuthInstance();
    const user = auth.currentUser;
    if (user && tracking && tracking.weeklyGoals[goalType].current < tracking.weeklyGoals[goalType].target) {
      await incrementWeeklyGoal(user.uid, goalType);
    }
  };

  const handleHabitClick = async (habitType: 'meditation' | 'journal') => {
    const auth = await getAuthInstance();
    const user = auth.currentUser;
    if (user && tracking && tracking.habits[habitType].current < tracking.habits[habitType].target) {
      await incrementHabit(user.uid, habitType);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 via-blue-50 to-indigo-100 relative overflow-hidden">
      {showSurvey && userId && (
        <MentalHealthSurvey
          userId={userId}
          onComplete={() => setShowSurvey(false)}
        />
      )}
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-20 h-20 bg-gradient-to-r from-pink-300 to-purple-300 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute top-32 right-20 w-16 h-16 bg-gradient-to-r from-blue-300 to-cyan-300 rounded-full opacity-20 animate-bounce"></div>
        <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-gradient-to-r from-yellow-300 to-orange-300 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute bottom-40 right-1/3 w-14 h-14 bg-gradient-to-r from-green-300 to-emerald-300 rounded-full opacity-20 animate-bounce"></div>
      </div>

      <header className="bg-white/95 backdrop-blur-md border-b border-gradient-to-r from-purple-200/50 to-blue-200/50 shadow-lg relative z-10">
        <div className="container h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-600 via-pink-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-xl transform hover:scale-105 transition-transform duration-300">
              <FaBrain className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">{t('dashboard.student.welcome')}, {name}</h1>
              <p className="text-sm text-gray-600 flex items-center gap-1">
                <GiMeditation className="w-4 h-4 text-purple-500" />
                {t('dashboard.student.title')}
                {(() => {
                  const configStatus = getFirebaseConfigStatus();
                  return configStatus.isValid ? (
                    <span className="ml-2 inline-flex items-center gap-1 text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      Firebase OK
                    </span>
                  ) : (
                    <span className="ml-2 inline-flex items-center gap-1 text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full">
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      Config Issue
                    </span>
                  );
                })()}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button
              onClick={() => setShowSurvey(true)}
              className="bg-gradient-to-r from-teal-500 to-emerald-500 text-white hover:from-teal-600 hover:to-emerald-600 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 hidden sm:flex"
            >
              <Activity className="w-4 h-4 mr-2" />
              Retake Check-in
            </Button>
            <Button
              onClick={() => navigate('/profile')}
              className="bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
            >
              <User className="w-4 h-4 mr-2" />
              Profile
            </Button>
            <Button
              variant="outline"
              onClick={async () => { await signOutUser(); clearAuth(); navigate('/'); }}
              className="border-gray-300 hover:border-red-500 hover:bg-red-50 hover:text-red-600 transition-colors"
            >
              Sign Out
            </Button>
          </div>
        </div>
      </header>
      <motion.main variants={containerVariants} initial="hidden" animate="visible" className="container py-12 grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
        <MotionCard variants={itemVariants} className="md:col-span-2 border-0 shadow-2xl bg-white/90 backdrop-blur-sm rounded-3xl relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-100/30 via-pink-100/20 to-blue-100/30"></div>
          <CardHeader className="pb-6 relative z-10">
            <CardTitle className="flex items-center gap-3 text-xl font-bold text-gray-900">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 via-pink-500 to-blue-500 rounded-xl flex items-center justify-center shadow-lg transform hover:scale-105 transition-transform duration-300">
                <FaBullseye className="w-6 h-6 text-white" />
              </div>
              <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">Bi-Weekly Survey Insights</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {/* Goals */}
              <div
                className="p-6 rounded-2xl bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-100 border-2 border-blue-200/50 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 relative overflow-hidden cursor-pointer"
              >
                <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-blue-300/20 to-cyan-300/20 rounded-full -translate-y-8 translate-x-8"></div>
                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-3">
                    <FaBrain className="w-5 h-5 text-blue-600" />
                    <p className="text-sm text-blue-600 font-semibold">Mental Wellbeing</p>
                  </div>
                  <p className="text-3xl font-bold text-blue-700 mb-2">{latestSurvey ? surveyScores.mental + '%' : '--'}</p>
                  <div className="w-full bg-blue-200 rounded-full h-3 shadow-inner">
                    <div className="bg-gradient-to-r from-blue-500 to-cyan-500 h-3 rounded-full shadow-lg transition-all duration-500" style={{ width: `${surveyScores.mental}%` }}></div>
                  </div>
                </div>
              </div>
              <div
                className="p-6 rounded-2xl bg-gradient-to-br from-green-50 via-emerald-50 to-green-100 border-2 border-green-200/50 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 relative overflow-hidden cursor-pointer"
              >
                <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-green-300/20 to-emerald-300/20 rounded-full -translate-y-8 translate-x-8"></div>
                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-3">
                    <FaLeaf className="w-5 h-5 text-green-600" />
                    <p className="text-sm text-green-600 font-semibold">Stress Control</p>
                  </div>
                  <p className="text-3xl font-bold text-green-700 mb-2">{latestSurvey ? surveyScores.stress + '%' : '--'}</p>
                  <div className="w-full bg-green-200 rounded-full h-3 shadow-inner">
                    <div className="bg-gradient-to-r from-green-500 to-emerald-500 h-3 rounded-full shadow-lg transition-all duration-500" style={{ width: `${surveyScores.stress}%` }}></div>
                  </div>
                </div>
              </div>
              <div
                className="p-6 rounded-2xl bg-gradient-to-br from-purple-50 via-pink-50 to-purple-100 border-2 border-purple-200/50 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 relative overflow-hidden cursor-pointer"
              >
                <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-purple-300/20 to-pink-300/20 rounded-full -translate-y-8 translate-x-8"></div>
                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-3">
                    <FaHeart className="w-5 h-5 text-purple-600" />
                    <p className="text-sm text-purple-600 font-semibold">Physical Habits</p>
                  </div>
                  <p className="text-3xl font-bold text-purple-700 mb-2">{latestSurvey ? surveyScores.lifestyle + '%' : '--'}</p>
                  <div className="w-full bg-purple-200 rounded-full h-3 shadow-inner">
                    <div className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full shadow-lg transition-all duration-500" style={{ width: `${surveyScores.lifestyle}%` }}></div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </MotionCard>
        <MotionCard variants={itemVariants} className="border-0 shadow-2xl bg-white/90 backdrop-blur-sm rounded-3xl relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-yellow-100/30 via-orange-100/20 to-red-100/30"></div>
          <CardHeader className="pb-6 relative z-10">
            <CardTitle className="flex items-center gap-3 text-xl font-bold text-gray-900">
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 via-orange-500 to-red-500 rounded-xl flex items-center justify-center shadow-lg transform hover:scale-105 transition-transform duration-300">
                <FaTrophy className="w-6 h-6 text-white" />
              </div>
              <span className="bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent">Overall Wellness Score</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-center">
              <div className="relative w-32 h-32 mx-auto mb-6">
                <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 100 100">
                  <defs>
                    <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#10b981" />
                      <stop offset="50%" stopColor="#059669" />
                      <stop offset="100%" stopColor="#047857" />
                    </linearGradient>
                  </defs>
                  <circle cx="50" cy="50" r="40" stroke="#e5e7eb" strokeWidth="8" fill="none" />
                  <circle cx="50" cy="50" r="40" stroke="url(#progressGradient)" strokeWidth="8" fill="none"
                    strokeDasharray="251.2"
                    strokeDashoffset={251.2 - (251.2 * Math.min(100, surveyScores.overall || 0) / 100)}
                    strokeLinecap="round"
                    className="transition-all duration-1000 ease-out"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">{latestSurvey ? surveyScores.overall : '--'}</p>
                    <p className="text-xs text-gray-500 font-medium">Score</p>
                    <p className="text-xs text-orange-500 font-bold mt-1">Based on survey</p>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-gray-600 font-semibold flex items-center justify-center gap-2">
                  <GiStarFormation className="w-4 h-4 text-yellow-500" />
                  Your Mental Wellbeing
                </p>
                <div className="flex items-center justify-center gap-1">
                  <FaStar className="w-3 h-3 text-yellow-400" />
                  <FaStar className="w-3 h-3 text-yellow-400" />
                  <FaStar className="w-3 h-3 text-yellow-400" />
                  <FaStar className="w-3 h-3 text-yellow-400" />
                  <FaStar className="w-3 h-3 text-gray-300" />
                </div>
                <p className="text-xs text-green-600 font-medium">Excellent Progress!</p>
              </div>
            </div>
          </CardContent>
        </MotionCard>
        <MotionCard variants={itemVariants} className="md:col-span-3 border-0 shadow-2xl bg-white/90 backdrop-blur-sm rounded-3xl relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-100/30 via-pink-100/20 to-blue-100/30"></div>
          <CardHeader className="pb-6 relative z-10">
            <CardTitle className="flex items-center gap-3 text-xl font-bold text-gray-900">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 via-pink-500 to-blue-500 rounded-xl flex items-center justify-center shadow-lg transform hover:scale-105 transition-transform duration-300">
                <FaRocket className="w-6 h-6 text-white" />
              </div>
              <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">{t('dashboard.student.quick.title')}</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <Button
                onClick={() => setIsChatOpen(true)}
                className="h-20 justify-start bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-600 hover:from-blue-600 hover:via-cyan-600 hover:to-blue-700 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 hover:scale-105 relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative z-10 flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                    <FaComments className="w-6 h-6" />
                  </div>
                  <div className="text-left">
                    <div className="font-bold text-lg">{t('dashboard.student.quick.chat')}</div>
                    <div className="text-sm opacity-90">{t('features.ai_chat.desc').substring(0, 30)}...</div>
                  </div>
                </div>
              </Button>
              <Button variant="outline" className="h-20 justify-start border-2 border-green-300 bg-gradient-to-r from-green-50 to-emerald-50 hover:border-green-500 hover:bg-gradient-to-r hover:from-green-100 hover:to-emerald-100 hover:text-green-700 transition-all duration-300 transform hover:-translate-y-2 hover:scale-105 relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-r from-green-100/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative z-10 flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                    <FaCalendarAlt className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-left">
                    <div className="font-bold text-lg">{t('dashboard.student.quick.book')}</div>
                    <div className="text-sm text-gray-600">{t('features.booking.desc').substring(0, 30)}...</div>
                  </div>
                </div>
              </Button>
              <Button
                onClick={() => navigate('/browse-resources')}
                variant="outline"
                className="h-20 justify-start border-2 border-purple-300 bg-gradient-to-r from-purple-50 to-pink-50 hover:border-purple-500 hover:bg-gradient-to-r hover:from-purple-100 hover:to-pink-100 hover:text-purple-700 transition-all duration-300 transform hover:-translate-y-2 hover:scale-105 relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-purple-100/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative z-10 flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                    <FaBook className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-left">
                    <div className="font-bold text-lg">{t('dashboard.student.quick.resources')}</div>
                    <div className="text-sm text-gray-600">{t('features.resources.desc').substring(0, 30)}...</div>
                  </div>
                </div>
              </Button>
            </div>
          </CardContent>
        </MotionCard>
        <MotionCard variants={itemVariants} className="md:col-span-3 border-0 shadow-large bg-card/70 backdrop-blur">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-secondary" /> My Sessions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {bookings.length === 0 ? (
                <div className="text-center py-6 text-muted-foreground">
                  <Calendar className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>No sessions booked yet</p>
                  <p className="text-xs">Book a session below to get started</p>
                </div>
              ) : (
                bookings.map((booking) => (
                  <div key={booking.id} className={`p-4 rounded-xl border ${booking.status === 'accepted' ? 'bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800' :
                    booking.status === 'completed' ? 'bg-purple-50 dark:bg-purple-950/20 border-purple-200 dark:border-purple-800' :
                      booking.status === 'rejected' ? 'bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800' :
                        'bg-yellow-50 dark:bg-yellow-950/20 border-yellow-200 dark:border-yellow-800'
                    }`}>
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="font-medium">
                          Session with {counselorNames[booking.counselorId] || 'Counselor'}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Status: <span className={`font-medium ${booking.status === 'accepted' ? 'text-green-600' :
                            booking.status === 'completed' ? 'text-purple-600' :
                              booking.status === 'rejected' ? 'text-red-600' :
                                'text-yellow-600'
                            }`}>
                            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                          </span>
                        </p>
                        {booking.scheduledTime && (
                          <p className="text-xs text-muted-foreground mt-1">
                            <Clock className="w-3 h-3 inline mr-1" />
                            Scheduled: {new Date(booking.scheduledTime).toLocaleString()}
                          </p>
                        )}
                        {booking.completedAt && (
                          <p className="text-xs text-muted-foreground mt-1">
                            <Star className="w-3 h-3 inline mr-1" />
                            Completed: {new Date(booking.completedAt).toLocaleString()}
                          </p>
                        )}
                        {booking.notes && (
                          <p className="text-xs text-muted-foreground mt-1 italic">
                            Notes: {booking.notes}
                          </p>
                        )}
                      </div>
                      <div className={`px-2 py-1 rounded-full text-xs font-medium ${booking.status === 'accepted' ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' :
                        booking.status === 'completed' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300' :
                          booking.status === 'rejected' ? 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300' :
                            'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300'
                        }`}>
                        {booking.status === 'accepted' ? '✓ Confirmed' :
                          booking.status === 'completed' ? '🏆 Completed' :
                            booking.status === 'rejected' ? '✗ Declined' :
                              '⏳ Pending'}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </MotionCard>
        <LiveSessionsSection />






        {/* Inspirational Verses */}



      </motion.main>
      <PopupChat isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </div>
  );
};

const LiveSessionsSection = () => {
  const MotionCard = motion(Card);
  const [counselors, setCounselors] = useState<CounselorProfile[]>([]);
  const [loading, setLoading] = useState(false);
  const [bookingLoading, setBookingLoading] = useState<string | null>(null);
  const [showCounselors, setShowCounselors] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState<string | null>(null);
  const [testResult, setTestResult] = useState<string | null>(null);

  const [selectedCounselor, setSelectedCounselor] = useState<CounselorProfile | null>(null);

  const loadCounselors = async () => {
    setLoading(true);
    try {
      const list = await listCounselors();
      setCounselors(list);
      setShowCounselors(true);
    } catch (error) {
      console.error('Failed to load counselors:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBooking = async (counselorId: string, counselorName: string) => {
    setBookingLoading(counselorId);
    try {
      console.log('Starting booking process for counselor:', counselorName, 'ID:', counselorId);
      const bookingId = await createBooking(counselorId);
      console.log('Booking created successfully with ID:', bookingId);
      setBookingSuccess(counselorName);
      setSelectedCounselor(null); // Close dialog if open
      setTimeout(() => setBookingSuccess(null), 3000);
    } catch (error) {
      console.error('Failed to book session:', error);
      alert(`Failed to book session: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setBookingLoading(null);
    }
  };

  const handleTestBooking = async () => {
    try {
      console.log('Testing booking flow...');

      // First check Firebase configuration
      const configCheck = checkFirebaseConfig();
      if (!configCheck.isValid) {
        setTestResult(`❌ Firebase config issue: ${configCheck.message}`);
        return;
      }

      const result = await testBookingFlow();
      if (result.success) {
        setTestResult(`✅ Test successful! Booking created with ID: ${result.bookingId}`);
      } else {
        setTestResult(`❌ Test failed: ${result.error}`);
      }
    } catch (error) {
      console.error('Test booking error:', error);
      setTestResult(`❌ Test error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  return (
    <>
      <MotionCard variants={itemVariants} className="md:col-span-3 border-0 shadow-large bg-card/70 backdrop-blur">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-primary" /> Live Sessions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {!showCounselors ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Book a Live Session</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Connect with our professional counselors for personalized support
              </p>
              <Button
                onClick={loadCounselors}
                disabled={loading}
                className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90"
              >
                {loading ? (
                  <>
                    <Clock className="w-4 h-4 mr-2 animate-spin" />
                    Loading Counselors...
                  </>
                ) : (
                  <>
                    <User className="w-4 h-4 mr-2" />
                    View Available Counselors
                  </>
                )}
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">Available Counselors</h4>
                <div className="flex gap-2">

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowCounselors(false)}
                  >
                    Hide
                  </Button>
                </div>
              </div>

              {counselors.length === 0 ? (
                <div className="text-center py-6 text-muted-foreground">
                  No counselors available right now. Please try again later.
                </div>
              ) : (
                <div className="space-y-3">
                  {counselors.map((counselor) => (
                    <div key={counselor.id} className="p-4 rounded-xl border bg-card/50 hover:bg-card/70 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center">
                              <User className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <p className="font-medium">{counselor.name}</p>
                              <p className="text-sm text-muted-foreground">
                                {counselor.role === 'counselor' ? 'Professional Counselor' : 'On-Campus Counselor'}
                                {counselor.specialization && ` • ${counselor.specialization}`}
                              </p>
                            </div>
                          </div>
                          {counselor.availability && (
                            <p className="text-xs text-muted-foreground ml-13">
                              Available: {counselor.availability}
                            </p>
                          )}
                        </div>
                        <div className="flex flex-col gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedCounselor(counselor)}
                          >
                            View Profile
                          </Button>
                          <Button
                            onClick={() => handleBooking(counselor.id, counselor.name)}
                            disabled={bookingLoading === counselor.id}
                            className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90"
                          >
                            {bookingLoading === counselor.id ? (
                              <>
                                <Clock className="w-4 h-4 mr-2 animate-spin" />
                                Booking...
                              </>
                            ) : (
                              'Book Session'
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {bookingSuccess && (
                <div className="p-3 rounded-lg bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800">
                  <p className="text-sm text-green-700 dark:text-green-300">
                    ✓ Booking request sent to {bookingSuccess}! You'll be notified when they accept.
                  </p>
                </div>
              )}

              {testResult && (
                <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800">
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    {testResult}
                  </p>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setTestResult(null)}
                    className="mt-2"
                  >
                    Clear
                  </Button>
                </div>
              )}

              <p className="text-xs text-muted-foreground text-center">
                You will be notified once the counselor accepts and schedules a time.
              </p>
            </div>
          )}
        </CardContent>
      </MotionCard>

      {/* Doctor Details Dialog */}
      <Dialog open={!!selectedCounselor} onOpenChange={(open) => !open && setSelectedCounselor(null)}>
        <DialogContent className="max-w-2xl overflow-y-auto max-h-[90vh]">
          {selectedCounselor && (
            <>
              <DialogHeader className="flex flex-col items-center sm:items-start border-b pb-4 mb-4">
                <div className="flex flex-col sm:flex-row items-center gap-4 w-full">
                  <div className="h-24 w-24 rounded-full bg-gradient-to-tr from-primary to-purple-400 flex items-center justify-center shadow-md shrink-0">
                    <User className="h-10 w-10 text-white" />
                  </div>
                  <div className="text-center sm:text-left space-y-1 flex-1">
                    <DialogTitle className="text-2xl font-bold">{selectedCounselor.name}</DialogTitle>
                    <DialogDescription className="text-base font-medium text-primary uppercase tracking-wide">
                      {selectedCounselor.role.replace(/-/g, ' ')}
                    </DialogDescription>
                    {selectedCounselor.specialization && (
                      <Badge variant="secondary" className="mt-2">
                        {selectedCounselor.specialization}
                      </Badge>
                    )}
                  </div>
                </div>
              </DialogHeader>

              <div className="space-y-6">
                {/* Bio */}
                <div className="space-y-2">
                  <h4 className="font-semibold text-gray-900">About</h4>
                  <p className="text-gray-600 leading-relaxed text-sm">
                    {selectedCounselor.bio || "No bio available."}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Availability */}
                  <div className="bg-blue-50 p-4 rounded-lg flex items-start gap-3">
                    <Clock className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <h5 className="font-semibold text-blue-900 text-sm">Availability</h5>
                      <p className="text-sm text-blue-700">{selectedCounselor.availability || "Contact for details"}</p>
                    </div>
                  </div>

                  {/* Institution */}
                  {selectedCounselor.institution && (
                    <div className="bg-purple-50 p-4 rounded-lg flex items-start gap-3">
                      <FaUniversity className="h-5 w-5 text-purple-600 mt-0.5" />
                      <div>
                        <h5 className="font-semibold text-purple-900 text-sm">Institution</h5>
                        <p className="text-sm text-purple-700">{selectedCounselor.institution}</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Contact Info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {selectedCounselor.email && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <FaEnvelope className="text-gray-400" /> {selectedCounselor.email}
                    </div>
                  )}
                  {selectedCounselor.phoneNumber && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <FaPhone className="text-gray-400" /> {selectedCounselor.phoneNumber}
                    </div>
                  )}
                </div>

                <Separator />

                <Button
                  className="w-full h-12 text-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  onClick={() => handleBooking(selectedCounselor.id, selectedCounselor.name)}
                  disabled={bookingLoading === selectedCounselor.id}
                >
                  {bookingLoading === selectedCounselor.id ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Booking...
                    </>
                  ) : 'Book Session'}
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};


