import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { AgeGroup } from '../types';
import { ArrowLeft, Star, Trophy } from 'lucide-react';
import DifficultySelection from '../components/DifficultySelection';
import ActivityList from '../components/ActivityList';
import DailyExam from './DailyExam';

interface ClassViewProps {
  userId: string;
  ageGroup: AgeGroup;
  onBack: () => void;
}

export type Difficulty = 'easy' | 'medium' | 'hard';

const ageGroupNames: Record<AgeGroup, string> = {
  'preschool': 'Okul Öncesi',
  'elementary': 'İlkokul',
  'middle': 'Ortaokul',
};

const ageGroupFocus: Record<AgeGroup, string> = {
  'preschool': 'Algı kuran beyin',
  'elementary': 'Kural bulan zihin',
  'middle': 'Sistem kuran akıl',
};

export default function ClassView({ userId, ageGroup, onBack }: ClassViewProps) {
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty | null>(null);
  const [showDailyExam, setShowDailyExam] = useState(false);

  if (showDailyExam) {
    return <DailyExam userId={userId} ageGroup={ageGroup} onBack={() => setShowDailyExam(false)} />;
  }

  return (
    <div className="py-4 sm:py-6 md:py-8">
      <div className="mb-6 sm:mb-8">
        <Button
          onClick={onBack}
          variant="ghost"
          className="text-white hover:bg-white/10 mb-3 sm:mb-4 text-sm sm:text-base"
        >
          <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
          Gezegenlere Dön
        </Button>

        <div className="text-center">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-2 flex items-center justify-center gap-2 sm:gap-3 flex-wrap">
            <Star className="w-8 h-8 sm:w-10 sm:h-10 text-yellow-300" />
            <span>{ageGroupNames[ageGroup]}</span>
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-white/80 mt-2 px-4">
            {ageGroupFocus[ageGroup]}
          </p>
        </div>
      </div>

      {!selectedDifficulty ? (
        <div>
          {/* Daily Exam Button */}
          <div className="max-w-4xl mx-auto mb-8 px-4">
            <Button
              onClick={() => setShowDailyExam(true)}
              size="lg"
              className="w-full bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 text-white font-bold text-xl py-8 shadow-2xl transform transition-all hover:scale-105"
            >
              <Trophy className="w-8 h-8 mr-3" />
              Günlük Sınav
            </Button>
          </div>

          <DifficultySelection onSelect={setSelectedDifficulty} />
        </div>
      ) : (
        <div>
          <Button
            onClick={() => setSelectedDifficulty(null)}
            variant="ghost"
            className="text-white hover:bg-white/10 mb-4 sm:mb-6 text-sm sm:text-base"
          >
            <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
            Zorluk Seviyesini Değiştir
          </Button>
          <ActivityList 
            userId={userId}
            ageGroup={ageGroup} 
            difficulty={selectedDifficulty} 
          />
        </div>
      )}
    </div>
  );
}
