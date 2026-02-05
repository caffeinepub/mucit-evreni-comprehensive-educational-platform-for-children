import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, RotateCcw } from 'lucide-react';

interface WritingToolProps {
  onBack: () => void;
}

const turkishLetters = [
  'A', 'B', 'C', 'Ç', 'D', 'E', 'F', 'G', 'Ğ', 'H',
  'I', 'İ', 'J', 'K', 'L', 'M', 'N', 'O', 'Ö', 'P',
  'R', 'S', 'Ş', 'T', 'U', 'Ü', 'V', 'Y', 'Z'
];

const practiceWords = [
  'elma', 'armut', 'kiraz', 'üzüm', 'çilek',
  'kedi', 'köpek', 'kuş', 'balık', 'tavşan',
  'güneş', 'ay', 'yıldız', 'gökyüzü', 'bulut',
  'okul', 'kalem', 'defter', 'kitap', 'çanta'
];

export default function WritingTool({ onBack }: WritingToolProps) {
  const [mode, setMode] = useState<'letter' | 'word'>('letter');
  const [currentLetter, setCurrentLetter] = useState(0);
  const [currentWord, setCurrentWord] = useState(0);
  const [userInput, setUserInput] = useState('');

  const handleNext = () => {
    if (mode === 'letter') {
      setCurrentLetter((prev) => (prev + 1) % turkishLetters.length);
    } else {
      setCurrentWord((prev) => (prev + 1) % practiceWords.length);
    }
    setUserInput('');
  };

  const handleReset = () => {
    setUserInput('');
  };

  const checkInput = () => {
    if (mode === 'letter') {
      return userInput.toUpperCase() === turkishLetters[currentLetter];
    } else {
      return userInput.toLowerCase() === practiceWords[currentWord];
    }
  };

  const isCorrect = userInput.length > 0 && checkInput();

  return (
    <div className="max-w-2xl mx-auto">
      <Button
        onClick={onBack}
        variant="outline"
        className="bg-white/10 backdrop-blur-md border-white/20 text-white hover:bg-white/20 mb-6"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Araçlara Dön
      </Button>

      <Card className="bg-white/10 backdrop-blur-md border-white/20 overflow-hidden">
        <CardContent className="p-6">
          <div className="text-center mb-6">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-2">
              🔤 Yazım Aracı
            </h2>
            <p className="text-white/80">Türkçe harfleri ve kelimeleri öğren!</p>
          </div>

          {/* Mode Selection */}
          <div className="flex gap-4 mb-6">
            <Button
              onClick={() => {
                setMode('letter');
                setUserInput('');
              }}
              className={`flex-1 ${mode === 'letter' ? 'bg-gradient-to-r from-blue-500 to-cyan-500' : 'bg-white/20'}`}
            >
              Harf Çalışması
            </Button>
            <Button
              onClick={() => {
                setMode('word');
                setUserInput('');
              }}
              className={`flex-1 ${mode === 'word' ? 'bg-gradient-to-r from-purple-500 to-pink-500' : 'bg-white/20'}`}
            >
              Kelime Çalışması
            </Button>
          </div>

          {/* Display Area */}
          <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl p-8 mb-6 text-center">
            <p className="text-white/80 text-lg mb-4">
              {mode === 'letter' ? 'Bu harfi yaz:' : 'Bu kelimeyi yaz:'}
            </p>
            <div className="text-white text-8xl font-bold mb-4">
              {mode === 'letter' ? turkishLetters[currentLetter] : practiceWords[currentWord]}
            </div>
          </div>

          {/* Input Area with proper text contrast */}
          <div className="bg-white rounded-2xl p-6 mb-6">
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              className={`w-full text-6xl font-bold text-center border-4 rounded-xl p-4 outline-none transition-colors ${
                userInput.length === 0
                  ? 'border-gray-300 bg-gray-50 text-gray-900'
                  : isCorrect
                  ? 'border-green-500 bg-green-50 text-gray-900'
                  : 'border-red-500 bg-red-50 text-gray-900'
              }`}
              placeholder="Buraya yaz..."
              style={{ color: '#1a1a1a' }}
            />
          </div>

          {/* Feedback */}
          {userInput.length > 0 && (
            <div className={`text-center text-2xl font-bold mb-6 ${isCorrect ? 'text-green-400' : 'text-red-400'}`}>
              {isCorrect ? '✓ Harika! Doğru yazdın!' : '✗ Tekrar dene!'}
            </div>
          )}

          {/* Controls */}
          <div className="flex gap-4">
            <Button
              onClick={handleReset}
              className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Temizle
            </Button>
            <Button
              onClick={handleNext}
              className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white"
            >
              Sonraki →
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
