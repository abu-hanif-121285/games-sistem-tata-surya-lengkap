export type Page = 'home' | 'explore' | 'planets' | 'materials' | 'quiz' | 'games' | 'achievements' | 'profile' | 'teacher' | 'complete';
export interface Route { page: Page; id?: string }
export type Navigate = (page: Page, id?: string) => void;