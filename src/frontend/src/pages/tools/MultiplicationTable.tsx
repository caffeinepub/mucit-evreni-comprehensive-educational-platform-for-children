import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';

interface MultiplicationTableProps {
  onBack: () => void;
}

export default function MultiplicationTable({ onBack }: MultiplicationTableProps) {
  const [selectedCell, setSelectedCell] = useState<{ row: number; col: number } | null>(null);
  const [showAnswers, setShowAnswers] = useState(true);

  const handleCellClick = (row: number, col: number) => {
    setSelectedCell({ row, col });
    setTimeout(() => setSelectedCell(null), 1000);
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
              🧠 Çarpım Tablosu
            </h2>
            <p className="text-white/80">Çarpım tablosunu eğlenerek öğren!</p>
          </div>

          <div className="flex justify-center mb-6">
            <Button
              onClick={() => setShowAnswers(!showAnswers)}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
            >
              {showAnswers ? 'Cevapları Gizle' : 'Cevapları Göster'}
            </Button>
          </div>

          <div className="overflow-x-auto">
            <div className="inline-block min-w-full">
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    <th className="bg-gradient-to-br from-purple-600 to-pink-600 text-white font-bold p-3 border-2 border-white/30">
                      ×
                    </th>
                    {Array.from({ length: 10 }, (_, i) => i + 1).map((num) => (
                      <th
                        key={num}
                        className="bg-gradient-to-br from-blue-600 to-cyan-600 text-white font-bold p-3 border-2 border-white/30"
                      >
                        {num}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {Array.from({ length: 10 }, (_, i) => i + 1).map((row) => (
                    <tr key={row}>
                      <td className="bg-gradient-to-br from-green-600 to-emerald-600 text-white font-bold p-3 border-2 border-white/30 text-center">
                        {row}
                      </td>
                      {Array.from({ length: 10 }, (_, i) => i + 1).map((col) => {
                        const result = row * col;
                        const isSelected = selectedCell?.row === row && selectedCell?.col === col;
                        return (
                          <td
                            key={col}
                            onClick={() => handleCellClick(row, col)}
                            className={`p-3 border-2 border-white/30 text-center font-bold cursor-pointer transition-all duration-300 ${
                              isSelected
                                ? 'bg-yellow-400 text-black scale-125 shadow-2xl'
                                : 'bg-white/20 text-white hover:bg-white/30 hover:scale-110'
                            }`}
                          >
                            {showAnswers || isSelected ? result : '?'}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-6 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl p-4 text-white text-center">
            <p className="text-lg">
              💡 İpucu: Hücrelere tıklayarak sonuçları görebilirsin!
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
