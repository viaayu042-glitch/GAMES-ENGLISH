import React, { useState } from 'react';
import { Home, Volume2, VolumeX, Music, RotateCcw, Award, Users, User, Sparkles } from 'lucide-react';
import { audio } from '../utils/audio';
import { AnimalId } from '../types';
import { ANIMAL_CHARACTERS } from '../utils/characters';

interface NavbarProps {
  grade: 1 | 2 | null;
  levelText: string;
  score: number;
  mode: 'solo' | 'multiplayer';
  playerName?: string;
  playerAnimalId?: AnimalId;
  onHomeClick: () => void;
  onRestartClick?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  grade,
  levelText,
  score,
  mode,
  playerName,
  playerAnimalId,
  onHomeClick,
  onRestartClick,
}) => {
  const [musicOn, setMusicOn] = useState(audio.isMusicOn());
  const [musicVol, setMusicVol] = useState(audio.getMusicVolume());
  const [speechOn, setSpeechOn] = useState(audio.isSpeechOn());
  const [showAudioSettings, setShowAudioSettings] = useState(false);

  const activeMascot = playerAnimalId
    ? ANIMAL_CHARACTERS.find((a) => a.id === playerAnimalId)
    : null;

  const handleToggleMusic = () => {
    const isPlaying = audio.toggleMusic();
    setMusicOn(isPlaying);
    audio.playPop();
  };

  const handleToggleSpeech = () => {
    const nextVal = !speechOn;
    setSpeechOn(nextVal);
    audio.setSpeechEnabled(nextVal);
    audio.playPop();
    if (nextVal) {
      audio.speak("Voice enabled!");
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setMusicVol(val);
    audio.setMusicVolume(val);
  };

  return (
    <header className="w-full max-w-6xl mx-auto px-3 py-2 sm:px-4 sm:py-3 z-30">
      <div className="bg-white/95 backdrop-blur-md rounded-2xl sm:rounded-3xl border-3 border-amber-200 shadow-md p-2.5 sm:p-3 flex items-center justify-between gap-2 flex-wrap">
        
        {/* Left: Home & Grade Badge */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            id="nav-btn-home"
            onClick={() => {
              audio.playPop();
              onHomeClick();
            }}
            className="flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-amber-100 hover:bg-amber-200 text-amber-900 font-extrabold text-sm sm:text-base transition transform active:scale-95 shadow-sm border border-amber-300"
            title="Kembali ke Beranda"
          >
            <Home className="w-5 h-5 text-amber-700" />
            <span className="hidden md:inline">HOME</span>
          </button>

          {grade && (
            <div className="flex items-center gap-2">
              <span className={`px-3 py-1 rounded-xl text-xs sm:text-sm font-black tracking-wider uppercase shadow-xs ${
                grade === 1 
                  ? 'bg-sky-100 text-sky-800 border border-sky-300' 
                  : 'bg-purple-100 text-purple-800 border border-purple-300'
              }`}>
                CLASS {grade}
              </span>
              {levelText && (
                <span className="text-xs sm:text-sm font-bold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-xl hidden sm:inline-block">
                  {levelText}
                </span>
              )}
            </div>
          )}

          <div className="flex items-center gap-1 bg-emerald-50 border border-emerald-200 text-emerald-800 px-2.5 py-1 rounded-xl text-xs font-bold">
            {mode === 'multiplayer' ? (
              <>
                <Users className="w-3.5 h-3.5 text-emerald-600" />
                <span>2-5 PLAYERS</span>
              </>
            ) : (
              <>
                {activeMascot ? (
                  <span className="text-sm mr-0.5">{activeMascot.iconSvg}</span>
                ) : (
                  <User className="w-3.5 h-3.5 text-emerald-600" />
                )}
                <span className="font-extrabold truncate max-w-[100px] sm:max-w-none">
                  {playerName || 'SOLO'}
                </span>
              </>
            )}
          </div>
        </div>

        {/* Center: Score Display */}
        <div className="flex items-center gap-1.5 bg-gradient-to-r from-amber-400 to-yellow-400 text-amber-950 px-4 py-1.5 rounded-2xl font-black text-sm sm:text-lg shadow-sm border-2 border-amber-300">
          <Award className="w-5 h-5 text-amber-900 animate-pulse" />
          <span>SCORE:</span>
          <span className="text-white text-base sm:text-xl drop-shadow-sm font-extrabold bg-amber-700/30 px-2 py-0.5 rounded-lg ml-1">
            {score}
          </span>
        </div>

        {/* Right: Audio & Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Read aloud Voice button */}
          <button
            id="nav-btn-speech"
            onClick={handleToggleSpeech}
            className={`p-2 rounded-2xl font-bold transition transform active:scale-90 border shadow-xs flex items-center gap-1 text-xs ${
              speechOn 
                ? 'bg-pink-100 border-pink-300 text-pink-700 hover:bg-pink-200' 
                : 'bg-slate-100 border-slate-300 text-slate-400 hover:bg-slate-200'
            }`}
            title={speechOn ? 'Suara Narasi Aktif (Klik untuk matikan)' : 'Suara Narasi Mati (Klik untuk aktifkan)'}
          >
            {speechOn ? <Volume2 className="w-4 h-4 text-pink-600" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
            <span className="hidden lg:inline">{speechOn ? 'Voice On' : 'Voice Off'}</span>
          </button>

          {/* Music Toggle & Volume Popover */}
          <div className="relative">
            <button
              id="nav-btn-music"
              onClick={handleToggleMusic}
              onContextMenu={(e) => {
                e.preventDefault();
                setShowAudioSettings(!showAudioSettings);
              }}
              className={`p-2 rounded-2xl font-bold transition transform active:scale-90 border shadow-xs flex items-center gap-1 text-xs ${
                musicOn 
                  ? 'bg-lime-100 border-lime-300 text-lime-800 hover:bg-lime-200 animate-pulse' 
                  : 'bg-slate-100 border-slate-300 text-slate-400 hover:bg-slate-200'
              }`}
              title="Lagu Tema Petualangan (Klik untuk Hidupkan/Matikan)"
            >
              <Music className={`w-4 h-4 ${musicOn ? 'text-lime-700' : 'text-slate-400'}`} />
              <span className="hidden lg:inline">{musicOn ? 'Music On' : 'Music Off'}</span>
            </button>

            {/* Quick volume control badge */}
            <button
              onClick={() => setShowAudioSettings(!showAudioSettings)}
              className="ml-1 text-[11px] font-bold text-slate-500 hover:text-slate-800 underline hidden sm:inline"
            >
              {Math.round(musicVol * 100)}%
            </button>

            {/* Audio Settings Panel */}
            {showAudioSettings && (
              <div className="absolute right-0 top-12 w-64 bg-white rounded-2xl shadow-xl border-2 border-amber-200 p-3 z-50 animate-in fade-in zoom-in-95">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-black text-slate-700 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" /> PENGATURAN MUSIK
                  </span>
                  <button 
                    onClick={() => setShowAudioSettings(false)}
                    className="text-xs text-slate-400 hover:text-slate-700 font-bold px-1"
                  >
                    ✕
                  </button>
                </div>

                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-xs font-bold text-slate-600 mb-1">
                      <span>Volume Musik (BGM)</span>
                      <span>{Math.round(musicVol * 100)}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.05"
                      value={musicVol}
                      onChange={handleVolumeChange}
                      className="w-full accent-amber-500 cursor-pointer"
                    />
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                    <span>Suara Lagu Petualangan Ceria</span>
                    <button
                      onClick={handleToggleMusic}
                      className="px-2 py-1 rounded-lg bg-amber-100 text-amber-800 font-bold hover:bg-amber-200"
                    >
                      {musicOn ? 'Jeda' : 'Putar'}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Restart level if present */}
          {onRestartClick && (
            <button
              id="nav-btn-restart"
              onClick={() => {
                audio.playPop();
                onRestartClick();
              }}
              className="p-2 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-xs transition transform active:scale-95 border border-slate-200"
              title="Mulai Ulang Level Ini"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}
        </div>

      </div>
    </header>
  );
};
