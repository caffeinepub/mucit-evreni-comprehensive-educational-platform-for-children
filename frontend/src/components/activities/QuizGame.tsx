import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { AgeGroup } from '../../types';
import { Difficulty } from '../../pages/ClassView';
import { CheckCircle2, XCircle, RefreshCw } from 'lucide-react';

interface QuizGameProps {
  difficulty: Difficulty;
  ageGroup: AgeGroup;
  onComplete: (score: number) => void;
  maxScore: number;
}

interface QuizQuestion {
  question: string;
  options: string[];
  answer: string;
}

// Expanded question database
const quizDatabase = {
  easy: [
    { question: 'Güneş sisteminde kaç gezegen vardır?', options: ['6', '7', '8', '9'], answer: '8' },
    { question: 'Türkiye\'nin başkenti neresidir?', options: ['İstanbul', 'Ankara', 'İzmir', 'Bursa'], answer: 'Ankara' },
    { question: 'Bir yılda kaç ay vardır?', options: ['10', '11', '12', '13'], answer: '12' },
    { question: 'Hangi hayvan uçabilir?', options: ['Kedi', 'Köpek', 'Kuş', 'Balık'], answer: 'Kuş' },
    { question: 'Su hangi sıcaklıkta donar?', options: ['0°C', '10°C', '100°C', '-10°C'], answer: '0°C' },
    { question: 'Bir haftada kaç gün vardır?', options: ['5', '6', '7', '8'], answer: '7' },
    { question: 'Hangi renk birincil renktir?', options: ['Mor', 'Turuncu', 'Kırmızı', 'Yeşil'], answer: 'Kırmızı' },
    { question: 'Hangi hayvan suda yaşar?', options: ['Aslan', 'Balık', 'Kuş', 'Kedi'], answer: 'Balık' },
  ],
  medium: [
    { question: 'Ampulü kim icat etti?', options: ['Einstein', 'Edison', 'Tesla', 'Newton'], answer: 'Edison' },
    { question: 'Fotosentez hangi organizmalar tarafından yapılır?', options: ['Hayvanlar', 'Bitkiler', 'Mantarlar', 'Bakteriler'], answer: 'Bitkiler' },
    { question: 'Hangi gezegen en büyüktür?', options: ['Mars', 'Venüs', 'Jüpiter', 'Satürn'], answer: 'Jüpiter' },
    { question: 'DNA\'nın açılımı nedir?', options: ['Deoksiribonükleik Asit', 'Dinamik Nükleer Asit', 'Dijital Nükleer Atom', 'Demir Nükleer Asit'], answer: 'Deoksiribonükleik Asit' },
    { question: 'Işık hızı yaklaşık kaç km/s\'dir?', options: ['100,000', '200,000', '300,000', '400,000'], answer: '300,000' },
    { question: 'Hangi element en yaygındır?', options: ['Oksijen', 'Hidrojen', 'Karbon', 'Azot'], answer: 'Hidrojen' },
    { question: 'Ay\'ın Dünya etrafında dönme süresi nedir?', options: ['7 gün', '14 gün', '28 gün', '30 gün'], answer: '28 gün' },
    { question: 'Hangi organ kanı pompalar?', options: ['Akciğer', 'Kalp', 'Karaciğer', 'Böbrek'], answer: 'Kalp' },
  ],
  hard: [
    { question: 'Periyodik tabloda kaç element vardır?', options: ['92', '108', '118', '126'], answer: '118' },
    { question: 'Newton\'un kaç hareket yasası vardır?', options: ['2', '3', '4', '5'], answer: '3' },
    { question: 'Hangi bilim insanı görelilik teorisini geliştirdi?', options: ['Newton', 'Einstein', 'Hawking', 'Galileo'], answer: 'Einstein' },
    { question: 'Atomun çekirdeğinde ne bulunur?', options: ['Elektron', 'Proton ve Nötron', 'Sadece Proton', 'Sadece Nötron'], answer: 'Proton ve Nötron' },
    { question: 'Hangi element en hafiftir?', options: ['Helyum', 'Hidrojen', 'Lityum', 'Karbon'], answer: 'Hidrojen' },
    { question: 'Kuantum fiziğinin kurucusu kimdir?', options: ['Planck', 'Bohr', 'Heisenberg', 'Schrödinger'], answer: 'Planck' },
    { question: 'Evrenin yaşı yaklaşık kaç milyar yıldır?', options: ['10', '13.8', '15', '20'], answer: '13.8' },
    { question: 'Hangi gezegen en hızlı döner?', options: ['Dünya', 'Mars', 'Jüpiter', 'Satürn'], answer: 'Jüpiter' },
  ],
};

export default function QuizGame({ difficulty, onComplete, maxScore }: QuizGameProps) {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    initializeQuiz();
  }, [difficulty, refreshKey]);

  const initializeQuiz = () => {
    const questionPool = quizDatabase[difficulty];
    const count = difficulty === 'easy' ? 5 : difficulty === 'medium' ? 7 : 10;
    const selectedQuestions = [...questionPool]
      .sort(() => Math.random() - 0.5)
      .slice(0, Math.min(count, questionPool.length));
    
    setQuestions(selectedQuestions);
    setCurrentIndex(0);
    setScore(0);
    setFeedback(null);
    setSelectedAnswer(null);
  };

  const handleAnswer = (answer: string) => {
    setSelectedAnswer(answer);
    const isCorrect = answer === questions[currentIndex].answer;
    
    setFeedback(isCorrect ? 'correct' : 'wrong');
    if (isCorrect) {
      setScore(prev => prev + 1);
    }

    setTimeout(() => {
      if (currentIndex < questions.length - 1) {
        setCurrentIndex(prev => prev + 1);
        setFeedback(null);
        setSelectedAnswer(null);
      } else {
        const finalScore = Math.floor((score + (isCorrect ? 1 : 0)) / questions.length * maxScore);
        onComplete(finalScore);
      }
    }, 1500);
  };

  const handleReplay = () => {
    setRefreshKey(prev => prev + 1);
  };

  if (questions.length === 0) {
    return <div className="text-white text-center">Yükleniyor...</div>;
  }

  const currentQuestion = questions[currentIndex];

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-white mb-2">Bilgi Yarışması</h3>
        <p className="text-white/80">Doğru cevabı seç</p>
        <div className="mt-4 flex justify-center gap-8">
          <div className="text-white text-lg">
            <span className="font-bold">Soru:</span> {currentIndex + 1} / {questions.length}
          </div>
          <div className="text-white text-lg">
            <span className="font-bold">Doğru:</span> {score}
          </div>
          <Button
            onClick={handleReplay}
            variant="outline"
            size="sm"
            className="text-white border-white/30 hover:bg-white/10"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Yeni Sorular
          </Button>
        </div>
      </div>

      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8">
        <h2 className="text-2xl font-bold text-white text-center">{currentQuestion.question}</h2>
      </div>

      {feedback && (
        <div className={`text-center py-4 rounded-lg ${feedback === 'correct' ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
          <div className="flex items-center justify-center gap-2">
            {feedback === 'correct' ? (
              <>
                <CheckCircle2 className="w-8 h-8 text-green-400" />
                <span className="text-2xl font-bold text-green-400">Doğru!</span>
              </>
            ) : (
              <>
                <XCircle className="w-8 h-8 text-red-400" />
                <span className="text-2xl font-bold text-red-400">
                  Doğru cevap: {currentQuestion.answer}
                </span>
              </>
            )}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4">
        {currentQuestion.options.map((option, index) => (
          <Button
            key={index}
            onClick={() => handleAnswer(option)}
            disabled={feedback !== null}
            className={`h-20 text-xl font-bold transition-all duration-300 ${
              selectedAnswer === option
                ? feedback === 'correct'
                  ? 'bg-green-600 hover:bg-green-600'
                  : 'bg-red-600 hover:bg-red-600'
                : 'bg-white/20 hover:bg-white/30 hover:scale-105'
            }`}
          >
            {option}
          </Button>
        ))}
      </div>
    </div>
  );
}
