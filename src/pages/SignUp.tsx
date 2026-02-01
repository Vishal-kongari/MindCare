import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Heart, GraduationCap, Building2, User, Phone, Mail, Lock, Sparkles, ArrowRight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { setRole, setName } from "@/lib/auth";
import { signUpEmail } from "@/services/auth";
import { useTranslation } from "react-i18next";

const SignUp = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  // Common fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Student fields
  const [studentName, setStudentName] = useState("");
  const [studentPhone, setStudentPhone] = useState("");
  const [institution, setInstitution] = useState("");
  const [guardian, setGuardian] = useState("");
  const [guardianPhone, setGuardianPhone] = useState("");
  const [hobbies, setHobbies] = useState("");
  const [course, setCourse] = useState("");

  // Counselor fields
  const [cName, setCName] = useState("");
  const [cPhone, setCPhone] = useState("");
  const [cInfo, setCInfo] = useState("");

  // On-campus counselor fields
  const [ocName, setOcName] = useState("");
  const [ocPhone, setOcPhone] = useState("");
  const [ocInstitution, setOcInstitution] = useState("");

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 flex items-center justify-center p-4 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-blue-400/20 to-indigo-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-green-400/10 to-teal-400/10 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '4s' }} />
      </div>

      <div className="w-full max-w-2xl relative z-10">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-600 to-pink-600 rounded-3xl mb-6 shadow-2xl">
            <Heart className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">{t('signup.mainTitle')}</h1>
          <p className="text-gray-600 text-lg">{t('signup.mainSubtitle')}</p>
        </div>

        <Card className="border-0 shadow-2xl bg-white/80 backdrop-blur-sm rounded-3xl overflow-hidden">
          <div className="h-2 bg-gradient-to-r from-purple-500 to-pink-500" />
          <CardHeader className="pb-6 pt-8">
            <CardTitle className="text-2xl font-bold text-gray-900 text-center">{t('signup.header')}</CardTitle>
            <CardDescription className="text-center text-gray-600">{t('signup.desc')}</CardDescription>
          </CardHeader>
          <CardContent className="px-8 pb-8">
            <Tabs defaultValue="student" className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-8 bg-gray-100 p-1 rounded-xl">
                <TabsTrigger value="student" className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-lg transition-all">
                  <GraduationCap className="w-4 h-4" /> {t('signup.role_student')}
                </TabsTrigger>
                <TabsTrigger value="counselor" className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-lg transition-all">
                  <User className="w-4 h-4" /> {t('signup.role_counselor')}
                </TabsTrigger>
                <TabsTrigger value="on-campus" className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-lg transition-all">
                  <Building2 className="w-4 h-4" /> {t('signup.role_campus')}
                </TabsTrigger>
              </TabsList>

              {/* Student */}
              <TabsContent value="student" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="sName">{t('signup.fullname')}</Label>
                    <div className="relative">
                      <User className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                      <Input id="sName" placeholder="Your full name" value={studentName} onChange={(e) => setStudentName(e.target.value)} className="h-12 pl-12 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-0 transition-colors" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sEmail" className="text-sm font-semibold text-gray-700">{t('signup.email')}</Label>
                    <div className="relative">
                      <Mail className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                      <Input id="sEmail" type="email" placeholder="you@university.edu" value={email} onChange={(e) => setEmail(e.target.value)} className="h-12 pl-12 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-0 transition-colors" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sPassword" className="text-sm font-semibold text-gray-700">{t('signup.password')}</Label>
                    <div className="relative">
                      <Lock className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                      <Input id="sPassword" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} className="h-12 pl-12 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-0 transition-colors" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sPhone">{t('signup.phone')}</Label>
                    <div className="relative">
                      <Phone className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                      <Input id="sPhone" type="tel" placeholder="+91 98765 43210" value={studentPhone} onChange={(e) => setStudentPhone(e.target.value)} className="h-11 pl-10" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="institution">{t('signup.institution')}</Label>
                    <div className="relative">
                      <Building2 className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                      <Input id="institution" placeholder="University / College" value={institution} onChange={(e) => setInstitution(e.target.value)} className="h-11 pl-10" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="guardian">{t('signup.guardian')}</Label>
                    <Input id="guardian" placeholder="Parent/Guardian full name" value={guardian} onChange={(e) => setGuardian(e.target.value)} className="h-11" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="gPhone">{t('signup.guardianPhone')}</Label>
                    <div className="relative">
                      <Phone className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                      <Input id="gPhone" type="tel" placeholder="+91 98765 43210" value={guardianPhone} onChange={(e) => setGuardianPhone(e.target.value)} className="h-11 pl-10" />
                    </div>
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="hobbies">{t('signup.hobbies')}</Label>
                    <Input id="hobbies" placeholder="Reading, music, sports..." value={hobbies} onChange={(e) => setHobbies(e.target.value)} className="h-11" />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="course">{t('signup.course')}</Label>
                    <Input id="course" placeholder="B.Tech CSE / MBA / BA Psych..." value={course} onChange={(e) => setCourse(e.target.value)} className="h-11" />
                  </div>
                </div>
                <Button className="w-full h-12 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 rounded-xl font-semibold" onClick={async () => { try { const u = await signUpEmail(email, password, 'student', studentName, studentPhone); setName(u.name); setRole(u.role); navigate('/dashboard'); } catch (e: any) { alert('Sign up failed: ' + e.message); } }}>
                  {t('signup.btn_student')} <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </TabsContent>

              {/* Counselor */}
              <TabsContent value="counselor" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="cName">{t('signup.fullname')}</Label>
                    <Input id="cName" placeholder="Your full name" value={cName} onChange={(e) => setCName(e.target.value)} className="h-11" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cEmail">{t('signup.email')}</Label>
                    <div className="relative">
                      <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                      <Input id="cEmail" type="email" placeholder="you@domain.com" value={email} onChange={(e) => setEmail(e.target.value)} className="h-11 pl-10" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cPhone">{t('signup.phone')}</Label>
                    <div className="relative">
                      <Phone className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                      <Input id="cPhone" type="tel" placeholder="+91 98765 43210" value={cPhone} onChange={(e) => setCPhone(e.target.value)} className="h-11 pl-10" />
                    </div>
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="cInfo">{t('signup.brief')}</Label>
                    <Input id="cInfo" placeholder="Experience, specialization, certifications..." value={cInfo} onChange={(e) => setCInfo(e.target.value)} className="h-11" />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="cPassword">{t('signup.password')}</Label>
                    <div className="relative">
                      <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                      <Input id="cPassword" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} className="h-11 pl-10" />
                    </div>
                  </div>
                </div>
                <Button className="w-full h-12 bg-gradient-to-r from-primary to-secondary text-primary-foreground shadow-large" onClick={async () => {
                  if (!cPhone.trim()) { alert('Please enter your phone number'); return; }
                  try { const u = await signUpEmail(email, password, 'counselor', cName, cPhone); setName(u.name); setRole(u.role); navigate('/dashboard'); } catch (e: any) { alert('Sign up failed: ' + e.message); }
                }}>
                  {t('signup.btn_counselor')} <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </TabsContent>

              {/* On-campus Counselor */}
              <TabsContent value="on-campus" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="ocName">{t('signup.fullname')}</Label>
                    <Input id="ocName" placeholder="Your full name" value={ocName} onChange={(e) => setOcName(e.target.value)} className="h-11" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ocEmail">{t('signup.email')}</Label>
                    <div className="relative">
                      <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                      <Input id="ocEmail" type="email" placeholder="you@institution.edu" value={email} onChange={(e) => setEmail(e.target.value)} className="h-11 pl-10" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ocPhone">{t('signup.phone')}</Label>
                    <div className="relative">
                      <Phone className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                      <Input id="ocPhone" type="tel" placeholder="+91 98765 43210" value={ocPhone} onChange={(e) => setOcPhone(e.target.value)} className="h-11 pl-10" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ocInstitution">{t('signup.institution')}</Label>
                    <div className="relative">
                      <Building2 className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                      <Input id="ocInstitution" placeholder="University / College" value={ocInstitution} onChange={(e) => setOcInstitution(e.target.value)} className="h-11 pl-10" />
                    </div>
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="ocPassword">{t('signup.password')}</Label>
                    <div className="relative">
                      <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                      <Input id="ocPassword" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} className="h-11 pl-10" />
                    </div>
                  </div>
                </div>
                <Button className="w-full h-12 bg-gradient-to-r from-primary to-secondary text-primary-foreground shadow-large" onClick={async () => {
                  if (!ocPhone.trim()) { alert('Please enter your phone number'); return; }
                  try { const u = await signUpEmail(email, password, 'on-campus-counselor', ocName, ocPhone); setName(u.name); setRole(u.role); navigate('/dashboard'); } catch (e: any) { alert('Sign up failed: ' + e.message); }
                }}>
                  {t('signup.btn_campus')} <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </TabsContent>
            </Tabs>

            <div className="text-center mt-8 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-600">
                {t('signup.login_prompt')} <Link to="/login" className="text-purple-600 font-semibold hover:text-purple-700 transition-colors">{t('signup.login_link')}</Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SignUp;


