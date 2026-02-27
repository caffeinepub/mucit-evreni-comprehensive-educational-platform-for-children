import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Sparkles } from 'lucide-react';
import { useActor } from '../hooks/useActor';

interface AvatarSelectionProps {
  onComplete: (userId: string, username: string, avatarId: number, ogrenciNumarasi: string) => void;
}

const avatars = [
  { id: 1, name: 'Bilim İnsanı', image: '/assets/generated/child-inventor-scientist-transparent.dim_150x150.png' },
  { id: 2, name: 'İnşaatçı', image: '/assets/generated/child-inventor-builder-transparent.dim_150x150.png' },
  { id: 3, name: 'Düşünür', image: '/assets/generated/child-inventor-thinker-transparent.dim_150x150.png' },
  { id: 4, name: 'Sanatçı', image: '/assets/generated/child-inventor-artist-transparent.dim_150x150.png' },
  { id: 5, name: 'Teknoloji Uzmanı', image: '/assets/generated/child-inventor-tech-transparent.dim_150x150.png' },
  { id: 6, name: 'Kaşif', image: '/assets/generated/child-inventor-explorer-transparent.dim_150x150.png' },
  { id: 7, name: 'Mühendis', image: '/assets/generated/child-inventor-engineer-transparent.dim_150x150.png' },
  { id: 8, name: 'Müzisyen', image: '/assets/generated/child-inventor-musician-transparent.dim_150x150.png' },
  { id: 9, name: 'Bahçıvan', image: '/assets/generated/child-inventor-gardener-transparent.dim_150x150.png' },
  { id: 10, name: 'Uzay Kaşifi', image: '/assets/generated/child-inventor-space-transparent.dim_150x150.png' },
];

// Generate a unique 16-digit numeric Öğrenci Numarası
function generateOgrenciNumarasi(): string {
  const timestamp = Date.now().toString().slice(-10); // Last 10 digits of timestamp
  const random = Math.floor(Math.random() * 1000000).toString().padStart(6, '0'); // 6 random digits
  return timestamp + random;
}

export default function AvatarSelection({ onComplete }: AvatarSelectionProps) {
  const [selectedAvatar, setSelectedAvatar] = useState<number | null>(null);
  const [userName, setUserName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { actor } = useActor();

  const handleStart = async () => {
    if (!selectedAvatar || !userName.trim()) {
      toast.error('Lütfen bir avatar seç ve ismini yaz!');
      return;
    }

    setIsLoading(true);
    
    // Generate unique Öğrenci Numarası (sanitized - no spaces)
    const ogrenciNumarasi = generateOgrenciNumarasi();
    const userId = `user_${ogrenciNumarasi}`;
    const trimmedUsername = userName.trim();
    
    try {
      // Save to localStorage immediately
      const profileData = {
        studentNumber: ogrenciNumarasi,
        username: trimmedUsername,
        avatar: selectedAvatar.toString(),
        notificationsEnabled: true,
        soundEnabled: true,
        createdAt: Date.now(),
      };
      
      localStorage.setItem('currentProfile', JSON.stringify(profileData));
      localStorage.setItem(`profile_${ogrenciNumarasi}`, JSON.stringify(profileData));
      
      // Initialize progress data
      const progressData = {
        totalScore: 0,
        achievementLevel: 'Acemi',
        progressPercentage: 0,
        completedActivities: [],
        lastUpdated: Date.now(),
      };
      localStorage.setItem(`progress_${ogrenciNumarasi}`, JSON.stringify(progressData));
      
      // Sync to backend immediately if online
      if (navigator.onLine && actor) {
        try {
          await actor.saveStudentProfile({
            studentNumber: ogrenciNumarasi,
            username: trimmedUsername,
            avatar: selectedAvatar.toString(),
            notificationEnabled: true,
            soundEnabled: true,
            createdAt: BigInt(Date.now()),
            lastUpdated: BigInt(Date.now()),
          });
          
          await actor.saveProgress(ogrenciNumarasi, {
            totalScore: 0n,
            achievementBadge: 'Acemi',
            progressPercentage: 0n,
            completedActivities: [],
            lastActivityDate: BigInt(Date.now()),
          });
          
          console.log('✅ Profile synced to backend successfully');
        } catch (error) {
          console.error('⚠️ Backend sync failed (will retry later):', error);
        }
      }
      
      // Show success message and proceed
      toast.success(`Hoş geldin ${trimmedUsername}! 🚀`);
      
      setTimeout(() => {
        setIsLoading(false);
        onComplete(userId, trimmedUsername, selectedAvatar, ogrenciNumarasi);
      }, 500);
      
    } catch (error) {
      console.error('Error saving profile:', error);
      const errorMessage = error instanceof Error ? error.message : 'Bilinmeyen bir hata oluştu';
      toast.error(`Profil kaydedilemedi: ${errorMessage}. Lütfen tekrar dene.`);
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-200px)] px-4">
      <Card className="w-full max-w-5xl bg-white/10 backdrop-blur-md border-white/20 text-white">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Sparkles className="w-16 h-16 text-yellow-300 animate-pulse" />
          </div>
          <CardTitle className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-yellow-300 to-pink-300 bg-clip-text text-transparent">
            Mucit Evreni'ne Hoş Geldin!
          </CardTitle>
          <CardDescription className="text-white/80 text-lg">
            Maceraya başlamak için mucit avatarını seç ve ismini yaz
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label htmlFor="name" className="text-white text-lg mb-2 block">
              İsmin Nedir?
            </Label>
            <Input
              id="name"
              placeholder="İsmini buraya yaz..."
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              className="bg-white/20 border-white/30 text-white placeholder:text-white/50 text-lg h-12"
              disabled={isLoading}
            />
          </div>

          <div>
            <Label className="text-white text-lg mb-4 block">
              Mucit Avatarını Seç
            </Label>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 md:gap-4">
              {avatars.map((avatar) => (
                <button
                  key={avatar.id}
                  onClick={() => setSelectedAvatar(avatar.id)}
                  disabled={isLoading}
                  className={`
                    relative p-3 rounded-xl transition-all duration-300 hover:scale-105
                    ${selectedAvatar === avatar.id 
                      ? 'bg-gradient-to-br from-yellow-400 to-pink-400 ring-4 ring-yellow-300 shadow-2xl' 
                      : 'bg-white/10 hover:bg-white/20'
                    }
                    ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}
                  `}
                >
                  <img
                    src={avatar.image}
                    alt={avatar.name}
                    className="w-full h-auto"
                  />
                  <p className="mt-2 text-white font-semibold text-center text-xs md:text-sm">
                    {avatar.name}
                  </p>
                  {selectedAvatar === avatar.id && (
                    <div className="absolute top-2 right-2">
                      <Sparkles className="w-5 h-5 text-yellow-900 animate-pulse" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          <Button
            onClick={handleStart}
            disabled={!selectedAvatar || !userName.trim() || isLoading}
            className="w-full h-14 text-xl font-bold bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 text-white shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                Hazırlanıyor...
              </span>
            ) : (
              'Maceraya Başla! 🚀'
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
