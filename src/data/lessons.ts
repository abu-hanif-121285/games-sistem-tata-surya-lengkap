export interface Lesson {
  id: number;
  title: string;
  subtitle: string;
  paragraphs: string[];
  takeaway: string;
  reflection: string;
  planet: string;
  visual: 'system' | 'sun' | 'planets' | 'order' | 'compare' | 'motion' | 'objects';
}

export const lessons: Lesson[] = [
  {
    id: 1, title: 'Mengenal Tata Surya', subtitle: 'Kenali lingkungan kosmik tempat Bumi berada.', planet: 'earth', visual: 'system',
    paragraphs: ['Tata surya terdiri atas Matahari dan benda-benda langit yang mengelilinginya. Ada delapan planet, satelit alami, planet kerdil, asteroid, komet, dan meteoroid.', 'Gaya gravitasi adalah gaya tarik antarbenda. Gravitasi Matahari membuat planet-planet tetap bergerak pada lintasannya. Lintasan peredaran planet disebut orbit.'],
    takeaway: 'Tata surya adalah satu sistem dengan Matahari sebagai pusat peredaran planet.',
    reflection: 'Jika Bumi adalah bagian dari tata surya, benda langit apa saja yang menjadi tetangganya?',
  },
  {
    id: 2, title: 'Matahari sebagai Pusat Tata Surya', subtitle: 'Berkenalan dengan bintang yang memberi kita energi.', planet: 'sun', visual: 'sun',
    paragraphs: ['Matahari adalah bintang, yaitu benda langit yang menghasilkan cahaya dan panasnya sendiri. Planet tidak menghasilkan cahaya seperti bintang. Planet terlihat terang karena memantulkan cahaya Matahari.', 'Cahaya dan panas Matahari sangat penting bagi kehidupan di Bumi. Tumbuhan menggunakan cahaya Matahari untuk membuat makanan, sedangkan panasnya membantu penguapan air dalam siklus air.'],
    takeaway: 'Matahari adalah bintang, bukan planet. Jangan pernah menatap Matahari secara langsung.',
    reflection: 'Ceritakan satu kegiatan sehari-harimu yang terbantu oleh energi Matahari.',
  },
  {
    id: 3, title: 'Mengenal Planet', subtitle: 'Delapan dunia, masing-masing punya keunikan.', planet: 'jupiter', visual: 'planets',
    paragraphs: ['Ada delapan planet yang mengorbit Matahari. Merkurius, Venus, Bumi, dan Mars adalah planet berbatu. Keempatnya memiliki permukaan yang padat.', 'Jupiter dan Saturnus adalah raksasa gas. Uranus dan Neptunus adalah raksasa es. Keempat planet raksasa ini tidak memiliki permukaan padat seperti Bumi. Istilah raksasa es tidak berarti planetnya berupa bola es padat.'],
    takeaway: 'Planet dapat dikelompokkan menjadi planet berbatu, raksasa gas, dan raksasa es.',
    reflection: 'Mengapa kita tidak bisa berdiri di Jupiter seperti berdiri di Bumi?',
  },
  {
    id: 4, title: 'Urutan Planet', subtitle: 'Susun perjalananmu dari yang terdekat hingga terjauh.', planet: 'saturn', visual: 'order',
    paragraphs: ['Urutan planet dari yang paling dekat dengan Matahari adalah Merkurius, Venus, Bumi, Mars, Jupiter, Saturnus, Uranus, dan Neptunus.', 'Sabuk asteroid utama terletak di antara orbit Mars dan Jupiter. Pluto termasuk planet kerdil, bukan salah satu dari delapan planet utama. Jarak antarplanet tidak sama.'],
    takeaway: 'Ingat potongan namanya: Me - Ve - Bu - Ma - Ju - Sa - U - Ne.',
    reflection: 'Kamu berangkat dari Bumi menuju Jupiter. Orbit planet apa yang kamu lewati?',
  },
  {
    id: 5, title: 'Perbedaan Karakteristik Planet', subtitle: 'Amati, bandingkan, lalu temukan polanya.', planet: 'venus', visual: 'compare',
    paragraphs: ['Setiap planet memiliki ukuran, susunan, dan atmosfer yang berbeda. Jupiter adalah yang terbesar, sedangkan Merkurius adalah yang terkecil. Bumi memiliki air cair di permukaan dan kehidupan yang sudah diketahui.', 'Venus adalah planet terpanas karena atmosfer tebalnya memerangkap panas. Saturnus memiliki cincin yang paling mencolok, tetapi Jupiter, Uranus, dan Neptunus juga memiliki cincin.'],
    takeaway: 'Planet terdekat belum tentu terpanas. Atmosfer ikut memengaruhi suhu planet.',
    reflection: 'Pilih dua planet. Apa satu persamaan dan satu perbedaannya?',
  },
  {
    id: 6, title: 'Rotasi dan Revolusi', subtitle: 'Dua gerakan Bumi yang dekat dengan hidup kita.', planet: 'earth', visual: 'motion',
    paragraphs: ['Rotasi adalah gerak berputar pada sumbu sendiri. Bumi berotasi sekitar 24 jam sekali. Bagian yang menghadap Matahari mengalami siang, sedangkan bagian yang membelakanginya mengalami malam.', 'Revolusi adalah gerak mengelilingi benda langit lain. Bumi mengelilingi Matahari sekitar 365 seperempat hari sekali; ini menjadi dasar satu tahun. Revolusi bersama kemiringan sumbu Bumi menyebabkan pergantian musim di wilayah empat musim, bukan karena perubahan jarak ke Matahari.'],
    takeaway: 'Rotasi: berputar pada sumbu, berkaitan dengan siang dan malam. Revolusi: mengorbit, berkaitan dengan satu tahun.',
    reflection: 'Saat kamu tidur pada malam hari, mengapa teman di bagian Bumi lain dapat mengalami siang?',
  },
  {
    id: 7, title: 'Benda Langit dalam Tata Surya', subtitle: 'Tata surya bukan hanya Matahari dan planet.', planet: 'mercury', visual: 'objects',
    paragraphs: ['Satelit alami mengorbit planet; Bulan adalah satelit alami Bumi. Asteroid adalah benda berbatu yang lebih kecil daripada planet. Banyak asteroid terdapat di antara Mars dan Jupiter.', 'Komet mengandung es dan debu. Saat mendekati Matahari, komet dapat membentuk ekor yang mengarah menjauhi Matahari. Meteoroid adalah potongan batuan atau logam kecil di angkasa. Gejala cahaya saat masuk atmosfer disebut meteor; sisanya yang mencapai tanah disebut meteorit.'],
    takeaway: 'Bulan, asteroid, komet, dan meteoroid juga bagian dari keluarga tata surya.',
    reflection: 'Apa perbedaan Bulan dan Bumi berdasarkan benda langit yang dikelilinginya?',
  },
];