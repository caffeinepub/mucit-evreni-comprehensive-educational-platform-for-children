import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { AgeGroup } from '../../types';
import { Difficulty } from '../../pages/ClassView';
import { Lightbulb, CheckCircle2, RefreshCw } from 'lucide-react';

interface CreativeGameProps {
  difficulty: Difficulty;
  ageGroup: AgeGroup;
  onComplete: (score: number) => void;
  maxScore: number;
}

// Expanded prompt database
const promptDatabase = {
  easy: [
    'Evde kullanabileceğin yeni bir oyuncak tasarla. Nasıl çalışır?',
    'Okula giderken seni taşıyacak hayal gücüyle bir araç çiz ve anlat.',
    'Arkadaşlarınla oynayabileceğin yeni bir oyun icat et.',
    'Hayvanlarla konuşabilen bir cihaz tasarla. Nasıl kullanılır?',
    'Yağmurda ıslanmadan yürüyebileceğin bir buluş yap.',
    'Oyuncaklarını toplayan bir robot tasarla.',
  ],
  medium: [
    'Çevreyi korumak için bir buluş tasarla. Nasıl çalışır ve neden önemli?',
    'Gelecekte evlerin nasıl olacağını hayal et ve tasarla.',
    'Su tasarrufu yapan bir sistem icat et. Nasıl çalışır?',
    'Okullarda kullanılabilecek yeni bir öğrenme aracı tasarla.',
    'Atıkları geri dönüştüren akıllı bir çöp kutusu icat et.',
    'Enerji tasarrufu sağlayan bir ev cihazı tasarla.',
  ],
  hard: [
    'Küresel ısınmayı azaltmak için yenilikçi bir çözüm öner. Detaylı açıkla.',
    'Uzayda yaşam için gerekli bir teknoloji tasarla. Bilimsel olarak açıkla.',
    'Yapay zeka kullanarak topluma fayda sağlayacak bir proje geliştir.',
    'Okyanusları temizleyecek bir sistem tasarla ve çalışma prensibini açıkla.',
    'Yenilenebilir enerji kaynağı kullanan bir şehir planla.',
    'Hastalıkları erken teşhis eden bir tıbbi cihaz tasarla.',
  ],
};

export default function CreativeGame({ difficulty, onComplete, maxScore }: CreativeGameProps) {
  const [selectedPrompt, setSelectedPrompt] = useState('');
  const [answer, setAnswer] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    selectRandomPrompt();
  }, [difficulty, refreshKey]);

  const selectRandomPrompt = () => {
    const prompts = promptDatabase[difficulty];
    const randomPrompt = prompts[Math.floor(Math.random() * prompts.length)];
    setSelectedPrompt(randomPrompt);
    setAnswer('');
    setSubmitted(false);
  };

  const handleSubmit = () => {
    if (answer.trim().length < 50) {
      return;
    }

    setSubmitted(true);
    // Award points based on length and effort
    const wordCount = answer.trim().split(/\s+/).length;
    let earnedScore = maxScore;
    
    if (wordCount < 30) {
      earnedScore = Math.floor(maxScore * 0.6);
    } else if (wordCount < 50) {
      earnedScore = Math.floor(maxScore * 0.8);
    }

    setTimeout(() => {
      onComplete(earnedScore);
    }, 2000);
  };

  const handleReplay = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <div className="flex items-center justify-center gap-4">
          <h3 className="text-2xl font-bold text-white mb-2">Yaratıcı Proje</h3>
          <Button
            onClick={handleReplay}
            variant="outline"
            size="sm"
            className="text-white border-white/30 hover:bg-white/10"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Yeni Görev
          </Button>
        </div>
        <p className="text-white/80">Fikirlerini paylaş ve puan kazan</p>
      </div>

      <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-sm rounded-2xl p-8 border-2 border-purple-400/30">
        <div className="flex items-start gap-4">
          <Lightbulb className="w-12 h-12 text-yellow-400 shrink-0 mt-1" />
          <div>
            <h4 className="text-xl font-bold text-white mb-3">Görev:</h4>
            <p className="text-white text-lg leading-relaxed">{selectedPrompt}</p>
          </div>
        </div>
      </div>

      {!submitted ? (
        <div className="space-y-4">
          <Textarea
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Fikirlerini buraya yaz... (En az 50 karakter)"
            className="min-h-64 text-lg bg-white/10 border-white/20 text-white placeholder:text-white/50 resize-none"
          />
          <div className="flex items-center justify-between">
            <p className="text-white/70">
              Karakter sayısı: {answer.length} {answer.length < 50 && `(En az ${50 - answer.length} karakter daha)`}
            </p>
            <Button
              onClick={handleSubmit}
              disabled={answer.trim().length < 50}
              size="lg"
              className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-lg px-8"
            >
              <CheckCircle2 className="w-5 h-5 mr-2" />
              Gönder
            </Button>
          </div>
        </div>
      ) : (
        <div className="bg-green-500/20 backdrop-blur-sm rounded-2xl p-12 text-center">
          <CheckCircle2 className="w-20 h-20 text-green-400 mx-auto mb-6" />
          <h3 className="text-3xl font-bold text-green-400 mb-4">Harika Bir Fikir!</h3>
          <p className="text-white text-xl">
            Yaratıcılığın için tebrikler! Projen kaydedildi.
          </p>
        </div>
      )}
    </div>
  );
}
