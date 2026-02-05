import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Search, Star } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface FormulaNotebookProps {
  onBack: () => void;
}

const formulas = {
  geometry: [
    { name: 'Kare Alanı', formula: 'A = a²', description: 'a: kenar uzunluğu' },
    { name: 'Dikdörtgen Alanı', formula: 'A = a × b', description: 'a: uzunluk, b: genişlik' },
    { name: 'Üçgen Alanı', formula: 'A = (a × h) / 2', description: 'a: taban, h: yükseklik' },
    { name: 'Daire Alanı', formula: 'A = π × r²', description: 'r: yarıçap' },
    { name: 'Daire Çevresi', formula: 'C = 2 × π × r', description: 'r: yarıçap' },
  ],
  arithmetic: [
    { name: 'Ortalama', formula: 'Ort = (a + b + c + ...) / n', description: 'n: sayı adedi' },
    { name: 'Yüzde', formula: '% = (parça / bütün) × 100', description: 'Yüzde hesaplama' },
    { name: 'Hız', formula: 'v = yol / zaman', description: 'v: hız' },
    { name: 'Yoğunluk', formula: 'ρ = kütle / hacim', description: 'ρ: yoğunluk' },
  ],
  physics: [
    { name: 'Kuvvet', formula: 'F = m × a', description: 'F: kuvvet, m: kütle, a: ivme' },
    { name: 'Enerji', formula: 'E = m × c²', description: 'E: enerji, m: kütle, c: ışık hızı' },
    { name: 'Basınç', formula: 'P = F / A', description: 'P: basınç, F: kuvvet, A: alan' },
    { name: 'İş', formula: 'W = F × d', description: 'W: iş, F: kuvvet, d: yol' },
  ],
};

export default function FormulaNotebook({ onBack }: FormulaNotebookProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [favorites, setFavorites] = useState<string[]>([]);

  const toggleFavorite = (formulaName: string) => {
    if (favorites.includes(formulaName)) {
      setFavorites(favorites.filter(f => f !== formulaName));
    } else {
      setFavorites([...favorites, formulaName]);
    }
  };

  const filterFormulas = (formulaList: typeof formulas.geometry) => {
    if (!searchTerm) return formulaList;
    return formulaList.filter(f =>
      f.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.formula.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const FormulaCard = ({ formula }: { formula: typeof formulas.geometry[0] }) => (
    <div className="bg-white/20 rounded-xl p-4 hover:bg-white/30 transition-colors">
      <div className="flex items-start justify-between mb-2">
        <h4 className="text-white font-bold text-lg">{formula.name}</h4>
        <button
          onClick={() => toggleFavorite(formula.name)}
          className="text-yellow-400 hover:scale-110 transition-transform"
        >
          <Star className={`w-5 h-5 ${favorites.includes(formula.name) ? 'fill-current' : ''}`} />
        </button>
      </div>
      <div className="bg-white/30 rounded-lg p-3 mb-2">
        <p className="text-white text-2xl font-mono font-bold text-center">{formula.formula}</p>
      </div>
      <p className="text-white/80 text-sm">{formula.description}</p>
    </div>
  );

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
              📘 Formül Defteri
            </h2>
            <p className="text-white/80">Tüm formüller bir arada!</p>
          </div>

          {/* Search */}
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 w-5 h-5" />
              <Input
                type="text"
                placeholder="Formül ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-white/20 border-white/30 text-white pl-10"
              />
            </div>
          </div>

          <Tabs defaultValue="geometry" className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-6">
              <TabsTrigger value="geometry">Geometri</TabsTrigger>
              <TabsTrigger value="arithmetic">Aritmetik</TabsTrigger>
              <TabsTrigger value="physics">Fizik</TabsTrigger>
              <TabsTrigger value="favorites">Favoriler</TabsTrigger>
            </TabsList>

            <TabsContent value="geometry">
              <div className="space-y-4">
                {filterFormulas(formulas.geometry).map((formula, index) => (
                  <FormulaCard key={index} formula={formula} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="arithmetic">
              <div className="space-y-4">
                {filterFormulas(formulas.arithmetic).map((formula, index) => (
                  <FormulaCard key={index} formula={formula} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="physics">
              <div className="space-y-4">
                {filterFormulas(formulas.physics).map((formula, index) => (
                  <FormulaCard key={index} formula={formula} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="favorites">
              <div className="space-y-4">
                {favorites.length === 0 ? (
                  <div className="text-center text-white/60 py-12">
                    <Star className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p className="text-xl">Henüz favori formülün yok</p>
                    <p className="text-sm mt-2">Yıldız ikonuna tıklayarak formül ekle!</p>
                  </div>
                ) : (
                  <>
                    {Object.values(formulas).flat().filter(f => favorites.includes(f.name)).map((formula, index) => (
                      <FormulaCard key={index} formula={formula} />
                    ))}
                  </>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
