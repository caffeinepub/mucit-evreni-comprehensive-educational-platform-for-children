import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Upload, Music, Trash2, Play, Pause, Download } from 'lucide-react';
import { useListSounds, useUploadSound, useListAudioFiles, useUploadAudio, useDeleteAudio } from '../hooks/useQueries';
import { SoundCategory, ExternalBlob } from '../backend';

export default function AdminDashboard() {
  const [selectedCategory, setSelectedCategory] = useState<SoundCategory>(SoundCategory.dogruCevap);
  const [uploadType, setUploadType] = useState<'file' | 'url'>('file');
  const [mp3Url, setMp3Url] = useState('');
  const [audioLabel, setAudioLabel] = useState('');
  const [playingAudio, setPlayingAudio] = useState<string | null>(null);

  const { data: sounds = [], isLoading: soundsLoading } = useListSounds();
  const { data: audioFilesList, isLoading: audioLoading } = useListAudioFiles();
  const uploadSoundMutation = useUploadSound();
  const uploadAudioMutation = useUploadAudio();
  const deleteAudioMutation = useDeleteAudio();

  const audioFiles = audioFilesList?.audioFiles || [];

  const categoryLabels: Record<SoundCategory, string> = {
    [SoundCategory.dogruCevap]: 'Doğru Cevap',
    [SoundCategory.yanlisCevap]: 'Yanlış Cevap',
    [SoundCategory.secim]: 'Seçim',
    [SoundCategory.basari]: 'Başarı',
    [SoundCategory.uyari]: 'Uyarı',
    [SoundCategory.gecisSesi]: 'Geçiş Sesi',
    [SoundCategory.arkaPlanMuzigi]: 'Arka Plan Müziği',
    [SoundCategory.anlaticiHosgeldiniz]: 'Anlatıcı: Hoşgeldiniz',
    [SoundCategory.anlaticiGorevBaslangici]: 'Anlatıcı: Görev Başlangıcı',
    [SoundCategory.anlaticiBasari]: 'Anlatıcı: Başarı',
    [SoundCategory.anlaticiHataTekrarDene]: 'Anlatıcı: Hata/Tekrar Dene',
    [SoundCategory.anlaticiBolumGecisi]: 'Anlatıcı: Bölüm Geçişi',
    [SoundCategory.anlaticiMotivasyon]: 'Anlatıcı: Motivasyon',
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const arrayBuffer = await file.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);
      const blob = ExternalBlob.fromBytes(uint8Array);

      await uploadSoundMutation.mutateAsync({
        category: selectedCategory,
        fileOrUrl: { __kind__: 'file', file: blob },
      });

      alert('Ses başarıyla yüklendi!');
      e.target.value = '';
    } catch (error: any) {
      alert(error.message || 'Ses yüklenirken bir hata oluştu.');
    }
  };

  const handleUrlUpload = async () => {
    if (!mp3Url.trim()) {
      alert('Lütfen geçerli bir MP3 URL\'si girin.');
      return;
    }

    if (!mp3Url.endsWith('.mp3')) {
      alert('Lütfen geçerli bir MP3 bağlantısı girin (.mp3 ile bitmeli).');
      return;
    }

    try {
      await uploadSoundMutation.mutateAsync({
        category: selectedCategory,
        fileOrUrl: { __kind__: 'url', url: mp3Url },
      });

      alert('Ses başarıyla yüklendi!');
      setMp3Url('');
    } catch (error: any) {
      alert(error.message || 'Ses indirilemedi, lütfen geçerli bir MP3 bağlantısı girin.');
    }
  };

  const handleAudioFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !audioLabel.trim()) {
      alert('Lütfen dosya ve etiket seçin.');
      return;
    }

    try {
      const arrayBuffer = await file.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);
      const blob = ExternalBlob.fromBytes(uint8Array);

      await uploadAudioMutation.mutateAsync({
        audioLabel: audioLabel.trim(),
        blob,
      });

      alert('Ses dosyası başarıyla yüklendi!');
      setAudioLabel('');
      e.target.value = '';
    } catch (error: any) {
      alert(error.message || 'Ses dosyası yüklenirken bir hata oluştu.');
    }
  };

  const handleDeleteAudio = async (id: bigint) => {
    if (confirm('Bu ses dosyasını silmek istediğinizden emin misiniz?')) {
      try {
        await deleteAudioMutation.mutateAsync(id);
        alert('Ses dosyası silindi!');
      } catch (error: any) {
        alert(error.message || 'Ses dosyası silinirken bir hata oluştu.');
      }
    }
  };

  const togglePlayAudio = (url: string) => {
    if (playingAudio === url) {
      setPlayingAudio(null);
    } else {
      setPlayingAudio(url);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-purple-800">
            🎵 Admin Paneli - Ses Yönetimi
          </h1>
        </div>

        <Tabs defaultValue="sounds" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="sounds">Oyun Sesleri</TabsTrigger>
            <TabsTrigger value="audio">Ses Dosyaları</TabsTrigger>
          </TabsList>

          {/* Game Sounds Tab */}
          <TabsContent value="sounds" className="space-y-6">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-purple-700">Yeni Ses Ekle</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="category">Ses Kategorisi</Label>
                  <Select
                    value={selectedCategory}
                    onValueChange={(value) => setSelectedCategory(value as SoundCategory)}
                  >
                    <SelectTrigger id="category">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(categoryLabels).map(([key, label]) => (
                        <SelectItem key={key} value={key}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Yükleme Yöntemi</Label>
                  <div className="flex gap-4 mt-2">
                    <Button
                      variant={uploadType === 'file' ? 'default' : 'outline'}
                      onClick={() => setUploadType('file')}
                    >
                      Dosya Yükle
                    </Button>
                    <Button
                      variant={uploadType === 'url' ? 'default' : 'outline'}
                      onClick={() => setUploadType('url')}
                    >
                      URL ile Yükle
                    </Button>
                  </div>
                </div>

                {uploadType === 'file' ? (
                  <div>
                    <Label htmlFor="file-upload">MP3 Dosyası Seç</Label>
                    <Input
                      id="file-upload"
                      type="file"
                      accept=".mp3,audio/mpeg"
                      onChange={handleFileUpload}
                      disabled={uploadSoundMutation.isPending}
                    />
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Label htmlFor="mp3-url">MP3 URL</Label>
                    <Input
                      id="mp3-url"
                      type="url"
                      value={mp3Url}
                      onChange={(e) => setMp3Url(e.target.value)}
                      placeholder="https://example.com/sound.mp3"
                    />
                    <Button
                      onClick={handleUrlUpload}
                      disabled={uploadSoundMutation.isPending || !mp3Url.trim()}
                      className="w-full"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      {uploadSoundMutation.isPending ? 'Yükleniyor...' : 'URL\'den Yükle'}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-purple-700">Yüklü Sesler</CardTitle>
              </CardHeader>
              <CardContent>
                {soundsLoading ? (
                  <p className="text-center py-4">Yükleniyor...</p>
                ) : sounds.length === 0 ? (
                  <p className="text-center py-4 text-gray-500">Henüz ses yüklenmemiş</p>
                ) : (
                  <div className="space-y-3">
                    {sounds.map((sound) => (
                      <div
                        key={sound.category}
                        className="flex items-center justify-between p-4 bg-purple-50 rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <Music className="w-5 h-5 text-purple-600" />
                          <div>
                            <p className="font-semibold">{categoryLabels[sound.category]}</p>
                            <p className="text-sm text-gray-600">
                              {new Date(Number(sound.uploadedAt) / 1000000).toLocaleDateString('tr-TR')}
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => togglePlayAudio(sound.file.getDirectURL())}
                          >
                            {playingAudio === sound.file.getDirectURL() ? (
                              <Pause className="w-4 h-4" />
                            ) : (
                              <Play className="w-4 h-4" />
                            )}
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Audio Files Tab */}
          <TabsContent value="audio" className="space-y-6">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-purple-700">Yeni Ses Dosyası Ekle</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="audio-label">Ses Etiketi</Label>
                  <Input
                    id="audio-label"
                    value={audioLabel}
                    onChange={(e) => setAudioLabel(e.target.value)}
                    placeholder="Örn: Hoşgeldin Mesajı"
                  />
                </div>
                <div>
                  <Label htmlFor="audio-file-upload">MP3 Dosyası Seç</Label>
                  <Input
                    id="audio-file-upload"
                    type="file"
                    accept=".mp3,audio/mpeg"
                    onChange={handleAudioFileUpload}
                    disabled={uploadAudioMutation.isPending}
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-purple-700">Ses Dosyaları</CardTitle>
              </CardHeader>
              <CardContent>
                {audioLoading ? (
                  <p className="text-center py-4">Yükleniyor...</p>
                ) : audioFiles && audioFiles.length > 0 ? (
                  <div className="space-y-3">
                    {audioFiles.map((audio) => {
                      const audioId = typeof audio.id === 'bigint' ? audio.id : BigInt(audio.id);
                      return (
                        <div
                          key={audio.id.toString()}
                          className="flex items-center justify-between p-4 bg-purple-50 rounded-lg"
                        >
                          <div className="flex items-center gap-3">
                            <Music className="w-5 h-5 text-purple-600" />
                            <div>
                              <p className="font-semibold">{audio.audioLabel}</p>
                              <p className="text-sm text-gray-600">
                                {new Date(Number(audio.uploadedAt) / 1000000).toLocaleDateString('tr-TR')}
                              </p>
                            </div>
                          </div>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDeleteAudio(audioId)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-center py-4 text-gray-500">Henüz ses dosyası yüklenmemiş</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {playingAudio && (
          <audio
            src={playingAudio}
            autoPlay
            onEnded={() => setPlayingAudio(null)}
            className="hidden"
          />
        )}
      </div>
    </div>
  );
}
