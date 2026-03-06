import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getName, clearAuth } from "@/lib/auth";
import { signOutUser } from "@/services/auth";
import { useNavigate } from "react-router-dom";
import { Building2, Activity, AlertTriangle, Users, MapPin, Calendar, Clock, CheckCircle2, XCircle } from "lucide-react";
import { FaBuilding, FaUsers, FaChartLine, FaExclamationTriangle, FaMapMarkerAlt, FaCalendarAlt, FaUniversity, FaGraduationCap, FaHeart, FaShieldAlt, FaTrophy, FaStar, FaRocket, FaLightbulb, FaMagic, FaGem, FaCrown, FaAward, FaMedal, FaInfinity, FaRainbow, FaPalette, FaBullseye, FaFlag, FaGlobe, FaHandsHelping, FaClipboardList, FaTasks, FaCheckCircle, FaClock, FaFire, FaLeaf, FaSun, FaMoon } from "react-icons/fa";
import { GiGraduateCap, GiHeartWings, GiPeaceDove, GiLotus, GiYinYang, GiCrystalBall, GiMagicSwirl, GiStarFormation, GiFlowerPot, GiButterfly, GiTreeBranch, GiWaterDrop, GiSunrise, GiSunset, GiMeditation, GiSchoolBag, GiDiploma, GiTrophy, GiMedal, GiCrown, GiMagicLamp, GiPalette, GiGlobe, GiCheckMark, GiFire, GiSun, GiMoon } from "react-icons/gi";
import { MdSchool, MdPsychology, MdHealing, MdFavorite, MdEmojiNature, MdAutoAwesome, MdTrendingUp, MdInsights, MdExplore, MdCelebration, MdLocalFlorist, MdWbSunny, MdNightlight, MdSelfImprovement, MdNature, MdSpa, MdHealthAndSafety, MdSupportAgent, MdVerifiedUser, MdThumbUp, MdEmojiEvents, MdGrade, MdWorkspacePremium, MdGroup, MdAssessment, MdWarning, MdLocationOn, MdEvent, MdBusiness, MdPublic, MdSecurity, MdTrendingUp as MdTrendingUpIcon, MdAnalytics, MdDashboard, MdNotifications, MdSettings, MdHelp, MdInfo, MdCheckCircle, MdSchedule, MdAlarm, MdTimer, MdAccessTime } from "react-icons/md";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  listenBookingsForCounselor,
  acceptBooking,
  rejectBooking,
  completeSession,
  getUserProfileById,
  type Booking
} from "@/services/bookings";

export const OnCampusCounselorDashboard = () => {
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
  const [showNotesInput, setShowNotesInput] = useState<string | null>(null);
  const [sessionNotes, setSessionNotes] = useState("");

  useEffect(() => {
    let unsub: any;

    const setupListener = async () => {
      try {
        setLoading(true);

        unsub = await listenBookingsForCounselor((list) => {
          console.log('Received bookings for on-campus counselor:', list.length);
          setBookings(list);
          setLoading(false);

          // Load student names
          list.forEach(async (b) => {
            if (b.userId && !studentNames[b.userId]) {
              try {
                const profile = await getUserProfileById(b.userId);
                setStudentNames((prev) => ({
                  ...prev,
                  [b.userId]: profile?.name || 'Student'
                }));
              } catch (err) {
                console.error('Failed to load student profile:', err);
                setStudentNames((prev) => ({
                  ...prev,
                  [b.userId]: 'Student'
                }));
              }
            }
          });
        });
      } catch (err) {
        console.error('Failed to setup listener:', err);
        setLoading(false);
      }
    };

    setupListener();

    return () => {
      if (unsub) {
        unsub();
      }
    };
  }, []);

  const handleAcceptWithTime = async (bookingId: string) => {
    if (!timeSlot.trim()) return;

    setLoadingActionId(bookingId);
    try {
      await acceptBooking(bookingId, timeSlot);
      setShowTimeInput(null);
      setTimeSlot("");
    } catch (error) {
      console.error('Failed to accept booking:', error);
    } finally {
      setLoadingActionId(null);
    }
  };

  const handleQuickAccept = async (bookingId: string) => {
    setLoadingActionId(bookingId);
    try {
      const defaultTime = new Date();
      defaultTime.setHours(defaultTime.getHours() + 24);
      await acceptBooking(bookingId, defaultTime.toISOString());
    } catch (error) {
      console.error('Failed to quick accept booking:', error);
    } finally {
      setLoadingActionId(null);
    }
  };

  const handleRejectBooking = async (bookingId: string) => {
    setLoadingActionId(bookingId);
    try {
      await rejectBooking(bookingId);
    } catch (error) {
      console.error('Failed to reject booking:', error);
    } finally {
      setLoadingActionId(null);
    }
  };

  const handleCompleteSession = async (bookingId: string) => {
    setLoadingActionId(bookingId);
    try {
      await completeSession(bookingId, sessionNotes);
      setShowNotesInput(null);
      setSessionNotes("");
    } catch (error) {
      console.error('Failed to complete session:', error);
    } finally {
      setLoadingActionId(null);
    }
  };

  const filteredBookings = bookings.filter(booking => {
    const matchesStatus = statusFilter === "all" || booking.status === statusFilter;
    const studentName = studentNames[booking.userId] || 'Student';
    const matchesSearch = searchTerm === "" ||
      studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.status.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

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

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Not scheduled';
    try {
      return new Date(dateString).toLocaleString();
    } catch {
      return 'Invalid date';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 via-pink-50 to-purple-100 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-12 left-12 w-28 h-28 bg-gradient-to-r from-orange-300 to-red-300 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute top-36 right-28 w-24 h-24 bg-gradient-to-r from-pink-300 to-purple-300 rounded-full opacity-20 animate-bounce"></div>
        <div className="absolute bottom-28 left-1/4 w-20 h-20 bg-gradient-to-r from-red-300 to-orange-300 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute bottom-52 right-1/3 w-22 h-22 bg-gradient-to-r from-purple-300 to-pink-300 rounded-full opacity-20 animate-bounce"></div>
      </div>

      <header className="bg-white/95 backdrop-blur-md border-b border-gradient-to-r from-orange-200/50 to-pink-200/50 shadow-lg relative z-10">
        <div className="container h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-600 via-red-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-xl transform hover:scale-105 transition-transform duration-300">
              <FaUniversity className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent">{name}</h1>
              <p className="text-sm text-gray-600 flex items-center gap-1">
                <MdSchool className="w-4 h-4 text-orange-500" />
                On-Campus Counselor
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button
              onClick={() => navigate('/profile')}
              className="bg-gradient-to-r from-orange-600 to-pink-600 text-white hover:from-orange-700 hover:to-pink-700 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
            >
              <Users className="w-4 h-4 mr-2" />
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

      <main className="container py-8 grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
        {/* Session Management Section */}
        <Card className="md:col-span-3 border-0 shadow-2xl bg-white/90 backdrop-blur-sm rounded-3xl relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-orange-100/30 via-red-100/20 to-pink-100/30"></div>
          <CardHeader className="relative z-10">
            <CardTitle className="flex items-center gap-3 text-xl font-bold text-gray-900">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 via-red-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                <FaCalendarAlt className="w-6 h-6 text-white" />
              </div>
              <span className="bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent">Session Management</span>
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
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full sm:w-48 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="all">All Bookings</option>
                <option value="pending">Pending</option>
                <option value="accepted">Accepted</option>
                <option value="completed">Completed</option>
                <option value="rejected">Rejected</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mt-4">
              <div className="text-center p-3 rounded-xl bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200/50">
                <div className="text-lg font-bold text-orange-600">{bookings.filter(b => b.status === 'pending').length}</div>
                <div className="text-xs text-orange-600 font-medium">Pending</div>
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
          <CardContent className="relative z-10 space-y-4">
            {loading && (
              <div className="p-6 rounded-2xl border-2 border-dashed border-orange-200 bg-gradient-to-r from-orange-50 to-red-50 text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-orange-200 to-red-200 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                  <FaCalendarAlt className="w-8 h-8 text-orange-600" />
                </div>
                <p className="text-sm text-orange-600 font-medium">Loading sessions...</p>
              </div>
            )}

            {!loading && filteredBookings.length === 0 && (
              <div className="p-6 rounded-2xl border-2 border-dashed border-orange-200 bg-gradient-to-r from-orange-50 to-red-50 text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-orange-200 to-red-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaCalendarAlt className="w-8 h-8 text-orange-600" />
                </div>
                <p className="text-sm text-orange-600 font-medium">No sessions found</p>
                <p className="text-xs text-orange-500 mt-1">Students will appear here when they book sessions</p>
              </div>
            )}

            {!loading && filteredBookings.map((b) => (
              <div key={b.id} className="p-6 rounded-2xl border-2 bg-gradient-to-r from-white to-orange-50/50 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-orange-200/30 to-red-200/30 rounded-full -translate-y-10 translate-x-10"></div>
                <div className="relative z-10">
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center">
                        <MdSupportAgent className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-semibold text-gray-900">{studentNames[b.userId] || 'Student'}</p>
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
                              Booked: {formatDate(b.createdAt)}
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
                          onClick={() => handleRejectBooking(b.id)}
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

                    {showTimeInput === b.id && (
                      <div className="p-3 bg-orange-50 rounded-lg space-y-2">
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
                      <div className="p-3 bg-orange-50 rounded-lg space-y-2">
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

        {/* Original Dashboard Cards */}
        <Card className="border-0 shadow-2xl bg-white/90 backdrop-blur-sm rounded-3xl relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-orange-100/30 via-red-100/20 to-pink-100/30"></div>
          <CardHeader className="relative z-10">
            <CardTitle className="flex items-center gap-3 text-lg font-bold text-gray-900">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 via-red-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                <FaUsers className="w-5 h-5 text-white" />
              </div>
              <span className="bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent">Campus Users</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="relative z-10 text-center">
            <div className="relative w-20 h-20 mx-auto mb-4">
              <div className="w-20 h-20 bg-gradient-to-r from-orange-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg">
                <p className="text-xl font-bold text-white">1.2K</p>
              </div>
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full flex items-center justify-center">
                <FaStar className="w-3 h-3 text-white" />
              </div>
            </div>
            <p className="text-sm text-gray-600 font-medium">Total students</p>
            <p className="text-xs text-orange-600 mt-1">Active this semester</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-2xl bg-white/90 backdrop-blur-sm rounded-3xl relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-green-100/30 via-emerald-100/20 to-teal-100/30"></div>
          <CardHeader className="relative z-10">
            <CardTitle className="flex items-center gap-3 text-lg font-bold text-gray-900">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 via-emerald-500 to-teal-500 rounded-xl flex items-center justify-center shadow-lg">
                <FaChartLine className="w-5 h-5 text-white" />
              </div>
              <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">Weekly Growth</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="relative z-10 text-center">
            <div className="relative w-20 h-20 mx-auto mb-4">
              <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center shadow-lg">
                <p className="text-xl font-bold text-white">+12%</p>
              </div>
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-yellow-400 to-green-400 rounded-full flex items-center justify-center">
                <FaRocket className="w-3 h-3 text-white" />
              </div>
            </div>
            <p className="text-sm text-gray-600 font-medium">Engagement</p>
            <p className="text-xs text-green-600 mt-1">Growing strong! 📈</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-2xl bg-white/90 backdrop-blur-sm rounded-3xl relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-red-100/30 via-orange-100/20 to-yellow-100/30"></div>
          <CardHeader className="relative z-10">
            <CardTitle className="flex items-center gap-3 text-lg font-bold text-gray-900">
              <div className="w-10 h-10 bg-gradient-to-br from-red-500 via-orange-500 to-yellow-500 rounded-xl flex items-center justify-center shadow-lg">
                <FaExclamationTriangle className="w-5 h-5 text-white" />
              </div>
              <span className="bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">Crisis Alerts</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="relative z-10 text-center">
            <div className="relative w-20 h-20 mx-auto mb-4">
              <div className="w-20 h-20 bg-gradient-to-r from-red-500 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
                <p className="text-xl font-bold text-white">3</p>
              </div>
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-yellow-400 to-red-400 rounded-full flex items-center justify-center">
                <FaShieldAlt className="w-3 h-3 text-white" />
              </div>
            </div>
            <p className="text-sm text-gray-600 font-medium">Requires attention</p>
            <p className="text-xs text-red-600 mt-1">Priority cases</p>
          </CardContent>
        </Card>

        <Card className="md:col-span-2 border-0 shadow-2xl bg-white/90 backdrop-blur-sm rounded-3xl relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-100/30 via-pink-100/20 to-orange-100/30"></div>
          <CardHeader className="relative z-10">
            <CardTitle className="flex items-center gap-3 text-xl font-bold text-gray-900">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
                <FaMapMarkerAlt className="w-6 h-6 text-white" />
              </div>
              <span className="bg-gradient-to-r from-purple-600 to-orange-600 bg-clip-text text-transparent">Departments</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="relative z-10 grid sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl border-2 bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200/50 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
                  <FaBuilding className="w-4 h-4 text-white" />
                </div>
                <span className="font-semibold text-gray-900">Engineering</span>
              </div>
              <p className="text-sm text-gray-600">Wellness 68% • Alerts 2</p>
            </div>
            <div className="p-4 rounded-2xl border-2 bg-gradient-to-r from-green-50 to-emerald-50 border-green-200/50 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                  <FaGraduationCap className="w-4 h-4 text-white" />
                </div>
                <span className="font-semibold text-gray-900">Business</span>
              </div>
              <p className="text-sm text-gray-600">Wellness 76% • Alerts 0</p>
            </div>
            <div className="p-4 rounded-2xl border-2 bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200/50 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                  <FaHeart className="w-4 h-4 text-white" />
                </div>
                <span className="font-semibold text-gray-900">Liberal Arts</span>
              </div>
              <p className="text-sm text-gray-600">Wellness 79% • Alerts 1</p>
            </div>
            <div className="p-4 rounded-2xl border-2 bg-gradient-to-r from-orange-50 to-red-50 border-orange-200/50 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center">
                  <FaLightbulb className="w-4 h-4 text-white" />
                </div>
                <span className="font-semibold text-gray-900">Sciences</span>
              </div>
              <p className="text-sm text-gray-600">Wellness 71% • Alerts 0</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-2xl bg-white/90 backdrop-blur-sm rounded-3xl relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-100/30 via-cyan-100/20 to-teal-100/30"></div>
          <CardHeader className="relative z-10">
            <CardTitle className="flex items-center gap-3 text-lg font-bold text-gray-900">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 via-cyan-500 to-teal-500 rounded-xl flex items-center justify-center shadow-lg">
                <FaCalendarAlt className="w-5 h-5 text-white" />
              </div>
              <span className="bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">Upcoming Events</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="relative z-10 space-y-3">
            <div className="p-4 rounded-xl border-2 bg-gradient-to-r from-green-50 to-emerald-50 border-green-200/50 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                  <FaHeart className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Mental Health Week</p>
                  <p className="text-sm text-gray-600">Next Monday</p>
                </div>
              </div>
            </div>
            <div className="p-4 rounded-xl border-2 bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200/50 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
                  <FaShieldAlt className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Stress Workshop</p>
                  <p className="text-sm text-gray-600">Wednesday</p>
                </div>
              </div>
            </div>
            <div className="p-4 rounded-xl border-2 bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200/50 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                  <FaTrophy className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Counselor Training</p>
                  <p className="text-sm text-gray-600">Friday</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-3 border-0 shadow-2xl bg-white/90 backdrop-blur-sm rounded-3xl relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-100/30 via-teal-100/20 to-blue-100/30"></div>
          <CardHeader className="relative z-10">
            <CardTitle className="flex items-center gap-3 text-xl font-bold text-gray-900">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 via-teal-500 to-blue-500 rounded-xl flex items-center justify-center shadow-lg">
                <FaChartLine className="w-6 h-6 text-white" />
              </div>
              <span className="bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">Campus KPIs</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="relative z-10 grid sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200/50 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <FaHeart className="w-6 h-6 text-white" />
              </div>
              <p className="text-sm text-gray-600 font-medium">Avg Wellness</p>
              <p className="text-2xl font-bold text-green-600">72%</p>
            </div>
            <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-50 to-cyan-50 border-2 border-blue-200/50 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <FaUsers className="w-6 h-6 text-white" />
              </div>
              <p className="text-sm text-gray-600 font-medium">Active Users</p>
              <p className="text-2xl font-bold text-blue-600">456</p>
            </div>
            <div className="p-4 rounded-2xl bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-200/50 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <FaClock className="w-6 h-6 text-white" />
              </div>
              <p className="text-sm text-gray-600 font-medium">Response SLA</p>
              <p className="text-2xl font-bold text-yellow-600">95%</p>
            </div>
            <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200/50 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <FaShieldAlt className="w-6 h-6 text-white" />
              </div>
              <p className="text-sm text-gray-600 font-medium">Crisis Resolved</p>
              <p className="text-2xl font-bold text-purple-600">94%</p>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};