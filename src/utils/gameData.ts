import { VocabItem, MultipleChoiceQuestion, Grade } from '../types';

export const VOCAB_DICTIONARY: Record<string, VocabItem> = {
  // === KELAS 1: PERALATAN SEKOLAH (10 ITEM) ===
  bag: {
    id: 'bag',
    word: 'Bag',
    translation: 'Tas',
    pronunciationGuide: 'bæg',
    category: 'school',
    iconEmoji: '🎒',
    clue: 'Digunakan untuk membawa buku dan peralatan sekolah.',
  },
  marker: {
    id: 'marker',
    word: 'Marker',
    translation: 'Spidol',
    pronunciationGuide: 'mar-ker',
    category: 'school',
    iconEmoji: '🖊️',
    clue: 'Alat tulis bertinta tebal untuk menulis di papan tulis atau kertas.',
  },
  crayon: {
    id: 'crayon',
    word: 'Crayon',
    translation: 'Krayon',
    pronunciationGuide: 'krey-on',
    category: 'school',
    iconEmoji: '🖍️',
    clue: 'Lilin warna-warni untuk mewarnai gambar pemandangan.',
  },
  pencil: {
    id: 'pencil',
    word: 'Pencil',
    translation: 'Pensil',
    pronunciationGuide: 'pen-sil',
    category: 'school',
    iconEmoji: '✏️',
    clue: 'Alat untuk menulis yang bisa dihapus dengan penghapus.',
  },
  eraser: {
    id: 'eraser',
    word: 'Eraser',
    translation: 'Penghapus',
    pronunciationGuide: 'i-rey-ser',
    category: 'school',
    iconEmoji: '🧹',
    clue: 'Benda kenyal untuk menghapus coretan pensil yang salah.',
  },
  book: {
    id: 'book',
    word: 'Book',
    translation: 'Buku',
    pronunciationGuide: 'buk',
    category: 'school',
    iconEmoji: '📖',
    clue: 'Kumpulan lembaran cerita dan pelajaran untuk dibaca.',
  },
  colored_pencils: {
    id: 'colored_pencils',
    word: 'Colored Pencils',
    translation: 'Pensil Warna',
    pronunciationGuide: 'ka-lerd pen-sils',
    category: 'school',
    iconEmoji: '🎨',
    clue: 'Pensil dengan berbagai macam warna cerah untuk menggambar.',
  },
  glue: {
    id: 'glue',
    word: 'Glue',
    translation: 'Lem',
    pronunciationGuide: 'glu',
    category: 'school',
    iconEmoji: '🧴',
    clue: 'Cairan perekat untuk menempelkan kertas tugas kerajinan.',
  },
  ruler: {
    id: 'ruler',
    word: 'Ruler',
    translation: 'Penggaris',
    pronunciationGuide: 'ru-ler',
    category: 'school',
    iconEmoji: '📏',
    clue: 'Alat lurus dengan angka sentimeter untuk mengukur dan membuat garis.',
  },
  notebook: {
    id: 'notebook',
    word: 'Notebook',
    translation: 'Buku Catatan',
    pronunciationGuide: 'nout-buk',
    category: 'school',
    iconEmoji: '📓',
    clue: 'Buku bergaris untuk mencatat penjelasan ibu dan bapak guru.',
  },

  // === KELAS 2: NAMA-NAMA SAYURAN (11 ITEM) ===
  shallot: {
    id: 'shallot',
    word: 'Shallot',
    translation: 'Bawang Merah',
    pronunciationGuide: 'shuh-lot',
    category: 'vegetables',
    iconEmoji: '🧅',
    clue: 'Bumbu dapur berwarna ungu kemerahan dengan aroma sedap.',
  },
  garlic: {
    id: 'garlic',
    word: 'Garlic',
    translation: 'Bawang Putih',
    pronunciationGuide: 'gar-lik',
    category: 'vegetables',
    iconEmoji: '🧄',
    clue: 'Bumbu dapur berwarna putih harum penambah rasa gurih masakan.',
  },
  broccoli: {
    id: 'broccoli',
    word: 'Broccoli',
    translation: 'Brokoli',
    pronunciationGuide: 'bro-kuh-lee',
    category: 'vegetables',
    iconEmoji: '🥦',
    clue: 'Sayuran hijau lebat seperti pohon mini yang kaya serat dan vitamin.',
  },
  long_beans: {
    id: 'long_beans',
    word: 'Long Beans',
    translation: 'Kacang Panjang',
    pronunciationGuide: 'long binz',
    category: 'vegetables',
    iconEmoji: '🌿',
    clue: 'Sayuran hijau berbentuk panjang dan renyah jika ditumis.',
  },
  potato: {
    id: 'potato',
    word: 'Potato',
    translation: 'Kentang',
    pronunciationGuide: 'puh-tey-toh',
    category: 'vegetables',
    iconEmoji: '🥔',
    clue: 'Umbi bulat cokelat lezat yang bisa dibuat kentang goreng empuk.',
  },
  spinach: {
    id: 'spinach',
    word: 'Spinach',
    translation: 'Bayam',
    pronunciationGuide: 'spi-nich',
    category: 'vegetables',
    iconEmoji: '🥬',
    clue: 'Sayuran hijau berdaun segar yang membuat tubuh sehat dan kuat.',
  },
  carrot: {
    id: 'carrot',
    word: 'Carrot',
    translation: 'Wortel',
    pronunciationGuide: 'kæ-ruht',
    category: 'vegetables',
    iconEmoji: '🥕',
    clue: 'Sayuran oranye manis kesukaan kelinci yang sangat bagus untuk mata.',
  },
  cauliflower: {
    id: 'cauliflower',
    word: 'Cauliflower',
    translation: 'Kembang Kol',
    pronunciationGuide: 'kol-ee-flau-er',
    category: 'vegetables',
    iconEmoji: '💮',
    clue: 'Sayuran padat putih yang dikelilingi dedaunan hijau segar.',
  },
  cabbage: {
    id: 'cabbage',
    word: 'Cabbage',
    translation: 'Kubis',
    pronunciationGuide: 'kæ-bij',
    category: 'vegetables',
    iconEmoji: '🥗',
    clue: 'Sayuran bulat dengan lapisan daun hijau muda renyah.',
  },
  eggplant: {
    id: 'eggplant',
    word: 'Eggplant',
    translation: 'Terong',
    pronunciationGuide: 'eg-plænt',
    category: 'vegetables',
    iconEmoji: '🍆',
    clue: 'Sayuran panjang mengkilap berwarna ungu tua dengan tangkai hijau.',
  },
  mushroom: {
    id: 'mushroom',
    word: 'Mushroom',
    translation: 'Jamur',
    pronunciationGuide: 'muhsh-rum',
    category: 'vegetables',
    iconEmoji: '🍄',
    clue: 'Tanaman berpayung unik yang lezat dimasak sup atau ditumis.',
  },
};

// Array of all Grade 1 item keys
export const GRADE_1_VOCAB_KEYS = [
  'bag',
  'marker',
  'crayon',
  'pencil',
  'eraser',
  'book',
  'colored_pencils',
  'glue',
  'ruler',
  'notebook',
];

// Array of all Grade 2 vegetable keys
export const GRADE_2_VOCAB_KEYS = [
  'shallot',
  'garlic',
  'broccoli',
  'long_beans',
  'potato',
  'spinach',
  'carrot',
  'cauliflower',
  'cabbage',
  'eggplant',
  'mushroom',
];

// Helper: Shuffle array safely
export function shuffleArray<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

// Question template variations to ensure questions are varied and distinct
const QUESTION_TEMPLATES_GRADE1 = [
  {
    en: 'What school item is this?',
    id: 'Peralatan sekolah apakah ini?',
  },
  {
    en: 'Look at the picture. Choose the correct English name!',
    id: 'Lihat gambar di atas. Pilih nama bahasa Inggris yang tepat!',
  },
  {
    en: 'Which school stationery is shown here?',
    id: 'Alat tulis sekolah manakah yang ada di gambar?',
  },
  {
    en: 'Can you guess this school item?',
    id: 'Dapatkah kamu menebak peralatan sekolah ini?',
  },
];

const QUESTION_TEMPLATES_GRADE2 = [
  {
    en: 'What vegetable is this?',
    id: 'Sayuran apakah ini?',
  },
  {
    en: 'Look at the healthy vegetable! Choose its English name:',
    id: 'Lihat sayuran segar ini! Pilih nama bahasa Inggrisnya:',
  },
  {
    en: 'Which vegetable is shown in the picture?',
    id: 'Sayuran manakah yang tampak pada gambar?',
  },
  {
    en: 'What is the English name of this vegetable?',
    id: 'Apa nama bahasa Inggris untuk sayuran sehat ini?',
  },
];

/**
 * Generate a randomized, non-repeating set of questions for Grade 1 or Grade 2
 * Ensures questions rotate and vary every single game round!
 */
export function generateVariedQuestions(
  grade: Grade,
  count: number = 5,
  excludeKeys: string[] = []
): MultipleChoiceQuestion[] {
  const allKeys = grade === 1 ? GRADE_1_VOCAB_KEYS : GRADE_2_VOCAB_KEYS;
  const availableKeys = allKeys.filter((k) => !excludeKeys.includes(k));
  const pool = availableKeys.length >= count ? availableKeys : allKeys;
  const shuffledKeys = shuffleArray(pool).slice(0, count);

  const templates = grade === 1 ? QUESTION_TEMPLATES_GRADE1 : QUESTION_TEMPLATES_GRADE2;

  return shuffledKeys.map((key, index) => {
    const vocab = VOCAB_DICTIONARY[key];
    const otherKeys = allKeys.filter((k) => k !== key);
    const distractors = shuffleArray(otherKeys)
      .slice(0, 2)
      .map((k) => VOCAB_DICTIONARY[k].word);

    const options = shuffleArray([vocab.word, ...distractors]);
    const template = templates[index % templates.length];

    return {
      id: `q_${grade}_${key}_${Date.now()}_${index}`,
      vocabId: key,
      questionText: template.en,
      questionTextId: template.id,
      correctAnswer: vocab.word,
      options,
      hint: vocab.clue,
      customType: 'standard',
    };
  });
}

/**
 * Generate questions for Maze Checkpoints
 * Creates distinct questions for each checkpoint gate inside the maze!
 */
export function generateMazeCheckpointQuestions(
  grade: Grade,
  checkpointCount: number = 5
): MultipleChoiceQuestion[] {
  return generateVariedQuestions(grade, checkpointCount);
}

// Backward-compatible helper methods for level components
export function getClass1Level1Questions(): MultipleChoiceQuestion[] {
  return generateVariedQuestions(1, 5);
}

export function getClass2Level1Questions(): MultipleChoiceQuestion[] {
  return generateVariedQuestions(2, 5);
}

export function getClass2Level4MysteryQuestions(): MultipleChoiceQuestion[] {
  const keys = shuffleArray(GRADE_2_VOCAB_KEYS).slice(0, 5);
  return keys.map((key, idx) => {
    const vocab = VOCAB_DICTIONARY[key];
    const otherKeys = GRADE_2_VOCAB_KEYS.filter((k) => k !== key);
    const distractors = shuffleArray(otherKeys)
      .slice(0, 2)
      .map((k) => VOCAB_DICTIONARY[k].word);

    return {
      id: `c2_mystery_${key}_${idx}`,
      vocabId: key,
      questionText: 'Guess the Mystery Vegetable!',
      questionTextId: 'Tebak sayuran rahasia ini!',
      hint: vocab.clue || `Sayuran sehat: ${vocab.translation}`,
      correctAnswer: vocab.word,
      options: shuffleArray([vocab.word, ...distractors]),
      customType: 'mystery',
    };
  });
}
