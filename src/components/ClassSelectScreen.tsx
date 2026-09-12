import React from 'react';
import { ArrowLeft, CheckCircle2, ChevronRight, Compass } from 'lucide-react';
import { audio } from '../utils/audio';

interface ClassSelectScreenProps {
  onSelectClass: (grade: 1 | 2) => void;
  onBack: () => void;
}

export const ClassSelectScreen: React.FC<ClassSelectScreenProps> = ({
  onSelectClass,
  onBack,
}) => {
  const handleSelect = (grade: 1 | 2) => {
    audio.playPop();
    audio.speak(`Class ${grade}! Let's start the adventure!`);
    onSelectClass(grade);
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-4 sm:py-6 flex flex-col items-center">
      {/* Top back button and title */}
      <div className="w-full flex items-center justify-between mb-4">
        <button
          onClick={() => {
            audio.playPop();
            onBack();
          }}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-white/90 border-2 border-slate-200 text-slate-700 font-extrabold text-sm hover:bg-slate-100 transition active:scale-95 shadow-xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali</span>
        </button>

        <span className="text-xs sm:text-sm font-black text-amber-900 bg-amber-100 border border-amber-300 px-3.5 py-1.5 rounded-full uppercase tracking-wider">
          PILIH TINGKAT KELAS / CHOOSE GRADE
        </span>
      </div>

      <h2 className="text-2xl sm:text-4xl font-black text-slate-800 text-center mb-1">
        🎒 Mau Main di Kelas Berapa?
      </h2>
      <p className="text-sm sm:text-base font-bold text-slate-500 text-center mb-6">
        Pilih tingkat materi pelajaran yang ingin kamu mainkan bersama karakter satwa!
      </p>

      {/* 2 Big Cards: CLASS 1 (School Items) and CLASS 2 (Vegetables) */}
      <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
        {/* CLASS 1 CARD */}
        <div
          id="card-class-1"
          onClick={() => handleSelect(1)}
          className="group relative bg-gradient-to-b from-sky-50 to-sky-100/90 rounded-3xl p-6 border-4 border-sky-300 hover:border-sky-500 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1.5 cursor-pointer flex flex-col justify-between"
        >
          <div className="absolute -top-3 right-5 bg-sky-500 text-white font-black text-xs px-3 py-1 rounded-full shadow-md">
            ⭐⭐ KELAS 1 SD
          </div>

          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-16 h-16 rounded-2xl bg-sky-400 text-white flex items-center justify-center text-3xl shadow-md border-2 border-sky-300 group-hover:scale-110 transition-transform">
                🎒
              </div>
              <div>
                <h3 className="text-2xl sm:text-3xl font-black text-sky-950">
                  CLASS 1
                </h3>
                <span className="text-xs sm:text-sm font-extrabold text-sky-700">
                  Peralatan Sekolah (School Equipment)
                </span>
              </div>
            </div>

            <p className="text-sm font-bold text-slate-600 mb-4">
              Mengenal 10 peralatan sekolah dalam bahasa Inggris dengan gambar ceria dan soal bergantian!
            </p>

            {/* Level breakdown */}
            <div className="space-y-2 bg-white/80 rounded-2xl p-3 border border-sky-200 mb-4 text-xs sm:text-sm">
              <div className="flex items-center gap-2 font-bold text-slate-700">
                <Compass className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Misi Labirin: Tantangan pos labirin kategori sedang</span>
              </div>
              <div className="flex items-center gap-2 font-bold text-slate-700">
                <CheckCircle2 className="w-4 h-4 text-sky-600 shrink-0" />
                <span>Tebak Gambar &amp; Audio Pengucapan interaktif</span>
              </div>
              <div className="flex items-center gap-2 font-bold text-slate-700">
                <CheckCircle2 className="w-4 h-4 text-sky-600 shrink-0" />
                <span>Soal dibuat bergantian acak tidak berulang</span>
              </div>
            </div>

            {/* 10 Vocab tags */}
            <div className="flex flex-wrap gap-1.5 text-[11px] font-extrabold text-sky-800">
              <span className="bg-sky-200/70 px-2 py-0.5 rounded-lg">Bag (Tas)</span>
              <span className="bg-sky-200/70 px-2 py-0.5 rounded-lg">Marker (Spidol)</span>
              <span className="bg-sky-200/70 px-2 py-0.5 rounded-lg">Crayon (Krayon)</span>
              <span className="bg-sky-200/70 px-2 py-0.5 rounded-lg">Pencil (Pensil)</span>
              <span className="bg-sky-200/70 px-2 py-0.5 rounded-lg">Eraser (Penghapus)</span>
              <span className="bg-sky-200/70 px-2 py-0.5 rounded-lg">Book (Buku)</span>
              <span className="bg-sky-200/70 px-2 py-0.5 rounded-lg">Colored Pencils</span>
              <span className="bg-sky-200/70 px-2 py-0.5 rounded-lg">Glue (Lem)</span>
              <span className="bg-sky-200/70 px-2 py-0.5 rounded-lg">Ruler (Penggaris)</span>
              <span className="bg-sky-200/70 px-2 py-0.5 rounded-lg">Notebook (Buku Catatan)</span>
            </div>
          </div>

          <button
            id="btn-start-class-1"
            className="mt-6 w-full py-3.5 rounded-2xl bg-sky-500 group-hover:bg-sky-600 text-white font-black text-lg shadow-md flex items-center justify-center gap-2 transition"
          >
            <span>PILIH MATERI KELAS 1</span>
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* CLASS 2 CARD */}
        <div
          id="card-class-2"
          onClick={() => handleSelect(2)}
          className="group relative bg-gradient-to-b from-purple-50 to-purple-100/90 rounded-3xl p-6 border-4 border-purple-300 hover:border-purple-500 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1.5 cursor-pointer flex flex-col justify-between"
        >
          <div className="absolute -top-3 right-5 bg-purple-500 text-white font-black text-xs px-3 py-1 rounded-full shadow-md">
            ⭐⭐⭐ KELAS 2 SD
          </div>

          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-16 h-16 rounded-2xl bg-purple-400 text-white flex items-center justify-center text-3xl shadow-md border-2 border-purple-300 group-hover:scale-110 transition-transform">
                🥦
              </div>
              <div>
                <h3 className="text-2xl sm:text-3xl font-black text-purple-950">
                  CLASS 2
                </h3>
                <span className="text-xs sm:text-sm font-extrabold text-purple-700">
                  Nama-Nama Sayuran (Vegetables)
                </span>
              </div>
            </div>

            <p className="text-sm font-bold text-slate-600 mb-4">
              Mengenal 11 aneka sayuran sehat dalam bahasa Inggris dengan animasi labirin dan petualangan ceria!
            </p>

            {/* Level breakdown */}
            <div className="space-y-2 bg-white/80 rounded-2xl p-3 border border-purple-200 mb-4 text-xs sm:text-sm">
              <div className="flex items-center gap-2 font-bold text-slate-700">
                <Compass className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Misi Labirin: Tantangan pos labirin sayuran</span>
              </div>
              <div className="flex items-center gap-2 font-bold text-slate-700">
                <CheckCircle2 className="w-4 h-4 text-purple-600 shrink-0" />
                <span>Tebak Sayuran, Clue &amp; Audio Pengucapan</span>
              </div>
              <div className="flex items-center gap-2 font-bold text-slate-700">
                <CheckCircle2 className="w-4 h-4 text-purple-600 shrink-0" />
                <span>Soal dibuat bergantian acak tidak berulang</span>
              </div>
            </div>

            {/* 11 Vocab tags */}
            <div className="flex flex-wrap gap-1.5 text-[11px] font-extrabold text-purple-800">
              <span className="bg-purple-200/70 px-2 py-0.5 rounded-lg">Shallot</span>
              <span className="bg-purple-200/70 px-2 py-0.5 rounded-lg">Garlic</span>
              <span className="bg-purple-200/70 px-2 py-0.5 rounded-lg">Broccoli</span>
              <span className="bg-purple-200/70 px-2 py-0.5 rounded-lg">Long Beans</span>
              <span className="bg-purple-200/70 px-2 py-0.5 rounded-lg">Potato</span>
              <span className="bg-purple-200/70 px-2 py-0.5 rounded-lg">Spinach</span>
              <span className="bg-purple-200/70 px-2 py-0.5 rounded-lg">Carrot</span>
              <span className="bg-purple-200/70 px-2 py-0.5 rounded-lg">Cauliflower</span>
              <span className="bg-purple-200/70 px-2 py-0.5 rounded-lg">Cabbage</span>
              <span className="bg-purple-200/70 px-2 py-0.5 rounded-lg">Eggplant</span>
              <span className="bg-purple-200/70 px-2 py-0.5 rounded-lg">Mushroom</span>
            </div>
          </div>

          <button
            id="btn-start-class-2"
            className="mt-6 w-full py-3.5 rounded-2xl bg-purple-600 group-hover:bg-purple-700 text-white font-black text-lg shadow-md flex items-center justify-center gap-2 transition"
          >
            <span>PILIH MATERI KELAS 2</span>
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
