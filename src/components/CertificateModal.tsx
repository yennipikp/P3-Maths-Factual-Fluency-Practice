import React, { useState } from 'react';
import { X, Printer, Award, Sparkles, CheckCircle2 } from 'lucide-react';
import { QuizResult } from '../types/quiz';

interface CertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  result: QuizResult;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({
  isOpen,
  onClose,
  result,
}) => {
  const [studentName, setStudentName] = useState<string>('Super Star Student');

  if (!isOpen) return null;

  const tableName =
    result.tableSelection === 'mix'
      ? 'Multiplication Tables 6, 7, 8 & 9 (Grand Mix)'
      : `Multiplication Table of ${result.tableSelection}`;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-pop-in">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full flex flex-col border border-slate-200 overflow-hidden max-h-[95vh]">
        {/* Modal Controls Header */}
        <div className="flex items-center justify-between px-6 py-3.5 border-b border-slate-200 bg-slate-50 print:hidden">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-500" />
            <span className="font-heading font-bold text-sm text-slate-800">
              Printable Fluency Certificate
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-sm transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              Print Certificate
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Name input (screen only) */}
        <div className="px-6 py-2.5 bg-indigo-50/60 border-b border-indigo-100 flex items-center gap-3 print:hidden">
          <label htmlFor="student-name" className="text-xs font-bold text-indigo-900 shrink-0">
            Student Name:
          </label>
          <input
            id="student-name"
            type="text"
            value={studentName}
            onChange={(e) => setStudentName(e.target.value)}
            className="flex-1 px-3 py-1.5 text-xs font-semibold rounded-lg bg-white border border-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-400 text-slate-800"
            placeholder="Type your name here..."
          />
        </div>

        {/* Certificate Canvas */}
        <div className="p-6 sm:p-10 overflow-y-auto flex items-center justify-center bg-amber-50/30 print:p-0 print:bg-white">
          <div className="w-full border-8 border-double border-amber-500/80 rounded-2xl p-6 sm:p-8 bg-gradient-to-b from-white via-amber-50/20 to-white text-center shadow-md relative overflow-hidden">
            {/* Corner ornaments */}
            <div className="absolute top-2 left-2 text-amber-400 font-serif text-2xl select-none">★</div>
            <div className="absolute top-2 right-2 text-amber-400 font-serif text-2xl select-none">★</div>
            <div className="absolute bottom-2 left-2 text-amber-400 font-serif text-2xl select-none">★</div>
            <div className="absolute bottom-2 right-2 text-amber-400 font-serif text-2xl select-none">★</div>

            {/* Certificate Header */}
            <div className="inline-flex items-center gap-2 text-amber-600 font-heading font-black text-xs uppercase tracking-widest mb-1">
              <Sparkles className="w-4 h-4" />
              Primary 3 Math Fluency Academy
              <Sparkles className="w-4 h-4" />
            </div>

            <h2 className="font-heading font-black text-2xl sm:text-3xl text-slate-900 tracking-tight mb-1">
              Certificate of Achievement
            </h2>

            <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-6">
              This certifies that
            </p>

            {/* Student Name */}
            <div className="my-2 border-b-2 border-indigo-600 pb-2 max-w-md mx-auto">
              <span className="font-heading font-black text-2xl sm:text-3xl text-indigo-700 tracking-tight block">
                {studentName || 'Student'}
              </span>
            </div>

            <p className="text-xs text-slate-600 max-w-md mx-auto mt-4 leading-relaxed">
              has completed the 2-minute factual fluency speed challenge for:
            </p>

            <p className="font-heading font-bold text-base text-slate-800 my-2">
              {tableName}
            </p>

            {/* Score Callout */}
            <div className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl bg-amber-100/70 border border-amber-300 my-4">
              <Award className="w-8 h-8 text-amber-600 shrink-0" />
              <div className="text-left">
                <span className="text-[11px] font-bold uppercase text-amber-800 tracking-wider block">
                  Official Sprint Score
                </span>
                <span className="font-heading font-black text-2xl text-slate-900 tabular-nums">
                  {result.score} / 60 Points ({result.accuracyPercent}%)
                </span>
              </div>
            </div>

            {/* Signature & Date lines */}
            <div className="grid grid-cols-2 gap-8 max-w-md mx-auto mt-8 pt-4 text-xs text-slate-500">
              <div className="border-t border-slate-300 pt-1.5">
                <span className="font-medium block text-slate-700">{result.completedAt}</span>
                <span className="text-[11px] text-slate-400">Date Completed</span>
              </div>
              <div className="border-t border-slate-300 pt-1.5">
                <span className="font-semibold text-indigo-600 block">Verified Primary 3</span>
                <span className="text-[11px] text-slate-400">Teacher / Parent Signature</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex justify-end print:hidden">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
