import React from 'react';
import { AnimalCharacter } from '../types';

export const ANIMAL_CHARACTERS: AnimalCharacter[] = [
  {
    id: 'dolphin',
    name: 'Dolly',
    indonesianName: 'Lumba-lumba',
    title: 'Dolly the Dolphin',
    avatarColor: '#38BDF8', // Pastel Sky Blue
    accentColor: '#0284C7',
    badgeBg: 'bg-sky-100 border-sky-300 text-sky-800',
    catchphrase: 'Splashing into English! 🌊',
    iconSvg: '🐬',
  },
  {
    id: 'turtle',
    name: 'Toby',
    indonesianName: 'Kura-kura',
    title: 'Toby the Turtle',
    avatarColor: '#4ADE80', // Pastel Green
    accentColor: '#16A34A',
    badgeBg: 'bg-emerald-100 border-emerald-300 text-emerald-800',
    catchphrase: 'Slow, steady, and smart! 🐢',
    iconSvg: '🐢',
  },
  {
    id: 'panda',
    name: 'Pim',
    indonesianName: 'Panda',
    title: 'Pim the Panda',
    avatarColor: '#F472B6', // Pastel Pink / Cream
    accentColor: '#DB2777',
    badgeBg: 'bg-pink-100 border-pink-300 text-pink-800',
    catchphrase: 'Sweet and super ready! 🎋',
    iconSvg: '🐼',
  },
  {
    id: 'gorilla',
    name: 'Gino',
    indonesianName: 'Gorila',
    title: 'Gino the Gorilla',
    avatarColor: '#A78BFA', // Soft Purple
    accentColor: '#7C3AED',
    badgeBg: 'bg-purple-100 border-purple-300 text-purple-800',
    catchphrase: 'Strong reader champion! 🦍',
    iconSvg: '🦍',
  },
  {
    id: 'pufferfish',
    name: 'Puff',
    indonesianName: 'Ikan Buntal',
    title: 'Puff the Pufferfish',
    avatarColor: '#FBBF24', // Pastel Warm Yellow
    accentColor: '#D97706',
    badgeBg: 'bg-amber-100 border-amber-300 text-amber-800',
    catchphrase: 'Full of bubbly fun! 🐡',
    iconSvg: '🐡',
  },
];

interface AnimalAvatarProps {
  id: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  animate?: boolean;
}

export const AnimalAvatar: React.FC<AnimalAvatarProps> = ({ id, size = 'md', className = '', animate = false }) => {
  const sizeClasses = {
    sm: 'w-10 h-10',
    md: 'w-16 h-16',
    lg: 'w-24 h-24',
    xl: 'w-36 h-36',
  };

  const animClass = animate ? 'animate-bounce' : '';

  switch (id) {
    case 'dolphin':
      return (
        <div className={`${sizeClasses[size]} rounded-2xl bg-gradient-to-b from-sky-200 to-sky-400 p-1.5 shadow-md flex items-center justify-center ${animClass} ${className}`}>
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow">
            {/* Dolphin Body */}
            <path d="M15,65 Q30,20 70,30 Q90,38 95,50 Q85,55 75,50 Q55,50 40,65 Q25,80 15,65 Z" fill="#38BDF8" stroke="#0284C7" strokeWidth="2.5" strokeLinecap="round" />
            {/* Belly */}
            <path d="M35,62 Q50,52 70,48 Q60,65 42,66 Z" fill="#E0F2FE" />
            {/* Fin */}
            <path d="M50,30 Q58,15 65,28 Z" fill="#0284C7" />
            {/* Flipper */}
            <path d="M42,55 Q48,70 58,60 Z" fill="#0284C7" />
            {/* Tail */}
            <path d="M15,65 L5,58 Q10,65 5,72 Z" fill="#0284C7" />
            {/* Eye */}
            <circle cx="75" cy="40" r="4.5" fill="#0F172A" />
            <circle cx="76.5" cy="38.5" r="1.8" fill="#FFFFFF" />
            {/* Cute Smile */}
            <path d="M78,47 Q82,50 86,46" fill="none" stroke="#0369A1" strokeWidth="2" strokeLinecap="round" />
            {/* Water drops */}
            <circle cx="88" cy="25" r="2.5" fill="#BAE6FD" />
            <circle cx="92" cy="18" r="1.5" fill="#BAE6FD" />
          </svg>
        </div>
      );

    case 'turtle':
      return (
        <div className={`${sizeClasses[size]} rounded-2xl bg-gradient-to-b from-emerald-200 to-emerald-400 p-1.5 shadow-md flex items-center justify-center ${animClass} ${className}`}>
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow">
            {/* Little Legs */}
            <ellipse cx="25" cy="35" rx="8" ry="6" fill="#86EFAC" stroke="#15803D" strokeWidth="2" />
            <ellipse cx="75" cy="35" rx="8" ry="6" fill="#86EFAC" stroke="#15803D" strokeWidth="2" />
            <ellipse cx="22" cy="70" rx="8" ry="6" fill="#86EFAC" stroke="#15803D" strokeWidth="2" />
            <ellipse cx="78" cy="70" rx="8" ry="6" fill="#86EFAC" stroke="#15803D" strokeWidth="2" />
            {/* Head */}
            <circle cx="50" cy="22" r="14" fill="#86EFAC" stroke="#15803D" strokeWidth="2.5" />
            {/* Turtle Shell */}
            <circle cx="50" cy="55" r="32" fill="#16A34A" stroke="#14532D" strokeWidth="3" />
            <circle cx="50" cy="55" r="24" fill="#22C55E" />
            {/* Shell Hexagon Pattern */}
            <polygon points="50,42 62,49 62,63 50,70 38,63 38,49" fill="#15803D" opacity="0.3" stroke="#DCFCE7" strokeWidth="1.5" />
            {/* Eyes */}
            <circle cx="44" cy="20" r="3.5" fill="#0F172A" />
            <circle cx="45" cy="19" r="1.2" fill="#FFFFFF" />
            <circle cx="56" cy="20" r="3.5" fill="#0F172A" />
            <circle cx="57" cy="19" r="1.2" fill="#FFFFFF" />
            {/* Cheeks */}
            <circle cx="39" cy="25" r="2.5" fill="#F472B6" opacity="0.7" />
            <circle cx="61" cy="25" r="2.5" fill="#F472B6" opacity="0.7" />
            {/* Smile */}
            <path d="M47,26 Q50,29 53,26" fill="none" stroke="#14532D" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </div>
      );

    case 'panda':
      return (
        <div className={`${sizeClasses[size]} rounded-2xl bg-gradient-to-b from-pink-200 to-rose-300 p-1.5 shadow-md flex items-center justify-center ${animClass} ${className}`}>
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow">
            {/* Ears */}
            <circle cx="28" cy="28" r="11" fill="#1E293B" />
            <circle cx="72" cy="28" r="11" fill="#1E293B" />
            {/* Head */}
            <circle cx="50" cy="54" r="34" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="2.5" />
            {/* Eye Patches */}
            <ellipse cx="37" cy="50" rx="9" ry="11" fill="#1E293B" transform="rotate(-15 37 50)" />
            <ellipse cx="63" cy="50" rx="9" ry="11" fill="#1E293B" transform="rotate(15 63 50)" />
            {/* Eyes */}
            <circle cx="38" cy="49" r="3.5" fill="#FFFFFF" />
            <circle cx="39" cy="48" r="1.8" fill="#0F172A" />
            <circle cx="62" cy="49" r="3.5" fill="#FFFFFF" />
            <circle cx="61" cy="48" r="1.8" fill="#0F172A" />
            {/* Nose */}
            <polygon points="50,59 46,55 54,55" fill="#1E293B" />
            {/* Cute Smile */}
            <path d="M46,63 Q50,67 54,63" fill="none" stroke="#1E293B" strokeWidth="2" strokeLinecap="round" />
            {/* Pink Cheeks */}
            <circle cx="28" cy="61" r="5" fill="#FDA4AF" opacity="0.8" />
            <circle cx="72" cy="61" r="5" fill="#FDA4AF" opacity="0.8" />
          </svg>
        </div>
      );

    case 'gorilla':
      return (
        <div className={`${sizeClasses[size]} rounded-2xl bg-gradient-to-b from-purple-200 to-indigo-300 p-1.5 shadow-md flex items-center justify-center ${animClass} ${className}`}>
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow">
            {/* Crest/Head shape */}
            <path d="M30,35 Q50,14 70,35 Q84,52 75,76 Q50,88 25,76 Q16,52 30,35 Z" fill="#475569" stroke="#334155" strokeWidth="2" />
            {/* Ears */}
            <circle cx="18" cy="52" r="7" fill="#64748B" />
            <circle cx="82" cy="52" r="7" fill="#64748B" />
            {/* Face mask */}
            <path d="M32,46 Q50,40 68,46 Q74,62 65,72 Q50,78 35,72 Q26,62 32,46 Z" fill="#94A3B8" />
            {/* Brow ridge */}
            <path d="M33,45 Q50,42 67,45" stroke="#334155" strokeWidth="3" fill="none" strokeLinecap="round" />
            {/* Friendly Big Eyes */}
            <circle cx="41" cy="50" r="4.5" fill="#0F172A" />
            <circle cx="42" cy="48" r="1.6" fill="#FFFFFF" />
            <circle cx="59" cy="50" r="4.5" fill="#0F172A" />
            <circle cx="60" cy="48" r="1.6" fill="#FFFFFF" />
            {/* Nose holes */}
            <ellipse cx="47" cy="60" rx="2" ry="2.5" fill="#334155" />
            <ellipse cx="53" cy="60" rx="2" ry="2.5" fill="#334155" />
            {/* Gentle Smile */}
            <path d="M43,67 Q50,72 57,67" fill="none" stroke="#0F172A" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
        </div>
      );

    case 'pufferfish':
    default:
      return (
        <div className={`${sizeClasses[size]} rounded-2xl bg-gradient-to-b from-amber-200 to-yellow-400 p-1.5 shadow-md flex items-center justify-center ${animClass} ${className}`}>
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow">
            {/* Little Spikes/Quills around body */}
            <polygon points="50,10 46,18 54,18" fill="#D97706" />
            <polygon points="20,24 28,30 25,36" fill="#D97706" />
            <polygon points="80,24 75,36 72,30" fill="#D97706" />
            <polygon points="12,50 20,46 20,54" fill="#D97706" />
            <polygon points="88,50 80,46 80,54" fill="#D97706" />
            <polygon points="22,76 25,66 32,72" fill="#D97706" />
            <polygon points="78,76 68,72 75,66" fill="#D97706" />
            {/* Round Body */}
            <circle cx="50" cy="52" r="36" fill="#FBBF24" stroke="#D97706" strokeWidth="2.5" />
            {/* Belly */}
            <ellipse cx="50" cy="66" rx="26" ry="18" fill="#FEF3C7" />
            {/* Fins */}
            <ellipse cx="14" cy="56" rx="6" ry="10" fill="#F59E0B" transform="rotate(-20 14 56)" />
            <ellipse cx="86" cy="56" rx="6" ry="10" fill="#F59E0B" transform="rotate(20 86 56)" />
            {/* Big Expressive Eyes */}
            <circle cx="40" cy="44" r="7" fill="#FFFFFF" stroke="#D97706" strokeWidth="1.5" />
            <circle cx="41" cy="44" r="4.5" fill="#0F172A" />
            <circle cx="43" cy="42" r="1.6" fill="#FFFFFF" />
            <circle cx="60" cy="44" r="7" fill="#FFFFFF" stroke="#D97706" strokeWidth="1.5" />
            <circle cx="59" cy="44" r="4.5" fill="#0F172A" />
            <circle cx="61" cy="42" r="1.6" fill="#FFFFFF" />
            {/* Cheerful kissy mouth */}
            <ellipse cx="50" cy="57" rx="4" ry="3" fill="#EF4444" />
            {/* Cheeks */}
            <circle cx="32" cy="53" r="3.5" fill="#FB923C" opacity="0.6" />
            <circle cx="68" cy="53" r="3.5" fill="#FB923C" opacity="0.6" />
          </svg>
        </div>
      );
  }
};
