import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { GraduationCap, Users, Sparkles } from 'lucide-react';

interface EntrySelectionProps {
  onStudentEntry: () => void;
  onParentTeacherEntry: () => void;
}

export default function EntrySelection({ onStudentEntry, onParentTeacherEntry }: EntrySelectionProps) {
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-200px)] px-4">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-8 sm:mb-12">
          <div className="flex justify-center mb-4">
            <Sparkles className="w-16 h-16 sm:w-20 sm:h-20 text-yellow-300 animate-pulse" />
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-yellow-300 to-pink-300 bg-clip-text text-transparent">
            Mucit Evreni'ne Hoş Geldin!
          </h1>
          <p className="text-lg sm:text-xl text-white/80">
            Lütfen giriş türünü seç
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {/* Student Entry */}
          <Card 
            className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 backdrop-blur-md border-white/30 overflow-hidden cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-2xl group"
            onClick={onStudentEntry}
          >
            <CardHeader className="text-center pb-4">
              <div className="flex justify-center mb-4">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-500 opacity-30 rounded-full blur-xl group-hover:opacity-50 transition-opacity" />
                  <img
                    src="/assets/generated/student-login-icon-transparent.dim_64x64.png"
                    alt="Öğrenci Girişi"
                    className="w-24 h-24 sm:w-32 sm:h-32 relative z-10"
                  />
                </div>
              </div>
              <CardTitle className="text-2xl sm:text-3xl font-bold text-white">
                Öğrenci Girişi
              </CardTitle>
              <CardDescription className="text-white/80 text-base sm:text-lg">
                Öğrenmeye başla ve mucit ol!
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Button 
                className="w-full h-14 text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 hover:from-blue-500 hover:to-purple-600 text-white shadow-lg"
              >
                <GraduationCap className="mr-2 h-6 w-6" />
                Öğrenci Olarak Giriş Yap
              </Button>
            </CardContent>
          </Card>

          {/* Parent-Teacher Entry */}
          <Card 
            className="bg-gradient-to-br from-green-500/20 to-teal-500/20 backdrop-blur-md border-white/30 overflow-hidden cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-2xl group"
            onClick={onParentTeacherEntry}
          >
            <CardHeader className="text-center pb-4">
              <div className="flex justify-center mb-4">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-green-400 to-teal-500 opacity-30 rounded-full blur-xl group-hover:opacity-50 transition-opacity" />
                  <img
                    src="/assets/generated/parent-login-icon-transparent.dim_64x64.png"
                    alt="Veli-Öğretmen Girişi"
                    className="w-24 h-24 sm:w-32 sm:h-32 relative z-10"
                  />
                </div>
              </div>
              <CardTitle className="text-2xl sm:text-3xl font-bold text-white">
                Veli-Öğretmen Girişi
              </CardTitle>
              <CardDescription className="text-white/80 text-base sm:text-lg">
                Öğrenci ilerlemesini takip et
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Button 
                className="w-full h-14 text-xl font-bold bg-gradient-to-r from-green-400 to-teal-500 hover:from-green-500 hover:to-teal-600 text-white shadow-lg"
              >
                <Users className="mr-2 h-6 w-6" />
                Veli-Öğretmen Olarak Giriş Yap
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
