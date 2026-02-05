import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { AgeGroup } from '../../types';
import { Difficulty } from '../../pages/ClassView';
import { CheckCircle2, XCircle, RefreshCw, Eye } from 'lucide-react';

interface DetailFindGameProps {
  difficulty: Difficulty;
  ageGroup: AgeGroup;
  onComplete: (score: number) => void;
  maxScore: number;
}

interface DetailItem {
  id: number;
  emoji: string;
  isDifferent: boolean;
  found: boolean;
}

const emojiCategories = [
  ['🌟', '⭐', '✨', '💫', '🌙', '☀️', '🌈', '🎈', '🎨', '🎭', '🎪', '🎯'],
  ['🍎', '🍊', '🍋', '🍌', '🍉', '🍇', '🍓', '🫐', '🍒', '🍑', '🥝', '🍍'],
  ['⚽', '🏀', '🏈', '⚾', '🎾', '🏐', '🏉', '🥏', '🎱', '🏓', '🏸', '🏒'],
  ['🚗', '🚕', '🚙', '🚌', '🚎', '🏎️', '🚓', '🚑', '🚒', '🚐', '🚚', '🚛'],
  ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁', '🐮'],
  ['🌸', '🌺', '🌻', '🌷', '🌹', '🥀', '🏵️', '💐', '🌼', '🌿', '🍀', '🍁'],
];

const backgroundThemes = [
  'from-rose-900/40 via-pink-900/40 to-fuchsia-900/40',
  'from-sky-900/40 via-blue-900/40 to-indigo-900/40',
  'from-emerald-900/40 via-green-900/40 to-teal-900/40',
  'from-amber-900/40 via-yellow-900/40 to-orange-900/40',
];

export default function DetailFindGame({ difficulty, onComplete, maxScore }: DetailFindGameProps) {
  const [items, setItems] = useState<DetailItem[]>([]);
  const [score, setScore] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [backgroundTheme, setBackgroundTheme] = useState('');

  useEffect(() => {
    initializeGame();
  }, [difficulty, refreshKey]);

  useEffect(() => {
    if (timeLeft > 0 && items.length > 0) {
      const timer = setTimeout(() => setTimeLeft(prev => prev - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      finishGame();
    }
  }, [timeLeft, items]);

  const initializeGame = () => {
    // Select random background theme
    const theme = backgroundThemes[Math.floor(Math.random() * backgroundThemes.length)];
    setBackgroundTheme(theme);

    // Vary grid size
    const baseSize = difficulty === 'easy' ? 16 : difficulty === 'medium' ? 25 : 36;
    const variation = Math.floor(Math.random() * 4);
    const gridSize = baseSize + variation;
    
    const baseDifferentCount = difficulty === 'easy' ? 3 : difficulty === 'medium' ? 5 : 7;
    const differentVariation = Math.floor(Math.random() * 2);
    const differentCount = baseDifferentCount + differentVariation;
    
    // Select random emoji category
    const categoryIndex = Math.floor(Math.random() * emojiCategories.length);
    const emojis = emojiCategories[categoryIndex];
    
    // Time-based selection
    const timeSeed = Date.now() % emojis.length;
    const mainEmoji = emojis[timeSeed];
    const differentEmoji = emojis.filter(e => e !== mainEmoji)[Math.floor(Math.random() * (emojis.length - 1))];
    
    const newItems: DetailItem[] = [];
    const differentIndices = new Set<number>();
    
    while (differentIndices.size < differentCount) {
      differentIndices.add(Math.floor(Math.random() * gridSize));
    }
    
    for (let i = 0; i < gridSize; i++) {
      newItems.push({
        id: i,
        emoji: differentIndices.has(i) ? differentEmoji : mainEmoji,
        isDifferent: differentIndices.has(i),
        found: false,
      });
    }
    
    setItems(newItems);
    setScore(0);
    setMistakes(0);
    setFeedback(null);
    
    const baseTime = difficulty === 'easy' ? 60 : difficulty === 'medium' ? 45 : 30;
    const timeVariation = Math.floor(Math.random() * 10);
    setTimeLeft(baseTime + timeVariation);
  };

  const handleItemClick = (id: number) => {
    const item = items.find(i => i.id === id);
    if (!item || item.found) return;

    if (item.isDifferent) {
      setFeedback('correct');
      setScore(prev => prev + 1);
      setItems(prev =>
        prev.map(i =>
          i.id === id ? { ...i, found: true } : i
        )
      );
      
      setTimeout(() => setFeedback(null), 500);
      
      const allFound = items.filter(i => i.isDifferent).every(i => i.found || i.id === id);
      if (allFound) {
        finishGame();
      }
    } else {
      setFeedback('wrong');
      setMistakes(prev => prev + 1);
      setTimeout(() => setFeedback(null), 500);
    }
  };

  const finishGame = () => {
    const foundCount = items.filter(i => i.isDifferent && i.found).length;
    const totalDifferent = items.filter(i => i.isDifferent).length;
    const finalScore = Math.floor((foundCount / totalDifferent) * maxScore * (1 - mistakes * 0.05));
    setTimeout(() => onComplete(Math.max(1, finalScore)), 1000);
  };

  const handleReplay = () => {
    setRefreshKey(prev => prev + 1);
  };

  const gridCols = difficulty === 'easy' ? 'grid-cols-4' : difficulty === 'medium' ? 'grid-cols-5' : 'grid-cols-6';
  const differentCount = items.filter(i => i.isDifferent).length;
  const foundCount = items.filter(i => i.isDifferent && i.found).length;

  return (
    <div className="space-y-6 relative">
      <div className={`absolute inset-0 bg-gradient-to-br ${backgroundTheme} -z-10 rounded-3xl`} />
      
      <div className="text-center">
        <h3 className="text-2xl font-bold text-white mb-2">Farklı Olanları Bul</h3>
        <p className="text-white/80">Diğerlerinden farklı olan emojileri bul</p>
        <div className="mt-4 flex justify-center gap-8 flex-wrap">
          <div className="text-white text-lg">
            <span className="font-bold">Bulundu:</span> {foundCount} / {differentCount}
          </div>
          <div className="text-white text-lg">
            <span className="font-bold">Hata:</span> {mistakes}
          </div>
          <div className="text-white text-lg">
            <span className="font-bold">Süre:</span> {timeLeft}s
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
        <div className={`text-center py-2 rounded-lg ${feedback === 'correct' ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
          <div className="flex items-center justify-center gap-2">
            {feedback === 'correct' ? (
              <>
                <CheckCircle2 className="w-6 h-6 text-green-400" />
                <span className="text-xl font-bold text-green-400">Buldun!</span>
              </>
            ) : (
              <>
                <XCircle className="w-6 h-6 text-red-400" />
                <span className="text-xl font-bold text-red-400">Yanlış!</span>
              </>
            )}
          </div>
        </div>
      )}

      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
        <div className={`grid ${gridCols} gap-3`}>
          {items.map((item) => (
            <button
              key={item.id}
              onClick={() => handleItemClick(item.id)}
              disabled={item.found}
              className={`aspect-square rounded-lg text-4xl flex items-center justify-center transition-all duration-300 ${
                item.found
                  ? 'bg-green-500/30 scale-110 ring-2 ring-green-400'
                  : 'bg-white/20 hover:bg-white/30 hover:scale-105'
              }`}
            >
              {item.found ? <Eye className="w-8 h-8 text-green-400" /> : item.emoji}
            </button>
          ))}
        </div>
      </div>

      <div className="text-center">
        <p className="text-white/70 text-sm">
          İpucu: Diğerlerinden farklı görünen {differentCount} emoji var!
        </p>
      </div>
    </div>
  );
}
