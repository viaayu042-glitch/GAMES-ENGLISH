import React from 'react';
import ummiAyuImg from '../assets/images/ummi_ayu_teacher_1789230001187.jpg';
import { audio } from '../utils/audio';
import { Volume2, Sparkles, Heart } from 'lucide-react';

interface UmmiAyuTeacherProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showSpeechBubble?: boolean;
  speechText?: string;
  className?: string;
  animate?: boolean;
  interactiveAudio?: boolean;
  showNameBadge?: boolean;
}

export const UmmiAyuTeacher: React.FC<UmmiAyuTeacherProps> = ({
  size = 'md',
  showSpeechBubble = false,
  speechText,
  className = '',
  animate = true,
  interactiveAudio = true,
  showNameBadge = true,
}) => {
  // Sizing definitions - Made significantly larger and clearer
  const sizeStyles = {
    sm: {
      container: 'w-20 h-20 sm:w-24 sm:h-24',
      image: 'w-20 h-20 sm:w-24 sm:h-24',
      bubble: 'text-xs max-w-[180px] p-2',
      badge: 'text-[10px] px-2 py-0.5',
    },
    md: {
      container: 'w-32 h-32 sm:w-40 sm:h-40',
      image: 'w-32 h-32 sm:w-40 sm:h-40',
      bubble: 'text-xs sm:text-sm max-w-[240px] p-2.5',
      badge: 'text-xs px-3 py-1',
    },
    lg: {
      container: 'w-44 h-44 sm:w-56 sm:h-56',
      image: 'w-44 h-44 sm:w-56 sm:h-56',
      bubble: 'text-sm sm:text-base max-w-[300px] p-3',
      badge: 'text-xs sm:text-sm px-3.5 py-1',
    },
    xl: {
      container: 'w-56 h-56 sm:w-72 sm:h-72',
      image: 'w-56 h-56 sm:w-72 sm:h-72',
      bubble: 'text-base max-w-[360px] p-4',
      badge: 'text-sm sm:text-base px-4 py-1.5',
    },
  };

  const handleTeacherClick = () => {
    if (!interactiveAudio) return;
    audio.playPop();
    const defaultGreetings = [
      "Assalamu'alaikum! Halo anak-anak hebat, selamat belajar bahasa Inggris bersama Ummi Ayu!",
      "Ayo semangat belajarnya! Kalian pasti bisa menjadi juara!",
      "Ingat, teliti melihat gambar dan dengarkan baik-baik cara membacanya ya!",
      "Masya Allah, hebat sekali semangat belajar kalian hari ini!",
    ];
    const textToSpeak =
      speechText ||
      defaultGreetings[Math.floor(Math.random() * defaultGreetings.length)];
    audio.speak(textToSpeak);
  };

  return (
    <div
      className={`relative inline-flex items-center gap-3 select-none ${className}`}
    >
      {/* Speech Bubble (if requested) */}
      {showSpeechBubble && speechText && (
        <div
          className={`relative bg-white/95 text-slate-800 font-bold rounded-3xl shadow-xl border-3 border-amber-300 ${sizeStyles[size].bubble} mb-auto z-10 animate-fade-in`}
        >
          <div className="flex items-center justify-between gap-1 mb-1">
            <span className="text-xs font-black text-amber-900 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              Ummi Ayu
            </span>
            <button
              onClick={handleTeacherClick}
              title="Dengarkan Suara Ummi Ayu"
              className="p-1 rounded-full hover:bg-amber-100 text-amber-700 transition"
            >
              <Volume2 className="w-4 h-4" />
            </button>
          </div>
          <p className="leading-snug text-slate-700">{speechText}</p>

          {/* Bubble tail pointer */}
          <div className="absolute -bottom-2 right-6 w-3.5 h-3.5 bg-white border-r-3 border-b-3 border-amber-300 transform rotate-45" />
        </div>
      )}

      {/* 3D Pixar Animation Portrait Container */}
      <div
        onClick={handleTeacherClick}
        className={`group relative flex flex-col items-center cursor-pointer transition-all duration-300 ${
          interactiveAudio ? 'hover:scale-105 active:scale-95' : ''
        }`}
        title="Ummi Ayu (Klik untuk mendengarkan sapaan)"
      >
        {/* Soft Warm Glow Behind Portrait */}
        <div className="absolute inset-0 bg-amber-300/40 rounded-3xl filter blur-lg -z-10 scale-95 group-hover:scale-110 transition-transform" />

        {/* 3D Pixar Super HD Character Image */}
        <div
          className={`relative ${sizeStyles[size].container} rounded-3xl overflow-hidden border-3 sm:border-4 border-amber-300 shadow-xl bg-gradient-to-b from-amber-100 to-amber-200`}
        >
          <img
            src={ummiAyuImg}
            alt="Ummi Ayu - Animasi 3D"
            referrerPolicy="no-referrer"
            className={`w-full h-full object-cover object-top ${
              animate ? 'transition-transform duration-500 group-hover:scale-108' : ''
            }`}
            loading="eager"
          />

          {/* Subtle shine overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-white/10 pointer-events-none" />
        </div>

        {/* Name pill badge */}
        {showNameBadge && (
          <div className="mt-1.5 flex flex-col items-center">
            <span
              className={`font-black text-amber-950 bg-gradient-to-r from-amber-200 to-yellow-200 border-2 border-amber-400 rounded-full shadow-md flex items-center gap-1.5 tracking-wide ${sizeStyles[size].badge}`}
            >
              <Heart className="w-3 h-3 fill-rose-500 text-rose-500 inline" />
              Ummi Ayu
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
