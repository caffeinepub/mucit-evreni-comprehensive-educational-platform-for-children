import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Search, Volume2, Mic, Languages, AlertCircle, Settings } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface DictionaryToolProps {
  onBack: () => void;
}

interface Translation {
  word: string;
  translation: string;
  pronunciation?: string;
  examples?: string[];
}

// Simple dictionary database
const dictionary: Record<string, Record<string, Translation>> = {
  'tr-en': {
    'merhaba': {
      word: 'merhaba',
      translation: 'hello',
      pronunciation: 'heh-LOH',
      examples: ['Merhaba, nasılsın? - Hello, how are you?']
    },
    'teşekkür': {
      word: 'teşekkür',
      translation: 'thank you',
      pronunciation: 'THANK yoo',
      examples: ['Teşekkür ederim - Thank you very much']
    },
    'kitap': {
      word: 'kitap',
      translation: 'book',
      pronunciation: 'book',
      examples: ['Bu bir kitap - This is a book']
    },
    'okul': {
      word: 'okul',
      translation: 'school',
      pronunciation: 'skool',
      examples: ['Okula gidiyorum - I am going to school']
    },
    'ev': {
      word: 'ev',
      translation: 'house / home',
      pronunciation: 'hows / hohm',
      examples: ['Eve gidiyorum - I am going home']
    },
    'su': {
      word: 'su',
      translation: 'water',
      pronunciation: 'WAW-ter',
      examples: ['Su içiyorum - I am drinking water']
    },
    'yemek': {
      word: 'yemek',
      translation: 'food / to eat',
      pronunciation: 'food / eet',
      examples: ['Yemek yiyorum - I am eating food']
    },
    'arkadaş': {
      word: 'arkadaş',
      translation: 'friend',
      pronunciation: 'frend',
      examples: ['O benim arkadaşım - He/She is my friend']
    },
  },
  'en-tr': {
    'hello': {
      word: 'hello',
      translation: 'merhaba',
      pronunciation: 'mer-ha-BA',
      examples: ['Hello, how are you? - Merhaba, nasılsın?']
    },
    'thank you': {
      word: 'thank you',
      translation: 'teşekkür ederim',
      pronunciation: 'te-shek-KOOR e-de-RIM',
      examples: ['Thank you very much - Çok teşekkür ederim']
    },
    'book': {
      word: 'book',
      translation: 'kitap',
      pronunciation: 'ki-TAP',
      examples: ['This is a book - Bu bir kitap']
    },
    'school': {
      word: 'school',
      translation: 'okul',
      pronunciation: 'o-KUL',
      examples: ['I am going to school - Okula gidiyorum']
    },
    'house': {
      word: 'house',
      translation: 'ev',
      pronunciation: 'ev',
      examples: ['I am going home - Eve gidiyorum']
    },
    'water': {
      word: 'water',
      translation: 'su',
      pronunciation: 'su',
      examples: ['I am drinking water - Su içiyorum']
    },
    'food': {
      word: 'food',
      translation: 'yemek',
      pronunciation: 'ye-MEK',
      examples: ['I am eating food - Yemek yiyorum']
    },
    'friend': {
      word: 'friend',
      translation: 'arkadaş',
      pronunciation: 'ar-ka-DASH',
      examples: ['He/She is my friend - O benim arkadaşım']
    },
  }
};

export default function DictionaryTool({ onBack }: DictionaryToolProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sourceLang, setSourceLang] = useState('tr');
  const [targetLang, setTargetLang] = useState('en');
  const [result, setResult] = useState<Translation | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [showPermissionDialog, setShowPermissionDialog] = useState(false);
  const [permissionError, setPermissionError] = useState<string | null>(null);

  const handleSearch = () => {
    if (!searchTerm.trim()) return;

    const dictKey = `${sourceLang}-${targetLang}`;
    const searchKey = searchTerm.toLowerCase().trim();
    const translation = dictionary[dictKey]?.[searchKey];

    if (translation) {
      setResult(translation);
    } else {
      setResult({
        word: searchTerm,
        translation: 'Çeviri bulunamadı',
        examples: []
      });
    }
  };

  const handleSwapLanguages = () => {
    setSourceLang(targetLang);
    setTargetLang(sourceLang);
    setSearchTerm('');
    setResult(null);
  };

  const handleVoiceInput = async () => {
    try {
      setPermissionError(null);

      // Check if speech recognition is available
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      
      if (!SpeechRecognition) {
        setPermissionError('Ses tanıma özelliği bu cihazda desteklenmiyor.');
        setShowPermissionDialog(true);
        return;
      }

      // Check microphone permission first
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setPermissionError('Mikrofon özelliği bu cihazda desteklenmiyor.');
        setShowPermissionDialog(true);
        return;
      }

      // Request microphone access
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        // Stop the stream immediately, we just needed to check permission
        stream.getTracks().forEach(track => track.stop());
      } catch (err) {
        const error = err as Error;
        let errorMessage = 'Mikrofona erişilemiyor.';
        
        if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
          errorMessage = 'Mikrofon izni reddedildi.';
        } else if (error.name === 'NotFoundError' || error.name === 'DevicesNotFoundError') {
          errorMessage = 'Mikrofon bulunamadı.';
        }
        
        setPermissionError(errorMessage);
        setShowPermissionDialog(true);
        return;
      }

      // Start speech recognition
      const recognition = new SpeechRecognition();
      recognition.lang = sourceLang === 'tr' ? 'tr-TR' : 'en-US';
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setSearchTerm(transcript);
        setIsListening(false);
      };

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        
        let errorMessage = 'Ses tanıma hatası oluştu.';
        if (event.error === 'not-allowed') {
          errorMessage = 'Mikrofon izni reddedildi.';
          setShowPermissionDialog(true);
        } else if (event.error === 'no-speech') {
          errorMessage = 'Ses algılanamadı. Lütfen tekrar deneyin.';
        }
        setPermissionError(errorMessage);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.start();
    } catch (err) {
      console.error('Voice input error:', err);
      setIsListening(false);
      setPermissionError('Ses girişi başlatılamadı.');
      setShowPermissionDialog(true);
    }
  };

  const speakWord = (text: string, lang: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang === 'tr' ? 'tr-TR' : 'en-US';
      utterance.rate = 0.8;
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="py-4 sm:py-6 md:py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <Button
          onClick={onBack}
          variant="outline"
          className="bg-white/10 backdrop-blur-md border-white/20 text-white hover:bg-white/20 mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Geri Dön
        </Button>

        <div className="text-center mb-8">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-3 flex items-center justify-center gap-3">
            <Languages className="w-10 h-10 sm:w-12 sm:h-12" />
            Sözlük Aracı
          </h2>
          <p className="text-base sm:text-lg text-white/80">
            Türkçe-İngilizce kelime çevirisi yapın ve telaffuz öğrenin
          </p>
        </div>

        <Card className="bg-white/10 backdrop-blur-md border-white/20 mb-6">
          <CardContent className="p-6 sm:p-8">
            {/* Language Selection */}
            <div className="flex items-center justify-center gap-4 mb-6">
              <Select value={sourceLang} onValueChange={setSourceLang}>
                <SelectTrigger className="w-32 bg-white/10 border-white/20 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tr">Türkçe</SelectItem>
                  <SelectItem value="en">English</SelectItem>
                </SelectContent>
              </Select>

              <Button
                onClick={handleSwapLanguages}
                variant="outline"
                size="icon"
                className="bg-white/10 border-white/20 text-white hover:bg-white/20"
              >
                <Languages className="w-5 h-5" />
              </Button>

              <Select value={targetLang} onValueChange={setTargetLang}>
                <SelectTrigger className="w-32 bg-white/10 border-white/20 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="tr">Türkçe</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Search Input */}
            <div className="flex gap-2 mb-6">
              <Input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                placeholder={sourceLang === 'tr' ? 'Kelime girin...' : 'Enter a word...'}
                className="flex-1 bg-white/10 border-white/20 text-white placeholder:text-white/50"
              />
              <Button
                onClick={handleVoiceInput}
                variant="outline"
                size="icon"
                disabled={isListening}
                className={`${
                  isListening ? 'bg-red-500 hover:bg-red-600' : 'bg-white/10 hover:bg-white/20'
                } border-white/20 text-white`}
              >
                <Mic className={`w-5 h-5 ${isListening ? 'animate-pulse' : ''}`} />
              </Button>
              <Button
                onClick={handleSearch}
                className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white"
              >
                <Search className="w-5 h-5 mr-2" />
                Ara
              </Button>
            </div>

            {/* Results */}
            {result && (
              <div className="space-y-4">
                <div className="p-6 bg-white/10 rounded-lg border border-white/20">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-2xl font-bold text-white mb-1">{result.word}</h3>
                      {result.pronunciation && (
                        <p className="text-white/70 italic">/{result.pronunciation}/</p>
                      )}
                    </div>
                    <Button
                      onClick={() => speakWord(result.word, sourceLang)}
                      variant="outline"
                      size="icon"
                      className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                    >
                      <Volume2 className="w-5 h-5" />
                    </Button>
                  </div>

                  <div className="mb-4">
                    <div className="flex items-center justify-between">
                      <p className="text-xl text-white/90">{result.translation}</p>
                      <Button
                        onClick={() => speakWord(result.translation, targetLang)}
                        variant="outline"
                        size="icon"
                        className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                      >
                        <Volume2 className="w-5 h-5" />
                      </Button>
                    </div>
                  </div>

                  {result.examples && result.examples.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-white/20">
                      <h4 className="text-lg font-semibold text-white mb-2">Örnek Cümleler:</h4>
                      <ul className="space-y-2">
                        {result.examples.map((example, index) => (
                          <li key={index} className="text-white/80 flex items-start gap-2">
                            <span className="text-blue-400">•</span>
                            <span>{example}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Help Text */}
            {!result && (
              <div className="text-center text-white/60 py-8">
                <p>Çevirmek istediğiniz kelimeyi yazın veya mikrofon butonuna basarak söyleyin</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Common Words */}
        <Card className="bg-white/10 backdrop-blur-md border-white/20">
          <CardContent className="p-6">
            <h3 className="text-xl font-bold text-white mb-4">Sık Kullanılan Kelimeler</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {Object.keys(dictionary[`${sourceLang}-${targetLang}`] || {}).slice(0, 8).map((word) => (
                <Button
                  key={word}
                  onClick={() => {
                    setSearchTerm(word);
                    const dictKey = `${sourceLang}-${targetLang}`;
                    setResult(dictionary[dictKey][word]);
                  }}
                  variant="outline"
                  className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                >
                  {word}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Permission Education Dialog */}
        <AlertDialog open={showPermissionDialog} onOpenChange={setShowPermissionDialog}>
          <AlertDialogContent className="bg-gradient-to-br from-purple-600 to-blue-600 border-white/20">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-white flex items-center gap-2">
                <AlertCircle className="w-6 h-6" />
                Mucit Evreni - Mikrofon Erişimi
              </AlertDialogTitle>
              <AlertDialogDescription className="text-white/90 space-y-3">
                <p>
                  <strong>Sözlük Aracı</strong> sesli kelime girişi için mikrofon erişimine ihtiyaç duyar.
                </p>
                <p>
                  Bu özellik sayesinde:
                </p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>Kelimeleri yazı yazmadan sesle arayabilirsiniz</li>
                  <li>Telaffuz pratiği yapabilirsiniz</li>
                  <li>Daha hızlı çeviri yapabilirsiniz</li>
                </ul>
                {permissionError && (
                  <div className="mt-3 p-3 bg-white/10 rounded-lg border border-white/20">
                    <p className="text-white font-semibold flex items-center gap-2">
                      <AlertCircle className="w-5 h-5" />
                      {permissionError}
                    </p>
                  </div>
                )}
                <div className="mt-4 p-4 bg-white/10 rounded-lg border border-white/20">
                  <p className="text-white font-bold mb-2 flex items-center gap-2">
                    <Settings className="w-5 h-5" />
                    Mikrofon İzni Nasıl Verilir:
                  </p>
                  <ol className="list-decimal list-inside space-y-2 ml-2 text-sm">
                    <li>Cihazınızın <strong>Ayarlar</strong> menüsünü açın</li>
                    <li><strong>Uygulamalar</strong> veya <strong>Uygulama Yöneticisi</strong> bölümüne gidin</li>
                    <li><strong>Mucit Evreni</strong> uygulamasını bulun ve açın</li>
                    <li><strong>İzinler</strong> veya <strong>Permissions</strong> seçeneğine tıklayın</li>
                    <li><strong>Mikrofon</strong> iznini <strong>Açık</strong> konuma getirin</li>
                    <li>Uygulamaya geri dönün ve tekrar deneyin</li>
                  </ol>
                </div>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogAction
                onClick={() => setShowPermissionDialog(false)}
                className="bg-white text-purple-600 hover:bg-white/90"
              >
                Anladım
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
