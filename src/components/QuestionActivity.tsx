import { useMemo, useRef, useState } from 'react';
import { planetById, planetOrder } from '../data/planets';
import { questionLabels, shuffle, type Question } from '../data/questions';
import { useLearning } from '../state/LearningContext';
import { Icon, PlanetOrb } from './ui';
import { OrderActivity } from './OrderActivity';

interface Props {
  question: Question;
  onAnswer(correct: boolean, firstAttempt: boolean): void;
  onNext(): void;
  isLast: boolean;
  retryUntilCorrect?: boolean;
  showXP?: boolean;
}

export function QuestionActivity({ question, onAnswer, onNext, isLast, retryUntilCorrect = false, showXP = false }: Props) {
  const { feedback, notify } = useLearning();
  const [selection, setSelection] = useState('');
  const [result, setResult] = useState<boolean | null>(null);
  const [assignments, setAssignments] = useState<Record<string, string>>({});
  const [activeDrop, setActiveDrop] = useState<string | null>(null);
  const [order, setOrder] = useState(() => {
    const shuffled = shuffle(planetOrder);
    return shuffled.every((id, index) => id === planetOrder[index]) ? [...shuffled.slice(1), shuffled[0]] : shuffled;
  });
  const attempted = useRef(false);
  const matchOptions = useMemo(() => shuffle([...new Set(question.pairs?.map((pair) => pair.answer) ?? [])]), [question.pairs]);
  const locked = result !== null;

  function submit(correct: boolean) {
    if (locked) return;
    setResult(correct);
    feedback(correct);
    onAnswer(correct, !attempted.current);
    attempted.current = true;
  }
  function choose(value: string) {
    if (locked) return;
    setSelection(value);
    submit(value === question.answer);
  }
  function assign(id: string, group: string) {
    if (locked || !question.pairs?.some((pair) => pair.label === id)) return;
    setAssignments((current) => ({ ...current, [id]: group }));
    setActiveDrop(null);
  }

  return <div className="question-activity"><div className="question-kind"><Icon name={question.kind === 'sort' ? 'orbit' : question.kind === 'match' || question.kind === 'drop' ? 'link' : 'target'} size={16} />{questionLabels[question.kind]}<span>{['Mudah', 'Sedang', 'Sulit'][question.difficulty - 1]}</span></div><h2 className="question-prompt">{question.prompt}</h2>
    {question.planet && <div className="guess-orb" role="img" aria-label={`Ilustrasi planet. Petunjuk: ${planetById(question.planet).characteristics[0]}`}><PlanetOrb id={question.planet} size={140} spinning /></div>}
    {(question.kind === 'choice' || question.kind === 'truefalse') && <div className={`answer-options ${question.kind === 'truefalse' ? 'binary-options' : ''}`}>{question.options?.map((option, index) => <button key={option} className={`answer-option ${selection === option ? result ? 'is-correct' : 'is-wrong' : ''}`} onClick={() => choose(option)} disabled={locked} aria-pressed={selection === option}><span className="option-letter">{String.fromCharCode(65 + index)}</span><span>{option}</span>{selection === option && locked && <Icon name={result ? 'check' : 'close'} size={20} />}</button>)}</div>}
    {question.kind === 'planet' && <div className="planet-answer-grid">{question.options?.map((id) => <button key={id} className={`planet-answer ${selection === id ? result ? 'is-correct' : 'is-wrong' : ''}`} onClick={() => choose(id)} disabled={locked} aria-pressed={selection === id}><PlanetOrb id={id} size={64} /><strong>{planetById(id).name}</strong>{selection === id && locked && <Icon name={result ? 'check' : 'close'} size={19} />}</button>)}</div>}
    {question.kind === 'sort' && <OrderActivity value={order} onChange={setOrder} disabled={locked} />}
    {question.kind === 'match' && <div className="matching-activity"><p className="activity-hint">Pilih karakteristik yang sesuai untuk setiap planet.</p>{question.pairs?.map((pair) => <div className="match-row" key={pair.label}><strong>{pair.label}</strong><Icon name="link" size={18} /><label className="sr-only" htmlFor={`match-${question.id}-${pair.label}`}>Karakteristik {pair.label}</label><select id={`match-${question.id}-${pair.label}`} value={assignments[pair.label] ?? ''} disabled={locked} onChange={(event) => setAssignments((current) => ({ ...current, [pair.label]: event.target.value }))}><option value="">Pilih karakteristik...</option>{matchOptions.map((option) => <option key={option} value={option}>{option}</option>)}</select></div>)}</div>}
    {question.kind === 'drop' && <div className="drop-activity"><p className="activity-hint">Seret planet ke kelompoknya. Kamu juga bisa mengetuk planet lalu kelompok, atau memakai pilihan di bawah planet.</p><div className="drop-planets">{question.pairs?.map((pair) => <div key={pair.label} className={`drop-planet ${activeDrop === pair.label ? 'active' : ''}`}><button draggable={!locked} disabled={locked} onDragStart={(event) => event.dataTransfer.setData('text/plain', pair.label)} onClick={() => setActiveDrop(pair.label)} aria-pressed={activeDrop === pair.label}><PlanetOrb id={pair.label} size={40} /><strong>{planetById(pair.label).name}</strong></button><select aria-label={`Jenis ${planetById(pair.label).name}`} value={assignments[pair.label] ?? ''} disabled={locked} onChange={(event) => assign(pair.label, event.target.value)}><option value="">Pilih kelompok</option>{question.options?.map((option) => <option key={option} value={option}>{option}</option>)}</select></div>)}</div><div className="drop-buckets">{question.options?.map((group) => <button key={group} className={`drop-bucket ${activeDrop ? 'ready' : ''}`} disabled={locked} onClick={() => { if (activeDrop) assign(activeDrop, group); else notify('Pilih planet terlebih dahulu', 'Ketuk sebuah planet, lalu ketuk kelompok yang kamu pilih.', 'guide'); }} onDragOver={(event) => { if (!locked) event.preventDefault(); }} onDrop={(event) => { event.preventDefault(); assign(event.dataTransfer.getData('text/plain'), group); }}><Icon name="layers" /><strong>{group}</strong><span>{question.pairs?.filter((pair) => assignments[pair.label] === group).map((pair) => planetById(pair.label).name).join(', ') || 'Letakkan planet di sini'}</span></button>)}</div></div>}
    {!locked && ['sort', 'match', 'drop'].includes(question.kind) && <div className="check-answer-row"><button className="button primary" disabled={question.kind !== 'sort' && !question.pairs?.every((pair) => assignments[pair.label])} onClick={() => submit(question.kind === 'sort' ? order.every((id, index) => id === planetOrder[index]) : !!question.pairs?.every((pair) => assignments[pair.label] === pair.answer))}><Icon name="check" size={18} />Periksa jawaban</button></div>}
    {locked && <div className={`answer-feedback ${result ? 'correct' : 'incorrect'}`} role="status"><div className="feedback-title"><Icon name={result ? 'rocket' : 'telescope'} size={23} /><strong>{result ? 'Hebat! Jawabanmu benar!' : 'Belum tepat. Yuk, perhatikan kembali petunjuknya.'}</strong>{result && showXP && <span>+10 XP</span>}</div><p>{question.explanation}</p><div className="feedback-action">{!result && retryUntilCorrect ? <button className="button secondary" onClick={() => { setResult(null); setSelection(''); }}><Icon name="reset" size={17} />Coba lagi</button> : <button className="button primary" onClick={onNext}>{isLast ? 'Lihat hasil' : 'Lanjut'}<Icon name="right" size={17} /></button>}</div></div>}
  </div>;
}