import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { gameDefinitions } from '../data/gamification';
import { orbitingPlanets } from '../data/planets';
import { questions, shuffle, type Question } from '../data/questions';
import { useLearning } from '../state/LearningContext';
import type { Navigate } from '../types';
import { QuestionActivity } from '../components/QuestionActivity';
import { GuideNote, Icon, PageHeading, PlanetOrb, ProgressBar } from '../components/ui';

function createGame(id: string): Question[] {
  if (id === 'order') return [{ ...questions.find((question) => question.id === 'sort')!, id: 'game-order' }];
  if (id === 'match') return [{ ...questions.find((question) => question.id === 'match')!, id: 'game-match' }];
  if (id === 'guess') return shuffle(orbitingPlanets).slice(0, 4).map((planet) => ({ id: `guess-${planet.id}`, kind: 'choice', planet: planet.id, prompt: 'Amati ilustrasi planet ini. Siapa namanya?', options: shuffle([planet.name, ...shuffle(orbitingPlanets.filter((other) => other.id !== planet.id)).slice(0, 3).map((other) => other.name)]), answer: planet.name, explanation: `Ini adalah ${planet.name}. ${planet.characteristics[0]}`, difficulty: 1, lesson: 3 }));
  if (id === 'mission') return shuffle(orbitingPlanets).slice(0, 3).map((planet) => ({ id: `mission-${planet.id}`, kind: 'planet', prompt: `Misi Astro: temukan planet ke-${planet.order} dari Matahari!`, options: shuffle(orbitingPlanets.map((item) => item.id)), answer: planet.id, explanation: `${planet.name} adalah planet ke-${planet.order} dari Matahari. ${planet.characteristics[0]}`, difficulty: 2, lesson: 4 }));
  return shuffle(questions.filter((question) => ['choice', 'truefalse', 'planet'].includes(question.kind))).slice(0, 5);
}

export function GamesPage({ navigate, id }: { navigate: Navigate; id?: string }) {
  const { progress } = useLearning();
  const [attempt, setAttempt] = useState(0);
  if (id && gameDefinitions.some((game) => game.id === id)) return <GameSession key={`${id}-${attempt}`} id={id} navigate={navigate} restart={() => setAttempt((current) => current + 1)} />;
  return <div><PageHeading eyebrow="MAIN, AMATI, PAHAMI" title="Petualangan kecil. Penemuan besar." description="Lima cara seru untuk mengenal tata surya. Pilih permainanmu dan bantu Astro menyelesaikan misi." /><div className="games-grid">{gameDefinitions.map((game, index) => <motion.button key={game.id} className={`game-card game-color-${game.color}`} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.07 }} onClick={() => navigate('games', game.id)}><div className="game-art"><div className="game-art-orbit" />{game.id === 'order' ? <div className="game-mini-line">{['sun', 'mercury', 'earth', 'jupiter'].map((planet, i) => <PlanetOrb id={planet} size={[45, 19, 28, 47][i]} key={planet} />)}</div> : game.id === 'guess' ? <><PlanetOrb id="saturn" size={86} /><span className="game-question-mark">?</span></> : game.id === 'mission' ? <><PlanetOrb id="mars" size={80} /><Icon name="rocket" size={45} className="game-art-icon" /></> : game.id === 'match' ? <div className="game-match-art"><PlanetOrb id="earth" size={57} /><Icon name="link" size={32} /><PlanetOrb id="neptune" size={57} /></div> : <><PlanetOrb id="earth" size={83} /><Icon name="sparkles" size={37} className="game-art-icon" /></>}{progress.completedGames.includes(game.id) && <span className="game-completed"><Icon name="check" size={14} />Selesai</span>}</div><div className="game-card-body"><span className="eyebrow">{game.label}</span><h2>{game.name}</h2><p>{game.subtitle}</p><div className="game-card-bottom"><span><Icon name="zap" size={15} />{progress.completedGames.includes(game.id) ? 'Main lagi' : '+30 XP'}</span><span>Mulai bermain<Icon name="right" size={18} /></span></div></div></motion.button>)}</div><GuideNote title="Bermain tanpa terburu-buru">Kamu boleh mencoba lagi sampai berhasil. XP penyelesaian diberikan sekali untuk setiap permainan, tetapi kamu bisa berlatih sesering yang kamu mau.</GuideNote></div>;
}

function GameSession({ id, navigate, restart }: { id: string; navigate: Navigate; restart(): void }) {
  const { progress, completeGame } = useLearning();
  const game = gameDefinitions.find((item) => item.id === id)!;
  const [deck] = useState(() => createGame(id));
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const awarded = useRef(false);
  const alreadyCompleted = useRef(progress.completedGames.includes(id));

  function next() {
    if (index < deck.length - 1) setIndex(index + 1);
    else if (!awarded.current) {
      awarded.current = true;
      completeGame(id);
      setFinished(true);
    }
  }

  if (finished) return <div className="result-page game-result"><div className="result-medal cyan"><Icon name={game.icon} size={55} /><span>MISI PERMAINAN SELESAI</span></div><p className="eyebrow">{game.name.toUpperCase()}</p><h1>Misi berhasil, Penjelajah!</h1><p>Kamu terus mencoba, mengamati, dan menemukan jawabannya. Itulah semangat seorang penjelajah.</p><div className="result-stats"><div><strong>{score}</strong><span>Skor permainan</span></div><div><strong>{deck.length}</strong><span>Tantangan selesai</span></div><div><strong className="text-cyan">+{alreadyCompleted.current ? 0 : 30}</strong><span>XP diperoleh</span></div></div><p className="muted">{alreadyCompleted.current ? 'Ini latihan ulang. XP penyelesaian pertama sudah pernah kamu dapatkan.' : 'XP permainan dan progres misimu sudah tersimpan.'} Skor +10 untuk jawaban benar pada percobaan pertama.</p><div className="result-actions"><button className="button secondary" onClick={restart}><Icon name="reset" />Main lagi</button><button className="button primary" onClick={() => navigate('games')}><Icon name="game" />Permainan lainnya</button></div>{progress.missions.length === 5 && <button className="text-link" onClick={() => navigate('complete')}>Semua misi utama selesai. Lihat hasil perjalanan<Icon name="right" size={17} /></button>}</div>;

  return <div className="game-session"><div className="activity-topbar"><button className="back-link" onClick={() => navigate('games')}><Icon name="left" size={18} />Semua permainan</button><span><Icon name="star" size={17} />Skor: {score}</span></div><div className="game-session-heading"><div><p className="eyebrow">MINI GAMES</p><h1>{game.name}</h1></div><span>Tantangan {index + 1} / {deck.length}</span></div><ProgressBar value={index / deck.length * 100} label="Kemajuan permainan" />{id === 'mission' && <GuideNote title="Pesan misi dari Astro">Aku membutuhkan navigator hebat sepertimu! Baca nomor planet yang dicari, lalu pilih tujuan kita.</GuideNote>}<div className="quiz-question-wrap"><QuestionActivity key={deck[index].id} question={deck[index]} isLast={index === deck.length - 1} retryUntilCorrect onAnswer={(correct, firstAttempt) => { if (correct && firstAttempt) setScore((current) => current + 10); }} onNext={next} /></div><p className="quiz-mindful"><Icon name="shield" size={16} />Tanpa timer. Coba lagi sampai kamu memahami jawabannya.</p></div>;
}