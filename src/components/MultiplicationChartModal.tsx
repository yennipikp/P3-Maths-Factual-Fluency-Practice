import React, { useState } from 'react';
import { X, Sparkles, CheckCircle2 } from 'lucide-react';
import { sounds } from '../utils/audio';

interface MultiplicationChartModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTableAndStart: (table: '6' | '7' | '8' | '9' | 'mix') => void;
}

export const MultiplicationChartModal: React.FC<MultiplicationChartModalProps> = ({
  isOpen,
  onClose,
  onSelectTableAndStart,
}) => {
  const [activeTab, setActiveTab] = useState<'6' | '7' | '8' | '9'>('6');

  if (!isOpen) return null;

  const tables: Record<'6' | '7' | '8' | '9', { color: string; bg: string; title: string; tip: string }> = {
    '6': {
      color: 'text-sky-600',
      bg: 'bg-sky-50 border-sky-200',
      title: 'Table of 6 · The Double 3s',
      tip: 'Trick: Any number times 6 is double its table of 3! Also, notice the last digits repeat in pairs: 6, 2, 8, 4, 0.',
    },
    '7': {
      color: 'text-emerald-600',
      bg: 'bg-emerald-50 border-emerald-200',
      title: 'Table of 7 · Lucky Sevens',
      tip: 'Trick: Break it down! 7 × n = (5 × n) + (2 × n). Remember 7 × 8 = 56 ("5, 6, 7, 8" sequence)!',
    },
    '8': {
      color: 'text-amber-600',
      bg: 'bg-amber-50 border-amber-200',
      title: 'Table of 8 · The Double Double Double',
      tip: 'Trick: To multiply by 8, double three times! e.g., 8 × 7: 7 → 14 → 28 → 56! All products end in 8, 6, 4, 2, 0.',
    },
    '9': {
      color: 'text-purple-600',
      bg: 'bg-purple-50 border-purple-200',
      title: 'Table of 9 · The Magic Nine',
      tip: 'Trick: The sum of digits always equals 9 (e.g. 9 × 6 = 54 → 5 + 4 = 9). The tens digit is always 1 less than the factor!',
    },
  };

  const currentTableNum = parseInt(activeTab, 10);
  const facts = Array.from({ length: 10 }, (_, i) => {
    const factor = i + 1;
    return {
      factor,
      result: factor * currentTableNum,
    };
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-pop-in">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50/70">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-600" />
            <h3 className="font-heading font-bold text-lg text-slate-900">
              Multiplication Tables Reference
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

        {/* Tab selector */}
        <div className="flex items-center gap-1.5 px-6 pt-4 pb-2 border-b border-slate-100 overflow-x-auto">
          {(['6', '7', '8', '9'] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => {
                sounds.playTap();
                setActiveTab(t);
              }}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                activeTab === t
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Table of {t}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-4">
          {/* Tip Box */}
          <div className={`p-4 rounded-xl border ${tables[activeTab].bg}`}>
            <h4 className={`font-heading font-bold text-sm ${tables[activeTab].color} mb-1`}>
              {tables[activeTab].title}
            </h4>
            <p className="text-xs text-slate-700 leading-relaxed">
              {tables[activeTab].tip}
            </p>
          </div>

          {/* Grid of facts */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {facts.map(({ factor, result }) => (
              <div
                key={factor}
                className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200/80 hover:border-indigo-300 hover:bg-indigo-50/40 transition-colors"
              >
                <span className="font-mono text-sm font-semibold text-slate-700">
                  {currentTableNum} × {factor} =
                </span>
                <span className="font-heading font-black text-base text-indigo-700 tabular-nums">
                  {result}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer with instant start button */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200 bg-slate-50">
          <span className="text-xs text-slate-500">Ready to test yourself?</span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 transition-colors"
            >
              Close
            </button>
            <button
              type="button"
              onClick={() => {
                onClose();
                onSelectTableAndStart(activeTab);
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-md transition-colors"
            >
              <CheckCircle2 className="w-4 h-4" />
              Start Table {activeTab} (60 Qs)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
