import React, { useState } from 'react';
import { Users, ArrowLeft, Play, Sparkles, Check, Compass, HelpCircle } from 'lucide-react';
import { Player, Grade } from '../types';
import { ANIMAL_CHARACTERS, AnimalAvatar } from '../utils/characters';
import { UmmiAyuTeacher } from './UmmiAyuTeacher';
import { audio } from '../utils/audio';

interface MultiplayerSetupProps {
  onStartGame: (
    players: Player[],
    grade: Grade,
    gameFormat: 'maze' | 'quiz'
  ) => void;
  onBack: () => void;
}

export const MultiplayerSetup: React.FC<MultiplayerSetupProps> = ({
  onStartGame,
  onBack,
}) => {
  const [playerCount, setPlayerCount] = useState<number>(2);
  const [grade, setGrade] = useState<Grade>(1);
  const [gameFormat, setGameFormat] = useState<'maze' | 'quiz'>('maze');

  // Initialize 5 players default state with 5 distinct animal mascots
  const [players, setPlayers] = useState<Player[]>([
    {
      id: 1,
      name: 'Pemain 1',
      animal: ANIMAL_CHARACTERS[0], // Dolphin
      score: 0,
      selectedAnswer: null,
      answeredAt: null,
      isCorrect: null,
    },
    {
      id: 2,
      name: 'Pemain 2',
      animal: ANIMAL_CHARACTERS[1], // Turtle
      score: 0,
      selectedAnswer: null,
      answeredAt: null,
      isCorrect: null,
    },
    {
      id: 3,
      name: 'Pemain 3',
      animal: ANIMAL_CHARACTERS[2], // Panda
      score: 0,
      selectedAnswer: null,
      answeredAt: null,
      isCorrect: null,
    },
    {
      id: 4,
      name: 'Pemain 4',
      animal: ANIMAL_CHARACTERS[3], // Gorilla
      score: 0,
      selectedAnswer: null,
      answeredAt: null,
      isCorrect: null,
    },
    {
      id: 5,
      name: 'Pemain 5',
      animal: ANIMAL_CHARACTERS[4], // Pufferfish
      score: 0,
      selectedAnswer: null,
      answeredAt: null,
      isCorrect: null,
    },
  ]);

  const handlePlayerCountChange = (count: number) => {
    audio.playPop();
    setPlayerCount(count);
  };

  const handleNameChange = (index: number, newName: string) => {
    const updated = [...players];
    updated[index].name = newName;
    setPlayers(updated);
  };

  const handleAnimalSelect = (playerIndex: number, animalId: string) => {
    audio.playPop();
    const animal = ANIMAL_CHARACTERS.find((a) => a.id === animalId);
    if (!animal) return;
    const updated = [...players];
    updated[playerIndex].animal = animal;
    setPlayers(updated);
  };

  const handleStart = () => {
    audio.playCorrect();
    const activePlayers = players.slice(0, playerCount).map((p) => ({
      ...p,
      score: 0,
      selectedAnswer: null,
      answeredAt: null,
      isCorrect: null,
    }));
    audio.speak(
      `Multiplayer ${
        gameFormat === 'maze' ? 'Maze Mission' : 'Quiz'
      } with ${playerCount} players! 10 questions ready with Ummi Ayu!`
    );
    onStartGame(activePlayers, grade, gameFormat);
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-4 sm:py-6 flex flex-col items-center">
      {/* Back button and title */}
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

        <span className="text-xs sm:text-sm font-black text-indigo-900 bg-indigo-100 border border-indigo-300 px-3.5 py-1.5 rounded-full uppercase tracking-wider flex items-center gap-1">
          <Users className="w-4 h-4 text-indigo-700" /> MODE MULTIPLAYER (2-5 SISWA)
        </span>
      </div>

      {/* Ummi Ayu Welcome Banner with 3D Pixar Animation */}
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
            Ayo Bermain Bersama Teman Sekelas!
          </h2>
          <p className="text-xs sm:text-sm font-bold text-slate-700 mt-1">
            "Assalamu'alaikum anak-anak hebat! Pilih maskot satwa kesukaan kalian, dan mari selesaikan 10 soal kurikulum bahasa Inggris dengan kompak!"
          </p>
        </div>
      </div>

      {/* Format Permainan (Maze vs Quiz) */}
      <div className="w-full bg-white/95 rounded-3xl p-4 sm:p-5 border-3 border-indigo-200 shadow-md mb-4">
        <label className="text-xs sm:text-sm font-black text-slate-700 block mb-2 uppercase tracking-wide">
          1. PILIH FORMAT PERMAINAN MULTIPLAYER (10 SOAL):
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            type="button"
            id="btn-format-maze"
            onClick={() => {
              audio.playPop();
              setGameFormat('maze');
            }}
            className={`p-3.5 rounded-2xl font-black text-left transition transform active:scale-98 border-3 flex items-start gap-3 ${
              gameFormat === 'maze'
                ? 'bg-amber-100 border-amber-500 shadow-md ring-2 ring-amber-400'
                : 'bg-slate-50 border-slate-200 hover:bg-amber-50/50'
            }`}
          >
            <div className="p-2 bg-amber-300 rounded-xl text-amber-950">
              <Compass className="w-6 h-6" />
            </div>
            <div>
              <div className="text-base font-black text-slate-800 flex items-center gap-1.5">
                <span>MISI LABIRIN MULTIPLAYER</span>
                {gameFormat === 'maze' && <Check className="w-4 h-4 text-emerald-600" />}
              </div>
              <p className="text-xs font-bold text-slate-600 mt-0.5">
                Jelajahi labirin 10 pos soal bersama! Bergiliran menavigasi dan menjawab tantangan Ummi Ayu.
              </p>
            </div>
          </button>

          <button
            type="button"
            id="btn-format-quiz"
            onClick={() => {
              audio.playPop();
              setGameFormat('quiz');
            }}
            className={`p-3.5 rounded-2xl font-black text-left transition transform active:scale-98 border-3 flex items-start gap-3 ${
              gameFormat === 'quiz'
                ? 'bg-indigo-100 border-indigo-500 shadow-md ring-2 ring-indigo-400'
                : 'bg-slate-50 border-slate-200 hover:bg-indigo-50/50'
            }`}
          >
            <div className="p-2 bg-indigo-300 rounded-xl text-indigo-950">
              <HelpCircle className="w-6 h-6" />
            </div>
            <div>
              <div className="text-base font-black text-slate-800 flex items-center gap-1.5">
                <span>KUIS CEPAT MULTIPLAYER</span>
                {gameFormat === 'quiz' && <Check className="w-4 h-4 text-emerald-600" />}
              </div>
              <p className="text-xs font-bold text-slate-600 mt-0.5">
                Tanding cepat 10 soal bersamaan di satu layar dengan timer 20 detik bersama Ummi Ayu!
              </p>
            </div>
          </button>
        </div>
      </div>

      {/* Settings Grid: Count & Grade */}
      <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        {/* Number of players selector (2 to 5) */}
        <div className="bg-white/95 rounded-3xl p-4 sm:p-5 border-3 border-amber-200 shadow-md">
          <label className="text-xs sm:text-sm font-black text-slate-700 block mb-2 uppercase tracking-wide">
            2. JUMLAH PEMAIN (2 - 5 ORANG):
          </label>
          <div className="grid grid-cols-4 gap-2">
            {[2, 3, 4, 5].map((num) => (
              <button
                key={num}
                id={`btn-player-count-${num}`}
                onClick={() => handlePlayerCountChange(num)}
                className={`py-3 rounded-2xl font-black text-base sm:text-lg transition transform active:scale-95 border-2 ${
                  playerCount === num
                    ? 'bg-amber-400 border-amber-500 text-amber-950 shadow-md scale-105'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-amber-50'
                }`}
              >
                {num} Anak
              </button>
            ))}
          </div>
        </div>

        {/* Grade selector */}
        <div className="bg-white/95 rounded-3xl p-4 sm:p-5 border-3 border-amber-200 shadow-md">
          <label className="text-xs sm:text-sm font-black text-slate-700 block mb-2 uppercase tracking-wide">
            3. TINGKAT MATERI KELAS (10 SOAL):
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              id="btn-mp-grade-1"
              onClick={() => {
                audio.playPop();
                setGrade(1);
              }}
              className={`py-3 rounded-2xl font-black text-sm sm:text-base transition transform active:scale-95 border-2 flex items-center justify-center gap-2 ${
                grade === 1
                  ? 'bg-sky-400 border-sky-600 text-sky-950 shadow-md scale-102'
                  : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-sky-50'
              }`}
            >
              <span>🎒 KELAS 1 (Sekolah)</span>
              {grade === 1 && <Check className="w-4 h-4 text-sky-950" />}
            </button>
            <button
              id="btn-mp-grade-2"
              onClick={() => {
                audio.playPop();
                setGrade(2);
              }}
              className={`py-3 rounded-2xl font-black text-sm sm:text-base transition transform active:scale-95 border-2 flex items-center justify-center gap-2 ${
                grade === 2
                  ? 'bg-purple-400 border-purple-600 text-purple-950 shadow-md scale-102'
                  : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-purple-50'
              }`}
            >
              <span>🥦 KELAS 2 (Sayuran)</span>
              {grade === 2 && <Check className="w-4 h-4 text-purple-950" />}
            </button>
          </div>
        </div>
      </div>

      {/* Players Setup Card List */}
      <div className="w-full bg-white/95 rounded-3xl p-4 sm:p-6 border-3 border-indigo-200 shadow-xl mb-6">
        <h3 className="text-base sm:text-lg font-black text-slate-800 mb-4 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-amber-500" />
          PILIH MASKOT SATWA &amp; NAMA MASING-MASING PEMAIN:
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {players.slice(0, playerCount).map((p, idx) => (
            <div
              key={p.id}
              className="bg-slate-50 rounded-2xl p-3.5 border-2 border-indigo-100 shadow-sm flex flex-col gap-2.5"
            >
              <div className="flex items-center gap-3">
                <AnimalAvatar id={p.animal.id} size="sm" />
                <div className="flex-1">
                  <span className="text-[11px] font-black text-indigo-600 uppercase tracking-wider block">
                    PEMAIN {idx + 1}
                  </span>
                  <input
                    type="text"
                    value={p.name}
                    onChange={(e) => handleNameChange(idx, e.target.value)}
                    maxLength={14}
                    className="w-full px-2.5 py-1 text-sm font-bold bg-white rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    placeholder={`Nama Pemain ${idx + 1}`}
                  />
                </div>
              </div>

              {/* Animal picker mini row */}
              <div>
                <span className="text-[10px] font-extrabold text-slate-500 block mb-1">
                  Pilih Maskot:
                </span>
                <div className="flex items-center gap-1.5">
                  {ANIMAL_CHARACTERS.map((char) => {
                    const isSelected = p.animal.id === char.id;
                    return (
                      <button
                        key={char.id}
                        type="button"
                        onClick={() => handleAnimalSelect(idx, char.id)}
                        className={`text-lg p-1 rounded-xl transition transform active:scale-90 ${
                          isSelected
                            ? 'bg-amber-300 ring-2 ring-amber-500 scale-110 shadow-xs'
                            : 'bg-white hover:bg-slate-200 opacity-70 hover:opacity-100'
                        }`}
                        title={char.title}
                      >
                        {char.iconSvg}
                      </button>
                    );
                  })}
                </div>
                <div className="mt-1 text-[11px] font-extrabold text-indigo-700">
                  {p.animal.name} ({p.animal.indonesianName})
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Start Button */}
      <button
        id="btn-start-multiplayer-game"
        onClick={handleStart}
        className="w-full max-w-md py-4 px-8 rounded-3xl bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-black text-xl sm:text-2xl shadow-xl hover:shadow-2xl transition transform hover:-translate-y-1 active:translate-y-0.5 active:scale-98 flex items-center justify-center gap-3 border-b-6 border-emerald-700"
      >
        <Play className="w-7 h-7 fill-white" />
        <span>
          MULAI {gameFormat === 'maze' ? 'MISI LABIRIN' : 'KUIS'} ({playerCount} PEMAIN)
        </span>
      </button>
    </div>
  );
};
