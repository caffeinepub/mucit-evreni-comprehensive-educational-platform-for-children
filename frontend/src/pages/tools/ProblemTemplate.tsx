import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Lightbulb } from 'lucide-react';

interface ProblemTemplateProps {
  onBack: () => void;
}

const problemTemplates = [
  {
    id: 1,
    title: 'Toplama Problemi',
    template: 'Ali {num1} tane elma aldı. Sonra {num2} tane daha aldı. Toplam kaç elma oldu?',
    operation: 'add',
    visual: '🍎',
  },
  {
    id: 2,
    title: 'Çıkarma Problemi',
    template: 'Ayşe\'nin {num1} tane kalemi vardı. {num2} tanesini arkadaşına verdi. Kaç kalemi kaldı?',
    operation: 'subtract',
    visual: '✏️',
  },
  {
    id: 3,
    title: 'Çarpma Problemi',
    template: 'Her kutuda {num1} tane çikolata var. {num2} kutu varsa toplam kaç çikolata var?',
    operation: 'multiply',
    visual: '🍫',
  },
  {
    id: 4,
    title: 'Bölme Problemi',
    template: '{num1} tane kurabiye {num2} arkadaş arasında eşit paylaşılacak. Her birine kaç kurabiye düşer?',
    operation: 'divide',
    visual: '🍪',
  },
];

export default function ProblemTemplate({ onBack }: ProblemTemplateProps) {
  const [selectedTemplate, setSelectedTemplate] = useState(0);
  const [num1, setNum1] = useState(10);
  const [num2, setNum2] = useState(5);
  const [userAnswer, setUserAnswer] = useState('');
  const [showHint, setShowHint] = useState(false);

  const template = problemTemplates[selectedTemplate];

  const calculateAnswer = () => {
    switch (template.operation) {
      case 'add':
        return num1 + num2;
      case 'subtract':
        return num1 - num2;
      case 'multiply':
        return num1 * num2;
      case 'divide':
        return Math.floor(num1 / num2);
      default:
        return 0;
    }
  };

  const correctAnswer = calculateAnswer();
  const isCorrect = parseInt(userAnswer) === correctAnswer;

  const problemText = template.template
    .replace('{num1}', num1.toString())
    .replace('{num2}', num2.toString());

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
              🧠 Problem Şablonu
            </h2>
            <p className="text-white/80">Sözel problemleri çöz!</p>
          </div>

          {/* Template Selection */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            {problemTemplates.map((tmpl, index) => (
              <Button
                key={tmpl.id}
                onClick={() => {
                  setSelectedTemplate(index);
                  setUserAnswer('');
                  setShowHint(false);
                }}
                className={`${
                  selectedTemplate === index
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500'
                    : 'bg-white/20'
                } h-auto py-4`}
              >
                <div className="text-center">
                  <div className="text-3xl mb-2">{tmpl.visual}</div>
                  <div className="text-sm">{tmpl.title}</div>
                </div>
              </Button>
            ))}
          </div>

          {/* Number Controls */}
          <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl p-6 mb-6">
            <h3 className="text-white text-xl font-bold mb-4">Sayıları Ayarla</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-white font-semibold mb-2 block">Birinci Sayı:</label>
                <Input
                  type="number"
                  value={num1}
                  onChange={(e) => {
                    setNum1(parseInt(e.target.value) || 0);
                    setUserAnswer('');
                  }}
                  className="bg-white/20 border-white/30 text-white text-2xl font-bold text-center"
                />
              </div>
              <div>
                <label className="text-white font-semibold mb-2 block">İkinci Sayı:</label>
                <Input
                  type="number"
                  value={num2}
                  onChange={(e) => {
                    setNum2(parseInt(e.target.value) || 1);
                    setUserAnswer('');
                  }}
                  className="bg-white/20 border-white/30 text-white text-2xl font-bold text-center"
                />
              </div>
            </div>
          </div>

          {/* Problem Display */}
          <div className="bg-white rounded-xl p-8 mb-6">
            <div className="text-center mb-6">
              <p className="text-2xl text-gray-800 leading-relaxed">{problemText}</p>
            </div>

            {/* Visual Representation */}
            <div className="flex flex-wrap justify-center gap-2 mb-6">
              {Array.from({ length: Math.min(num1, 20) }).map((_, i) => (
                <span key={i} className="text-4xl">{template.visual}</span>
              ))}
            </div>

            {/* Answer Input */}
            <div className="max-w-xs mx-auto">
              <label className="text-gray-800 font-semibold mb-2 block text-center">Cevabın:</label>
              <Input
                type="number"
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                className={`text-4xl font-bold text-center border-4 ${
                  userAnswer === ''
                    ? 'border-gray-300'
                    : isCorrect
                    ? 'border-green-500 bg-green-50'
                    : 'border-red-500 bg-red-50'
                }`}
                placeholder="?"
              />
            </div>
          </div>

          {/* Feedback */}
          {userAnswer && (
            <div className={`text-center text-2xl font-bold mb-6 ${isCorrect ? 'text-green-400' : 'text-red-400'}`}>
              {isCorrect ? '✓ Harika! Doğru cevap!' : '✗ Tekrar dene!'}
            </div>
          )}

          {/* Hint Button */}
          <div className="flex gap-4">
            <Button
              onClick={() => setShowHint(!showHint)}
              className="flex-1 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white"
            >
              <Lightbulb className="w-4 h-4 mr-2" />
              {showHint ? 'İpucunu Gizle' : 'İpucu Göster'}
            </Button>
          </div>

          {showHint && (
            <div className="mt-4 bg-yellow-100 border-4 border-yellow-400 rounded-xl p-4 text-center">
              <p className="text-gray-800 text-lg font-semibold">
                İpucu: Cevap {correctAnswer}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
