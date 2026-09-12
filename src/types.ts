export type Grade = 1 | 2;

export type GameMode = 'solo' | 'multiplayer';

export type AnimalId = 'dolphin' | 'turtle' | 'panda' | 'gorilla' | 'pufferfish';

export interface AnimalCharacter {
  id: AnimalId;
  name: string;
  indonesianName: string;
  title: string;
  avatarColor: string;
  accentColor: string;
  badgeBg: string;
  catchphrase: string;
  iconSvg: string;
}

export interface VocabItem {
  id: string;
  word: string;
  translation: string;
  pronunciationGuide: string;
  category: 'school' | 'vegetables' | 'food' | 'animals' | 'colors';
  colorHex?: string;
  clue?: string;
  iconEmoji?: string;
}

export interface MultipleChoiceQuestion {
  id: string;
  vocabId: string;
  questionText: string;
  questionTextId: string;
  correctAnswer: string;
  options: string[];
  hint?: string;
  customType?: 'standard' | 'color' | 'mystery' | 'maze_checkpoint';
}

export interface Player {
  id: number;
  name: string;
  animal: AnimalCharacter;
  score: number;
  selectedAnswer: string | null;
  answeredAt: number | null;
  isCorrect: boolean | null;
}

export interface AudioSettings {
  musicEnabled: boolean;
  musicVolume: number; // 0 to 1
  sfxEnabled: boolean;
  sfxVolume: number; // 0 to 1
  speechEnabled: boolean;
  speechRate: number;
}
