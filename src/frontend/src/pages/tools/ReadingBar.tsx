import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, ChevronUp, ChevronDown } from 'lucide-react';

interface ReadingBarProps {
  onBack: () => void;
}

const sampleText = `Bir varmış bir yokmuş, evvel zaman içinde, kalbur saman içinde...

Uzak diyarlarda küçük bir köyde yaşayan bir çocuk varmış. Bu çocuk her gün kitap okumayı çok severmiş.

Bir gün ormanda yürürken parlak bir ışık görmüş. Işığın yanına gittiğinde sihirli bir kitap bulmuş.

Kitabı açtığında içinden renkli kelebekler uçuşmaya başlamış. Her kelebek bir hikaye anlatıyormuş.

Çocuk o günden sonra her gün yeni hikayeler keşfetmiş ve hayal gücü daha da gelişmiş.`;

export default function ReadingBar({ onBack }: ReadingBarProps) {
  const [text, setText] = useState(sampleText);
  const [barPosition, setBarPosition] = useState(0);
  const [fontSize, setFontSize] = useState(18);

  const lines = text.split('\n').filter(line => line.trim() !== '');

  const moveUp = () => {
    setBarPosition(Math.max(0, barPosition - 1));
  };

  const moveDown = () => {
    setBarPosition(Math.min(lines.length - 1, barPosition + 1));
  };

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
              📖 Okuma Çubuğu
            </h2>
            <p className="text-white/80">Okumana odaklan, satır satır ilerle!</p>
          </div>

          {/* Text Input */}
          <div className="mb-6">
            <label className="text-white font-semibold mb-2 block">Metni Buraya Yapıştır:</label>
            <Textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="bg-white/20 border-white/30 text-white min-h-[150px]"
              placeholder="Okumak istediğin metni buraya yapıştır..."
            />
          </div>

          {/* Font Size Control */}
          <div className="mb-6 flex items-center gap-4 justify-center">
            <span className="text-white font-semibold">Yazı Boyutu:</span>
            <input
              type="range"
              min="14"
              max="32"
              value={fontSize}
              onChange={(e) => setFontSize(Number(e.target.value))}
              className="w-48"
            />
            <span className="text-white font-bold">{fontSize}px</span>
          </div>

          {/* Reading Area */}
          <div className="bg-white rounded-2xl p-8 mb-6 relative" style={{ minHeight: '400px' }}>
            {lines.map((line, index) => (
              <div
                key={index}
                className={`py-2 px-4 transition-all duration-300 ${
                  index === barPosition
                    ? 'bg-yellow-200 font-bold scale-105'
                    : 'opacity-40'
                }`}
                style={{ fontSize: `${fontSize}px` }}
              >
                {line}
              </div>
            ))}
          </div>

          {/* Controls */}
          <div className="flex gap-4 justify-center">
            <Button
              onClick={moveUp}
              disabled={barPosition === 0}
              className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white disabled:opacity-50"
            >
              <ChevronUp className="w-6 h-6" />
              Yukarı
            </Button>
            <div className="bg-white/20 rounded-lg px-6 py-3 text-white font-bold text-xl">
              Satır: {barPosition + 1} / {lines.length}
            </div>
            <Button
              onClick={moveDown}
              disabled={barPosition === lines.length - 1}
              className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white disabled:opacity-50"
            >
              <ChevronDown className="w-6 h-6" />
              Aşağı
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
