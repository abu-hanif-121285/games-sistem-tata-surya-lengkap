export const levels = [
  { level: 1, name: 'Space Cadet', min: 0 },
  { level: 2, name: 'Planet Explorer', min: 100 },
  { level: 3, name: 'Space Researcher', min: 300 },
  { level: 4, name: 'Solar System Master', min: 600 },
];

export const levelForXP = (xp: number) => [...levels].reverse().find((level) => xp >= level.min) ?? levels[0];

export const badges = [
  { id: 'explorer', name: 'Penjelajah Tata Surya', description: 'Pelajari planet pertamamu.', icon: 'sparkles', color: '#ffce6b' },
  { id: 'hunter', name: 'Pemburu Planet', description: 'Pelajari kedelapan planet.', icon: 'orbit', color: '#a398ff' },
  { id: 'smart', name: 'Astronaut Cerdas', description: 'Raih nilai kuis minimal 70%.', icon: 'rocket', color: '#58d2fc' },
  { id: 'earth-friend', name: 'Sahabat Bumi', description: 'Kenali Bumi dan selesaikan materi rotasi serta revolusi.', icon: 'earth', color: '#5bdbb1' },
  { id: 'master', name: 'Master Tata Surya', description: 'Selesaikan kelima misi utama.', icon: 'trophy', color: '#ffba57' },
];

export const missionDefinitions = [
  { id: 'intro', name: 'Kenali Tata Surya', description: 'Selesaikan materi pertama dan mulai petualanganmu.', target: 1, unit: 'materi' },
  { id: 'planets', name: 'Temukan Semua Planet', description: 'Buka dan pelajari profil kedelapan planet.', target: 8, unit: 'planet' },
  { id: 'learn', name: 'Pelajari Karakteristik Planet', description: 'Selesaikan ketujuh materi dan tulis refleksimu.', target: 7, unit: 'materi' },
  { id: 'order', name: 'Susun Planet', description: 'Selesaikan permainan Urutkan Planet.', target: 1, unit: 'permainan' },
  { id: 'exam', name: 'Lulus Ujian Astronaut', description: 'Selesaikan kuis dengan nilai minimal 70%.', target: 70, unit: '% nilai' },
];

export const gameDefinitions = [
  { id: 'order', name: 'Urutkan Planet', subtitle: 'Setiap planet punya tempatnya. Bisa kamu susun?', icon: 'orbit', color: 'cyan', label: 'URUTAN & ORBIT', rounds: 1 },
  { id: 'guess', name: 'Tebak Planet', subtitle: 'Amati tampilannya, lalu temukan nama planetnya.', icon: 'scan', color: 'purple', label: 'AMATI & KENALI', rounds: 4 },
  { id: 'mission', name: 'Mission to Planet', subtitle: 'Bantu Astro menemukan tujuan misi berikutnya.', icon: 'rocket', color: 'amber', label: 'MISI ASTRONAUT', rounds: 3 },
  { id: 'match', name: 'Pasangkan', subtitle: 'Hubungkan planet dengan karakteristik uniknya.', icon: 'link', color: 'green', label: 'CIRI & KARAKTER', rounds: 1 },
  { id: 'space', name: 'Space Quiz', subtitle: 'Pertanyaan acak untuk menguji rasa ingin tahumu.', icon: 'sparkles', color: 'blue', label: 'TANTANGAN ACAK', rounds: 5 },
];