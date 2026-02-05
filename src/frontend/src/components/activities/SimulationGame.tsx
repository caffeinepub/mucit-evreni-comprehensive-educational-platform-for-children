import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { AgeGroup } from '../../types';
import { Difficulty } from '../../pages/ClassView';
import { Beaker, Zap, Droplets, CheckCircle2, RefreshCw } from 'lucide-react';

interface SimulationGameProps {
  difficulty: Difficulty;
  ageGroup: AgeGroup;
  onComplete: (score: number) => void;
  maxScore: number;
}

// Different simulation scenarios
const scenarios = [
  { name: 'Su Deneyi', icon: Droplets, color: 'blue' },
  { name: 'Enerji Deneyi', icon: Zap, color: 'yellow' },
  { name: 'Kimya Deneyi', icon: Beaker, color: 'green' },
];

export default function SimulationGame({ difficulty, onComplete, maxScore }: SimulationGameProps) {
  const [temperature, setTemperature] = useState([20]);
  const [pressure, setPressure] = useState([50]);
  const [volume, setVolume] = useState([50]);
  const [simulated, setSimulated] = useState(false);
  const [result, setResult] = useState('');
  const [scenario, setScenario] = useState(scenarios[0]);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    // Randomly select scenario
    const randomScenario = scenarios[Math.floor(Math.random() * scenarios.length)];
    setScenario(randomScenario);
    resetSimulation();
  }, [refreshKey]);

  const resetSimulation = () => {
    setTemperature([Math.floor(Math.random() * 40) + 10]);
    setPressure([Math.floor(Math.random() * 60) + 20]);
    setVolume([Math.floor(Math.random() * 60) + 20]);
    setSimulated(false);
    setResult('');
  };

  const handleSimulate = () => {
    setSimulated(true);
    
    const temp = temperature[0];
    const press = pressure[0];
    const vol = volume[0];

    // Varied simulation logic based on scenario
    let resultText = '';
    let earnedScore = maxScore;

    if (difficulty === 'easy') {
      if (temp < 0) {
        resultText = '❄️ Su dondu! Buz oluştu.';
      } else if (temp > 100) {
        resultText = '💨 Su buharlaştı! Buhar oluştu.';
      } else {
        resultText = '💧 Su sıvı halde kaldı.';
      }
    } else if (difficulty === 'medium') {
      if (temp > 80 && press > 70) {
        resultText = '⚠️ Yüksek sıcaklık ve basınç! Dikkatli ol.';
        earnedScore = Math.floor(maxScore * 0.7);
      } else if (temp < 20 && vol < 30) {
        resultText = '❄️ Düşük sıcaklık ve hacim. Yoğunlaşma başladı.';
      } else {
        resultText = '✅ Dengeli koşullar. Sistem stabil.';
      }
    } else {
      const idealTemp = 50;
      const idealPress = 50;
      const idealVol = 50;
      
      const tempDiff = Math.abs(temp - idealTemp);
      const pressDiff = Math.abs(press - idealPress);
      const volDiff = Math.abs(vol - idealVol);
      
      const totalDiff = tempDiff + pressDiff + volDiff;
      
      if (totalDiff < 30) {
        resultText = '🎯 Mükemmel! Optimal koşulları sağladın.';
        earnedScore = maxScore;
      } else if (totalDiff < 60) {
        resultText = '✅ İyi! Koşullar kabul edilebilir seviyede.';
        earnedScore = Math.floor(maxScore * 0.8);
      } else {
        resultText = '⚠️ Koşullar optimal değil. Ayarları düzenle.';
        earnedScore = Math.floor(maxScore * 0.6);
      }
    }

    setResult(resultText);
    
    setTimeout(() => {
      onComplete(earnedScore);
    }, 3000);
  };

  const handleReplay = () => {
    setRefreshKey(prev => prev + 1);
  };

  const ScenarioIcon = scenario.icon;

  return (
    <div className="space-y-8">
      <div className="text-center">
        <div className="flex items-center justify-center gap-4">
          <h3 className="text-2xl font-bold text-white mb-2">{scenario.name}</h3>
          <Button
            onClick={handleReplay}
            variant="outline"
            size="sm"
            className="text-white border-white/30 hover:bg-white/10"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Yeni Deney
          </Button>
        </div>
        <p className="text-white/80">Parametreleri ayarla ve deneyi başlat</p>
      </div>

      <div className="grid gap-6">
        {/* Temperature Control */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <Zap className="w-6 h-6 text-orange-400" />
            <h4 className="text-xl font-bold text-white">Sıcaklık</h4>
            <span className="ml-auto text-2xl font-bold text-orange-400">{temperature[0]}°C</span>
          </div>
          <Slider
            value={temperature}
            onValueChange={setTemperature}
            min={-20}
            max={120}
            step={1}
            disabled={simulated}
            className="cursor-pointer"
          />
          <div className="flex justify-between text-white/60 text-sm mt-2">
            <span>-20°C</span>
            <span>120°C</span>
          </div>
        </div>

        {/* Pressure Control */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <Droplets className="w-6 h-6 text-blue-400" />
            <h4 className="text-xl font-bold text-white">Basınç</h4>
            <span className="ml-auto text-2xl font-bold text-blue-400">{pressure[0]}%</span>
          </div>
          <Slider
            value={pressure}
            onValueChange={setPressure}
            min={0}
            max={100}
            step={1}
            disabled={simulated}
            className="cursor-pointer"
          />
          <div className="flex justify-between text-white/60 text-sm mt-2">
            <span>Düşük</span>
            <span>Yüksek</span>
          </div>
        </div>

        {/* Volume Control */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <Beaker className="w-6 h-6 text-green-400" />
            <h4 className="text-xl font-bold text-white">Hacim</h4>
            <span className="ml-auto text-2xl font-bold text-green-400">{volume[0]}%</span>
          </div>
          <Slider
            value={volume}
            onValueChange={setVolume}
            min={0}
            max={100}
            step={1}
            disabled={simulated}
            className="cursor-pointer"
          />
          <div className="flex justify-between text-white/60 text-sm mt-2">
            <span>Az</span>
            <span>Çok</span>
          </div>
        </div>
      </div>

      {result && (
        <div className="bg-gradient-to-r from-green-500/20 to-blue-500/20 backdrop-blur-sm rounded-2xl p-8 text-center border-2 border-green-400/30">
          <CheckCircle2 className="w-16 h-16 text-green-400 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-white mb-2">Sonuç</h3>
          <p className="text-white text-xl">{result}</p>
        </div>
      )}

      <div className="flex gap-4 justify-center">
        {!simulated ? (
          <Button
            onClick={handleSimulate}
            size="lg"
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-xl px-12 py-6"
          >
            <ScenarioIcon className="w-6 h-6 mr-2" />
            Simülasyonu Başlat
          </Button>
        ) : (
          <Button
            onClick={resetSimulation}
            size="lg"
            variant="outline"
            className="text-xl px-12 py-6"
          >
            Tekrar Dene
          </Button>
        )}
      </div>
    </div>
  );
}
