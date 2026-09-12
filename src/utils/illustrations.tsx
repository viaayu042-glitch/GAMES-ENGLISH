import React from 'react';

interface IllustrationProps {
  id: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  mysteryMask?: boolean; // For mystery level: partially covered!
}

export const VocabIllustration: React.FC<IllustrationProps> = ({
  id,
  size = 'lg',
  className = '',
  mysteryMask = false,
}) => {
  const sizeClasses = {
    xs: 'w-8 h-8 p-0.5',
    sm: 'w-14 h-14 p-1',
    md: 'w-24 h-24 p-2',
    lg: 'w-40 h-40 p-3',
    xl: 'w-56 h-56 p-4',
  };

  const renderSvgContent = () => {
    switch (id.toLowerCase()) {
      // ==========================================
      // KELAS 1: PERALATAN SEKOLAH (10 ITEM)
      // ==========================================
      case 'bag':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
            {/* Top Handle */}
            <path d="M38,30 C38,18 62,18 62,30" fill="none" stroke="#047857" strokeWidth="5" strokeLinecap="round" />
            {/* Main Backpack Body */}
            <rect x="22" y="28" width="56" height="56" rx="14" fill="#10B981" stroke="#047857" strokeWidth="3" />
            {/* Front Pocket */}
            <rect x="30" y="52" width="40" height="26" rx="8" fill="#34D399" stroke="#059669" strokeWidth="2.5" />
            {/* Zipper details */}
            <path d="M30,52 C30,52 50,56 70,52" fill="none" stroke="#FBBF24" strokeWidth="2.5" strokeDasharray="3,2" />
            <circle cx="50" cy="54" r="3" fill="#D97706" />
            {/* Side pockets */}
            <rect x="17" y="50" width="6" height="22" rx="3" fill="#059669" />
            <rect x="77" y="50" width="6" height="22" rx="3" fill="#059669" />
            {/* Star badge */}
            <circle cx="50" cy="40" r="6" fill="#FDE047" stroke="#CA8A04" strokeWidth="1.5" />
            <polygon points="50,36 51.5,39 55,39.5 52.5,41.5 53.5,45 50,43 46.5,45 47.5,41.5 45,39.5 48.5,39" fill="#D97706" />
          </svg>
        );

      case 'marker':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
            <g transform="rotate(-30 50 50)">
              {/* Marker Cap */}
              <rect x="20" y="38" width="22" height="24" rx="4" fill="#0284C7" stroke="#0369A1" strokeWidth="2" />
              <rect x="16" y="44" width="4" height="12" rx="2" fill="#38BDF8" />
              {/* Clip */}
              <rect x="24" y="34" width="14" height="4" rx="2" fill="#0369A1" />
              {/* Marker Body */}
              <rect x="42" y="40" width="40" height="20" rx="3" fill="#38BDF8" stroke="#0284C7" strokeWidth="2" />
              {/* Marker tip collar */}
              <polygon points="82,42 90,46 90,54 82,58" fill="#CBD5E1" stroke="#64748B" strokeWidth="1.5" />
              {/* Felt Tip */}
              <polygon points="90,46 98,48 98,52 90,54" fill="#0284C7" />
              {/* Brand Band */}
              <rect x="48" y="40" width="12" height="20" fill="#FFFFFF" opacity="0.8" />
              <text x="54" y="54" fontSize="7" fontWeight="bold" fill="#0369A1" textAnchor="middle">MARK</text>
            </g>
          </svg>
        );

      case 'crayon':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
            <g transform="rotate(-25 50 50)">
              {/* Crayon Wax Tip */}
              <polygon points="20,50 32,41 32,59" fill="#EC4899" stroke="#BE185D" strokeWidth="2" />
              <circle cx="24" cy="50" r="3" fill="#F472B6" />
              {/* Crayon Body */}
              <rect x="32" y="41" width="50" height="18" fill="#F43F5E" stroke="#BE123C" strokeWidth="2" />
              {/* Paper Wrapper */}
              <rect x="40" y="39" width="34" height="22" rx="2" fill="#FEF08A" stroke="#CA8A04" strokeWidth="2" />
              {/* Wavy line pattern on wrapper */}
              <path d="M44,43 Q48,40 52,43 T60,43 T68,43" fill="none" stroke="#BE123C" strokeWidth="2" />
              <path d="M44,57 Q48,54 52,57 T60,57 T68,57" fill="none" stroke="#BE123C" strokeWidth="2" />
              {/* Crayon Base */}
              <rect x="82" y="41" width="6" height="18" rx="2" fill="#EC4899" stroke="#BE185D" strokeWidth="1.5" />
            </g>
          </svg>
        );

      case 'pencil':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
            <g transform="rotate(-35 50 50)">
              {/* Eraser */}
              <rect x="22" y="40" width="15" height="20" rx="3" fill="#FB7185" stroke="#E11D48" strokeWidth="2" />
              {/* Metal Ferrule */}
              <rect x="37" y="39" width="8" height="22" fill="#CBD5E1" stroke="#64748B" strokeWidth="1.5" />
              {/* Pencil Body */}
              <rect x="45" y="39" width="34" height="22" fill="#FBBF24" stroke="#D97706" strokeWidth="2" />
              {/* Facet Highlights */}
              <line x1="45" y1="46" x2="79" y2="46" stroke="#FDE68A" strokeWidth="2" />
              <line x1="45" y1="54" x2="79" y2="54" stroke="#B45309" strokeWidth="1.5" />
              {/* Wood Tip */}
              <polygon points="79,39 95,50 79,61" fill="#FED7AA" stroke="#EA580C" strokeWidth="1.5" />
              {/* Graphite Point */}
              <polygon points="89,46 95,50 89,54" fill="#334155" />
            </g>
          </svg>
        );

      case 'eraser':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
            <g transform="rotate(-15 50 50)">
              {/* 3D Dual-color Eraser */}
              <rect x="18" y="36" width="34" height="28" rx="4" fill="#F43F5E" stroke="#BE123C" strokeWidth="2" />
              <rect x="50" y="36" width="32" height="28" rx="4" fill="#3B82F6" stroke="#1D4ED8" strokeWidth="2" />
              <line x1="22" y1="42" x2="78" y2="42" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
              <line x1="51" y1="36" x2="51" y2="64" stroke="#0F172A" strokeWidth="2" strokeDasharray="2,2" />
              <text x="30" y="54" fontSize="9" fontWeight="bold" fill="#FFF">ER</text>
              <text x="59" y="54" fontSize="9" fontWeight="bold" fill="#FFF">ASE</text>
            </g>
          </svg>
        );

      case 'book':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
            {/* Book Spine & Cover */}
            <path d="M12,28 C28,24 45,28 50,32 C55,28 72,24 88,28 L88,76 C72,72 55,76 50,80 C45,76 28,72 12,76 Z" fill="#3B82F6" stroke="#1D4ED8" strokeWidth="3" />
            {/* Pages Thickness */}
            <path d="M15,31 C30,27 45,30 50,34 C55,30 70,27 85,31 L85,73 C70,69 55,73 50,77 C45,73 30,69 15,73 Z" fill="#F8FAFC" stroke="#CBD5E1" strokeWidth="1.5" />
            {/* Spine Center line */}
            <line x1="50" y1="34" x2="50" y2="77" stroke="#94A3B8" strokeWidth="2.5" />
            {/* Bookmark ribbon */}
            <path d="M50,34 L56,48 L50,44 L44,48 Z" fill="#EF4444" />
            {/* Star cover icon */}
            <polygon points="70,44 72,50 78,50 73,54 75,60 70,56 65,60 67,54 62,50 68,50" fill="#FBBF24" stroke="#D97706" strokeWidth="1" />
            {/* Page lines */}
            <line x1="22" y1="42" x2="42" y2="39" stroke="#E2E8F0" strokeWidth="2" strokeLinecap="round" />
            <line x1="22" y1="50" x2="42" y2="47" stroke="#E2E8F0" strokeWidth="2" strokeLinecap="round" />
            <line x1="22" y1="58" x2="38" y2="55" stroke="#E2E8F0" strokeWidth="2" strokeLinecap="round" />
          </svg>
        );

      case 'colored_pencils':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
            {/* Three colored pencils grouped together (Red, Green, Blue) */}
            {/* Pencil 1 (Red) */}
            <g transform="rotate(-18 35 50)">
              <rect x="25" y="32" width="10" height="38" fill="#EF4444" stroke="#B91C1C" strokeWidth="1.5" />
              <polygon points="25,32 35,32 30,18" fill="#FED7AA" stroke="#EA580C" strokeWidth="1" />
              <polygon points="28,24 32,24 30,18" fill="#DC2626" />
            </g>
            {/* Pencil 2 (Green) */}
            <g transform="translate(45 15)">
              <rect x="0" y="20" width="10" height="42" fill="#10B981" stroke="#047857" strokeWidth="1.5" />
              <polygon points="0,20 10,20 5,6" fill="#FED7AA" stroke="#EA580C" strokeWidth="1" />
              <polygon points="3,12 7,12 5,6" fill="#059669" />
            </g>
            {/* Pencil 3 (Blue) */}
            <g transform="rotate(18 65 50)">
              <rect x="65" y="32" width="10" height="38" fill="#3B82F6" stroke="#1D4ED8" strokeWidth="1.5" />
              <polygon points="65,32 75,32 70,18" fill="#FED7AA" stroke="#EA580C" strokeWidth="1" />
              <polygon points="68,24 72,24 70,18" fill="#2563EB" />
            </g>
            {/* Colorful Ribbon / Cup base */}
            <ellipse cx="50" cy="74" rx="28" ry="8" fill="#FEF3C7" stroke="#F59E0B" strokeWidth="2" />
            <text x="50" y="88" fontSize="8" fontWeight="black" fill="#D97706" textAnchor="middle">COLOR</text>
          </svg>
        );

      case 'glue':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
            {/* Glue Stick Body */}
            <rect x="34" y="32" width="32" height="48" rx="6" fill="#FFFFFF" stroke="#0284C7" strokeWidth="2.5" />
            {/* Red Twist Base */}
            <rect x="34" y="72" width="32" height="12" rx="4" fill="#EF4444" stroke="#B91C1C" strokeWidth="2" />
            <line x1="42" y1="72" x2="42" y2="84" stroke="#B91C1C" strokeWidth="1.5" />
            <line x1="50" y1="72" x2="50" y2="84" stroke="#B91C1C" strokeWidth="1.5" />
            <line x1="58" y1="72" x2="58" y2="84" stroke="#B91C1C" strokeWidth="1.5" />
            {/* Cap */}
            <rect x="36" y="16" width="28" height="20" rx="4" fill="#38BDF8" stroke="#0284C7" strokeWidth="2" />
            {/* Label */}
            <rect x="38" y="40" width="24" height="24" rx="3" fill="#FEF08A" stroke="#EAB308" strokeWidth="1.5" />
            <text x="50" y="55" fontSize="9" fontWeight="900" fill="#0369A1" textAnchor="middle">GLUE</text>
            <circle cx="50" cy="45" r="2.5" fill="#EF4444" />
          </svg>
        );

      case 'ruler':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
            <g transform="rotate(30 50 50)">
              {/* Ruler body */}
              <rect x="10" y="40" width="80" height="20" rx="3" fill="#F59E0B" stroke="#B45309" strokeWidth="2" />
              {/* Measurement lines */}
              {[18, 26, 34, 42, 50, 58, 66, 74, 82].map((x, i) => (
                <React.Fragment key={x}>
                  <line x1={x} y1="40" x2={x} y2={i % 2 === 0 ? '51' : '46'} stroke="#78350F" strokeWidth="1.8" />
                  {i % 2 === 0 && (
                    <text x={x - 2} y="57" fontSize="6" fontWeight="bold" fill="#78350F">
                      {i / 2 + 1}
                    </text>
                  )}
                </React.Fragment>
              ))}
            </g>
          </svg>
        );

      case 'notebook':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
            {/* Spiral Notebook Cover */}
            <rect x="24" y="18" width="56" height="66" rx="6" fill="#8B5CF6" stroke="#6D28D9" strokeWidth="2.5" />
            {/* Spiral Rings on left */}
            {[26, 34, 42, 50, 58, 66, 74].map((y) => (
              <g key={y}>
                <ellipse cx="22" cy={y} rx="4" ry="2.5" fill="#CBD5E1" stroke="#475569" strokeWidth="1.5" />
              </g>
            ))}
            {/* Title sticker on cover */}
            <rect x="36" y="30" width="34" height="22" rx="4" fill="#FFFFFF" stroke="#DDD6FE" strokeWidth="1.5" />
            <line x1="40" y1="38" x2="64" y2="38" stroke="#A78BFA" strokeWidth="2" strokeLinecap="round" />
            <line x1="40" y1="44" x2="58" y2="44" stroke="#C4B5FD" strokeWidth="2" strokeLinecap="round" />
            {/* Notebook Ribbon Bookmark */}
            <path d="M50,18 L50,60 L54,56 L58,60 L58,18 Z" fill="#F43F5E" />
          </svg>
        );

      // ==========================================
      // KELAS 2: NAMA-NAMA SAYURAN (11 ITEM)
      // ==========================================
      case 'shallot':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
            {/* Shallot Bulb: Purple / Red onion shape */}
            {/* Green shoots at top */}
            <path d="M50,30 Q46,12 38,10 Q44,22 48,32 Z" fill="#22C55E" />
            <path d="M50,30 Q54,12 62,8 Q56,22 52,32 Z" fill="#16A34A" />
            {/* Main Bulb */}
            <path
              d="M50,30 C32,32 20,48 24,68 C28,84 44,88 50,88 C56,88 72,84 76,68 C80,48 68,32 50,30 Z"
              fill="#A855F7"
              stroke="#7E22CE"
              strokeWidth="2.5"
            />
            {/* Onion layers shading */}
            <path d="M50,32 Q36,54 40,84" fill="none" stroke="#C084FC" strokeWidth="2.5" />
            <path d="M50,32 Q64,54 60,84" fill="none" stroke="#7E22CE" strokeWidth="2" />
            {/* Root whiskers */}
            <path d="M46,88 Q44,95 40,96" stroke="#D8B4FE" strokeWidth="2" fill="none" />
            <path d="M50,88 L50,96" stroke="#D8B4FE" strokeWidth="2" fill="none" />
            <path d="M54,88 Q56,95 60,96" stroke="#D8B4FE" strokeWidth="2" fill="none" />
          </svg>
        );

      case 'garlic':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
            {/* Top Stem */}
            <rect x="47" y="16" width="6" height="16" rx="2" fill="#E2E8F0" stroke="#94A3B8" strokeWidth="1.5" />
            {/* Garlic Bulb with individual cloves */}
            <path
              d="M50,28 C35,28 22,44 24,66 C26,82 40,88 50,88 C60,88 74,82 76,66 C78,44 65,28 50,28 Z"
              fill="#F8FAFC"
              stroke="#CBD5E1"
              strokeWidth="2.5"
            />
            {/* Clove Segments */}
            <path d="M50,28 Q34,50 36,84" fill="none" stroke="#E2E8F0" strokeWidth="2.5" />
            <path d="M50,28 Q66,50 64,84" fill="none" stroke="#E2E8F0" strokeWidth="2.5" />
            <path d="M50,28 L50,88" fill="none" stroke="#CBD5E1" strokeWidth="2" />
            {/* Root bottom */}
            <ellipse cx="50" cy="88" rx="8" ry="3" fill="#D97706" opacity="0.6" />
          </svg>
        );

      case 'broccoli':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
            {/* Thick Green Stalk */}
            <path d="M44,55 L40,86 Q50,90 60,86 L56,55 Z" fill="#86EFAC" stroke="#16A34A" strokeWidth="2" />
            {/* Fluffy Florets */}
            <circle cx="34" cy="42" r="16" fill="#15803D" stroke="#14532D" strokeWidth="2" />
            <circle cx="66" cy="42" r="16" fill="#15803D" stroke="#14532D" strokeWidth="2" />
            <circle cx="50" cy="30" r="18" fill="#22C55E" stroke="#15803D" strokeWidth="2" />
            <circle cx="38" cy="32" r="12" fill="#16A34A" />
            <circle cx="62" cy="32" r="12" fill="#16A34A" />
            <circle cx="50" cy="45" r="14" fill="#4ADE80" />
            {/* Texture dots */}
            <circle cx="48" cy="28" r="2" fill="#DCFCE7" />
            <circle cx="56" cy="34" r="2" fill="#DCFCE7" />
            <circle cx="34" cy="42" r="2" fill="#86EFAC" />
            <circle cx="66" cy="44" r="2" fill="#86EFAC" />
          </svg>
        );

      case 'long_beans':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
            {/* Bundle of long fresh green beans curved playfully */}
            <path d="M25,20 Q35,55 30,85" fill="none" stroke="#16A34A" strokeWidth="6" strokeLinecap="round" />
            <path d="M40,15 Q55,50 45,88" fill="none" stroke="#22C55E" strokeWidth="6.5" strokeLinecap="round" />
            <path d="M55,18 Q40,55 60,86" fill="none" stroke="#15803D" strokeWidth="6" strokeLinecap="round" />
            <path d="M70,22 Q60,52 75,82" fill="none" stroke="#4ADE80" strokeWidth="5.5" strokeLinecap="round" />
            {/* Tie / Ribbon holding the bundle */}
            <rect x="32" y="48" width="38" height="8" rx="4" fill="#EF4444" stroke="#B91C1C" strokeWidth="1.5" />
            <circle cx="51" cy="52" r="3" fill="#FBBF24" />
          </svg>
        );

      case 'potato':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
            {/* Potato Organic Oval */}
            <path
              d="M32,30 C52,24 74,32 80,48 C86,64 78,80 58,82 C38,84 20,74 18,54 C16,38 24,32 32,30 Z"
              fill="#D97706"
              stroke="#B45309"
              strokeWidth="2.5"
            />
            {/* Potato Texture / Eyes */}
            <ellipse cx="36" cy="44" rx="4" ry="2" fill="#92400E" opacity="0.6" />
            <ellipse cx="62" cy="40" rx="3" ry="1.5" fill="#92400E" opacity="0.6" />
            <ellipse cx="50" cy="62" rx="4.5" ry="2" fill="#92400E" opacity="0.6" />
            <ellipse cx="70" cy="66" rx="3" ry="1.5" fill="#92400E" opacity="0.6" />
            <ellipse cx="28" cy="64" rx="2.5" ry="1" fill="#92400E" opacity="0.6" />
            {/* Highlights */}
            <ellipse cx="44" cy="38" rx="8" ry="4" fill="#FDE68A" opacity="0.4" transform="rotate(-15 44 38)" />
          </svg>
        );

      case 'spinach':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
            {/* Stems tied at bottom */}
            <path d="M48,88 L46,65" stroke="#15803D" strokeWidth="3" strokeLinecap="round" />
            <path d="M52,88 L56,65" stroke="#15803D" strokeWidth="3" strokeLinecap="round" />
            {/* Crisp Green Spinach Leaves */}
            <path
              d="M50,65 C30,55 24,35 34,22 C48,22 52,40 50,65 Z"
              fill="#22C55E"
              stroke="#15803D"
              strokeWidth="2"
            />
            <path
              d="M50,65 C70,55 76,35 66,22 C52,22 48,40 50,65 Z"
              fill="#16A34A"
              stroke="#14532D"
              strokeWidth="2"
            />
            <path
              d="M50,60 C40,45 42,25 50,15 C58,25 60,45 50,60 Z"
              fill="#4ADE80"
              stroke="#16A34A"
              strokeWidth="2"
            />
            {/* Leaf Veins */}
            <line x1="50" y1="55" x2="50" y2="20" stroke="#DCFCE7" strokeWidth="1.5" />
            <line x1="38" y1="44" x2="48" y2="52" stroke="#DCFCE7" strokeWidth="1.2" />
            <line x1="62" y1="44" x2="52" y2="52" stroke="#DCFCE7" strokeWidth="1.2" />
          </svg>
        );

      case 'carrot':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
            {/* Green leafy top */}
            <path d="M50,30 Q42,10 32,15 Q44,24 48,32 Z" fill="#22C55E" />
            <path d="M50,30 Q50,8 54,6 Q54,20 52,32 Z" fill="#16A34A" />
            <path d="M50,30 Q58,10 68,15 Q56,24 52,32 Z" fill="#22C55E" />
            {/* Carrot cone body */}
            <polygon points="35,32 65,32 50,88" fill="#F97316" stroke="#C2410C" strokeWidth="2.5" />
            {/* Horizontal ridges */}
            <line x1="42" y1="42" x2="55" y2="42" stroke="#EA580C" strokeWidth="2" strokeLinecap="round" />
            <line x1="45" y1="52" x2="58" y2="52" stroke="#EA580C" strokeWidth="2" strokeLinecap="round" />
            <line x1="46" y1="64" x2="54" y2="64" stroke="#EA580C" strokeWidth="2" strokeLinecap="round" />
            <line x1="48" y1="74" x2="52" y2="74" stroke="#EA580C" strokeWidth="2" strokeLinecap="round" />
          </svg>
        );

      case 'cauliflower':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
            {/* Outer Protective Green Leaves */}
            <path d="M20,60 C16,40 30,25 36,36 C30,55 30,70 45,82 Z" fill="#16A34A" stroke="#15803D" strokeWidth="2" />
            <path d="M80,60 C84,40 70,25 64,36 C70,55 70,70 55,82 Z" fill="#16A34A" stroke="#15803D" strokeWidth="2" />
            <path d="M35,75 Q50,92 65,75 Z" fill="#15803D" />
            {/* White Curd / Head */}
            <circle cx="40" cy="45" r="14" fill="#F8FAFC" stroke="#CBD5E1" strokeWidth="1.5" />
            <circle cx="60" cy="45" r="14" fill="#F8FAFC" stroke="#CBD5E1" strokeWidth="1.5" />
            <circle cx="50" cy="35" r="15" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1.5" />
            <circle cx="50" cy="52" r="16" fill="#F1F5F9" stroke="#CBD5E1" strokeWidth="1.5" />
            {/* Texture dots */}
            <circle cx="50" cy="42" r="2.5" fill="#E2E8F0" />
            <circle cx="42" cy="50" r="2" fill="#E2E8F0" />
            <circle cx="58" cy="50" r="2" fill="#E2E8F0" />
          </svg>
        );

      case 'cabbage':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
            {/* Layered round cabbage */}
            <circle cx="50" cy="52" r="34" fill="#86EFAC" stroke="#16A34A" strokeWidth="3" />
            {/* Leaf folds */}
            <path d="M22,46 Q40,65 52,50 Q60,30 48,20" fill="none" stroke="#15803D" strokeWidth="2.5" />
            <path d="M78,46 Q60,65 48,50 Q40,30 52,20" fill="none" stroke="#15803D" strokeWidth="2.5" />
            <path d="M30,70 Q50,78 70,70" fill="none" stroke="#22C55E" strokeWidth="2.5" />
            {/* Inner Core */}
            <ellipse cx="50" cy="52" rx="16" ry="14" fill="#BBF7D0" stroke="#16A34A" strokeWidth="2" />
            <path d="M44,48 Q50,56 56,48" fill="none" stroke="#15803D" strokeWidth="2" />
          </svg>
        );

      case 'eggplant':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
            {/* Green Stem & Calyx */}
            <rect x="47" y="14" width="6" height="14" rx="2" fill="#15803D" stroke="#14532D" strokeWidth="1.5" />
            <polygon points="50,26 40,34 46,30 36,40 48,34 50,26 52,34 64,40 54,30 60,34" fill="#22C55E" stroke="#15803D" strokeWidth="1.5" />
            {/* Glossy deep purple eggplant fruit */}
            <path
              d="M48,28 C36,32 30,52 30,68 C30,84 42,90 52,90 C64,90 74,84 74,68 C74,52 62,32 50,28 Z"
              fill="#581C87"
              stroke="#3B0764"
              strokeWidth="2.5"
            />
            {/* Glossy curved highlight */}
            <path d="M38,48 Q35,65 40,78" fill="none" stroke="#A855F7" strokeWidth="4" strokeLinecap="round" opacity="0.8" />
          </svg>
        );

      case 'mushroom':
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
            {/* Stalk */}
            <path d="M42,50 L38,82 Q50,86 62,82 L58,50 Z" fill="#F1F5F9" stroke="#CBD5E1" strokeWidth="2" />
            {/* Mushroom Cap */}
            <path
              d="M16,54 C18,30 32,18 50,18 C68,18 82,30 84,54 C84,58 78,58 50,56 C22,58 16,58 16,54 Z"
              fill="#EF4444"
              stroke="#B91C1C"
              strokeWidth="2.5"
            />
            {/* White Polka Dots */}
            <circle cx="34" cy="36" r="5" fill="#FFFFFF" />
            <circle cx="50" cy="28" r="6" fill="#FFFFFF" />
            <circle cx="66" cy="36" r="5" fill="#FFFFFF" />
            <circle cx="40" cy="48" r="3.5" fill="#FFFFFF" />
            <circle cx="60" cy="48" r="3.5" fill="#FFFFFF" />
          </svg>
        );

      default:
        return (
          <div className="w-full h-full flex items-center justify-center font-black text-slate-500">
            {id}
          </div>
        );
    }
  };

  return (
    <div
      className={`relative inline-flex items-center justify-center bg-white/95 rounded-3xl border-3 border-amber-200/80 shadow-lg ${sizeClasses[size]} ${className}`}
    >
      {renderSvgContent()}

      {/* Mystery Mask Overlay if Level 4 / Mystery Mode */}
      {mysteryMask && (
        <div className="absolute inset-0 bg-indigo-950/85 backdrop-blur-[2px] rounded-3xl flex flex-col items-center justify-center overflow-hidden border-2 border-indigo-400">
          {/* Peeking hole cut out showing ~30% of the clue image */}
          <div className="w-16 h-16 rounded-full border-4 border-amber-300 shadow-inner overflow-hidden flex items-center justify-center bg-white/30 backdrop-blur-none scale-125">
            <div className="w-28 h-28 transform -translate-x-3 -translate-y-2">
              {renderSvgContent()}
            </div>
          </div>
          <span className="mt-2 text-xs font-black tracking-widest text-amber-300 uppercase animate-pulse">
            🔍 RAHASIA
          </span>
        </div>
      )}
    </div>
  );
};
