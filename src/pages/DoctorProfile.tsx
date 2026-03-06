
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { getDoctorById, DoctorProfile as DoctorProfileType } from "@/services/doctors";
import { FaUserMd, FaPhone, FaEnvelope, FaClock, FaUniversity, FaArrowLeft } from "react-icons/fa";

const DoctorProfile = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [doctor, setDoctor] = useState<DoctorProfileType | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (id) {
            getDoctorById(id)
                .then((doc) => {
                    setDoctor(doc);
                })
                .catch((error) => {
                    console.error("Failed to load doctor:", error);
                    toast({
                        variant: "destructive",
                        title: "Error",
                        description: "Failed to load doctor profile."
                    });
                })
                .finally(() => setLoading(false));
        }
    }, [id]);

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!doctor) {
        return (
            <div className="flex flex-col items-center justify-center h-screen bg-gray-50 gap-4">
                <h2 className="text-2xl font-bold text-gray-800">Doctor not found</h2>
                <Button onClick={() => navigate(-1)}>Go Back</Button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-6 md:p-12">
            <Button
                variant="ghost"
                onClick={() => navigate(-1)}
                className="mb-6 hover:bg-white/50"
            >
                <FaArrowLeft className="mr-2 h-4 w-4" /> Back
            </Button>

            <div className="max-w-4xl mx-auto">
                <Card className="border-none shadow-xl bg-white/80 backdrop-blur">
                    <CardHeader className="flex flex-col md:flex-row gap-6 items-center p-8 pb-4">
                        <div className="h-32 w-32 rounded-full bg-gradient-to-tr from-primary to-purple-400 flex items-center justify-center shadow-lg">
                            <FaUserMd className="h-16 w-16 text-white" />
                        </div>
                        <div className="text-center md:text-left space-y-2">
                            <CardTitle className="text-3xl font-bold text-gray-900">{doctor.name}</CardTitle>
                            <CardDescription className="text-lg font-medium text-primary uppercase tracking-wide">
                                {doctor.role.replace(/-/g, ' ')}
                            </CardDescription>
                            {doctor.specialization && (
                                <div className="mt-2 text-gray-600 font-medium flex items-center justify-center md:justify-start gap-2">
                                    <span>{doctor.specialization}</span>
                                </div>
                            )}
                        </div>
                        <div className="ml-auto w-full md:w-auto mt-4 md:mt-0">
                            {/* This could link to booking flow specifically for this doctor */}
                            <Button className="w-full md:w-auto h-12 px-8 text-lg shadow-md" onClick={() => navigate('/book-session')}>
                                Book Session
                            </Button>
                        </div>
                    </CardHeader>
                    <Separator className="my-2" />
                    <CardContent className="p-8 pt-6 space-y-8">

                        {/* Bio Section */}
                        <div>
                            <h3 className="text-xl font-semibold mb-3 text-gray-800">About</h3>
                            <p className="text-gray-600 leading-relaxed text-lg">
                                {doctor.bio || "No bio available for this doctor."}
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Availability */}
                            <div className="bg-blue-50/50 p-5 rounded-xl border border-blue-100">
                                <div className="flex items-center gap-3 mb-2 text-blue-700 font-semibold">
                                    <FaClock className="h-5 w-5" />
                                    Availability
                                </div>
                                <p className="text-gray-700">{doctor.availability || "Contact for availability"}</p>
                            </div>

                            {/* Institution (if any) */}
                            {doctor.institution && (
                                <div className="bg-purple-50/50 p-5 rounded-xl border border-purple-100">
                                    <div className="flex items-center gap-3 mb-2 text-purple-700 font-semibold">
                                        <FaUniversity className="h-5 w-5" />
                                        Institution
                                    </div>
                                    <p className="text-gray-700">{doctor.institution}</p>
                                </div>
                            )}
                        </div>

                        {/* Contact Info */}
                        <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 space-y-4">
                            <h3 className="text-lg font-semibold text-gray-800">Contact Information</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {doctor.email && (
                                    <div className="flex items-center gap-3 text-gray-600">
                                        <FaEnvelope className="h-5 w-5 text-gray-400" />
                                        {doctor.email}
                                    </div>
                                )}
                                {doctor.phoneNumber && (
                                    <div className="flex items-center gap-3 text-gray-600">
                                        <FaPhone className="h-5 w-5 text-gray-400" />
                                        {doctor.phoneNumber}
                                    </div>
                                )}
                            </div>
                        </div>

                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default DoctorProfile;
