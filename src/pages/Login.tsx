import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Heart, Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { setRole, setName } from "@/lib/auth";
import { signInEmail } from "@/services/auth";
import { useTranslation } from "react-i18next";

const Login = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-pink-400/20 to-orange-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-green-400/10 to-blue-400/10 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '4s' }} />
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-600 to-purple-600 rounded-3xl mb-6 shadow-2xl">
            <Heart className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">MindCare</h1>
          <p className="text-gray-600 text-lg">{t('login.welcome')}</p>
        </div>

        <Card className="border-0 shadow-2xl bg-white/80 backdrop-blur-sm rounded-3xl overflow-hidden">
          <div className="h-2 bg-gradient-to-r from-blue-500 to-purple-500" />
          <CardHeader className="pb-6 pt-8">
            <CardTitle className="text-2xl font-bold text-gray-900 text-center">{t('login.title')}</CardTitle>
            <CardDescription className="text-center text-gray-600">{t('login.subtitle')}</CardDescription>
          </CardHeader>
          <CardContent className="px-8 pb-8">
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-semibold text-gray-700">{t('login.email')}</Label>
                <div className="relative">
                  <Mail className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@university.edu"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-12 pl-12 pr-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-0 transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-semibold text-gray-700">{t('login.password')}</Label>
                <div className="relative">
                  <Lock className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-12 pl-12 pr-12 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-0 transition-colors"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 text-gray-400 hover:text-gray-600"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                </div>
                <div className="text-right">
                  <Button variant="link" className="px-0 text-sm text-blue-600 hover:text-blue-700">{t('login.forgot')}</Button>
                </div>
              </div>

              <Button
                className="group relative w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 rounded-xl font-semibold"
                onClick={async () => {
                  try {
                    const u = await signInEmail(email, password);
                    setName(u.name);
                    setRole(u.role);
                    navigate('/dashboard');
                  } catch (e) {
                    alert('Login failed. Please check your credentials.');
                  }
                }}
              >
                {t('login.submit')}
                <ArrowRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
              </Button>
            </div>

            <div className="text-center mt-8 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-600">
                {t('login.new')} <Link to="/signup" className="text-blue-600 font-semibold hover:text-blue-700 transition-colors">{t('login.create')}</Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;


