import React, { useEffect } from 'react';
import { Player, Grade } from '../types';
import { AnimalAvatar } from '../utils/characters';
import { UmmiAyuTeacher } from './UmmiAyuTeacher';
import { audio } from '../utils/audio';
import { RotateCcw, Home, Star, Trophy, Sparkles, Award } from 'lucide-react';
import confetti from 'canvas-confetti';

interface GameCompleteScreenProps {
  grade: Grade;
  mode: 'solo' | 'multiplayer';
  score: number;
  players?: Player[];
  soloPlayer?: Player;
  onPlayAgain: () => void;
  onHome: () => void;
}

export const GameCompleteScreen: React.FC<GameCompleteScreenProps> = ({
  grade,
  mode,
  score,
  players = [],
  soloPlayer,
  onPlayAgain,
  onHome,
}) => {
  useEffect(() => {
    audio.playVictory();

    if (mode === 'solo') {
      const pName = soloPlayer ? soloPlayer.name : 'Siswa Juara';
      audio.speak(
        `Alhamdulillah! Selamat ${pName}! Kamu adalah Bintang Bahasa Inggris bersama Ummi Ayu! Masya Allah luar biasa!`
      );
    } else {
      audio.speak(
        'Alhamdulillah! Selamat kepada seluruh anak-anak hebat! Pertandingan bahasa Inggris yang luar biasa bersama Ummi Ayu!'
      );
    }

    // Festive Confetti burst
    const end = Date.now() + 2.5 * 1000;
    const colors = ['#38BDF8', '#4ADE80', '#F472B6', '#FBBF24', '#A78BFA'];

    (function frame() {
      confetti({
        particleCount: 4,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors,
      });
      confetti({
        particleCount: 4,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors,
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    })();
  }, [grade, mode]);

  // Sort players by score descending for multiplayer leaderboard
  const sortedPlayers = [...players].sort((a, b) => b.score - a.score);

  return (
    <div className="w-full max-w-3xl mx-auto px-4 py-4 sm:py-6 flex flex-col items-center text-center">
      {/* Central Trophy Icon */}
      <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-gradient-to-tr from-amber-400 via-yellow-300 to-amber-200 flex items-center justify-center shadow-xl border-4 border-amber-300 mb-2 animate-bounce">
        {grade === 1 ? (
          <Award className="w-12 h-12 sm:w-14 sm:h-14 text-amber-950" />
        ) : (
          <Trophy className="w-12 h-12 sm:w-14 sm:h-14 text-amber-950" />
        )}
      </div>

      {/* Main Title & Congratulations */}
      {mode === 'solo' ? (
        grade === 1 ? (
          <>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-800 tracking-tight">
              🎉 GREAT JOB! KAMU HEBAT! 🎉
            </h2>
            <p className="text-lg sm:text-xl font-black text-sky-600 mt-1 mb-1">
              “You are an English Star!”
            </p>
            {/* 3 Stars for Class 1 */}
            <div className="flex items-center justify-center gap-3 my-2">
              {[1, 2, 3].map((s) => (
                <Star
                  key={s}
                  className="w-8 h-8 sm:w-10 sm:h-10 text-amber-400 fill-amber-400 drop-shadow-md animate-pulse"
                />
              ))}
            </div>
          </>
        ) : (
          <>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-800 tracking-tight">
              🏆 CONGRATULATIONS! JUARA!
            </h2>
            <p className="text-lg sm:text-xl font-black text-purple-600 mt-1 mb-1">
              “You are a Fun English Champion!”
            </p>
            {/* 5 Stars for Class 2 */}
            <div className="flex items-center justify-center gap-2 my-2">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star
                  key={s}
                  className="w-7 h-7 sm:w-9 sm:h-9 text-amber-400 fill-amber-400 drop-shadow-md animate-pulse"
                />
              ))}
            </div>
          </>
        )
      ) : (
        <>
          <h2 className="text-2xl sm:text-4xl font-black text-slate-800 tracking-tight">
            🏆 PERTANDINGAN SELESAI!
          </h2>
          <p className="text-base sm:text-xl font-black text-indigo-600 mt-1 mb-2">
            “Kalian Semua Hebat Belajar Bahasa Inggris!”
          </p>
        </>
      )}

      {/* Ummi Ayu Teacher Congratulatory Message */}
      <div className="w-full max-w-xl bg-gradient-to-r from-amber-100/90 via-orange-50/90 to-amber-100/90 rounded-3xl p-3.5 sm:p-4 border-3 border-amber-300 shadow-md mb-4 flex items-center gap-3 text-left">
        <UmmiAyuTeacher
          size="md"
          animate={true}
          interactiveAudio={true}
        />
        <div className="flex-1">
          <div className="text-[11px] font-black text-amber-900 flex items-center gap-1 mb-0.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            Ucapan Selamat dari Ummi Ayu:
          </div>
          <p className="text-xs sm:text-sm font-bold text-slate-800 leading-snug">
            "Alhamdulillah, masya Allah anak-anak hebat! Semua 10 pos soal kurikulum telah diselesaikan dengan sangat baik. Teruslah semangat belajar bahasa Inggris ya!"
          </p>
        </div>
      </div>

      {/* Solo Score Display */}
      {mode === 'solo' && (
        <div className="w-full max-w-sm bg-gradient-to-r from-amber-50 to-yellow-50 rounded-3xl p-4 border-3 border-amber-300 shadow-lg my-2 flex flex-col items-center">
          {soloPlayer && (
            <div className="flex items-center gap-2 mb-1.5 bg-white/90 px-3 py-1.5 rounded-2xl border border-amber-200">
              <AnimalAvatar id={soloPlayer.animal.id} size="sm" animate={true} />
              <span className="text-sm sm:text-base font-black text-slate-800">
                {soloPlayer.name} ({soloPlayer.animal.name})
              </span>
            </div>
          )}
          <span className="text-xs font-black text-amber-800 tracking-widest uppercase block mb-1">
            NILAI AKHIR / FINAL SCORE
          </span>
          <div className="text-3xl sm:text-4xl font-black text-amber-950">
            ⭐ {score} POIN
          </div>
          <p className="text-xs sm:text-sm font-black text-emerald-700 mt-2 bg-emerald-100/80 py-1 px-3 rounded-xl inline-block">
            “Keep learning English!” 🌟
          </p>
        </div>
      )}

      {/* Multiplayer Leaderboard / Podium */}
      {mode === 'multiplayer' && (
        <div className="w-full max-w-md bg-white rounded-3xl p-4 border-3 border-indigo-200 shadow-xl my-2">
          <h3 className="text-xs sm:text-sm font-black text-indigo-900 uppercase tracking-wider mb-2.5 flex items-center justify-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-500" />
            KLASEMEN AKHIR SISWA
          </h3>

          <div className="space-y-2">
            {sortedPlayers.map((player, rank) => {
              const medals = ['🥇', '🥈', '🥉', '🎖️', '🎖️'];
              return (
                <div
                  key={player.id}
                  className={`flex items-center justify-between p-2.5 rounded-2xl border-2 transition ${
                    rank === 0
                      ? 'bg-amber-100/80 border-amber-400 shadow-md scale-102 ring-2 ring-amber-300'
                      : rank === 1
                      ? 'bg-slate-100 border-slate-300 shadow-xs'
                      : 'bg-white border-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-xl">{medals[rank] || '🎖️'}</span>
                    <AnimalAvatar id={player.animal.id} size="sm" />
                    <div className="text-left">
                      <div className="text-xs sm:text-sm font-black text-slate-800">
                        {player.name}
                      </div>
                      <div className="text-[10px] text-slate-500 font-bold">
                        {player.animal.name}
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-base sm:text-lg font-black text-amber-900">
                      {player.score} pt
                    </div>
                    <span className="text-[10px] text-slate-400 font-bold">
                      Juara {rank + 1}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 w-full max-w-md mt-4">
        <button
          id="btn-play-again"
          onClick={() => {
            audio.playPop();
            onPlayAgain();
          }}
          className="flex-1 py-3.5 px-6 rounded-2xl bg-amber-400 hover:bg-amber-500 text-amber-950 font-black text-base sm:text-lg shadow-md hover:shadow-lg transition transform active:scale-95 flex items-center justify-center gap-2 border-b-4 border-amber-600"
        >
          <RotateCcw className="w-5 h-5" />
          <span>MAIN LAGI</span>
        </button>

        <button
          id="btn-go-home"
          onClick={() => {
            audio.playPop();
            onHome();
          }}
          className="flex-1 py-3.5 px-6 rounded-2xl bg-white hover:bg-slate-100 text-slate-700 font-black text-base sm:text-lg border-2 border-slate-300 shadow-sm transition transform active:scale-95 flex items-center justify-center gap-2"
        >
          <Home className="w-5 h-5" />
          <span>BERANDA</span>
        </button>
      </div>
    </div>
  );
};
