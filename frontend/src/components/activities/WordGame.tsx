import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { AgeGroup } from '../../types';
import { Difficulty } from '../../pages/ClassView';
import { CheckCircle2, XCircle, Shuffle, RefreshCw } from 'lucide-react';

interface WordGameProps {
  difficulty: Difficulty;
  ageGroup: AgeGroup;
  onComplete: (score: number) => void;
  maxScore: number;
}

// Expanded word database with more variety
const wordDatabase = {
  easy: [
    { word: 'KEDI', syllables: ['KE', 'Dİ'] },
    { word: 'MASA', syllables: ['MA', 'SA'] },
    { word: 'KAPI', syllables: ['KA', 'PI'] },
    { word: 'ARABA', syllables: ['A', 'RA', 'BA'] },
    { word: 'ELMA', syllables: ['EL', 'MA'] },
    { word: 'AYAK', syllables: ['A', 'YAK'] },
    { word: 'GÖKYÜZÜ', syllables: ['GÖK', 'YÜ', 'ZÜ'] },
    { word: 'KALE', syllables: ['KA', 'LE'] },
    { word: 'DENIZ', syllables: ['DE', 'NİZ'] },
    { word: 'GÜNEŞ', syllables: ['GÜ', 'NEŞ'] },
  ],
  medium: [
    { word: 'KALEM', syllables: ['KA', 'LEM'] },
    { word: 'OKUL', syllables: ['O', 'KUL'] },
    { word: 'KITAP', syllables: ['Kİ', 'TAP'] },
    { word: 'PENCERE', syllables: ['PEN', 'CE', 'RE'] },
    { word: 'BAHÇE', syllables: ['BAH', 'ÇE'] },
    { word: 'ÇANTA', syllables: ['ÇAN', 'TA'] },
    { word: 'DEFTER', syllables: ['DEF', 'TER'] },
    { word: 'SANDALYE', syllables: ['SAN', 'DAL', 'YE'] },
    { word: 'BARDAK', syllables: ['BAR', 'DAK'] },
    { word: 'TABAK', syllables: ['TA', 'BAK'] },
  ],
  hard: [
    { word: 'BİLGİSAYAR', syllables: ['BİL', 'Gİ', 'SA', 'YAR'] },
    { word: 'KÜTÜPHANE', syllables: ['KÜ', 'TÜP', 'HA', 'NE'] },
    { word: 'ÖĞRETMEN', syllables: ['ÖĞ', 'RET', 'MEN'] },
    { word: 'KARDEŞ', syllables: ['KAR', 'DEŞ'] },
    { word: 'ARKADAŞ', syllables: ['AR', 'KA', 'DAŞ'] },
    { word: 'OYUNCAK', syllables: ['O', 'YUN', 'CAK'] },
    { word: 'TELEFON', syllables: ['TE', 'LE', 'FON'] },
    { word: 'HASTANE', syllables: ['HAS', 'TA', 'NE'] },
    { word: 'UÇAK', syllables: ['U', 'ÇAK'] },
    { word: 'TREN', syllables: ['TREN'] },
  ],
};

export default function WordGame({ difficulty, onComplete, maxScore }: WordGameProps) {
  const [words, setWords] = useState<Array<{ word: string; syllables: string[] }>>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [shuffledSyllables, setShuffledSyllables] = useState<string[]>([]);
  const [selectedSyllables, setSelectedSyllables] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    initializeGame();
  }, [difficulty, refreshKey]);

  const initializeGame = () => {
    // Randomly select words from database
    const wordPool = wordDatabase[difficulty];
    const count = difficulty === 'easy' ? 5 : difficulty === 'medium' ? 7 : 10;
    const selectedWords = [...wordPool]
      .sort(() => Math.random() - 0.5)
      .slice(0, Math.min(count, wordPool.length));
    
    setWords(selectedWords);
    setCurrentIndex(0);
    setScore(0);
    setFeedback(null);
    setSelectedSyllables([]);
  };

  useEffect(() => {
    if (words.length > 0) {
      shuffleSyllables();
    }
  }, [currentIndex, words]);

  const shuffleSyllables = () => {
    if (words.length === 0) return;
    const current = words[currentIndex];
    const shuffled = [...current.syllables].sort(() => Math.random() - 0.5);
    setShuffledSyllables(shuffled);
    setSelectedSyllables([]);
    setFeedback(null);
  };

  const handleSyllableClick = (syllable: string) => {
    if (feedback) return;
    setSelectedSyllables(prev => [...prev, syllable]);
  };

  const handleRemoveSyllable = (index: number) => {
    if (feedback) return;
    setSelectedSyllables(prev => prev.filter((_, i) => i !== index));
  };

  const handleCheck = () => {
    const current = words[currentIndex];
    const isCorrect = selectedSyllables.join('') === current.word;
    
    setFeedback(isCorrect ? 'correct' : 'wrong');
    if (isCorrect) {
      setScore(prev => prev + 1);
    }

    setTimeout(() => {
      if (currentIndex < words.length - 1) {
        setCurrentIndex(prev => prev + 1);
      } else {
        const finalScore = Math.floor(score / words.length * maxScore);
        onComplete(finalScore);
      }
    }, 1500);
  };

  const handleReset = () => {
    setSelectedSyllables([]);
  };

  const handleReplay = () => {
    setRefreshKey(prev => prev + 1);
  };

  if (words.length === 0) {
    return <div className="text-white text-center">Yükleniyor...</div>;
  }

  const current = words[currentIndex];
  const canCheck = selectedSyllables.length === current.syllables.length;

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-white mb-2">Kelime Oluştur</h3>
        <p className="text-white/80">Heceleri doğru sırayla seçerek kelimeyi oluştur</p>
        <div className="mt-4 flex justify-center gap-8">
          <div className="text-white text-lg">
            <span className="font-bold">Kelime:</span> {currentIndex + 1} / {words.length}
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
            Yeni Kelimeler
          </Button>
        </div>
      </div>

      {/* Selected Syllables Area */}
      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 min-h-32">
        <div className="flex flex-wrap gap-3 justify-center items-center min-h-20">
          {selectedSyllables.length === 0 ? (
            <p className="text-white/50 text-xl">Heceleri seç...</p>
          ) : (
            selectedSyllables.map((syllable, index) => (
              <button
                key={index}
                onClick={() => handleRemoveSyllable(index)}
                className="bg-blue-500 hover:bg-blue-600 text-white text-2xl font-bold px-6 py-4 rounded-xl transition-all duration-300 hover:scale-105"
              >
                {syllable}
              </button>
            ))
          )}
        </div>
      </div>

      {feedback && (
        <div className={`text-center py-4 rounded-lg ${feedback === 'correct' ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
          <div className="flex items-center justify-center gap-2">
            {feedback === 'correct' ? (
              <>
                <CheckCircle2 className="w-8 h-8 text-green-400" />
                <span className="text-2xl font-bold text-green-400">Harika! {current.word}</span>
              </>
            ) : (
              <>
                <XCircle className="w-8 h-8 text-red-400" />
                <span className="text-2xl font-bold text-red-400">
                  Doğru kelime: {current.word}
                </span>
              </>
            )}
          </div>
        </div>
      )}

      {/* Available Syllables */}
      <div className="space-y-4">
        <div className="flex flex-wrap gap-3 justify-center">
          {shuffledSyllables.map((syllable, index) => {
            const usedCount = selectedSyllables.filter(s => s === syllable).length;
            const availableCount = shuffledSyllables.filter(s => s === syllable).length;
            const disabled = usedCount >= availableCount || feedback !== null;

            return (
              <Button
                key={index}
                onClick={() => handleSyllableClick(syllable)}
                disabled={disabled}
                className={`text-2xl font-bold px-8 py-6 transition-all duration-300 ${
                  disabled
                    ? 'bg-gray-500/30 cursor-not-allowed'
                    : 'bg-purple-500 hover:bg-purple-600 hover:scale-105'
                }`}
              >
                {syllable}
              </Button>
            );
          })}
        </div>

        <div className="flex gap-4 justify-center">
          <Button
            onClick={handleReset}
            disabled={selectedSyllables.length === 0 || feedback !== null}
            variant="outline"
            className="text-lg px-6 py-6"
          >
            <Shuffle className="w-5 h-5 mr-2" />
            Sıfırla
          </Button>
          <Button
            onClick={handleCheck}
            disabled={!canCheck || feedback !== null}
            className="text-lg px-8 py-6 bg-green-600 hover:bg-green-700"
          >
            <CheckCircle2 className="w-5 h-5 mr-2" />
            Kontrol Et
          </Button>
        </div>
      </div>
    </div>
  );
}
