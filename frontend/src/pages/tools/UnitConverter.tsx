import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, ArrowRightLeft } from 'lucide-react';

interface UnitConverterProps {
  onBack: () => void;
}

interface UnitData {
  name: string;
  toBase: number;
}

interface CategoryData {
  name: string;
  units: Record<string, UnitData>;
}

const conversionData: Record<string, CategoryData> = {
  length: {
    name: 'Uzunluk',
    units: {
      mm: { name: 'Milimetre', toBase: 0.001 },
      cm: { name: 'Santimetre', toBase: 0.01 },
      m: { name: 'Metre', toBase: 1 },
      km: { name: 'Kilometre', toBase: 1000 },
    },
  },
  weight: {
    name: 'Ağırlık',
    units: {
      mg: { name: 'Miligram', toBase: 0.001 },
      g: { name: 'Gram', toBase: 1 },
      kg: { name: 'Kilogram', toBase: 1000 },
      ton: { name: 'Ton', toBase: 1000000 },
    },
  },
  temperature: {
    name: 'Sıcaklık',
    units: {
      celsius: { name: 'Celsius (°C)', toBase: 1 },
      fahrenheit: { name: 'Fahrenheit (°F)', toBase: 1 },
      kelvin: { name: 'Kelvin (K)', toBase: 1 },
    },
  },
  time: {
    name: 'Zaman',
    units: {
      second: { name: 'Saniye', toBase: 1 },
      minute: { name: 'Dakika', toBase: 60 },
      hour: { name: 'Saat', toBase: 3600 },
      day: { name: 'Gün', toBase: 86400 },
    },
  },
};

export default function UnitConverter({ onBack }: UnitConverterProps) {
  const [category, setCategory] = useState<string>('length');
  const [fromUnit, setFromUnit] = useState('m');
  const [toUnit, setToUnit] = useState('km');
  const [fromValue, setFromValue] = useState('1');
  const [result, setResult] = useState('0.001');

  const handleConvert = (value: string, from: string, to: string, cat: string) => {
    const numValue = parseFloat(value) || 0;
    
    if (cat === 'temperature') {
      let result = 0;
      if (from === 'celsius' && to === 'fahrenheit') {
        result = (numValue * 9/5) + 32;
      } else if (from === 'celsius' && to === 'kelvin') {
        result = numValue + 273.15;
      } else if (from === 'fahrenheit' && to === 'celsius') {
        result = (numValue - 32) * 5/9;
      } else if (from === 'fahrenheit' && to === 'kelvin') {
        result = (numValue - 32) * 5/9 + 273.15;
      } else if (from === 'kelvin' && to === 'celsius') {
        result = numValue - 273.15;
      } else if (from === 'kelvin' && to === 'fahrenheit') {
        result = (numValue - 273.15) * 9/5 + 32;
      } else {
        result = numValue;
      }
      setResult(result.toFixed(2));
    } else {
      const categoryData = conversionData[cat];
      const fromBase = categoryData.units[from]?.toBase || 1;
      const toBase = categoryData.units[to]?.toBase || 1;
      const resultValue = (numValue * fromBase) / toBase;
      setResult(resultValue.toFixed(4));
    }
  };

  const handleCategoryChange = (newCategory: string) => {
    setCategory(newCategory);
    const units = Object.keys(conversionData[newCategory].units);
    setFromUnit(units[0]);
    setToUnit(units[1] || units[0]);
    setFromValue('1');
    handleConvert('1', units[0], units[1] || units[0], newCategory);
  };

  const handleFromValueChange = (value: string) => {
    setFromValue(value);
    handleConvert(value, fromUnit, toUnit, category);
  };

  const handleFromUnitChange = (unit: string) => {
    setFromUnit(unit);
    handleConvert(fromValue, unit, toUnit, category);
  };

  const handleToUnitChange = (unit: string) => {
    setToUnit(unit);
    handleConvert(fromValue, fromUnit, unit, category);
  };

  const swapUnits = () => {
    setFromUnit(toUnit);
    setToUnit(fromUnit);
    setFromValue(result);
    handleConvert(result, toUnit, fromUnit, category);
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
              🔁 Birim Dönüştürücü
            </h2>
            <p className="text-white/80">Birimleri kolayca dönüştür!</p>
          </div>

          <div className="space-y-6">
            {/* Category Selection */}
            <div>
              <label className="text-white font-semibold mb-2 block">Kategori Seç:</label>
              <Select value={category} onValueChange={handleCategoryChange}>
                <SelectTrigger className="bg-white/20 border-white/30 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(conversionData).map(([key, data]) => (
                    <SelectItem key={key} value={key}>{data.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* From Unit */}
            <div className="bg-gradient-to-br from-blue-600 to-cyan-600 rounded-xl p-6">
              <label className="text-white font-semibold mb-2 block">Dönüştürülecek:</label>
              <Input
                type="number"
                value={fromValue}
                onChange={(e) => handleFromValueChange(e.target.value)}
                className="bg-white/20 border-white/30 text-white text-2xl font-bold mb-3"
                placeholder="Değer gir"
              />
              <Select value={fromUnit} onValueChange={handleFromUnitChange}>
                <SelectTrigger className="bg-white/20 border-white/30 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(conversionData[category].units).map(([key, unit]) => (
                    <SelectItem key={key} value={key}>{unit.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Swap Button */}
            <div className="flex justify-center">
              <Button
                onClick={swapUnits}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-full p-4"
              >
                <ArrowRightLeft className="w-6 h-6" />
              </Button>
            </div>

            {/* To Unit */}
            <div className="bg-gradient-to-br from-green-600 to-emerald-600 rounded-xl p-6">
              <label className="text-white font-semibold mb-2 block">Sonuç:</label>
              <div className="bg-white/20 border-white/30 text-white text-2xl font-bold p-3 rounded-lg mb-3">
                {result}
              </div>
              <Select value={toUnit} onValueChange={handleToUnitChange}>
                <SelectTrigger className="bg-white/20 border-white/30 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(conversionData[category].units).map(([key, unit]) => (
                    <SelectItem key={key} value={key}>{unit.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
