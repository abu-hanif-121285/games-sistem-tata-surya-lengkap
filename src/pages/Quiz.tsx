import { useRef, useState } from 'react';
import { questions, shuffle, type Question } from '../data/questions';
import { useLearning } from '../state/LearningContext';
import type { QuizResult } from '../state/storage';
import type { Navigate } from '../types';
import { QuestionActivity } from '../components/QuestionActivity';
import { Astronaut, GuideNote, Icon, Modal, PageHeading, ProgressBar } from '../components/ui';

export function QuizPage({ navigate, challenge = false }: { navigate: Navigate; challenge?: boolean }) {
  const { progress, recordAnswer, recordQuiz } = useLearning();
  const [phase, setPhase] = useState<'setup' | 'playing' | 'result'>('setup');
  const [mode, setMode] = useState(challenge ? 'challenge' : 'practice');
  const [difficulty, setDifficulty] = useState<1 | 2 | 3>(challenge ? 3 : 2);
  const [scope, setScope] = useState('all');
  const [deck, setDeck] = useState<Question[]>([]);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<QuizResult['answers']>([]);
  const [confirmExit, setConfirmExit] = useState(false);
  const finished = useRef(false);
  const pool = questions.filter((question) => question.difficulty <= difficulty && (scope === 'all' || progress.completedLessons.includes(question.lesson)));
  const count = Math.min([5, 8, 10][difficulty - 1], pool.length);
  const correct = answers.filter((answer) => answer.correct).length;
  const score = deck.length ? Math.round(correct / deck.length * 100) : 0;

  function start() {
    if (!pool.length) return;
    const shuffled = shuffle(pool);
    const kinds = new Set<string>();
    const varied = shuffled.filter((question) => { if (kinds.has(question.kind)) return false; kinds.add(question.kind); return true; });
    const highestTier = shuffled.filter((question) => question.difficulty === difficulty).slice(0, 2);
    const required = [...new Set([...varied, ...highestTier])];
    const rest = shuffled.filter((question) => !required.includes(question));
    const selected = [...required, ...rest].slice(0, count);
    if (mode === 'challenge') selected.sort((a, b) => a.difficulty - b.difficulty);
    setDeck(selected); setAnswers([]); setIndex(0); setPhase('playing'); finished.current = false;
  }
  function next() {
    if (index < deck.length - 1) setIndex(index + 1);
    else if (!finished.current) {
      finished.current = true;
      recordQuiz({ correct, total: deck.length, score, difficulty: `${mode === 'challenge' ? 'Challenge' : 'Latihan'} - ${['Mudah', 'Sedang', 'Sulit'][difficulty - 1]}`, answers });
      setPhase('result');
    }
  }

  if (phase === 'result') return <div className="result-page"><div className={`result-medal ${score >= 70 ? 'gold' : 'cyan'}`}><Icon name={score >= 90 ? 'trophy' : score >= 70 ? 'award' : 'star'} size={57} /><span>{score >= 90 ? 'MASTER TATA SURYA' : score >= 70 ? 'AHLI PLANET' : 'PENJELAJAH PEMULA'}</span></div><p className="eyebrow">PERJALANAN KUIS SELESAI</p><h1>{score >= 70 ? 'Luar biasa, Penjelajah!' : 'Satu langkah lebih pintar!'}</h1><p>{score >= 70 ? 'Rasa ingin tahumu membawamu semakin jauh. Pertahankan semangat belajarmu!' : 'Setiap percobaan adalah kesempatan belajar. Ayo baca kembali materinya, lalu coba lagi.'}</p><div className="result-stats"><div><strong>{correct * 10}</strong><span>Skor</span></div><div><strong className="text-green">{correct}</strong><span>Benar</span></div><div><strong>{deck.length - correct}</strong><span>Salah</span></div><div><strong className="text-cyan">{score}%</strong><span>Ketepatan</span></div></div><div className="result-xp"><Icon name="zap" size={18} />Kamu mendapatkan {correct * 10} XP dari jawaban benar.</div>{answers.some((answer) => !answer.correct) && <div className="review-suggestions"><h3>Yuk, pelajari kembali</h3><div>{[...new Set(answers.filter((answer) => !answer.correct).map((answer) => answer.lesson))].map((lesson) => <button className="button secondary" onClick={() => navigate('materials', String(lesson))} key={lesson}><Icon name="book" size={16} />Materi {lesson}<Icon name="right" size={15} /></button>)}</div></div>}<div className="result-actions"><button className="button secondary" onClick={() => setPhase('setup')}><Icon name="reset" />Coba lagi</button><button className="button primary" onClick={() => navigate(progress.missions.length === 5 ? 'complete' : 'achievements')}><Icon name="trophy" />{progress.missions.length === 5 ? 'Lihat hasil perjalanan' : 'Lihat pencapaian'}</button></div><small>Hasil kuis disimpan di perangkat ini. Nilai terbaikmu: {progress.bestQuiz}%.</small></div>;

  if (phase === 'playing') return <div className="quiz-play-page"><div className="activity-topbar"><button className="back-link" onClick={() => setConfirmExit(true)}><Icon name="left" size={18} />Keluar kuis</button><span><Icon name="zap" size={16} />{correct * 10} XP</span></div><div className="quiz-progress-heading"><span>{mode === 'challenge' ? 'TANTANGAN ASTRONAUT' : 'UJIAN ASTRONAUT'}</span><strong>Soal {index + 1} <span>/ {deck.length}</span></strong></div><ProgressBar value={(index + 1) / deck.length * 100} label="Kemajuan soal kuis" /><div className="quiz-question-wrap"><QuestionActivity key={deck[index].id} question={deck[index]} isLast={index === deck.length - 1} showXP onAnswer={(isCorrect, first) => { if (!first) return; setAnswers((current) => [...current, { questionId: deck[index].id, correct: isCorrect, lesson: deck[index].lesson }]); recordAnswer(isCorrect); }} onNext={next} /></div><p className="quiz-mindful"><Icon name="sparkles" size={15} />Tidak perlu terburu-buru. Amati dan pikirkan jawabanmu.</p><Modal open={confirmExit} onClose={() => setConfirmExit(false)} title="Keluar dari kuis?"><p className="modal-copy">XP yang sudah kamu dapatkan tetap tersimpan. Nilai akhir hanya tersimpan setelah semua soal selesai.</p><div className="modal-actions"><button className="button secondary" onClick={() => setConfirmExit(false)}>Lanjutkan kuis</button><button className="button primary" onClick={() => { setConfirmExit(false); setPhase('setup'); }}>Keluar</button></div></Modal></div>;

  return <div><PageHeading eyebrow="UJI RASA INGIN TAHUMU" title="Siap menjadi astronaut cerdas?" description="Bukan tentang siapa yang tercepat. Ini tentang hal baru yang kamu pahami." /><div className="quiz-setup"><div className="quiz-setup-visual"><div className="quiz-visual-orbit" /><Astronaut /><span className="quiz-visual-star star-a"><Icon name="sparkles" size={33} /></span><span className="quiz-visual-star star-b"><Icon name="star" size={22} /></span><p>"Aku percaya kamu bisa!"<span>ASTRO, PEMANDU MISIMU</span></p></div><div className="quiz-setup-form"><div className="segmented quiz-mode"><button className={mode === 'practice' ? 'active' : ''} onClick={() => setMode('practice')} aria-pressed={mode === 'practice'}><Icon name="book" size={17} />Latihan</button><button className={mode === 'challenge' ? 'active' : ''} onClick={() => setMode('challenge')} aria-pressed={mode === 'challenge'}><Icon name="flame" size={17} />Challenge</button></div><h2>{mode === 'challenge' ? 'Taklukkan tantangan antariksa.' : 'Periksa bekal pengetahuanmu.'}</h2><p>{mode === 'challenge' ? 'Soal dimulai dari yang mudah dan meningkat bertahap. Siap menjadi Master Tata Surya?' : 'Beragam jenis soal, petunjuk setelah mencoba, dan +10 XP untuk setiap jawaban benar.'}</p><fieldset className="difficulty-field"><legend>Pilih tingkat tantangan</legend><div className="difficulty-options">{([1, 2, 3] as const).map((level) => <button key={level} className={difficulty === level ? 'active' : ''} onClick={() => setDifficulty(level)} aria-pressed={difficulty === level}><span>{Array.from({ length: level }, (_, i) => <Icon key={i} name="star" size={15} />)}</span><strong>{['Mudah', 'Sedang', 'Sulit'][level - 1]}</strong><small>{['Konsep dasar', 'Hubungkan konsep', 'Pikirkan lebih jauh'][level - 1]}</small></button>)}</div></fieldset><label className="field-label">Cakupan materi<select value={scope} onChange={(event) => setScope(event.target.value)}><option value="all">Seluruh materi tata surya</option><option value="learned">Materi yang sudah kupelajari ({progress.completedLessons.length}/7)</option></select></label>{count === 0 ? <p className="form-warning">Belum ada soal untuk materi yang selesai. <button className="text-link" onClick={() => navigate('materials')}>Belajar dulu</button> atau pilih seluruh materi.</p> : <div className="quiz-setup-meta"><span><Icon name="target" size={16} />{count} pertanyaan</span><span><Icon name="shield" size={16} />Tanpa batas waktu</span></div>}<button className="button primary full-width" disabled={count === 0} onClick={start}><Icon name="rocket" />{mode === 'challenge' ? 'Mulai Challenge' : 'Mulai Quiz'}<Icon name="right" /></button></div></div><GuideNote title="Belajar itu sebuah perjalanan">Jawaban salah bukan akhir petualangan. Baca penjelasannya, pahami kembali, lalu lanjutkan. Semua penjelajah hebat pernah belajar dari kesalahan.</GuideNote></div>;
}