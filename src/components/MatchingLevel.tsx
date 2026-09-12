import React, { useState, useEffect } from 'react';
import { VocabItem } from '../types';
import { VOCAB_DICTIONARY, shuffleArray } from '../utils/gameData';
import { VocabIllustration } from '../utils/illustrations';
import { audio } from '../utils/audio';
import { CheckCircle2, Sparkles, Volume2, ArrowRight, Check, XCircle } from 'lucide-react';
import confetti from 'canvas-confetti';

interface MatchingLevelProps {
  vocabIds: string[];
  levelTitle: string;
  instructionEn: string;
  instructionId: string;
  showPronunciationGuide?: boolean; // For Class 1 Level 3
  onPairMatched: () => void;
  onLevelComplete: () => void;
}

interface PictureCard {
  id: string;
  vocab: VocabItem;
}

interface WordCard {
  id: string;
  word: string;
  vocabId: string;
}

export const MatchingLevel: React.FC<MatchingLevelProps> = ({
  vocabIds,
  levelTitle,
  instructionEn,
  instructionId,
  showPronunciationGuide = false,
  onPairMatched,
  onLevelComplete,
}) => {
  const [pictureCards, setPictureCards] = useState<PictureCard[]>([]);
  const [wordCards, setWordCards] = useState<WordCard[]>([]);
  
  // Selection states for click-to-match
  const [selectedPictureId, setSelectedPictureId] = useState<string | null>(null);
  const [selectedWordVocabId, setSelectedWordVocabId] = useState<string | null>(null);

  // Completed matches
  const [matchedIds, setMatchedIds] = useState<string[]>([]);
  
  // Feedback popup state
  const [feedback, setFeedback] = useState<{ type: 'correct' | 'wrong'; message: string; vocab?: VocabItem } | null>(null);
  const [shakenCard, setShakenCard] = useState<string | null>(null);

  // Initialize and shuffle cards
  useEffect(() => {
    const rawVocabs: VocabItem[] = vocabIds.map((id) => VOCAB_DICTIONARY[id]);
    
    // Shuffle picture order
    const shuffledPics = shuffleArray<VocabItem>(rawVocabs).map((v) => ({
      id: v.id,
      vocab: v,
    }));

    // Shuffle word order independently
    const shuffledWords = shuffleArray<VocabItem>(rawVocabs).map((v) => ({
      id: `word_${v.id}`,
      word: v.word,
      vocabId: v.id,
    }));

    setPictureCards(shuffledPics);
    setWordCards(shuffledWords);
    setMatchedIds([]);
    setSelectedPictureId(null);
    setSelectedWordVocabId(null);
    setFeedback(null);

    audio.speak("Match the pictures with the correct words! Drag or click to match!");
  }, [vocabIds]);

  // Check match logic
  const checkMatch = (picId: string, wordId: string) => {
    if (picId === wordId) {
      // Correct match!
      const vocab = VOCAB_DICTIONARY[picId];
      audio.playCorrect();
      
      const newMatched = [...matchedIds, picId];
      setMatchedIds(newMatched);

      onPairMatched(); // +10 points

      if (showPronunciationGuide) {
        setFeedback({
          type: 'correct',
          message: `✅ GREAT! "${vocab.word}" dibaca: "${vocab.pronunciationGuide}"`,
          vocab,
        });
        audio.speak(`${vocab.word}! Pronounced: ${vocab.word}`);
      } else {
        setFeedback({
          type: 'correct',
          message: '✅ GREAT! Pasangan Cocok!',
          vocab,
        });
        audio.speak(`Great! ${vocab.word}!`);
      }

      // Check if all matched
      if (newMatched.length === vocabIds.length) {
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
    } else {
      // Wrong match
      audio.playWrong();
      setShakenCard(wordId);
      setFeedback({
        type: 'wrong',
        message: '❌ TRY AGAIN! Pasangan belum tepat',
      });
      audio.speak("Try again!");
      setTimeout(() => {
        setShakenCard(null);
      }, 500);
    }

    // Reset temporary selections
    setSelectedPictureId(null);
    setSelectedWordVocabId(null);
  };

  // Click-to-Match: Click picture
  const handlePictureClick = (picId: string) => {
    if (matchedIds.includes(picId)) return;
    audio.playPop();

    if (selectedWordVocabId) {
      // A word was already clicked, attempt match
      checkMatch(picId, selectedWordVocabId);
    } else {
      setSelectedPictureId((prev) => (prev === picId ? null : picId));
    }
  };

  // Click-to-Match: Click word
  const handleWordClick = (vocabId: string) => {
    if (matchedIds.includes(vocabId)) return;
    audio.playPop();

    if (selectedPictureId) {
      // A picture was already clicked, attempt match
      checkMatch(selectedPictureId, vocabId);
    } else {
      setSelectedWordVocabId((prev) => (prev === vocabId ? null : vocabId));
    }
  };

  // Drag & Drop Handlers
  const handleDragStart = (e: React.DragEvent, vocabId: string) => {
    e.dataTransfer.setData('text/plain', vocabId);
    audio.playPop();
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, targetPicId: string) => {
    e.preventDefault();
    const draggedVocabId = e.dataTransfer.getData('text/plain');
    if (draggedVocabId) {
      checkMatch(targetPicId, draggedVocabId);
    }
  };

  const isAllMatched = matchedIds.length === vocabIds.length;

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-3 flex flex-col items-center">
      
      {/* Title & Instructions */}
      <div className="w-full bg-white/95 rounded-2xl p-3 border-2 border-amber-200 shadow-sm mb-4 text-center">
        <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-100 text-amber-900 text-xs font-black uppercase mb-1">
          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
          <span>{levelTitle}</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-black text-slate-800">
          {instructionEn}
        </h2>
        <p className="text-xs sm:text-sm font-bold text-slate-500 mt-0.5">
          {instructionId} • <span className="text-indigo-600">Drag kata ke gambar ATAU klik gambar lalu klik katanya!</span>
        </p>
      </div>

      {/* Dynamic Feedback Banner */}
      {feedback && (
        <div className={`w-full max-w-lg mb-4 py-2 px-4 rounded-2xl font-black text-sm sm:text-base text-center shadow-md flex items-center justify-center gap-2 animate-in fade-in zoom-in-95 ${
          feedback.type === 'correct' 
            ? 'bg-emerald-500 text-white' 
            : 'bg-rose-500 text-white'
        }`}>
          {feedback.type === 'correct' ? <CheckCircle2 className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
          <span>{feedback.message}</span>
          {feedback.vocab && (
            <button
              onClick={() => audio.speak(feedback.vocab!.word)}
              className="ml-2 p-1 rounded-full bg-white/30 hover:bg-white/50 text-white"
              title="Dengar Suara Kata"
            >
              <Volume2 className="w-4 h-4" />
            </button>
          )}
        </div>
      )}

      {/* Matching Board Grid */}
      <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 items-start">
        
        {/* LEFT COLUMN: PICTURE CARDS (Drop Target) */}
        <div className="bg-white/80 rounded-3xl p-4 border-2 border-sky-200 shadow-md">
          <h3 className="text-xs sm:text-sm font-black text-sky-800 uppercase tracking-wider mb-3 flex items-center gap-1.5">
            <span>🖼️ GAMBAR / PICTURES:</span>
            <span className="text-xs font-bold text-slate-400">({matchedIds.length}/{vocabIds.length} Selesai)</span>
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {pictureCards.map(({ id, vocab }) => {
              const isMatched = matchedIds.includes(id);
              const isSelected = selectedPictureId === id;

              return (
                <div
                  key={id}
                  id={`pic-card-${id}`}
                  onClick={() => handlePictureClick(id)}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, id)}
                  className={`relative flex flex-col items-center justify-center p-3 rounded-2xl border-3 transition-all duration-200 cursor-pointer ${
                    isMatched
                      ? 'bg-emerald-50 border-emerald-400 shadow-sm opacity-90'
                      : isSelected
                      ? 'bg-amber-100 border-amber-500 ring-4 ring-amber-300 scale-105 shadow-md'
                      : 'bg-white hover:bg-sky-50 border-sky-200 hover:border-sky-400 shadow-xs hover:scale-102'
                  }`}
                >
                  <VocabIllustration id={id} size="sm" />

                  {/* Pronunciation bubble if Challenge level & matched */}
                  {showPronunciationGuide && isMatched && (
                    <div className="mt-1 text-[11px] font-extrabold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-lg border border-emerald-300 text-center">
                      "{vocab.pronunciationGuide}"
                    </div>
                  )}

                  {/* Status Overlay */}
                  {isMatched ? (
                    <div className="mt-1 flex items-center gap-1 text-xs font-black text-emerald-700">
                      <Check className="w-4 h-4" />
                      <span>{vocab.word}</span>
                    </div>
                  ) : (
                    <span className="mt-1 text-[10px] font-bold text-slate-400">
                      {isSelected ? '👉 Dipilih' : 'Pasangkan ke sini'}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT COLUMN: WORD CARDS (Draggable / Clickable) */}
        <div className="bg-white/80 rounded-3xl p-4 border-2 border-purple-200 shadow-md">
          <h3 className="text-xs sm:text-sm font-black text-purple-800 uppercase tracking-wider mb-3 flex items-center gap-1.5">
            <span>📝 KATA / WORDS:</span>
            <span className="text-xs font-bold text-slate-400">Pilih atau Seret</span>
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-2 gap-3">
            {wordCards.map(({ id, word, vocabId }) => {
              const isMatched = matchedIds.includes(vocabId);
              const isSelected = selectedWordVocabId === vocabId;
              const isShaken = shakenCard === vocabId;

              return (
                <div
                  key={id}
                  id={`word-card-${vocabId}`}
                  draggable={!isMatched}
                  onDragStart={(e) => handleDragStart(e, vocabId)}
                  onClick={() => handleWordClick(vocabId)}
                  className={`p-3.5 rounded-2xl border-3 font-black text-base sm:text-lg flex items-center justify-between transition-all duration-200 cursor-pointer ${
                    isShaken ? 'animate-[wiggle_0.3s_ease-in-out]' : ''
                  } ${
                    isMatched
                      ? 'bg-emerald-100 border-emerald-400 text-emerald-800 opacity-60 pointer-events-none'
                      : isSelected
                      ? 'bg-purple-200 border-purple-600 text-purple-950 ring-4 ring-purple-300 scale-105 shadow-md'
                      : 'bg-white hover:bg-purple-50 border-purple-200 hover:border-purple-400 text-slate-800 shadow-xs hover:scale-102 active:scale-95'
                  }`}
                >
                  <span className="uppercase tracking-wide">{word}</span>
                  {isMatched ? (
                    <span className="text-xs font-extrabold bg-emerald-500 text-white px-2 py-0.5 rounded-lg flex items-center gap-1">
                      <Check className="w-3 h-3" /> MATCHED!
                    </span>
                  ) : (
                    <span className="text-xs text-slate-400">⠿</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* Completion Button */}
      {isAllMatched && (
        <div className="mt-8 w-full max-w-md animate-in fade-in slide-in-from-bottom-3">
          <button
            id="btn-matching-complete"
            onClick={() => {
              audio.playVictory();
              onLevelComplete();
            }}
            className="w-full py-4 px-6 rounded-3xl bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-black text-lg sm:text-xl shadow-xl flex items-center justify-center gap-2 transition transform hover:scale-102 active:scale-98 border-b-4 border-emerald-700"
          >
            <CheckCircle2 className="w-6 h-6" />
            <span>SEMUA COCOK! LANJUT REWARD 🎉</span>
          </button>
        </div>
      )}

    </div>
  );
};
