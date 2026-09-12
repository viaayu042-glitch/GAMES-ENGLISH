import React, { useState, useEffect } from 'react';
import { MultipleChoiceQuestion } from '../types';
import { VocabIllustration } from '../utils/illustrations';
import { audio } from '../utils/audio';
import { Volume2, CheckCircle2, XCircle, Sparkles, ArrowRight, HelpCircle } from 'lucide-react';
import confetti from 'canvas-confetti';

interface GuessPictureLevelProps {
  questions: MultipleChoiceQuestion[];
  grade: 1 | 2;
  levelNumber: number;
  totalLevels: number;
  levelTitle: string;
  instructionEn: string;
  instructionId: string;
  onQuestionCorrect: () => void;
  onLevelComplete: () => void;
}

export const GuessPictureLevel: React.FC<GuessPictureLevelProps> = ({
  questions,
  grade,
  levelNumber,
  totalLevels,
  levelTitle,
  instructionEn,
  instructionId,
  onQuestionCorrect,
  onLevelComplete,
}) => {
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [shakenOption, setShakenOption] = useState<string | null>(null);
  const [hasAwardedPoints, setHasAwardedPoints] = useState<boolean>(false);

  const currentQ = questions[currentIdx];

  // Auto-speak question on load or question change
  useEffect(() => {
    setFeedback(null);
    setSelectedOption(null);
    setShakenOption(null);
    setHasAwardedPoints(false);

    if (currentQ) {
      const speechText = `${currentQ.questionText}. Look at the picture!`;
      audio.speak(speechText);
    }
  }, [currentIdx, currentQ]);

  const handleOptionClick = (option: string) => {
    audio.playPop();
    setSelectedOption(option);

    if (option === currentQ.correctAnswer) {
      // Correct!
      setFeedback('correct');
      audio.playCorrect();

      // Speak correct vocabulary word
      audio.speak(`Correct! Great job! It is a ${currentQ.correctAnswer}!`);

      if (!hasAwardedPoints) {
        onQuestionCorrect(); // +10 points
        setHasAwardedPoints(true);
      }

      // Small confetti burst
      try {
        confetti({
          particleCount: 25,
          spread: 50,
          origin: { y: 0.6 },
        });
      } catch {
        // ignore
      }
    } else {
      // Incorrect - Try again without penalty
      setFeedback('wrong');
      setShakenOption(option);
      audio.playWrong();
      audio.speak("Try again!");
      setTimeout(() => {
        setShakenOption(null);
      }, 600);
    }
  };

  const handleNextQuestion = () => {
    audio.playPop();
    if (currentIdx + 1 < questions.length) {
      setCurrentIdx((prev) => prev + 1);
    } else {
      onLevelComplete();
    }
  };

  const handleSpeakQuestion = () => {
    audio.speak(`${currentQ.questionText}`);
  };

  const progressPercent = Math.round(((currentIdx + (feedback === 'correct' ? 1 : 0)) / questions.length) * 100);

  return (
    <div className="w-full max-w-3xl mx-auto px-4 py-3 flex flex-col items-center">
      
      {/* Level Header & Progress */}
      <div className="w-full mb-4">
        <div className="flex items-center justify-between text-xs sm:text-sm font-extrabold text-slate-600 mb-1.5">
          <span className="flex items-center gap-1.5 text-amber-900 bg-amber-100 px-3 py-1 rounded-xl border border-amber-300">
            <span>{levelTitle}</span>
          </span>
          <span className="font-black text-slate-700 bg-white px-3 py-1 rounded-xl border border-slate-200">
            SOAL {currentIdx + 1} DARI {questions.length}
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden border border-slate-300 shadow-inner">
          <div
            className="h-full bg-gradient-to-r from-emerald-400 to-green-500 transition-all duration-500 rounded-full"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Instructions Banner */}
      <div className="w-full bg-white/95 rounded-2xl p-3 border-2 border-amber-200 shadow-sm mb-4 text-center relative flex items-center justify-center gap-2">
        <div>
          <h2 className="text-lg sm:text-2xl font-black text-slate-800 flex items-center justify-center gap-2">
            <span>{currentQ.questionText}</span>
            <button
              onClick={handleSpeakQuestion}
              className="p-1.5 rounded-full bg-pink-100 hover:bg-pink-200 text-pink-600 transition active:scale-90"
              title="Dengarkan Suara Pertanyaan"
            >
              <Volume2 className="w-5 h-5" />
            </button>
          </h2>
          <p className="text-xs sm:text-sm font-bold text-slate-500 mt-0.5">
            {instructionEn} • <span className="text-amber-800">{instructionId}</span>
          </p>
        </div>
      </div>

      {/* Big Picture Card (Super HD Crisp Vector) */}
      <div className="relative my-2">
        <div className={`transition-transform duration-300 ${feedback === 'correct' ? 'scale-105' : ''}`}>
          <VocabIllustration id={currentQ.vocabId} size="xl" />
        </div>

        {/* Floating Correct/Wrong Indicator */}
        {feedback === 'correct' && (
          <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 bg-emerald-500 text-white font-black text-sm sm:text-base px-5 py-1 rounded-full shadow-lg border-2 border-white flex items-center gap-1.5 animate-bounce whitespace-nowrap">
            <CheckCircle2 className="w-5 h-5" />
            <span>✅ CORRECT! GREAT JOB! (+10)</span>
          </div>
        )}

        {feedback === 'wrong' && (
          <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 bg-rose-500 text-white font-black text-sm px-4 py-1 rounded-full shadow-lg border-2 border-white flex items-center gap-1.5 animate-pulse whitespace-nowrap">
            <XCircle className="w-4 h-4" />
            <span>❌ TRY AGAIN! (Ayo Coba Lagi)</span>
          </div>
        )}
      </div>

      {/* 3 Big Option Choices */}
      <div className="w-full grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mt-6">
        {currentQ.options.map((option, idx) => {
          const letter = String.fromCharCode(65 + idx); // 'A', 'B', 'C'
          const isSelected = selectedOption === option;
          const isCorrect = feedback === 'correct' && option === currentQ.correctAnswer;
          const isShaken = shakenOption === option;

          return (
            <button
              key={option}
              id={`option-btn-${idx}`}
              onClick={() => handleOptionClick(option)}
              disabled={feedback === 'correct'}
              className={`group relative py-4 sm:py-5 px-4 rounded-3xl font-black text-xl sm:text-2xl transition-all duration-200 border-3 flex items-center justify-center gap-3 shadow-md ${
                isShaken ? 'animate-[wiggle_0.3s_ease-in-out]' : ''
              } ${
                isCorrect
                  ? 'bg-emerald-500 border-emerald-600 text-white shadow-emerald-200 scale-105 ring-4 ring-emerald-300'
                  : isSelected && feedback === 'wrong'
                  ? 'bg-rose-100 border-rose-400 text-rose-800'
                  : 'bg-white hover:bg-amber-50/80 border-amber-200/90 text-slate-800 hover:border-amber-400 hover:shadow-lg active:scale-95'
              }`}
            >
              <span className={`w-8 h-8 rounded-xl flex items-center justify-center text-sm sm:text-base font-extrabold ${
                isCorrect ? 'bg-emerald-700 text-white' : 'bg-slate-100 text-slate-600 group-hover:bg-amber-200'
              }`}>
                {letter}
              </span>
              <span>{option}</span>
            </button>
          );
        })}
      </div>

      {/* Next Button appears when answered correctly */}
      {feedback === 'correct' && (
        <div className="mt-6 w-full max-w-md animate-in fade-in slide-in-from-bottom-3">
          <button
            id="btn-next-question"
            onClick={handleNextQuestion}
            className="w-full py-3.5 px-6 rounded-3xl bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-black text-lg sm:text-xl shadow-xl flex items-center justify-center gap-2 transition transform hover:scale-102 active:scale-98 border-b-4 border-emerald-700"
          >
            <span>{currentIdx + 1 < questions.length ? 'LANJUT SOAL BERIKUTNYA' : 'SELESAIKAN LEVEL! 🎉'}</span>
            <ArrowRight className="w-6 h-6" />
          </button>
        </div>
      )}

    </div>
  );
};
