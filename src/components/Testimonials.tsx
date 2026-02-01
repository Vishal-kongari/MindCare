import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";



import { useTranslation } from "react-i18next";

export const Testimonials = () => {
  const { t } = useTranslation();
  return (
    <section className="py-24 bg-gradient-to-b from-white to-gray-50">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">{t('testimonials.title')}</h2>
          <p className="text-xl text-gray-600">{t('testimonials.subtitle')}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="border-0 bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <CardContent className="p-8">
                <div className="flex gap-1 mb-6">
                  {Array.from({ length: 5 }).map((_, i2) => (
                    <Star key={i2} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <blockquote className="text-gray-700 leading-relaxed mb-6 text-lg italic">
                  "{t(`testimonials.t${i}.quote`)}"
                </blockquote>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg mr-4">
                    {t(`testimonials.t${i}.name`).charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{t(`testimonials.t${i}.name`)}</p>
                    <p className="text-sm text-gray-500">{t('testimonials.verified')}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};


