import { Card, CardContent } from '@/components/ui/card';
import { AgeGroup } from '../types';
import { Sparkles, Star } from 'lucide-react';
import { useState } from 'react';
import ActivityPlayer from './ActivityPlayer';

export interface ActivityData {
  id: number;
  name: string;
  description: string;
  type: 'color-match' | 'shape-match' | 'animal-match' | 'detail-find' | 'math' | 'word' | 'logic' | 'quiz' | 'creative' | 'simulation';
  points: number;
  icon: string;
  color: string;
}

interface ActivityListProps {
  userId: string;
  ageGroup: AgeGroup;
  difficulty: 'easy' | 'medium' | 'hard';
}

const activities: Record<AgeGroup, Record<'easy' | 'medium' | 'hard', ActivityData[]>> = {
  'preschool': {
    easy: [
      { id: 1, name: 'Renk Eşleştirme', description: 'Aynı renkleri bul', type: 'color-match', points: 10, icon: '🎨', color: 'from-red-400 to-pink-500' },
      { id: 2, name: 'Şekil Tanıma', description: 'Şekilleri öğren', type: 'shape-match', points: 10, icon: '⭐', color: 'from-blue-400 to-cyan-500' },
      { id: 3, name: 'Hayvan Sesleri', description: 'Hayvanları tanı', type: 'animal-match', points: 10, icon: '🐱', color: 'from-green-400 to-emerald-500' },
      { id: 4, name: 'Detay Bulma', description: 'Farklı olanı bul', type: 'detail-find', points: 10, icon: '🔍', color: 'from-purple-400 to-violet-500' },
      { id: 5, name: 'Sayı Sayma', description: 'Nesneleri say', type: 'math', points: 10, icon: '🔢', color: 'from-yellow-400 to-orange-500' },
      { id: 6, name: 'Kelime Oyunu', description: 'Basit kelimeler', type: 'word', points: 10, icon: '📝', color: 'from-pink-400 to-rose-500' },
      { id: 7, name: 'Mantık Oyunu', description: 'Basit mantık', type: 'logic', points: 10, icon: '🧩', color: 'from-indigo-400 to-blue-500' },
      { id: 8, name: 'Bilgi Yarışması', description: 'Basit sorular', type: 'quiz', points: 10, icon: '❓', color: 'from-teal-400 to-cyan-500' },
      { id: 9, name: 'Yaratıcı Düşünme', description: 'Hayal et', type: 'creative', points: 10, icon: '💭', color: 'from-fuchsia-400 to-pink-500' },
      { id: 10, name: 'Keşif Oyunu', description: 'Keşfet', type: 'simulation', points: 10, icon: '🔬', color: 'from-lime-400 to-green-500' },
    ],
    medium: [
      { id: 11, name: 'Renk Karışımı', description: 'Renkleri karıştır', type: 'color-match', points: 15, icon: '🎨', color: 'from-red-500 to-pink-600' },
      { id: 12, name: 'Şekil Eşleştirme', description: 'Şekilleri eşleştir', type: 'shape-match', points: 15, icon: '⭐', color: 'from-blue-500 to-cyan-600' },
      { id: 13, name: 'Hayvan Eşleştirme', description: 'Hayvanları eşleştir', type: 'animal-match', points: 15, icon: '🐱', color: 'from-green-500 to-emerald-600' },
      { id: 14, name: 'Detay Arama', description: 'Detayları bul', type: 'detail-find', points: 15, icon: '🔍', color: 'from-purple-500 to-violet-600' },
      { id: 15, name: 'Basit Toplama', description: 'Topla', type: 'math', points: 15, icon: '🔢', color: 'from-yellow-500 to-orange-600' },
      { id: 16, name: 'Hece Oyunu', description: 'Heceleri öğren', type: 'word', points: 15, icon: '📝', color: 'from-pink-500 to-rose-600' },
      { id: 17, name: 'Desen Tamamlama', description: 'Deseni tamamla', type: 'logic', points: 15, icon: '🧩', color: 'from-indigo-500 to-blue-600' },
      { id: 18, name: 'Bilgi Testi', description: 'Sorulara cevap ver', type: 'quiz', points: 15, icon: '❓', color: 'from-teal-500 to-cyan-600' },
      { id: 19, name: 'Hikaye Oluşturma', description: 'Hikaye yarat', type: 'creative', points: 15, icon: '💭', color: 'from-fuchsia-500 to-pink-600' },
      { id: 20, name: 'Doğa Keşfi', description: 'Doğayı keşfet', type: 'simulation', points: 15, icon: '🔬', color: 'from-lime-500 to-green-600' },
    ],
    hard: [
      { id: 21, name: 'Renk Kombinasyonu', description: 'Renk kombinasyonları', type: 'color-match', points: 20, icon: '🎨', color: 'from-red-600 to-pink-700' },
      { id: 22, name: 'Şekil Kombinasyonu', description: 'Şekilleri birleştir', type: 'shape-match', points: 20, icon: '⭐', color: 'from-blue-600 to-cyan-700' },
      { id: 23, name: 'Hayvan Özellikleri', description: 'Hayvan özelliklerini öğren', type: 'animal-match', points: 20, icon: '🐱', color: 'from-green-600 to-emerald-700' },
      { id: 24, name: 'Detay Analizi', description: 'Detayları analiz et', type: 'detail-find', points: 20, icon: '🔍', color: 'from-purple-600 to-violet-700' },
      { id: 25, name: 'Toplama Çıkarma', description: 'Topla ve çıkar', type: 'math', points: 20, icon: '🔢', color: 'from-yellow-600 to-orange-700' },
      { id: 26, name: 'Kelime Oluşturma', description: 'Kelime oluştur', type: 'word', points: 20, icon: '📝', color: 'from-pink-600 to-rose-700' },
      { id: 27, name: 'Mantık Zinciri', description: 'Mantık zinciri kur', type: 'logic', points: 20, icon: '🧩', color: 'from-indigo-600 to-blue-700' },
      { id: 28, name: 'Bilgi Yarışması', description: 'Zor sorular', type: 'quiz', points: 20, icon: '❓', color: 'from-teal-600 to-cyan-700' },
      { id: 29, name: 'Yaratıcı Proje', description: 'Proje oluştur', type: 'creative', points: 20, icon: '💭', color: 'from-fuchsia-600 to-pink-700' },
      { id: 30, name: 'Bilim Deneyi', description: 'Deney yap', type: 'simulation', points: 20, icon: '🔬', color: 'from-lime-600 to-green-700' },
    ],
  },
  'elementary': {
    easy: [
      { id: 31, name: 'Renk Teorisi', description: 'Renk teorisini öğren', type: 'color-match', points: 15, icon: '🎨', color: 'from-red-400 to-pink-500' },
      { id: 32, name: 'Geometrik Şekiller', description: 'Geometrik şekilleri öğren', type: 'shape-match', points: 15, icon: '⭐', color: 'from-blue-400 to-cyan-500' },
      { id: 33, name: 'Hayvan Sınıflandırma', description: 'Hayvanları sınıflandır', type: 'animal-match', points: 15, icon: '🐱', color: 'from-green-400 to-emerald-500' },
      { id: 34, name: 'Görsel Algı', description: 'Görsel algını geliştir', type: 'detail-find', points: 15, icon: '🔍', color: 'from-purple-400 to-violet-500' },
      { id: 35, name: 'Dört İşlem', description: 'Dört işlem yap', type: 'math', points: 15, icon: '🔢', color: 'from-yellow-400 to-orange-500' },
      { id: 36, name: 'Kelime Dağarcığı', description: 'Kelime dağarcığını geliştir', type: 'word', points: 15, icon: '📝', color: 'from-pink-400 to-rose-500' },
      { id: 37, name: 'Mantık Problemleri', description: 'Mantık problemleri çöz', type: 'logic', points: 15, icon: '🧩', color: 'from-indigo-400 to-blue-500' },
      { id: 38, name: 'Genel Kültür', description: 'Genel kültür soruları', type: 'quiz', points: 15, icon: '❓', color: 'from-teal-400 to-cyan-500' },
      { id: 39, name: 'Yaratıcı Yazma', description: 'Yaratıcı yazma', type: 'creative', points: 15, icon: '💭', color: 'from-fuchsia-400 to-pink-500' },
      { id: 40, name: 'Bilim Simülasyonu', description: 'Bilim simülasyonu', type: 'simulation', points: 15, icon: '🔬', color: 'from-lime-400 to-green-500' },
    ],
    medium: [
      { id: 41, name: 'Renk Psikolojisi', description: 'Renk psikolojisi', type: 'color-match', points: 20, icon: '🎨', color: 'from-red-500 to-pink-600' },
      { id: 42, name: 'Geometri Problemleri', description: 'Geometri problemleri', type: 'shape-match', points: 20, icon: '⭐', color: 'from-blue-500 to-cyan-600' },
      { id: 43, name: 'Ekosistem', description: 'Ekosistemi öğren', type: 'animal-match', points: 20, icon: '🐱', color: 'from-green-500 to-emerald-600' },
      { id: 44, name: 'Dikkat Geliştirme', description: 'Dikkatini geliştir', type: 'detail-find', points: 20, icon: '🔍', color: 'from-purple-500 to-violet-600' },
      { id: 45, name: 'Çarpım Tablosu', description: 'Çarpım tablosu', type: 'math', points: 20, icon: '🔢', color: 'from-yellow-500 to-orange-600' },
      { id: 46, name: 'Eş Anlamlı Kelimeler', description: 'Eş anlamlı kelimeler', type: 'word', points: 20, icon: '📝', color: 'from-pink-500 to-rose-600' },
      { id: 47, name: 'Mantık Oyunları', description: 'Mantık oyunları', type: 'logic', points: 20, icon: '🧩', color: 'from-indigo-500 to-blue-600' },
      { id: 48, name: 'Fen Bilgisi', description: 'Fen bilgisi soruları', type: 'quiz', points: 20, icon: '❓', color: 'from-teal-500 to-cyan-600' },
      { id: 49, name: 'Hikaye Yazma', description: 'Hikaye yaz', type: 'creative', points: 20, icon: '💭', color: 'from-fuchsia-500 to-pink-600' },
      { id: 50, name: 'Fizik Deneyleri', description: 'Fizik deneyleri', type: 'simulation', points: 20, icon: '🔬', color: 'from-lime-500 to-green-600' },
    ],
    hard: [
      { id: 51, name: 'Renk Harmonisi', description: 'Renk harmonisi', type: 'color-match', points: 25, icon: '🎨', color: 'from-red-600 to-pink-700' },
      { id: 52, name: 'İleri Geometri', description: 'İleri geometri', type: 'shape-match', points: 25, icon: '⭐', color: 'from-blue-600 to-cyan-700' },
      { id: 53, name: 'Biyoloji', description: 'Biyoloji konuları', type: 'animal-match', points: 25, icon: '🐱', color: 'from-green-600 to-emerald-700' },
      { id: 54, name: 'Görsel Zeka', description: 'Görsel zeka', type: 'detail-find', points: 25, icon: '🔍', color: 'from-purple-600 to-violet-700' },
      { id: 55, name: 'Kesirler', description: 'Kesirler', type: 'math', points: 25, icon: '🔢', color: 'from-yellow-600 to-orange-700' },
      { id: 56, name: 'Zıt Anlamlı Kelimeler', description: 'Zıt anlamlı kelimeler', type: 'word', points: 25, icon: '📝', color: 'from-pink-600 to-rose-700' },
      { id: 57, name: 'Stratejik Düşünme', description: 'Stratejik düşünme', type: 'logic', points: 25, icon: '🧩', color: 'from-indigo-600 to-blue-700' },
      { id: 58, name: 'Sosyal Bilgiler', description: 'Sosyal bilgiler', type: 'quiz', points: 25, icon: '❓', color: 'from-teal-600 to-cyan-700' },
      { id: 59, name: 'Şiir Yazma', description: 'Şiir yaz', type: 'creative', points: 25, icon: '💭', color: 'from-fuchsia-600 to-pink-700' },
      { id: 60, name: 'Kimya Deneyleri', description: 'Kimya deneyleri', type: 'simulation', points: 25, icon: '🔬', color: 'from-lime-600 to-green-700' },
    ],
  },
  'middle': {
    easy: [
      { id: 61, name: 'Renk Bilimi', description: 'Renk bilimi', type: 'color-match', points: 20, icon: '🎨', color: 'from-red-400 to-pink-500' },
      { id: 62, name: 'Geometrik İspatlar', description: 'Geometrik ispatlar', type: 'shape-match', points: 20, icon: '⭐', color: 'from-blue-400 to-cyan-500' },
      { id: 63, name: 'Evrim', description: 'Evrim teorisi', type: 'animal-match', points: 20, icon: '🐱', color: 'from-green-400 to-emerald-500' },
      { id: 64, name: 'Analitik Düşünme', description: 'Analitik düşünme', type: 'detail-find', points: 20, icon: '🔍', color: 'from-purple-400 to-violet-500' },
      { id: 65, name: 'Cebir', description: 'Cebir problemleri', type: 'math', points: 20, icon: '🔢', color: 'from-yellow-400 to-orange-500' },
      { id: 66, name: 'Dil Bilgisi', description: 'Dil bilgisi kuralları', type: 'word', points: 20, icon: '📝', color: 'from-pink-400 to-rose-500' },
      { id: 67, name: 'Mantık Kuralları', description: 'Mantık kuralları', type: 'logic', points: 20, icon: '🧩', color: 'from-indigo-400 to-blue-500' },
      { id: 68, name: 'Tarih', description: 'Tarih soruları', type: 'quiz', points: 20, icon: '❓', color: 'from-teal-400 to-cyan-500' },
      { id: 69, name: 'Makale Yazma', description: 'Makale yaz', type: 'creative', points: 20, icon: '💭', color: 'from-fuchsia-400 to-pink-500' },
      { id: 70, name: 'Biyoloji Simülasyonu', description: 'Biyoloji simülasyonu', type: 'simulation', points: 20, icon: '🔬', color: 'from-lime-400 to-green-500' },
    ],
    medium: [
      { id: 71, name: 'Optik', description: 'Optik konuları', type: 'color-match', points: 25, icon: '🎨', color: 'from-red-500 to-pink-600' },
      { id: 72, name: 'Trigonometri', description: 'Trigonometri', type: 'shape-match', points: 25, icon: '⭐', color: 'from-blue-500 to-cyan-600' },
      { id: 73, name: 'Genetik', description: 'Genetik konuları', type: 'animal-match', points: 25, icon: '🐱', color: 'from-green-500 to-emerald-600' },
      { id: 74, name: 'Eleştirel Düşünme', description: 'Eleştirel düşünme', type: 'detail-find', points: 25, icon: '🔍', color: 'from-purple-500 to-violet-600' },
      { id: 75, name: 'Fonksiyonlar', description: 'Fonksiyonlar', type: 'math', points: 25, icon: '🔢', color: 'from-yellow-500 to-orange-600' },
      { id: 76, name: 'Edebiyat', description: 'Edebiyat konuları', type: 'word', points: 25, icon: '📝', color: 'from-pink-500 to-rose-600' },
      { id: 77, name: 'Algoritmik Düşünme', description: 'Algoritmik düşünme', type: 'logic', points: 25, icon: '🧩', color: 'from-indigo-500 to-blue-600' },
      { id: 78, name: 'Coğrafya', description: 'Coğrafya soruları', type: 'quiz', points: 25, icon: '❓', color: 'from-teal-500 to-cyan-600' },
      { id: 79, name: 'Araştırma Yazma', description: 'Araştırma yaz', type: 'creative', points: 25, icon: '💭', color: 'from-fuchsia-500 to-pink-600' },
      { id: 80, name: 'Fizik Simülasyonu', description: 'Fizik simülasyonu', type: 'simulation', points: 25, icon: '🔬', color: 'from-lime-500 to-green-600' },
    ],
    hard: [
      { id: 81, name: 'Kuantum Fiziği', description: 'Kuantum fiziği', type: 'color-match', points: 30, icon: '🎨', color: 'from-red-600 to-pink-700' },
      { id: 82, name: 'Analitik Geometri', description: 'Analitik geometri', type: 'shape-match', points: 30, icon: '⭐', color: 'from-blue-600 to-cyan-700' },
      { id: 83, name: 'Moleküler Biyoloji', description: 'Moleküler biyoloji', type: 'animal-match', points: 30, icon: '🐱', color: 'from-green-600 to-emerald-700' },
      { id: 84, name: 'Sistem Analizi', description: 'Sistem analizi', type: 'detail-find', points: 30, icon: '🔍', color: 'from-purple-600 to-violet-700' },
      { id: 85, name: 'Kalkülüs', description: 'Kalkülüs problemleri', type: 'math', points: 30, icon: '🔢', color: 'from-yellow-600 to-orange-700' },
      { id: 86, name: 'Retorik', description: 'Retorik sanatı', type: 'word', points: 30, icon: '📝', color: 'from-pink-600 to-rose-700' },
      { id: 87, name: 'Felsefi Düşünme', description: 'Felsefi düşünme', type: 'logic', points: 30, icon: '🧩', color: 'from-indigo-600 to-blue-700' },
      { id: 88, name: 'Felsefe', description: 'Felsefe soruları', type: 'quiz', points: 30, icon: '❓', color: 'from-teal-600 to-cyan-700' },
      { id: 89, name: 'Tez Yazma', description: 'Tez yaz', type: 'creative', points: 30, icon: '💭', color: 'from-fuchsia-600 to-pink-700' },
      { id: 90, name: 'Kimya Simülasyonu', description: 'Kimya simülasyonu', type: 'simulation', points: 30, icon: '🔬', color: 'from-lime-600 to-green-700' },
    ],
  },
};

export default function ActivityList({ userId, ageGroup, difficulty }: ActivityListProps) {
  const [selectedActivity, setSelectedActivity] = useState<ActivityData | null>(null);
  const activityList = activities[ageGroup][difficulty];

  if (selectedActivity) {
    return (
      <ActivityPlayer
        userId={userId}
        activity={selectedActivity}
        ageGroup={ageGroup}
        difficulty={difficulty}
        onComplete={() => setSelectedActivity(null)}
        onBack={() => setSelectedActivity(null)}
      />
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
      {activityList.map((activity) => (
        <Card
          key={activity.id}
          className="bg-white/10 backdrop-blur-md border-white/20 overflow-hidden cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-2xl group"
          onClick={() => setSelectedActivity(activity)}
        >
          <CardContent className="p-4 sm:p-6">
            <div className="relative mb-4">
              <div className={`absolute inset-0 bg-gradient-to-br ${activity.color} opacity-20 rounded-full blur-xl group-hover:opacity-40 transition-opacity`} />
              <div className="relative z-10 text-5xl sm:text-6xl text-center">
                {activity.icon}
              </div>
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-white text-center mb-2">
              {activity.name}
            </h3>
            <p className="text-white/70 text-center text-sm mb-4">
              {activity.description}
            </p>
            <div className="flex items-center justify-center gap-2">
              <Star className="w-5 h-5 text-yellow-400" />
              <span className="text-white font-bold text-lg">{activity.points}</span>
              <Sparkles className="w-5 h-5 text-yellow-400" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
