export interface Planet {
  id: string;
  name: string;
  order: number;
  type: 'Bintang' | 'Planet berbatu' | 'Raksasa gas' | 'Raksasa es';
  tagline: string;
  description: string;
  characteristics: string[];
  facts: string[];
  atmosphere: string;
  diameter: number;
  distance: number;
  color: string;
  texture: string;
  source: string;
}

export const planets: Planet[] = [
  {
    id: 'sun', name: 'Matahari', order: 0, type: 'Bintang',
    tagline: 'Bintang yang menerangi rumah kita.',
    description: 'Matahari adalah bintang di pusat tata surya. Matahari menghasilkan cahaya dan panasnya sendiri. Gaya gravitasinya menjaga planet-planet tetap mengorbit.',
    characteristics: ['Bola gas yang sangat panas.', 'Sumber utama cahaya dan panas bagi Bumi.', 'Pusat peredaran delapan planet dalam tata surya.'],
    facts: ['Matahari adalah bintang, bukan planet.', 'Cahaya Matahari membantu tumbuhan membuat makanan. Jangan menatap Matahari secara langsung.'],
    atmosphere: 'Memiliki lapisan gas yang sangat panas.', diameter: 1392700, distance: 0, color: '#ffbd45', texture: 'sun',
    source: 'https://science.nasa.gov/sun/facts/',
  },
  {
    id: 'mercury', name: 'Merkurius', order: 1, type: 'Planet berbatu',
    tagline: 'Si kecil yang paling dekat dengan Matahari.',
    description: 'Merkurius adalah planet terkecil dan paling dekat dengan Matahari. Permukaannya berbatu dan dipenuhi kawah bekas tumbukan benda langit.',
    characteristics: ['Planet terkecil dalam tata surya.', 'Permukaannya berbatu dan berkawah.', 'Suhu siang dan malam sangat berbeda.'],
    facts: ['Walaupun paling dekat dengan Matahari, Merkurius bukan planet terpanas.', 'Merkurius tidak memiliki satelit alami.'],
    atmosphere: 'Hampir tidak ada; hanya lapisan gas yang sangat tipis.', diameter: 4879, distance: 57.9, color: '#aaa49c', texture: 'mercury',
    source: 'https://science.nasa.gov/mercury/facts/',
  },
  {
    id: 'venus', name: 'Venus', order: 2, type: 'Planet berbatu',
    tagline: 'Planet terpanas dengan selimut awan tebal.',
    description: 'Venus memiliki ukuran hampir sebesar Bumi. Atmosfernya yang sangat tebal memerangkap panas sehingga Venus menjadi planet terpanas di tata surya.',
    characteristics: ['Planet terpanas, bukan Merkurius.', 'Diselimuti awan dan atmosfer yang sangat tebal.', 'Ukuran sedikit lebih kecil daripada Bumi.'],
    facts: ['Venus sering disebut Bintang Kejora, tetapi sebenarnya Venus adalah planet.', 'Venus dan Merkurius tidak memiliki satelit alami.'],
    atmosphere: 'Sangat tebal, terutama terdiri atas karbon dioksida.', diameter: 12104, distance: 108.2, color: '#e7b777', texture: 'venus_surface',
    source: 'https://science.nasa.gov/venus/venus-facts/',
  },
  {
    id: 'earth', name: 'Bumi', order: 3, type: 'Planet berbatu',
    tagline: 'Planet biru, rumah kita bersama.',
    description: 'Bumi adalah planet tempat kita tinggal. Air cair, suhu yang sesuai, dan atmosfernya mendukung kehidupan. Sampai saat ini, Bumi adalah satu-satunya planet yang diketahui memiliki kehidupan.',
    characteristics: ['Sebagian besar permukaannya tertutup air.', 'Atmosfer mengandung nitrogen dan oksigen.', 'Memiliki satu satelit alami, yaitu Bulan.'],
    facts: ['Rotasi Bumi menyebabkan terjadinya siang dan malam.', 'Bumi membutuhkan sekitar 365 seperempat hari untuk sekali mengelilingi Matahari.'],
    atmosphere: 'Ada; terutama nitrogen dan oksigen.', diameter: 12756, distance: 149.6, color: '#46a5e7', texture: 'earth_daymap',
    source: 'https://science.nasa.gov/earth/facts/',
  },
  {
    id: 'mars', name: 'Mars', order: 4, type: 'Planet berbatu',
    tagline: 'Planet Merah dengan permukaan berbatu.',
    description: 'Mars disebut Planet Merah karena permukaannya mengandung mineral besi yang berkarat. Planet berbatu ini lebih kecil dan lebih dingin daripada Bumi.',
    characteristics: ['Tampak kemerahan karena mineral besi.', 'Memiliki atmosfer tipis.', 'Memiliki dua satelit alami.'],
    facts: ['Gunung berapi Olympus Mons berada di Mars.', 'Robot penjelajah membantu ilmuwan mempelajari Mars. Belum ada bukti kehidupan yang terkonfirmasi di sana.'],
    atmosphere: 'Tipis; terutama karbon dioksida.', diameter: 6792, distance: 228.0, color: '#d9754b', texture: 'mars',
    source: 'https://science.nasa.gov/mars/facts/',
  },
  {
    id: 'jupiter', name: 'Jupiter', order: 5, type: 'Raksasa gas',
    tagline: 'Sang raksasa di antara semua planet.',
    description: 'Jupiter adalah planet terbesar dalam tata surya. Sebagian besar penyusunnya adalah gas hidrogen dan helium. Jupiter tidak memiliki permukaan padat seperti Bumi.',
    characteristics: ['Planet terbesar dalam tata surya.', 'Memiliki pita-pita awan yang terlihat seperti garis.', 'Bintik Merah Besar adalah badai raksasa.'],
    facts: ['Jupiter memiliki cincin yang tipis dan redup.', 'Jupiter memiliki banyak satelit alami, termasuk Europa dan Ganimede.'],
    atmosphere: 'Sangat tebal; terutama hidrogen dan helium.', diameter: 142984, distance: 778.5, color: '#d6ad88', texture: 'jupiter',
    source: 'https://science.nasa.gov/jupiter/facts/',
  },
  {
    id: 'saturn', name: 'Saturnus', order: 6, type: 'Raksasa gas',
    tagline: 'Sang pemilik cincin yang menakjubkan.',
    description: 'Saturnus adalah planet terbesar kedua. Cincinnya yang lebar tersusun dari banyak potongan es dan batuan. Seperti Jupiter, Saturnus tidak memiliki permukaan padat seperti Bumi.',
    characteristics: ['Memiliki sistem cincin yang sangat jelas.', 'Planet terbesar kedua setelah Jupiter.', 'Sebagian besar tersusun dari hidrogen dan helium.'],
    facts: ['Saturnus bukan satu-satunya planet bercincin. Keempat planet raksasa memiliki cincin.', 'Cincin Saturnus bukan satu benda padat, melainkan kumpulan banyak partikel.'],
    atmosphere: 'Sangat tebal; terutama hidrogen dan helium.', diameter: 120536, distance: 1432.0, color: '#e5c993', texture: 'saturn',
    source: 'https://science.nasa.gov/saturn/facts/',
  },
  {
    id: 'uranus', name: 'Uranus', order: 7, type: 'Raksasa es',
    tagline: 'Planet unik yang berputar menyamping.',
    description: 'Uranus adalah raksasa es yang tampak biru kehijauan. Sumbu putarnya sangat miring sehingga planet ini terlihat seperti menggelinding saat mengorbit Matahari.',
    characteristics: ['Sumbu rotasinya sangat miring.', 'Tampak biru kehijauan karena gas metana.', 'Memiliki cincin yang redup.'],
    facts: ['Uranus ditemukan dengan bantuan teleskop.', 'Sebutan raksasa es tidak berarti Uranus memiliki permukaan es padat untuk dipijak.'],
    atmosphere: 'Ada; terutama hidrogen, helium, dan sedikit metana.', diameter: 51118, distance: 2867.0, color: '#97dce1', texture: 'uranus',
    source: 'https://science.nasa.gov/uranus/facts/',
  },
  {
    id: 'neptune', name: 'Neptunus', order: 8, type: 'Raksasa es',
    tagline: 'Dunia berangin di ujung barisan planet.',
    description: 'Neptunus adalah planet kedelapan dan terjauh dari Matahari. Raksasa es ini memiliki atmosfer berangin sangat kencang dan tampak kebiruan.',
    characteristics: ['Planet terjauh dari Matahari.', 'Memiliki angin yang sangat kencang.', 'Termasuk raksasa es, seperti Uranus.'],
    facts: ['Keberadaan Neptunus diperkirakan melalui perhitungan sebelum diamati dengan teleskop.', 'Neptunus juga memiliki cincin yang redup.'],
    atmosphere: 'Ada; terutama hidrogen, helium, dan sedikit metana.', diameter: 49528, distance: 4515.0, color: '#598ee3', texture: 'neptune',
    source: 'https://science.nasa.gov/neptune/facts/',
  },
];

export const orbitingPlanets = planets.filter((planet) => planet.order > 0);
export const planetById = (id: string) => planets.find((planet) => planet.id === id) ?? planets[3];
export const planetOrder = orbitingPlanets.map((planet) => planet.id);

export const sources = [
  { title: 'NASA Science: Tata Surya dan Planet', url: 'https://science.nasa.gov/solar-system/solar-system-facts/', note: 'Urutan planet, kelompok planet, dan konsep dasar tata surya.' },
  { title: 'NASA: Planetary Fact Sheet', url: 'https://nssdc.gsfc.nasa.gov/planetary/factsheet/', note: 'Diameter khatulistiwa dan jarak rata-rata planet untuk perbandingan relatif.' },
  { title: 'NASA Science: Bumi', url: 'https://science.nasa.gov/earth/facts/', note: 'Rotasi, revolusi, atmosfer, dan kemiringan sumbu Bumi.' },
  { title: 'Panduan IPAS Fase C, Kemendikdasmen', url: 'https://kurikulum.kemendikdasmen.go.id/file/panduan/dokumen/7.%20Final%20Panduan%20Mata%20Pelajaran%20IPAS_03_10_2025_Revisi%204.pdf', note: 'Sistem tata surya serta kaitannya dengan rotasi dan revolusi Bumi.' },
  { title: 'Tekstur Planet: Solar System Scope', url: 'https://www.solarsystemscope.com/textures/', note: 'CC BY 4.0. Tekstur diadaptasi menjadi ilustrasi 2.5D; warna dan pencahayaan merupakan visualisasi.' },
];