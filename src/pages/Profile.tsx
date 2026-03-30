
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "@/hooks/use-toast";
import { getAuthInstance, getDb } from "@/lib/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { FaCamera, FaArrowLeft, FaSave, FaUser, FaIdBadge, FaStethoscope, FaUniversity, FaClock, FaVenusMars, FaClipboardList } from "react-icons/fa";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { getStudentMedicalReviews, type MedicalReview } from "@/services/bookings";

interface UserProfile {
    name: string;
    email: string;
    role: string;
    bio?: string;
    specialization?: string; // For doctors
    availability?: string; // For doctors
    institution?: string; // For campus counselors
    phoneNumber?: string;
    photoURL?: string;
    gender?: "male" | "female" | "other";
}

const compressImage = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (event) => {
            const img = new Image();
            img.src = event.target?.result as string;
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const MAX_WIDTH = 500;
                const MAX_HEIGHT = 500;
                let width = img.width;
                let height = img.height;

                if (width > height) {
                    if (width > MAX_WIDTH) {
                        height *= MAX_WIDTH / width;
                        width = MAX_WIDTH;
                    }
                } else {
                    if (height > MAX_HEIGHT) {
                        width *= MAX_HEIGHT / height;
                        height = MAX_HEIGHT;
                    }
                }

                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                ctx?.drawImage(img, 0, 0, width, height);
                // Compress to JPEG with 0.7 quality
                resolve(canvas.toDataURL('image/jpeg', 0.7));
            };
            img.onerror = (error) => reject(error);
        };
        reader.onerror = (error) => reject(error);
    });
};

const Profile = () => {
    const navigate = useNavigate();
    const [profile, setProfile] = useState<UserProfile>({
        name: "",
        email: "",
        role: "student",
        gender: "male"
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [userId, setUserId] = useState<string | null>(null);
    const [medicalReviews, setMedicalReviews] = useState<MedicalReview[]>([]);
    const [loadingReviews, setLoadingReviews] = useState(false);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const auth = await getAuthInstance();
                const user = auth.currentUser;
                if (!user) {
                    navigate('/login');
                    return;
                }
                setUserId(user.uid);

                const db = await getDb();
                const docRef = doc(db, "users", user.uid);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    setProfile({ ...docSnap.data() as UserProfile });
                } else {
                    // Fallback to auth data if firestore doc doesn't exist
                    setProfile({
                        name: user.displayName || "",
                        email: user.email || "",
                        role: "student",
                        photoURL: user.photoURL || undefined
                    });
                }

                const userRole = docSnap.exists() ? docSnap.data().role : "student";
                if (userRole === 'student') {
                    setLoadingReviews(true);
                    try {
                        const reviews = await getStudentMedicalReviews(user.uid);
                        setMedicalReviews(reviews);
                    } catch (err) {
                        console.error("Error fetching reviews", err);
                    } finally {
                        setLoadingReviews(false);
                    }
                }
            } catch (error) {
                console.error("Error fetching profile:", error);
                toast({
                    variant: "destructive",
                    title: "Error",
                    description: "Failed to load profile data."
                });
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [navigate]);

    const handleSave = async () => {
        if (!userId) return;
        setSaving(true);
        try {
            const db = await getDb();
            const userRef = doc(db, "users", userId);

            // Update Firestore
            await updateDoc(userRef, {
                name: profile.name,
                bio: profile.bio || "",
                specialization: profile.specialization || "",
                availability: profile.availability || "",
                institution: profile.institution || "",
                gender: profile.gender || "male",
                photoURL: profile.photoURL || ""
            });

            // Also update Auth profile if name changed
            const auth = await getAuthInstance();
            if (auth.currentUser && profile.name !== auth.currentUser.displayName) {
                // We can't update photoURL here easily with base64 as it might be too long for Auth profile sometimes,
                // or strict url validation. But mostly it works if it's a valid data url.
                // Let's try only updating name to be safe, or both.
                // updateProfile(auth.currentUser, { displayName: profile.name });
            }

            toast({
                title: "Success",
                description: "Profile updated successfully!"
            });
        } catch (error) {
            console.error("Error saving profile:", error);
            toast({
                variant: "destructive",
                title: "Error",
                description: "Failed to update profile."
            });
        } finally {
            setSaving(false);
        }
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !userId) return;

        // Check file size (e.g. limit to 2MB before compression)
        if (file.size > 2 * 1024 * 1024) {
            toast({
                variant: "destructive",
                title: "File too large",
                description: "Please select an image under 2MB."
            });
            return;
        }

        setUploading(true);
        try {
            // Compress and convert to Base64
            const base64String = await compressImage(file);

            // Optimistically update state
            setProfile(prev => ({ ...prev, photoURL: base64String }));

            // Save to Firestore immediately
            const db = await getDb();
            await updateDoc(doc(db, "users", userId), {
                photoURL: base64String
            });

            toast({
                title: "Success",
                description: "Profile picture updated!"
            });
        } catch (error) {
            console.error("Error uploading image:", error);
            toast({
                variant: "destructive",
                title: "Error",
                description: "Failed to upload image. Try a smaller file."
            });
        } finally {
            setUploading(false);
        }
    };

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <Button
                    variant="ghost"
                    onClick={() => navigate(-1)}
                    className="mb-6 hover:bg-white/50"
                >
                    <FaArrowLeft className="mr-2" /> Back
                </Button>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Left Column - Profile Card */}
                    <Card className="md:col-span-1 shadow-xl border-0 bg-white/80 backdrop-blur">
                        <CardHeader className="text-center pb-2">
                            <CardTitle>Profile Picture</CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-col items-center gap-6">
                            <div className="relative group">
                                <Avatar className="h-40 w-40 border-4 border-white shadow-2xl cursor-pointer ring-4 ring-blue-50">
                                    <AvatarImage src={profile.photoURL} className="object-cover" />
                                    <AvatarFallback className="text-5xl bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                                        {profile.name.charAt(0).toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>
                                <div
                                    className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer backdrop-blur-sm"
                                    onClick={() => fileInputRef.current?.click()}
                                >
                                    <FaCamera className="text-white text-3xl drop-shadow-lg" />
                                </div>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    className="hidden"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                />
                            </div>
                            <div className="text-center">
                                <h3 className="font-bold text-xl text-gray-900">{profile.name}</h3>
                                <p className="text-sm text-gray-500 capitalize">{profile.role.replace('-', ' ')}</p>
                            </div>

                            {uploading && (
                                <div className="text-sm text-blue-600 animate-pulse font-medium">
                                    Processing image...
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Right Column - Details Form */}
                    <Card className="md:col-span-2 shadow-xl border-0 bg-white/80 backdrop-blur">
                        <CardHeader className="border-b bg-gray-50/50">
                            <CardTitle className="flex items-center gap-2 text-primary">
                                <FaIdBadge /> Edit Profile Details
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6 pt-6">
                            <div className="grid grid-cols-1 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="name" className="flex items-center gap-2">
                                        <FaUser className="text-gray-400" /> Full Name
                                    </Label>
                                    <Input
                                        id="name"
                                        value={profile.name}
                                        onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                                        className="bg-white/50"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label className="flex items-center gap-2">
                                        <FaVenusMars className="text-gray-400" /> Gender
                                    </Label>
                                    <RadioGroup
                                        value={profile.gender}
                                        onValueChange={(value: "male" | "female" | "other") => setProfile({ ...profile, gender: value })}
                                        className="flex gap-6"
                                    >
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="male" id="male" className="text-blue-600" />
                                            <Label htmlFor="male" className="cursor-pointer">Male</Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="female" id="female" className="text-pink-600" />
                                            <Label htmlFor="female" className="cursor-pointer">Female</Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="other" id="other" className="text-purple-600" />
                                            <Label htmlFor="other" className="cursor-pointer">Other</Label>
                                        </div>
                                    </RadioGroup>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="bio" className="flex items-center gap-2">
                                        <FaUser className="text-gray-400" /> Bio (Short Description)
                                    </Label>
                                    <Textarea
                                        id="bio"
                                        placeholder="Tell us a bit about yourself..."
                                        value={profile.bio}
                                        onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                                        className="min-h-[100px] bg-white/50 resize-none"
                                    />
                                </div>

                                {profile.role !== 'student' && (
                                    <>
                                        <div className="space-y-2">
                                            <Label htmlFor="specialization" className="flex items-center gap-2">
                                                <FaStethoscope className="text-gray-400" /> Specialization
                                            </Label>
                                            <Input
                                                id="specialization"
                                                placeholder="e.g. Clinical Psychologist, Stress Management"
                                                value={profile.specialization}
                                                onChange={(e) => setProfile({ ...profile, specialization: e.target.value })}
                                                className="bg-white/50"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="availability" className="flex items-center gap-2">
                                                <FaClock className="text-gray-400" /> Availability
                                            </Label>
                                            <Input
                                                id="availability"
                                                placeholder="e.g. Mon-Fri 9AM-5PM"
                                                value={profile.availability}
                                                onChange={(e) => setProfile({ ...profile, availability: e.target.value })}
                                                className="bg-white/50"
                                            />
                                        </div>
                                    </>
                                )}

                                {profile.role === 'on-campus-counselor' && (
                                    <div className="space-y-2">
                                        <Label htmlFor="institution" className="flex items-center gap-2">
                                            <FaUniversity className="text-gray-400" /> Institution Name
                                        </Label>
                                        <Input
                                            id="institution"
                                            placeholder="e.g. University Health Center"
                                            value={profile.institution}
                                            onChange={(e) => setProfile({ ...profile, institution: e.target.value })}
                                            className="bg-white/50"
                                        />
                                    </div>
                                )}
                            </div>

                            <Button
                                onClick={handleSave}
                                disabled={saving}
                                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg h-12 text-lg mt-4"
                            >
                                {saving ? (
                                    <>Saving...</>
                                ) : (
                                    <><FaSave className="mr-2" /> Save Changes</>
                                )}
                            </Button>
                        </CardContent>
                    </Card>
                </div>

                {profile.role === 'student' && (
                    <div className="mt-8">
                        <Card className="shadow-xl border-0 bg-white/80 backdrop-blur">
                            <CardHeader className="border-b bg-gray-50/50">
                                <CardTitle className="flex items-center gap-2 text-primary">
                                    <FaClipboardList /> Medical Reviews (Feedback from Counselors)
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="pt-6 space-y-4 max-h-[400px] overflow-y-auto">
                                {loadingReviews ? (
                                    <div className="text-center py-4 text-gray-500">Loading reviews...</div>
                                ) : medicalReviews.length === 0 ? (
                                    <div className="text-center py-4 text-gray-500">You don't have any medical reviews yet.</div>
                                ) : (
                                    medicalReviews.map((review) => (
                                        <div key={review.id} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                                            <div className="flex justify-between items-start mb-2">
                                                <span className="font-semibold text-sm text-gray-900">{review.counselorName}</span>
                                                <span className="text-xs text-gray-500">{new Date(review.date).toLocaleDateString()}</span>
                                            </div>
                                            <p className="text-sm text-gray-700 whitespace-pre-wrap">{review.notes}</p>
                                        </div>
                                    ))
                                )}
                            </CardContent>
                        </Card>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Profile;

