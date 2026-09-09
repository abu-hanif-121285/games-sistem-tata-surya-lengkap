import { useEffect, useRef, useState, type PointerEvent } from 'react';
import { useReducedMotion } from 'framer-motion';
import { orbitingPlanets, planetById, planets } from '../data/planets';
import { useLearning } from '../state/LearningContext';
import type { Navigate } from '../types';
import { Icon, PageHeading, PlanetOrb } from './ui';

const radii = [90, 134, 177, 221, 280, 345, 411, 486];
const angles = [-0.7, 2.8, -2.1, 0.35, 2.45, 0.9, 3.35, -0.55];
const sizes = [19, 30, 36, 27, 76, 62, 44, 43];
const clampZoom = (zoom: number) => Math.max(0.6, Math.min(12, zoom));

export function ExplorationEngine({ navigate, initialPlanet }: { navigate: Navigate; initialPlanet?: string }) {
  const { progress } = useLearning();
  const reducedMotion = useReducedMotion();
  const [selected, setSelected] = useState<string | null>(initialPlanet && planets.some((planet) => planet.id === initialPlanet) ? initialPlanet : null);
  const [mode, setMode] = useState<'learning' | 'realistic'>('learning');
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [rotation, setRotation] = useState(0);
  const [showOrbits, setShowOrbits] = useState(true);
  const [playing, setPlaying] = useState(false);
  const [phase, setPhase] = useState(0);
  const [fit, setFit] = useState(1);
  const stage = useRef<HTMLDivElement>(null);
  const pointers = useRef(new Map<number, { x: number; y: number }>());
  const pinchDistance = useRef(0);

  useEffect(() => {
    const element = stage.current;
    if (!element) return;
    const observer = new ResizeObserver(([entry]) => setFit(Math.min(entry.contentRect.width / 1090, entry.contentRect.height / 640)));
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!playing || reducedMotion) return;
    const interval = window.setInterval(() => setPhase((current) => current + 0.004), 70);
    return () => window.clearInterval(interval);
  }, [playing, reducedMotion]);

  useEffect(() => {
    const element = stage.current;
    if (!element) return;
    const listener = (event: WheelEvent) => {
      event.preventDefault();
      setZoom((current) => clampZoom(current * (event.deltaY > 0 ? 0.92 : 1.08)));
    };
    element.addEventListener('wheel', listener, { passive: false });
    return () => element.removeEventListener('wheel', listener);
  }, []);

  const reset = () => { setZoom(1); setPan({ x: 0, y: 0 }); setRotation(0); setPhase(0); };
  const startDrag = (event: PointerEvent<HTMLDivElement>) => {
    if ((event.target as HTMLElement).closest('button')) return;
    pointers.current.set(event.pointerId, { x: event.clientX, y: event.clientY });
    event.currentTarget.setPointerCapture(event.pointerId);
    if (pointers.current.size === 2) {
      const [a, b] = [...pointers.current.values()];
      pinchDistance.current = Math.hypot(a.x - b.x, a.y - b.y);
    }
  };
  const drag = (event: PointerEvent<HTMLDivElement>) => {
    const old = pointers.current.get(event.pointerId);
    if (!old) return;
    pointers.current.set(event.pointerId, { x: event.clientX, y: event.clientY });
    if (pointers.current.size === 2) {
      const [a, b] = [...pointers.current.values()];
      const distance = Math.hypot(a.x - b.x, a.y - b.y);
      const ratio = pinchDistance.current > 0 ? distance / pinchDistance.current : 1;
      setZoom((current) => clampZoom(current * ratio));
      pinchDistance.current = distance;
    } else setPan((current) => ({ x: current.x + event.clientX - old.x, y: current.y + event.clientY - old.y }));
  };
  const endDrag = (event: PointerEvent<HTMLDivElement>) => {
    pointers.current.delete(event.pointerId);
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
    pinchDistance.current = 0;
  };
  const selectedPlanet = selected ? planetById(selected) : null;

  return <div className="exploration-page">
    <PageHeading eyebrow="PLANETARIUM INTERAKTIF" title="Semesta ada di tanganmu." description="Geser, perbesar, dan pilih sebuah planet. Tidak ada batas waktu untuk rasa ingin tahu." action={<button className="button secondary" onClick={() => navigate('planets', 'compare')}><Icon name="compare" />Bandingkan planet</button>} />
    <div className="explorer-toolbar"><div className="live-label"><span />Eksplorasi bebas</div><div className="segmented" aria-label="Mode skala"><button onClick={() => { setMode('learning'); reset(); }} className={mode === 'learning' ? 'active' : ''} aria-pressed={mode === 'learning'}>Pembelajaran</button><button onClick={() => { setMode('realistic'); reset(); }} className={mode === 'realistic' ? 'active' : ''} aria-pressed={mode === 'realistic'}>Realistis</button></div><button className={`button quiet orbit-toggle ${showOrbits ? 'active' : ''}`} onClick={() => setShowOrbits(!showOrbits)} aria-pressed={showOrbits}><Icon name="orbit" size={17} />Orbit</button></div>
    <div className={`explorer-workspace ${selectedPlanet ? 'has-selection' : ''}`}>
      <div className="space-stage" ref={stage} onPointerDown={startDrag} onPointerMove={drag} onPointerUp={endDrag} onPointerCancel={endDrag} tabIndex={0} aria-label="Peta tata surya interaktif. Geser dengan panah, gunakan plus dan minus untuk zoom, R untuk memutar, Home untuk mengatur ulang." onKeyDown={(event) => {
        if ((event.target as HTMLElement).closest('button')) return;
        if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', '+', '=', '-', 'r', 'R', 'Home'].includes(event.key)) event.preventDefault();
        if (event.key === '+' || event.key === '=') setZoom((current) => clampZoom(current * 1.2));
        if (event.key === '-') setZoom((current) => clampZoom(current / 1.2));
        if (event.key.toLowerCase() === 'r') setRotation((current) => current + 15);
        if (event.key === 'Home') reset();
        if (event.key.startsWith('Arrow')) setPan((current) => ({ x: current.x + (event.key === 'ArrowRight' ? 28 : event.key === 'ArrowLeft' ? -28 : 0), y: current.y + (event.key === 'ArrowDown' ? 28 : event.key === 'ArrowUp' ? -28 : 0) }));
      }}>
        <div className="stage-starfield" />
        <div className="solar-world" style={{ transform: `translate(calc(-50% + ${pan.x}px), calc(-50% + ${pan.y}px)) scale(${fit * zoom}) rotate(${rotation}deg)` }}>
          <svg className="orbit-map" viewBox="0 0 1100 660" aria-hidden="true">
            <defs><radialGradient id="sun-aura"><stop stopColor="#f4a229" stopOpacity=".17" /><stop offset="1" stopColor="#f4a229" stopOpacity="0" /></radialGradient></defs>
            <circle cx="550" cy="330" r={mode === 'learning' ? 170 : 55} fill="url(#sun-aura)" />
            {showOrbits && orbitingPlanets.map((planet, index) => <ellipse key={planet.id} cx="550" cy="330" rx={mode === 'learning' ? radii[index] : planet.distance / 4515 * 486} ry={(mode === 'learning' ? radii[index] : planet.distance / 4515 * 486) * 0.52} fill="none" stroke={planet.id === selected ? '#56cbe5' : '#284667'} strokeWidth={planet.id === selected ? 1.4 : 0.8} opacity={planet.id === selected ? 0.9 : 0.8} />)}
            {mode === 'learning' && Array.from({ length: 95 }, (_, index) => {
              const angle = index * 2.39996;
              const radius = 245 + ((index * 37) % 18);
              return <circle key={index} cx={550 + Math.cos(angle) * radius} cy={330 + Math.sin(angle) * radius * 0.52} r={0.5 + index % 3 * 0.4} fill="#b7a18a" opacity={0.2 + index % 4 * 0.12} />;
            })}
          </svg>
          <button className={`map-planet map-sun ${selected === 'sun' ? 'selected' : ''}`} style={{ left: 550, top: 330, transform: `translate(-50%, -50%) rotate(${-rotation}deg)` }} onClick={() => setSelected('sun')} aria-label="Pilih Matahari" aria-pressed={selected === 'sun'}><PlanetOrb id="sun" size={mode === 'learning' ? 91 : 22} /><span>Matahari</span></button>
          {orbitingPlanets.map((planet, index) => {
            const radius = mode === 'learning' ? radii[index] : planet.distance / 4515 * 486;
            const angle = angles[index] + phase * (9 - index) * 0.5;
            return <button key={planet.id} className={`map-planet ${planet.id === selected ? 'selected' : ''}`} style={{ left: 550 + Math.cos(angle) * radius, top: 330 + Math.sin(angle) * radius * 0.52, transform: `translate(-50%, -50%) rotate(${-rotation}deg)`, zIndex: planet.id === selected ? 10 : index + 1 }} aria-label={`Pilih ${planet.name}, planet ke-${planet.order}`} aria-pressed={selected === planet.id} onClick={() => setSelected(planet.id)}><PlanetOrb id={planet.id} size={mode === 'learning' ? sizes[index] : Math.max(11, sizes[index] * 0.42)} /><span>{planet.name}</span></button>;
          })}
        </div>
        <div className="map-help"><Icon name="move" size={15} /><span>Geser untuk menjelajah</span><i /><Icon name="pointer" size={14} /><span>Klik sebuah planet</span></div>
        <div className="map-controls" onPointerDown={(event) => event.stopPropagation()}>
          <div className="control-group"><button className="icon-button" aria-label="Perbesar tata surya" disabled={zoom >= 12} onClick={() => setZoom((current) => clampZoom(current * 1.25))}><Icon name="plus" /></button><span className="zoom-value">{Math.round(zoom * 100)}%</span><button className="icon-button" aria-label="Perkecil tata surya" disabled={zoom <= 0.6} onClick={() => setZoom((current) => clampZoom(current / 1.25))}><Icon name="minus" /></button></div>
          <div className="control-group"><button className="icon-button" aria-label="Putar tampilan ke kiri" onClick={() => setRotation((current) => current - 20)}><Icon name="reset" /></button><button className="icon-button" aria-label="Putar tampilan ke kanan" onClick={() => setRotation((current) => current + 20)}><Icon name="rotate" /></button><button className="icon-button" aria-label="Atur ulang tampilan" onClick={reset}><Icon name="maximize" /></button></div>
          <button className="icon-button play-orbits" onClick={() => setPlaying(!playing)} aria-label={playing ? 'Jeda animasi orbit' : 'Putar animasi orbit'} aria-pressed={playing} disabled={!!reducedMotion} title={reducedMotion ? 'Animasi mengikuti preferensi kurangi gerakan perangkat' : 'Kecepatan animasi disederhanakan'}><Icon name={playing ? 'pause' : 'play'} size={18} /></button>
        </div>
      </div>
      {selectedPlanet && <aside className="planet-info-sheet" aria-label={`Informasi ${selectedPlanet.name}`}><div className="sheet-top"><span className="eyebrow">OBJEK TERPILIH</span><button className="icon-button" aria-label="Tutup informasi planet" onClick={() => setSelected(null)}><Icon name="close" size={19} /></button></div><div className="sheet-planet"><PlanetOrb id={selectedPlanet.id} size={108} /></div><div className="sheet-heading"><h2>{selectedPlanet.name}</h2><span>{selectedPlanet.order ? `Planet ke-${selectedPlanet.order} dari Matahari` : 'Bintang di pusat tata surya'}</span></div><p>{selectedPlanet.tagline}</p><div className="sheet-type"><Icon name="layers" size={16} />{selectedPlanet.type}</div><p className="sheet-description">{selectedPlanet.description}</p><button className="button primary full-width" onClick={() => navigate('planets', selectedPlanet.id)}><Icon name="book" size={18} />Pelajari {selectedPlanet.name}<Icon name="right" size={18} /></button><small className="reward-note">{progress.visited.includes(selectedPlanet.id) ? 'Sudah kamu pelajari. Boleh dibaca lagi!' : selectedPlanet.order ? '+10 XP untuk penemuan pertamamu' : 'Kenali sumber energi tata surya'}</small></aside>}
    </div>
    <div className="planet-selector" aria-label="Pilih benda langit">{planets.map((planet) => <button key={planet.id} onClick={() => setSelected(planet.id)} className={selected === planet.id ? 'active' : ''} aria-pressed={selected === planet.id}><PlanetOrb id={planet.id} size={planet.id === 'sun' ? 31 : 27} /><span>{planet.name}</span>{progress.visited.includes(planet.id) && <Icon name="check" size={12} />}</button>)}</div>
    <div className="scale-note"><Icon name="info" size={18} /><p>{mode === 'learning' ? 'Ukuran dan jarak pada mode pembelajaran tidak dibuat dalam skala sebenarnya agar semua planet mudah diamati.' : 'Jarak orbit relatif mengikuti jarak rata-rata sebenarnya. Ukuran planet tetap diperbesar agar dapat dipilih. Planet dalam berdekatan; gunakan zoom atau daftar planet.'}<span> Orbit disederhanakan, bukan posisi saat ini. Kecepatan animasi bukan kecepatan sebenarnya.</span></p></div>
  </div>;
}