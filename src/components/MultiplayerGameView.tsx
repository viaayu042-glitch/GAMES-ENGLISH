import React, { useState, useEffect, useRef } from 'react';
import { Player, MultipleChoiceQuestion, Grade } from '../types';
import { VocabIllustration } from '../utils/illustrations';
import { AnimalAvatar } from '../utils/characters';
import { UmmiAyuTeacher } from './UmmiAyuTeacher';
import { audio } from '../utils/audio';
import { Clock, Volume2, Award, CheckCircle2, XCircle, ArrowRight, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

interface MultiplayerGameViewProps {
  players: Player[];
  questions: MultipleChoiceQuestion[];
  grade: Grade;
  onFinishMatch: (finalPlayers: Player[]) => void;
}

export const MultiplayerGameView: React.FC<MultiplayerGameViewProps> = ({
  players,
  questions,
  grade,
  onFinishMatch,
}) => {
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<number>(20);
  const [gameState, setGameState] = useState<'answering' | 'revealing'>('answering');
  
  // Track each player's status for the current question
  const [currentPlayers, setCurrentPlayers] = useState<Player[]>(players);
  const timerRef = useRef<number | null>(null);

  const currentQ = questions[currentIdx];

  // Start round timer & speech
  useEffect(() => {
    setTimeLeft(20);
    setGameState('answering');

    // Reset player answers for this question
    setCurrentPlayers((prev) =>
      prev.map((p) => ({
        ...p,
        selectedAnswer: null,
        answeredAt: null,
        isCorrect: null,
      }))
    );

    // Read question aloud
    if (currentQ) {
      audio.speak(`${currentQ.questionText}. 20 seconds!`);
    }

    if (timerRef.current) clearInterval(timerRef.current);

    timerRef.current = window.setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          return 0;
        }
        if (prev <= 6) {
          audio.playTick(); // Tick sound in final 5 seconds
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [currentIdx, currentQ]);

  // When timer hits 0 while still answering, reveal automatically
  useEffect(() => {
    if (timeLeft === 0 && gameState === 'answering') {
      revealAnswers();
    }
  }, [timeLeft, gameState]);

  // Handle a player choosing an option
  const handlePlayerChoice = (playerId: number, option: string) => {
    if (gameState !== 'answering') return;
    audio.playPop();

    setCurrentPlayers((prev) => {
      const updated = prev.map((p) => {
        if (p.id === playerId && p.selectedAnswer === null) {
          return {
            ...p,
            selectedAnswer: option,
            answeredAt: 20 - timeLeft,
          };
        }
        return p;
      });

      // Check if all players have locked in their answers
      const allAnswered = updated.every((p) => p.selectedAnswer !== null);
      if (allAnswered) {
        setTimeout(() => {
          revealAnswersWithPlayers(updated);
        }, 400);
      }

      return updated;
    });
  };

  const revealAnswers = () => {
    revealAnswersWithPlayers(currentPlayers);
  };

  const revealAnswersWithPlayers = (playerList: Player[]) => {
    if (timerRef.current) clearInterval(timerRef.current);
    setGameState('revealing');

    let anyCorrect = false;

    const evaluated = playerList.map((p) => {
      const isCorrect = p.selectedAnswer === currentQ.correctAnswer;
      if (isCorrect) anyCorrect = true;
      return {
        ...p,
        score: isCorrect ? p.score + 10 : p.score,
        isCorrect,
      };
    });

    setCurrentPlayers(evaluated);

    if (anyCorrect) {
      audio.playCorrect();
      audio.speak(`The correct answer is ${currentQ.correctAnswer}! Great job!`);
      try {
        confetti({
          particleCount: 40,
          spread: 60,
          origin: { y: 0.5 },
        });
      } catch {
        // ignore
      }
    } else {
      audio.playWrong();
      audio.speak(`Time's up! The answer is ${currentQ.correctAnswer}!`);
    }
  };

  const handleNext = () => {
    audio.playPop();
    if (currentIdx + 1 < questions.length) {
      setCurrentIdx((prev) => prev + 1);
    } else {
      audio.playVictory();
      onFinishMatch(currentPlayers);
    }
  };

  const handleSpeakQuestion = () => {
    audio.speak(`${currentQ.questionText}`);
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-2 sm:px-4 py-2 flex flex-col items-center">
      
      {/* Top Header: Question count, 20s Timer Ring & Live Rankings */}
      <div className="w-full bg-white/95 rounded-2xl sm:rounded-3xl p-3 border-3 border-indigo-200 shadow-md mb-3 flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-indigo-100 text-indigo-900 border border-indigo-300 rounded-xl text-xs sm:text-sm font-black uppercase">
            SOAL BERSAMA {currentIdx + 1} / {questions.length}
          </span>
          <span className="text-xs text-slate-500 font-bold hidden sm:inline">
            Semua pemain menjawab bersamaan!
          </span>
        </div>

        {/* 20 Seconds Big Countdown Timer */}
        <div className={`flex items-center gap-2 px-4 py-1.5 rounded-2xl border-2 font-black transition-all ${
          timeLeft <= 5 
            ? 'bg-rose-100 border-rose-400 text-rose-700 animate-bounce text-lg sm:text-xl' 
            : 'bg-amber-100 border-amber-400 text-amber-900 text-base sm:text-lg'
        }`}>
          <Clock className={`w-5 h-5 ${timeLeft <= 5 ? 'text-rose-600 animate-spin' : 'text-amber-700'}`} />
          <span>WAKTU:</span>
          <span className="text-xl sm:text-2xl font-black">{timeLeft}s</span>
        </div>

        {/* Question Speaker */}
        <button
          onClick={handleSpeakQuestion}
          className="p-2 rounded-xl bg-pink-100 hover:bg-pink-200 text-pink-700 font-bold text-xs flex items-center gap-1"
          title="Baca Soal"
        >
          <Volume2 className="w-4 h-4" />
          <span className="hidden sm:inline">Baca Soal</span>
        </button>
      </div>

      {/* Main Central Question Card (Projector / Screen Center with Ummi Ayu) */}
      <div className="w-full max-w-3xl bg-white/95 rounded-3xl p-4 sm:p-5 border-3 border-amber-200 shadow-lg flex flex-col items-center text-center relative mb-4">
        {/* Ummi Ayu Teacher Banner */}
        <div className="w-full bg-gradient-to-r from-amber-50 via-orange-50 to-amber-50 rounded-2xl p-2.5 border-2 border-amber-200 mb-3 flex items-center gap-3">
          <UmmiAyuTeacher
            size="sm"
            animate={true}
            interactiveAudio={false}
          />
          <div className="flex-1 text-left">
            <span className="text-[10px] font-black text-amber-800 uppercase tracking-wider block">
              Ummi Ayu Membimbing:
            </span>
            <h2 className="text-lg sm:text-2xl font-black text-slate-800">
              {currentQ.questionText}
            </h2>
            <p className="text-xs font-bold text-amber-800">
              {currentQ.questionTextId}
            </p>
          </div>
        </div>

        {/* Big HD Vector Illustration */}
        <div className="my-1">
          <VocabIllustration id={currentQ.vocabId} size="lg" />
        </div>

        {/* Reveal correct answer announcement */}
        {gameState === 'revealing' && (
          <div className="mt-2 py-1.5 px-6 rounded-full bg-emerald-500 text-white font-black text-base sm:text-xl shadow-md border-2 border-white flex items-center gap-2 animate-bounce">
            <CheckCircle2 className="w-6 h-6" />
            <span>JAWABAN BENAR: {currentQ.correctAnswer.toUpperCase()}!</span>
          </div>
        )}

        {/* Options list displayed on main screen for clarity */}
        <div className="w-full grid grid-cols-3 gap-2 sm:gap-3 mt-3">
          {currentQ.options.map((opt, idx) => {
            const letter = String.fromCharCode(65 + idx);
            const isCorrectAnswer = gameState === 'revealing' && opt === currentQ.correctAnswer;
            return (
              <div
                key={opt}
                className={`py-2 px-3 rounded-2xl border-2 text-center font-black text-sm sm:text-lg transition ${
                  isCorrectAnswer
                    ? 'bg-emerald-500 border-emerald-600 text-white shadow-md scale-105 ring-3 ring-emerald-300'
                    : 'bg-slate-50 border-slate-200 text-slate-700'
                }`}
              >
                <span className="text-xs bg-slate-200/80 px-1.5 py-0.5 rounded-md mr-1.5 text-slate-700 font-bold">
                  {letter}
                </span>
                <span>{opt}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Simultaneous 2-5 Player Answering Stations */}
      <div className="w-full">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-black text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-500" />
            PAPAN JAWABAN MASING-MASING SISWA (KLIK PILIHAN KAMU):
          </span>
          {gameState === 'revealing' && (
            <button
              id="btn-mp-next-question"
              onClick={handleNext}
              className="py-1.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs sm:text-sm flex items-center gap-1.5 shadow-md transition transform active:scale-95 animate-pulse"
            >
              <span>{currentIdx + 1 < questions.length ? 'SOAL BERIKUTNYA' : 'LIHAT JUARA! 🏆'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Responsive Grid for 2, 3, 4, or 5 Players */}
        <div className={`grid gap-3 ${
          currentPlayers.length === 2 
            ? 'grid-cols-1 sm:grid-cols-2' 
            : currentPlayers.length === 3 
            ? 'grid-cols-1 sm:grid-cols-3' 
            : currentPlayers.length === 4 
            ? 'grid-cols-2 sm:grid-cols-4' 
            : 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-5'
        }`}>
          {currentPlayers.map((player) => {
            const hasAnswered = player.selectedAnswer !== null;

            return (
              <div
                key={player.id}
                className={`rounded-2xl p-3 border-3 shadow-md flex flex-col justify-between transition-all ${
                  gameState === 'revealing'
                    ? player.isCorrect
                      ? 'bg-emerald-50 border-emerald-400 ring-2 ring-emerald-300'
                      : 'bg-rose-50 border-rose-300'
                    : hasAnswered
                    ? 'bg-amber-50 border-amber-400 ring-2 ring-amber-200'
                    : 'bg-white border-slate-200'
                }`}
              >
                {/* Player Mascot Header */}
                <div className="flex items-center gap-2 mb-2">
                  <AnimalAvatar id={player.animal.id} size="sm" animate={gameState === 'revealing' && Boolean(player.isCorrect)} />
                  <div className="overflow-hidden">
                    <h4 className="text-xs sm:text-sm font-black text-slate-800 truncate">
                      {player.name}
                    </h4>
                    <span className="text-[10px] font-extrabold text-amber-700 block">
                      ⭐ {player.score} Poin
                    </span>
                  </div>
                </div>

                {/* State: Answering Buttons */}
                {gameState === 'answering' ? (
                  hasAnswered ? (
                    <div className="py-4 text-center bg-white/90 rounded-xl border border-amber-300 shadow-inner flex flex-col items-center">
                      <span className="text-xl mb-1">🔒</span>
                      <span className="text-xs font-black text-amber-800">
                        SUDAH DIKUNCI!
                      </span>
                      <span className="text-[10px] text-slate-400 font-bold">
                        Menunggu waktu habis...
                      </span>
                    </div>
                  ) : (
                    <div className="grid grid-cols-3 gap-1.5">
                      {currentQ.options.map((opt, optIdx) => {
                        const letter = String.fromCharCode(65 + optIdx);
                        return (
                          <button
                            key={opt}
                            id={`p${player.id}-btn-${optIdx}`}
                            onClick={() => handlePlayerChoice(player.id, opt)}
                            className="py-2.5 rounded-xl bg-indigo-50 hover:bg-indigo-500 hover:text-white border border-indigo-200 text-indigo-950 font-black text-sm transition transform active:scale-90 shadow-xs flex flex-col items-center justify-center"
                          >
                            <span className="text-[10px] opacity-70">{letter}</span>
                            <span className="truncate max-w-full px-1 text-xs">{opt}</span>
                          </button>
                        );
                      })}
                    </div>
                  )
                ) : (
                  /* State: Revealing Results for this player */
                  <div className="py-2 px-2 rounded-xl text-center flex flex-col items-center justify-center">
                    {player.isCorrect ? (
                      <div className="flex flex-col items-center text-emerald-700">
                        <CheckCircle2 className="w-6 h-6 text-emerald-500 mb-0.5" />
                        <span className="text-xs font-black">BENAR! (+10)</span>
                        <span className="text-[10px] font-bold text-slate-500">
                          Jawaban: {player.selectedAnswer}
                        </span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center text-rose-600">
                        <XCircle className="w-6 h-6 text-rose-500 mb-0.5" />
                        <span className="text-xs font-black">
                          {player.selectedAnswer ? 'BELUM TEPAT' : 'WAKTU HABIS'}
                        </span>
                        <span className="text-[10px] font-bold text-slate-500">
                          {player.selectedAnswer ? `Pilih: ${player.selectedAnswer}` : 'Tidak menjawab'}
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
