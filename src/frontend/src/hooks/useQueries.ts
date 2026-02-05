import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { 
  UserProfile, 
  UserProgress, 
  DailyPlan, 
  Note,
  DailyExamResult 
} from '../types';
import { SoundCategory } from '../backend';

// ============================================================================
// SOUND MANAGEMENT HOOKS
// ============================================================================

export function useListSounds() {
  const { actor, isFetching } = useActor();

  return useQuery({
    queryKey: ['sounds'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listSounds();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useUploadSound() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ 
      category, 
      fileOrUrl 
    }: { 
      category: SoundCategory; 
      fileOrUrl: { __kind__: 'file'; file: any } | { __kind__: 'url'; url: string } 
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.uploadSound(category, fileOrUrl);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sounds'] });
    },
  });
}

export function useGetSound(category: SoundCategory) {
  const { actor, isFetching } = useActor();

  return useQuery({
    queryKey: ['sound', category],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getSound(category);
    },
    enabled: !!actor && !isFetching,
  });
}

// ============================================================================
// AUDIO FILE MANAGEMENT HOOKS
// ============================================================================

export function useListAudioFiles() {
  const { actor, isFetching } = useActor();

  return useQuery({
    queryKey: ['audioFiles'],
    queryFn: async () => {
      if (!actor) return { audioFiles: [] };
      return actor.listAudioFiles();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useUploadAudio() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ audioLabel, blob }: { audioLabel: string; blob: any }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.uploadAudio(audioLabel, blob);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['audioFiles'] });
    },
  });
}

export function useGetAudioFile(id: bigint) {
  const { actor, isFetching } = useActor();

  return useQuery({
    queryKey: ['audioFile', id.toString()],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getAudioFile(id);
    },
    enabled: !!actor && !isFetching && id > 0n,
  });
}

export function useDeleteAudio() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteAudio(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['audioFiles'] });
    },
  });
}

// ============================================================================
// STUDENT DATA SYNCHRONIZATION SYSTEM
// ============================================================================

// Helper: Check if online
function isOnline(): boolean {
  return navigator.onLine;
}

// Helper: Convert local data to backend format
function convertToBackendNote(note: Note) {
  return {
    id: BigInt(note.id),
    title: note.title,
    content: note.content,
    createdAt: BigInt(note.createdAt),
    updatedAt: BigInt(note.updatedAt),
  };
}

function convertFromBackendNote(note: any): Note {
  return {
    id: note.id.toString(),
    title: note.title,
    content: note.content,
    createdAt: Number(note.createdAt),
    updatedAt: Number(note.updatedAt),
  };
}

function convertToBackendPlan(plan: DailyPlan) {
  return {
    id: BigInt(plan.id),
    date: plan.date,
    activities: [plan.title],
    goals: [plan.description],
    createdAt: BigInt(plan.createdAt),
    updatedAt: BigInt(plan.createdAt),
  };
}

function convertFromBackendPlan(plan: any): DailyPlan {
  return {
    id: plan.id.toString(),
    date: plan.date,
    title: plan.activities?.[0] || '',
    description: plan.goals?.[0] || '',
    category: 'learning',
    completed: false,
    createdAt: Number(plan.createdAt),
  };
}

function convertToBackendExam(exam: DailyExamResult) {
  return {
    id: BigInt(exam.id || '0'),
    date: exam.date,
    educationLevel: exam.ageGroup,
    score: BigInt(exam.score),
    totalQuestions: BigInt(exam.totalQuestions),
    completedAt: BigInt(exam.completedAt || Date.now()),
  };
}

function convertFromBackendExam(exam: any): DailyExamResult {
  return {
    id: exam.id.toString(),
    date: exam.date,
    ageGroup: exam.educationLevel as 'preschool' | 'elementary' | 'middle',
    score: Number(exam.score),
    totalQuestions: Number(exam.totalQuestions),
    correctAnswers: Number(exam.score),
    completedAt: Number(exam.completedAt),
  };
}

// ============================================================================
// USER PROFILE HOOKS WITH SYNC
// ============================================================================

export function useGetUserProfile(studentNumber: string | null) {
  const { actor } = useActor();

  return useQuery({
    queryKey: ['userProfile', studentNumber],
    queryFn: async () => {
      if (!studentNumber) return null;
      
      // Try localStorage first for immediate response
      const localData = localStorage.getItem(`profile_${studentNumber}`);
      let localProfile = localData ? JSON.parse(localData) : null;
      
      // Try backend if online
      if (isOnline() && actor) {
        try {
          const backendProfile = await actor.getStudentProfile(studentNumber);
          if (backendProfile) {
            const profile = {
              username: backendProfile.username,
              avatar: backendProfile.avatar,
              studentNumber: backendProfile.studentNumber,
              createdAt: Number(backendProfile.createdAt),
            };
            // Update localStorage with backend data
            localStorage.setItem(`profile_${studentNumber}`, JSON.stringify(profile));
            return profile;
          }
        } catch (error) {
          console.error('Backend fetch failed:', error);
        }
      }
      
      return localProfile;
    },
    enabled: !!studentNumber,
  });
}

export function useSaveUserProfile() {
  const queryClient = useQueryClient();
  const { actor } = useActor();

  return useMutation({
    mutationFn: async ({ studentNumber, profile }: { studentNumber: string; profile: UserProfile }) => {
      // Save to localStorage immediately
      localStorage.setItem(`profile_${studentNumber}`, JSON.stringify(profile));
      
      // Sync to backend if online
      if (isOnline() && actor) {
        try {
          await actor.saveStudentProfile({
            studentNumber,
            username: profile.username,
            avatar: profile.avatar,
            notificationEnabled: true,
            soundEnabled: true,
            createdAt: BigInt(profile.createdAt),
            lastUpdated: BigInt(Date.now()),
          });
        } catch (error) {
          console.error('Backend sync failed:', error);
        }
      }
      
      return profile;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['userProfile', variables.studentNumber] });
    },
  });
}

// ============================================================================
// USER PROGRESS HOOKS WITH SYNC
// ============================================================================

export function useGetUserProgress(studentNumber: string | null) {
  const { actor } = useActor();

  return useQuery({
    queryKey: ['userProgress', studentNumber],
    queryFn: async () => {
      if (!studentNumber) return null;
      
      // Try localStorage first
      const localData = localStorage.getItem(`progress_${studentNumber}`);
      let localProgress = localData ? JSON.parse(localData) : null;
      
      // Try backend if online
      if (isOnline() && actor) {
        try {
          const backendProgress = await actor.getProgress(studentNumber);
          if (backendProgress) {
            const progress = {
              totalScore: Number(backendProgress.totalScore),
              achievementLevel: backendProgress.achievementBadge as 'Acemi' | 'Çırak' | 'Usta' | 'Uzman' | 'Dahi' | 'Mucit',
              progressPercentage: Number(backendProgress.progressPercentage),
              completedActivities: backendProgress.completedActivities,
              lastUpdated: Number(backendProgress.lastActivityDate),
            };
            localStorage.setItem(`progress_${studentNumber}`, JSON.stringify(progress));
            return progress;
          }
        } catch (error) {
          console.error('Backend fetch failed:', error);
        }
      }
      
      return localProgress;
    },
    enabled: !!studentNumber,
  });
}

export function useSaveUserProgress() {
  const queryClient = useQueryClient();
  const { actor } = useActor();

  return useMutation({
    mutationFn: async ({ studentNumber, progress }: { studentNumber: string; progress: UserProgress }) => {
      // Save to localStorage immediately
      localStorage.setItem(`progress_${studentNumber}`, JSON.stringify(progress));
      
      // Sync to backend if online
      if (isOnline() && actor) {
        try {
          await actor.saveProgress(studentNumber, {
            totalScore: BigInt(progress.totalScore),
            achievementBadge: progress.achievementLevel,
            progressPercentage: BigInt(progress.progressPercentage),
            completedActivities: progress.completedActivities,
            lastActivityDate: BigInt(progress.lastUpdated),
          });
        } catch (error) {
          console.error('Backend sync failed:', error);
        }
      }
      
      return progress;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['userProgress', variables.studentNumber] });
    },
  });
}

// ============================================================================
// NOTES HOOKS WITH SYNC
// ============================================================================

export function useGetNotes(studentNumber: string | null) {
  const { actor } = useActor();

  return useQuery({
    queryKey: ['notes', studentNumber],
    queryFn: async () => {
      if (!studentNumber) return [];
      
      // Try localStorage first
      const localData = localStorage.getItem(`notes_${studentNumber}`);
      let localNotes = localData ? JSON.parse(localData) : [];
      
      // Try backend if online
      if (isOnline() && actor) {
        try {
          const backendNotes = await actor.getNotes(studentNumber);
          if (backendNotes && backendNotes.length > 0) {
            const notes = backendNotes.map(convertFromBackendNote);
            localStorage.setItem(`notes_${studentNumber}`, JSON.stringify(notes));
            return notes;
          }
        } catch (error) {
          console.error('Backend fetch failed:', error);
        }
      }
      
      return localNotes;
    },
    enabled: !!studentNumber,
  });
}

export function useSaveNote() {
  const queryClient = useQueryClient();
  const { actor } = useActor();

  return useMutation({
    mutationFn: async ({ studentNumber, note }: { studentNumber: string; note: Note }) => {
      // Get existing notes
      const localData = localStorage.getItem(`notes_${studentNumber}`);
      const notes: Note[] = localData ? JSON.parse(localData) : [];
      
      // Update or add note
      const existingIndex = notes.findIndex(n => n.id === note.id);
      if (existingIndex >= 0) {
        notes[existingIndex] = note;
      } else {
        notes.push(note);
      }
      
      // Save to localStorage immediately
      localStorage.setItem(`notes_${studentNumber}`, JSON.stringify(notes));
      
      // Sync to backend if online
      if (isOnline() && actor) {
        try {
          const backendNote = convertToBackendNote(note);
          if (existingIndex >= 0) {
            await actor.updateNote(studentNumber, backendNote.id, backendNote);
          } else {
            await actor.saveNote(studentNumber, backendNote);
          }
        } catch (error) {
          console.error('Backend sync failed:', error);
        }
      }
      
      return notes;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['notes', variables.studentNumber] });
    },
  });
}

export function useDeleteNote() {
  const queryClient = useQueryClient();
  const { actor } = useActor();

  return useMutation({
    mutationFn: async ({ studentNumber, noteId }: { studentNumber: string; noteId: string }) => {
      // Get existing notes
      const localData = localStorage.getItem(`notes_${studentNumber}`);
      const notes: Note[] = localData ? JSON.parse(localData) : [];
      
      // Remove note
      const updatedNotes = notes.filter(n => n.id !== noteId);
      
      // Save to localStorage immediately
      localStorage.setItem(`notes_${studentNumber}`, JSON.stringify(updatedNotes));
      
      // Sync to backend if online
      if (isOnline() && actor) {
        try {
          await actor.deleteNote(studentNumber, BigInt(noteId));
        } catch (error) {
          console.error('Backend sync failed:', error);
        }
      }
      
      return updatedNotes;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['notes', variables.studentNumber] });
    },
  });
}

// ============================================================================
// DAILY PLANS HOOKS WITH SYNC
// ============================================================================

export function useGetDailyPlans(studentNumber: string | null) {
  const { actor } = useActor();

  return useQuery({
    queryKey: ['dailyPlans', studentNumber],
    queryFn: async () => {
      if (!studentNumber) return [];
      
      // Try localStorage first
      const localData = localStorage.getItem(`plans_${studentNumber}`);
      let localPlans = localData ? JSON.parse(localData) : [];
      
      // Try backend if online
      if (isOnline() && actor) {
        try {
          const backendPlans = await actor.getDailyPlans(studentNumber);
          if (backendPlans && backendPlans.length > 0) {
            const plans = backendPlans.map(convertFromBackendPlan);
            localStorage.setItem(`plans_${studentNumber}`, JSON.stringify(plans));
            return plans;
          }
        } catch (error) {
          console.error('Backend fetch failed:', error);
        }
      }
      
      return localPlans;
    },
    enabled: !!studentNumber,
  });
}

export function useSaveDailyPlan() {
  const queryClient = useQueryClient();
  const { actor } = useActor();

  return useMutation({
    mutationFn: async ({ studentNumber, plan }: { studentNumber: string; plan: DailyPlan }) => {
      // Get existing plans
      const localData = localStorage.getItem(`plans_${studentNumber}`);
      const plans: DailyPlan[] = localData ? JSON.parse(localData) : [];
      
      // Update or add plan
      const existingIndex = plans.findIndex(p => p.id === plan.id);
      if (existingIndex >= 0) {
        plans[existingIndex] = plan;
      } else {
        plans.push(plan);
      }
      
      // Save to localStorage immediately
      localStorage.setItem(`plans_${studentNumber}`, JSON.stringify(plans));
      
      // Sync to backend if online
      if (isOnline() && actor) {
        try {
          const backendPlan = convertToBackendPlan(plan);
          if (existingIndex >= 0) {
            await actor.updateDailyPlan(studentNumber, backendPlan.id, backendPlan);
          } else {
            await actor.saveDailyPlan(studentNumber, backendPlan);
          }
        } catch (error) {
          console.error('Backend sync failed:', error);
        }
      }
      
      return plans;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['dailyPlans', variables.studentNumber] });
    },
  });
}

export function useDeleteDailyPlan() {
  const queryClient = useQueryClient();
  const { actor } = useActor();

  return useMutation({
    mutationFn: async ({ studentNumber, planId }: { studentNumber: string; planId: string }) => {
      // Get existing plans
      const localData = localStorage.getItem(`plans_${studentNumber}`);
      const plans: DailyPlan[] = localData ? JSON.parse(localData) : [];
      
      // Remove plan
      const updatedPlans = plans.filter(p => p.id !== planId);
      
      // Save to localStorage immediately
      localStorage.setItem(`plans_${studentNumber}`, JSON.stringify(updatedPlans));
      
      // Sync to backend if online
      if (isOnline() && actor) {
        try {
          await actor.deleteDailyPlan(studentNumber, BigInt(planId));
        } catch (error) {
          console.error('Backend sync failed:', error);
        }
      }
      
      return updatedPlans;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['dailyPlans', variables.studentNumber] });
    },
  });
}

// ============================================================================
// DAILY EXAM RESULTS HOOKS WITH SYNC
// ============================================================================

export function useGetDailyExamResults(studentNumber: string | null) {
  const { actor } = useActor();

  return useQuery({
    queryKey: ['dailyExamResults', studentNumber],
    queryFn: async () => {
      if (!studentNumber) return [];
      
      // Try localStorage first
      const localData = localStorage.getItem(`examResults_${studentNumber}`);
      let localResults = localData ? JSON.parse(localData) : [];
      
      // Try backend if online
      if (isOnline() && actor) {
        try {
          const backendResults = await actor.getExamResults(studentNumber);
          if (backendResults && backendResults.length > 0) {
            const results = backendResults.map(convertFromBackendExam);
            localStorage.setItem(`examResults_${studentNumber}`, JSON.stringify(results));
            return results;
          }
        } catch (error) {
          console.error('Backend fetch failed:', error);
        }
      }
      
      return localResults;
    },
    enabled: !!studentNumber,
  });
}

export function useSaveDailyExamResult() {
  const queryClient = useQueryClient();
  const { actor } = useActor();

  return useMutation({
    mutationFn: async ({ studentNumber, result }: { studentNumber: string; result: DailyExamResult }) => {
      // Get existing results
      const localData = localStorage.getItem(`examResults_${studentNumber}`);
      const results: DailyExamResult[] = localData ? JSON.parse(localData) : [];
      
      // Add new result
      results.push(result);
      
      // Save to localStorage immediately
      localStorage.setItem(`examResults_${studentNumber}`, JSON.stringify(results));
      
      // Sync to backend if online
      if (isOnline() && actor) {
        try {
          const backendExam = convertToBackendExam(result);
          await actor.saveExamResult(studentNumber, backendExam);
        } catch (error) {
          console.error('Backend sync failed:', error);
        }
      }
      
      return results;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['dailyExamResults', variables.studentNumber] });
    },
  });
}

// ============================================================================
// PREFERENCES HOOKS WITH SYNC
// ============================================================================

export function useGetPreferences(studentNumber: string | null) {
  const { actor } = useActor();

  return useQuery({
    queryKey: ['preferences', studentNumber],
    queryFn: async () => {
      if (!studentNumber) return { notificationsEnabled: true, soundEnabled: true };
      
      // Try localStorage first
      const localData = localStorage.getItem(`preferences_${studentNumber}`);
      let localPrefs = localData ? JSON.parse(localData) : { notificationsEnabled: true, soundEnabled: true };
      
      // Try backend if online
      if (isOnline() && actor) {
        try {
          const backendProfile = await actor.getStudentProfile(studentNumber);
          if (backendProfile) {
            const prefs = {
              notificationsEnabled: backendProfile.notificationEnabled,
              soundEnabled: backendProfile.soundEnabled,
            };
            localStorage.setItem(`preferences_${studentNumber}`, JSON.stringify(prefs));
            return prefs;
          }
        } catch (error) {
          console.error('Backend fetch failed:', error);
        }
      }
      
      return localPrefs;
    },
    enabled: !!studentNumber,
  });
}

export function useSavePreferences() {
  const queryClient = useQueryClient();
  const { actor } = useActor();

  return useMutation({
    mutationFn: async ({ 
      studentNumber, 
      preferences 
    }: { 
      studentNumber: string; 
      preferences: { notificationsEnabled: boolean; soundEnabled: boolean } 
    }) => {
      // Save to localStorage immediately
      localStorage.setItem(`preferences_${studentNumber}`, JSON.stringify(preferences));
      
      // Sync to backend if online
      if (isOnline() && actor) {
        try {
          const profile = await actor.getStudentProfile(studentNumber);
          if (profile) {
            await actor.saveStudentProfile({
              ...profile,
              notificationEnabled: preferences.notificationsEnabled,
              soundEnabled: preferences.soundEnabled,
              lastUpdated: BigInt(Date.now()),
            });
          }
        } catch (error) {
          console.error('Backend sync failed:', error);
        }
      }
      
      return preferences;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['preferences', variables.studentNumber] });
    },
  });
}

// ============================================================================
// PARENT-TEACHER DASHBOARD HOOKS WITH SYNC
// ============================================================================

export function useGetStudentData(studentNumber: string | null) {
  const { actor } = useActor();

  return useQuery({
    queryKey: ['studentData', studentNumber],
    queryFn: async () => {
      if (!studentNumber) return null;
      
      // Strip spaces from student number
      const cleanNumber = studentNumber.replace(/\s/g, '');
      
      // Try backend first for cross-device compatibility
      if (isOnline() && actor) {
        try {
          const backendData = await actor.getStudentData(cleanNumber);
          if (backendData) {
            return {
              profile: {
                username: backendData.profile.username,
                avatar: backendData.profile.avatar,
                studentNumber: backendData.profile.studentNumber,
                createdAt: Number(backendData.profile.createdAt),
              },
              progress: {
                totalScore: Number(backendData.progress.totalScore),
                achievementBadge: backendData.progress.achievementBadge,
                achievementLevel: backendData.progress.achievementBadge as 'Acemi' | 'Çırak' | 'Usta' | 'Uzman' | 'Dahi' | 'Mucit',
                progressPercentage: Number(backendData.progress.progressPercentage),
                completedActivities: backendData.progress.completedActivities,
                lastActivityDate: Number(backendData.progress.lastActivityDate),
                lastUpdated: Number(backendData.progress.lastActivityDate),
              },
              plans: backendData.dailyPlans.map(convertFromBackendPlan),
              notes: backendData.notes.map(convertFromBackendNote),
              examResults: backendData.examResults.map(convertFromBackendExam),
              preferences: {
                notificationsEnabled: backendData.profile.notificationEnabled,
                soundEnabled: backendData.profile.soundEnabled,
              },
            };
          }
        } catch (error) {
          console.error('Backend fetch failed:', error);
        }
      }
      
      // Fallback to localStorage aggregation
      const profile = localStorage.getItem(`profile_${cleanNumber}`);
      const progress = localStorage.getItem(`progress_${cleanNumber}`);
      const plans = localStorage.getItem(`plans_${cleanNumber}`);
      const notes = localStorage.getItem(`notes_${cleanNumber}`);
      const examResults = localStorage.getItem(`examResults_${cleanNumber}`);
      const preferences = localStorage.getItem(`preferences_${cleanNumber}`);
      
      if (!profile) {
        return null;
      }
      
      return {
        profile: profile ? JSON.parse(profile) : null,
        progress: progress ? JSON.parse(progress) : null,
        plans: plans ? JSON.parse(plans) : [],
        notes: notes ? JSON.parse(notes) : [],
        examResults: examResults ? JSON.parse(examResults) : [],
        preferences: preferences ? JSON.parse(preferences) : { notificationsEnabled: true, soundEnabled: true },
      };
    },
    enabled: !!studentNumber,
    staleTime: 0,
    refetchOnMount: true,
  });
}

// ============================================================================
// BATCH SYNC OPERATION
// ============================================================================

export function useSyncAllData() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async (studentNumber: string) => {
      if (!isOnline() || !actor) {
        throw new Error('Offline or actor not available');
      }

      // Gather all local data
      const profile = localStorage.getItem(`profile_${studentNumber}`);
      const progress = localStorage.getItem(`progress_${studentNumber}`);
      const plans = localStorage.getItem(`plans_${studentNumber}`);
      const notes = localStorage.getItem(`notes_${studentNumber}`);
      const examResults = localStorage.getItem(`examResults_${studentNumber}`);
      const preferences = localStorage.getItem(`preferences_${studentNumber}`);

      if (!profile) {
        throw new Error('No profile data to sync');
      }

      const profileData = JSON.parse(profile);
      const progressData = progress ? JSON.parse(progress) : null;
      const plansData: DailyPlan[] = plans ? JSON.parse(plans) : [];
      const notesData: Note[] = notes ? JSON.parse(notes) : [];
      const examResultsData: DailyExamResult[] = examResults ? JSON.parse(examResults) : [];
      const preferencesData = preferences ? JSON.parse(preferences) : { notificationsEnabled: true, soundEnabled: true };

      // Prepare backend data structure
      const studentData = {
        profile: {
          studentNumber,
          username: profileData.username,
          avatar: profileData.avatar,
          notificationEnabled: preferencesData.notificationsEnabled,
          soundEnabled: preferencesData.soundEnabled,
          createdAt: BigInt(profileData.createdAt),
          lastUpdated: BigInt(Date.now()),
        },
        notes: notesData.map(convertToBackendNote),
        dailyPlans: plansData.map(convertToBackendPlan),
        examResults: examResultsData.map(convertToBackendExam),
        progress: progressData ? {
          totalScore: BigInt(progressData.totalScore),
          achievementBadge: progressData.achievementLevel,
          progressPercentage: BigInt(progressData.progressPercentage),
          completedActivities: progressData.completedActivities,
          lastActivityDate: BigInt(progressData.lastUpdated),
        } : {
          totalScore: 0n,
          achievementBadge: 'Acemi',
          progressPercentage: 0n,
          completedActivities: [],
          lastActivityDate: BigInt(Date.now()),
        },
      };

      // Sync to backend
      await actor.syncStudentData(studentNumber, studentData);

      return { success: true };
    },
  });
}
