import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Grade, MultipleChoiceQuestion, Player } from '../types';
import { VocabIllustration } from '../utils/illustrations';
import { AnimalAvatar } from '../utils/characters';
import { UmmiAyuTeacher } from './UmmiAyuTeacher';
import { audio } from '../utils/audio';
import { VOCAB_DICTIONARY } from '../utils/gameData';
import {
  Volume2,
  Sparkles,
  Award,
  CheckCircle2,
  XCircle,
  Trophy,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Compass,
  Users,
  User,
  Heart,
  Clock,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface MazeMissionLevelProps {
  grade: Grade;
  mode: 'solo' | 'multiplayer';
  players: Player[]; // 1 player for solo, 2-5 players for multiplayer
  questions: MultipleChoiceQuestion[]; // 10 questions!
  onFinishMaze: (finalPlayers: Player[], totalScore: number) => void;
  onExitToMenu: () => void;
}

interface CheckpointItem {
  id: number; // 1 to 10
  x: number;
  y: number;
  question: MultipleChoiceQuestion;
  isCompleted: boolean;
  wasCorrect: boolean;
}

// 11 x 11 Medium-Difficulty Maze Grid
// 1 = Wall, 0 = Walkable Path
const MEDIUM_MAZE_GRID = [
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1], // 0
  [1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1], // 1: (1,1) Start
  [1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1], // 2
  [1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 1], // 3
  [1, 0, 1, 1, 1, 1, 1, 0, 1, 0, 1], // 4
  [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1], // 5
  [1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 1], // 6
  [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 1], // 7
  [1, 0, 1, 1, 1, 1, 1, 0, 1, 0, 1], // 8
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1], // 9: (9,9) Goal
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1], // 10
];

// Coordinates for exactly 10 checkpoints across the maze
const CHECKPOINT_COORDINATES = [
  { x: 3, y: 1 }, // Pos 1 (Top left)
  { x: 7, y: 1 }, // Pos 2 (Top right)
  { x: 9, y: 2 }, // Pos 3 (Top right corner)
  { x: 5, y: 3 }, // Pos 4 (Upper center junction)
  { x: 1, y: 4 }, // Pos 5 (Left corridor)
  { x: 5, y: 5 }, // Pos 6 (Center crossroad)
  { x: 9, y: 5 }, // Pos 7 (Right midpoint)
  { x: 3, y: 7 }, // Pos 8 (Lower left loop)
  { x: 7, y: 7 }, // Pos 9 (Lower right junction)
  { x: 3, y: 9 }, // Pos 10 (Final approach corridor)
];

const GOAL_COORD = { x: 9, y: 9 };

export const MazeMissionLevel: React.FC<MazeMissionLevelProps> = ({
  grade,
  mode,
  players,
  questions,
  onFinishMaze,
  onExitToMenu,
}) => {
  // Current position of the explorer mascot
  const [playerPos, setPlayerPos] = useState<{ x: number; y: number }>({ x: 1, y: 1 });
  const [facingDir, setFacingDir] = useState<'left' | 'right'>('right');

  // Players state with scores
  const [currentPlayers, setCurrentPlayers] = useState<Player[]>(players);
  const [activeNavigatorIdx, setActiveNavigatorIdx] = useState<number>(0);

  // 10 Checkpoints
  const [checkpoints, setCheckpoints] = useState<CheckpointItem[]>([]);
  const [activeQuestionCheckpoint, setActiveQuestionCheckpoint] = useState<CheckpointItem | null>(null);

  // 20-Second Question Timer state
  const [questionTimeLeft, setQuestionTimeLeft] = useState<number>(20);
  const [isTimedOut, setIsTimedOut] = useState<boolean>(false);
  const questionTimerRef = useRef<number | null>(null);

  // Question modal state (Solo)
  const [soloSelectedOption, setSoloSelectedOption] = useState<string | null>(null);
  const [soloFeedback, setSoloFeedback] = useState<'correct' | 'wrong' | null>(null);

  // Question modal state (Multiplayer 2-5 Players)
  // Maps playerId -> option chosen
  const [multiplayerAnswers, setMultiplayerAnswers] = useState<Record<number, string>>({});
  const [multiplayerRevealed, setMultiplayerRevealed] = useState<boolean>(false);

  // Ummi Ayu teacher dialogue state
  const [teacherTip, setTeacherTip] = useState<string>(
    "Assalamu'alaikum anak-anak hebat! Ayo jelajahi labirin dan temukan 10 pos soal bahasa Inggris bersama Ummi Ayu!"
  );

  const [stepsCount, setStepsCount] = useState<number>(0);
  const [isGoalUnlocked, setIsGoalUnlocked] = useState<boolean>(false);

  // The active navigator player (drives the mascot in the maze)
  const activeNavigator = currentPlayers[activeNavigatorIdx % currentPlayers.length] || currentPlayers[0];

  // Initialize 10 checkpoints with 10 questions
  useEffect(() => {
    const items: CheckpointItem[] = CHECKPOINT_COORDINATES.map((coord, index) => ({
      id: index + 1,
      x: coord.x,
      y: coord.y,
      question: questions[index % questions.length],
      isCompleted: false,
      wasCorrect: false,
    }));

    setCheckpoints(items);
    setPlayerPos({ x: 1, y: 1 });
    setStepsCount(0);
    setIsGoalUnlocked(false);
    setActiveQuestionCheckpoint(null);
    setSoloSelectedOption(null);
    setSoloFeedback(null);
    setMultiplayerAnswers({});
    setMultiplayerRevealed(false);

    if (mode === 'solo') {
      audio.speak(
        `Hello ${activeNavigator.name}! Jelajahi labirin dan selesaikan 10 pos soal bersama Ummi Ayu!`
      );
      setTeacherTip(
        `Semangat ${activeNavigator.name}! Gunakan tombol panah atau sentuh jalan labirin untuk menemukan 10 pos soal!`
      );
    } else {
      audio.speak(
        `Multiplayer Maze Mission with ${players.length} players! 10 checkpoints ready!`
      );
      setTeacherTip(
        `Selamat datang regu penjelajah! Ada 10 pos soal, mari bergiliran memimpin dan selesaikan semua pos bersama Ummi Ayu!`
      );
    }
  }, [questions, mode, players.length]);

  // Check if all 10 checkpoints are completed (either correct or missed)
  useEffect(() => {
    if (checkpoints.length > 0) {
      const allDone = checkpoints.every((c) => c.isCompleted);
      if (allDone && !isGoalUnlocked) {
        setIsGoalUnlocked(true);
        audio.playVictory();
        audio.speak(
          'Masya Allah, hebat sekali! Seluruh 10 pos soal telah selesai! Gerbang Piala Emas telah terbuka!'
        );
        setTeacherTip(
          'Alhamdulillah! Semua 10 pos sudah terselesaikan! Ayo segera menuju Piala Emas di ujung labirin!'
        );
        try {
          confetti({
            particleCount: 50,
            spread: 70,
            origin: { y: 0.6 },
          });
        } catch {
          // ignore
        }
      }
    }
  }, [checkpoints, isGoalUnlocked]);

  // Try move in maze
  const tryMove = useCallback(
    (dx: number, dy: number) => {
      // Block movement when question modal is active
      if (activeQuestionCheckpoint) return;

      const newX = playerPos.x + dx;
      const newY = playerPos.y + dy;

      // Bounds & Wall check
      if (
        newY < 0 ||
        newY >= MEDIUM_MAZE_GRID.length ||
        newX < 0 ||
        newX >= MEDIUM_MAZE_GRID[0].length
      ) {
        return;
      }

      if (MEDIUM_MAZE_GRID[newY][newX] === 1) {
        return; // Hit wall
      }

      if (dx < 0) setFacingDir('left');
      if (dx > 0) setFacingDir('right');

      setPlayerPos({ x: newX, y: newY });
      setStepsCount((prev) => prev + 1);
      audio.playPop();

      // Check if stepped on an uncompleted checkpoint
      const hitCheckpoint = checkpoints.find(
        (cp) => cp.x === newX && cp.y === newY && !cp.isCompleted
      );

      if (hitCheckpoint) {
        // Open question challenge with Ummi Ayu
        setActiveQuestionCheckpoint(hitCheckpoint);
        setSoloSelectedOption(null);
        setSoloFeedback(null);
        setMultiplayerAnswers({});
        setMultiplayerRevealed(false);
        setQuestionTimeLeft(20);
        setIsTimedOut(false);
        audio.playPop();

        const qText = hitCheckpoint.question.questionText;
        audio.speak(
          `Pos ${hitCheckpoint.id}! ${qText}. Waktu 20 detik, ayo jawab!`
        );
        setTeacherTip(
          `Pos ${hitCheckpoint.id}: ${hitCheckpoint.question.questionTextId || hitCheckpoint.question.questionText}. Waktu 20 detik, pilih jawabanmu!`
        );
        return;
      }

      // Check if stepped on the goal!
      if (newX === GOAL_COORD.x && newY === GOAL_COORD.y) {
        const allCompleted = checkpoints.every((c) => c.isCompleted);
        if (allCompleted) {
          audio.playVictory();
          // Calculate total score
          const totalScore = currentPlayers.reduce((acc, p) => acc + p.score, 0);
          onFinishMaze(currentPlayers, totalScore + 20); // +20 completion bonus
        } else {
          const remaining = checkpoints.filter((c) => !c.isCompleted).length;
          audio.speak(
            `Masih ada ${remaining} pos soal yang belum diselesaikan! Ayo selesaikan semua 10 pos dahulu!`
          );
          setTeacherTip(
            `Gerbang Piala Emas masih terkunci! Masih ada ${remaining} pos yang belum dikunjungi. Semangat!`
          );
        }
      }
    },
    [playerPos, activeQuestionCheckpoint, checkpoints, currentPlayers, onFinishMaze]
  );

  // Keyboard navigation listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (activeQuestionCheckpoint) return;

      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          e.preventDefault();
          tryMove(0, -1);
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          e.preventDefault();
          tryMove(0, 1);
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          e.preventDefault();
          tryMove(-1, 0);
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          e.preventDefault();
          tryMove(1, 0);
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [tryMove, activeQuestionCheckpoint]);

  // Click on adjacent cell to walk
  const handleCellClick = (x: number, y: number) => {
    if (activeQuestionCheckpoint) return;
    const dx = x - playerPos.x;
    const dy = y - playerPos.y;

    if (Math.abs(dx) + Math.abs(dy) === 1) {
      tryMove(dx, dy);
    }
  };

  // --- 20-SECOND TIMER FOR CHECKPOINT QUESTIONS ---
  useEffect(() => {
    if (activeQuestionCheckpoint) {
      setQuestionTimeLeft(20);
      setIsTimedOut(false);

      if (questionTimerRef.current) {
        clearInterval(questionTimerRef.current);
      }

      questionTimerRef.current = window.setInterval(() => {
        setQuestionTimeLeft((prev) => {
          if (prev <= 1) {
            if (questionTimerRef.current) {
              clearInterval(questionTimerRef.current);
              questionTimerRef.current = null;
            }
            return 0;
          }
          if (prev <= 6) {
            audio.playTick(); // Tick sound in final 5 seconds (5, 4, 3, 2, 1)
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (questionTimerRef.current) {
        clearInterval(questionTimerRef.current);
        questionTimerRef.current = null;
      }
    }

    return () => {
      if (questionTimerRef.current) {
        clearInterval(questionTimerRef.current);
        questionTimerRef.current = null;
      }
    };
  }, [activeQuestionCheckpoint]);

  // Handle 20s timeout (if time expires without answers, directly advance)
  const handleTimeout = useCallback(() => {
    if (!activeQuestionCheckpoint || isTimedOut) return;
    setIsTimedOut(true);

    if (questionTimerRef.current) {
      clearInterval(questionTimerRef.current);
      questionTimerRef.current = null;
    }

    const correctAns = activeQuestionCheckpoint.question.correctAnswer;

    if (mode === 'solo') {
      if (soloSelectedOption === null && soloFeedback === null) {
        setSoloFeedback('wrong');
        audio.playWrong();
        audio.speak(
          `Waktu 20 detik habis! Jawaban yang tepat adalah ${correctAns}. Ayo lanjut ke pos berikutnya!`
        );
        setTeacherTip(
          `Waktu 20 detik habis! Jawaban yang tepat adalah "${correctAns}". Ayo tetap semangat, lanjut ke pos berikutnya!`
        );

        // Mark checkpoint as completed & missed (0 points)
        setCheckpoints((prev) =>
          prev.map((cp) =>
            cp.id === activeQuestionCheckpoint.id
              ? { ...cp, isCompleted: true, wasCorrect: false }
              : cp
          )
        );

        setTimeout(() => {
          setActiveQuestionCheckpoint(null);
          setSoloSelectedOption(null);
          setSoloFeedback(null);
          setIsTimedOut(false);
        }, 1800);
      }
    } else {
      if (!multiplayerRevealed) {
        setMultiplayerRevealed(true);

        // Score players: answered right get +10, wrong or timeout get 0
        setCurrentPlayers((prev) =>
          prev.map((p) => {
            const pAns = multiplayerAnswers[p.id];
            const isRight = pAns === correctAns;
            return {
              ...p,
              score: isRight ? p.score + 10 : p.score,
            };
          })
        );

        const anyCorrect = currentPlayers.some(
          (p) => multiplayerAnswers[p.id] === correctAns
        );

        if (anyCorrect) {
          audio.playCorrect();
          audio.speak(
            `Waktu 20 detik habis! Jawaban yang benar adalah ${correctAns}. Hebat bagi yang berhasil!`
          );
          setTeacherTip(
            `Waktu 20 detik habis! Jawaban yang benar adalah "${correctAns}". Hebat bagi yang berhasil! Ayo lanjut!`
          );
        } else {
          audio.playWrong();
          audio.speak(
            `Waktu 20 detik habis! Jawaban yang tepat adalah ${correctAns}. Ayo lanjut ke pos berikutnya!`
          );
          setTeacherTip(
            `Waktu 20 detik habis! Jawaban yang tepat adalah "${correctAns}". Tetap kompak, mari jelajahi pos berikutnya!`
          );
        }

        // Mark checkpoint as completed
        setCheckpoints((prev) =>
          prev.map((cp) =>
            cp.id === activeQuestionCheckpoint.id
              ? { ...cp, isCompleted: true, wasCorrect: anyCorrect }
              : cp
          )
        );

        // Advance kapten baton
        setActiveNavigatorIdx((prev) => (prev + 1) % currentPlayers.length);

        setTimeout(() => {
          setActiveQuestionCheckpoint(null);
          setMultiplayerAnswers({});
          setMultiplayerRevealed(false);
          setIsTimedOut(false);
        }, 1800);
      }
    }
  }, [
    activeQuestionCheckpoint,
    isTimedOut,
    mode,
    soloSelectedOption,
    soloFeedback,
    multiplayerRevealed,
    multiplayerAnswers,
    currentPlayers,
  ]);

  // Trigger timeout when timer hits 0
  useEffect(() => {
    if (questionTimeLeft === 0 && activeQuestionCheckpoint && !isTimedOut) {
      handleTimeout();
    }
  }, [questionTimeLeft, activeQuestionCheckpoint, isTimedOut, handleTimeout]);

  // --- SOLO MODE ANSWER HANDLER ---
  // Mandatory requirement: "jika ada soal salah langsung ganti ke soal berikutnya, tidak perlu menjawab soal yang salah tersebut"
  const handleSoloAnswerChoice = (option: string) => {
    if (!activeQuestionCheckpoint || soloSelectedOption !== null || isTimedOut) return;
    if (questionTimerRef.current) {
      clearInterval(questionTimerRef.current);
      questionTimerRef.current = null;
    }
    audio.playPop();
    setSoloSelectedOption(option);

    const isCorrect = option === activeQuestionCheckpoint.question.correctAnswer;

    if (isCorrect) {
      setSoloFeedback('correct');
      audio.playCorrect();
      audio.speak(
        `Masya Allah, benar! It is a ${option}! Hebat sekali ${activeNavigator.name}!`
      );
      setTeacherTip(
        `Alhamdulillah, benar! "${option}". Poin bertambah +10 untuk ${activeNavigator.name}!`
      );

      // Award 10 points
      setCurrentPlayers((prev) =>
        prev.map((p, idx) =>
          idx === 0 ? { ...p, score: p.score + 10 } : p
        )
      );

      // Mark checkpoint as completed & correct
      setCheckpoints((prev) =>
        prev.map((cp) =>
          cp.id === activeQuestionCheckpoint.id
            ? { ...cp, isCompleted: true, wasCorrect: true }
            : cp
        )
      );

      try {
        confetti({
          particleCount: 30,
          spread: 60,
          origin: { y: 0.5 },
        });
      } catch {
        // ignore
      }

      // Smoothly advance/close after 1.2s
      setTimeout(() => {
        setActiveQuestionCheckpoint(null);
        setSoloSelectedOption(null);
        setSoloFeedback(null);
        setIsTimedOut(false);
      }, 1200);
    } else {
      // WRONG ANSWER: Directly show answer, DO NOT allow re-answering, immediately advance!
      setSoloFeedback('wrong');
      audio.playWrong();
      audio.speak(
        `Jawaban yang tepat adalah ${activeQuestionCheckpoint.question.correctAnswer}. Ayo lanjut ke pos berikutnya!`
      );
      setTeacherTip(
        `Jawaban yang tepat adalah "${activeQuestionCheckpoint.question.correctAnswer}". Jangan berkecil hati, ayo lanjut ke pos berikutnya!`
      );

      // Mark checkpoint as completed & missed (0 points)
      setCheckpoints((prev) =>
        prev.map((cp) =>
          cp.id === activeQuestionCheckpoint.id
            ? { ...cp, isCompleted: true, wasCorrect: false }
            : cp
        )
      );

      // Smoothly advance/close after 1.6s
      setTimeout(() => {
        setActiveQuestionCheckpoint(null);
        setSoloSelectedOption(null);
        setSoloFeedback(null);
        setIsTimedOut(false);
      }, 1600);
    }
  };

  // --- MULTIPLAYER MODE ANSWER HANDLER (2 to 5 Players) ---
  // Mandatory requirement: Each player answers, if wrong no re-answering, advances to next pos!
  const handleMultiplayerPlayerSelect = (playerId: number, option: string) => {
    if (!activeQuestionCheckpoint || multiplayerRevealed || isTimedOut) return;
    if (multiplayerAnswers[playerId] !== undefined) return; // Already answered

    audio.playPop();
    const updated = { ...multiplayerAnswers, [playerId]: option };
    setMultiplayerAnswers(updated);

    // Check if all players have answered
    const allAnswered = currentPlayers.every((p) => updated[p.id] !== undefined);

    if (allAnswered) {
      if (questionTimerRef.current) {
        clearInterval(questionTimerRef.current);
        questionTimerRef.current = null;
      }
      setMultiplayerRevealed(true);
      const correctAns = activeQuestionCheckpoint.question.correctAnswer;

      // Update player scores
      setCurrentPlayers((prev) =>
        prev.map((p) => {
          const pAns = updated[p.id];
          const isRight = pAns === correctAns;
          return {
            ...p,
            score: isRight ? p.score + 10 : p.score,
          };
        })
      );

      const anyCorrect = currentPlayers.some((p) => updated[p.id] === correctAns);

      if (anyCorrect) {
        audio.playCorrect();
        audio.speak(
          `Jawaban yang benar adalah ${correctAns}! Hebat anak-anak cerdas!`
        );
        setTeacherTip(
          `Jawaban yang benar adalah "${correctAns}". Hebat untuk pemain yang menjawab benar! Ayo lanjut!`
        );
      } else {
        audio.playWrong();
        audio.speak(
          `Jawaban yang tepat adalah ${correctAns}. Ayo lanjut ke pos berikutnya!`
        );
        setTeacherTip(
          `Jawaban yang tepat adalah "${correctAns}". Tetap semangat, mari jelajahi pos berikutnya!`
        );
      }

      // Mark checkpoint as completed
      setCheckpoints((prev) =>
        prev.map((cp) =>
          cp.id === activeQuestionCheckpoint.id
            ? { ...cp, isCompleted: true, wasCorrect: anyCorrect }
            : cp
        )
      );

      // Next pos navigator baton passes to next player
      setActiveNavigatorIdx((prev) => (prev + 1) % currentPlayers.length);

      // Smoothly advance/close after 1.8s
      setTimeout(() => {
        setActiveQuestionCheckpoint(null);
        setMultiplayerAnswers({});
        setMultiplayerRevealed(false);
        setIsTimedOut(false);
      }, 1800);
    }
  };

  const completedCount = checkpoints.filter((c) => c.isCompleted).length;
  const currentVocab = activeQuestionCheckpoint
    ? VOCAB_DICTIONARY[activeQuestionCheckpoint.question.vocabId]
    : null;

  return (
    <div className="w-full max-w-5xl mx-auto px-2 sm:px-4 py-2 flex flex-col items-center select-none">
      {/* Top Mission Header: Players Info, Checkpoints Count, Ummi Ayu Badge */}
      <div className="w-full bg-white/95 rounded-2xl sm:rounded-3xl p-3 border-3 border-amber-200 shadow-md mb-3 flex items-center justify-between gap-2 flex-wrap">
        {/* Navigator Info */}
        <div className="flex items-center gap-2">
          <AnimalAvatar id={activeNavigator.animal.id} size="sm" animate={true} />
          <div>
            <div className="flex items-center gap-1">
              <span className="text-[10px] font-black text-amber-700 uppercase tracking-widest block">
                {mode === 'solo' ? 'PENJELAJAH LABIRIN' : 'GILIRAN KAPTEN PENJELAJAH'}
              </span>
              <span className="text-[10px] bg-amber-100 text-amber-900 font-extrabold px-1.5 py-0.2 rounded-md">
                {mode === 'solo' ? 'SOLO' : `${players.length} PEMAIN`}
              </span>
            </div>
            <span className="text-sm sm:text-base font-black text-slate-800">
              {activeNavigator.name} ({activeNavigator.animal.name})
            </span>
          </div>
        </div>

        {/* Checkpoint Progress counter (10 Pos Soal) */}
        <div className="flex items-center gap-2 bg-amber-50 px-3 py-1.5 rounded-2xl border-2 border-amber-300">
          <Compass className="w-5 h-5 text-emerald-600 animate-spin-slow" />
          <div className="text-right">
            <span className="text-[10px] font-black text-slate-500 block uppercase">
              10 POS SOAL
            </span>
            <span className="text-sm sm:text-base font-black text-emerald-700">
              {completedCount} / 10 Pos Selesai
            </span>
          </div>
        </div>

        {/* Players Scoreboard (Chips for each player) */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {currentPlayers.map((p, idx) => (
            <div
              key={p.id}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-xl border font-black text-xs transition ${
                idx === activeNavigatorIdx % currentPlayers.length && mode === 'multiplayer'
                  ? 'bg-amber-300 border-amber-500 shadow-xs scale-105'
                  : 'bg-slate-100 border-slate-300 text-slate-700'
              }`}
            >
              <span>{p.animal.iconSvg}</span>
              <span className="truncate max-w-[80px]">{p.name}:</span>
              <span className="text-amber-900">{p.score} pt</span>
            </div>
          ))}
        </div>
      </div>

      {/* Main Play Area: Maze on Left, Ummi Ayu Teacher Companion on Right */}
      <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-3 items-start">
        {/* UMMI AYU TEACHER COMPANION (Side Card on desktop, Top banner on mobile) */}
        <div className="lg:col-span-4 bg-gradient-to-b from-amber-50 to-orange-50/70 rounded-3xl p-4 border-3 border-amber-300 shadow-md flex flex-col justify-between order-2 lg:order-1">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-black text-amber-900 bg-amber-200/90 px-3 py-1 rounded-full border border-amber-300 flex items-center gap-1">
                <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
                GURU PEMBIMBING
              </span>
              <button
                onClick={() => audio.speak(teacherTip)}
                className="p-1.5 rounded-xl bg-white text-amber-800 hover:bg-amber-100 transition shadow-2xs flex items-center gap-1 text-[11px] font-bold"
                title="Dengarkan Pesan Ummi Ayu"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>Dengar Suara</span>
              </button>
            </div>

            {/* Teacher Avatar & Dialogue */}
            <div className="flex flex-row lg:flex-col items-center gap-3 mb-3">
              <UmmiAyuTeacher
                size="md"
                animate={true}
                interactiveAudio={true}
                speechText={teacherTip}
              />
              <div className="flex-1 bg-white/90 rounded-2xl p-3 border-2 border-amber-200 shadow-xs">
                <div className="text-[11px] font-black text-amber-900 mb-1 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  Nasihat Ummi Ayu:
                </div>
                <p className="text-xs sm:text-sm font-bold text-slate-700 leading-relaxed">
                  "{teacherTip}"
                </p>
              </div>
            </div>
          </div>

          {/* Pos Checkpoints Mini Status List (1 to 10) */}
          <div className="mt-2 bg-white/90 rounded-2xl p-2.5 border border-amber-200">
            <span className="text-[10px] font-black text-slate-500 block mb-1 uppercase tracking-wider">
              Daftar 10 Pos Tantangan:
            </span>
            <div className="grid grid-cols-5 gap-1 text-center">
              {checkpoints.map((cp) => (
                <div
                  key={cp.id}
                  className={`py-1 rounded-lg text-[11px] font-black border flex items-center justify-center gap-0.5 ${
                    cp.isCompleted
                      ? cp.wasCorrect
                        ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                        : 'bg-rose-100 text-rose-800 border-rose-300'
                      : 'bg-slate-50 text-slate-500 border-slate-200'
                  }`}
                  title={`Pos ${cp.id}: ${cp.isCompleted ? (cp.wasCorrect ? 'Benar' : 'Dilewati') : 'Belum Dikunjungi'}`}
                >
                  <span>P{cp.id}</span>
                  {cp.isCompleted ? (
                    cp.wasCorrect ? (
                      <CheckCircle2 className="w-3 h-3 text-emerald-600 inline" />
                    ) : (
                      <XCircle className="w-3 h-3 text-rose-500 inline" />
                    )
                  ) : null}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* MAZE CANVAS & D-PAD (Middle & Right) */}
        <div className="lg:col-span-8 bg-white/95 rounded-3xl p-3 sm:p-4 border-3 border-amber-200 shadow-xl flex flex-col items-center order-1 lg:order-2">
          {/* Maze Grid Container */}
          <div className="relative bg-amber-100/70 p-2 sm:p-3 rounded-2xl border-2 border-amber-300 shadow-inner max-w-full overflow-hidden">
            <div
              className="grid gap-1 sm:gap-1.5"
              style={{
                gridTemplateColumns: `repeat(${MEDIUM_MAZE_GRID[0].length}, minmax(0, 1fr))`,
              }}
            >
              {MEDIUM_MAZE_GRID.map((row, rIdx) =>
                row.map((cell, cIdx) => {
                  const isWall = cell === 1;
                  const isPlayerHere = playerPos.x === cIdx && playerPos.y === rIdx;
                  const isGoal = GOAL_COORD.x === cIdx && GOAL_COORD.y === rIdx;
                  const cpItem = checkpoints.find(
                    (cp) => cp.x === cIdx && cp.y === rIdx
                  );

                  return (
                    <div
                      key={`${rIdx}-${cIdx}`}
                      onClick={() => !isWall && handleCellClick(cIdx, rIdx)}
                      className={`w-7 h-7 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-lg sm:rounded-xl flex items-center justify-center transition-all duration-150 relative cursor-pointer ${
                        isWall
                          ? 'bg-gradient-to-br from-emerald-800 to-teal-900 shadow-sm border border-emerald-700 cursor-not-allowed'
                          : 'bg-amber-50 hover:bg-amber-200/60 border border-amber-200/80 shadow-xs'
                      }`}
                    >
                      {/* Wall texture / foliage decoration */}
                      {isWall && (
                        <span className="text-[9px] opacity-25 select-none">
                          🌿
                        </span>
                      )}

                      {/* Checkpoint Gate (Pos 1 to 10) */}
                      {cpItem && !isPlayerHere && (
                        <div
                          className={`w-full h-full rounded-lg sm:rounded-xl flex flex-col items-center justify-center font-black transition transform active:scale-95 ${
                            cpItem.isCompleted
                              ? cpItem.wasCorrect
                                ? 'bg-emerald-400 text-white shadow-xs'
                                : 'bg-rose-400 text-white shadow-xs'
                              : 'bg-amber-400 text-amber-950 shadow-md animate-pulse'
                          }`}
                        >
                          <span className="text-[9px] sm:text-[11px] leading-none">
                            {cpItem.isCompleted ? (
                              cpItem.wasCorrect ? '✓' : '✗'
                            ) : (
                              `P${cpItem.id}`
                            )}
                          </span>
                        </div>
                      )}

                      {/* Golden Trophy Goal */}
                      {isGoal && !isPlayerHere && (
                        <div
                          className={`w-full h-full rounded-lg sm:rounded-xl flex items-center justify-center ${
                            isGoalUnlocked
                              ? 'bg-yellow-400 animate-bounce shadow-lg ring-2 ring-amber-500'
                              : 'bg-slate-300 opacity-60'
                          }`}
                          title={isGoalUnlocked ? 'Piala Emas Terbuka!' : 'Selesaikan 10 pos dahulu'}
                        >
                          <Trophy
                            className={`w-4 h-4 sm:w-5 sm:h-5 ${
                              isGoalUnlocked ? 'text-amber-950' : 'text-slate-500'
                            }`}
                          />
                        </div>
                      )}

                      {/* Explorer Mascot Avatar */}
                      {isPlayerHere && (
                        <div
                          className={`z-20 transform transition-transform duration-200 ${
                            facingDir === 'left' ? 'scale-x-[-1]' : ''
                          }`}
                        >
                          <AnimalAvatar
                            id={activeNavigator.animal.id}
                            size="sm"
                            animate={true}
                          />
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* D-Pad Virtual Controllers & Instructions */}
          <div className="w-full mt-3 flex items-center justify-between gap-4 flex-wrap">
            <div className="text-xs font-bold text-slate-500 hidden sm:block">
              <div>💡 <strong>Kontrol Keyboard:</strong> Panah (↑ ↓ ← →) atau W A S D</div>
              <div>💡 <strong>Sentuh:</strong> Tap jalur maze atau tekan D-Pad virtual</div>
            </div>

            {/* D-Pad Controls */}
            <div className="flex flex-col items-center mx-auto sm:mx-0">
              <button
                type="button"
                id="btn-maze-up"
                onClick={() => tryMove(0, -1)}
                className="w-11 h-11 bg-amber-200 hover:bg-amber-300 active:bg-amber-400 rounded-xl flex items-center justify-center shadow-md border-2 border-amber-400 active:scale-95 transition"
                aria-label="Atas"
              >
                <ArrowUp className="w-6 h-6 text-amber-900" />
              </button>
              <div className="flex gap-2 my-1">
                <button
                  type="button"
                  id="btn-maze-left"
                  onClick={() => tryMove(-1, 0)}
                  className="w-11 h-11 bg-amber-200 hover:bg-amber-300 active:bg-amber-400 rounded-xl flex items-center justify-center shadow-md border-2 border-amber-400 active:scale-95 transition"
                  aria-label="Kiri"
                >
                  <ArrowLeft className="w-6 h-6 text-amber-900" />
                </button>
                <button
                  type="button"
                  id="btn-maze-down"
                  onClick={() => tryMove(0, 1)}
                  className="w-11 h-11 bg-amber-200 hover:bg-amber-300 active:bg-amber-400 rounded-xl flex items-center justify-center shadow-md border-2 border-amber-400 active:scale-95 transition"
                  aria-label="Bawah"
                >
                  <ArrowDown className="w-6 h-6 text-amber-900" />
                </button>
                <button
                  type="button"
                  id="btn-maze-right"
                  onClick={() => tryMove(1, 0)}
                  className="w-11 h-11 bg-amber-200 hover:bg-amber-300 active:bg-amber-400 rounded-xl flex items-center justify-center shadow-md border-2 border-amber-400 active:scale-95 transition"
                  aria-label="Kanan"
                >
                  <ArrowRight className="w-6 h-6 text-amber-900" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* CHECKPOINT QUESTION CHALLENGE MODAL (WITH UMMI AYU AS THE TEACHER!)      */}
      {/* ========================================================================= */}
      {activeQuestionCheckpoint && currentVocab && (
        <div
          id="checkpoint-question-overlay"
          className="fixed inset-0 bg-slate-900/75 backdrop-blur-xs z-50 overflow-y-auto overscroll-contain flex justify-center items-start sm:items-center p-2.5 sm:p-4 md:p-6 animate-fade-in"
        >
          <div
            id="checkpoint-question-card"
            className="my-auto bg-white rounded-3xl p-3.5 sm:p-5 md:p-6 max-w-2xl lg:max-w-3xl w-full border-4 border-amber-300 shadow-2xl flex flex-col items-center text-center relative"
          >
            {/* Modal Header Badge & Timer */}
            <div className="w-full flex flex-wrap items-center justify-between gap-2 mb-2">
              <span className="text-xs sm:text-sm font-black text-amber-950 bg-amber-200 border border-amber-400 px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-600" />
                POS {activeQuestionCheckpoint.id} / 10
              </span>

              {/* 20-Second Countdown Timer Badge */}
              <div
                id="checkpoint-timer-badge"
                className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs sm:text-sm font-black transition-colors ${
                  questionTimeLeft <= 5
                    ? 'bg-rose-500 text-white animate-pulse shadow-md shadow-rose-200'
                    : questionTimeLeft <= 10
                    ? 'bg-amber-400 text-amber-950 shadow-xs'
                    : 'bg-emerald-500 text-white shadow-xs'
                }`}
              >
                <Clock className="w-4 h-4" />
                <span>{isTimedOut ? 'Waktu Habis!' : `Waktu: ${questionTimeLeft} dtk`}</span>
              </div>

              <button
                type="button"
                id="btn-hear-question"
                onClick={() =>
                  audio.speak(
                    `${activeQuestionCheckpoint.question.questionText}. Look at the picture!`
                  )
                }
                className="flex items-center gap-1 px-2.5 py-1 bg-amber-100 hover:bg-amber-200 text-amber-900 rounded-xl text-xs font-bold transition"
              >
                <Volume2 className="w-4 h-4 text-amber-800" />
                <span>Dengar Soal</span>
              </button>
            </div>

            {/* Timer Progress Bar (20 seconds) */}
            <div
              id="checkpoint-timer-bar-container"
              className="w-full h-2 bg-slate-100 rounded-full overflow-hidden mb-3 border border-slate-200"
            >
              <div
                id="checkpoint-timer-bar"
                className={`h-full transition-all duration-1000 ease-linear rounded-full ${
                  questionTimeLeft <= 5
                    ? 'bg-rose-500'
                    : questionTimeLeft <= 10
                    ? 'bg-amber-400'
                    : 'bg-emerald-500'
                }`}
                style={{ width: `${Math.max(0, Math.min(100, (questionTimeLeft / 20) * 100))}%` }}
              />
            </div>

            {/* Ummi Ayu Teacher Greeting Card with Question Board */}
            <div className="w-full bg-gradient-to-r from-amber-50 via-orange-50 to-amber-50 rounded-2xl p-2.5 sm:p-3 border-2 border-amber-200 mb-2.5 flex items-center gap-3">
              <UmmiAyuTeacher
                size="sm"
                animate={true}
                interactiveAudio={false}
              />
              <div className="flex-1 text-left">
                <div className="text-[11px] font-black text-amber-900 flex items-center gap-1">
                  <span>Ummi Ayu Membacakan Soal:</span>
                </div>
                <h3 className="text-sm sm:text-base md:text-lg font-black text-slate-800">
                  {activeQuestionCheckpoint.question.questionText}
                </h3>
                <p className="text-xs font-bold text-slate-500">
                  {activeQuestionCheckpoint.question.questionTextId}
                </p>
              </div>
            </div>

            {/* Vocabulary Picture Illustration */}
            <div
              className={`bg-gradient-to-br from-sky-50 to-amber-50 rounded-2xl p-2.5 border-2 border-amber-200 shadow-sm flex items-center justify-center mb-2 ${
                mode === 'multiplayer'
                  ? 'w-24 h-24 sm:w-28 sm:h-28'
                  : 'w-28 h-28 sm:w-36 sm:h-36'
              }`}
            >
              <VocabIllustration
                id={activeQuestionCheckpoint.question.vocabId}
                size={mode === 'multiplayer' ? 'sm' : 'md'}
              />
            </div>

            {/* Hint / Clue */}
            <div className="text-xs font-bold text-slate-500 bg-slate-50 px-3 py-1 rounded-xl mb-3 border border-slate-200">
              💡 Petunjuk: {currentVocab.clue}
            </div>

            {/* ======================================================= */}
            {/* A. SOLO MODE OPTIONS:                                   */}
            {/* If wrong / timeout -> directly advances without re-answering! */}
            {/* ======================================================= */}
            {mode === 'solo' && (
              <div className="w-full grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3">
                {activeQuestionCheckpoint.question.options.map((option, optIdx) => {
                  const isChosen = soloSelectedOption === option;
                  const isCorrectAnswer =
                    option === activeQuestionCheckpoint.question.correctAnswer;

                  let btnStyle =
                    'bg-white border-2 border-amber-200 text-slate-700 hover:bg-amber-100 hover:border-amber-400';

                  if (soloSelectedOption !== null || isTimedOut) {
                    if (isCorrectAnswer) {
                      btnStyle =
                        'bg-emerald-500 border-2 border-emerald-600 text-white shadow-md scale-102';
                    } else if (isChosen && !isCorrectAnswer) {
                      btnStyle =
                        'bg-rose-500 border-2 border-rose-600 text-white shadow-md animate-shake';
                    } else {
                      btnStyle = 'bg-slate-100 border-slate-200 text-slate-400 opacity-50';
                    }
                  }

                  return (
                    <button
                      key={option}
                      id={`btn-solo-option-${optIdx}`}
                      disabled={soloSelectedOption !== null || isTimedOut}
                      onClick={() => handleSoloAnswerChoice(option)}
                      className={`py-2.5 sm:py-3 px-3 sm:px-4 rounded-2xl font-black text-base sm:text-lg transition transform active:scale-95 flex items-center justify-center gap-2 ${btnStyle}`}
                    >
                      <span>{option}</span>
                      {(soloSelectedOption !== null || isTimedOut) && isCorrectAnswer && (
                        <CheckCircle2 className="w-5 h-5 text-white" />
                      )}
                      {soloSelectedOption !== null && isChosen && !isCorrectAnswer && (
                        <XCircle className="w-5 h-5 text-white" />
                      )}
                    </button>
                  );
                })}
              </div>
            )}

            {/* ======================================================= */}
            {/* B. MULTIPLAYER MODE OPTIONS (2 to 5 Players):           */}
            {/* Smooth scrollable grid, 20s timer, no re-answering!    */}
            {/* ======================================================= */}
            {mode === 'multiplayer' && (
              <div className="w-full flex flex-col gap-2">
                <span className="text-xs font-black text-indigo-900 bg-indigo-50 px-3 py-1 rounded-xl border border-indigo-200 block">
                  👥 Setiap pemain silakan tekan pilihan jawabannya ({currentPlayers.length} Pemain):
                </span>

                {/* Dynamic player grid accommodating 2, 3, 4, and 5 players smoothly */}
                <div
                  className={`grid gap-2 text-left w-full ${
                    currentPlayers.length === 3
                      ? 'grid-cols-1 sm:grid-cols-3'
                      : currentPlayers.length >= 4
                      ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
                      : 'grid-cols-1 sm:grid-cols-2'
                  }`}
                >
                  {currentPlayers.map((p) => {
                    const playerChoice = multiplayerAnswers[p.id];
                    const isCorrectAnswer =
                      playerChoice === activeQuestionCheckpoint.question.correctAnswer;

                    return (
                      <div
                        key={p.id}
                        id={`card-player-response-${p.id}`}
                        className="bg-slate-50 p-2.5 rounded-2xl border-2 border-slate-200 shadow-xs flex flex-col gap-1.5"
                      >
                        <div className="flex items-center justify-between gap-1">
                          <div className="flex items-center gap-1.5 min-w-0">
                            <AnimalAvatar id={p.animal.id} size="sm" />
                            <span className="text-xs font-black text-slate-800 truncate">
                              {p.name}
                            </span>
                          </div>

                          {/* Status Badge */}
                          {playerChoice ? (
                            <span
                              className={`text-[10px] sm:text-[11px] font-black px-2 py-0.5 rounded-full whitespace-nowrap ${
                                multiplayerRevealed
                                  ? isCorrectAnswer
                                    ? 'bg-emerald-500 text-white'
                                    : 'bg-rose-500 text-white'
                                  : 'bg-indigo-500 text-white'
                              }`}
                            >
                              {multiplayerRevealed
                                ? isCorrectAnswer
                                  ? '✓ Benar (+10)'
                                  : '✗ Salah (+0)'
                                : '✓ Terkunci'}
                            </span>
                          ) : isTimedOut ? (
                            <span className="text-[10px] sm:text-[11px] font-black px-2 py-0.5 rounded-full bg-rose-500 text-white whitespace-nowrap">
                              ⏱️ Lewat (+0)
                            </span>
                          ) : (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-200 text-slate-600 whitespace-nowrap">
                              Pilih...
                            </span>
                          )}
                        </div>

                        {/* 3 Option Buttons for this player */}
                        <div className="grid grid-cols-3 gap-1">
                          {activeQuestionCheckpoint.question.options.map((opt, optIdx) => {
                            const isThisChosen = playerChoice === opt;
                            let optStyle =
                              'bg-white border-slate-200 text-slate-700 hover:bg-amber-100 hover:border-amber-300';

                            if (playerChoice !== undefined || multiplayerRevealed || isTimedOut) {
                              if (multiplayerRevealed || isTimedOut) {
                                if (opt === activeQuestionCheckpoint.question.correctAnswer) {
                                  optStyle =
                                    'bg-emerald-500 text-white border-emerald-600 font-black shadow-xs';
                                } else if (isThisChosen) {
                                  optStyle =
                                    'bg-rose-500 text-white border-rose-600 font-black';
                                } else {
                                  optStyle = 'bg-slate-100 text-slate-400 opacity-40';
                                }
                              } else if (isThisChosen) {
                                optStyle =
                                  'bg-indigo-500 text-white border-indigo-600 font-black shadow-xs';
                              }
                            }

                            return (
                              <button
                                key={opt}
                                id={`btn-player-${p.id}-opt-${optIdx}`}
                                disabled={
                                  playerChoice !== undefined ||
                                  multiplayerRevealed ||
                                  isTimedOut
                                }
                                onClick={() => handleMultiplayerPlayerSelect(p.id, opt)}
                                className={`min-h-[38px] py-1 px-1 rounded-xl text-xs font-extrabold border transition active:scale-95 truncate ${optStyle}`}
                                title={opt}
                              >
                                {opt}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Solo Feedback Alert */}
            {soloFeedback === 'correct' && (
              <div className="mt-3 text-xs sm:text-sm font-black text-emerald-800 bg-emerald-100 border border-emerald-300 py-1.5 px-4 rounded-xl animate-fade-in flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Masya Allah, Hebat! Jawaban Benar (+10 Poin)! Lanjut ke pos berikutnya...</span>
              </div>
            )}
            {soloFeedback === 'wrong' && (
              <div className="mt-3 text-xs sm:text-sm font-black text-rose-800 bg-rose-100 border border-rose-300 py-1.5 px-4 rounded-xl animate-fade-in flex items-center gap-1.5">
                <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>
                  {isTimedOut ? '⏱️ Waktu 20 detik habis!' : 'Kurang tepat!'}{' '}
                  Jawaban yang benar: <strong>{activeQuestionCheckpoint.question.correctAnswer}</strong>. Langsung lanjut ke pos berikutnya...
                </span>
              </div>
            )}

            {/* Multiplayer Timeout / Feedback Alert */}
            {mode === 'multiplayer' && isTimedOut && (
              <div className="mt-3 text-xs sm:text-sm font-black text-rose-800 bg-rose-100 border border-rose-300 py-1.5 px-4 rounded-xl animate-fade-in flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-rose-600 shrink-0" />
                <span>
                  ⏱️ Waktu 20 detik habis! Jawaban yang benar: <strong>{activeQuestionCheckpoint.question.correctAnswer}</strong>. Langsung lanjut ke pos berikutnya...
                </span>
              </div>
            )}

          </div>
        </div>
      )}
    </div>
  );
};
