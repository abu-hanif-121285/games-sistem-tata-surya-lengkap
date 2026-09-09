import { useLearning } from '../state/LearningContext';
import { Icon, Modal } from './ui';

export function ResetProgress({ open, onClose, afterReset }: { open: boolean; onClose(): void; afterReset?(): void }) {
  const { reset } = useLearning();
  return <Modal open={open} onClose={onClose} title="Hapus semua progres?"><div className="reset-warning"><Icon name="trash" size={32} /><p>Nama panggilan, XP, level, badge, misi, refleksi, dan riwayat kuis pada perangkat ini akan dihapus.</p><strong>Tindakan ini tidak dapat dibatalkan.</strong></div><div className="modal-actions"><button className="button secondary" onClick={onClose}>Batal, simpan progres</button><button className="button danger" onClick={() => { reset(); onClose(); afterReset?.(); }}><Icon name="trash" size={17} />Ya, reset progres</button></div></Modal>;
}