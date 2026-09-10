import { motion } from 'framer-motion';
import { missionDefinitions } from '../data/gamification';
import { planetById } from '../data/planets';
import { useLearning } from '../state/LearningContext';
import { missionCounts } from '../state/gamification';
import type { Navigate, Page } from '../types';
import { Astronaut, Icon, PlanetOrb, ProgressBar, SectionHeading } from '../components/ui';

const shortcuts: { icon: string; label: string; caption: string; page: Page; color: string }[] = [
  { icon: 'compass', label: 'Eksplorasi', caption: 'Jelajahi tata surya', page: 'explore', color: 'cyan' },
  { icon: 'orbit', label: 'Kenali Planet', caption: 'Temukan dunia baru', page: 'planets', color: 'blue' },
  { icon: 'book', label: 'Belajar', caption: 'Tambah pengetahuan', page: 'materials', color: 'purple' },
  { icon: 'target', label: 'Quiz', caption: 'Uji kemampuanmu', page: 'quiz', color: 'amber' },
  { icon: 'game', label: 'Mini Games', caption: 'Bermain sambil belajar', page: 'games', color: 'green' },
];

export function HomePage({ navigate, openGuide }: { navigate: Navigate; openGuide(): void }) {
  const { progress } = useLearning();
  const missionIndex = missionDefinitions.findIndex((mission) => !progress.missions.includes(mission.id));
  const currentMission = missionDefinitions[missionIndex < 0 ? 4 : missionIndex];
  const count = missionCounts(progress)[missionIndex < 0 ? 4 : missionIndex];
  const missionTargets: { page: Page; id?: string }[] = [{ page: 'materials', id: '1' }, { page: 'planets' }, { page: 'materials' }, { page: 'games', id: 'order' }, { page: 'quiz' }];
  const target = missionTargets[missionIndex < 0 ? 4 : missionIndex];

  return <div className="home-page"><section className="home-hero" aria-label="Tata Surya Explorer 6"><img className="hero-image" src={`${import.meta.env.BASE_URL}images/solar-hero.png`} alt="Ilustrasi artistik Matahari, planet-planet, dan orbit di ruang angkasa. Tidak menggunakan skala sebenarnya." fetchPriority="high" /><div className="hero-shade" /><motion.div className="hero-copy" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}><p className="hero-eyebrow"><span />PETUALANGAN BESARMU DIMULAI DI SINI</p><h1>TATA SURYA<br /><span>EXPLORER 6</span></h1><p className="hero-subtitle">Jelajahi Tata Surya dengan<br className="desktop-break" /> Cara yang Menyenangkan!</p><div className="hero-actions"><button className="button primary hero-cta" onClick={() => navigate('explore')}><Icon name="rocket" size={19} />Mulai Eksplorasi<Icon name="right" size={19} /></button><button className="hero-guide-button" onClick={openGuide}><span><Icon name="play" size={14} /></span>Lihat panduan</button></div></motion.div><span className="hero-art-caption">Ilustrasi artistik, tidak berskala</span></section>
    <div className="home-body"><nav className="quick-actions" aria-label="Jalan pintas belajar">{shortcuts.map((shortcut, index) => <motion.button className={`quick-action accent-${shortcut.color}`} key={shortcut.page} onClick={() => navigate(shortcut.page)} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + index * 0.05 }}><span className="quick-icon"><Icon name={shortcut.icon} size={23} /></span><span className="quick-text"><strong>{shortcut.label}</strong><small>{shortcut.caption}</small></span><Icon name="chevron" size={16} className="quick-arrow" /></motion.button>)}</nav>
      <section className="home-missions"><SectionHeading title="Petualanganmu hari ini" description="Satu langkah kecil menuju penemuan besar."><button className="text-link" onClick={() => navigate('achievements', 'missions')}>Lihat semua misi<Icon name="right" size={16} /></button></SectionHeading><div className="home-mission-grid"><div className="welcome-guide"><div className="welcome-astronaut"><Astronaut /></div><div className="welcome-copy"><span className="eyebrow">KENALAN DENGAN ASTRO</span><h3>Selamat datang, {progress.nickname}!</h3><p>Ayo kita menjelajahi Tata Surya!<br />Aku Astro, teman di setiap penemuanmu.</p><button className="text-link" onClick={() => navigate('materials', 'guided')}>Yuk, mulai perjalanan kita<Icon name="right" size={16} /></button></div><span className="welcome-spark sparkle-one"><Icon name="sparkles" size={23} /></span></div><button className="home-mission-card" onClick={() => missionIndex < 0 ? navigate('complete') : navigate(target.page, target.id)}><div className="mission-card-top"><span><Icon name="target" size={14} />{missionIndex < 0 ? 'SEMUA MISI SELESAI' : `MISSION ${String(missionIndex + 1).padStart(2, '0')}`}</span><span className="mission-reward"><Icon name="zap" size={14} />+50 XP</span></div><h3>{missionIndex < 0 ? 'Kamu berhasil, Penjelajah!' : currentMission.name}</h3><p>{missionIndex < 0 ? 'Lihat kembali semua hal yang sudah kamu capai.' : currentMission.description}</p><div className="mission-card-progress"><ProgressBar value={count / currentMission.target * 100} label={`Progres misi ${currentMission.name}`} /><span>{Math.round(count / currentMission.target * 100)}%</span></div><div className="mission-card-bottom"><span>{missionIndex < 0 ? 'Lihat hasil perjalanan' : 'Mulai misi'}</span><Icon name="right" size={18} /></div></button></div></section>
      <section className="home-destinations"><SectionHeading title="Dunia mana yang ingin kamu kenali?" description="Ada cerita menarik di setiap sudut tata surya."><button className="text-link" onClick={() => navigate('planets')}>Semua planet<Icon name="right" size={16} /></button></SectionHeading><div className="destination-grid">{['earth', 'saturn', 'mars'].map((id) => {
        const planet = planetById(id);
        return <button className={`destination destination-${id}`} key={id} onClick={() => navigate('planets', id)}><div><span className="destination-order">PLANET KE-{planet.order}</span><h3>{planet.name}</h3><p>{id === 'earth' ? 'Kenali rumah biru kita.' : id === 'saturn' ? 'Di balik cincin yang indah.' : 'Misteri sang Planet Merah.'}</p><span className="destination-link">Jelajahi<Icon name="right" size={15} /></span></div><div className="destination-orb"><PlanetOrb id={id} size={id === 'saturn' ? 89 : 111} /></div></button>;
      })}</div></section>
    </div>
  </div>;
}
