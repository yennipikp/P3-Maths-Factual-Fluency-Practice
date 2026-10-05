import React from 'react';
import { X, Trophy, Award, Sparkles, Flame } from 'lucide-react';
import { TableSelection } from '../types/quiz';

interface RecordsModalProps {
  isOpen: boolean;
  onClose: () => void;
  bestScores: Record<TableSelection, number>;
  onSelectTable: (table: TableSelection) => void;
}

export const RecordsModal: React.FC<RecordsModalProps> = ({
  isOpen,
  onClose,
  bestScores,
  onSelectTable,
}) => {
  if (!isOpen) return null;

  const tableList: Array<{ key: TableSelection; label: string; badge: string; color: string; bg: string }> = [
    { key: '6', label: 'Table of 6', badge: 'Super Sixes', color: 'text-sky-600', bg: 'bg-sky-50 border-sky-200' },
    { key: '7', label: 'Table of 7', badge: 'Lucky Sevens', color: 'text-emerald-600', bg: 'bg-emerald-50 border-emerald-200' },
    { key: '8', label: 'Table of 8', badge: 'Awesome Eights', color: 'text-amber-600', bg: 'bg-amber-50 border-amber-200' },
    { key: '9', label: 'Table of 9', badge: 'Nine Ninjas', color: 'text-purple-600', bg: 'bg-purple-50 border-purple-200' },
    { key: 'mix', label: 'Tables 6, 7, 8 & 9 Mix', badge: 'Grand Master', color: 'text-rose-600', bg: 'bg-rose-50 border-rose-200' },
  ];

  const totalBestPoints = Object.values(bestScores).reduce((a, b) => a + b, 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-pop-in">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full flex flex-col border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50/80">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-500" />
            <h3 className="font-heading font-bold text-lg text-slate-900">
              Personal Best Scores
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl p-4 text-white flex items-center justify-between shadow-sm">
            <div>
              <span className="text-xs uppercase tracking-wider text-indigo-100 font-semibold block">
                Total High Score Power
              </span>
              <span className="font-heading font-black text-2xl tabular-nums">
                {totalBestPoints} / 300 Pts
              </span>
            </div>
            <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-xs flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-amber-300" />
            </div>
          </div>

          <div className="space-y-2.5">
            {tableList.map(({ key, label, badge, color, bg }) => {
              const score = bestScores[key] || 0;
              const percent = Math.round((score / 60) * 100);

              return (
                <div
                  key={key}
                  className={`p-3.5 rounded-xl border ${bg} flex items-center justify-between hover:shadow-xs transition-shadow`}
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-heading font-bold text-sm text-slate-800">
                        {label}
                      </span>
                      <span className="text-[11px] font-semibold text-slate-500">
                        ({badge})
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <span>{percent}% Completed</span>
                      <span aria-hidden="true">·</span>
                      <span>Target: 60/60</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <span className={`font-heading font-black text-xl tabular-nums ${color}`}>
                        {score}
                      </span>
                      <span className="text-xs font-semibold text-slate-400">/60</span>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        onSelectTable(key);
                      }}
                      className="px-3 py-1.5 text-xs font-bold rounded-lg bg-white border border-slate-300 hover:border-indigo-500 hover:text-indigo-600 text-slate-700 shadow-xs transition-colors"
                    >
                      Play
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 text-right">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
