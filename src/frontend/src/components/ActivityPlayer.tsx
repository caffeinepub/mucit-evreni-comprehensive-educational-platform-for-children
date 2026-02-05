import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Trophy, Star } from 'lucide-react';
import { ActivityData } from './ActivityList';
import { AgeGroup } from '../types';
import ColorMatchGame from './activities/ColorMatchGame';
import ShapeMatchGame from './activities/ShapeMatchGame';
import MathGame from './activities/MathGame';
import WordGame from './activities/WordGame';
import LogicGame from './activities/LogicGame';
import QuizGame from './activities/QuizGame';
import CreativeGame from './activities/CreativeGame';
import SimulationGame from './activities/SimulationGame';
import AnimalMatchGame from './activities/AnimalMatchGame';
import DetailFindGame from './activities/DetailFindGame';
import { useSoundEffects } from '../hooks/useSoundEffects';

interface ActivityPlayerProps {
  userId: string;
  activity: ActivityData;
  ageGroup: AgeGroup;
  difficulty: 'easy' | 'medium' | 'hard';
  onComplete: () => void;
  onBack: () => void;
}

export default function ActivityPlayer({
  userId,
  activity,
  ageGroup,
  difficulty,
  onComplete,
  onBack,
}: ActivityPlayerProps) {
  const [gameCompleted, setGameCompleted] = useState(false);
  const [score, setScore] = useState(0);
  const soundManager = useSoundEffects();

  // Track activity visit
  useEffect(() => {
    trackActivityVisit(userId, activity.name);
  }, [userId, activity.name]);

  const trackActivityVisit = (userId: string, activityName: string) => {
    const trackingKey = `mucit_activityTracking_${userId}`;
    const trackingData = localStorage.getItem(trackingKey);
    
    let tracking: Record<string, number> = {};
    
    if (trackingData) {
      try {
        tracking = JSON.parse(trackingData);
      } catch (e) {
        console.error('Error parsing activity tracking:', e);
      }
    }
    
    // Increment visit count for this activity
    tracking[activityName] = (tracking[activityName] || 0) + 1;
    
    // Save back to localStorage
    localStorage.setItem(trackingKey, JSON.stringify(tracking));
  };

  const handleGameComplete = (finalScore: number) => {
    setScore(finalScore);
    setGameCompleted(true);

    // Play success sound
    soundManager.playSuccess();

    // Update user score in localStorage
    const currentScore = parseInt(localStorage.getItem(`mucit_score_${userId}`) || '0');
    const newScore = currentScore + finalScore;
    localStorage.setItem(`mucit_score_${userId}`, newScore.toString());

    // Update achievement level based on score
    updateAchievementLevel(userId, newScore);
  };

  const updateAchievementLevel = (userId: string, totalScore: number) => {
    let level = 'Beginner';
    if (totalScore >= 1000) {
      level = 'Expert';
    } else if (totalScore >= 500) {
      level = 'Intermediate';
    }
    localStorage.setItem(`mucit_achievement_${userId}`, level);
  };

  const handleReplay = () => {
    setGameCompleted(false);
    setScore(0);
    // Play transition sound
    soundManager.playTransition();
  };

  // Calculate maxScore based on difficulty
  const getMaxScore = (): number => {
    const baseScores = {
      easy: 50,
      medium: 75,
      hard: 100,
    };
    return baseScores[difficulty];
  };

  const maxScore = getMaxScore();

  if (gameCompleted) {
    return (
      <div className="py-8 max-w-2xl mx-auto px-4">
        <Card className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-md border-white/20">
          <CardContent className="p-8 text-center">
            <Trophy className="w-24 h-24 text-yellow-400 mx-auto mb-6 animate-bounce" />
            <h2 className="text-4xl font-bold text-white mb-4">Tebrikler!</h2>
            <p className="text-2xl text-white/90 mb-4">Aktiviteyi tamamladın!</p>
            <div className="flex items-center justify-center gap-2 mb-8">
              <Star className="w-8 h-8 text-yellow-400 fill-yellow-400" />
              <span className="text-5xl font-bold text-white">{score}</span>
              <span className="text-2xl text-white/80">puan</span>
            </div>
            <div className="flex gap-4 justify-center">
              <Button
                onClick={handleReplay}
                size="lg"
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold"
              >
                Tekrar Oyna
              </Button>
              <Button
                onClick={onComplete}
                size="lg"
                className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold"
              >
                Aktivitelere Dön
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="py-8 max-w-4xl mx-auto px-4">
      <Button
        onClick={onBack}
        variant="ghost"
        className="text-white hover:bg-white/10 mb-6"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Geri Dön
      </Button>

      <Card className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 backdrop-blur-md border-white/20">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-white text-center">
            {activity.name}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {activity.type === 'color-match' && (
            <ColorMatchGame
              difficulty={difficulty}
              ageGroup={ageGroup}
              maxScore={maxScore}
              onComplete={handleGameComplete}
            />
          )}
          {activity.type === 'shape-match' && (
            <ShapeMatchGame
              difficulty={difficulty}
              ageGroup={ageGroup}
              maxScore={maxScore}
              onComplete={handleGameComplete}
            />
          )}
          {activity.type === 'math' && (
            <MathGame
              difficulty={difficulty}
              ageGroup={ageGroup}
              maxScore={maxScore}
              onComplete={handleGameComplete}
            />
          )}
          {activity.type === 'word' && (
            <WordGame
              difficulty={difficulty}
              ageGroup={ageGroup}
              maxScore={maxScore}
              onComplete={handleGameComplete}
            />
          )}
          {activity.type === 'logic' && (
            <LogicGame
              difficulty={difficulty}
              ageGroup={ageGroup}
              maxScore={maxScore}
              onComplete={handleGameComplete}
            />
          )}
          {activity.type === 'quiz' && (
            <QuizGame
              difficulty={difficulty}
              ageGroup={ageGroup}
              maxScore={maxScore}
              onComplete={handleGameComplete}
            />
          )}
          {activity.type === 'creative' && (
            <CreativeGame
              difficulty={difficulty}
              ageGroup={ageGroup}
              maxScore={maxScore}
              onComplete={handleGameComplete}
            />
          )}
          {activity.type === 'simulation' && (
            <SimulationGame
              difficulty={difficulty}
              ageGroup={ageGroup}
              maxScore={maxScore}
              onComplete={handleGameComplete}
            />
          )}
          {activity.type === 'animal-match' && (
            <AnimalMatchGame
              difficulty={difficulty}
              ageGroup={ageGroup}
              maxScore={maxScore}
              onComplete={handleGameComplete}
            />
          )}
          {activity.type === 'detail-find' && (
            <DetailFindGame
              difficulty={difficulty}
              ageGroup={ageGroup}
              maxScore={maxScore}
              onComplete={handleGameComplete}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
