import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, MotionConfig } from 'framer-motion';
import { LearningProvider, useLearning } from './state/LearningContext';
import { currentStreak } from './state/gamification';
import { levelForXP, levels } from './data/gamification';
import type { Navigate, Page, Route } from './types';
import { Astronaut, Icon, Modal, ProgressBar, SourceContent, Toast } from './components/ui';
import { ExplorationEngine } from './components/ExplorationEngine';
import { HomePage } from './pages/Home';
import { PlanetsPage } from './pages/Planets';
import { MaterialsPage } from './pages/Materials';
import { QuizPage } from './pages/Quiz';
import { GamesPage } from './pages/Games';
import { AchievementsPage } from './pages/Achievements';
import { ProfilePage } from './pages/Profile';
import { TeacherPage } from './pages/Teacher';
import { CompletePage } from './pages/Complete';

const navigation: { page: Page; label: string; icon: string; group: string }[] = [
  { page: 'home', label: 'Beranda', icon: 'home', group: 'JELAJAHI' },
  { page: 'explore', label: 'Eksplorasi Tata Surya', icon: 'compass', group: 'JELAJAHI' },
  { page: 'planets', label: 'Planet', icon: 'orbit', group: 'JELAJAHI' },
  { page: 'materials', label: 'Materi', icon: 'book', group: 'RUANG BELAJAR' },
  { page: 'quiz', label: 'Quiz', icon: 'target', group: 'RUANG BELAJAR' },
  { page: 'games', label: 'Mini Games', icon: 'game', group: 'RUANG BELAJAR' },
  { page: 'achievements', label: 'Pencapaian', icon: 'trophy', group: 'PERJALANANMU' },
  { page: 'profile', label: 'Profil', icon: 'user', group: 'PERJALANANMU' },
];
const pageTitles: Record<Page, string> = { home: 'Beranda', explore: 'Eksplorasi Tata Surya', planets: 'Planet', materials: 'Materi', quiz: 'Quiz', games: 'Mini Games', achievements: 'Pencapaian', profile: 'Profil', teacher: 'Mode Guru', complete: 'Mission Complete' };

function readRoute(): Route {
  try {
    const [page, id] = window.location.hash.replace(/^#\/?/, '').split('/').map(decodeURIComponent);
    return Object.prototype.hasOwnProperty.call(pageTitles, page) ? { page: page as Page, id } : { page: 'home' };
  } catch { return { page: 'home' }; }
}

export default function App() {
  return <MotionConfig reducedMotion="user"><LearningProvider><Application /></LearningProvider></MotionConfig>;
}

function Application() {
  const { progress: storedProgress, toggleSound, storageAvailable } = useLearning();
  const progress = { ...storedProgress, streak: currentStreak(storedProgress) };
  const [route, setRoute] = useState<Route>(readRoute);
  const [guideOpen, setGuideOpen] = useState(false);
  const [sourcesOpen, setSourcesOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [celebrate, setCelebrate] = useState(false);
  const previousMissions = useRef(progress.missions.length);
  const main = useRef<HTMLElement>(null);
  const initialRoute = useRef(true);
  const level = levelForXP(progress.xp);
  const nextLevel = levels[level.level];
  const xpPercent = nextLevel ? (progress.xp - level.min) / (nextLevel.min - level.min) * 100 : 100;

  useEffect(() => {
    const listener = () => setRoute(readRoute());
    window.addEventListener('hashchange', listener);
    return () => window.removeEventListener('hashchange', listener);
  }, []);
  useEffect(() => {
    document.title = `${pageTitles[route.page]} | Tata Surya Explorer 6`;
    if (initialRoute.current) { initialRoute.current = false; return; }
    window.scrollTo({ top: 0, behavior: 'auto' });
    const timeout = window.setTimeout(() => main.current?.focus({ preventScroll: true }), 50);
    return () => window.clearTimeout(timeout);
  }, [route.page, route.id]);
  useEffect(() => {
    if (progress.missions.length === 5 && previousMissions.current < 5) setCelebrate(true);
    previousMissions.current = progress.missions.length;
  }, [progress.missions.length]);

  const navigate: Navigate = useCallback((page, id) => {
    setMenuOpen(false);
    const hash = page === 'home' ? '#/' : `#/${page}${id ? `/${encodeURIComponent(id)}` : ''}`;
    if (window.location.hash === hash) window.scrollTo({ top: 0, behavior: 'smooth' });
    else window.location.hash = hash;
  }, []);

  function renderPage() {
    switch (route.page) {
      case 'home': return <HomePage navigate={navigate} openGuide={() => setGuideOpen(true)} />;
      case 'explore': return <ExplorationEngine navigate={navigate} initialPlanet={route.id} />;
      case 'planets': return <PlanetsPage navigate={navigate} id={route.id} />;
      case 'materials': return <MaterialsPage navigate={navigate} id={route.id} />;
      case 'quiz': return <QuizPage navigate={navigate} challenge={route.id === 'challenge'} />;
      case 'games': return <GamesPage navigate={navigate} id={route.id} />;
      case 'achievements': return <AchievementsPage navigate={navigate} missions={route.id === 'missions'} />;
      case 'profile': return <ProfilePage navigate={navigate} />;
      case 'teacher': return <TeacherPage />;
      case 'complete': return <CompletePage navigate={navigate} />;
    }
  }

  return <div className="app-shell"><a className="skip-link" href="#main-content" onClick={(event) => { event.preventDefault(); main.current?.focus(); }}>Langsung ke konten</a><aside className="sidebar"><button className="brand" onClick={() => navigate('home')} aria-label="Tata Surya Explorer 6, kembali ke beranda"><span className="brand-symbol"><Icon name="orbit" size={37} /><i /></span><span className="brand-wordmark"><strong>TATA SURYA</strong><small>EXPLORER <b>6</b></small></span></button><nav className="desktop-nav" aria-label="Navigasi utama">{['JELAJAHI', 'RUANG BELAJAR', 'PERJALANANMU'].map((group) => <div className="nav-group" key={group}><p className="nav-group-label">{group}</p>{navigation.filter((item) => item.group === group).map((item) => <button key={item.page} onClick={() => navigate(item.page)} className={`nav-item ${route.page === item.page ? 'active' : ''}`} aria-current={route.page === item.page ? 'page' : undefined} title={item.label}><Icon name={item.icon} size={19} /><span>{item.label}</span>{route.page === item.page && <i className="nav-active-dot" />}</button>)}</div>)}</nav><div className="sidebar-bottom"><button className="sidebar-progress" onClick={() => navigate('profile')} aria-label={`Profil ${progress.nickname}, level ${level.level}, ${progress.xp} XP`}><div className="sidebar-profile-top"><span className="sidebar-avatar"><Astronaut small /></span><span><strong>{progress.nickname}</strong><small>{level.name}</small></span><span className="level-label">LV. {level.level}</span></div><div className="sidebar-xp"><span>Progres level</span><strong>{progress.xp}<span> / {nextLevel?.min ?? 'MAX'} XP</span></strong></div><ProgressBar value={xpPercent} label="Progres level" /></button><button className={`teacher-nav ${route.page === 'teacher' ? 'active' : ''}`} onClick={() => navigate('teacher')} title="Mode Guru"><Icon name="teacher" size={20} /><span>Mode Guru</span><Icon name="external" size={14} /></button><p className="sidebar-curriculum"><span />IPAS FASE C <i />KELAS 6 SD</p></div></aside>
    <div className="main-shell"><header className="topbar"><div className="topbar-heading"><span className="topbar-breadcrumb"><Icon name="compass" size={14} />PUSAT KENDALI<Icon name="chevron" size={12} /></span><strong>{pageTitles[route.page]}</strong></div><button className="mobile-brand" onClick={() => navigate('home')} aria-label="Beranda Tata Surya Explorer 6"><Icon name="orbit" size={28} /><span>TATA SURYA<small>EXPLORER 6</small></span></button><div className="topbar-actions"><div className="streak-indicator" title="Hari belajar berturut-turut"><Icon name="flame" size={18} /><span><strong>{progress.streak}</strong> hari beruntun</span></div><span className="topbar-divider" /><button className="icon-button topbar-icon" onClick={toggleSound} aria-label={progress.sound ? 'Matikan suara' : 'Aktifkan suara'} aria-pressed={progress.sound} title={progress.sound ? 'Suara aktif' : 'Suara nonaktif'}><Icon name={progress.sound ? 'sound' : 'muted'} size={19} /></button><button className="icon-button topbar-icon help-topbar" onClick={() => setGuideOpen(true)} aria-label="Buka panduan aplikasi" title="Panduan"><Icon name="help" size={20} /></button><button className="topbar-avatar" onClick={() => navigate('profile')} aria-label={`Buka profil ${progress.nickname}`}><Astronaut small /><span /></button></div></header>{!storageAvailable && <div className="storage-banner"><Icon name="info" size={16} />Penyimpanan browser tidak tersedia. Progres hanya bertahan selama sesi ini.</div>}<main id="main-content" ref={main} tabIndex={-1} className={`main-content ${route.page === 'home' ? 'is-home' : ''}`}><AnimatePresence mode="wait" initial={false}><motion.div key={`${route.page}/${route.id ?? ''}`} className="page-transition" initial={{ opacity: 0, y: 9 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} transition={{ duration: 0.19 }}>{renderPage()}</motion.div></AnimatePresence></main><footer className="app-footer"><span><Icon name="orbit" size={15} />Semesta luas. Rasa ingin tahumu lebih luas.</span><button onClick={() => setSourcesOpen(true)}>Sumber & tentang<Icon name="external" size={12} /></button><span className="footer-curriculum">Kurikulum Merdeka / IPAS Fase C</span></footer></div>
    <nav className="bottom-nav" aria-label="Navigasi mobile">{[{ page: 'home' as Page, label: 'Beranda', icon: 'home' }, { page: 'explore' as Page, label: 'Eksplorasi', icon: 'compass' }, { page: 'materials' as Page, label: 'Belajar', icon: 'book' }, { page: 'quiz' as Page, label: 'Quiz', icon: 'target' }].map((item) => <button key={item.page} className={route.page === item.page ? 'active' : ''} onClick={() => navigate(item.page)} aria-current={route.page === item.page ? 'page' : undefined}><Icon name={item.icon} size={21} /><span>{item.label}</span></button>)}<button className={!['home', 'explore', 'materials', 'quiz'].includes(route.page) ? 'active' : ''} onClick={() => setMenuOpen(true)} aria-expanded={menuOpen} aria-label="Buka semua menu"><Icon name="menu" size={21} /><span>Lainnya</span></button></nav>
    <Modal open={menuOpen} onClose={() => setMenuOpen(false)} title="Ke mana kita menjelajah?" className="mobile-menu-modal"><nav className="mobile-menu-grid" aria-label="Semua halaman">{navigation.map((item) => <button key={item.page} className={route.page === item.page ? 'active' : ''} onClick={() => navigate(item.page)}><Icon name={item.icon} size={22} /><span>{item.label}</span></button>)}<button onClick={() => navigate('teacher')}><Icon name="teacher" size={22} /><span>Mode Guru</span></button></nav></Modal>
    <Modal open={guideOpen} onClose={() => setGuideOpen(false)} title="Halo, aku Astro!"><div className="guide-modal-intro"><Astronaut /><div><h3>Siap menjelajahi semesta?</h3><p>Jelajahi Tata Surya, Kenali Planet, dan Taklukkan Tantangannya!</p></div></div><ol className="guide-instructions"><li><span><Icon name="compass" /></span><div><strong>Jelajahi dengan rasa ingin tahu</strong><p>Geser peta, gunakan + dan - untuk zoom, lalu klik planet. Tombol panah keyboard juga dapat menggeser peta.</p></div></li><li><span><Icon name="book" /></span><div><strong>Amati dan pahami</strong><p>Buka profil planet atau ikuti materi terarah. Tulis refleksimu sebelum melanjutkan.</p></div></li><li><span><Icon name="rocket" /></span><div><strong>Taklukkan tantanganmu</strong><p>Kerjakan kuis dan mini game untuk meraih XP, badge, dan menyelesaikan misi. Tidak ada timer.</p></div></li></ol><div className="info-note"><Icon name="shield" size={19} /><p>Progres tersimpan otomatis di perangkat ini. Cukup gunakan nama panggilan. Suara bisa diaktifkan atau dimatikan kapan saja.</p></div><button className="button primary full-width" onClick={() => { setGuideOpen(false); navigate('explore'); }}>Ayo mulai eksplorasi<Icon name="right" size={18} /></button></Modal>
    <Modal open={sourcesOpen} onClose={() => setSourcesOpen(false)} title="Sumber & tentang aplikasi"><SourceContent /></Modal>
    <Modal open={celebrate} onClose={() => setCelebrate(false)} title="Mission Complete!"><div className="celebration-modal"><Astronaut /><h3>Hebat, {progress.nickname}!</h3><p>Kamu telah menyelesaikan kelima misi utama. Astro bangga dengan semangat belajarmu!</p><div><span><Icon name="zap" />{progress.xp} XP</span><span><Icon name="trophy" />{progress.badges.length} badge</span></div><button className="button primary full-width" onClick={() => { setCelebrate(false); navigate('complete'); }}>Lihat hasil perjalanan<Icon name="right" size={18} /></button></div></Modal><Toast />
  </div>;
}
