import { Card, CardContent } from '@/components/ui/card';
import { AgeGroup } from '../types';
import { Lightbulb, Sparkles, Info } from 'lucide-react';
import DersDisiGerecler from '../components/DersDisiGerecler';

interface PlanetSelectionProps {
  userId: string;
  onPlanetSelect: (ageGroup: AgeGroup) => void;
  onPlanningOpen: () => void;
  onToolsOpen: () => void;
}

const planets = [
  {
    ageGroup: 'preschool' as AgeGroup,
    name: 'Okul Öncesi',
    focus: 'Algı kuran beyin',
    description: 'Görsel algı, dikkat, eşleştirme ve temel mantık',
    image: '/assets/generated/okul-oncesi-planet.dim_300x300.png',
    color: 'from-green-400 to-emerald-600',
  },
  {
    ageGroup: 'elementary' as AgeGroup,
    name: 'İlkokul',
    focus: 'Kural bulan zihin',
    description: 'Mantık, kural keşfi, desen tanıma ve sözel akıl yürütme',
    image: '/assets/generated/ilkokul-planet.dim_300x300.png',
    color: 'from-blue-400 to-cyan-600',
  },
  {
    ageGroup: 'middle' as AgeGroup,
    name: 'Ortaokul',
    focus: 'Sistem kuran akıl',
    description: 'İleri mantık, strateji, analiz ve yaratıcı üretim',
    image: '/assets/generated/ortaokul-planet-clean.dim_300x300.png',
    color: 'from-purple-400 to-pink-600',
  },
];

export default function PlanetSelection({ userId, onPlanetSelect, onPlanningOpen, onToolsOpen }: PlanetSelectionProps) {
  // Get username from localStorage
  const storedUsername = localStorage.getItem('mucit_username');

  return (
    <div className="py-4 sm:py-6 md:py-8">
      <div className="text-center mb-8 sm:mb-10 md:mb-12">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-3 sm:mb-4 flex items-center justify-center gap-2 sm:gap-3">
          <Lightbulb className="w-8 h-8 sm:w-10 sm:h-10 text-yellow-300" />
          Mucit olmaya hazır mısın?
        </h2>
        <p className="text-base sm:text-lg md:text-xl text-white/80 px-4">
          {storedUsername 
            ? `Harika ${storedUsername}! Hayal gücünle keşfet, öğren ve mucit ol!`
            : 'Hayal gücünle keşfet, öğren ve mucit ol!'}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 max-w-6xl mx-auto mb-12 sm:mb-16 md:mb-20">
        {planets.map((planet) => (
          <Card
            key={planet.ageGroup}
            className="bg-white/10 backdrop-blur-md border-white/20 overflow-hidden cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-2xl group"
            onClick={() => onPlanetSelect(planet.ageGroup)}
          >
            <CardContent className="p-4 sm:p-5 md:p-6">
              <div className="relative mb-3 sm:mb-4">
                <div className={`absolute inset-0 bg-gradient-to-br ${planet.color} opacity-20 rounded-full blur-2xl group-hover:opacity-40 transition-opacity`} />
                <img
                  src={planet.image}
                  alt={planet.name}
                  className="w-full h-auto relative z-10 animate-float"
                />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white text-center mb-2 sm:mb-3">
                {planet.name}
              </h3>
              <div className={`mb-2 sm:mb-3 h-1 bg-gradient-to-r ${planet.color} rounded-full`} />
              <p className="text-base sm:text-lg font-semibold text-white text-center mb-1.5 sm:mb-2">
                {planet.focus}
              </p>
              <p className="text-white/70 text-center text-xs sm:text-sm">
                {planet.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Ders Dışı Gereçler Section Title */}
      <div className="max-w-5xl mx-auto mb-8 sm:mb-10 md:mb-12">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/30 via-purple-500/30 to-pink-500/30 blur-2xl" />
          <div className="relative bg-gradient-to-r from-indigo-400/20 via-purple-400/20 to-pink-400/20 backdrop-blur-md border-2 border-white/30 rounded-3xl p-6 sm:p-8 md:p-10 shadow-2xl">
            <div className="flex items-center justify-center gap-3 sm:gap-4 mb-3 sm:mb-4">
              <Sparkles className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-yellow-300 animate-pulse" />
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-pink-200 to-purple-200 text-center">
                Ders Dışı Gereçler
              </h2>
              <Sparkles className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-yellow-300 animate-pulse" />
            </div>
            <div className="h-1.5 sm:h-2 bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 rounded-full max-w-md mx-auto" />
            <p className="text-white/90 text-center text-base sm:text-lg md:text-xl mt-3 sm:mt-4 font-medium">
              Öğrenme yolculuğunda sana yardımcı olacak harika kaynaklar!
            </p>
          </div>
        </div>
      </div>

      {/* Ders Dışı Gereçler Tabs */}
      <DersDisiGerecler 
        userId={userId}
        onPlanningOpen={onPlanningOpen}
        onToolsOpen={onToolsOpen}
      />

      {/* Informational Text for Parent-Teacher Access */}
      <div className="max-w-4xl mx-auto mt-12 sm:mt-16 md:mt-20">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-teal-500/20 to-green-500/20 blur-xl" />
          <div className="relative bg-gradient-to-r from-blue-400/10 via-teal-400/10 to-green-400/10 backdrop-blur-sm border border-white/20 rounded-2xl p-4 sm:p-6 shadow-lg">
            <div className="flex items-start gap-3 sm:gap-4">
              <div className="flex-shrink-0">
                <Info className="w-6 h-6 sm:w-8 sm:h-8 text-blue-300" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg sm:text-xl font-bold text-white mb-2">
                  Veli ve Öğretmenler İçin
                </h3>
                <p className="text-white/80 text-sm sm:text-base leading-relaxed">
                  Veli ya da öğretmenler, öğrencinin <span className="font-bold text-yellow-300">Öğrenci Numarası</span> ile 
                  <span className="font-bold text-green-300"> Veli-Öğretmen Paneli</span>'ne giriş yaparak 
                  öğrencinin ilerlemesini, sınav sonuçlarını ve günlük planlarını takip edebilir.
                </p>
                <p className="text-white/70 text-xs sm:text-sm mt-2 italic">
                  💡 Öğrenci Numarası, profil ayarlarından kopyalanabilir ve paylaşılabilir.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
