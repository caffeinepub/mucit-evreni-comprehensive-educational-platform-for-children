import { Card, CardContent } from '@/components/ui/card';
import { Difficulty } from '../pages/ClassView';
import { Smile, Zap, Flame } from 'lucide-react';

interface DifficultySelectionProps {
  onSelect: (difficulty: Difficulty) => void;
}

const difficulties = [
  {
    id: 'easy' as Difficulty,
    name: 'Kolay',
    icon: Smile,
    color: 'from-green-400 to-emerald-600',
    bgColor: 'bg-green-500/20',
    description: 'Yeni başlayanlar için',
  },
  {
    id: 'medium' as Difficulty,
    name: 'Orta',
    icon: Zap,
    color: 'from-yellow-400 to-orange-600',
    bgColor: 'bg-yellow-500/20',
    description: 'Biraz daha zorlayıcı',
  },
  {
    id: 'hard' as Difficulty,
    name: 'Zor',
    icon: Flame,
    color: 'from-red-400 to-pink-600',
    bgColor: 'bg-red-500/20',
    description: 'Uzmanlar için',
  },
];

export default function DifficultySelection({ onSelect }: DifficultySelectionProps) {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <h3 className="text-3xl font-bold text-white mb-4">
          Zorluk Seviyeni Seç
        </h3>
        <p className="text-xl text-white/80">
          Hangi seviyede öğrenmek istersin?
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {difficulties.map((difficulty) => {
          const Icon = difficulty.icon;
          return (
            <Card
              key={difficulty.id}
              className={`${difficulty.bgColor} backdrop-blur-md border-white/20 cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-2xl group`}
              onClick={() => onSelect(difficulty.id)}
            >
              <CardContent className="p-8 text-center">
                <div className={`inline-flex p-6 rounded-full bg-gradient-to-br ${difficulty.color} mb-4 group-hover:scale-110 transition-transform`}>
                  <Icon className="w-12 h-12 text-white" />
                </div>
                <h4 className="text-2xl font-bold text-white mb-2">
                  {difficulty.name}
                </h4>
                <p className="text-white/70">
                  {difficulty.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
