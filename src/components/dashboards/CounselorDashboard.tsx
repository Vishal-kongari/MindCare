import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getName, clearAuth } from "@/lib/auth";
import { signOutUser } from "@/services/auth";
import { useNavigate } from "react-router-dom";
import { Users, Calendar, MessageSquare, Heart, TrendingUp, CheckCircle2, AlertTriangle, Clock } from "lucide-react";
import { FaHeart, FaUsers, FaCalendarAlt, FaComments, FaChartLine, FaCheckCircle, FaExclamationTriangle, FaClock, FaStethoscope, FaUserMd, FaClipboardList, FaTasks, FaStar, FaTrophy, FaBrain, FaHandsHelping, FaShieldAlt, FaMagic, FaGem, FaCrown, FaAward, FaMedal, FaRocket, FaLightbulb, FaInfinity, FaRainbow, FaPalette } from "react-icons/fa";
import { GiMedicalPack, GiHeartWings, GiPeaceDove, GiLotus, GiYinYang, GiCrystalBall, GiMagicSwirl, GiStarFormation, GiFlowerPot, GiButterfly, GiTreeBranch, GiWaterDrop, GiSunrise, GiSunset, GiMeditation } from "react-icons/gi";
import { MdPsychology, MdHealing, MdFavorite, MdEmojiNature, MdAutoAwesome, MdTrendingUp, MdInsights, MdExplore, MdCelebration, MdLocalFlorist, MdWbSunny, MdNightlight, MdSelfImprovement, MdNature, MdSpa, MdHealthAndSafety, MdSupportAgent, MdVerifiedUser, MdThumbUp, MdEmojiEvents, MdGrade, MdWorkspacePremium } from "react-icons/md";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { acceptBooking, getUserProfileById, listenBookingsForCounselor, rejectBooking, completeSession, debugCounselorBookings, fixCounselorIdMismatch, createTestBooking, assignPendingBookingsToCounselor, type Booking } from "@/services/bookings";
import { debugGlobalBookings } from "@/lib/debugBookings";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { testFirebaseConnection } from "@/lib/firebaseTest";
import { getAuthInstance } from "@/lib/firebase";

export const CounselorDashboard = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const name = getName();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [studentNames, setStudentNames] = useState<Record<string, string>>({});
  const [loadingActionId, setLoadingActionId] = useState<string | null>(null);
  const [showTimeInput, setShowTimeInput] = useState<string | null>(null);
  const [timeSlot, setTimeSlot] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showNotesInput, setShowNotesInput] = useState<string | null>(null);
  const [sessionNotes, setSessionNotes] = useState("");

  useEffect(() => {
    let unsub: any;
    (async () => {
      try {
        setLoading(true);
        setError(null);
        console.log('Setting up Firebase listener for counselor bookings...');

        console.log('CounselorDashboard: Current User ID:', getAuthInstance().then(auth => console.log('Auth User:', auth.currentUser?.uid)));

        unsub = await listenBookingsForCounselor((list) => {
          console.log('CounselorDashboard: Received bookings from service:', list);
          console.log('CounselorDashboard: Booking Counselor IDs:', list.map(b => b.counselorId));
          setBookings(list);
          setLoading(false);

          // Load student names on demand
          list.forEach(async (b) => {
            if (!studentNames[b.userId]) {
              try {
                const profile = await getUserProfileById(b.userId);
                console.log(`Loaded profile for user ${b.userId}:`, profile);
                setStudentNames((prev) => ({ ...prev, [b.userId]: profile?.name || 'Student' }));
              } catch (err) {
                console.error(`Failed to load profile for user ${b.userId}:`, err);
                setStudentNames((prev) => ({ ...prev, [b.userId]: 'Student' }));
              }
            }
          });
        });
      } catch (err) {
        console.error('Failed to setup Firebase listener:', err);
        setError('Failed to connect to database. Please check your connection and try again.');
        setLoading(false);
      }
    })();
    return () => {
      if (unsub) {
        console.log('Cleaning up Firebase listener...');
        unsub();
      }
    };
  }, []);

  const handleAcceptWithTime = async (bookingId: string) => {
    if (!timeSlot.trim()) return;
    setLoadingActionId(bookingId);
    try {
      console.log(`Accepting booking ${bookingId} with time: ${timeSlot}`);
      await acceptBooking(bookingId, timeSlot);
      console.log('Booking accepted successfully');
      setShowTimeInput(null);
      setTimeSlot("");
    } catch (error) {
      console.error('Failed to accept booking:', error);
      setError('Failed to accept booking. Please try again.');
    } finally {
      setLoadingActionId(null);
    }
  };

  const handleQuickAccept = async (bookingId: string) => {
    setLoadingActionId(bookingId);
    try {
      const defaultTime = new Date();
      defaultTime.setHours(defaultTime.getHours() + 24); // Next day
      console.log(`Quick accepting booking ${bookingId} with default time: ${defaultTime.toISOString()}`);
      await acceptBooking(bookingId, defaultTime.toISOString());
      console.log('Booking quick accepted successfully');
    } catch (error) {
      console.error('Failed to quick accept booking:', error);
      setError('Failed to accept booking. Please try again.');
    } finally {
      setLoadingActionId(null);
    }
  };

  // Filter bookings based on status and search term
  const filteredBookings = bookings.filter(booking => {
    const matchesStatus = statusFilter === "all" || booking.status === statusFilter;
    const matchesSearch = searchTerm === "" ||
      booking.status.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  // Get status badge variant
  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'pending': return 'secondary';
      case 'accepted': return 'default';
      case 'rejected': return 'destructive';
      case 'cancelled': return 'outline';
      case 'completed': return 'default';
      default: return 'secondary';
    }
  };

  // Get status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <FaClock className="w-3 h-3" />;
      case 'accepted': return <FaCheckCircle className="w-3 h-3" />;
      case 'rejected': return <FaExclamationTriangle className="w-3 h-3" />;
      case 'cancelled': return <FaClock className="w-3 h-3" />;
      case 'completed': return <FaTrophy className="w-3 h-3" />;
      default: return <FaClock className="w-3 h-3" />;
    }
  };

  // Format date for display
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Not scheduled';
    try {
      return new Date(dateString).toLocaleString();
    } catch {
      return 'Invalid date';
    }
  };

  // Test Firebase connection
  const handleTestConnection = async () => {
    try {
      console.log('Testing Firebase connection...');
      const result = await testFirebaseConnection();
      if (result.isConnected) {
        console.log('✅ Firebase connection successful!', result);
        setError(null);
      } else {
        console.error('❌ Firebase connection failed:', result.error);
        setError(result.error || 'Connection test failed');
      }
    } catch (err) {
      console.error('Connection test error:', err);
      setError('Connection test failed');
    }
  };

  // Complete session
  const handleCompleteSession = async (bookingId: string) => {
    setLoadingActionId(bookingId);
    try {
      console.log(`Completing session ${bookingId} with notes: ${sessionNotes}`);
      await completeSession(bookingId, sessionNotes);
      console.log('Session completed successfully');
      setShowNotesInput(null);
      setSessionNotes("");
    } catch (error) {
      console.error('Failed to complete session:', error);
      setError('Failed to complete session. Please try again.');
    } finally {
      setLoadingActionId(null);
    }
  };

  // Test function to create a test booking for this counselor
  const handleCreateTestBooking = async () => {
    try {
      const auth = await getAuthInstance();
      const user = auth.currentUser;
      if (!user) {
        console.log('No authenticated user found');
        return;
      }

      console.log('Creating test booking for current counselor:', user.uid);
      const bookingId = await createTestBooking(user.uid);
      console.log('Test booking created with ID:', bookingId);
      setError(null); // Clear any previous errors
    } catch (error) {
      console.error('Failed to create test booking:', error);
      setError('Failed to create test booking. Please try again.');
    }
  };

  // Function to assign pending bookings to current counselor
  const handleAssignPendingBookings = async () => {
    try {
      console.log('Assigning pending bookings to current counselor...');
      await assignPendingBookingsToCounselor();
      setError(null); // Clear any previous errors
    } catch (error) {
      console.error('Failed to assign pending bookings:', error);
      setError('Failed to assign pending bookings. Please try again.');
    }
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 via-blue-50 to-indigo-100 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-16 left-16 w-24 h-24 bg-gradient-to-r from-emerald-300 to-teal-300 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute top-40 right-24 w-20 h-20 bg-gradient-to-r from-blue-300 to-cyan-300 rounded-full opacity-20 animate-bounce"></div>
        <div className="absolute bottom-24 left-1/3 w-16 h-16 bg-gradient-to-r from-teal-300 to-emerald-300 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute bottom-48 right-1/4 w-18 h-18 bg-gradient-to-r from-indigo-300 to-blue-300 rounded-full opacity-20 animate-bounce"></div>
      </div>

      <header className="bg-white/95 backdrop-blur-md border-b border-gradient-to-r from-emerald-200/50 to-blue-200/50 shadow-lg relative z-10">
        <div className="container h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-emerald-600 via-teal-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-xl transform hover:scale-105 transition-transform duration-300">
              <FaStethoscope className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">Dr. {name}</h1>
              <div className="text-sm text-gray-600 flex items-center gap-1">
                <MdPsychology className="w-4 h-4 text-emerald-500" />
                {t('dashboard.counselor.title')}
                {!loading && !error && (
                  <span className="ml-2 inline-flex items-center gap-1 text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    Connected
                  </span>
                )}
                {error && (
                  <span className="ml-2 inline-flex items-center gap-1 text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    Disconnected
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">

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
      <main className="container py-8 grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
        <Card className="md:col-span-2 border-0 shadow-2xl bg-white/90 backdrop-blur-sm rounded-3xl relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-100/30 via-teal-100/20 to-blue-100/30"></div>
          <CardHeader className="relative z-10">
            <CardTitle className="flex items-center gap-3 text-xl font-bold text-gray-900">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 via-teal-500 to-blue-500 rounded-xl flex items-center justify-center shadow-lg transform hover:scale-105 transition-transform duration-300">
                <FaCalendarAlt className="w-6 h-6 text-white" />
              </div>
              <span className="bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">{t('dashboard.counselor.all_bookings')}</span>
            </CardTitle>
            <div className="flex flex-col sm:flex-row gap-3 mt-4">
              <div className="flex-1">
                <Input
                  placeholder="Search by student name or status..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Bookings</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="accepted">Accepted</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {/* Booking Statistics */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mt-4">
              <div className="text-center p-3 rounded-xl bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200/50">
                <div className="text-lg font-bold text-blue-600">{bookings.filter(b => b.status === 'pending').length}</div>
                <div className="text-xs text-blue-600 font-medium">Pending</div>
              </div>
              <div className="text-center p-3 rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200/50">
                <div className="text-lg font-bold text-green-600">{bookings.filter(b => b.status === 'accepted').length}</div>
                <div className="text-xs text-green-600 font-medium">Accepted</div>
              </div>
              <div className="text-center p-3 rounded-xl bg-gradient-to-r from-purple-50 to-violet-50 border border-purple-200/50">
                <div className="text-lg font-bold text-purple-600">{bookings.filter(b => b.status === 'completed').length}</div>
                <div className="text-xs text-purple-600 font-medium">Completed</div>
              </div>
              <div className="text-center p-3 rounded-xl bg-gradient-to-r from-red-50 to-pink-50 border border-red-200/50">
                <div className="text-lg font-bold text-red-600">{bookings.filter(b => b.status === 'rejected').length}</div>
                <div className="text-xs text-red-600 font-medium">Rejected</div>
              </div>
              <div className="text-center p-3 rounded-xl bg-gradient-to-r from-gray-50 to-slate-50 border border-gray-200/50">
                <div className="text-lg font-bold text-gray-600">{bookings.filter(b => b.status === 'cancelled').length}</div>
                <div className="text-xs text-gray-600 font-medium">Cancelled</div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 relative z-10">
            {loading && (
              <div className="p-6 rounded-2xl border-2 border-dashed border-blue-200 bg-gradient-to-r from-blue-50 to-cyan-50 text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-200 to-cyan-200 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                  <FaCalendarAlt className="w-8 h-8 text-blue-600" />
                </div>
                <p className="text-sm text-blue-600 font-medium">Loading bookings from database...</p>
                <p className="text-xs text-blue-500 mt-1">Please wait while we fetch your data</p>
              </div>
            )}
            {error && (
              <div className="p-6 rounded-2xl border-2 border-dashed border-red-200 bg-gradient-to-r from-red-50 to-pink-50 text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-red-200 to-pink-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaExclamationTriangle className="w-8 h-8 text-red-600" />
                </div>
                <p className="text-sm text-red-600 font-medium">Database Connection Error</p>
                <p className="text-xs text-red-500 mt-1">{error}</p>
                <Button
                  size="sm"
                  variant="outline"
                  className="mt-3 text-red-600 border-red-300 hover:bg-red-50"
                  onClick={() => window.location.reload()}
                >
                  Retry Connection
                </Button>
              </div>
            )}
            {!loading && !error && filteredBookings.length === 0 && bookings.length === 0 && (
              <div className="p-6 rounded-2xl border-2 border-dashed border-emerald-200 bg-gradient-to-r from-emerald-50 to-teal-50 text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-emerald-200 to-teal-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaCalendarAlt className="w-8 h-8 text-emerald-600" />
                </div>
                <p className="text-sm text-emerald-600 font-medium">No bookings yet</p>
                <p className="text-xs text-emerald-500 mt-1">Students will appear here when they book sessions with you</p>
              </div>
            )}
            {!loading && !error && filteredBookings.length === 0 && bookings.length > 0 && (
              <div className="p-6 rounded-2xl border-2 border-dashed border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100 text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaCalendarAlt className="w-8 h-8 text-gray-600" />
                </div>
                <p className="text-sm text-gray-600 font-medium">No bookings match your filters</p>
                <p className="text-xs text-gray-500 mt-1">Try adjusting your search or filter criteria</p>
              </div>
            )}
            {!loading && !error && filteredBookings.map((b) => (
              <div key={b.id} className="p-6 rounded-2xl border-2 bg-gradient-to-r from-white to-emerald-50/50 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-emerald-200/30 to-teal-200/30 rounded-full -translate-y-10 translate-x-10"></div>
                <div className="relative z-10">
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center">
                        <FaUserMd className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-semibold text-gray-900">Anonymous Student</p>
                          <Badge variant={getStatusBadgeVariant(b.status)} className="text-xs">
                            {getStatusIcon(b.status)}
                            <span className="ml-1 capitalize">{b.status}</span>
                          </Badge>
                        </div>
                        <div className="space-y-1">
                          <p className="text-xs text-gray-600 flex items-center gap-1">
                            <FaCalendarAlt className="w-3 h-3" />
                            Scheduled: {formatDate(b.scheduledTime)}
                          </p>
                          {b.createdAt && (
                            <p className="text-xs text-gray-500 flex items-center gap-1">
                              <FaClock className="w-3 h-3" />
                              Booked: {formatDate(b.createdAt.toDate?.() ? b.createdAt.toDate().toISOString() : b.createdAt)}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2">
                      {b.isEmergency && (
                        <span className="inline-flex items-center gap-1 text-red-600 text-xs bg-red-100 px-3 py-1 rounded-full font-medium">
                          <FaExclamationTriangle className="w-3 h-3" />
                          Emergency
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="mt-3 space-y-3">
                    {b.status === 'pending' && (
                      <div className="flex flex-wrap items-center gap-2">
                        <Button
                          size="sm"
                          disabled={loadingActionId === b.id}
                          onClick={() => setShowTimeInput(showTimeInput === b.id ? null : b.id)}
                          className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
                        >
                          <Clock className="w-4 h-4 mr-1" />
                          Set Time & Accept
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={loadingActionId === b.id}
                          onClick={() => handleQuickAccept(b.id)}
                        >
                          Quick Accept
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={loadingActionId === b.id}
                          onClick={async () => {
                            setLoadingActionId(b.id);
                            try {
                              console.log(`Rejecting booking ${b.id}`);
                              await rejectBooking(b.id);
                              console.log('Booking rejected successfully');
                            } catch (error) {
                              console.error('Failed to reject booking:', error);
                              setError('Failed to reject booking. Please try again.');
                            } finally {
                              setLoadingActionId(null);
                            }
                          }}
                          className="text-red-600 hover:text-red-700"
                        >
                          Reject
                        </Button>
                      </div>
                    )}
                    {b.status === 'accepted' && (
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <Badge variant="default" className="bg-green-100 text-green-800">
                            <FaCheckCircle className="w-3 h-3 mr-1" />
                            Session Confirmed
                          </Badge>
                          {b.scheduledTime && (
                            <span className="text-xs text-gray-600">
                              {formatDate(b.scheduledTime)}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            disabled={loadingActionId === b.id}
                            onClick={() => setShowNotesInput(showNotesInput === b.id ? null : b.id)}
                            className="bg-gradient-to-r from-purple-500 to-violet-500 hover:from-purple-600 hover:to-violet-600 text-white border-0"
                          >
                            <FaTrophy className="w-4 h-4 mr-1" />
                            Complete Session
                          </Button>
                        </div>
                      </div>
                    )}
                    {b.status === 'rejected' && (
                      <div className="flex items-center gap-2">
                        <Badge variant="destructive" className="bg-red-100 text-red-800">
                          <FaExclamationTriangle className="w-3 h-3 mr-1" />
                          Booking Rejected
                        </Badge>
                      </div>
                    )}
                    {b.status === 'cancelled' && (
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="bg-gray-100 text-gray-800">
                          <FaClock className="w-3 h-3 mr-1" />
                          Booking Cancelled
                        </Badge>
                      </div>
                    )}
                    {b.status === 'completed' && (
                      <div className="flex items-center gap-2">
                        <Badge variant="default" className="bg-purple-100 text-purple-800">
                          <FaTrophy className="w-3 h-3 mr-1" />
                          Session Completed
                        </Badge>
                        {b.completedAt && (
                          <span className="text-xs text-gray-600">
                            Completed: {formatDate(b.completedAt)}
                          </span>
                        )}
                      </div>
                    )}

                    {showTimeInput === b.id && (
                      <div className="p-3 bg-muted/50 rounded-lg space-y-2">
                        <Label htmlFor={`time-${b.id}`} className="text-sm font-medium">Schedule Time</Label>
                        <div className="flex gap-2">
                          <Input
                            id={`time-${b.id}`}
                            type="datetime-local"
                            value={timeSlot}
                            onChange={(e) => setTimeSlot(e.target.value)}
                            className="flex-1"
                            min={new Date().toISOString().slice(0, 16)}
                          />
                          <Button
                            size="sm"
                            onClick={() => handleAcceptWithTime(b.id)}
                            disabled={!timeSlot.trim() || loadingActionId === b.id}
                            className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
                          >
                            {loadingActionId === b.id ? 'Scheduling...' : 'Confirm'}
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setShowTimeInput(null);
                              setTimeSlot("");
                            }}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    )}

                    {showNotesInput === b.id && (
                      <div className="p-3 bg-muted/50 rounded-lg space-y-2">
                        <Label htmlFor={`notes-${b.id}`} className="text-sm font-medium">Session Notes (Optional)</Label>
                        <div className="space-y-2">
                          <Input
                            id={`notes-${b.id}`}
                            type="text"
                            placeholder="Add session notes or feedback..."
                            value={sessionNotes}
                            onChange={(e) => setSessionNotes(e.target.value)}
                            className="w-full"
                          />
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              onClick={() => handleCompleteSession(b.id)}
                              disabled={loadingActionId === b.id}
                              className="bg-gradient-to-r from-purple-500 to-violet-500 hover:from-purple-600 hover:to-violet-600"
                            >
                              {loadingActionId === b.id ? 'Completing...' : 'Complete Session'}
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setShowNotesInput(null);
                                setSessionNotes("");
                              }}
                            >
                              Cancel
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card className="border-0 shadow-2xl bg-white/90 backdrop-blur-sm rounded-3xl relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-100/30 via-cyan-100/20 to-teal-100/30"></div>
          <CardHeader className="relative z-10">
            <CardTitle className="flex items-center gap-3 text-lg font-bold text-gray-900">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 via-cyan-500 to-teal-500 rounded-xl flex items-center justify-center shadow-lg">
                <FaUsers className="w-5 h-5 text-white" />
              </div>
              <span className="bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">{t('dashboard.counselor.active_students')}</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="relative z-10 text-center">
            <div className="relative w-20 h-20 mx-auto mb-4">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-teal-500 rounded-full flex items-center justify-center shadow-lg">
                <p className="text-2xl font-bold text-white">24</p>
              </div>
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full flex items-center justify-center">
                <FaStar className="w-3 h-3 text-white" />
              </div>
            </div>
            <p className="text-sm text-gray-600 font-medium">Assigned this month</p>
            <p className="text-xs text-blue-600 mt-1">+12% from last month</p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-2xl bg-white/90 backdrop-blur-sm rounded-3xl relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-green-100/30 via-emerald-100/20 to-teal-100/30"></div>
          <CardHeader className="relative z-10">
            <CardTitle className="flex items-center gap-3 text-lg font-bold text-gray-900">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 via-emerald-500 to-teal-500 rounded-xl flex items-center justify-center shadow-lg">
                <FaChartLine className="w-5 h-5 text-white" />
              </div>
              <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">{t('dashboard.counselor.kpi')}</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="relative z-10 grid grid-cols-2 gap-4">
            <div className="text-center p-3 rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200/50">
              <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-2">
                <FaTrophy className="w-4 h-4 text-white" />
              </div>
              <p className="text-xs text-gray-600 font-medium">Avg Improvement</p>
              <p className="text-xl font-bold text-green-600">78%</p>
            </div>
            <div className="text-center p-3 rounded-xl bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200/50">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-2">
                <FaClock className="w-4 h-4 text-white" />
              </div>
              <p className="text-xs text-gray-600 font-medium">Response Time</p>
              <p className="text-xl font-bold text-blue-600">95%</p>
            </div>
          </CardContent>
        </Card>
        <Card className="md:col-span-3 border-0 shadow-large bg-card/70 backdrop-blur">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-accent" /> {t('dashboard.counselor.recent_messages')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="p-4 rounded-xl border">Anonymous: "Thank you for yesterday's session..." • 2m ago</div>
            <div className="p-4 rounded-xl border">Lisa Chen: "I'd like to reschedule..." • 15m ago</div>
            <div className="p-4 rounded-xl border">David Kim: "The breathing exercises helped a lot!" • 1h ago</div>
          </CardContent>
        </Card>
        <Card className="md:col-span-3 border-0 shadow-large bg-card/70 backdrop-blur">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-secondary" /> {t('dashboard.counselor.caseload')}
            </CardTitle>
          </CardHeader>
          <CardContent className="grid sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-primary-soft">Excellent • 8</div>
            <div className="p-4 rounded-xl bg-secondary-soft">Good • 12</div>
            <div className="p-4 rounded-xl bg-accent-soft">Fair • 3</div>
            <div className="p-4 rounded-xl bg-warning-soft">New • 1</div>
          </CardContent>
        </Card>
        <Card className="md:col-span-3 border-0 shadow-large bg-card/70 backdrop-blur">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-primary" /> {t('dashboard.counselor.tasks')}
            </CardTitle>
          </CardHeader>
          <CardContent className="grid sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl border">Review Emma’s progress</div>
            <div className="p-4 rounded-xl border">Prepare group session agenda</div>
            <div className="p-4 rounded-xl border">Respond to 2 unread messages</div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};


