import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import { badges, gameDefinitions, missionDefinitions } from '../data/gamification';
import { planets } from '../data/planets';
import { lessons } from '../data/lessons';
import { freshProgress, localProgressRepository, type Progress, type QuizResult } from './storage';
import { awardMilestones } from './gamification';
import { playSound } from './audio';

export interface Notice { id: number; title: string; message: string; kind: 'success' | 'guide' | 'info' }
interface LearningContextValue {
  progress: Progress;
  storageAvailable: boolean;
  notice: Notice | null;
  dismissNotice(): void;
  notify(title: string, message: string, kind?: Notice['kind']): void;
  visitPlanet(id: string): void;
  completeLesson(id: number, reflection: string): void;
  completeGame(id: string): void;
  recordAnswer(correct: boolean): void;
  recordQuiz(result: Omit<QuizResult, 'id' | 'date'>): void;
  updateNickname(name: string): void;
  toggleSound(): void;
  reset(): void;
  feedback(correct: boolean): void;
}

const LearningContext = createContext<LearningContextValue | null>(null);

export function LearningProvider({ children }: { children: ReactNode }) {
  const [progress, setProgress] = useState<Progress>(() => localProgressRepository.load());
  const [storageAvailable, setStorageAvailable] = useState(true);
  const [notice, setNotice] = useState<Notice | null>(null);
  const previous = useRef(progress);

  const notify = useCallback((title: string, message: string, kind: Notice['kind'] = 'info') => {
    setNotice({ id: Date.now(), title, message, kind });
  }, []);

  useEffect(() => {
    setStorageAvailable(localProgressRepository.save(progress));
    const old = previous.current;
    const newMission = progress.missions.find((id) => !old.missions.includes(id));
    const newBadge = progress.badges.find((id) => !old.badges.includes(id));
    if (newMission) {
      const mission = missionDefinitions.find((item) => item.id === newMission);
      notify('Hebat! Misi selesai!', `${mission?.name}. Kamu mendapatkan +50 XP${newBadge ? ' dan badge baru' : ''}!`, 'success');
      if (progress.sound) playSound('mission');
    } else if (newBadge) {
      notify('Badge baru untukmu!', `${badges.find((badge) => badge.id === newBadge)?.name}. Teruskan petualanganmu!`, 'success');
      if (progress.sound) playSound('mission');
    } else if (progress.xp > old.xp) {
      notify(`+${progress.xp - old.xp} XP`, progress.level > old.level ? `Naik ke level ${progress.level}! Petualanganmu semakin seru.` : 'Sedikit demi sedikit, kamu semakin mengenal tata surya.', 'success');
    }
    previous.current = progress;
  }, [progress, notify]);

  useEffect(() => {
    if (!notice) return;
    const timeout = window.setTimeout(() => setNotice(null), 5800);
    return () => window.clearTimeout(timeout);
  }, [notice]);

  useEffect(() => {
    if (!progress.sound) return;
    const listener = (event: MouseEvent) => {
      if ((event.target as HTMLElement).closest('button, a, select')) playSound('click');
    };
    document.addEventListener('click', listener);
    return () => document.removeEventListener('click', listener);
  }, [progress.sound]);

  const visitPlanet = useCallback((id: string) => setProgress((current) => {
    if (!planets.some((planet) => planet.id === id)) return current;
    if (current.visited.includes(id)) return awardMilestones(current);
    return awardMilestones({ ...current, visited: [...current.visited, id], xp: current.xp + (id === 'sun' ? 0 : 10) });
  }), []);

  const completeLesson = useCallback((id: number, reflection: string) => setProgress((current) => {
    if (!lessons.some((lesson) => lesson.id === id) || reflection.trim().length < 5) return current;
    return awardMilestones({
      ...current,
      completedLessons: current.completedLessons.includes(id) ? current.completedLessons : [...current.completedLessons, id],
      reflections: { ...current.reflections, [id]: reflection.trim().slice(0, 1500) },
      xp: current.xp + (current.completedLessons.includes(id) ? 0 : 20),
    });
  }), []);

  const completeGame = useCallback((id: string) => setProgress((current) => {
    if (!gameDefinitions.some((game) => game.id === id)) return current;
    if (current.completedGames.includes(id)) return awardMilestones(current);
    return awardMilestones({ ...current, completedGames: [...current.completedGames, id], xp: current.xp + 30 });
  }), []);

  const recordAnswer = useCallback((correct: boolean) => setProgress((current) => {
    const streak = correct ? current.answerStreak + 1 : 0;
    return awardMilestones({ ...current, xp: current.xp + (correct ? 10 : 0), answerStreak: streak, bestAnswerStreak: Math.max(streak, current.bestAnswerStreak) });
  }), []);

  const recordQuiz = useCallback((result: Omit<QuizResult, 'id' | 'date'>) => setProgress((current) => awardMilestones({
    ...current, quizzes: [...current.quizzes, { ...result, id: `quiz-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, date: new Date().toISOString() }].slice(-30), bestQuiz: Math.max(current.bestQuiz, result.score),
  })), []);

  const updateNickname = useCallback((name: string) => {
    setProgress((current) => ({ ...current, nickname: name.trim().slice(0, 24) || 'Penjelajah' }));
    notify('Profil tersimpan', 'Nama panggilanmu siap untuk petualangan berikutnya.', 'success');
  }, [notify]);

  const toggleSound = useCallback(() => {
    setProgress((current) => ({ ...current, sound: !current.sound }));
    if (!progress.sound) playSound('correct');
  }, [progress.sound]);

  const reset = useCallback(() => {
    localProgressRepository.clear();
    const initial = freshProgress();
    previous.current = initial;
    setProgress(initial);
    notify('Progres telah direset', 'Lembaran baru, petualangan baru. Ayo mulai lagi!', 'info');
  }, [notify]);

  const feedback = useCallback((correct: boolean) => {
    if (progress.sound) playSound(correct ? 'correct' : 'wrong');
    if (!correct) notify('Jangan menyerah, Penjelajah!', 'Belum tepat. Baca kembali petunjuknya dan coba pahami alasannya.', 'guide');
  }, [progress.sound, notify]);

  return <LearningContext.Provider value={{ progress, storageAvailable, notice, dismissNotice: () => setNotice(null), notify, visitPlanet, completeLesson, completeGame, recordAnswer, recordQuiz, updateNickname, toggleSound, reset, feedback }}>{children}</LearningContext.Provider>;
}

export function useLearning() {
  const context = useContext(LearningContext);
  if (!context) throw new Error('LearningProvider is required');
  return context;
}