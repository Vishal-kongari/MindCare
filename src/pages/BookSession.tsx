import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { createBooking } from "@/services/bookings";
import { signOutUser } from "@/services/auth";
import { getName } from "@/lib/auth";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

import { FaCalendarAlt, FaClock, FaUser, FaSearch, FaArrowLeft, FaEnvelope, FaPhone, FaUniversity } from "react-icons/fa";
import { GiMeditation } from "react-icons/gi";
import { getDoctors, DoctorProfile } from "@/services/doctors";

export const BookSession = () => {
  const navigate = useNavigate();
  const name = getName();
  const [counselors, setCounselors] = useState<DoctorProfile[]>([]);
  const [filteredCounselors, setFilteredCounselors] = useState<DoctorProfile[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [bookingLoading, setBookingLoading] = useState<string | null>(null);
  const [selectedDoctor, setSelectedDoctor] = useState<DoctorProfile | null>(null);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const doctors = await getDoctors();
        setCounselors(doctors);
        setFilteredCounselors(doctors);
      } catch (error) {
        console.error('Failed to load counselors:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load counselors. Please try again."
        });
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredCounselors(counselors);
    } else {
      const filtered = counselors.filter(counselor =>
        counselor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        counselor.specialization?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        counselor.role.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredCounselors(filtered);
    }
  }, [searchTerm, counselors]);

  const handleBookSession = async (counselorId: string, counselorName: string) => {
    setBookingLoading(counselorId);
    try {
      console.log('Booking session with:', counselorId, counselorName);

      // Simulate API call (replace with actual createBooking call)
      await new Promise(resolve => setTimeout(resolve, 1000));
      // const bookingId = await createBooking(counselorId);

      toast({
        title: "Booking Request Sent",
        description: `Your session request has been sent to ${counselorName}. They will contact you to confirm the time.`
      });

      setSelectedDoctor(null); // Close modal if open
      setTimeout(() => navigate('/student-dashboard'), 1500);

    } catch (error) {
      console.error('Booking failed:', error);
      toast({
        variant: "destructive",
        title: "Booking Failed",
        description: "Failed to book session. Please try again."
      });
    } finally {
      setBookingLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <header className="bg-white/95 backdrop-blur-md border-b shadow-lg">
        <div className="container h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => navigate('/student-dashboard')}
              className="flex items-center gap-2"
            >
              <FaArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </Button>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Book a Session
              </h1>
              <p className="text-sm text-gray-600">Hello, {name}</p>
            </div>
          </div>
          <Button
            variant="outline"
            onClick={async () => { await signOutUser(); navigate('/'); }}
            className="border-gray-300 hover:border-red-500 hover:bg-red-50 hover:text-red-600"
          >
            Sign Out
          </Button>
        </div>
      </header>

      <main className="container py-8">
        <Card className="border-0 shadow-2xl bg-white/90 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-2xl font-bold">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                <FaCalendarAlt className="w-6 h-6 text-white" />
              </div>
              Available Counselors
            </CardTitle>
            <p className="text-sm text-gray-600 mt-2">
              Choose a counselor to view details and book a session.
            </p>
          </CardHeader>
          <CardContent>
            {/* Search Bar */}
            <div className="relative mb-6">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="h-5 w-5 text-gray-400" />
              </div>
              <Input
                type="text"
                placeholder="Search counselors by name or specialization..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-6 text-lg border-2 border-gray-200 focus:border-blue-500"
              />
            </div>

            {loading && (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading available counselors...</p>
              </div>
            )}

            {!loading && filteredCounselors.length === 0 && (
              <div className="text-center py-12">
                <GiMeditation className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 text-lg mb-2">No counselors found</p>
                <p className="text-gray-500">Try adjusting your search terms</p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCounselors.map((counselor) => (
                <Card
                  key={counselor.id}
                  className="border-2 hover:border-blue-300 hover:shadow-lg transition-all duration-300 cursor-pointer group"
                  onClick={() => setSelectedDoctor(counselor)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-16 h-16 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                        <FaUser className="w-8 h-8 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg hover:text-blue-600 transition-colors">
                          {counselor.name}
                        </h3>
                        <p className="text-sm text-gray-600 capitalize">
                          {counselor.role.replace(/-/g, ' ')}
                        </p>
                      </div>
                    </div>

                    {counselor.specialization && (
                      <div className="mb-4">
                        <Label className="text-sm font-medium text-gray-700">Specialization</Label>
                        <p className="text-sm text-gray-600 line-clamp-2">{counselor.specialization}</p>
                      </div>
                    )}

                    <Button
                      variant="outline"
                      className="w-full mt-2 border-blue-200 text-blue-700 hover:bg-blue-50"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedDoctor(counselor);
                      }}
                    >
                      View Profile
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Doctor Details Dialog */}
        <Dialog open={!!selectedDoctor} onOpenChange={(open) => !open && setSelectedDoctor(null)}>
          <DialogContent className="max-w-2xl overflow-y-auto max-h-[90vh]">
            {selectedDoctor && (
              <>
                <DialogHeader className="flex flex-col items-center sm:items-start border-b pb-4 mb-4">
                  <div className="flex flex-col sm:flex-row items-center gap-4 w-full">
                    <div className="h-24 w-24 rounded-full bg-gradient-to-tr from-primary to-purple-400 flex items-center justify-center shadow-md shrink-0">
                      <FaUser className="h-10 w-10 text-white" />
                    </div>
                    <div className="text-center sm:text-left space-y-1 flex-1">
                      <DialogTitle className="text-2xl font-bold">{selectedDoctor.name}</DialogTitle>
                      <DialogDescription className="text-base font-medium text-primary uppercase tracking-wide">
                        {selectedDoctor.role.replace(/-/g, ' ')}
                      </DialogDescription>
                      {selectedDoctor.specialization && (
                        <Badge variant="secondary" className="mt-2">
                          {selectedDoctor.specialization}
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
                      {selectedDoctor.bio || "No bio available."}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Availability */}
                    <div className="bg-blue-50 p-4 rounded-lg flex items-start gap-3">
                      <FaClock className="h-5 w-5 text-blue-600 mt-0.5" />
                      <div>
                        <h5 className="font-semibold text-blue-900 text-sm">Availability</h5>
                        <p className="text-sm text-blue-700">{selectedDoctor.availability || "Contact for details"}</p>
                      </div>
                    </div>

                    {/* Institution */}
                    {selectedDoctor.institution && (
                      <div className="bg-purple-50 p-4 rounded-lg flex items-start gap-3">
                        <FaUniversity className="h-5 w-5 text-purple-600 mt-0.5" />
                        <div>
                          <h5 className="font-semibold text-purple-900 text-sm">Institution</h5>
                          <p className="text-sm text-purple-700">{selectedDoctor.institution}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Contact Info */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {selectedDoctor.email && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <FaEnvelope className="text-gray-400" /> {selectedDoctor.email}
                      </div>
                    )}
                    {selectedDoctor.phoneNumber && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <FaPhone className="text-gray-400" /> {selectedDoctor.phoneNumber}
                      </div>
                    )}
                  </div>

                  <Separator />

                  <Button
                    className="w-full h-12 text-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    onClick={() => handleBookSession(selectedDoctor.id, selectedDoctor.name)}
                    disabled={bookingLoading === selectedDoctor.id}
                  >
                    {bookingLoading === selectedDoctor.id ? (
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
      </main>
    </div>
  );
};