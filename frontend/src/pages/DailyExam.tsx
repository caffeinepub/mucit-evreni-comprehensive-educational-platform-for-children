import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { AgeGroup, DailyExamResult } from '../types';
import { ArrowLeft, Clock, CheckCircle, XCircle, Trophy, Star } from 'lucide-react';
import { useSaveDailyExamResult } from '../hooks/useQueries';

interface DailyExamProps {
  userId: string;
  ageGroup: AgeGroup;
  onBack: () => void;
}

interface Question {
  id: number;
  type: 'multiple-choice' | 'math' | 'matching' | 'pattern' | 'word' | 'visual' | 'counting' | 'logic' | 'science' | 'comprehension';
  question: string;
  options?: string[];
  correctAnswer: string | number;
  userAnswer?: string | number;
}

interface ExamConfig {
  questionCount: number;
  duration: number; // in minutes
}

const examConfigs: Record<AgeGroup, ExamConfig> = {
  'preschool': { questionCount: 10, duration: 10 },
  'elementary': { questionCount: 20, duration: 20 },
  'middle': { questionCount: 25, duration: 25 },
};

const ageGroupNames: Record<AgeGroup, string> = {
  'preschool': 'Okul Öncesi',
  'elementary': 'İlkokul',
  'middle': 'Ortaokul',
};

export default function DailyExam({ userId, ageGroup, onBack }: DailyExamProps) {
  const [examStarted, setExamStarted] = useState(false);
  const [examFinished, setExamFinished] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [score, setScore] = useState(0);
  const [alreadyTaken, setAlreadyTaken] = useState(false);

  const saveExamResultMutation = useSaveDailyExamResult();
  const studentNumber = localStorage.getItem('mucit_ogrenciNumarasi') || '';

  const config = examConfigs[ageGroup];

  // Check if exam was already taken today
  useEffect(() => {
    const today = new Date().toDateString();
    const examKey = `dailyExam_${userId}_${ageGroup}_${today}`;
    const savedExam = localStorage.getItem(examKey);
    
    if (savedExam) {
      const examData = JSON.parse(savedExam);
      setAlreadyTaken(true);
      setScore(examData.score);
      setExamFinished(true);
    }
  }, [userId, ageGroup]);

  // Generate age-appropriate questions
  const generateQuestions = useCallback((): Question[] => {
    const generatedQuestions: Question[] = [];
    const today = new Date().toDateString();
    const seed = today + userId + ageGroup; // Daily unique seed

    // Age-specific question type distributions
    if (ageGroup === 'preschool') {
      // Okul Öncesi: Only simple visual, matching, and counting questions
      const questionTypes: Question['type'][] = ['visual', 'matching', 'counting', 'pattern'];
      for (let i = 0; i < config.questionCount; i++) {
        const type = questionTypes[i % questionTypes.length];
        generatedQuestions.push(generatePreschoolQuestion(type, i + 1, seed));
      }
    } else if (ageGroup === 'elementary') {
      // İlkokul: Basic math, pattern, general knowledge, simple logic
      const questionTypes: Question['type'][] = ['math', 'pattern', 'multiple-choice', 'logic', 'word'];
      for (let i = 0; i < config.questionCount; i++) {
        const type = questionTypes[i % questionTypes.length];
        generatedQuestions.push(generateElementaryQuestion(type, i + 1, seed));
      }
    } else {
      // Ortaokul: Advanced math, logic, reading comprehension, science
      const questionTypes: Question['type'][] = ['math', 'logic', 'comprehension', 'science', 'pattern'];
      for (let i = 0; i < config.questionCount; i++) {
        const type = questionTypes[i % questionTypes.length];
        generatedQuestions.push(generateMiddleSchoolQuestion(type, i + 1, seed));
      }
    }

    return generatedQuestions;
  }, [config.questionCount, ageGroup, userId]);

  const startExam = () => {
    const newQuestions = generateQuestions();
    setQuestions(newQuestions);
    setTimeRemaining(config.duration * 60);
    setExamStarted(true);
    setCurrentQuestionIndex(0);
  };

  // Timer countdown
  useEffect(() => {
    if (!examStarted || examFinished || timeRemaining <= 0) return;

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          finishExam();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [examStarted, examFinished, timeRemaining]);

  const handleAnswer = (answer: string | number) => {
    const updatedQuestions = [...questions];
    updatedQuestions[currentQuestionIndex].userAnswer = answer;
    setQuestions(updatedQuestions);
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const previousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const finishExam = async () => {
    const correctAnswers = questions.filter(
      (q) => q.userAnswer?.toString() === q.correctAnswer.toString()
    ).length;
    const finalScore = Math.round((correctAnswers / questions.length) * 100);
    setScore(finalScore);
    setExamFinished(true);

    // Save to localStorage with monthly tracking
    const today = new Date();
    const examKey = `dailyExam_${userId}_${ageGroup}_${today.toDateString()}`;
    const monthKey = `dailyExamMonth_${userId}_${ageGroup}_${today.getFullYear()}_${today.getMonth()}`;
    
    const examResult: DailyExamResult = {
      id: Date.now().toString(),
      date: today.toISOString(),
      ageGroup,
      score: finalScore,
      correctAnswers,
      totalQuestions: questions.length,
      timeTaken: config.duration * 60 - timeRemaining,
      completedAt: Date.now(),
    };

    // Save daily result
    localStorage.setItem(examKey, JSON.stringify(examResult));

    // Update monthly tracking
    const monthlyData = localStorage.getItem(monthKey);
    const monthlyResults: DailyExamResult[] = monthlyData ? JSON.parse(monthlyData) : [];
    monthlyResults.push(examResult);
    localStorage.setItem(monthKey, JSON.stringify(monthlyResults));

    // Sync to backend
    if (studentNumber) {
      try {
        await saveExamResultMutation.mutateAsync({ studentNumber, result: examResult });
      } catch (error) {
        console.error('Failed to sync exam result to backend:', error);
      }
    }
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getMotivationalMessage = (score: number): string => {
    if (score >= 90) return 'Harika! Bugün de başarılı oldun! 🌟';
    if (score >= 75) return 'Çok iyi! Harika bir performans! 🎉';
    if (score >= 60) return 'Güzel! İyi bir çalışma! 👏';
    if (score >= 50) return 'Fena değil! Biraz daha pratik yapabilirsin! 💪';
    return 'Çalışmaya devam et! Her gün biraz daha iyileşiyorsun! 🌈';
  };

  // Already taken today
  if (alreadyTaken && !examStarted) {
    return (
      <div className="py-8 max-w-2xl mx-auto px-4">
        <Button
          onClick={onBack}
          variant="ghost"
          className="text-white hover:bg-white/10 mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Geri Dön
        </Button>

        <Card className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-md border-white/20">
          <CardContent className="p-8 text-center">
            <Trophy className="w-20 h-20 text-yellow-400 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-white mb-4">
              Bugünkü Sınavı Tamamladın!
            </h2>
            <div className="text-6xl font-bold text-white mb-4">{score}</div>
            <p className="text-xl text-white/80 mb-6">
              {getMotivationalMessage(score)}
            </p>
            <p className="text-white/70">
              Yarın yeni bir sınav için geri gel!
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Exam not started
  if (!examStarted) {
    return (
      <div className="py-8 max-w-2xl mx-auto px-4">
        <Button
          onClick={onBack}
          variant="ghost"
          className="text-white hover:bg-white/10 mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Geri Dön
        </Button>

        <Card className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 backdrop-blur-md border-white/20">
          <CardContent className="p-8 text-center">
            <div className="inline-flex p-6 rounded-full bg-gradient-to-br from-blue-400 to-purple-600 mb-6">
              <Trophy className="w-16 h-16 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-4">
              {ageGroupNames[ageGroup]} Günlük Sınav
            </h2>
            <div className="space-y-4 text-left max-w-md mx-auto mb-8">
              <div className="flex items-center gap-3 text-white">
                <CheckCircle className="w-6 h-6 text-green-400" />
                <span className="text-lg">{config.questionCount} Soru</span>
              </div>
              <div className="flex items-center gap-3 text-white">
                <Clock className="w-6 h-6 text-blue-400" />
                <span className="text-lg">{config.duration} Dakika</span>
              </div>
              <div className="flex items-center gap-3 text-white">
                <Star className="w-6 h-6 text-yellow-400" />
                <span className="text-lg">Yaş Grubuna Uygun Sorular</span>
              </div>
            </div>
            <p className="text-white/80 mb-6">
              Hazır mısın? Sınavı başlatmak için butona tıkla!
            </p>
            <Button
              onClick={startExam}
              size="lg"
              className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold text-xl px-8 py-6"
            >
              Sınavı Başlat
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Exam finished
  if (examFinished) {
    const correctAnswers = questions.filter(
      (q) => q.userAnswer?.toString() === q.correctAnswer.toString()
    ).length;

    return (
      <div className="py-8 max-w-3xl mx-auto px-4">
        <Card className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-md border-white/20">
          <CardContent className="p-8 text-center">
            <Trophy className="w-24 h-24 text-yellow-400 mx-auto mb-6 animate-bounce" />
            <h2 className="text-4xl font-bold text-white mb-4">
              Sınav Tamamlandı!
            </h2>
            <div className="text-7xl font-bold text-white mb-4">{score}</div>
            <p className="text-2xl text-white/90 mb-8">
              {getMotivationalMessage(score)}
            </p>
            <div className="grid grid-cols-2 gap-4 max-w-md mx-auto mb-8">
              <div className="bg-white/10 rounded-lg p-4">
                <CheckCircle className="w-8 h-8 text-green-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">{correctAnswers}</div>
                <div className="text-white/70">Doğru</div>
              </div>
              <div className="bg-white/10 rounded-lg p-4">
                <XCircle className="w-8 h-8 text-red-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">
                  {questions.length - correctAnswers}
                </div>
                <div className="text-white/70">Yanlış</div>
              </div>
            </div>
            <Button
              onClick={onBack}
              size="lg"
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold"
            >
              Ana Sayfaya Dön
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Exam in progress
  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
  const answeredCount = questions.filter((q) => q.userAnswer !== undefined).length;

  return (
    <div className="py-8 max-w-4xl mx-auto px-4">
      {/* Header with timer and progress */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2 text-white">
            <Clock className="w-5 h-5" />
            <span className="text-xl font-bold">{formatTime(timeRemaining)}</span>
          </div>
          <div className="text-white text-lg">
            Soru {currentQuestionIndex + 1} / {questions.length}
          </div>
        </div>
        <Progress value={progress} className="h-3" />
        <div className="text-white/70 text-sm mt-2">
          {answeredCount} / {questions.length} soru cevaplandı
        </div>
      </div>

      {/* Question Card */}
      <Card className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 backdrop-blur-md border-white/20 mb-6">
        <CardContent className="p-8">
          <div className="mb-6">
            <div className="inline-block bg-white/20 rounded-full px-4 py-2 mb-4">
              <span className="text-white font-semibold">
                {getQuestionTypeLabel(currentQuestion.type)}
              </span>
            </div>
            <h3 className="text-2xl font-bold text-white mb-6">
              {currentQuestion.question}
            </h3>
          </div>

          {/* Answer options */}
          {currentQuestion.options && (
            <div className="space-y-3">
              {currentQuestion.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswer(option)}
                  className={`w-full p-4 rounded-lg text-left transition-all ${
                    currentQuestion.userAnswer === option
                      ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white'
                      : 'bg-white/10 hover:bg-white/20 text-white'
                  }`}
                >
                  <span className="font-semibold mr-3">
                    {String.fromCharCode(65 + index)})
                  </span>
                  {option}
                </button>
              ))}
            </div>
          )}

          {currentQuestion.type === 'math' && !currentQuestion.options && (
            <div className="space-y-4">
              <input
                type="number"
                value={currentQuestion.userAnswer?.toString() || ''}
                onChange={(e) => handleAnswer(e.target.value)}
                placeholder="Cevabını yaz..."
                className="w-full p-4 rounded-lg bg-white/10 text-white text-xl border-2 border-white/20 focus:border-white/40 outline-none"
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Navigation buttons */}
      <div className="flex justify-between items-center gap-4">
        <Button
          onClick={previousQuestion}
          disabled={currentQuestionIndex === 0}
          variant="outline"
          className="bg-white/10 border-white/20 text-white hover:bg-white/20"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Önceki
        </Button>

        <Button
          onClick={finishExam}
          className="bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white font-bold"
        >
          Sınavı Bitir
        </Button>

        <Button
          onClick={nextQuestion}
          disabled={currentQuestionIndex === questions.length - 1}
          className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
        >
          Sonraki
          <ArrowLeft className="w-4 h-4 ml-2 rotate-180" />
        </Button>
      </div>
    </div>
  );
}

// Preschool question generators (ages 4-6)
function generatePreschoolQuestion(type: Question['type'], questionNumber: number, seed: string): Question {
  const hash = (seed + questionNumber).split('').reduce((a, b) => ((a << 5) - a + b.charCodeAt(0)) | 0, 0);
  const random = (max: number) => Math.abs(hash * questionNumber) % max;

  if (type === 'visual') {
    const visualQuestions = [
      { q: 'Hangi şekil dairedir?', opts: ['⭕', '⬛', '🔺', '⭐'], ans: '⭕' },
      { q: 'Hangi renk kırmızıdır?', opts: ['🔴', '🔵', '🟢', '🟡'], ans: '🔴' },
      { q: 'Hangi hayvan kediyedir?', opts: ['🐱', '🐶', '🐭', '🐰'], ans: '🐱' },
      { q: 'Hangi meyve elma?', opts: ['🍎', '🍌', '🍊', '🍇'], ans: '🍎' },
      { q: 'Hangi araç arabadır?', opts: ['🚗', '✈️', '🚂', '🚢'], ans: '🚗' },
    ];
    const q = visualQuestions[random(visualQuestions.length)];
    return { id: questionNumber, type: 'visual', question: q.q, options: q.opts, correctAnswer: q.ans };
  }

  if (type === 'matching') {
    const matchingQuestions = [
      { q: 'Kedi hangi sesi çıkarır?', opts: ['Miyav', 'Hav hav', 'Mee', 'Cik cik'], ans: 'Miyav' },
      { q: 'Güneş hangi renktir?', opts: ['Sarı', 'Mavi', 'Yeşil', 'Siyah'], ans: 'Sarı' },
      { q: 'Gece gökyüzünde ne görürüz?', opts: ['Ay ve yıldızlar', 'Güneş', 'Bulutlar', 'Gökkuşağı'], ans: 'Ay ve yıldızlar' },
      { q: 'Hangi hayvan havlar?', opts: ['Köpek', 'Kedi', 'Kuş', 'Balık'], ans: 'Köpek' },
      { q: 'Kalem ne için kullanılır?', opts: ['Yazmak', 'Yemek', 'Uyumak', 'Koşmak'], ans: 'Yazmak' },
    ];
    const q = matchingQuestions[random(matchingQuestions.length)];
    return { id: questionNumber, type: 'matching', question: q.q, options: q.opts, correctAnswer: q.ans };
  }

  if (type === 'counting') {
    const num = (random(5) + 1);
    const emojis = ['🍎', '⭐', '🌸', '🐱', '🚗'];
    const emoji = emojis[random(emojis.length)];
    const display = emoji.repeat(num);
    const opts = [num.toString(), (num + 1).toString(), (num - 1 > 0 ? num - 1 : num + 2).toString(), (num + 2).toString()];
    return {
      id: questionNumber,
      type: 'counting',
      question: `Kaç tane ${emoji} var? ${display}`,
      options: opts.sort(() => 0.5 - Math.random()),
      correctAnswer: num.toString(),
    };
  }

  if (type === 'pattern') {
    const patterns = [
      { q: 'Sıradaki ne gelir? 🔴 🔵 🔴 🔵 ?', opts: ['🔴', '🔵', '🟢', '🟡'], ans: '🔴' },
      { q: 'Sıradaki ne gelir? ⭐ ⭐ 🌙 ⭐ ⭐ ?', opts: ['🌙', '⭐', '☀️', '🌈'], ans: '🌙' },
      { q: 'Sıradaki ne gelir? 🍎 🍌 🍎 🍌 ?', opts: ['🍎', '🍌', '🍊', '🍇'], ans: '🍎' },
    ];
    const q = patterns[random(patterns.length)];
    return { id: questionNumber, type: 'pattern', question: q.q, options: q.opts, correctAnswer: q.ans };
  }

  return { id: questionNumber, type: 'visual', question: 'Varsayılan soru', options: ['A', 'B'], correctAnswer: 'A' };
}

// Elementary question generators
function generateElementaryQuestion(type: Question['type'], questionNumber: number, seed: string): Question {
  const hash = (seed + questionNumber).split('').reduce((a, b) => ((a << 5) - a + b.charCodeAt(0)) | 0, 0);
  const random = (max: number) => Math.abs(hash * questionNumber) % max;

  if (type === 'math') {
    const num1 = random(50) + 1;
    const num2 = random(30) + 1;
    const operations = ['+', '-', '×'];
    const op = operations[random(operations.length)];
    let answer = 0;
    let question = '';

    if (op === '+') {
      answer = num1 + num2;
      question = `${num1} + ${num2} = ?`;
    } else if (op === '-') {
      const larger = Math.max(num1, num2);
      const smaller = Math.min(num1, num2);
      answer = larger - smaller;
      question = `${larger} - ${smaller} = ?`;
    } else {
      const n1 = random(10) + 1;
      const n2 = random(10) + 1;
      answer = n1 * n2;
      question = `${n1} × ${n2} = ?`;
    }

    return { id: questionNumber, type: 'math', question, correctAnswer: answer };
  }

  if (type === 'pattern') {
    const patterns = [
      { q: 'Sıradaki sayı: 2, 4, 6, 8, ?', opts: ['10', '9', '12', '7'], ans: '10' },
      { q: 'Sıradaki sayı: 5, 10, 15, 20, ?', opts: ['25', '30', '22', '18'], ans: '25' },
      { q: 'Sıradaki harf: A, C, E, G, ?', opts: ['I', 'H', 'J', 'F'], ans: 'I' },
    ];
    const q = patterns[random(patterns.length)];
    return { id: questionNumber, type: 'pattern', question: q.q, options: q.opts, correctAnswer: q.ans };
  }

  if (type === 'multiple-choice') {
    const questions = [
      { q: 'Türkiye\'nin başkenti neresidir?', opts: ['Ankara', 'İstanbul', 'İzmir', 'Bursa'], ans: 'Ankara' },
      { q: 'Bir yılda kaç ay vardır?', opts: ['12', '10', '11', '13'], ans: '12' },
      { q: 'Hangi gezegen Güneş\'e en yakındır?', opts: ['Merkür', 'Venüs', 'Dünya', 'Mars'], ans: 'Merkür' },
      { q: 'Suyun kaynama noktası kaç derecedir?', opts: ['100°C', '0°C', '50°C', '200°C'], ans: '100°C' },
    ];
    const q = questions[random(questions.length)];
    return { id: questionNumber, type: 'multiple-choice', question: q.q, options: q.opts, correctAnswer: q.ans };
  }

  if (type === 'logic') {
    const logicQuestions = [
      { q: 'Ali, Ayşe\'den büyük. Ayşe, Mehmet\'ten büyük. En küçük kim?', opts: ['Mehmet', 'Ayşe', 'Ali', 'Bilinmez'], ans: 'Mehmet' },
      { q: 'Bir sayı 3\'e bölünüyor ve 2 artırılıyor, sonuç 5. Sayı kaç?', opts: ['9', '12', '15', '6'], ans: '9' },
    ];
    const q = logicQuestions[random(logicQuestions.length)];
    return { id: questionNumber, type: 'logic', question: q.q, options: q.opts, correctAnswer: q.ans };
  }

  if (type === 'word') {
    const wordQuestions = [
      { q: '"Büyük" kelimesinin zıt anlamlısı nedir?', opts: ['Küçük', 'Orta', 'Uzun', 'Kısa'], ans: 'Küçük' },
      { q: '"Gündüz" kelimesinin zıt anlamlısı nedir?', opts: ['Gece', 'Sabah', 'Akşam', 'Öğle'], ans: 'Gece' },
    ];
    const q = wordQuestions[random(wordQuestions.length)];
    return { id: questionNumber, type: 'word', question: q.q, options: q.opts, correctAnswer: q.ans };
  }

  return { id: questionNumber, type: 'math', question: '5 + 5 = ?', correctAnswer: 10 };
}

// Middle school question generators
function generateMiddleSchoolQuestion(type: Question['type'], questionNumber: number, seed: string): Question {
  const hash = (seed + questionNumber).split('').reduce((a, b) => ((a << 5) - a + b.charCodeAt(0)) | 0, 0);
  const random = (max: number) => Math.abs(hash * questionNumber) % max;

  if (type === 'math') {
    const mathTypes = ['algebra', 'fraction', 'percentage'];
    const mathType = mathTypes[random(mathTypes.length)];

    if (mathType === 'algebra') {
      const a = random(5) + 2;
      const b = random(10) + 5;
      const x = random(8) + 1;
      const result = a * x + b;
      return {
        id: questionNumber,
        type: 'math',
        question: `${a}x + ${b} = ${result} ise x kaçtır?`,
        correctAnswer: x,
      };
    } else if (mathType === 'fraction') {
      const fractions = [
        { q: '1/2 + 1/4 = ?', opts: ['3/4', '2/6', '1/3', '2/4'], ans: '3/4' },
        { q: '2/3 × 3/2 = ?', opts: ['1', '4/6', '6/6', '2'], ans: '1' },
      ];
      const q = fractions[random(fractions.length)];
      return { id: questionNumber, type: 'math', question: q.q, options: q.opts, correctAnswer: q.ans };
    } else {
      const num = random(80) + 20;
      const percent = [10, 20, 25, 50][random(4)];
      const result = (num * percent) / 100;
      return {
        id: questionNumber,
        type: 'math',
        question: `${num} sayısının %${percent}'si kaçtır?`,
        correctAnswer: result,
      };
    }
  }

  if (type === 'logic') {
    const logicQuestions = [
      { q: 'Bir sayının 3 katının 2 fazlası 17 ise, sayı kaçtır?', opts: ['5', '6', '7', '4'], ans: '5' },
      { q: 'A, B\'den 5 yaş büyük. B, C\'den 3 yaş küçük. A ile C arasındaki yaş farkı kaçtır?', opts: ['2', '8', '5', '3'], ans: '2' },
    ];
    const q = logicQuestions[random(logicQuestions.length)];
    return { id: questionNumber, type: 'logic', question: q.q, options: q.opts, correctAnswer: q.ans };
  }

  if (type === 'science') {
    const scienceQuestions = [
      { q: 'Fotosentez hangi organelde gerçekleşir?', opts: ['Kloroplast', 'Mitokondri', 'Ribozom', 'Çekirdek'], ans: 'Kloroplast' },
      { q: 'Suyun kimyasal formülü nedir?', opts: ['H₂O', 'CO₂', 'O₂', 'H₂'], ans: 'H₂O' },
      { q: 'Işık hızı yaklaşık kaç km/s\'dir?', opts: ['300,000', '150,000', '500,000', '100,000'], ans: '300,000' },
      { q: 'DNA\'nın açılımı nedir?', opts: ['Deoksiribonükleik Asit', 'Ribonükleik Asit', 'Amino Asit', 'Protein'], ans: 'Deoksiribonükleik Asit' },
    ];
    const q = scienceQuestions[random(scienceQuestions.length)];
    return { id: questionNumber, type: 'science', question: q.q, options: q.opts, correctAnswer: q.ans };
  }

  if (type === 'comprehension') {
    const comprehensionQuestions = [
      {
        q: 'Bir paragrafta "Bilim, gözlem ve deneyle doğayı anlamaya çalışır" deniliyor. Bu cümleden ne anlaşılır?',
        opts: ['Bilim sadece teoriktir', 'Bilim deneysel bir süreçtir', 'Bilim hayal gücüdür', 'Bilim sanattır'],
        ans: 'Bilim deneysel bir süreçtir',
      },
      {
        q: '"Sürdürülebilir kalkınma, gelecek nesillerin ihtiyaçlarını karşılama yeteneğinden ödün vermeden bugünün ihtiyaçlarını karşılamaktır." Bu tanım neyi vurgular?',
        opts: ['Gelecek nesilleri düşünmeyi', 'Sadece bugünü yaşamayı', 'Hızlı tüketimi', 'Teknoloji kullanımını'],
        ans: 'Gelecek nesilleri düşünmeyi',
      },
    ];
    const q = comprehensionQuestions[random(comprehensionQuestions.length)];
    return { id: questionNumber, type: 'comprehension', question: q.q, options: q.opts, correctAnswer: q.ans };
  }

  if (type === 'pattern') {
    const patterns = [
      { q: 'Sıradaki sayı: 1, 4, 9, 16, 25, ?', opts: ['36', '30', '35', '40'], ans: '36' },
      { q: 'Sıradaki sayı: 2, 6, 12, 20, 30, ?', opts: ['42', '40', '38', '44'], ans: '42' },
    ];
    const q = patterns[random(patterns.length)];
    return { id: questionNumber, type: 'pattern', question: q.q, options: q.opts, correctAnswer: q.ans };
  }

  return { id: questionNumber, type: 'math', question: '10 + 10 = ?', correctAnswer: 20 };
}

function getQuestionTypeLabel(type: Question['type']): string {
  const labels: Record<Question['type'], string> = {
    'multiple-choice': 'Çoktan Seçmeli',
    'math': 'Matematik',
    'matching': 'Eşleştirme',
    'pattern': 'Mantık',
    'word': 'Kelime',
    'visual': 'Görsel',
    'counting': 'Sayma',
    'logic': 'Mantık',
    'science': 'Fen Bilgisi',
    'comprehension': 'Okuduğunu Anlama',
  };
  return labels[type];
}
