import React, { useState } from 'react';
import { Play, Users, Sparkles, Volume2, Star, Compass } from 'lucide-react';
import { ANIMAL_CHARACTERS, AnimalAvatar } from '../utils/characters';
import { UmmiAyuTeacher } from './UmmiAyuTeacher';
import { audio } from '../utils/audio';

interface HomeScreenProps {
  onPlayClick: () => void;
  onMultiplayerClick: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  onPlayClick,
  onMultiplayerClick,
}) => {
  const [selectedMascot, setSelectedMascot] = useState<string>('dolphin');

  const handleMascotClick = (id: string, name: string, catchphrase: string) => {
    setSelectedMascot(id);
    audio.playPop();
    audio.speak(`Hi! I am ${name}! ${catchphrase}`);
  };

  const handleStartPlay = () => {
    audio.playCorrect();
    // Auto-start playful background music if not started
    if (!audio.isMusicOn()) {
      audio.startMusic();
    }
    onPlayClick();
  };

  const handleStartMultiplayer = () => {
    audio.playCorrect();
    if (!audio.isMusicOn()) {
      audio.startMusic();
    }
    onMultiplayerClick();
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-3 flex flex-col items-center text-center relative z-10">
      {/* Decorative Floating Elements */}
      <div className="absolute top-2 left-6 text-3xl animate-bounce duration-1000 select-none pointer-events-none opacity-80">
        🎈
      </div>
      <div className="absolute top-8 right-8 text-3xl animate-pulse select-none pointer-events-none opacity-80">
        🌈
      </div>
      <div className="absolute bottom-12 left-6 text-2xl animate-spin select-none pointer-events-none opacity-70">
        ⭐
      </div>
      <div className="absolute bottom-16 right-8 text-3xl select-none pointer-events-none opacity-80">
        ☁️
      </div>

      {/* Main Title Badge */}
      <div className="mt-1 mb-2 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/90 border-2 border-amber-300 shadow-xs text-amber-900 text-xs sm:text-sm font-black tracking-wider uppercase">
        <Sparkles className="w-4 h-4 text-amber-500" />
        GAME EDUKASI INTERAKTIF BAHASA INGGRIS SD KELAS 1 &amp; 2
      </div>

      <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight text-slate-800 drop-shadow-sm flex flex-col items-center">
        <span className="flex items-center gap-2">
          <span className="text-4xl sm:text-6xl">🎮</span>
          <span className="bg-gradient-to-r from-sky-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
            FUN ENGLISH ADVENTURE
          </span>
        </span>
        <span className="mt-1 flex items-center gap-2 text-2xl sm:text-4xl text-amber-600 font-extrabold">
          <Star className="w-6 h-6 sm:w-8 sm:h-8 text-amber-400 fill-amber-400 animate-spin" />
          GUESS &amp; MATCH!
          <Star className="w-6 h-6 sm:w-8 sm:h-8 text-amber-400 fill-amber-400 animate-spin" />
        </span>
      </h1>

      {/* Subtitle */}
      <p className="mt-1.5 text-base sm:text-xl font-extrabold text-slate-600 max-w-xl">
        “Guess the picture and match the words!”
      </p>

      {/* Ummi Ayu Welcome Card with 3D Pixar Super HD Character */}
      <div className="my-4 w-full max-w-2xl bg-gradient-to-r from-amber-100/90 via-orange-50/90 to-amber-100/90 rounded-3xl p-4 sm:p-5 border-3 border-amber-300 shadow-lg flex items-center gap-4 sm:gap-6 text-left">
        <UmmiAyuTeacher
          size="md"
          animate={true}
          interactiveAudio={true}
        />
        <div className="flex-1">
          <h2 className="text-lg sm:text-2xl font-black text-slate-800">
            Assalamu'alaikum! Selamat Datang bersama Ummi Ayu!
          </h2>
          <p className="text-xs sm:text-sm font-bold text-slate-700 mt-1 leading-relaxed">
            "Ayo anak-anak hebat kelas 1 &amp; 2 SD, mari taklukkan 10 pos soal di Misi Labirin dan Kuis Tebak Gambar dengan gembira!"
          </p>
        </div>
      </div>

      {/* Central Mascot Showcase */}
      <div className="mb-4 w-full max-w-3xl bg-gradient-to-b from-sky-50 via-amber-50/50 to-emerald-50 rounded-3xl p-4 sm:p-5 border-3 border-amber-200 shadow-lg relative overflow-hidden">
        <div className="mb-3">
          <span className="inline-block px-3 py-1 rounded-2xl bg-white border border-sky-300 text-sky-800 text-xs sm:text-sm font-black shadow-2xs">
            🐾 5 TEMAN SATWA PETUALANG (BISA DIGANTI NAMA &amp; KARAKTERNYA)
          </span>
          <p className="text-xs text-slate-500 mt-1 font-bold">
            Klik karakter untuk mendengar sapaan suaranya!
          </p>
        </div>

        {/* 5 Animal Friends Row */}
        <div className="grid grid-cols-5 gap-2 sm:gap-4 place-items-center">
          {ANIMAL_CHARACTERS.map((char) => {
            const isSelected = selectedMascot === char.id;
            return (
              <button
                key={char.id}
                id={`mascot-btn-${char.id}`}
                onClick={() => handleMascotClick(char.id, char.name, char.catchphrase)}
                className={`flex flex-col items-center p-2 rounded-2xl transition-all duration-200 transform hover:scale-105 active:scale-95 ${
                  isSelected 
                    ? 'bg-white shadow-lg ring-3 ring-amber-400 -translate-y-1' 
                    : 'bg-white/70 hover:bg-white shadow-xs'
                }`}
              >
                <AnimalAvatar id={char.id} size="md" animate={isSelected} />
                <span className="mt-1.5 text-xs sm:text-sm font-black text-slate-800">
                  {char.name}
                </span>
                <span className="text-[10px] sm:text-xs font-semibold text-slate-500">
                  {char.indonesianName}
                </span>
              </button>
            );
          })}
        </div>

        {/* Dynamic Mascot Dialogue Bubble */}
        {selectedMascot && (
          <div className="mt-3 inline-flex items-center gap-2 px-4 py-1.5 bg-white rounded-2xl border-2 border-amber-200 shadow-2xs">
            <Volume2 className="w-4 h-4 text-pink-500" />
            <span className="text-xs sm:text-sm font-extrabold text-slate-700">
              {ANIMAL_CHARACTERS.find((c) => c.id === selectedMascot)?.title}:{' '}
              <span className="text-amber-700">
                "{ANIMAL_CHARACTERS.find((c) => c.id === selectedMascot)?.catchphrase}"
              </span>
            </span>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="w-full max-w-md flex flex-col gap-3">
        {/* Main PLAY Button (SOLO) */}
        <button
          id="home-btn-play"
          onClick={handleStartPlay}
          className="w-full py-3.5 sm:py-4 px-8 rounded-3xl bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-black text-xl sm:text-2xl shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-1 active:translate-y-0.5 active:scale-98 flex items-center justify-center gap-3 border-b-6 border-emerald-700"
        >
          <Play className="w-7 h-7 fill-white" />
          <span>▶ MAIN SOLO (1 PEMAIN)</span>
        </button>

        {/* 2-5 PLAYERS MULTIPLAYER BUTTON */}
        <button
          id="home-btn-multiplayer"
          onClick={handleStartMultiplayer}
          className="w-full py-3.5 px-8 rounded-3xl bg-gradient-to-r from-sky-500 via-indigo-500 to-purple-500 hover:from-sky-600 hover:to-purple-600 text-white font-black text-lg sm:text-xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5 active:translate-y-0.5 active:scale-98 flex items-center justify-center gap-3 border-b-5 border-indigo-700"
        >
          <Users className="w-6 h-6 sm:w-7 sm:h-7" />
          <span>👥 MULTIPLAYER (2-5 SISWA)</span>
        </button>
      </div>

      <div className="mt-4 flex flex-wrap justify-center items-center gap-3 sm:gap-4 text-xs font-extrabold text-slate-500">
        <span className="flex items-center gap-1">🧭 Misi Labirin 10 Pos</span>
        <span>•</span>
        <span className="flex items-center gap-1">⏱️ 20 Detik Kuis Cepat</span>
        <span>•</span>
        <span className="flex items-center gap-1">🧕 Didampingi Ummi Ayu</span>
      </div>
    </div>
  );
};
