import React, { useState } from 'react';
import { Grade, GameMode, Player, MultipleChoiceQuestion } from './types';
import { Navbar } from './components/Navbar';
import { HomeScreen } from './components/HomeScreen';
import { SoloSetupScreen } from './components/SoloSetupScreen';
import { MultiplayerSetup } from './components/MultiplayerSetup';
import { MazeMissionLevel } from './components/MazeMissionLevel';
import { GuessPictureLevel } from './components/GuessPictureLevel';
import { MatchingLevel } from './components/MatchingLevel';
import { MultiplayerGameView } from './components/MultiplayerGameView';
import { RewardModal } from './components/RewardModal';
import { GameCompleteScreen } from './components/GameCompleteScreen';
import { ANIMAL_CHARACTERS } from './utils/characters';
import {
  generateVariedQuestions,
  generateMazeCheckpointQuestions,
  GRADE_1_VOCAB_KEYS,
  GRADE_2_VOCAB_KEYS,
  shuffleArray,
} from './utils/gameData';
import { audio } from './utils/audio';

type ScreenState =
  | 'home'
  | 'solo_setup'
  | 'playing_maze'
  | 'playing_solo'
  | 'multiplayer_setup'
  | 'playing_multiplayer'
  | 'completed';

export default function App() {
  const [screen, setScreen] = useState<ScreenState>('home');
  const [gameMode, setGameMode] = useState<GameMode>('solo');
  const [grade, setGrade] = useState<Grade | null>(null);

  // Solo Player Configuration
  const [soloPlayer, setSoloPlayer] = useState<Player>({
    id: 1,
    name: 'Siswa Juara',
    animal: ANIMAL_CHARACTERS[0],
    score: 0,
    selectedAnswer: null,
    answeredAt: null,
    isCorrect: null,
  });

  const [soloGameType, setSoloGameType] = useState<'maze' | 'quiz'>('maze');

  // Solo Quiz level progression
  const [currentLevel, setCurrentLevel] = useState<number>(1);
  const [score, setScore] = useState<number>(0);
  const [showRewardModal, setShowRewardModal] = useState<boolean>(false);

  // Dynamic questions states (ensures questions are varied and rotated!)
  const [mazeQuestions, setMazeQuestions] = useState<MultipleChoiceQuestion[]>([]);
  const [soloQuizQuestions, setSoloQuizQuestions] = useState<MultipleChoiceQuestion[]>([]);
  const [multiplayerPlayers, setMultiplayerPlayers] = useState<Player[]>([]);
  const [multiplayerQuestions, setMultiplayerQuestions] = useState<MultipleChoiceQuestion[]>([]);

  // Navigation Handlers
  const handleGoHome = () => {
    setScreen('home');
    setGrade(null);
    setCurrentLevel(1);
    setShowRewardModal(false);
  };

  const handleStartSoloFlow = () => {
    setGameMode('solo');
    setScreen('solo_setup');
  };

  const handleStartMultiplayerSetup = () => {
    setGameMode('multiplayer');
    setScreen('multiplayer_setup');
  };

  // Launch Solo from Setup Screen
  const handleStartSoloGame = (
    player: Player,
    chosenGrade: Grade,
    modeType: 'maze' | 'quiz'
  ) => {
    setSoloPlayer(player);
    setGrade(chosenGrade);
    setSoloGameType(modeType);
    setGameMode('solo');
    setScore(0);
    setCurrentLevel(1);
    setShowRewardModal(false);

    if (modeType === 'maze') {
      // Exactly 10 checkpoint questions for the medium maze mission
      const questions = generateMazeCheckpointQuestions(chosenGrade, 10);
      setMazeQuestions(questions);
      setScreen('playing_maze');
    } else {
      // Exactly 10 questions for Solo Quiz
      const questions = generateVariedQuestions(chosenGrade, 10);
      setSoloQuizQuestions(questions);
      setScreen('playing_solo');
    }
  };

  // Finish Maze Mission (Solo or Multiplayer)
  const handleFinishMaze = (finalPlayers: Player[], scoreEarned: number) => {
    if (gameMode === 'multiplayer') {
      setMultiplayerPlayers(finalPlayers);
    } else if (finalPlayers.length > 0) {
      setSoloPlayer(finalPlayers[0]);
    }
    setScore(scoreEarned);
    setScreen('completed');
  };

  // Solo quiz score & progression
  const handleQuestionCorrect = () => {
    setScore((prev) => prev + 10);
  };

  const handleLevelFinished = () => {
    const totalLevels = 3;
    if (currentLevel < totalLevels) {
      setShowRewardModal(true);
    } else {
      setScreen('completed');
    }
  };

  const handleNextLevelFromModal = () => {
    setShowRewardModal(false);
    const nextLvl = currentLevel + 1;
    setCurrentLevel(nextLvl);

    // Refresh varied questions for the next level (10 questions)
    if (grade) {
      setSoloQuizQuestions(generateVariedQuestions(grade, 10));
    }
  };

  const handleRestartCurrentLevel = () => {
    if (grade) {
      if (soloGameType === 'maze' || screen === 'playing_maze') {
        setMazeQuestions(generateMazeCheckpointQuestions(grade, 10));
      } else {
        setSoloQuizQuestions(generateVariedQuestions(grade, 10));
      }
    }
    setShowRewardModal(false);
  };

  const handlePlayAgain = () => {
    if (gameMode === 'solo' && grade) {
      setScore(0);
      setCurrentLevel(1);
      setShowRewardModal(false);

      if (soloGameType === 'maze') {
        setMazeQuestions(generateMazeCheckpointQuestions(grade, 10));
        setScreen('playing_maze');
      } else {
        setSoloQuizQuestions(generateVariedQuestions(grade, 10));
        setScreen('playing_solo');
      }
    } else if (gameMode === 'multiplayer' && grade) {
      const resetPlayers = multiplayerPlayers.map((p) => ({
        ...p,
        score: 0,
        selectedAnswer: null,
        answeredAt: null,
        isCorrect: null,
      }));
      setMultiplayerPlayers(resetPlayers);

      if (screen === 'playing_maze' || mazeQuestions.length > 0) {
        setMazeQuestions(generateMazeCheckpointQuestions(grade, 10));
        setScreen('playing_maze');
      } else {
        setMultiplayerQuestions(generateVariedQuestions(grade, 10));
        setScreen('playing_multiplayer');
      }
    } else {
      handleGoHome();
    }
  };

  // Multiplayer Launch (Supports both Maze and Quiz for 2-5 players!)
  const handleStartMultiplayerMatch = (
    players: Player[],
    chosenGrade: Grade,
    gameFormat: 'maze' | 'quiz'
  ) => {
    setGrade(chosenGrade);
    setGameMode('multiplayer');
    setMultiplayerPlayers(players);

    if (gameFormat === 'maze') {
      // 10 Checkpoints for Multiplayer Maze
      const qList = generateMazeCheckpointQuestions(chosenGrade, 10);
      setMazeQuestions(qList);
      setScreen('playing_maze');
    } else {
      // 10 Questions for Multiplayer Quiz
      const qList = generateVariedQuestions(chosenGrade, 10);
      setMultiplayerQuestions(qList);
      setScreen('playing_multiplayer');
    }
  };

  const handleMultiplayerMatchFinish = (finalPlayers: Player[]) => {
    setMultiplayerPlayers(finalPlayers);
    setScreen('completed');
  };

  // Compute navigation text
  const levelText =
    screen === 'playing_maze'
      ? 'MISI LABIRIN 🧭'
      : screen === 'playing_solo'
      ? `LEVEL ${currentLevel} OF 3`
      : screen === 'playing_multiplayer'
      ? 'MULTIPLAYER MATCH'
      : '';

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-sky-50 to-pink-50 text-slate-800 flex flex-col justify-between selection:bg-amber-300">
      {/* Top Navigation Bar */}
      <Navbar
        grade={grade}
        levelText={levelText}
        score={score}
        mode={gameMode}
        playerName={gameMode === 'solo' ? soloPlayer.name : undefined}
        playerAnimalId={gameMode === 'solo' ? soloPlayer.animal.id : undefined}
        onHomeClick={handleGoHome}
        onRestartClick={
          screen === 'playing_solo' || screen === 'playing_maze'
            ? handleRestartCurrentLevel
            : undefined
        }
      />

      {/* Main Game Canvas */}
      <main className="flex-1 flex flex-col justify-center items-center py-2 sm:py-4">
        {/* 1. HOME SCREEN */}
        {screen === 'home' && (
          <HomeScreen
            onPlayClick={handleStartSoloFlow}
            onMultiplayerClick={handleStartMultiplayerSetup}
          />
        )}

        {/* 2. SOLO PLAYER SETUP & PROFILE */}
        {screen === 'solo_setup' && (
          <SoloSetupScreen
            onStartSolo={handleStartSoloGame}
            onBack={handleGoHome}
          />
        )}

        {/* 3. MEDIUM-DIFFICULTY MAZE MISSION (SOLO & 2-5 PLAYERS MULTIPLAYER, 10 QUESTIONS) */}
        {screen === 'playing_maze' && grade && (
          <MazeMissionLevel
            key={`maze_${grade}_${gameMode}_${mazeQuestions.map((q) => q.id).join('_')}`}
            grade={grade}
            mode={gameMode}
            players={gameMode === 'solo' ? [soloPlayer] : multiplayerPlayers}
            questions={mazeQuestions}
            onFinishMaze={handleFinishMaze}
            onExitToMenu={handleGoHome}
          />
        )}

        {/* 4. SOLO QUIZ & MATCHING LEVELS */}
        {screen === 'playing_solo' && grade && (
          <>
            {/* Level 1: Guess The Picture */}
            {currentLevel === 1 && (
              <GuessPictureLevel
                key={`solo_l1_${grade}_${currentLevel}`}
                questions={soloQuizQuestions}
                grade={grade}
                levelNumber={1}
                totalLevels={3}
                levelTitle={`LEVEL 1: ${
                  grade === 1 ? 'TEBAK ALAT SEKOLAH' : 'TEBAK SAYURAN'
                }`}
                instructionEn="Look at the picture. Choose the correct English name!"
                instructionId="Lihat gambar di atas, pilih nama bahasa Inggris yang tepat!"
                onQuestionCorrect={handleQuestionCorrect}
                onLevelComplete={handleLevelFinished}
              />
            )}

            {/* Level 2: Match The Picture */}
            {currentLevel === 2 && (
              <MatchingLevel
                key={`solo_l2_${grade}_${currentLevel}`}
                vocabIds={
                  grade === 1
                    ? shuffleArray(GRADE_1_VOCAB_KEYS).slice(0, 4)
                    : shuffleArray(GRADE_2_VOCAB_KEYS).slice(0, 4)
                }
                levelTitle="LEVEL 2: MATCH THE PICTURE"
                instructionEn="Match the picture with the correct word!"
                instructionId="Pasangkan gambar dengan kata yang sesuai!"
                showPronunciationGuide={false}
                onPairMatched={handleQuestionCorrect}
                onLevelComplete={handleLevelFinished}
              />
            )}

            {/* Level 3: Matching Challenge with Pronunciation Guide */}
            {currentLevel === 3 && (
              <MatchingLevel
                key={`solo_l3_${grade}_${currentLevel}`}
                vocabIds={
                  grade === 1
                    ? shuffleArray(GRADE_1_VOCAB_KEYS).slice(0, 5)
                    : shuffleArray(GRADE_2_VOCAB_KEYS).slice(0, 5)
                }
                levelTitle="LEVEL 3: MATCHING CHALLENGE"
                instructionEn="Matching Challenge + Cara Membaca!"
                instructionId="Pasangkan gambar, lalu dengar cara membacanya!"
                showPronunciationGuide={true}
                onPairMatched={handleQuestionCorrect}
                onLevelComplete={handleLevelFinished}
              />
            )}
          </>
        )}

        {/* 5. MULTIPLAYER SETUP (2-5 Players) */}
        {screen === 'multiplayer_setup' && (
          <MultiplayerSetup
            onStartGame={handleStartMultiplayerMatch}
            onBack={handleGoHome}
          />
        )}

        {/* 6. MULTIPLAYER GAMEPLAY (Simultaneous 20s) */}
        {screen === 'playing_multiplayer' && grade && (
          <MultiplayerGameView
            players={multiplayerPlayers}
            questions={multiplayerQuestions}
            grade={grade}
            onFinishMatch={handleMultiplayerMatchFinish}
          />
        )}

        {/* 7. GAME COMPLETED CELEBRATION */}
        {screen === 'completed' && grade && (
          <GameCompleteScreen
            grade={grade}
            mode={gameMode}
            score={score}
            players={multiplayerPlayers}
            soloPlayer={soloPlayer}
            onPlayAgain={handlePlayAgain}
            onHome={handleGoHome}
          />
        )}
      </main>

      {/* Level Completion Reward Modal */}
      {showRewardModal && grade && (
        <RewardModal
          levelNumber={currentLevel}
          totalLevels={3}
          grade={grade}
          currentScore={score}
          onNextLevel={handleNextLevelFromModal}
        />
      )}

      {/* Classroom Footer */}
      <footer className="w-full text-center py-2 text-[11px] font-bold text-slate-500 select-none">
        🎮 FUN ENGLISH ADVENTURE • GUESS &amp; MATCH! • SD KELAS 1 &amp; 2 • MISI LABIRIN INTERAKTIF
      </footer>
    </div>
  );
}
