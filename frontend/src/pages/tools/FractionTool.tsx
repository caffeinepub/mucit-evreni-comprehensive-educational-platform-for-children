import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ArrowLeft } from 'lucide-react';

interface FractionToolProps {
  onBack: () => void;
}

export default function FractionTool({ onBack }: FractionToolProps) {
  const [numerator, setNumerator] = useState(1);
  const [denominator, setDenominator] = useState(4);

  const gcd = (a: number, b: number): number => {
    return b === 0 ? a : gcd(b, a % b);
  };

  const simplify = () => {
    const divisor = gcd(numerator, denominator);
    return {
      num: numerator / divisor,
      den: denominator / divisor,
    };
  };

  const simplified = simplify();
  const percentage = ((numerator / denominator) * 100).toFixed(1);

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
              🧩 Kesir Aracı
            </h2>
            <p className="text-white/80">Kesirleri görselleştir ve anla!</p>
          </div>

          {/* Fraction Input */}
          <div className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl p-6 mb-6">
            <div className="flex items-center justify-center gap-4">
              <div className="text-center">
                <label className="text-white font-semibold mb-2 block">Pay:</label>
                <Input
                  type="number"
                  min="0"
                  value={numerator}
                  onChange={(e) => setNumerator(Math.max(0, parseInt(e.target.value) || 0))}
                  className="bg-white/20 border-white/30 text-white text-3xl font-bold text-center w-24"
                />
              </div>
              <div className="text-white text-6xl font-bold">/</div>
              <div className="text-center">
                <label className="text-white font-semibold mb-2 block">Payda:</label>
                <Input
                  type="number"
                  min="1"
                  value={denominator}
                  onChange={(e) => setDenominator(Math.max(1, parseInt(e.target.value) || 1))}
                  className="bg-white/20 border-white/30 text-white text-3xl font-bold text-center w-24"
                />
              </div>
            </div>
          </div>

          {/* Visual Representation */}
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            {/* Bar Model */}
            <div className="bg-white rounded-xl p-6">
              <h3 className="text-gray-800 font-bold text-xl mb-4 text-center">Çubuk Modeli</h3>
              <div className="flex gap-1">
                {Array.from({ length: denominator }).map((_, i) => (
                  <div
                    key={i}
                    className={`flex-1 h-20 rounded ${
                      i < numerator ? 'bg-blue-500' : 'bg-gray-300'
                    } transition-colors duration-300`}
                  />
                ))}
              </div>
            </div>

            {/* Pie Chart */}
            <div className="bg-white rounded-xl p-6">
              <h3 className="text-gray-800 font-bold text-xl mb-4 text-center">Pasta Modeli</h3>
              <div className="relative w-40 h-40 mx-auto rounded-full overflow-hidden border-4 border-gray-800">
                {Array.from({ length: denominator }).map((_, i) => {
                  const startAngle = (360 / denominator) * i - 90;
                  const endAngle = (360 / denominator) * (i + 1) - 90;
                  const isFilled = i < numerator;
                  
                  return (
                    <div
                      key={i}
                      className="absolute inset-0"
                      style={{
                        background: `conic-gradient(${
                          isFilled ? '#3b82f6' : '#d1d5db'
                        } ${startAngle}deg ${endAngle}deg, transparent ${endAngle}deg)`,
                      }}
                    />
                  );
                })}
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-gradient-to-br from-blue-600 to-cyan-600 rounded-xl p-6 text-center">
              <p className="text-white text-lg mb-2">Sadeleştirilmiş Hali:</p>
              <p className="text-white text-4xl font-bold">
                {simplified.num} / {simplified.den}
              </p>
            </div>
            <div className="bg-gradient-to-br from-green-600 to-emerald-600 rounded-xl p-6 text-center">
              <p className="text-white text-lg mb-2">Yüzde Değeri:</p>
              <p className="text-white text-4xl font-bold">%{percentage}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
