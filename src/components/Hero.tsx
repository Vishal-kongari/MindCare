import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, Users, Clock, Sparkles, Heart, Star, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import defaultHero from "@/assets/Screenshot 2025-09-20 112724.png";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

export const Hero = () => {
  const { t } = useTranslation();
  const [bgSrc, setBgSrc] = useState<string>("/landing-bg.jpg");

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 -right-20 w-96 h-96 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-float" />
        <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-gradient-to-tr from-pink-400/20 to-orange-400/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/3 left-1/4 w-72 h-72 bg-gradient-to-r from-green-400/15 to-teal-400/15 rounded-full blur-2xl animate-float" style={{ animationDelay: '4s' }} />
        <div className="absolute bottom-1/4 right-1/3 w-64 h-64 bg-gradient-to-r from-amber-400/15 to-orange-400/15 rounded-full blur-2xl animate-float" style={{ animationDelay: '1s' }} />
      </div>

      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[radial-gradient(#6366f1_1px,transparent_2px)] [background-size:24px_24px]"></div>
      </div>

      {/* Content */}
      <div className="container relative z-10 px-4">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12 max-w-7xl mx-auto">
          {/* Text Content */}
          <motion.div
            className="flex-1 text-center lg:text-left"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Badge */}
            <motion.div variants={itemVariants} className="mb-8 inline-flex items-center rounded-full bg-white/80 backdrop-blur-sm px-4 py-2 text-sm font-semibold text-blue-600 shadow-lg border border-blue-100">
              <Sparkles className="h-4 w-4 mr-2" />
              {t('hero.badge')}
            </motion.div>

            {/* Main Heading */}
            <motion.h1 variants={itemVariants} className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              {t('hero.title')}
              <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mt-2">
                {t('hero.titleHigh')}
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p variants={itemVariants} className="text-lg md:text-xl text-gray-700 mb-10 leading-relaxed max-w-2xl mx-auto lg:mx-0">
              {t('hero.subtitle')}
            </motion.p>

            {/* CTA Buttons */}
            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 mb-12 justify-center lg:justify-start">
              <Button
                asChild
                size="lg"
                className="group bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-6 text-base font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 rounded-2xl"
              >
                <Link to="/signup" className="flex items-center">
                  {t('hero.ctaPrimary')}
                  <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-2 border-gray-300 hover:border-blue-500 hover:bg-blue-50 px-8 py-6 text-base font-semibold transition-all duration-300 rounded-2xl group"
              >
                <span className="flex items-center">
                  {t('hero.ctaSecondary')}
                  <ChevronRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </span>
              </Button>
            </motion.div>

            {/* Trust Indicators */}
            <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-2xl mx-auto lg:mx-0">
              <div className="flex items-center gap-3 p-4 bg-white/70 backdrop-blur-sm rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Shield className="h-6 w-6 text-blue-600" />
                </div>
                <div className="text-left">
                  <h3 className="font-semibold text-gray-900">{t('hero.stats.anonymous')}</h3>
                  <p className="text-sm text-gray-600">{t('hero.stats.anonymousDesc')}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-white/70 backdrop-blur-sm rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                <div className="flex-shrink-0 w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <Clock className="h-6 w-6 text-green-600" />
                </div>
                <div className="text-left">
                  <h3 className="font-semibold text-gray-900">{t('hero.stats.support')}</h3>
                  <p className="text-sm text-gray-600">{t('hero.stats.supportDesc')}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-white/70 backdrop-blur-sm rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                <div className="flex-shrink-0 w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                  <Users className="h-6 w-6 text-purple-600" />
                </div>
                <div className="text-left">
                  <h3 className="font-semibold text-gray-900">{t('hero.stats.community')}</h3>
                  <p className="text-sm text-gray-600">{t('hero.stats.communityDesc')}</p>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Image/Visual Content */}
          <motion.div
            className="flex-1 relative"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          >
            <div className="relative rounded-3xl overflow-hidden shadow-2xl transform hover:scale-105 transition-transform duration-700">
              <img
                src={bgSrc}
                alt="Students in a peaceful campus setting"
                className="w-full h-auto object-cover"
                onError={() => setBgSrc(defaultHero)}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>

              {/* Floating Stats Card */}
              <div className="absolute top-6 right-6 bg-white/95 backdrop-blur-sm p-4 rounded-2xl shadow-lg animate-float">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <Heart className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">95%</p>
                    <p className="text-xs text-gray-600">Satisfaction</p>
                  </div>
                </div>
              </div>

              {/* Floating Review Card */}
              <div className="absolute bottom-6 left-6 bg-white/95 backdrop-blur-sm p-4 rounded-2xl shadow-lg animate-float" style={{ animationDelay: '1.5s' }}>
                <div className="flex items-start gap-2">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                      <Star className="h-4 w-4 text-purple-600 fill-current" />
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">"Life-changing support"</p>
                    <div className="flex items-center mt-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} className="h-3 w-3 text-amber-400 fill-current" />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4 mt-8">
              <div className="bg-white/80 backdrop-blur-sm p-4 rounded-2xl shadow-sm text-center">
                <p className="text-2xl font-bold text-gray-900">50+</p>
                <p className="text-sm text-gray-600">Expert Counselors</p>
              </div>
              <div className="bg-white/80 backdrop-blur-sm p-4 rounded-2xl shadow-sm text-center">
                <p className="text-2xl font-bold text-gray-900">24/7</p>
                <p className="text-sm text-gray-600">Available</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Custom Animations */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(2deg); }
        }
        .animate-float {
          animation: float 8s ease-in-out infinite;
        }
      `}</style>
    </section >
  );
};