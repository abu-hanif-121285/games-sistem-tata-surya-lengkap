import { badges, levelForXP, missionDefinitions } from '../data/gamification';
import { planets } from '../data/planets';

export interface QuizResult {
  id: string;
  date: string;
  correct: number;
  total: number;
  score: number;
  difficulty: string;
  answers: { questionId: string; correct: boolean; lesson: number }[];
}

export interface Progress {
  version: 1;
  nickname: string;
  xp: number;
  level: number;
  visited: string[];
  completedLessons: number[];
  reflections: Record<string, string>;
  completedGames: string[];
  quizzes: QuizResult[];
  bestQuiz: number;
  missions: string[];
  badges: string[];
  streak: number;
  answerStreak: number;
  bestAnswerStreak: number;
  lastActive: string;
  sound: boolean;
}

export const STORAGE_KEY = 'tata-surya-explorer-6:v1';
export function todayKey() {
  const date = new Date();
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

export function freshProgress(): Progress {
  return { version: 1, nickname: 'Penjelajah', xp: 0, level: 1, visited: [], completedLessons: [], reflections: {}, completedGames: [], quizzes: [], bestQuiz: 0, missions: [], badges: [], streak: 0, answerStreak: 0, bestAnswerStreak: 0, lastActive: '', sound: false };
}

const validStrings = (value: unknown, allowed: string[]) => Array.isArray(value) ? [...new Set(value.filter((item): item is string => typeof item === 'string' && allowed.includes(item)))] : [];
const safeNumber = (value: unknown, fallback = 0, max = 1000000) => typeof value === 'number' && Number.isFinite(value) ? Math.max(0, Math.min(max, Math.floor(value))) : fallback;

function validate(raw: unknown): Progress {
  const base = freshProgress();
  if (!raw || typeof raw !== 'object' || !('version' in raw) || raw.version !== 1) return base;
  const data = raw as Record<string, unknown>;
  const xp = safeNumber(data.xp);
  const quizzes: QuizResult[] = Array.isArray(data.quizzes) ? data.quizzes.filter((item): item is QuizResult => {
    if (!item || typeof item !== 'object') return false;
    const q = item as Partial<QuizResult>;
    return typeof q.id === 'string' && typeof q.date === 'string' && !Number.isNaN(Date.parse(q.date)) && typeof q.score === 'number' && Number.isInteger(q.score) && q.score >= 0 && q.score <= 100 && typeof q.correct === 'number' && Number.isInteger(q.correct) && typeof q.total === 'number' && Number.isInteger(q.total) && q.total > 0 && q.total <= 100 && q.correct >= 0 && q.correct <= q.total && typeof q.difficulty === 'string' && Array.isArray(q.answers) && q.answers.length === q.total && q.answers.every((answer) => typeof answer?.questionId === 'string' && typeof answer.correct === 'boolean' && Number.isInteger(answer.lesson) && answer.lesson >= 1 && answer.lesson <= 7) && q.answers.filter((answer) => answer.correct).length === q.correct && q.score === Math.round(q.correct / q.total * 100);
  }).slice(-30) : [];
  const reflections: Record<string, string> = {};
  if (data.reflections && typeof data.reflections === 'object') {
    Object.entries(data.reflections).forEach(([key, value]) => {
      if (/^[1-7]$/.test(key) && typeof value === 'string') reflections[key] = value.slice(0, 1500);
    });
  }
  return {
    ...base, xp, level: levelForXP(xp).level,
    nickname: typeof data.nickname === 'string' && data.nickname.trim() ? data.nickname.trim().slice(0, 24) : base.nickname,
    visited: validStrings(data.visited, planets.map((planet) => planet.id)),
    completedLessons: Array.isArray(data.completedLessons) ? [...new Set(data.completedLessons.filter((id): id is number => Number.isInteger(id) && id >= 1 && id <= 7))] : [],
    completedGames: validStrings(data.completedGames, ['order', 'guess', 'mission', 'match', 'space']),
    missions: validStrings(data.missions, missionDefinitions.map((mission) => mission.id)),
    badges: validStrings(data.badges, badges.map((badge) => badge.id)),
    quizzes, reflections, bestQuiz: Math.max(safeNumber(data.bestQuiz, 0, 100), ...quizzes.map((quiz) => quiz.score)),
    streak: safeNumber(data.streak, 0, 3650), answerStreak: safeNumber(data.answerStreak), bestAnswerStreak: safeNumber(data.bestAnswerStreak),
    lastActive: typeof data.lastActive === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(data.lastActive) ? data.lastActive : '',
    sound: data.sound === true,
  };
}

// All device persistence stays behind this adapter, separate from learning engines.
export interface ProgressRepository {
  load(): Progress;
  save(progress: Progress): boolean;
  clear(): boolean;
}

export const localProgressRepository: ProgressRepository = {
  load() {
    try { return validate(JSON.parse(localStorage.getItem(STORAGE_KEY) ?? 'null')); }
    catch { return freshProgress(); }
  },
  save(progress) {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(progress)); return true; }
    catch { return false; }
  },
  clear() {
    try { localStorage.removeItem(STORAGE_KEY); return true; }
    catch { return false; }
  },
};