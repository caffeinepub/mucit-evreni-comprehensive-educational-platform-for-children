import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { AgeGroup } from '../../types';
import { Difficulty } from '../../pages/ClassView';
import { CheckCircle2, XCircle, RefreshCw } from 'lucide-react';

interface LogicGameProps {
  difficulty: Difficulty;
  ageGroup: AgeGroup;
  onComplete: (score: number) => void;
  maxScore: number;
}

interface Pattern {
  sequence: string[];
  options: string[];
  answer: string;
}

export default function LogicGame({ difficulty, onComplete, maxScore }: LogicGameProps) {
  const [patterns, setPatterns] = useState<Pattern[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    generatePatterns();
  }, [difficulty, refreshKey]);

  const generatePatterns = () => {
    const patternCount = difficulty === 'easy' ? 5 : difficulty === 'medium' ? 8 : 12;
    const newPatterns: Pattern[] = [];

    for (let i = 0; i < patternCount; i++) {
      newPatterns.push(generatePattern(difficulty));
    }

    setPatterns(newPatterns);
    setCurrentIndex(0);
    setScore(0);
    setFeedback(null);
    setSelectedAnswer(null);
  };

  const generatePattern = (diff: Difficulty): Pattern => {
    const shapes = ['🔴', '🔵', '🟢', '🟡', '🟣', '🟠', '⭐', '❤️', '🔷', '🔶', '🌙', '☀️', '⚡', '🌈', '🎈'];
    const patternTypes = ['AB', 'ABC', 'AABB', 'ABCD', 'AAB', 'ABBA'];
    
    let patternType: string;
    let sequenceLength: number;
    
    if (diff === 'easy') {
      patternType = patternTypes[Math.floor(Math.random() * 2)]; // AB or ABC
      sequenceLength = 5;
    } else if (diff === 'medium') {
      patternType = patternTypes[Math.floor(Math.random() * 4)]; // AB, ABC, AABB, ABCD
      sequenceLength = 7;
    } else {
      patternType = patternTypes[Math.floor(Math.random() * patternTypes.length)];
      sequenceLength = 9;
    }
    
    // Select random shapes for pattern
    const shuffledShapes = [...shapes].sort(() => Math.random() - 0.5);
    const patternShapes: { [key: string]: string } = {};
    
    for (let i = 0; i < patternType.length; i++) {
      const char = patternType[i];
      if (!patternShapes[char]) {
        patternShapes[char] = shuffledShapes[Object.keys(patternShapes).length];
      }
    }
    
    // Generate sequence
    const sequence: string[] = [];
    for (let i = 0; i < sequenceLength; i++) {
      const patternIndex = i % patternType.length;
      sequence.push(patternShapes[patternType[patternIndex]]);
    }
    
    // Determine answer (next in pattern)
    const answerIndex = sequenceLength % patternType.length;
    const answer = patternShapes[patternType[answerIndex]];
    
    // Generate wrong options
    const usedShapes = Object.values(patternShapes);
    const wrongOptions = shapes
      .filter(s => !usedShapes.includes(s))
      .sort(() => Math.random() - 0.5)
      .slice(0, 2);
    
    // Add one shape from pattern as distractor
    const distractor = usedShapes[Math.floor(Math.random() * usedShapes.length)];
    const options = [answer, ...wrongOptions, distractor !== answer ? distractor : wrongOptions[0]]
      .filter((v, i, a) => a.indexOf(v) === i)
      .slice(0, 4)
      .sort(() => Math.random() - 0.5);
    
    return { sequence, options, answer };
  };

  const handleAnswer = (answer: string) => {
    setSelectedAnswer(answer);
    const isCorrect = answer === patterns[currentIndex].answer;
    
    setFeedback(isCorrect ? 'correct' : 'wrong');
    if (isCorrect) {
      setScore(prev => prev + 1);
    }

    setTimeout(() => {
      if (currentIndex < patterns.length - 1) {
        setCurrentIndex(prev => prev + 1);
        setFeedback(null);
        setSelectedAnswer(null);
      } else {
        const finalScore = Math.floor((score + (isCorrect ? 1 : 0)) / patterns.length * maxScore);
        onComplete(finalScore);
      }
    }, 1500);
  };

  const handleReplay = () => {
    setRefreshKey(prev => prev + 1);
  };

  if (patterns.length === 0) {
    return <div className="text-white text-center">Yükleniyor...</div>;
  }

  const currentPattern = patterns[currentIndex];

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-white mb-2">Desen Tamamlama</h3>
        <p className="text-white/80">Desendeki eksik parçayı bul</p>
        <div className="mt-4 flex justify-center gap-8">
          <div className="text-white text-lg">
            <span className="font-bold">Desen:</span> {currentIndex + 1} / {patterns.length}
          </div>
          <div className="text-white text-lg">
            <span className="font-bold">Doğru:</span> {score}
          </div>
          <Button
            onClick={handleReplay}
            variant="outline"
            size="sm"
            className="text-white border-white/30 hover:bg-white/10"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Yeni Desenler
          </Button>
        </div>
      </div>

      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-12">
        <div className="flex items-center justify-center gap-4 flex-wrap">
          {currentPattern.sequence.map((item, index) => (
            <div
              key={index}
              className="w-20 h-20 flex items-center justify-center text-5xl bg-white/20 rounded-xl"
            >
              {item}
            </div>
          ))}
          <div className="w-20 h-20 flex items-center justify-center text-5xl bg-yellow-500/30 rounded-xl border-4 border-yellow-400 border-dashed">
            ?
          </div>
        </div>
      </div>

      {feedback && (
        <div className={`text-center py-4 rounded-lg ${feedback === 'correct' ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
          <div className="flex items-center justify-center gap-2">
            {feedback === 'correct' ? (
              <>
                <CheckCircle2 className="w-8 h-8 text-green-400" />
                <span className="text-2xl font-bold text-green-400">Mükemmel!</span>
              </>
            ) : (
              <>
                <XCircle className="w-8 h-8 text-red-400" />
                <span className="text-2xl font-bold text-red-400">
                  Doğru cevap: {currentPattern.answer}
                </span>
              </>
            )}
          </div>
        </div>
      )}

      <div className="grid grid-cols-4 gap-4">
        {currentPattern.options.map((option, index) => (
          <Button
            key={index}
            onClick={() => handleAnswer(option)}
            disabled={feedback !== null}
            className={`h-24 text-5xl transition-all duration-300 ${
              selectedAnswer === option
                ? feedback === 'correct'
                  ? 'bg-green-600 hover:bg-green-600'
                  : 'bg-red-600 hover:bg-red-600'
                : 'bg-white/20 hover:bg-white/30 hover:scale-105'
            }`}
          >
            {option}
          </Button>
        ))}
      </div>
    </div>
  );
}
