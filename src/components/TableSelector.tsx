import React from 'react';
import { Sparkles, Timer, HelpCircle, Check, ArrowRight, BookOpen, Zap } from 'lucide-react';
import { TableSelection } from '../types/quiz';
import { sounds } from '../utils/audio';

interface TableSelectorProps {
  selectedTable: TableSelection;
  onSelectTable: (table: TableSelection) => void;
  onStartQuiz: () => void;
  bestScores: Record<TableSelection, number>;
  onOpenStudyModal: () => void;
}

interface TableOptionConfig {
  id: TableSelection;
  number: string;
  name: string;
  tagline: string;
  colorClass: string;
  bgGradient: string;
  borderColor: string;
  badgeBg: string;
  accentText: string;
  formulaSample: string;
}

const TABLE_OPTIONS: TableOptionConfig[] = [
  {
    id: '6',
    number: '6',
    name: 'Table of 6',
    tagline: 'Super Sixes',
    colorClass: 'from-sky-500 to-blue-600',
    bgGradient: 'hover:bg-sky-50/70',
    borderColor: 'border-sky-200 hover:border-sky-400',
    badgeBg: 'bg-sky-100 text-sky-800',
    accentText: 'text-sky-600',
    formulaSample: '6 × 7 = 42 · 6 × 8 = 48 · 6 × 9 = 54',
  },
  {
    id: '7',
    number: '7',
    name: 'Table of 7',
    tagline: 'Lucky Sevens',
    colorClass: 'from-emerald-500 to-teal-600',
    bgGradient: 'hover:bg-emerald-50/70',
    borderColor: 'border-emerald-200 hover:border-emerald-400',
    badgeBg: 'bg-emerald-100 text-emerald-800',
    accentText: 'text-emerald-600',
    formulaSample: '7 × 6 = 42 · 7 × 7 = 49 · 7 × 8 = 56',
  },
  {
    id: '8',
    number: '8',
    name: 'Table of 8',
    tagline: 'Awesome Eights',
    colorClass: 'from-amber-500 to-orange-600',
    bgGradient: 'hover:bg-amber-50/70',
    borderColor: 'border-amber-200 hover:border-amber-400',
    badgeBg: 'bg-amber-100 text-amber-800',
    accentText: 'text-amber-600',
    formulaSample: '8 × 6 = 48 · 8 × 7 = 56 · 8 × 8 = 64',
  },
  {
    id: '9',
    number: '9',
    name: 'Table of 9',
    tagline: 'Nine Ninjas',
    colorClass: 'from-purple-500 to-indigo-600',
    bgGradient: 'hover:bg-purple-50/70',
    borderColor: 'border-purple-200 hover:border-purple-400',
    badgeBg: 'bg-purple-100 text-purple-800',
    accentText: 'text-purple-600',
    formulaSample: '9 × 6 = 54 · 9 × 7 = 63 · 9 × 8 = 72',
  },
  {
    id: 'mix',
    number: '6-9',
    name: 'Mix of 6, 7, 8 & 9',
    tagline: 'Grand Master Mix',
    colorClass: 'from-rose-500 via-purple-600 to-indigo-600',
    bgGradient: 'hover:bg-rose-50/60',
    borderColor: 'border-indigo-300 hover:border-indigo-500',
    badgeBg: 'bg-rose-100 text-rose-800',
    accentText: 'text-indigo-600',
    formulaSample: 'Combination of all 4 tables in random order!',
  },
];

export const TableSelector: React.FC<TableSelectorProps> = ({
  selectedTable,
  onSelectTable,
  onStartQuiz,
  bestScores,
  onOpenStudyModal,
}) => {
  const selectedConfig = TABLE_OPTIONS.find((t) => t.id === selectedTable)!;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-8 animate-pop-in">
      {/* Hero Banner with Generated Graphic */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-indigo-900 via-indigo-800 to-slate-900 text-white shadow-xl shadow-indigo-950/20 border border-indigo-700/40">
        <div className="grid grid-cols-1 md:grid-cols-12 items-center">
          {/* Hero text */}
          <div className="p-6 sm:p-10 md:col-span-7 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-amber-300 text-xs font-bold tracking-wide">
              <Sparkles className="w-3.5 h-3.5" />
              Primary 3 Multiplication Challenge
            </div>

            <h1 className="font-heading font-black text-3xl sm:text-4xl lg:text-5xl leading-tight text-white tracking-tight">
              Master the Tables of <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-amber-300 via-rose-300 to-cyan-300 bg-clip-text text-transparent">
                6, 7, 8 and 9!
              </span>
            </h1>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-xl">
              Sharpen your factual fluency with a 60-question sprint. You have a single <strong className="text-cyan-300">2-minute timer for the entire practice set</strong> — answer as many as you can before the 2-minute clock expires!
            </p>

            {/* Micro Feature highlights */}
            <div className="grid grid-cols-3 gap-2 pt-2 text-xs">
              <div className="bg-white/10 rounded-xl p-2.5 backdrop-blur-sm border border-white/10">
                <span className="text-amber-400 font-bold block text-sm sm:text-base font-mono tabular-nums">
                  60
                </span>
                <span className="text-slate-300 text-[11px]">Questions in Set</span>
              </div>
              <div className="bg-white/10 rounded-xl p-2.5 backdrop-blur-sm border border-white/10">
                <span className="text-cyan-400 font-bold block text-sm sm:text-base font-mono tabular-nums">
                  2:00 Total
                </span>
                <span className="text-slate-300 text-[11px]">For Entire Set</span>
              </div>
              <div className="bg-white/10 rounded-xl p-2.5 backdrop-blur-sm border border-white/10">
                <span className="text-emerald-400 font-bold block text-sm sm:text-base font-mono tabular-nums">
                  60 Pts
                </span>
                <span className="text-slate-300 text-[11px]">Max Score</span>
              </div>
            </div>
          </div>

          {/* Hero Illustration */}
          <div className="md:col-span-5 p-6 sm:p-8 flex items-center justify-center relative">
            <div className="relative w-full max-w-xs sm:max-w-sm rounded-2xl overflow-hidden shadow-2xl ring-2 ring-white/20 aspect-video md:aspect-4/3 bg-slate-800">
              <img
                src="/src/assets/images/math_fluency_hero_1791187198663.jpg"
                alt="Colorful cartoon math characters celebrating multiplication fluency"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  // Fallback container if image fails
                  const target = e.currentTarget;
                  target.style.display = 'none';
                  if (target.parentElement) {
                    target.parentElement.classList.add('bg-gradient-to-br', 'from-indigo-600', 'to-purple-700', 'flex', 'items-center', 'justify-center');
                  }
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-3 left-3 right-3 text-center">
                <span className="text-xs font-semibold text-white/90 drop-shadow-md">
                  Primary 3 Factual Fluency Sprint
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Step 1: Select Your Table */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="font-heading font-black text-xl sm:text-2xl text-slate-900 tracking-tight flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-indigo-600 text-white text-xs font-black flex items-center justify-center">
                1
              </span>
              Choose Your Multiplication Table
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Select one table to drill, or select Mix for a complete test of 6, 7, 8, and 9!
            </p>
          </div>

          <button
            type="button"
            onClick={onOpenStudyModal}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100 px-3 py-2 rounded-xl transition-colors self-start sm:self-auto cursor-pointer"
          >
            <BookOpen className="w-4 h-4" />
            Study Table Facts First
          </button>
        </div>

        {/* The 5 Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {TABLE_OPTIONS.map((opt) => {
            const isSelected = selectedTable === opt.id;
            const best = bestScores[opt.id] || 0;

            return (
              <div
                key={opt.id}
                onClick={() => {
                  sounds.playTap();
                  onSelectTable(opt.id);
                }}
                className={`relative rounded-2xl p-4 sm:p-5 border-2 transition-all cursor-pointer select-none bg-white ${
                  isSelected
                    ? 'border-indigo-600 ring-4 ring-indigo-500/15 shadow-md -translate-y-0.5'
                    : `${opt.borderColor} ${opt.bgGradient} shadow-xs hover:shadow-sm`
                } ${opt.id === 'mix' ? 'sm:col-span-2 lg:col-span-1' : ''}`}
              >
                {/* Active check icon badge */}
                <div
                  className={`absolute top-4 right-4 w-6 h-6 rounded-full flex items-center justify-center transition-all ${
                    isSelected
                      ? 'bg-indigo-600 text-white scale-100 shadow-sm'
                      : 'bg-slate-100 text-slate-300 scale-90'
                  }`}
                >
                  <Check className="w-4 h-4 stroke-[3]" />
                </div>

                <div className="flex items-center gap-3.5 mb-3">
                  <div
                    className={`w-12 h-12 rounded-xl bg-gradient-to-br ${opt.colorClass} flex items-center justify-center text-white font-heading font-black text-xl shadow-sm`}
                  >
                    {opt.number}
                  </div>
                  <div>
                    <h3 className="font-heading font-black text-base text-slate-900 leading-tight">
                      {opt.name}
                    </h3>
                    <span className="text-xs font-semibold text-slate-500">
                      {opt.tagline}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-600 mb-3 font-mono line-clamp-1">
                  {opt.formulaSample}
                </p>

                {/* Score info */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                  <span className="text-slate-500 font-medium">Personal Best:</span>
                  <span className="font-mono font-bold text-slate-800">
                    <span className={`tabular-nums ${best > 0 ? opt.accentText : 'text-slate-400'}`}>
                      {best}
                    </span>
                    <span className="text-slate-400">/60 pts</span>
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Step 2: Practice Rules & Launch Button */}
      <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6 border border-slate-800">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-emerald-500 text-slate-950 text-xs font-black flex items-center justify-center">
              2
            </span>
            <span className="text-xs uppercase tracking-wider text-slate-400 font-bold">
              Challenge Ready
            </span>
          </div>

          <h3 className="font-heading font-black text-xl sm:text-2xl text-white">
            {selectedConfig.name} Sprint
          </h3>

          <p className="text-xs sm:text-sm text-slate-300 max-w-lg">
            You will have a single <strong className="text-amber-300">2-minute timer for the entire 60-question practice set</strong> (not per question). Type your answer and press <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-xs text-slate-200">Enter</kbd> or tap <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-xs text-slate-200">Next</kbd> to work through as many questions as you can!
          </p>
        </div>

        <div className="shrink-0 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <button
            type="button"
            onClick={() => {
              sounds.playVictory();
              onStartQuiz();
            }}
            className="inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl font-heading font-black text-base sm:text-lg text-slate-950 bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 shadow-lg shadow-amber-400/20 hover:shadow-amber-400/30 active:scale-98 transition-all cursor-pointer"
          >
            <Zap className="w-5 h-5 fill-slate-950" />
            Start 2-Min Practice!
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
