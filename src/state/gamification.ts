import { badges, levelForXP, missionDefinitions } from '../data/gamification';
import { orbitingPlanets } from '../data/planets';
import { todayKey, type Progress } from './storage';

export function missionCounts(progress: Progress) {
  return [
    progress.completedLessons.includes(1) ? 1 : 0,
    orbitingPlanets.filter((planet) => progress.visited.includes(planet.id)).length,
    progress.completedLessons.length,
    progress.completedGames.includes('order') ? 1 : 0,
    Math.min(70, progress.bestQuiz),
  ];
}

export function currentStreak(progress: Progress) {
  const days = (Date.parse(`${todayKey()}T00:00:00Z`) - Date.parse(`${progress.lastActive}T00:00:00Z`)) / 86400000;
  return days === 0 || days === 1 ? progress.streak : 0;
}

export function earnedBadges(progress: Progress): string[] {
  const count = orbitingPlanets.filter((planet) => progress.visited.includes(planet.id)).length;
  const conditions = [count >= 1, count >= 8, progress.bestQuiz >= 70, progress.visited.includes('earth') && progress.completedLessons.includes(6), progress.missions.length === missionDefinitions.length];
  return badges.filter((_, index) => conditions[index]).map((badge) => badge.id);
}

export function awardMilestones(progress: Progress): Progress {
  const next = { ...progress, missions: [...progress.missions], badges: [...progress.badges] };
  const counts = missionCounts(next);
  missionDefinitions.forEach((mission, index) => {
    if (counts[index] >= mission.target && !next.missions.includes(mission.id)) {
      next.missions.push(mission.id);
      next.xp += 50;
    }
  });
  next.badges = [...new Set([...next.badges, ...earnedBadges(next)])];
  next.level = levelForXP(next.xp).level;
  const today = todayKey();
  if (next.lastActive !== today) {
    const days = (Date.parse(`${today}T00:00:00Z`) - Date.parse(`${next.lastActive}T00:00:00Z`)) / 86400000;
    next.streak = days === 1 ? next.streak + 1 : 1;
    next.lastActive = today;
  }
  return next;
}