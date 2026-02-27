import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export interface Note {
    id: bigint;
    title: string;
    content: string;
    createdAt: bigint;
    updatedAt: bigint;
}
export interface StudentData {
    examResults: Array<ExamResult>;
    progress: ProgressData;
    notes: Array<Note>;
    dailyPlans: Array<DailyPlan>;
    profile: StudentProfile;
}
export interface Sound {
    file: ExternalBlob;
    category: SoundCategory;
    uploadedAt: bigint;
}
export interface AudioFile {
    id: bigint;
    audioLabel: string;
    file: ExternalBlob;
    uploadedAt: bigint;
}
export interface ProgressData {
    progressPercentage: bigint;
    lastActivityDate: bigint;
    totalScore: bigint;
    completedActivities: Array<string>;
    achievementBadge: string;
}
export interface StudentProfile {
    username: string;
    createdAt: bigint;
    lastUpdated: bigint;
    soundEnabled: boolean;
    studentNumber: string;
    notificationEnabled: boolean;
    avatar: string;
}
export interface AudioFileList {
    audioFiles: Array<AudioFileNoFile>;
}
export interface AdminProfile {
    name: string;
}
export interface ExamResult {
    id: bigint;
    completedAt: bigint;
    date: string;
    score: bigint;
    totalQuestions: bigint;
    educationLevel: string;
}
export interface DailyPlan {
    id: bigint;
    date: string;
    createdAt: bigint;
    activities: Array<string>;
    updatedAt: bigint;
    goals: Array<string>;
}
export interface AudioFileNoFile {
    id: bigint;
    audioLabel: string;
    uploadedAt: bigint;
}
export enum SoundCategory {
    anlaticiBolumGecisi = "anlaticiBolumGecisi",
    anlaticiGorevBaslangici = "anlaticiGorevBaslangici",
    arkaPlanMuzigi = "arkaPlanMuzigi",
    basari = "basari",
    yanlisCevap = "yanlisCevap",
    anlaticiMotivasyon = "anlaticiMotivasyon",
    secim = "secim",
    anlaticiHataTekrarDene = "anlaticiHataTekrarDene",
    anlaticiHosgeldiniz = "anlaticiHosgeldiniz",
    anlaticiBasari = "anlaticiBasari",
    uyari = "uyari",
    dogruCevap = "dogruCevap",
    gecisSesi = "gecisSesi"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    canUploadContent(): Promise<boolean>;
    deleteAudio(id: bigint): Promise<void>;
    deleteDailyPlan(studentNumber: string, planId: bigint): Promise<void>;
    deleteNote(studentNumber: string, noteId: bigint): Promise<void>;
    deleteStudentProfile(studentNumber: string): Promise<void>;
    getAudioFile(id: bigint): Promise<AudioFile | null>;
    getCallerUserProfile(): Promise<AdminProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getDailyPlans(studentNumber: string): Promise<Array<DailyPlan>>;
    getExamResults(studentNumber: string): Promise<Array<ExamResult>>;
    getNotes(studentNumber: string): Promise<Array<Note>>;
    getProgress(studentNumber: string): Promise<ProgressData | null>;
    getSound(category: SoundCategory): Promise<Sound | null>;
    getStudentData(studentNumber: string): Promise<StudentData | null>;
    getStudentProfile(studentNumber: string): Promise<StudentProfile | null>;
    getUserProfile(user: Principal): Promise<AdminProfile | null>;
    initializeAccessControl(): Promise<void>;
    isCallerAdmin(): Promise<boolean>;
    listAllAudioFilesWithFiles(): Promise<Array<AudioFile>>;
    listAudioFiles(): Promise<AudioFileList>;
    listSounds(): Promise<Array<Sound>>;
    saveCallerUserProfile(profile: AdminProfile): Promise<void>;
    saveDailyPlan(studentNumber: string, plan: DailyPlan): Promise<bigint>;
    saveExamResult(studentNumber: string, exam: ExamResult): Promise<bigint>;
    saveNote(studentNumber: string, note: Note): Promise<bigint>;
    saveProgress(studentNumber: string, progress: ProgressData): Promise<void>;
    saveStudentProfile(profile: StudentProfile): Promise<void>;
    syncStudentData(studentNumber: string, data: StudentData): Promise<void>;
    updateDailyPlan(studentNumber: string, planId: bigint, updatedPlan: DailyPlan): Promise<void>;
    updateNote(studentNumber: string, noteId: bigint, updatedNote: Note): Promise<void>;
    uploadAudio(audioLabel: string, blob: ExternalBlob): Promise<bigint>;
    uploadSound(category: SoundCategory, fileOrUrl: {
        __kind__: "url";
        url: string;
    } | {
        __kind__: "file";
        file: ExternalBlob;
    }): Promise<string>;
}
