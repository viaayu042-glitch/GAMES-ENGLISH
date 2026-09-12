import React, { useState, useEffect } from 'react';
import { MultipleChoiceQuestion } from '../types';
import { VocabIllustration } from '../utils/illustrations';
import { audio } from '../utils/audio';
import { Volume2, Sparkles, CheckCircle2, XCircle, ArrowRight, Eye } from 'lucide-react';
import confetti from 'canvas-confetti';

interface MysteryPictureLevelProps {
  questions: MultipleChoiceQuestion[];
  onQuestionCorrect: () => void;
  onLevelComplete: () => void;
}

export const MysteryPictureLevel: React.FC<MysteryPictureLevelProps> = ({
  questions,
  onQuestionCorrect,
  onLevelComplete,
}) => {
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [shakenOption, setShakenOption] = useState<string | null>(null);
  const [hasAwardedPoints, setHasAwardedPoints] = useState<boolean>(false);
  const [isRevealed, setIsRevealed] = useState<boolean>(false);

  const currentQ = questions[currentIdx];

  useEffect(() => {
    setFeedback(null);
    setSelectedOption(null);
    setShakenOption(null);
    setHasAwardedPoints(false);
    setIsRevealed(false);

    if (currentQ) {
      audio.speak(`Mystery picture! Clue: ${currentQ.hint || ''}. What is this?`);
    }
  }, [currentIdx, currentQ]);

  const handleOptionClick = (option: string) => {
    audio.playPop();
    setSelectedOption(option);

    if (option === currentQ.correctAnswer) {
      setFeedback('correct');
      setIsRevealed(true);
      audio.playCorrect();
      audio.speak(`Correct! It's a ${currentQ.correctAnswer}! Well done!`);

      if (!hasAwardedPoints) {
        onQuestionCorrect();
        setHasAwardedPoints(true);
      }

      try {
        confetti({
          particleCount: 35,
          spread: 60,
          origin: { y: 0.6 },
        });
      } catch {
        // ignore
      }
    } else {
      setFeedback('wrong');
      setShakenOption(option);
      audio.playWrong();
      audio.speak("Try again!");
      setTimeout(() => {
        setShakenOption(null);
      }, 500);
    }
  };

  const handleNext = () => {
    audio.playPop();
    if (currentIdx + 1 < questions.length) {
      setCurrentIdx((prev) => prev + 1);
    } else {
      onLevelComplete();
    }
  };

  const handleSpeakClue = () => {
    if (currentQ.hint) {
      audio.speak(`Clue: ${currentQ.hint}`);
    }
  };

  const progressPercent = Math.round(((currentIdx + (feedback === 'correct' ? 1 : 0)) / questions.length) * 100);

  return (
    <div className="w-full max-w-3xl mx-auto px-4 py-3 flex flex-col items-center">
      
      {/* Level Header & Progress */}
      <div className="w-full mb-4">
        <div className="flex items-center justify-between text-xs sm:text-sm font-extrabold text-slate-600 mb-1.5">
          <span className="flex items-center gap-1.5 text-purple-900 bg-purple-100 px-3 py-1 rounded-xl border border-purple-300">
            <Sparkles className="w-3.5 h-3.5 text-purple-600" />
            <span>LEVEL 4: GUESS THE MYSTERY PICTURE</span>
          </span>
          <span className="font-black text-slate-700 bg-white px-3 py-1 rounded-xl border border-slate-200">
            SOAL {currentIdx + 1} DARI {questions.length}
          </span>
        </div>

        <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden border border-slate-300 shadow-inner">
          <div
            className="h-full bg-gradient-to-r from-purple-500 to-indigo-600 transition-all duration-500 rounded-full"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Mystery Clue Box */}
      <div className="w-full bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-4 border-2 border-purple-300 shadow-md mb-4 text-center">
        <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-indigo-200 text-indigo-900 text-xs font-black uppercase mb-1">
          <Eye className="w-3.5 h-3.5" />
          <span>PETUNJUK RAHASIA / CLUE</span>
        </div>

        <div className="flex items-center justify-center gap-2">
          <p className="text-lg sm:text-2xl font-black text-indigo-950">
            “{currentQ.hint}”
          </p>
          <button
            onClick={handleSpeakClue}
            className="p-1.5 rounded-full bg-pink-100 hover:bg-pink-200 text-pink-600 transition active:scale-90"
            title="Dengarkan Petunjuk Rahasia"
          >
            <Volume2 className="w-5 h-5" />
          </button>
        </div>
        <p className="text-xs text-slate-500 font-bold mt-1">
          Lihat bagian gambar yang terlihat dan pilih nama benda yang tepat!
        </p>
      </div>

      {/* Picture Card with Mystery Mask (Reveals on correct!) */}
      <div className="relative my-2">
        <div className={`transition-transform duration-500 ${isRevealed ? 'scale-110' : ''}`}>
          <VocabIllustration
            id={currentQ.vocabId}
            size="xl"
            mysteryMask={!isRevealed}
          />
        </div>

        {feedback === 'correct' && (
          <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 bg-emerald-500 text-white font-black text-sm sm:text-base px-5 py-1 rounded-full shadow-lg border-2 border-white flex items-center gap-1.5 animate-bounce whitespace-nowrap">
            <CheckCircle2 className="w-5 h-5" />
            <span>🎉 TERBUKA! {currentQ.correctAnswer.toUpperCase()}! (+10)</span>
          </div>
        )}

        {feedback === 'wrong' && (
          <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 bg-rose-500 text-white font-black text-sm px-4 py-1 rounded-full shadow-lg border-2 border-white flex items-center gap-1.5 animate-pulse whitespace-nowrap">
            <XCircle className="w-4 h-4" />
            <span>❌ TRY AGAIN! (Ayo Coba Lagi)</span>
          </div>
        )}
      </div>

      {/* 3 Big Options */}
      <div className="w-full grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mt-6">
        {currentQ.options.map((option, idx) => {
          const letter = String.fromCharCode(65 + idx);
          const isSelected = selectedOption === option;
          const isCorrect = feedback === 'correct' && option === currentQ.correctAnswer;
          const isShaken = shakenOption === option;

          return (
            <button
              key={option}
              id={`mystery-option-${idx}`}
              onClick={() => handleOptionClick(option)}
              disabled={feedback === 'correct'}
              className={`group relative py-4 sm:py-5 px-4 rounded-3xl font-black text-xl sm:text-2xl transition-all duration-200 border-3 flex items-center justify-center gap-3 shadow-md ${
                isShaken ? 'animate-[wiggle_0.3s_ease-in-out]' : ''
              } ${
                isCorrect
                  ? 'bg-emerald-500 border-emerald-600 text-white scale-105 ring-4 ring-emerald-300'
                  : isSelected && feedback === 'wrong'
                  ? 'bg-rose-100 border-rose-400 text-rose-800'
                  : 'bg-white hover:bg-purple-50 border-purple-200 text-slate-800 hover:border-purple-400 hover:shadow-lg active:scale-95'
              }`}
            >
              <span className={`w-8 h-8 rounded-xl flex items-center justify-center text-sm sm:text-base font-extrabold ${
                isCorrect ? 'bg-emerald-700 text-white' : 'bg-slate-100 text-slate-600 group-hover:bg-purple-200'
              }`}>
                {letter}
              </span>
              <span>{option}</span>
            </button>
          );
        })}
      </div>

      {/* Next Question Button */}
      {feedback === 'correct' && (
        <div className="mt-6 w-full max-w-md animate-in fade-in slide-in-from-bottom-3">
          <button
            id="btn-next-mystery"
            onClick={handleNext}
            className="w-full py-3.5 px-6 rounded-3xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-black text-lg sm:text-xl shadow-xl flex items-center justify-center gap-2 transition transform hover:scale-102 active:scale-98 border-b-4 border-indigo-800"
          >
            <span>{currentIdx + 1 < questions.length ? 'LANJUT SOAL BERIKUTNYA' : 'LIHAT HADIAH JUARA! 🏆'}</span>
            <ArrowRight className="w-6 h-6" />
          </button>
        </div>
      )}

    </div>
  );
};
