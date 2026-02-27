import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { AgeGroup } from '../../types';
import { Difficulty } from '../../pages/ClassView';
import { CheckCircle2, XCircle, RefreshCw } from 'lucide-react';

interface MathGameProps {
  difficulty: Difficulty;
  ageGroup: AgeGroup;
  onComplete: (score: number) => void;
  maxScore: number;
}

interface Question {
  question: string;
  answer: number;
  options: number[];
}

const backgroundThemes = [
  'from-indigo-900/40 via-purple-900/40 to-pink-900/40',
  'from-blue-900/40 via-cyan-900/40 to-teal-900/40',
  'from-violet-900/40 via-fuchsia-900/40 to-pink-900/40',
];

export default function MathGame({ difficulty, ageGroup, onComplete, maxScore }: MathGameProps) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [backgroundTheme, setBackgroundTheme] = useState('');

  useEffect(() => {
    generateQuestions();
  }, [difficulty, ageGroup, refreshKey]);

  const generateQuestions = () => {
    // Select random background theme
    const theme = backgroundThemes[Math.floor(Math.random() * backgroundThemes.length)];
    setBackgroundTheme(theme);

    // Vary question count
    const baseCount = difficulty === 'easy' ? 5 : difficulty === 'medium' ? 8 : 12;
    const variation = Math.floor(Math.random() * 3);
    const questionCount = baseCount + variation;
    const newQuestions: Question[] = [];

    // Use time-based seed for additional randomization
    const timeSeed = Date.now();

    for (let i = 0; i < questionCount; i++) {
      let question: Question;
      
      // Add seed to randomization
      Math.random(); // Advance random state
      
      if (ageGroup === 'preschool') {
        question = generatePreschoolQuestion(difficulty, timeSeed + i);
      } else if (ageGroup === 'elementary') {
        question = generateElementaryQuestion(difficulty, timeSeed + i);
      } else {
        question = generateMiddleSchoolQuestion(difficulty, timeSeed + i);
      }
      
      newQuestions.push(question);
    }

    setQuestions(newQuestions);
    setCurrentIndex(0);
    setScore(0);
    setFeedback(null);
    setSelectedAnswer(null);
  };

  const generatePreschoolQuestion = (diff: Difficulty, seed: number): Question => {
    const operations = ['+', '-'];
    const opIndex = (seed % 2);
    const op = operations[opIndex];
    
    if (diff === 'easy') {
      const a = Math.floor(Math.random() * 5) + 1;
      const b = Math.floor(Math.random() * 5) + 1;
      const answer = op === '+' ? a + b : Math.max(a, b) - Math.min(a, b);
      return {
        question: op === '+' ? `${a} + ${b} = ?` : `${Math.max(a, b)} - ${Math.min(a, b)} = ?`,
        answer,
        options: generateOptions(answer, 15),
      };
    } else if (diff === 'medium') {
      const a = Math.floor(Math.random() * 10) + 1;
      const b = Math.floor(Math.random() * 10) + 1;
      const answer = op === '+' ? a + b : Math.max(a, b) - Math.min(a, b);
      return {
        question: op === '+' ? `${a} + ${b} = ?` : `${Math.max(a, b)} - ${Math.min(a, b)} = ?`,
        answer,
        options: generateOptions(answer, 20),
      };
    } else {
      const a = Math.floor(Math.random() * 15) + 1;
      const b = Math.floor(Math.random() * 15) + 1;
      const answer = op === '+' ? a + b : Math.max(a, b) - Math.min(a, b);
      return {
        question: op === '+' ? `${a} + ${b} = ?` : `${Math.max(a, b)} - ${Math.min(a, b)} = ?`,
        answer,
        options: generateOptions(answer, 30),
      };
    }
  };

  const generateElementaryQuestion = (diff: Difficulty, seed: number): Question => {
    const operations = ['+', '-', '×', '÷'];
    const opIndex = seed % operations.length;
    const op = operations[opIndex];
    
    if (diff === 'easy') {
      if (op === '×') {
        const a = Math.floor(Math.random() * 5) + 1;
        const b = Math.floor(Math.random() * 5) + 1;
        return {
          question: `${a} × ${b} = ?`,
          answer: a * b,
          options: generateOptions(a * b, 25),
        };
      } else if (op === '÷') {
        const b = Math.floor(Math.random() * 5) + 2;
        const answer = Math.floor(Math.random() * 8) + 1;
        const a = answer * b;
        return {
          question: `${a} ÷ ${b} = ?`,
          answer,
          options: generateOptions(answer, 10),
        };
      } else {
        const a = Math.floor(Math.random() * 20) + 1;
        const b = Math.floor(Math.random() * 20) + 1;
        const answer = op === '+' ? a + b : Math.max(a, b) - Math.min(a, b);
        return {
          question: op === '+' ? `${a} + ${b} = ?` : `${Math.max(a, b)} - ${Math.min(a, b)} = ?`,
          answer,
          options: generateOptions(answer, 40),
        };
      }
    } else if (diff === 'medium') {
      const a = Math.floor(Math.random() * 8) + 2;
      const b = Math.floor(Math.random() * 8) + 2;
      const answer = a * b;
      return {
        question: `${a} × ${b} = ?`,
        answer,
        options: generateOptions(answer, 64),
      };
    } else {
      const a = Math.floor(Math.random() * 12) + 1;
      const b = Math.floor(Math.random() * 12) + 1;
      const answer = a * b;
      return {
        question: `${a} × ${b} = ?`,
        answer,
        options: generateOptions(answer, 144),
      };
    }
  };

  const generateMiddleSchoolQuestion = (diff: Difficulty, seed: number): Question => {
    const operations = ['+', '-', '×', '÷', 'power', 'sqrt'];
    const opIndex = seed % operations.length;
    const op = operations[opIndex];
    
    if (diff === 'easy') {
      const a = Math.floor(Math.random() * 30) + 10;
      const b = Math.floor(Math.random() * 30) + 10;
      const answer = op === '+' ? a + b : Math.max(a, b) - Math.min(a, b);
      return {
        question: op === '+' ? `${a} + ${b} = ?` : `${Math.max(a, b)} - ${Math.min(a, b)} = ?`,
        answer,
        options: generateOptions(answer, 80),
      };
    } else if (diff === 'medium') {
      if (op === '÷') {
        const b = Math.floor(Math.random() * 9) + 2;
        const answer = Math.floor(Math.random() * 15) + 5;
        const a = answer * b;
        return {
          question: `${a} ÷ ${b} = ?`,
          answer,
          options: generateOptions(answer, 20),
        };
      } else {
        const a = Math.floor(Math.random() * 15) + 1;
        const b = Math.floor(Math.random() * 15) + 1;
        return {
          question: `${a} × ${b} = ?`,
          answer: a * b,
          options: generateOptions(a * b, 225),
        };
      }
    } else {
      if (op === 'power') {
        const base = Math.floor(Math.random() * 8) + 2;
        const exp = Math.floor(Math.random() * 3) + 2;
        const answer = Math.pow(base, exp);
        return {
          question: `${base}^${exp} = ?`,
          answer,
          options: generateOptions(answer, 1000),
        };
      } else if (op === 'sqrt') {
        const squares = [4, 9, 16, 25, 36, 49, 64, 81, 100, 121, 144];
        const num = squares[Math.floor(Math.random() * squares.length)];
        const answer = Math.sqrt(num);
        return {
          question: `√${num} = ?`,
          answer,
          options: generateOptions(answer, 15),
        };
      } else if (op === '÷') {
        const b = Math.floor(Math.random() * 12) + 2;
        const answer = Math.floor(Math.random() * 20) + 5;
        const a = answer * b;
        return {
          question: `${a} ÷ ${b} = ?`,
          answer,
          options: generateOptions(answer, 30),
        };
      } else {
        const a = Math.floor(Math.random() * 20) + 10;
        const b = Math.floor(Math.random() * 20) + 10;
        return {
          question: `${a} × ${b} = ?`,
          answer: a * b,
          options: generateOptions(a * b, 600),
        };
      }
    }
  };

  const generateOptions = (correctAnswer: number, max: number): number[] => {
    const options = [correctAnswer];
    const attempts = 20;
    let count = 0;
    
    while (options.length < 4 && count < attempts) {
      const offset = Math.floor(Math.random() * 20) - 10;
      const option = Math.max(1, correctAnswer + offset);
      if (!options.includes(option) && option <= max) {
        options.push(option);
      }
      count++;
    }
    
    // Fill remaining slots if needed
    while (options.length < 4) {
      const option = Math.floor(Math.random() * max) + 1;
      if (!options.includes(option)) {
        options.push(option);
      }
    }
    
    return options.sort(() => Math.random() - 0.5);
  };

  const handleAnswer = (answer: number) => {
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
    <div className="space-y-8 relative">
      <div className={`absolute inset-0 bg-gradient-to-br ${backgroundTheme} -z-10 rounded-3xl`} />
      
      <div className="text-center">
        <h3 className="text-2xl font-bold text-white mb-2">Matematik Soruları</h3>
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

      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-12 text-center">
        <h2 className="text-5xl font-bold text-white mb-8">{currentQuestion.question}</h2>
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
                  Yanlış! Doğru cevap: {currentQuestion.answer}
                </span>
              </>
            )}
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        {currentQuestion.options.map((option, index) => (
          <Button
            key={index}
            onClick={() => handleAnswer(option)}
            disabled={feedback !== null}
            className={`h-24 text-3xl font-bold transition-all duration-300 ${
              selectedAnswer === option
                ? feedback === 'correct'
                  ? 'bg-green-600 hover:bg-green-600'
                  : 'bg-red-600 hover:bg-red-600'
                : 'bg-white/20 hover:bg-white/30'
            }`}
          >
            {option}
          </Button>
        ))}
      </div>
    </div>
  );
}
