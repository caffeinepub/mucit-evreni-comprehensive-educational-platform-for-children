import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { AgeGroup } from '../../types';
import { Difficulty } from '../../pages/ClassView';
import { CheckCircle2, XCircle, RefreshCw } from 'lucide-react';
import { useSoundManager } from '../../lib/soundManager';

interface ColorMatchGameProps {
  difficulty: Difficulty;
  ageGroup: AgeGroup;
  onComplete: (score: number) => void;
  maxScore: number;
}

interface ColorItem {
  id: number;
  color: string;
  name: string;
  matched: boolean;
}

// Expanded color palette with more variety
const colorPalette = [
  { color: '#FF0000', name: 'Kırmızı' },
  { color: '#0000FF', name: 'Mavi' },
  { color: '#FFFF00', name: 'Sarı' },
  { color: '#00FF00', name: 'Yeşil' },
  { color: '#FFA500', name: 'Turuncu' },
  { color: '#800080', name: 'Mor' },
  { color: '#FFC0CB', name: 'Pembe' },
  { color: '#A52A2A', name: 'Kahverengi' },
  { color: '#00FFFF', name: 'Turkuaz' },
  { color: '#FFD700', name: 'Altın' },
  { color: '#C0C0C0', name: 'Gümüş' },
  { color: '#000000', name: 'Siyah' },
  { color: '#FFFFFF', name: 'Beyaz' },
  { color: '#FF69B4', name: 'Fuşya' },
  { color: '#4B0082', name: 'Çivit' },
  { color: '#FF6347', name: 'Domates' },
  { color: '#40E0D0', name: 'Turkuaz' },
  { color: '#EE82EE', name: 'Menekşe' },
];

// Background themes for visual variety
const backgroundThemes = [
  'from-purple-900/40 via-blue-900/40 to-pink-900/40',
  'from-green-900/40 via-teal-900/40 to-blue-900/40',
  'from-orange-900/40 via-red-900/40 to-pink-900/40',
  'from-indigo-900/40 via-purple-900/40 to-pink-900/40',
  'from-cyan-900/40 via-blue-900/40 to-indigo-900/40',
];

export default function ColorMatchGame({ difficulty, onComplete, maxScore }: ColorMatchGameProps) {
  const [colors, setColors] = useState<ColorItem[]>([]);
  const [selectedLeft, setSelectedLeft] = useState<number | null>(null);
  const [selectedRight, setSelectedRight] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [backgroundTheme, setBackgroundTheme] = useState('');
  const soundManager = useSoundManager();

  useEffect(() => {
    initializeGame();
  }, [difficulty, refreshKey]);

  const initializeGame = () => {
    // Select random background theme
    const theme = backgroundThemes[Math.floor(Math.random() * backgroundThemes.length)];
    setBackgroundTheme(theme);

    // Determine count based on difficulty with variation
    const baseCount = difficulty === 'easy' ? 4 : difficulty === 'medium' ? 6 : 8;
    const variation = Math.floor(Math.random() * 2);
    const count = baseCount + variation;
    
    // Use time-based seed for additional randomization
    const timeSeed = Date.now() % 1000;
    const shuffledPalette = [...colorPalette]
      .sort(() => (Math.random() + timeSeed / 10000) - 0.5)
      .sort(() => Math.random() - 0.5);
    
    const selectedColors = shuffledPalette.slice(0, Math.min(count, colorPalette.length));
    
    // Create left and right sides with different shuffling
    const leftColors = selectedColors.map((c, i) => ({ ...c, id: i, matched: false }));
    const rightColors = [...selectedColors]
      .sort(() => (Math.random() + timeSeed / 5000) - 0.5)
      .map((c, i) => ({ ...c, id: i + 100, matched: false }));
    
    setColors([...leftColors, ...rightColors]);
    setScore(0);
    setAttempts(0);
    setSelectedLeft(null);
    setSelectedRight(null);
    setFeedback(null);
  };

  const handleColorClick = (id: number, isLeft: boolean) => {
    const color = colors.find(c => c.id === id);
    if (!color || color.matched) return;

    // Play selection sound
    soundManager.playSelection();

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
    const leftColor = colors.find(c => c.id === selectedLeft);
    const rightColor = colors.find(c => c.id === selectedRight);

    if (leftColor && rightColor && leftColor.color === rightColor.color) {
      setFeedback('correct');
      setScore(prev => prev + 1);
      
      // Play correct sound
      soundManager.playCorrect();
      
      setTimeout(() => {
        setColors(prev =>
          prev.map(c =>
            c.id === selectedLeft || c.id === selectedRight
              ? { ...c, matched: true }
              : c
          )
        );
        setSelectedLeft(null);
        setSelectedRight(null);
        setFeedback(null);
        setAttempts(prev => prev + 1);
      }, 1000);
    } else {
      setFeedback('wrong');
      
      // Play wrong sound
      soundManager.playWrong();
      
      setTimeout(() => {
        setSelectedLeft(null);
        setSelectedRight(null);
        setFeedback(null);
        setAttempts(prev => prev + 1);
      }, 1000);
    }
  };

  const handleReplay = () => {
    soundManager.playTransition();
    setRefreshKey(prev => prev + 1);
  };

  const leftColors = colors.filter(c => c.id < 100);
  const rightColors = colors.filter(c => c.id >= 100);
  const allMatched = leftColors.every(c => c.matched);

  useEffect(() => {
    if (allMatched && colors.length > 0) {
      const finalScore = Math.max(1, Math.floor(maxScore * (1 - attempts * 0.05)));
      setTimeout(() => onComplete(finalScore), 1500);
    }
  }, [allMatched]);

  return (
    <div className="space-y-6">
      <div className={`absolute inset-0 bg-gradient-to-br ${backgroundTheme} -z-10 rounded-3xl`} />
      
      <div className="text-center">
        <h3 className="text-2xl font-bold text-white mb-2">Aynı Renkleri Eşleştir</h3>
        <p className="text-white/80">Sol ve sağ taraftan aynı renkleri seç</p>
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
                <span className="text-2xl font-bold text-green-400">Doğru!</span>
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
          {leftColors.map((color) => (
            <button
              key={color.id}
              onClick={() => handleColorClick(color.id, true)}
              disabled={color.matched}
              className={`w-full p-6 rounded-xl transition-all duration-300 ${
                color.matched
                  ? 'opacity-30 cursor-not-allowed'
                  : selectedLeft === color.id
                  ? 'ring-4 ring-white scale-105'
                  : 'hover:scale-105'
              }`}
              style={{ backgroundColor: color.color }}
            >
              <span className="text-white text-xl font-bold drop-shadow-lg" style={{
                textShadow: '2px 2px 4px rgba(0,0,0,0.8)'
              }}>
                {color.name}
              </span>
            </button>
          ))}
        </div>

        {/* Right Side */}
        <div className="space-y-4">
          {rightColors.map((color) => (
            <button
              key={color.id}
              onClick={() => handleColorClick(color.id, false)}
              disabled={color.matched}
              className={`w-full p-6 rounded-xl transition-all duration-300 ${
                color.matched
                  ? 'opacity-30 cursor-not-allowed'
                  : selectedRight === color.id
                  ? 'ring-4 ring-white scale-105'
                  : 'hover:scale-105'
              }`}
              style={{ backgroundColor: color.color }}
            />
          ))}
        </div>
      </div>

      {allMatched && (
        <div className="text-center py-8">
          <h3 className="text-3xl font-bold text-green-400 animate-pulse">
            Tüm Renkleri Eşleştirdin! 🎉
          </h3>
        </div>
      )}
    </div>
  );
}
