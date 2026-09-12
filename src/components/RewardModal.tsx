import React, { useEffect } from 'react';
import { Sparkles, Star, ArrowRight, Award } from 'lucide-react';
import { audio } from '../utils/audio';
import confetti from 'canvas-confetti';

interface RewardModalProps {
  levelNumber: number;
  totalLevels: number;
  grade: 1 | 2;
  currentScore: number;
  onNextLevel: () => void;
}

export const RewardModal: React.FC<RewardModalProps> = ({
  levelNumber,
  totalLevels,
  grade,
  currentScore,
  onNextLevel,
}) => {
  useEffect(() => {
    audio.playVictory();
    audio.speak(`Level ${levelNumber} Complete! Great job!`);

    try {
      confetti({
        particleCount: 50,
        spread: 80,
        origin: { y: 0.5 },
      });
    } catch {
      // ignore
    }
  }, [levelNumber]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-md bg-white rounded-3xl p-6 border-4 border-amber-300 shadow-2xl text-center flex flex-col items-center relative overflow-hidden animate-in zoom-in-95">
        
        {/* Decorative Top Sparkles */}
        <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-amber-400 to-yellow-300 flex items-center justify-center shadow-lg mb-3 animate-bounce">
          <Award className="w-10 h-10 text-amber-950" />
        </div>

        <span className="px-3.5 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-black uppercase tracking-wider mb-2 border border-amber-300 flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5 text-amber-600" /> LEVEL SELESAI!
        </span>

        <h3 className="text-2xl sm:text-3xl font-black text-slate-800 mb-1">
          🎉 LEVEL COMPLETE!
        </h3>

        <p className="text-sm font-bold text-slate-600 mb-4">
          Hebat sekali! Kamu berhasil menyelesaikan Level {levelNumber} dari {totalLevels}!
        </p>

        {/* Stars */}
        <div className="flex items-center justify-center gap-2 mb-4">
          {[1, 2, 3].map((star) => (
            <Star
              key={star}
              className="w-8 h-8 text-amber-400 fill-amber-400 animate-pulse drop-shadow"
            />
          ))}
        </div>

        {/* Score Chip */}
        <div className="w-full bg-amber-50 rounded-2xl p-3 border border-amber-200 mb-6">
          <span className="text-xs font-bold text-amber-800 uppercase block">SKOR SAAT INI</span>
          <span className="text-2xl font-black text-amber-900">⭐ {currentScore} POIN</span>
        </div>

        {/* Continue Button */}
        <button
          id="modal-btn-next-level"
          onClick={() => {
            audio.playPop();
            onNextLevel();
          }}
          className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-black text-lg shadow-lg flex items-center justify-center gap-2 transition transform hover:scale-102 active:scale-98 border-b-4 border-emerald-700"
        >
          <span>LANJUT KE LEVEL BERIKUTNYA</span>
          <ArrowRight className="w-5 h-5" />
        </button>

      </div>
    </div>
  );
};
