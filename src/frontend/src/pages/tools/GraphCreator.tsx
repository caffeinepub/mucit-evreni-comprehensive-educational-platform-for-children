import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Plus, Trash2 } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface GraphCreatorProps {
  onBack: () => void;
}

export default function GraphCreator({ onBack }: GraphCreatorProps) {
  const [chartType, setChartType] = useState<'bar' | 'line'>('bar');
  const [data, setData] = useState([
    { name: 'A', value: 10 },
    { name: 'B', value: 20 },
    { name: 'C', value: 15 },
  ]);
  const [newName, setNewName] = useState('');
  const [newValue, setNewValue] = useState('');

  const addData = () => {
    if (newName && newValue) {
      setData([...data, { name: newName, value: parseFloat(newValue) || 0 }]);
      setNewName('');
      setNewValue('');
    }
  };

  const removeData = (index: number) => {
    setData(data.filter((_, i) => i !== index));
  };

  const maxValue = Math.max(...data.map(d => d.value), 0);
  const minValue = Math.min(...data.map(d => d.value), 0);

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
              📊 Grafik Oluşturucu
            </h2>
            <p className="text-white/80">Verilerini grafiğe dönüştür!</p>
          </div>

          {/* Chart Type Selection */}
          <div className="flex gap-4 mb-6">
            <Button
              onClick={() => setChartType('bar')}
              className={`flex-1 ${chartType === 'bar' ? 'bg-gradient-to-r from-blue-500 to-cyan-500' : 'bg-white/20'}`}
            >
              Sütun Grafiği
            </Button>
            <Button
              onClick={() => setChartType('line')}
              className={`flex-1 ${chartType === 'line' ? 'bg-gradient-to-r from-purple-500 to-pink-500' : 'bg-white/20'}`}
            >
              Çizgi Grafiği
            </Button>
          </div>

          {/* Data Input */}
          <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl p-6 mb-6">
            <h3 className="text-white text-xl font-bold mb-4">Veri Ekle</h3>
            <div className="flex gap-2 mb-4">
              <Input
                placeholder="İsim"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="bg-white/20 border-white/30 text-white flex-1"
              />
              <Input
                type="number"
                placeholder="Değer"
                value={newValue}
                onChange={(e) => setNewValue(e.target.value)}
                className="bg-white/20 border-white/30 text-white flex-1"
              />
              <Button
                onClick={addData}
                className="bg-green-600 hover:bg-green-700"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>

            {/* Data List */}
            <div className="space-y-2">
              {data.map((item, index) => (
                <div key={index} className="flex items-center justify-between bg-white/20 rounded-lg p-3">
                  <span className="text-white font-semibold">{item.name}: {item.value}</span>
                  <Button
                    onClick={() => removeData(index)}
                    variant="destructive"
                    size="sm"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* Chart Display */}
          <div className="bg-white rounded-xl p-6 mb-6">
            <ResponsiveContainer width="100%" height={300}>
              {chartType === 'bar' ? (
                <BarChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" fill="#3b82f6" />
                </BarChart>
              ) : (
                <LineChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="value" stroke="#8b5cf6" strokeWidth={3} />
                </LineChart>
              )}
            </ResponsiveContainer>
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-gradient-to-br from-green-600 to-emerald-600 rounded-xl p-4 text-center">
              <p className="text-white text-sm mb-1">En Yüksek</p>
              <p className="text-white text-2xl font-bold">{maxValue}</p>
            </div>
            <div className="bg-gradient-to-br from-orange-600 to-red-600 rounded-xl p-4 text-center">
              <p className="text-white text-sm mb-1">En Düşük</p>
              <p className="text-white text-2xl font-bold">{minValue}</p>
            </div>
            <div className="bg-gradient-to-br from-blue-600 to-cyan-600 rounded-xl p-4 text-center">
              <p className="text-white text-sm mb-1">Toplam</p>
              <p className="text-white text-2xl font-bold">{data.reduce((sum, item) => sum + item.value, 0)}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
