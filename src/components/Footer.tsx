import { Heart, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from "lucide-react";
import { useTranslation } from "react-i18next";

export const Footer = () => {
  const { t } = useTranslation();
  return (
    <footer className="bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white">
      <div className="container py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 shadow-lg">
                <Heart className="h-7 w-7 text-white" />
              </div>
              <div>
                <span className="text-2xl font-bold">{t('footer.brand')}</span>
                <p className="text-sm text-gray-300">{t('footer.tagline')}</p>
              </div>
            </div>
            <p className="text-gray-300 leading-relaxed mb-6">
              {t('footer.desc')}
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-white/20 transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-white/20 transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-white/20 transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-white/20 transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-6">{t('footer.quick')}</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">{t('nav.chat')}</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">{t('nav.book')}</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">{t('nav.resources')}</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">{t('nav.community')}</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Emergency Help</a></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-lg font-semibold mb-6">{t('footer.support')}</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Help Center</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Terms of Service</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Cookie Policy</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Accessibility</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-6">{t('footer.contact')}</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-blue-400" />
                <span className="text-gray-300">support@mindcare.edu</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-green-400" />
                <span className="text-gray-300">1-800-MINDCARE</span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="h-5 w-5 text-purple-400" />
                <span className="text-gray-300">Available 24/7 Online</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-400 text-sm">
            © {new Date().getFullYear()} {t('footer.brand')}. {t('footer.rights')}
            <span className="ml-2">{t('footer.made')}</span>
          </p>
          <div className="flex gap-6 text-sm">
            <a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy</a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors">Terms</a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors">Contact</a>
          </div>
        </div>
      </div>
    </footer>
  );
};


