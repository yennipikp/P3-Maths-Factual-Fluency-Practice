import React from 'react';
import { Volume2, VolumeX, BookOpen, Award, Sparkles } from 'lucide-react';
import { sounds } from '../utils/audio';

interface HeaderProps {
  soundEnabled: boolean;
  onToggleSound: () => void;
  onOpenStudyModal: () => void;
  onOpenRecordsModal: () => void;
  isPracticing: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  soundEnabled,
  onToggleSound,
  onOpenStudyModal,
  onOpenRecordsModal,
  isPracticing,
}) => {
  return (
    <header className="w-full bg-white/95 backdrop-blur-sm border-b border-slate-200 sticky top-0 z-30 transition-all">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-600 via-indigo-700 to-purple-700 flex items-center justify-center text-white shadow-md shadow-indigo-200 shrink-0">
            <Sparkles className="w-5 h-5 text-amber-300" />
          </div>
          <div>
            <span className="font-heading font-black text-lg sm:text-xl tracking-tight text-slate-900 block leading-tight">
              Times Table Turbo
            </span>
            <span className="text-[11px] font-medium text-slate-500 hidden sm:block">
              Primary 3 Math Fluency · Tables of 6, 7, 8 & 9
            </span>
          </div>
        </div>

        {/* Zone 2: Informational / Guidelines (Quiet text) */}
        {!isPracticing && (
          <div className="hidden md:flex items-center gap-2 text-xs font-semibold text-slate-500">
            <span>60 Questions</span>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <span>2-Min Set Timer</span>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <span className="text-indigo-600 font-bold">Speed & Accuracy</span>
          </div>
        )}

        {/* Zone 3: Actions */}
        <div className="flex items-center gap-2">
          {!isPracticing && (
            <>
              <button
                type="button"
                onClick={onOpenStudyModal}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
                title="View Multiplication Tables 6, 7, 8, 9"
              >
                <BookOpen className="w-4 h-4 text-indigo-600" />
                <span className="hidden sm:inline">Study Tables</span>
              </button>

              <button
                type="button"
                onClick={onOpenRecordsModal}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
                title="View Personal Best Records"
              >
                <Award className="w-4 h-4 text-amber-500" />
                <span className="hidden sm:inline">Records</span>
              </button>
            </>
          )}

          {/* Sound Toggle */}
          <button
            type="button"
            onClick={onToggleSound}
            aria-label={soundEnabled ? 'Mute sound effects' : 'Enable sound effects'}
            className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
            title={soundEnabled ? 'Sound is ON' : 'Sound is OFF'}
          >
            {soundEnabled ? (
              <Volume2 className="w-5 h-5 text-indigo-600" />
            ) : (
              <VolumeX className="w-5 h-5 text-slate-400" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
