import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { AgeGroup } from '../../types';
import { Difficulty } from '../../pages/ClassView';
import { CheckCircle2, XCircle, RefreshCw } from 'lucide-react';

interface AnimalMatchGameProps {
  difficulty: Difficulty;
  ageGroup: AgeGroup;
  onComplete: (score: number) => void;
  maxScore: number;
}

interface AnimalItem {
  id: number;
  emoji: string;
  name: string;
  matched: boolean;
}

const animalDatabase = [
  { emoji: '🐶', name: 'Köpek' },
  { emoji: '🐱', name: 'Kedi' },
  { emoji: '🐭', name: 'Fare' },
  { emoji: '🐹', name: 'Hamster' },
  { emoji: '🐰', name: 'Tavşan' },
  { emoji: '🦊', name: 'Tilki' },
  { emoji: '🐻', name: 'Ayı' },
  { emoji: '🐼', name: 'Panda' },
  { emoji: '🐨', name: 'Koala' },
  { emoji: '🐯', name: 'Kaplan' },
  { emoji: '🦁', name: 'Aslan' },
  { emoji: '🐮', name: 'İnek' },
  { emoji: '🐷', name: 'Domuz' },
  { emoji: '🐸', name: 'Kurbağa' },
  { emoji: '🐵', name: 'Maymun' },
  { emoji: '🐔', name: 'Tavuk' },
  { emoji: '🐧', name: 'Penguen' },
  { emoji: '🐦', name: 'Kuş' },
  { emoji: '🦆', name: 'Ördek' },
  { emoji: '🦅', name: 'Kartal' },
  { emoji: '🦉', name: 'Baykuş' },
  { emoji: '🦇', name: 'Yarasa' },
  { emoji: '🐺', name: 'Kurt' },
  { emoji: '🐗', name: 'Yaban Domuzu' },
  { emoji: '🐴', name: 'At' },
  { emoji: '🦄', name: 'Tek Boynuzlu At' },
  { emoji: '🐝', name: 'Arı' },
  { emoji: '🦋', name: 'Kelebek' },
  { emoji: '🐌', name: 'Salyangoz' },
  { emoji: '🐞', name: 'Uğur Böceği' },
];

const backgroundThemes = [
  'from-green-900/40 via-emerald-900/40 to-teal-900/40',
  'from-lime-900/40 via-green-900/40 to-cyan-900/40',
  'from-teal-900/40 via-blue-900/40 to-indigo-900/40',
  'from-amber-900/40 via-orange-900/40 to-rose-900/40',
];

export default function AnimalMatchGame({ difficulty, onComplete, maxScore }: AnimalMatchGameProps) {
  const [animals, setAnimals] = useState<AnimalItem[]>([]);
  const [selectedLeft, setSelectedLeft] = useState<number | null>(null);
  const [selectedRight, setSelectedRight] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [backgroundTheme, setBackgroundTheme] = useState('');

  useEffect(() => {
    initializeGame();
  }, [difficulty, refreshKey]);

  const initializeGame = () => {
    // Select random background theme
    const theme = backgroundThemes[Math.floor(Math.random() * backgroundThemes.length)];
    setBackgroundTheme(theme);

    // Vary count based on difficulty
    const baseCount = difficulty === 'easy' ? 4 : difficulty === 'medium' ? 6 : 8;
    const variation = Math.floor(Math.random() * 2);
    const count = baseCount + variation;
    
    // Time-based randomization
    const timeSeed = Date.now() % 1000;
    const shuffledAnimals = [...animalDatabase]
      .sort(() => (Math.random() + timeSeed / 10000) - 0.5)
      .sort(() => Math.random() - 0.5);
    
    const selectedAnimals = shuffledAnimals.slice(0, Math.min(count, animalDatabase.length));
    
    const leftAnimals = selectedAnimals.map((a, i) => ({ ...a, id: i, matched: false }));
    const rightAnimals = [...selectedAnimals]
      .sort(() => (Math.random() + timeSeed / 5000) - 0.5)
      .map((a, i) => ({ ...a, id: i + 100, matched: false }));
    
    setAnimals([...leftAnimals, ...rightAnimals]);
    setScore(0);
    setAttempts(0);
    setSelectedLeft(null);
    setSelectedRight(null);
    setFeedback(null);
  };

  const handleAnimalClick = (id: number, isLeft: boolean) => {
    const animal = animals.find(a => a.id === id);
    if (!animal || animal.matched) return;

    if (isLeft) {
      setSelectedLeft(id);
    } else {
      setSelectedRight(id);
    }
  };

  useEffect(() => {
    if (selectedLeft !== null && selectedRight !== null) {
      checkMatch();
    }
  }, [selectedLeft, selectedRight]);

  const checkMatch = () => {
    const leftAnimal = animals.find(a => a.id === selectedLeft);
    const rightAnimal = animals.find(a => a.id === selectedRight);

    if (leftAnimal && rightAnimal && leftAnimal.emoji === rightAnimal.emoji) {
      setFeedback('correct');
      setScore(prev => prev + 1);
      
      setTimeout(() => {
        setAnimals(prev =>
          prev.map(a =>
            a.id === selectedLeft || a.id === selectedRight
              ? { ...a, matched: true }
              : a
          )
        );
        setSelectedLeft(null);
        setSelectedRight(null);
        setFeedback(null);
        setAttempts(prev => prev + 1);
      }, 1000);
    } else {
      setFeedback('wrong');
      setTimeout(() => {
        setSelectedLeft(null);
        setSelectedRight(null);
        setFeedback(null);
        setAttempts(prev => prev + 1);
      }, 1000);
    }
  };

  const handleReplay = () => {
    setRefreshKey(prev => prev + 1);
  };

  const leftAnimals = animals.filter(a => a.id < 100);
  const rightAnimals = animals.filter(a => a.id >= 100);
  const allMatched = leftAnimals.every(a => a.matched);

  useEffect(() => {
    if (allMatched && animals.length > 0) {
      const finalScore = Math.max(1, Math.floor(maxScore * (1 - attempts * 0.05)));
      setTimeout(() => onComplete(finalScore), 1500);
    }
  }, [allMatched]);

  return (
    <div className="space-y-6 relative">
      <div className={`absolute inset-0 bg-gradient-to-br ${backgroundTheme} -z-10 rounded-3xl`} />
      
      <div className="text-center">
        <h3 className="text-2xl font-bold text-white mb-2">Aynı Hayvanları Eşleştir</h3>
        <p className="text-white/80">Sol ve sağ taraftan aynı hayvanları seç</p>
        <div className="mt-4 flex justify-center gap-8">
          <div className="text-white text-lg">
            <span className="font-bold">Doğru:</span> {score}
          </div>
          <div className="text-white text-lg">
            <span className="font-bold">Deneme:</span> {attempts}
          </div>
          <Button
            onClick={handleReplay}
            variant="outline"
            size="sm"
            className="text-white border-white/30 hover:bg-white/10"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Yeni Oyun
          </Button>
        </div>
      </div>

      {feedback && (
        <div className={`text-center py-4 rounded-lg ${feedback === 'correct' ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
          <div className="flex items-center justify-center gap-2">
            {feedback === 'correct' ? (
              <>
                <CheckCircle2 className="w-8 h-8 text-green-400" />
                <span className="text-2xl font-bold text-green-400">Harika!</span>
              </>
            ) : (
              <>
                <XCircle className="w-8 h-8 text-red-400" />
                <span className="text-2xl font-bold text-red-400">Tekrar Dene!</span>
              </>
            )}
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-8">
        {/* Left Side */}
        <div className="space-y-4">
          {leftAnimals.map((animal) => (
            <button
              key={animal.id}
              onClick={() => handleAnimalClick(animal.id, true)}
              disabled={animal.matched}
              className={`w-full p-6 rounded-xl bg-gradient-to-br from-green-500/20 to-blue-500/20 backdrop-blur-sm transition-all duration-300 flex flex-col items-center justify-center gap-3 ${
                animal.matched
                  ? 'opacity-30 cursor-not-allowed'
                  : selectedLeft === animal.id
                  ? 'ring-4 ring-white scale-105 bg-white/20'
                  : 'hover:scale-105 hover:bg-white/15'
              }`}
            >
              <span className="text-6xl">{animal.emoji}</span>
              <span className="text-white text-lg font-bold">{animal.name}</span>
            </button>
          ))}
        </div>

        {/* Right Side */}
        <div className="space-y-4">
          {rightAnimals.map((animal) => (
            <button
              key={animal.id}
              onClick={() => handleAnimalClick(animal.id, false)}
              disabled={animal.matched}
              className={`w-full p-6 rounded-xl bg-gradient-to-br from-green-500/20 to-blue-500/20 backdrop-blur-sm transition-all duration-300 flex items-center justify-center ${
                animal.matched
                  ? 'opacity-30 cursor-not-allowed'
                  : selectedRight === animal.id
                  ? 'ring-4 ring-white scale-105 bg-white/20'
                  : 'hover:scale-105 hover:bg-white/15'
              }`}
            >
              <span className="text-6xl">{animal.emoji}</span>
            </button>
          ))}
        </div>
      </div>

      {allMatched && (
        <div className="text-center py-8">
          <h3 className="text-3xl font-bold text-green-400 animate-pulse">
            Tüm Hayvanları Eşleştirdin! 🎉
          </h3>
        </div>
      )}
    </div>
  );
}
