import { useEffect, useRef, type CSSProperties, type ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowDown, ArrowLeft, ArrowLeftRight, ArrowRight, ArrowUp, Award, BookOpen, Check, CheckCheck, ChevronDown, ChevronLeft, ChevronRight, CircleHelp, Compass, Download, Earth, ExternalLink, Eye, Flame, Gamepad2, GraduationCap, GripVertical, Home, Info, Layers, Link2, LockKeyhole, Maximize, Menu, Minus, Moon, MousePointer2, Move, Orbit, Pause, Play, Plus, Rocket, RotateCcw, RotateCw, ScanEye, Settings2, ShieldCheck, Sparkles, Star, Sun, Target, Telescope, Trash2, Trophy, UserRound, Volume2, VolumeX, X, Zap, type LucideIcon } from 'lucide-react';
import { planetById, sources } from '../data/planets';
import { useLearning } from '../state/LearningContext';

const icons: Record<string, LucideIcon> = {
  home: Home, compass: Compass, orbit: Orbit, book: BookOpen, target: Target, game: Gamepad2, trophy: Trophy, user: UserRound,
  rocket: Rocket, star: Star, sparkles: Sparkles, sun: Sun, moon: Moon, earth: Earth, zap: Zap, flame: Flame, teacher: GraduationCap,
  sound: Volume2, muted: VolumeX, help: CircleHelp, right: ArrowRight, left: ArrowLeft, down: ArrowDown, up: ArrowUp, chevron: ChevronRight,
  'chevron-left': ChevronLeft, 'chevron-down': ChevronDown, check: Check, checks: CheckCheck, close: X, play: Play, pause: Pause, plus: Plus, minus: Minus,
  rotate: RotateCw, reset: RotateCcw, move: Move, pointer: MousePointer2, compare: ArrowLeftRight, layers: Layers, info: Info,
  external: ExternalLink, lock: LockKeyhole, shield: ShieldCheck, award: Award, grip: GripVertical, scan: ScanEye, link: Link2,
  telescope: Telescope, menu: Menu, settings: Settings2, download: Download, trash: Trash2, maximize: Maximize, eye: Eye,
};

export function Icon({ name, size = 20, className = '' }: { name: string; size?: number; className?: string }) {
  const Component = icons[name] ?? Orbit;
  return <Component size={size} strokeWidth={1.75} className={className} aria-hidden="true" />;
}

export function PlanetOrb({ id, size = 64, spinning = false, className = '' }: { id: string; size?: number; spinning?: boolean; className?: string }) {
  const planet = planetById(id);
  const texture = id === 'earth' || id === 'sun'
    ? `https://raw.githubusercontent.com/homer-jay/solar-system-textures/master/${planet.texture}.jpg`
    : `https://www.solarsystemscope.com/textures/download/2k_${planet.texture}.jpg`;
  return <span className={`planet-orb planet-${id} ${spinning ? 'is-spinning' : ''} ${className}`} style={{ '--orb-size': `${size}px`, '--planet-color': planet.color } as CSSProperties} aria-hidden="true">
    {id === 'saturn' && <span className="saturn-ring ring-back" />}
    <span className="orb-surface">
      {id === 'earth' && <svg className="earth-fallback" viewBox="0 0 100 100"><path d="M19 7 37 6 45 14 39 25 46 34 38 45 26 38 21 29 11 25 8 17ZM39 46 51 49 56 64 48 79 44 96 36 83 33 64ZM62 12 81 8 97 28 85 36 71 34 65 45 51 34 52 21ZM64 43 80 45 87 60 78 76 66 70 58 54ZM88 76 98 73 99 87 89 89Z" fill="#70a885" /></svg>}
      <img src={texture} alt="" className="planet-texture" loading="lazy" draggable={false} onError={(event) => { event.currentTarget.style.display = 'none'; }} />
      <span className="orb-shade" />
    </span>
    {id === 'saturn' && <span className="saturn-ring ring-front" />}
  </span>;
}

export function Astronaut({ className = '', small = false }: { className?: string; small?: boolean }) {
  return <img src="/images/astronaut.png" alt={small ? '' : 'Astro, pemandu astronaut ramah'} className={`astronaut ${small ? 'astronaut-small' : ''} ${className}`} draggable={false} />;
}

export function ProgressBar({ value, label, className = '' }: { value: number; label: string; className?: string }) {
  const safe = Math.max(0, Math.min(100, value));
  return <div className={`progress-track ${className}`} role="progressbar" aria-valuenow={Math.round(safe)} aria-valuemin={0} aria-valuemax={100} aria-label={label}><span style={{ width: `${safe}%` }} /></div>;
}

export function PageHeading({ eyebrow, title, description, action }: { eyebrow?: string; title: string; description: string; action?: ReactNode }) {
  return <div className="page-heading"><div>{eyebrow && <p className="eyebrow">{eyebrow}</p>}<h1>{title}</h1><p className="page-description">{description}</p></div>{action && <div className="heading-action">{action}</div>}</div>;
}

export function SectionHeading({ title, description, children }: { title: string; description?: string; children?: ReactNode }) {
  return <div className="section-heading"><div><h2>{title}</h2>{description && <p>{description}</p>}</div>{children}</div>;
}

export function Modal({ open, onClose, title, children, className = '' }: { open: boolean; onClose(): void; title: string; children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
    if (!open) return;
    const oldOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = oldOverflow; };
  }, [open]);
  return <dialog ref={ref} className={`modal ${className}`} onCancel={(event) => { event.preventDefault(); onClose(); }} onClick={(event) => { if (event.target === event.currentTarget) onClose(); }} aria-label={title}>
    <div className="modal-inner"><header className="modal-header"><h2>{title}</h2><button className="icon-button" onClick={onClose} aria-label="Tutup dialog"><Icon name="close" /></button></header>{children}</div>
  </dialog>;
}

export function GuideNote({ title = 'Pesan dari Astro', children }: { title?: string; children: ReactNode }) {
  return <div className="guide-note"><Astronaut small /><div><strong>{title}</strong><p>{children}</p></div></div>;
}

export function Toast() {
  const { notice, dismissNotice } = useLearning();
  return <div className="toast-region" aria-live="polite" aria-atomic="true"><AnimatePresence>{notice && <motion.div key={notice.id} className={`toast toast-${notice.kind}`} initial={{ opacity: 0, x: 36, y: 8 }} animate={{ opacity: 1, x: 0, y: 0 }} exit={{ opacity: 0, x: 30 }}>
    <Astronaut small /><div><strong>{notice.title}</strong><p>{notice.message}</p></div><button className="icon-button" onClick={dismissNotice} aria-label="Tutup notifikasi"><Icon name="close" size={17} /></button>
  </motion.div>}</AnimatePresence></div>;
}

export function SourceContent() {
  return <div className="source-content"><p className="muted">Materi berfokus pada konsep dasar IPAS Fase C. Baca sumber ilmiah di bawah untuk menelusuri faktanya.</p>{sources.map((source) => <a href={source.url} key={source.title} target="_blank" rel="noreferrer" className="source-link"><span><strong>{source.title}</strong><small>{source.note}</small></span><Icon name="external" size={18} /></a>)}<div className="info-note"><Icon name="info" /><p>Gambar beranda dan Astro merupakan ilustrasi artistik. Model interaktif menyederhanakan orbit; warna, ukuran tampilan, dan kecepatan animasi bukan pengukuran langsung. Mode realistis menggunakan perbandingan jarak rata-rata, bukan posisi planet saat ini.</p></div></div>;
}