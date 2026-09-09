export type QuestionKind = 'choice' | 'truefalse' | 'planet' | 'match' | 'sort' | 'drop';
export interface Question {
  id: string;
  kind: QuestionKind;
  prompt: string;
  options?: string[];
  answer?: string;
  planet?: string;
  pairs?: { label: string; answer: string }[];
  items?: string[];
  explanation: string;
  difficulty: 1 | 2 | 3;
  lesson: number;
}

export const questions: Question[] = [
  { id: 'center', kind: 'choice', prompt: 'Benda langit apa yang menjadi pusat peredaran planet dalam tata surya?', options: ['Bumi', 'Bulan', 'Matahari', 'Jupiter'], answer: 'Matahari', explanation: 'Matahari adalah bintang di pusat tata surya. Gravitasi Matahari menjaga planet-planet tetap mengorbit.', difficulty: 1, lesson: 1 },
  { id: 'earth', kind: 'planet', prompt: 'Pilih planet ketiga dari Matahari, tempat kita tinggal.', options: ['mars', 'venus', 'earth', 'neptune'], answer: 'earth', explanation: 'Bumi berada pada urutan ketiga, setelah Merkurius dan Venus.', difficulty: 1, lesson: 4 },
  { id: 'sun-star', kind: 'truefalse', prompt: 'Matahari adalah planet yang paling besar.', options: ['Benar', 'Salah'], answer: 'Salah', explanation: 'Matahari adalah bintang, bukan planet. Bintang menghasilkan cahaya sendiri.', difficulty: 1, lesson: 2 },
  { id: 'largest', kind: 'choice', prompt: 'Planet manakah yang paling besar dalam tata surya?', options: ['Bumi', 'Jupiter', 'Saturnus', 'Neptunus'], answer: 'Jupiter', explanation: 'Jupiter adalah planet terbesar. Saturnus berada di urutan kedua berdasarkan ukuran.', difficulty: 1, lesson: 5 },
  { id: 'rotation', kind: 'choice', prompt: 'Apa yang menyebabkan terjadinya siang dan malam di Bumi?', options: ['Rotasi Bumi', 'Revolusi Bumi', 'Bulan menutupi Matahari', 'Matahari mengelilingi Bumi'], answer: 'Rotasi Bumi', explanation: 'Bumi berputar pada sumbunya. Bagian yang menghadap Matahari mengalami siang; bagian lainnya mengalami malam.', difficulty: 1, lesson: 6 },
  { id: 'match', kind: 'match', prompt: 'Pasangkan planet dengan ciri khasnya.', pairs: [{ label: 'Mars', answer: 'Planet Merah' }, { label: 'Saturnus', answer: 'Cincin paling mencolok' }, { label: 'Uranus', answer: 'Sumbu putar sangat miring' }], explanation: 'Mars tampak merah, Saturnus memiliki cincin paling mencolok, dan sumbu putar Uranus sangat miring.', difficulty: 2, lesson: 5 },
  { id: 'hot', kind: 'choice', prompt: 'Mengapa Venus lebih panas daripada Merkurius?', options: ['Venus lebih dekat ke Matahari', 'Atmosfer Venus memerangkap panas', 'Venus adalah bintang', 'Venus tidak berputar'], answer: 'Atmosfer Venus memerangkap panas', explanation: 'Atmosfer tebal Venus menahan panas melalui efek rumah kaca. Jarak ke Matahari bukan satu-satunya penentu suhu.', difficulty: 2, lesson: 5 },
  { id: 'sort', kind: 'sort', prompt: 'Urutkan delapan planet dari yang terdekat dengan Matahari.', explanation: 'Urutannya: Merkurius, Venus, Bumi, Mars, Jupiter, Saturnus, Uranus, Neptunus.', difficulty: 2, lesson: 4 },
  { id: 'drop', kind: 'drop', prompt: 'Kelompokkan setiap planet berdasarkan jenisnya.', pairs: [{ label: 'earth', answer: 'Planet berbatu' }, { label: 'jupiter', answer: 'Raksasa gas' }, { label: 'uranus', answer: 'Raksasa es' }, { label: 'mars', answer: 'Planet berbatu' }], options: ['Planet berbatu', 'Raksasa gas', 'Raksasa es'], explanation: 'Bumi dan Mars berbatu, Jupiter adalah raksasa gas, dan Uranus adalah raksasa es.', difficulty: 2, lesson: 3 },
  { id: 'revolution', kind: 'choice', prompt: 'Gerak Bumi mengelilingi Matahari disebut apa?', options: ['Rotasi', 'Revolusi', 'Gravitasi', 'Penguapan'], answer: 'Revolusi', explanation: 'Revolusi Bumi mengelilingi Matahari berlangsung sekitar 365 seperempat hari dan menjadi dasar satu tahun.', difficulty: 2, lesson: 6 },
  { id: 'rings', kind: 'truefalse', prompt: 'Saturnus adalah satu-satunya planet yang memiliki cincin.', options: ['Benar', 'Salah'], answer: 'Salah', explanation: 'Jupiter, Saturnus, Uranus, dan Neptunus memiliki cincin. Cincin Saturnus paling jelas terlihat.', difficulty: 2, lesson: 5 },
  { id: 'belt', kind: 'choice', prompt: 'Sabuk asteroid utama berada di antara orbit planet apa?', options: ['Bumi dan Mars', 'Mars dan Jupiter', 'Jupiter dan Saturnus', 'Uranus dan Neptunus'], answer: 'Mars dan Jupiter', explanation: 'Banyak asteroid mengorbit Matahari di wilayah antara Mars dan Jupiter.', difficulty: 3, lesson: 7 },
  { id: 'moon', kind: 'choice', prompt: 'Apa perbedaan utama Bulan dan Bumi dalam gerak orbitnya?', options: ['Bulan mengorbit Bumi, Bumi mengorbit Matahari', 'Bumi mengorbit Bulan', 'Bulan tidak bergerak', 'Keduanya adalah bintang'], answer: 'Bulan mengorbit Bumi, Bumi mengorbit Matahari', explanation: 'Bulan adalah satelit alami Bumi. Sambil mengorbit Bumi, Bulan juga ikut bersama Bumi mengelilingi Matahari.', difficulty: 3, lesson: 7 },
  { id: 'season', kind: 'choice', prompt: 'Pergantian musim di wilayah empat musim terutama berkaitan dengan apa?', options: ['Jarak Bumi ke Bulan', 'Rotasi Matahari', 'Kemiringan sumbu Bumi dan revolusi', 'Ukuran Bumi yang berubah'], answer: 'Kemiringan sumbu Bumi dan revolusi', explanation: 'Kemiringan sumbu Bumi membuat tiap belahan Bumi menerima sinar Matahari secara berbeda sepanjang revolusinya.', difficulty: 3, lesson: 6 },
  { id: 'meteor', kind: 'choice', prompt: 'Cahaya yang tampak saat meteoroid memasuki atmosfer Bumi disebut apa?', options: ['Komet', 'Satelit', 'Meteor', 'Planet kerdil'], answer: 'Meteor', explanation: 'Meteor adalah gejala cahaya di atmosfer. Jika ada sisa benda yang mencapai tanah, sisa itu disebut meteorit.', difficulty: 3, lesson: 7 },
];

export const questionLabels: Record<QuestionKind, string> = { choice: 'Pilihan ganda', truefalse: 'Benar atau salah', planet: 'Pilih planet', match: 'Mencocokkan', sort: 'Urutkan planet', drop: 'Kelompokkan planet' };

export function shuffle<T>(items: T[]): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}