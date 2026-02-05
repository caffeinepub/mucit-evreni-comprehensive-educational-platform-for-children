import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { AgeGroup } from '../../types';
import { Difficulty } from '../../pages/ClassView';
import { CheckCircle2, XCircle, RefreshCw } from 'lucide-react';

interface ShapeMatchGameProps {
  difficulty: Difficulty;
  ageGroup: AgeGroup;
  onComplete: (score: number) => void;
  maxScore: number;
}

interface Shape {
  id: number;
  type: string;
  name: string;
  matched: boolean;
}

const allShapes = [
  { type: 'circle', name: 'Daire' },
  { type: 'square', name: 'Kare' },
  { type: 'triangle', name: 'Üçgen' },
  { type: 'rectangle', name: 'Dikdörtgen' },
  { type: 'star', name: 'Yıldız' },
  { type: 'hexagon', name: 'Altıgen' },
  { type: 'pentagon', name: 'Beşgen' },
  { type: 'diamond', name: 'Baklava' },
  { type: 'heart', name: 'Kalp' },
  { type: 'oval', name: 'Oval' },
  { type: 'octagon', name: 'Sekizgen' },
  { type: 'crescent', name: 'Hilal' },
];

const backgroundThemes = [
  'from-blue-900/40 via-purple-900/40 to-pink-900/40',
  'from-teal-900/40 via-cyan-900/40 to-blue-900/40',
  'from-rose-900/40 via-pink-900/40 to-purple-900/40',
  'from-amber-900/40 via-orange-900/40 to-red-900/40',
];

export default function ShapeMatchGame({ difficulty, onComplete, maxScore }: ShapeMatchGameProps) {
  const [shapes, setShapes] = useState<Shape[]>([]);
  const [selectedLeft, setSelectedLeft] = useState<number | null>(null);
  const [selectedRight, setSelectedRight] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [backgroundTheme, setBackgroundTheme] = useState('');
  const [colorPalette, setColorPalette] = useState<string[]>([]);

  useEffect(() => {
    initializeGame();
  }, [difficulty, refreshKey]);

  const initializeGame = () => {
    // Select random background theme
    const theme = backgroundThemes[Math.floor(Math.random() * backgroundThemes.length)];
    setBackgroundTheme(theme);

    // Generate random color palette for this session
    const colors = generateRandomColorPalette();
    setColorPalette(colors);

    // Determine count with variation
    const baseCount = difficulty === 'easy' ? 3 : difficulty === 'medium' ? 5 : 7;
    const variation = Math.floor(Math.random() * 2);
    const count = baseCount + variation;
    
    // Time-based randomization
    const timeSeed = Date.now() % 1000;
    const shuffledShapes = [...allShapes]
      .sort(() => (Math.random() + timeSeed / 10000) - 0.5)
      .sort(() => Math.random() - 0.5);
    
    const selectedShapes = shuffledShapes.slice(0, Math.min(count, allShapes.length));
    
    const leftShapes = selectedShapes.map((s, i) => ({ ...s, id: i, matched: false }));
    const rightShapes = [...selectedShapes]
      .sort(() => (Math.random() + timeSeed / 5000) - 0.5)
      .map((s, i) => ({ ...s, id: i + 100, matched: false }));
    
    setShapes([...leftShapes, ...rightShapes]);
    setScore(0);
    setAttempts(0);
    setSelectedLeft(null);
    setSelectedRight(null);
    setFeedback(null);
  };

  const generateRandomColorPalette = (): string[] => {
    const hueBase = Math.floor(Math.random() * 360);
    const colors: string[] = [];
    for (let i = 0; i < 12; i++) {
      const hue = (hueBase + i * 30) % 360;
      const saturation = 60 + Math.floor(Math.random() * 30);
      const lightness = 45 + Math.floor(Math.random() * 20);
      colors.push(`hsl(${hue}, ${saturation}%, ${lightness}%)`);
    }
    return colors;
  };

  const handleShapeClick = (id: number, isLeft: boolean) => {
    const shape = shapes.find(s => s.id === id);
    if (!shape || shape.matched) return;

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
    const leftShape = shapes.find(s => s.id === selectedLeft);
    const rightShape = shapes.find(s => s.id === selectedRight);

    if (leftShape && rightShape && leftShape.type === rightShape.type) {
      setFeedback('correct');
      setScore(prev => prev + 1);
      
      setTimeout(() => {
        setShapes(prev =>
          prev.map(s =>
            s.id === selectedLeft || s.id === selectedRight
              ? { ...s, matched: true }
              : s
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

  const renderShape = (type: string, index: number) => {
    const color = colorPalette[index % colorPalette.length] || '#FF6B6B';

    switch (type) {
      case 'circle':
        return <div className="w-20 h-20 rounded-full" style={{ backgroundColor: color }} />;
      case 'square':
        return <div className="w-20 h-20" style={{ backgroundColor: color }} />;
      case 'triangle':
        return (
          <div
            className="w-0 h-0 border-l-[40px] border-r-[40px] border-b-[70px] border-l-transparent border-r-transparent"
            style={{ borderBottomColor: color }}
          />
        );
      case 'rectangle':
        return <div className="w-28 h-16" style={{ backgroundColor: color }} />;
      case 'star':
        return (
          <svg width="80" height="80" viewBox="0 0 24 24" fill={color}>
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
        );
      case 'hexagon':
        return (
          <svg width="80" height="80" viewBox="0 0 24 24" fill={color}>
            <path d="M21 16V8l-6-4-6 4v8l6 4 6-4z" />
          </svg>
        );
      case 'pentagon':
        return (
          <svg width="80" height="80" viewBox="0 0 24 24" fill={color}>
            <path d="M12 2l7.5 5.5-2.9 9H7.4l-2.9-9z" />
          </svg>
        );
      case 'diamond':
        return <div className="w-16 h-16 rotate-45" style={{ backgroundColor: color }} />;
      case 'heart':
        return (
          <svg width="80" height="80" viewBox="0 0 24 24" fill={color}>
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        );
      case 'oval':
        return <div className="w-28 h-20 rounded-full" style={{ backgroundColor: color }} />;
      case 'octagon':
        return (
          <svg width="80" height="80" viewBox="0 0 24 24" fill={color}>
            <path d="M16.5 2h-9L2 7.5v9L7.5 22h9l5.5-5.5v-9L16.5 2z" />
          </svg>
        );
      case 'crescent':
        return (
          <svg width="80" height="80" viewBox="0 0 24 24" fill={color}>
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
          </svg>
        );
      default:
        return null;
    }
  };

  const handleReplay = () => {
    setRefreshKey(prev => prev + 1);
  };

  const leftShapes = shapes.filter(s => s.id < 100);
  const rightShapes = shapes.filter(s => s.id >= 100);
  const allMatched = leftShapes.every(s => s.matched);

  useEffect(() => {
    if (allMatched && shapes.length > 0) {
      const finalScore = Math.max(1, Math.floor(maxScore * (1 - attempts * 0.05)));
      setTimeout(() => onComplete(finalScore), 1500);
    }
  }, [allMatched]);

  return (
    <div className="space-y-6 relative">
      <div className={`absolute inset-0 bg-gradient-to-br ${backgroundTheme} -z-10 rounded-3xl`} />
      
      <div className="text-center">
        <h3 className="text-2xl font-bold text-white mb-2">Aynı Şekilleri Eşleştir</h3>
        <p className="text-white/80">Sol ve sağ taraftan aynı şekilleri seç</p>
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
          {leftShapes.map((shape, index) => (
            <button
              key={shape.id}
              onClick={() => handleShapeClick(shape.id, true)}
              disabled={shape.matched}
              className={`w-full p-6 rounded-xl bg-white/10 backdrop-blur-sm transition-all duration-300 flex flex-col items-center justify-center gap-3 ${
                shape.matched
                  ? 'opacity-30 cursor-not-allowed'
                  : selectedLeft === shape.id
                  ? 'ring-4 ring-white scale-105 bg-white/20'
                  : 'hover:scale-105 hover:bg-white/15'
              }`}
            >
              {renderShape(shape.type, index)}
              <span className="text-white text-lg font-bold">{shape.name}</span>
            </button>
          ))}
        </div>

        {/* Right Side */}
        <div className="space-y-4">
          {rightShapes.map((shape, index) => (
            <button
              key={shape.id}
              onClick={() => handleShapeClick(shape.id, false)}
              disabled={shape.matched}
              className={`w-full p-6 rounded-xl bg-white/10 backdrop-blur-sm transition-all duration-300 flex items-center justify-center ${
                shape.matched
                  ? 'opacity-30 cursor-not-allowed'
                  : selectedRight === shape.id
                  ? 'ring-4 ring-white scale-105 bg-white/20'
                  : 'hover:scale-105 hover:bg-white/15'
              }`}
            >
              {renderShape(shape.type, index + leftShapes.length)}
            </button>
          ))}
        </div>
      </div>

      {allMatched && (
        <div className="text-center py-8">
          <h3 className="text-3xl font-bold text-green-400 animate-pulse">
            Tüm Şekilleri Eşleştirdin! 🎉
          </h3>
        </div>
      )}
    </div>
  );
}
