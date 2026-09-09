import { useState } from 'react';
import { planetById } from '../data/planets';
import { Icon, PlanetOrb } from './ui';

export function OrderActivity({ value, onChange, disabled = false }: { value: string[]; onChange(value: string[]): void; disabled?: boolean }) {
  const [dragged, setDragged] = useState<string | null>(null);
  const [announcement, setAnnouncement] = useState('');
  function move(from: number, to: number) {
    if (disabled || from < 0 || to < 0 || to >= value.length || from === to) return;
    const next = [...value];
    const [id] = next.splice(from, 1);
    next.splice(to, 0, id);
    onChange(next);
    setAnnouncement(`${planetById(id).name} dipindahkan ke urutan ${to + 1}.`);
  }
  return <div className="order-activity"><p className="activity-hint"><Icon name="grip" size={17} />Seret planet ke posisi baru, atau gunakan tombol panah.</p><div className="order-sun"><Icon name="sun" size={24} /><span>DARI MATAHARI</span><Icon name="right" size={18} /></div><ol className="order-grid">{value.map((id, index) => <li key={id} className={`order-item ${dragged === id ? 'dragging' : ''}`} draggable={!disabled} onDragStart={(event) => { event.dataTransfer.setData('text/plain', id); event.dataTransfer.effectAllowed = 'move'; setDragged(id); }} onDragEnd={() => setDragged(null)} onDragOver={(event) => { if (!disabled) { event.preventDefault(); event.dataTransfer.dropEffect = 'move'; } }} onDrop={(event) => { event.preventDefault(); move(value.indexOf(event.dataTransfer.getData('text/plain')), index); setDragged(null); }}><span className="order-position">{index + 1}</span><Icon name="grip" size={16} className="order-grip" /><PlanetOrb id={id} size={42} /><strong>{planetById(id).name}</strong><div className="order-arrows"><button disabled={disabled || index === 0} className="icon-button" aria-label={`Pindahkan ${planetById(id).name} lebih dekat ke Matahari`} onClick={() => move(index, index - 1)}><Icon name="left" size={16} /></button><button disabled={disabled || index === value.length - 1} className="icon-button" aria-label={`Pindahkan ${planetById(id).name} lebih jauh dari Matahari`} onClick={() => move(index, index + 1)}><Icon name="right" size={16} /></button></div></li>)}</ol><span className="sr-only" aria-live="polite">{announcement}</span></div>;
}