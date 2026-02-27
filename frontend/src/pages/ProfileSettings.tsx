import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { User, Bell, Volume2, LogOut, RefreshCw, Copy, Check } from 'lucide-react';
import { useGetUserProfile, useSaveUserProfile, useGetPreferences, useSavePreferences } from '../hooks/useQueries';
import { toast } from 'sonner';

const avatars = [
  { id: 'boy-scientist', name: 'Bilim Çocuğu', imageUrl: '/assets/generated/avatar-boy-scientist-transparent.dim_150x150.png' },
  { id: 'girl-artist', name: 'Sanatçı Kız', imageUrl: '/assets/generated/avatar-girl-artist-transparent.dim_150x150.png' },
  { id: 'boy-modern', name: 'Modern Çocuk', imageUrl: '/assets/generated/avatar-boy-modern-transparent.dim_150x150.png' },
  { id: 'girl-explorer', name: 'Kaşif Kız', imageUrl: '/assets/generated/avatar-girl-explorer-transparent.dim_150x150.png' },
  { id: 'boy-sports', name: 'Sporcu Çocuk', imageUrl: '/assets/generated/avatar-boy-sports-transparent.dim_150x150.png' },
  { id: 'girl-curly', name: 'Kıvırcık Kız', imageUrl: '/assets/generated/avatar-girl-curly-transparent.dim_150x150.png' },
];

interface ProfileSettingsProps {
  userId: string;
  ogrenciNumarasi: string;
  onClose: () => void;
  onReset: () => void;
  onLogout: () => void;
}

export default function ProfileSettings({ userId, ogrenciNumarasi, onClose, onReset, onLogout }: ProfileSettingsProps) {
  const studentNumber = ogrenciNumarasi || localStorage.getItem('currentStudentNumber') || '';
  
  const { data: profile } = useGetUserProfile(studentNumber);
  const { data: preferences } = useGetPreferences(studentNumber);
  const saveProfileMutation = useSaveUserProfile();
  const savePreferencesMutation = useSavePreferences();

  const [username, setUsername] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState('');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (profile) {
      setUsername(profile.username);
      setSelectedAvatar(profile.avatar);
    }
  }, [profile]);

  useEffect(() => {
    if (preferences) {
      setNotificationsEnabled(preferences.notificationsEnabled);
      setSoundEnabled(preferences.soundEnabled);
    }
  }, [preferences]);

  const handleSaveProfile = async () => {
    if (!username.trim() || !selectedAvatar) return;

    await saveProfileMutation.mutateAsync({
      studentNumber,
      profile: {
        username: username.trim(),
        avatar: selectedAvatar,
        studentNumber,
        createdAt: profile?.createdAt || Date.now(),
      },
    });

    alert('Profil güncellendi!');
  };

  const handleToggleNotifications = async (enabled: boolean) => {
    setNotificationsEnabled(enabled);
    await savePreferencesMutation.mutateAsync({
      studentNumber,
      preferences: {
        notificationsEnabled: enabled,
        soundEnabled,
      },
    });
  };

  const handleToggleSounds = async (enabled: boolean) => {
    setSoundEnabled(enabled);
    await savePreferencesMutation.mutateAsync({
      studentNumber,
      preferences: {
        notificationsEnabled,
        soundEnabled: enabled,
      },
    });
  };

  const formatStudentNumber = (number: string) => {
    return number.match(/.{1,4}/g)?.join(' ') || number;
  };

  const handleCopyStudentNumber = async () => {
    // Remove spaces from student number for copying
    const unformattedNumber = studentNumber.replace(/\s/g, '');
    
    try {
      // Try using the Clipboard API first
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(unformattedNumber);
        setCopied(true);
        toast.success('Öğrenci numarası kopyalandı!');
        
        // Reset copied state after 2 seconds
        setTimeout(() => setCopied(false), 2000);
      } else {
        // Fallback for browsers that don't support Clipboard API
        const textArea = document.createElement('textarea');
        textArea.value = unformattedNumber;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        const successful = document.execCommand('copy');
        document.body.removeChild(textArea);
        
        if (successful) {
          setCopied(true);
          toast.success('Öğrenci numarası kopyalandı!');
          setTimeout(() => setCopied(false), 2000);
        } else {
          throw new Error('Copy command failed');
        }
      }
    } catch (error) {
      console.error('Failed to copy student number:', error);
      toast.error('Kopyalama başarısız oldu. Lütfen tekrar deneyin.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-purple-800">
            ⚙️ Profil Ayarları
          </h1>
          <Button onClick={onClose} variant="ghost" className="text-purple-600 hover:bg-purple-100">
            Kapat
          </Button>
        </div>

        <div className="space-y-6">
          {/* Profile Information */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-purple-700">
                <User className="w-6 h-6" />
                Profil Bilgileri
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="studentNumber" className="text-base font-semibold mb-2 block">
                  Öğrenci Numarası
                </Label>
                <div className="flex items-center gap-2">
                  <div className="flex-1 text-2xl font-mono font-bold text-purple-600 bg-purple-50 p-4 rounded-lg text-center">
                    {formatStudentNumber(studentNumber)}
                  </div>
                  <Button
                    onClick={handleCopyStudentNumber}
                    variant="outline"
                    size="icon"
                    className="h-14 w-14 border-2 border-purple-300 hover:bg-purple-100 hover:border-purple-500 transition-all"
                    aria-label="Öğrenci numarasını kopyala"
                    title="Öğrenci numarasını kopyala"
                  >
                    {copied ? (
                      <Check className="w-6 h-6 text-green-600" />
                    ) : (
                      <Copy className="w-6 h-6 text-purple-600" />
                    )}
                  </Button>
                </div>
              </div>

              <div>
                <Label htmlFor="username" className="text-base font-semibold mb-2 block">
                  Kullanıcı Adı
                </Label>
                <Input
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Adınızı girin..."
                  className="text-lg"
                />
              </div>

              <div>
                <Label className="text-base font-semibold mb-3 block">Avatar Seçin</Label>
                <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
                  {avatars.map((avatar) => (
                    <button
                      key={avatar.id}
                      onClick={() => setSelectedAvatar(avatar.id)}
                      className={`p-2 rounded-lg border-4 transition-all ${
                        selectedAvatar === avatar.id
                          ? 'border-purple-600 bg-purple-50 scale-110'
                          : 'border-gray-200 hover:border-purple-300'
                      }`}
                    >
                      <img
                        src={avatar.imageUrl}
                        alt={avatar.name}
                        className="w-full h-auto"
                      />
                    </button>
                  ))}
                </div>
              </div>

              <Button
                onClick={handleSaveProfile}
                className="w-full bg-purple-600 hover:bg-purple-700 text-lg py-6"
              >
                Profili Kaydet
              </Button>
            </CardContent>
          </Card>

          {/* Preferences */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-purple-700">Tercihler</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Bell className="w-6 h-6 text-purple-600" />
                  <div>
                    <Label htmlFor="notifications" className="text-base font-semibold cursor-pointer">
                      Bildirimleri Aç/Kapat
                    </Label>
                    <p className="text-sm text-gray-600">Motivasyon mesajları ve hatırlatmalar</p>
                  </div>
                </div>
                <Switch
                  id="notifications"
                  checked={notificationsEnabled}
                  onCheckedChange={handleToggleNotifications}
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Volume2 className="w-6 h-6 text-purple-600" />
                  <div>
                    <Label htmlFor="sounds" className="text-base font-semibold cursor-pointer">
                      Sesleri Aç/Kapat
                    </Label>
                    <p className="text-sm text-gray-600">Oyun sesleri ve ses efektleri</p>
                  </div>
                </div>
                <Switch
                  id="sounds"
                  checked={soundEnabled}
                  onCheckedChange={handleToggleSounds}
                />
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-purple-700">İşlemler</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                onClick={onLogout}
                variant="outline"
                className="w-full text-lg py-6 border-2 border-blue-600 text-blue-600 hover:bg-blue-50"
              >
                <LogOut className="w-5 h-5 mr-2" />
                Kullanıcı Çıkışı
              </Button>

              <Button
                onClick={onReset}
                variant="destructive"
                className="w-full text-lg py-6"
              >
                <RefreshCw className="w-5 h-5 mr-2" />
                Profil Sıfırlama
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
