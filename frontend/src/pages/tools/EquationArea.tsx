import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Lightbulb } from 'lucide-react';

interface EquationAreaProps {
  onBack: () => void;
}

export default function EquationArea({ onBack }: EquationAreaProps) {
  const [a, setA] = useState(2);
  const [b, setB] = useState(5);
  const [c, setC] = useState(11);
  const [userAnswer, setUserAnswer] = useState('');
  const [currentStep, setCurrentStep] = useState(0);

  // Equation: ax + b = c
  // Solution: x = (c - b) / a
  const solution = (c - b) / a;
  const isCorrect = parseFloat(userAnswer) === solution;

  const steps = [
    { text: `${a}x + ${b} = ${c}`, description: 'Başlangıç denklemi' },
    { text: `${a}x = ${c} - ${b}`, description: `Her iki taraftan ${b} çıkar` },
    { text: `${a}x = ${c - b}`, description: 'Sadeleştir' },
    { text: `x = ${c - b} ÷ ${a}`, description: `Her iki tarafı ${a}'ya böl` },
    { text: `x = ${solution}`, description: 'Sonuç!' },
  ];

  const nextStep = () => {
    setCurrentStep(Math.min(steps.length - 1, currentStep + 1));
  };

  const prevStep = () => {
    setCurrentStep(Math.max(0, currentStep - 1));
  };

  const resetEquation = () => {
    setCurrentStep(0);
    setUserAnswer('');
  };

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
              ✏️ Denklem Alanı
            </h2>
            <p className="text-white/80">Denklemleri adım adım çöz!</p>
          </div>

          {/* Equation Setup */}
          <div className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl p-6 mb-6">
            <h3 className="text-white text-xl font-bold mb-4">Denklem Oluştur (ax + b = c)</h3>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="text-white font-semibold mb-2 block">a:</label>
                <Input
                  type="number"
                  value={a}
                  onChange={(e) => {
                    setA(parseInt(e.target.value) || 1);
                    resetEquation();
                  }}
                  className="bg-white/20 border-white/30 text-white text-2xl font-bold text-center"
                />
              </div>
              <div>
                <label className="text-white font-semibold mb-2 block">b:</label>
                <Input
                  type="number"
                  value={b}
                  onChange={(e) => {
                    setB(parseInt(e.target.value) || 0);
                    resetEquation();
                  }}
                  className="bg-white/20 border-white/30 text-white text-2xl font-bold text-center"
                />
              </div>
              <div>
                <label className="text-white font-semibold mb-2 block">c:</label>
                <Input
                  type="number"
                  value={c}
                  onChange={(e) => {
                    setC(parseInt(e.target.value) || 0);
                    resetEquation();
                  }}
                  className="bg-white/20 border-white/30 text-white text-2xl font-bold text-center"
                />
              </div>
            </div>
          </div>

          {/* Step-by-Step Solution */}
          <div className="bg-white rounded-xl p-8 mb-6">
            <div className="text-center mb-6">
              <div className="text-5xl font-bold text-gray-800 mb-4">
                {steps[currentStep].text}
              </div>
              <div className="text-xl text-gray-600 font-semibold">
                {steps[currentStep].description}
              </div>
            </div>

            {/* Progress Indicator */}
            <div className="flex justify-center gap-2 mb-6">
              {steps.map((_, index) => (
                <div
                  key={index}
                  className={`w-12 h-2 rounded-full transition-colors ${
                    index <= currentStep ? 'bg-blue-500' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>

            {/* Navigation */}
            <div className="flex gap-4 justify-center">
              <Button
                onClick={prevStep}
                disabled={currentStep === 0}
                className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 disabled:opacity-50"
              >
                ← Önceki Adım
              </Button>
              <Button
                onClick={nextStep}
                disabled={currentStep === steps.length - 1}
                className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 disabled:opacity-50"
              >
                Sonraki Adım →
              </Button>
            </div>
          </div>

          {/* Answer Input */}
          <div className="bg-gradient-to-br from-blue-600 to-cyan-600 rounded-xl p-6 mb-6">
            <label className="text-white font-semibold mb-2 block text-center text-xl">
              x'in değeri nedir?
            </label>
            <Input
              type="number"
              step="0.1"
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              className={`text-4xl font-bold text-center border-4 ${
                userAnswer === ''
                  ? 'bg-white/20 border-white/30 text-white'
                  : isCorrect
                  ? 'border-green-500 bg-green-50 text-green-800'
                  : 'border-red-500 bg-red-50 text-red-800'
              }`}
              placeholder="Cevabını gir"
            />
          </div>

          {/* Feedback */}
          {userAnswer && (
            <div className={`text-center text-2xl font-bold ${isCorrect ? 'text-green-400' : 'text-red-400'}`}>
              {isCorrect ? '✓ Mükemmel! Doğru cevap!' : '✗ Tekrar dene!'}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
