import React, { useState } from 'react';
import { Grade, Player, AnimalId } from '../types';
import { ANIMAL_CHARACTERS, AnimalAvatar } from '../utils/characters';
import { UmmiAyuTeacher } from './UmmiAyuTeacher';
import { audio } from '../utils/audio';
import { ArrowLeft, Play, Sparkles, Compass, Target, Check } from 'lucide-react';

interface SoloSetupScreenProps {
  onStartSolo: (
    player: Player,
    grade: Grade,
    modeType: 'maze' | 'quiz'
  ) => void;
  onBack: () => void;
}

export const SoloSetupScreen: React.FC<SoloSetupScreenProps> = ({
  onStartSolo,
  onBack,
}) => {
  const [playerName, setPlayerName] = useState<string>('Siswa Juara');
  const [selectedAnimalId, setSelectedAnimalId] = useState<AnimalId>('dolphin');
  const [selectedGrade, setSelectedGrade] = useState<Grade>(1);
  const [gameType, setGameType] = useState<'maze' | 'quiz'>('maze');

  const selectedAnimal =
    ANIMAL_CHARACTERS.find((a) => a.id === selectedAnimalId) ||
    ANIMAL_CHARACTERS[0];

  const handleAnimalSelect = (id: AnimalId) => {
    setSelectedAnimalId(id);
    audio.playPop();
    const animal = ANIMAL_CHARACTERS.find((a) => a.id === id);
    if (animal) {
      audio.speak(`I am ${animal.name}! ${animal.catchphrase}`);
    }
  };

  const handleStart = () => {
    audio.playCorrect();
    const trimmedName = playerName.trim() || 'Petualang Cilik';

    const playerObj: Player = {
      id: 1,
      name: trimmedName,
      animal: selectedAnimal,
      score: 0,
      selectedAnswer: null,
      answeredAt: null,
      isCorrect: null,
    };

    audio.speak(
      `Hello ${trimmedName}! Ready for ${
        gameType === 'maze' ? 'the Maze Mission with 10 checkpoints' : '10 English Quiz questions'
      } with Ummi Ayu!`
    );

    onStartSolo(playerObj, selectedGrade, gameType);
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-4 sm:py-6 flex flex-col items-center">
      {/* Back button and title badge */}
      <div className="w-full flex items-center justify-between mb-3">
        <button
          onClick={() => {
            audio.playPop();
            onBack();
          }}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-white/90 border-2 border-slate-200 text-slate-700 font-extrabold text-sm hover:bg-slate-100 transition active:scale-95 shadow-xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali</span>
        </button>

        <span className="text-xs sm:text-sm font-black text-emerald-900 bg-emerald-100 border border-emerald-300 px-3.5 py-1.5 rounded-full uppercase tracking-wider flex items-center gap-1">
          <Sparkles className="w-4 h-4 text-emerald-600" /> ATUR PROFIL PETUALANG (SOLO)
        </span>
      </div>

      {/* Ummi Ayu Teacher Greeting Card */}
      <div className="w-full bg-gradient-to-r from-amber-100 via-orange-100 to-amber-100 rounded-3xl p-4 sm:p-5 border-3 border-amber-300 shadow-md mb-5 flex items-center gap-4 sm:gap-6">
        <UmmiAyuTeacher
          size="md"
          animate={true}
          interactiveAudio={true}
        />
        <div className="flex-1">
          <div className="inline-flex items-center gap-1.5 text-xs font-black text-amber-900 bg-amber-200 px-2.5 py-0.5 rounded-full mb-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            Sapaan Ummi Ayu
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-800">
            Assalamu'alaikum, Selamat Datang!
          </h2>
          <p className="text-xs sm:text-sm font-bold text-slate-700 mt-1">
            "Saya Ummi Ayu. Tuliskan nama panggilanmu, pilih sahabat satwa favoritmu, dan mari selesaikan 10 soal kurikulum dengan ceria!"
          </p>
        </div>
      </div>

      {/* Main Settings Form Container */}
      <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
        {/* LEFT COLUMN: CUSTOM NAME & MASCOT SELECTION */}
        <div className="bg-white/95 rounded-3xl p-5 border-3 border-amber-200 shadow-md flex flex-col justify-between">
          <div>
            <label className="text-xs sm:text-sm font-black text-slate-700 block mb-2 uppercase tracking-wide">
              1. NAMA KARAKTER KAMU:
            </label>
            <div className="flex items-center gap-3 mb-4">
              <AnimalAvatar id={selectedAnimalId} size="md" animate={true} />
              <div className="flex-1">
                <input
                  type="text"
                  id="input-player-name"
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  maxLength={16}
                  placeholder="Ketik nama kamu di sini..."
                  className="w-full px-3.5 py-2.5 text-base font-bold bg-amber-50 rounded-2xl border-2 border-amber-300 focus:outline-none focus:ring-3 focus:ring-amber-400 text-slate-800"
                />
                <span className="text-[11px] font-bold text-slate-400 mt-1 block">
                  Bisa diubah kapan saja sesuai nama siswa
                </span>
              </div>
            </div>

            {/* Mascot Picker Row */}
            <label className="text-xs sm:text-sm font-black text-slate-700 block mb-2 uppercase tracking-wide">
              2. PILIH TEMAN SATWA:
            </label>
            <div className="grid grid-cols-5 gap-2">
              {ANIMAL_CHARACTERS.map((char) => {
                const isSelected = selectedAnimalId === char.id;
                return (
                  <button
                    key={char.id}
                    id={`mascot-pick-${char.id}`}
                    type="button"
                    onClick={() => handleAnimalSelect(char.id)}
                    className={`flex flex-col items-center p-2 rounded-2xl transition-all duration-150 transform active:scale-95 ${
                      isSelected
                        ? 'bg-amber-300 border-2 border-amber-500 shadow-md scale-105 ring-2 ring-amber-400'
                        : 'bg-slate-50 border border-slate-200 hover:bg-slate-100 opacity-80'
                    }`}
                  >
                    <span className="text-2xl">{char.iconSvg}</span>
                    <span className="text-[11px] font-black text-slate-800 mt-1">
                      {char.name}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="mt-3 text-xs font-black text-amber-800 bg-amber-100/80 p-2 rounded-xl border border-amber-300 flex items-center gap-2">
              <span>💬 {selectedAnimal.title}:</span>
              <span className="italic font-bold">"{selectedAnimal.catchphrase}"</span>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: GRADE SELECTION & MISSION TYPE */}
        <div className="bg-white/95 rounded-3xl p-5 border-3 border-indigo-200 shadow-md flex flex-col justify-between">
          <div>
            {/* Grade Selection */}
            <label className="text-xs sm:text-sm font-black text-slate-700 block mb-2 uppercase tracking-wide">
              3. PILIH KELAS &amp; MATERI (10 SOAL BERGANTIAN):
            </label>

            <div className="grid grid-cols-2 gap-3 mb-4">
              {/* Class 1 (Peralatan Sekolah) */}
              <button
                type="button"
                id="solo-pick-grade-1"
                onClick={() => {
                  audio.playPop();
                  setSelectedGrade(1);
                }}
                className={`p-3 rounded-2xl font-black text-left transition-all border-2 flex flex-col justify-between ${
                  selectedGrade === 1
                    ? 'bg-sky-100 border-sky-500 shadow-md scale-102 ring-2 ring-sky-300'
                    : 'bg-slate-50 border-slate-200 hover:bg-sky-50 text-slate-600'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-2xl">🎒</span>
                  {selectedGrade === 1 && <Check className="w-5 h-5 text-sky-600" />}
                </div>
                <div className="text-sm sm:text-base font-black text-sky-950">
                  KELAS 1 SD
                </div>
                <div className="text-[11px] font-bold text-sky-700 mt-0.5">
                  Peralatan Sekolah (10 Soal Bergantian)
                </div>
              </button>

              {/* Class 2 (Nama-nama Sayuran) */}
              <button
                type="button"
                id="solo-pick-grade-2"
                onClick={() => {
                  audio.playPop();
                  setSelectedGrade(2);
                }}
                className={`p-3 rounded-2xl font-black text-left transition-all border-2 flex flex-col justify-between ${
                  selectedGrade === 2
                    ? 'bg-purple-100 border-purple-500 shadow-md scale-102 ring-2 ring-purple-300'
                    : 'bg-slate-50 border-slate-200 hover:bg-purple-50 text-slate-600'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-2xl">🥦</span>
                  {selectedGrade === 2 && <Check className="w-5 h-5 text-purple-600" />}
                </div>
                <div className="text-sm sm:text-base font-black text-purple-950">
                  KELAS 2 SD
                </div>
                <div className="text-[11px] font-bold text-purple-700 mt-0.5">
                  Nama Sayuran (10 Soal Bergantian)
                </div>
              </button>
            </div>

            {/* Mission Mode Selection */}
            <label className="text-xs sm:text-sm font-black text-slate-700 block mb-2 uppercase tracking-wide">
              4. PILIH FORMAT PERMAINAN (10 SOAL):
            </label>

            <div className="grid grid-cols-2 gap-3">
              {/* Maze Mission (Medium Category) */}
              <button
                type="button"
                id="pick-game-maze"
                onClick={() => {
                  audio.playPop();
                  setGameType('maze');
                }}
                className={`p-3 rounded-2xl font-black text-left transition-all border-2 flex flex-col justify-between ${
                  gameType === 'maze'
                    ? 'bg-emerald-100 border-emerald-500 shadow-md scale-102 ring-2 ring-emerald-300'
                    : 'bg-slate-50 border-slate-200 hover:bg-emerald-50 text-slate-600'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <Compass className="w-6 h-6 text-emerald-600" />
                  <span className="text-[10px] font-extrabold bg-emerald-500 text-white px-2 py-0.5 rounded-full">
                    10 POS SOAL
                  </span>
                </div>
                <div className="text-sm sm:text-base font-black text-emerald-950">
                  MISI LABIRIN 🧭
                </div>
                <div className="text-[11px] font-bold text-emerald-700 mt-0.5">
                  Selesaikan 10 pos labirin bersama Ummi Ayu!
                </div>
              </button>

              {/* Classic Quiz & Match */}
              <button
                type="button"
                id="pick-game-quiz"
                onClick={() => {
                  audio.playPop();
                  setGameType('quiz');
                }}
                className={`p-3 rounded-2xl font-black text-left transition-all border-2 flex flex-col justify-between ${
                  gameType === 'quiz'
                    ? 'bg-amber-100 border-amber-500 shadow-md scale-102 ring-2 ring-amber-300'
                    : 'bg-slate-50 border-slate-200 hover:bg-amber-50 text-slate-600'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <Target className="w-6 h-6 text-amber-600" />
                  <span className="text-[10px] font-extrabold bg-amber-500 text-white px-2 py-0.5 rounded-full">
                    10 SOAL KUIS
                  </span>
                </div>
                <div className="text-sm sm:text-base font-black text-amber-950">
                  TEBAK &amp; COCOKKAN
                </div>
                <div className="text-[11px] font-bold text-amber-700 mt-0.5">
                  Tebak 10 kartu gambar bersama Ummi Ayu!
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Start Button */}
      <button
        id="btn-start-solo-game"
        onClick={handleStart}
        className="w-full max-w-md py-4 px-8 rounded-3xl bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-black text-xl sm:text-2xl shadow-xl hover:shadow-2xl transition transform hover:-translate-y-1 active:translate-y-0.5 active:scale-98 flex items-center justify-center gap-3 border-b-6 border-emerald-700"
      >
        <Play className="w-7 h-7 fill-white" />
        <span>
          MULAI {gameType === 'maze' ? 'MISI LABIRIN (10 POS)' : '10 SOAL KUIS'}!
        </span>
      </button>

      <div className="mt-3 text-xs font-bold text-slate-500 text-center">
        💡 Setiap permainan menampilkan 10 soal kurikulum berbeda secara bergantian!
      </div>
    </div>
  );
};
