import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, ZoomIn, ZoomOut, ChevronLeft, ChevronRight } from 'lucide-react';

interface NumberLineProps {
  onBack: () => void;
}

export default function NumberLine({ onBack }: NumberLineProps) {
  const [position, setPosition] = useState(0);
  const [range, setRange] = useState(10);

  const zoomIn = () => {
    setRange(Math.max(5, range - 5));
  };

  const zoomOut = () => {
    setRange(Math.min(50, range + 5));
  };

  const moveLeft = () => {
    setPosition(position - 1);
  };

  const moveRight = () => {
    setPosition(position + 1);
  };

  const numbers = Array.from({ length: range * 2 + 1 }, (_, i) => position - range + i);

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
              🔢 Sayı Doğrusu
            </h2>
            <p className="text-white/80">Sayıları keşfet ve hareket ettir!</p>
          </div>

          {/* Current Position Display */}
          <div className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl p-6 mb-6 text-center">
            <p className="text-white text-lg mb-2">Şu Anki Konum:</p>
            <p className="text-white text-6xl font-bold">{position}</p>
          </div>

          {/* Number Line */}
          <div className="bg-white rounded-2xl p-8 mb-6 overflow-x-auto">
            <div className="relative" style={{ minWidth: '800px' }}>
              {/* Line */}
              <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-800 transform -translate-y-1/2" />
              
              {/* Numbers and Marks */}
              <div className="flex justify-between items-center relative">
                {numbers.map((num) => {
                  const isCenter = num === position;
                  const isZero = num === 0;
                  return (
                    <div key={num} className="flex flex-col items-center">
                      <div
                        className={`w-1 transition-all duration-300 ${
                          isCenter
                            ? 'h-16 bg-red-600'
                            : isZero
                            ? 'h-12 bg-blue-600'
                            : num % 5 === 0
                            ? 'h-10 bg-gray-600'
                            : 'h-6 bg-gray-400'
                        }`}
                      />
                      <span
                        className={`mt-2 transition-all duration-300 ${
                          isCenter
                            ? 'text-2xl font-bold text-red-600'
                            : isZero
                            ? 'text-xl font-bold text-blue-600'
                            : 'text-sm text-gray-600'
                        }`}
                      >
                        {num}
                      </span>
                    </div>
                  );
                })}
              </div>
              
              {/* Pointer */}
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-full">
                <div className="w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-red-600" />
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button
              onClick={moveLeft}
              className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white"
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Sola
            </Button>
            <Button
              onClick={moveRight}
              className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white"
            >
              Sağa
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
            <Button
              onClick={zoomIn}
              className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white"
            >
              <ZoomIn className="w-4 h-4 mr-2" />
              Yakınlaş
            </Button>
            <Button
              onClick={zoomOut}
              className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white"
            >
              <ZoomOut className="w-4 h-4 mr-2" />
              Uzaklaş
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
