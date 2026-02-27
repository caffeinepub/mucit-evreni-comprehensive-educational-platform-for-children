import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ArrowLeft } from 'lucide-react';

interface PlaceValueProps {
  onBack: () => void;
}

export default function PlaceValue({ onBack }: PlaceValueProps) {
  const [number, setNumber] = useState('12345');

  const getDigits = () => {
    const digits = number.split('').reverse();
    const places = ['Birler', 'Onlar', 'Yüzler', 'Binler', 'On Binler', 'Yüz Binler', 'Milyonlar'];
    const multipliers = [1, 10, 100, 1000, 10000, 100000, 1000000];
    
    return digits.map((digit, index) => ({
      digit: parseInt(digit) || 0,
      place: places[index] || `10^${index}`,
      multiplier: multipliers[index] || Math.pow(10, index),
      value: (parseInt(digit) || 0) * (multipliers[index] || Math.pow(10, index)),
    })).reverse();
  };

  const digits = getDigits();
  const colors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-green-500', 'bg-blue-500', 'bg-indigo-500', 'bg-purple-500'];

  return (
    <div className="max-w-4xl mx-auto">
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
              🔢 Basamak Değeri
            </h2>
            <p className="text-white/80">Sayıların basamak değerlerini keşfet!</p>
          </div>

          {/* Number Input */}
          <div className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl p-6 mb-6">
            <label className="text-white font-semibold mb-2 block text-center text-xl">Bir Sayı Gir:</label>
            <Input
              type="text"
              value={number}
              onChange={(e) => setNumber(e.target.value.replace(/[^0-9]/g, '').slice(0, 7))}
              className="bg-white/20 border-white/30 text-white text-5xl font-bold text-center"
              placeholder="12345"
            />
          </div>

          {/* Place Value Breakdown */}
          <div className="bg-white rounded-xl p-6 mb-6">
            <h3 className="text-gray-800 text-2xl font-bold mb-6 text-center">Basamak Ayrımı</h3>
            <div className="flex justify-center gap-2 mb-8">
              {digits.map((item, index) => (
                <div
                  key={index}
                  className={`${colors[index % colors.length]} text-white rounded-xl p-4 min-w-[80px] text-center transform hover:scale-110 transition-transform`}
                >
                  <div className="text-5xl font-bold mb-2">{item.digit}</div>
                  <div className="text-sm font-semibold">{item.place}</div>
                </div>
              ))}
            </div>

            {/* Detailed Breakdown */}
            <div className="space-y-3">
              {digits.map((item, index) => (
                <div
                  key={index}
                  className={`${colors[index % colors.length]} text-white rounded-lg p-4 flex items-center justify-between`}
                >
                  <span className="text-2xl font-bold">{item.place}:</span>
                  <span className="text-2xl font-bold">
                    {item.digit} × {item.multiplier.toLocaleString()} = {item.value.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Total */}
          <div className="bg-gradient-to-br from-green-600 to-emerald-600 rounded-xl p-6 text-center">
            <p className="text-white text-xl mb-2">Toplam Değer:</p>
            <p className="text-white text-5xl font-bold">
              {parseInt(number || '0').toLocaleString()}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
