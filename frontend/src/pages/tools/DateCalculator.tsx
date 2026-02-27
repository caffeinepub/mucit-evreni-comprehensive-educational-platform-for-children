import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ArrowLeft } from 'lucide-react';

interface DateCalculatorProps {
  onBack: () => void;
}

export default function DateCalculator({ onBack }: DateCalculatorProps) {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [birthDate, setBirthDate] = useState('');

  const calculateDaysDifference = () => {
    if (!startDate || !endDate) return null;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const calculateAge = () => {
    if (!birthDate) return null;
    const birth = new Date(birthDate);
    const today = new Date();
    let years = today.getFullYear() - birth.getFullYear();
    let months = today.getMonth() - birth.getMonth();
    let days = today.getDate() - birth.getDate();

    if (days < 0) {
      months--;
      const lastMonth = new Date(today.getFullYear(), today.getMonth(), 0);
      days += lastMonth.getDate();
    }

    if (months < 0) {
      years--;
      months += 12;
    }

    return { years, months, days };
  };

  const daysDiff = calculateDaysDifference();
  const age = calculateAge();

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
              📅 Tarih Hesaplayıcı
            </h2>
            <p className="text-white/80">Tarihler arasındaki farkı hesapla!</p>
          </div>

          <div className="space-y-6">
            {/* Date Difference Calculator */}
            <div className="bg-gradient-to-br from-blue-600 to-cyan-600 rounded-xl p-6">
              <h3 className="text-white text-2xl font-bold mb-4">Tarih Farkı Hesapla</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-white font-semibold mb-2 block">Başlangıç Tarihi:</label>
                  <Input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="bg-white/20 border-white/30 text-white"
                  />
                </div>
                <div>
                  <label className="text-white font-semibold mb-2 block">Bitiş Tarihi:</label>
                  <Input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="bg-white/20 border-white/30 text-white"
                  />
                </div>
                {daysDiff !== null && (
                  <div className="bg-white/20 rounded-lg p-4 text-center">
                    <p className="text-white text-lg mb-2">Fark:</p>
                    <p className="text-white text-4xl font-bold">{daysDiff} Gün</p>
                  </div>
                )}
              </div>
            </div>

            {/* Age Calculator */}
            <div className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl p-6">
              <h3 className="text-white text-2xl font-bold mb-4">Yaş Hesapla</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-white font-semibold mb-2 block">Doğum Tarihi:</label>
                  <Input
                    type="date"
                    value={birthDate}
                    onChange={(e) => setBirthDate(e.target.value)}
                    className="bg-white/20 border-white/30 text-white"
                  />
                </div>
                {age && (
                  <div className="bg-white/20 rounded-lg p-4">
                    <p className="text-white text-lg mb-3 text-center">Yaşın:</p>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center">
                        <p className="text-white text-3xl font-bold">{age.years}</p>
                        <p className="text-white/80">Yıl</p>
                      </div>
                      <div className="text-center">
                        <p className="text-white text-3xl font-bold">{age.months}</p>
                        <p className="text-white/80">Ay</p>
                      </div>
                      <div className="text-center">
                        <p className="text-white text-3xl font-bold">{age.days}</p>
                        <p className="text-white/80">Gün</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
