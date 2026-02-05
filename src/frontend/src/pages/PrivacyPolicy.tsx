import { ArrowLeft, Shield, Lock, Users, Eye, FileText, Mail } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

interface PrivacyPolicyProps {
  onBack: () => void;
}

export default function PrivacyPolicy({ onBack }: PrivacyPolicyProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 py-4 sm:py-8 px-3 sm:px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <Button
            onClick={onBack}
            variant="ghost"
            className="text-white hover:bg-white/10 mb-4 sm:mb-6 text-sm sm:text-base"
          >
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
            Ana Sayfaya Dön
          </Button>

          <div className="text-center mb-6 sm:mb-8">
            <div className="flex items-center justify-center gap-2 sm:gap-3 mb-3 sm:mb-4">
              <Shield className="w-10 h-10 sm:w-12 sm:h-12 text-purple-300" />
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white">
                Mucit Evreni
              </h1>
            </div>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-purple-200 mb-2">
              Gizlilik Politikası
            </h2>
            <p className="text-white/70 text-xs sm:text-sm">
              Son Güncelleme: 2025
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div className="space-y-4 sm:space-y-6">
          {/* Introduction */}
          <Card className="bg-white/10 backdrop-blur-md border-white/20">
            <CardContent className="pt-4 sm:pt-6">
              <p className="text-white/90 text-base sm:text-lg leading-relaxed">
                Mucit Evreni, çocuklara yönelik güvenli ve eğitici bir öğrenme platformudur. 
                Uygulamamız hiçbir şekilde kişisel, kimlik veya konum verisi toplamaz.
              </p>
            </CardContent>
          </Card>

          {/* User Data */}
          <Card className="bg-white/10 backdrop-blur-md border-white/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 sm:gap-3 text-white text-lg sm:text-xl">
                <Users className="w-5 h-5 sm:w-6 sm:h-6 text-purple-300" />
                Kullanıcı Verileri
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-white/90 leading-relaxed text-sm sm:text-base">
                Öğrenci profilleri yalnızca takma isim (kullanıcı adı) ve sistem tarafından 
                üretilen 16 haneli Öğrenci Numarası ile çalışır. Gerçek isim, e-posta adresi, 
                telefon numarası veya herhangi bir kişisel tanımlayıcı bilgi toplanmaz.
              </p>
            </CardContent>
          </Card>

          {/* Device Information */}
          <Card className="bg-white/10 backdrop-blur-md border-white/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 sm:gap-3 text-white text-lg sm:text-xl">
                <Lock className="w-5 h-5 sm:w-6 sm:h-6 text-purple-300" />
                Cihaz Bilgileri
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-white/90 leading-relaxed text-sm sm:text-base">
                Uygulama cihazdan yalnızca mikrofon (Gürültü Ölçer ve Sözlük araçları için) ve ses izinlerini 
                kullanıcı onayıyla geçici olarak kullanır. Bu izinler yalnızca ilgili araç 
                kullanıldığında aktif olur ve hiçbir ses kaydı saklanmaz.
              </p>
            </CardContent>
          </Card>

          {/* Data Sharing */}
          <Card className="bg-white/10 backdrop-blur-md border-white/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 sm:gap-3 text-white text-lg sm:text-xl">
                <Eye className="w-5 h-5 sm:w-6 sm:h-6 text-purple-300" />
                Veri Paylaşımı
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-white/90 leading-relaxed text-sm sm:text-base">
                Herhangi bir üçüncü tarafla veri paylaşımı yapılmaz. Tüm bilgiler Internet Computer 
                altyapısında güvenle saklanır ve yalnızca öğrencinin eğitim ilerlemesini takip etmek 
                için kullanılır.
              </p>
            </CardContent>
          </Card>

          {/* Child Safety */}
          <Card className="bg-white/10 backdrop-blur-md border-white/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 sm:gap-3 text-white text-lg sm:text-xl">
                <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-purple-300" />
                Çocuk Güvenliği
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-white/90 leading-relaxed text-sm sm:text-base">
                <p>
                  Uygulama 13 yaş altı çocuklara yöneliktir ve aşağıdaki güvenlik önlemlerini içerir:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-2 sm:ml-4">
                  <li>Hiçbir reklam içeriği bulunmaz</li>
                  <li>Uygulama içi satın alma yoktur</li>
                  <li>Dış bağlantılar veya yönlendirmeler yoktur</li>
                  <li>Sosyal medya entegrasyonu bulunmaz</li>
                  <li>Sohbet veya mesajlaşma özelliği yoktur</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Transparency */}
          <Card className="bg-white/10 backdrop-blur-md border-white/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 sm:gap-3 text-white text-lg sm:text-xl">
                <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-purple-300" />
                Şeffaflık
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-white/90 leading-relaxed text-sm sm:text-base">
                Kullanıcı dilediğinde profilini sıfırlayabilir; bu işlem tüm verileri kalıcı olarak 
                siler ve yeni bir Öğrenci Numarası oluşturur. Veli ve öğretmenler, Öğrenci Numarası 
                ile öğrenci ilerlemesini takip edebilir.
              </p>
            </CardContent>
          </Card>

          <Separator className="bg-white/20" />

          {/* Contact Information */}
          <Card className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-md border-white/30">
            <CardContent className="pt-4 sm:pt-6">
              <div className="text-white text-center">
                <div className="flex items-center justify-center gap-2 mb-3">
                  <Mail className="w-5 h-5 sm:w-6 sm:h-6 text-purple-200" />
                  <p className="text-base sm:text-lg font-semibold">İletişim</p>
                </div>
                <p className="text-sm sm:text-base leading-relaxed">
                  Sorularınız için bize{' '}
                  <a 
                    href="mailto:uygulama20261@gmail.com" 
                    className="text-purple-200 hover:text-purple-100 underline font-semibold transition-colors break-all"
                  >
                    uygulama20261@gmail.com
                  </a>
                  {' '}adresinden ulaşabilirsiniz.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Back Button */}
        <div className="mt-6 sm:mt-8 text-center">
          <Button
            onClick={onBack}
            size="lg"
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold px-6 sm:px-8 text-sm sm:text-base"
          >
            Ana Sayfaya Dön
          </Button>
        </div>
      </div>
    </div>
  );
}
