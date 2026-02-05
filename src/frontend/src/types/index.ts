// Local type definitions for Mucit Evreni application

export type AgeGroup = 'preschool' | 'elementary' | 'middle';

export type AchievementLevel = 'Acemi' | 'Çırak' | 'Usta' | 'Uzman' | 'Dahi' | 'Mucit';

export type PlanCategory = 'learning' | 'fun' | 'reminder' | 'task';

export interface Activity {
  id: string;
  name: string;
  type: string;
  ageGroup: AgeGroup;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface Avatar {
  id: string;
  name: string;
  imageUrl: string;
}

export interface UserProfile {
  username: string;
  avatar: string;
  studentNumber: string;
  createdAt: number;
}

export interface UserProgress {
  totalScore: number;
  achievementLevel: AchievementLevel;
  completedActivities: string[];
  progressPercentage: number;
  lastUpdated: number;
}

export interface DailyPlan {
  id: string;
  date: string;
  title: string;
  description: string;
  category: PlanCategory;
  completed: boolean;
  createdAt: number;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: number;
  updatedAt: number;
}

export interface DailyExamResult {
  id?: string;
  date: string;
  ageGroup: AgeGroup;
  score: number;
  correctAnswers: number;
  totalQuestions: number;
  timeTaken?: number;
  completedAt?: number;
}
