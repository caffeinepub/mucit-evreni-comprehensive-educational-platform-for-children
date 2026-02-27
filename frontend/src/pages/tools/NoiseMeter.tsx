import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, Mic, MicOff, Volume2, AlertCircle, Settings, Activity } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface NoiseMeterProps {
  onBack: () => void;
}

interface NoiseLevel {
  label: string;
  range: string;
  color: string;
  bgColor: string;
  min: number;
  max: number;
}

const noiseLevels: NoiseLevel[] = [
  { label: 'Sessiz', range: '0-30 dB', color: 'text-green-400', bgColor: 'bg-green-500', min: 0, max: 30 },
  { label: 'Normal', range: '31-60 dB', color: 'text-yellow-400', bgColor: 'bg-yellow-500', min: 31, max: 60 },
  { label: 'Gürültülü', range: '61-80 dB', color: 'text-orange-400', bgColor: 'bg-orange-500', min: 61, max: 80 },
  { label: 'Tehlikeli', range: '81+ dB', color: 'text-red-400', bgColor: 'bg-red-500', min: 81, max: 150 },
];

export default function NoiseMeter({ onBack }: NoiseMeterProps) {
  const [isListening, setIsListening] = useState(false);
  const [noiseLevel, setNoiseLevel] = useState(0);
  const [currentLevel, setCurrentLevel] = useState<NoiseLevel>(noiseLevels[0]);
  const [showPermissionDialog, setShowPermissionDialog] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isStarting, setIsStarting] = useState(false);
  const [waveformData, setWaveformData] = useState<number[]>(new Array(50).fill(0));

  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const microphoneRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const dbHistoryRef = useRef<number[]>([]);
  const calibrationOffsetRef = useRef<number>(0);

  useEffect(() => {
    return () => {
      stopListening();
    };
  }, []);

  useEffect(() => {
    // Update current level based on noise level
    const level = noiseLevels.find(
      (l) => noiseLevel >= l.min && noiseLevel <= l.max
    );
    if (level) {
      setCurrentLevel(level);
    }
  }, [noiseLevel]);

  const startListening = async () => {
    if (isStarting) return;

    setIsStarting(true);
    setError(null);

    try {
      // Check if MediaDevices API is available
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setError('Mikrofon özelliği bu cihazda desteklenmiyor.');
        setShowPermissionDialog(true);
        setIsStarting(false);
        return;
      }

      // Add 1-second delay before requesting microphone access
      // This helps prevent "microphone in use" errors in WebView environments
      await new Promise(r => setTimeout(r, 1000));

      // Request microphone access directly on user action with enhanced settings
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: false, // Disable for more accurate readings
          noiseSuppression: false, // Disable for raw audio data
          autoGainControl: false, // Disable to prevent automatic volume adjustment
          sampleRate: 48000, // Higher sample rate for better accuracy
        } 
      });

      streamRef.current = stream;

      // Create audio context and analyser with enhanced settings
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({
        sampleRate: 48000,
      });
      audioContextRef.current = audioContext;

      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 4096; // Increased for better frequency resolution
      analyser.smoothingTimeConstant = 0.3; // Reduced for more responsive readings
      analyser.minDecibels = -100;
      analyser.maxDecibels = -10;
      analyserRef.current = analyser;

      const microphone = audioContext.createMediaStreamSource(stream);
      microphoneRef.current = microphone;
      microphone.connect(analyser);

      // Calibrate the microphone
      await calibrateMicrophone();

      setIsListening(true);
      setIsStarting(false);
      measureNoise();

    } catch (err) {
      console.error('Microphone access error:', err);
      
      const error = err as Error;
      let errorMessage = 'Mikrofona erişilemiyor.';
      
      if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
        errorMessage = 'Mikrofon izni reddedildi. Lütfen cihaz ayarlarınızdan "Mucit Evreni" uygulamasına mikrofon izni verin.';
      } else if (error.name === 'NotFoundError' || error.name === 'DevicesNotFoundError') {
        errorMessage = 'Mikrofon bulunamadı. Lütfen cihazınızın mikrofonunu kontrol edin.';
      } else if (error.name === 'NotReadableError' || error.name === 'TrackStartError') {
        errorMessage = 'Mikrofon başka bir uygulama tarafından kullanılıyor olabilir. Lütfen diğer uygulamaları kapatıp tekrar deneyin.';
      } else if (error.name === 'OverconstrainedError') {
        errorMessage = 'Mikrofon ayarları uygulanamadı. Lütfen tekrar deneyin.';
      } else if (error.name === 'SecurityError') {
        errorMessage = 'Güvenlik nedeniyle mikrofona erişilemiyor. Lütfen cihaz ayarlarınızdan "Mucit Evreni" uygulamasına mikrofon izni verin.';
      } else if (error.name === 'TypeError') {
        errorMessage = 'Mikrofon özelliği bu cihazda desteklenmiyor.';
      }
      
      setError(errorMessage);
      setShowPermissionDialog(true);
      setIsStarting(false);
      stopListening();
    }
  };

  const calibrateMicrophone = async () => {
    // Calibrate by measuring ambient noise for 500ms
    return new Promise<void>((resolve) => {
      const calibrationSamples: number[] = [];
      const startTime = Date.now();
      
      const calibrate = () => {
        if (!analyserRef.current) {
          resolve();
          return;
        }

        const analyser = analyserRef.current;
        const dataArray = new Uint8Array(analyser.frequencyBinCount);
        analyser.getByteFrequencyData(dataArray);

        let sum = 0;
        for (let i = 0; i < dataArray.length; i++) {
          sum += dataArray[i];
        }
        const average = sum / dataArray.length;
        calibrationSamples.push(average);

        if (Date.now() - startTime < 500) {
          requestAnimationFrame(calibrate);
        } else {
          // Calculate calibration offset
          const avgCalibration = calibrationSamples.reduce((a, b) => a + b, 0) / calibrationSamples.length;
          calibrationOffsetRef.current = avgCalibration;
          resolve();
        }
      };

      calibrate();
    });
  };

  const stopListening = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }

    if (microphoneRef.current) {
      microphoneRef.current.disconnect();
      microphoneRef.current = null;
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }

    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }

    analyserRef.current = null;
    setIsListening(false);
    setNoiseLevel(0);
    dbHistoryRef.current = [];
    setWaveformData(new Array(50).fill(0));
  };

  const measureNoise = () => {
    if (!analyserRef.current) return;

    const analyser = analyserRef.current;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    const timeDataArray = new Uint8Array(analyser.fftSize);
    
    analyser.getByteFrequencyData(dataArray);
    analyser.getByteTimeDomainData(timeDataArray);

    // Calculate RMS (Root Mean Square) for more accurate volume measurement
    let sumSquares = 0;
    for (let i = 0; i < dataArray.length; i++) {
      const normalized = dataArray[i] / 255.0;
      sumSquares += normalized * normalized;
    }
    const rms = Math.sqrt(sumSquares / dataArray.length);

    // Apply calibration and convert to decibels with improved mapping
    // Using a logarithmic scale for more realistic dB readings
    const calibratedRms = Math.max(0, rms - (calibrationOffsetRef.current / 255.0));
    
    // Enhanced dB calculation with better low and high volume calibration
    let db = 0;
    if (calibratedRms > 0) {
      // Logarithmic conversion with calibrated ranges
      const dbRaw = 20 * Math.log10(calibratedRms + 0.001);
      // Map from typical range (-60 to 0 dB) to our 0-100 scale
      db = Math.max(0, Math.min(100, ((dbRaw + 60) / 60) * 100));
      
      // Apply non-linear scaling for better representation
      // Low volumes (0-30): More sensitive
      // Mid volumes (30-70): Linear
      // High volumes (70-100): Compressed
      if (db < 30) {
        db = db * 1.2; // Amplify low volumes
      } else if (db > 70) {
        db = 70 + (db - 70) * 0.8; // Compress high volumes
      }
    }

    // Apply moving average for smoother readings (reduce jitter)
    dbHistoryRef.current.push(db);
    if (dbHistoryRef.current.length > 10) {
      dbHistoryRef.current.shift();
    }
    
    // Weighted moving average (more weight on recent values)
    let weightedSum = 0;
    let weightSum = 0;
    for (let i = 0; i < dbHistoryRef.current.length; i++) {
      const weight = i + 1; // Linear weight increase
      weightedSum += dbHistoryRef.current[i] * weight;
      weightSum += weight;
    }
    const smoothedDb = Math.round(weightedSum / weightSum);

    setNoiseLevel(smoothedDb);

    // Update waveform visualization
    const waveform: number[] = [];
    const step = Math.floor(timeDataArray.length / 50);
    for (let i = 0; i < 50; i++) {
      const index = i * step;
      const value = (timeDataArray[index] - 128) / 128; // Normalize to -1 to 1
      waveform.push(Math.abs(value));
    }
    setWaveformData(waveform);

    animationFrameRef.current = requestAnimationFrame(measureNoise);
  };

  const toggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const gaugePercentage = Math.min((noiseLevel / 100) * 100, 100);

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
            <Volume2 className="w-10 h-10 sm:w-12 sm:h-12" />
            Gürültü Ölçer
          </h2>
          <p className="text-base sm:text-lg text-white/80">
            Çevrenizdeki ses seviyesini ölçün ve güvenli ses seviyeleri hakkında bilgi edinin
          </p>
        </div>

        <Card className="bg-white/10 backdrop-blur-md border-white/20 mb-6">
          <CardContent className="p-6 sm:p-8">
            {/* Noise Level Display */}
            <div className="text-center mb-8">
              <div className="relative w-64 h-64 mx-auto mb-6">
                {/* Circular gauge background */}
                <svg className="w-full h-full -rotate-90" viewBox="0 0 200 200">
                  <circle
                    cx="100"
                    cy="100"
                    r="80"
                    fill="none"
                    stroke="rgba(255, 255, 255, 0.1)"
                    strokeWidth="20"
                  />
                  <circle
                    cx="100"
                    cy="100"
                    r="80"
                    fill="none"
                    stroke={`var(--${currentLevel.bgColor.replace('bg-', '')})`}
                    strokeWidth="20"
                    strokeDasharray={`${(gaugePercentage / 100) * 502.4} 502.4`}
                    strokeLinecap="round"
                    className="transition-all duration-200"
                    style={{
                      stroke: currentLevel.bgColor === 'bg-green-500' ? '#22c55e' :
                              currentLevel.bgColor === 'bg-yellow-500' ? '#eab308' :
                              currentLevel.bgColor === 'bg-orange-500' ? '#f97316' : '#ef4444'
                    }}
                  />
                </svg>

                {/* Center display */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className={`text-6xl font-bold ${currentLevel.color} mb-2 transition-all duration-200`}>
                    {noiseLevel}
                  </div>
                  <div className="text-2xl text-white/80 font-semibold">dB</div>
                  <div className={`text-xl font-bold ${currentLevel.color} mt-2`}>
                    {currentLevel.label}
                  </div>
                </div>
              </div>

              {/* Waveform Visualization */}
              {isListening && (
                <div className="mb-6 bg-white/5 rounded-lg p-4">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Activity className="w-5 h-5 text-white/70" />
                    <span className="text-white/70 text-sm font-semibold">Ses Dalgası</span>
                  </div>
                  <div className="flex items-center justify-center gap-1 h-20">
                    {waveformData.map((value, index) => (
                      <div
                        key={index}
                        className="w-1 bg-gradient-to-t from-blue-500 to-purple-500 rounded-full transition-all duration-100"
                        style={{
                          height: `${Math.max(2, value * 80)}px`,
                          opacity: 0.6 + value * 0.4,
                        }}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Control Button */}
              <Button
                onClick={toggleListening}
                size="lg"
                disabled={isStarting}
                className={`${
                  isListening
                    ? 'bg-red-500 hover:bg-red-600'
                    : 'bg-green-500 hover:bg-green-600'
                } text-white font-bold text-lg px-8 py-6 rounded-full shadow-lg transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {isStarting ? (
                  <>
                    <Mic className="w-6 h-6 mr-2 animate-pulse" />
                    Başlatılıyor...
                  </>
                ) : isListening ? (
                  <>
                    <MicOff className="w-6 h-6 mr-2" />
                    Durdur
                  </>
                ) : (
                  <>
                    <Mic className="w-6 h-6 mr-2" />
                    Mikrofonu Başlat
                  </>
                )}
              </Button>

              {error && (
                <div className="mt-4 p-4 bg-red-500/20 border border-red-500/50 rounded-lg">
                  <p className="text-red-200 text-sm flex items-center justify-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    {error}
                  </p>
                </div>
              )}
            </div>

            {/* Noise Level Guide */}
            <div className="space-y-3">
              <h3 className="text-xl font-bold text-white mb-4 text-center">
                Ses Seviyesi Rehberi
              </h3>
              {noiseLevels.map((level) => (
                <div
                  key={level.label}
                  className={`flex items-center justify-between p-4 rounded-lg transition-all duration-300 ${
                    currentLevel.label === level.label
                      ? 'bg-white/20 scale-105'
                      : 'bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-4 h-4 rounded-full ${level.bgColor}`} />
                    <span className={`font-bold ${level.color}`}>{level.label}</span>
                  </div>
                  <span className="text-white/70 font-semibold">{level.range}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Educational Information */}
        <Card className="bg-white/10 backdrop-blur-md border-white/20">
          <CardContent className="p-6">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Volume2 className="w-6 h-6" />
              Güvenli Ses Seviyeleri Hakkında
            </h3>
            <div className="space-y-3 text-white/80">
              <p>
                <strong className="text-white">Sessiz (0-30 dB):</strong> Fısıltı, kütüphane ortamı. Kulaklar için çok güvenli.
              </p>
              <p>
                <strong className="text-white">Normal (31-60 dB):</strong> Normal konuşma, ev ortamı. Günlük yaşam için ideal.
              </p>
              <p>
                <strong className="text-white">Gürültülü (61-80 dB):</strong> Yüksek sesle konuşma, trafik sesi. Uzun süre maruz kalınmamalı.
              </p>
              <p>
                <strong className="text-white">Tehlikeli (81+ dB):</strong> Çok yüksek müzik, makine sesleri. Kulaklarınızı koruyun!
              </p>
              <div className="mt-4 p-4 bg-blue-500/20 border border-blue-500/50 rounded-lg">
                <p className="text-blue-200 font-semibold">
                  💡 İpucu: 85 dB üzerindeki seslere uzun süre maruz kalmak işitme kaybına neden olabilir. Kulaklarınızı korumak için yüksek seslerde kulaklık kullanmaktan kaçının!
                </p>
              </div>
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
                  <strong>Gürültü Ölçer</strong> aracı çevrenizin ses seviyesini ölçmek için mikrofon erişimine ihtiyaç duyar.
                </p>
                <p>
                  Bu araç sayesinde:
                </p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>Çevrenizdeki ses seviyesini anlık olarak ölçebilirsiniz</li>
                  <li>Güvenli ve tehlikeli ses seviyeleri hakkında bilgi edinebilirsiniz</li>
                  <li>Kulaklarınızı korumayı öğrenebilirsiniz</li>
                </ul>
                {error && (
                  <div className="mt-3 p-3 bg-white/10 rounded-lg border border-white/20">
                    <p className="text-white font-semibold flex items-center gap-2">
                      <AlertCircle className="w-5 h-5" />
                      {error}
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
