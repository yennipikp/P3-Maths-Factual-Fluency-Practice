import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  Trophy,
  RotateCcw,
  Sparkles,
  Award,
  CheckCircle2,
  XCircle,
  Clock,
  Zap,
  ArrowRight,
  Printer,
  ChevronDown,
  Flame,
} from 'lucide-react';
import { Question, QuizResult, TableSelection } from '../types/quiz';
import { sounds } from '../utils/audio';
import { CertificateModal } from './CertificateModal';

interface ResultsViewProps {
  result: QuizResult;
  isNewRecord: boolean;
  onRetry: () => void;
  onChooseAnotherTable: () => void;
}

export const ResultsView: React.FC<ResultsViewProps> = ({
  result,
  isNewRecord,
  onRetry,
  onChooseAnotherTable,
}) => {
  const [filter, setFilter] = useState<'all' | 'correct' | 'incorrect' | 'unanswered'>('all');
  const [isCertificateOpen, setIsCertificateOpen] = useState(false);

  // Trigger celebratory confetti on high scores
  useEffect(() => {
    if (result.score >= 30) {
      confetti({
        particleCount: result.score >= 50 ? 100 : 50,
        spread: 70,
        origin: { y: 0.6 },
      });
    }
  }, [result.score]);

  // Calculations
  const correctCount = result.questions.filter(
    (q) => q.userAnswer !== null && q.userAnswer === q.correctAnswer
  ).length;

  const incorrectCount = result.questions.filter(
    (q) => q.userAnswer !== null && q.userAnswer !== q.correctAnswer
  ).length;

  const unansweredCount = result.questions.filter((q) => q.userAnswer === null).length;

  // Grade badge & encouraging message for Primary 3 students
  const getFeedbackTier = (score: number) => {
    if (score === 60) {
      return {
        badge: 'Perfect Fluency Master 🌟',
        title: 'Outstanding! 60 out of 60!',
        message: 'You answered every single multiplication fact correctly! You are a true math superstar!',
        color: 'from-amber-400 to-yellow-500',
        textColor: 'text-amber-500',
      };
    }
    if (score >= 50) {
      return {
        badge: 'Lightning Hero ⚡',
        title: 'Super Speedy & Accurate!',
        message: 'Incredible factual fluency! You recall your tables with lightning speed!',
        color: 'from-emerald-500 to-teal-600',
        textColor: 'text-emerald-500',
      };
    }
    if (score >= 40) {
      return {
        badge: 'Table Champion 🚀',
        title: 'Great Job! Solid Foundation!',
        message: 'You have a fantastic grasp of the tables. A couple more practices and you will hit 55+!',
        color: 'from-indigo-500 to-purple-600',
        textColor: 'text-indigo-600',
      };
    }
    if (score >= 25) {
      return {
        badge: 'Rising Star 🌱',
        title: 'Good Practice Session!',
        message: 'Nice effort! Review the tricky facts below and try again to improve your speed.',
        color: 'from-sky-500 to-blue-600',
        textColor: 'text-sky-600',
      };
    }
    return {
      badge: 'Keep Practicing 💪',
      title: 'Practice Makes Progress!',
      message: 'Great start! Use the study table to review the facts, then take the 2-minute sprint again.',
      color: 'from-slate-600 to-slate-700',
      textColor: 'text-slate-600',
    };
  };

  const feedback = getFeedbackTier(result.score);

  // Filtered questions
  const filteredQuestions = result.questions.filter((q) => {
    if (filter === 'correct') return q.userAnswer !== null && q.userAnswer === q.correctAnswer;
    if (filter === 'incorrect') return q.userAnswer !== null && q.userAnswer !== q.correctAnswer;
    if (filter === 'unanswered') return q.userAnswer === null;
    return true;
  });

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 sm:py-10 space-y-8 animate-pop-in">
      {/* Top Banner / Hero Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-xl relative overflow-hidden text-center space-y-6">
        {/* Subtle background glow */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* New Personal Record Pill */}
        {isNewRecord && (
          <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-500 to-rose-500 text-white text-xs font-black shadow-md uppercase tracking-wider animate-bounce">
            <Sparkles className="w-4 h-4" />
            New Personal Best Record!
          </div>
        )}

        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 block">
            {result.tableSelection === 'mix'
              ? 'Multiplication Tables 6, 7, 8 & 9 (Mix)'
              : `Multiplication Table of ${result.tableSelection}`}{' '}
            · 2-Minute Practice Set
          </span>
          <h1 className="font-heading font-black text-2xl sm:text-4xl text-slate-900 tracking-tight">
            {feedback.title}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto">
            {feedback.message}
          </p>
        </div>

        {/* Big Score Display */}
        <div className="inline-flex flex-col items-center justify-center p-6 sm:p-8 rounded-3xl bg-slate-50 border-2 border-indigo-100 shadow-inner min-w-[280px]">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Total Points Earned
          </span>
          <div className="flex items-baseline gap-2 my-1">
            <span className="font-heading font-black text-6xl sm:text-7xl text-indigo-600 tabular-nums">
              {result.score}
            </span>
            <span className="font-heading font-bold text-2xl sm:text-3xl text-slate-400 tabular-nums">
              / 60
            </span>
          </div>
          <div className="flex items-center gap-3 text-xs font-bold text-slate-600 mt-2">
            <span>Accuracy: {result.accuracyPercent}%</span>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <span>Speed: {result.averageTimePerQuestion}s / fact</span>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl mx-auto pt-2">
          <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200 text-left">
            <div className="flex items-center justify-between text-emerald-700 mb-1">
              <span className="text-[11px] font-bold uppercase">Correct</span>
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <span className="font-heading font-black text-2xl text-emerald-800 tabular-nums">
              {correctCount}
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-rose-50/70 border border-rose-200 text-left">
            <div className="flex items-center justify-between text-rose-700 mb-1">
              <span className="text-[11px] font-bold uppercase">Incorrect</span>
              <XCircle className="w-4 h-4" />
            </div>
            <span className="font-heading font-black text-2xl text-rose-800 tabular-nums">
              {incorrectCount}
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-100 border border-slate-200 text-left">
            <div className="flex items-center justify-between text-slate-600 mb-1">
              <span className="text-[11px] font-bold uppercase">Unanswered</span>
              <Clock className="w-4 h-4" />
            </div>
            <span className="font-heading font-black text-2xl text-slate-700 tabular-nums">
              {unansweredCount}
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200 text-left">
            <div className="flex items-center justify-between text-amber-700 mb-1">
              <span className="text-[11px] font-bold uppercase">Best Streak</span>
              <Flame className="w-4 h-4" />
            </div>
            <span className="font-heading font-black text-2xl text-amber-800 tabular-nums">
              {result.bestStreak}
            </span>
          </div>
        </div>

        {/* Primary Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
          <button
            type="button"
            onClick={() => {
              sounds.playVictory();
              onRetry();
            }}
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-heading font-black text-sm flex items-center justify-center gap-2 shadow-md shadow-indigo-300 transition-all cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            Practice Again (Same Table)
          </button>

          <button
            type="button"
            onClick={() => {
              sounds.playTap();
              setIsCertificateOpen(true);
            }}
            className="w-full sm:w-auto px-5 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-heading font-black text-sm flex items-center justify-center gap-2 shadow-md shadow-amber-300/40 transition-all cursor-pointer"
          >
            <Award className="w-4 h-4" />
            View Certificate
          </button>

          <button
            type="button"
            onClick={() => {
              sounds.playTap();
              onChooseAnotherTable();
            }}
            className="w-full sm:w-auto px-5 py-3.5 rounded-xl border border-slate-300 hover:border-slate-400 text-slate-700 hover:text-slate-900 bg-white font-heading font-bold text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            Choose Another Table
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Question-by-Question Review Section */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="font-heading font-black text-xl text-slate-900 tracking-tight">
              Detailed Question Review
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Review every problem with helpful math memory tricks!
            </p>
          </div>

          {/* Filter tabs */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl overflow-x-auto">
            <button
              type="button"
              onClick={() => {
                sounds.playTap();
                setFilter('all');
              }}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors whitespace-nowrap ${
                filter === 'all'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All (60)
            </button>
            <button
              type="button"
              onClick={() => {
                sounds.playTap();
                setFilter('correct');
              }}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors whitespace-nowrap ${
                filter === 'correct'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-emerald-700 hover:text-emerald-900'
              }`}
            >
              Correct ({correctCount})
            </button>
            <button
              type="button"
              onClick={() => {
                sounds.playTap();
                setFilter('incorrect');
              }}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors whitespace-nowrap ${
                filter === 'incorrect'
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'text-rose-700 hover:text-rose-900'
              }`}
            >
              Incorrect ({incorrectCount})
            </button>
            <button
              type="button"
              onClick={() => {
                sounds.playTap();
                setFilter('unanswered');
              }}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors whitespace-nowrap ${
                filter === 'unanswered'
                  ? 'bg-slate-700 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Unanswered ({unansweredCount})
            </button>
          </div>
        </div>

        {/* Questions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[600px] overflow-y-auto pr-1">
          {filteredQuestions.length === 0 ? (
            <div className="col-span-full py-12 text-center text-slate-400 text-xs">
              No questions found for this filter.
            </div>
          ) : (
            filteredQuestions.map((q) => {
              const isCorrect = q.userAnswer !== null && q.userAnswer === q.correctAnswer;
              const isUnanswered = q.userAnswer === null;

              return (
                <div
                  key={q.id}
                  className={`p-4 rounded-2xl border transition-all ${
                    isCorrect
                      ? 'bg-emerald-50/50 border-emerald-200'
                      : isUnanswered
                      ? 'bg-slate-50 border-slate-200'
                      : 'bg-rose-50/50 border-rose-200'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-slate-400">
                          #{q.id}
                        </span>
                        <span className="font-heading font-black text-lg text-slate-900">
                          {q.factorA} × {q.factorB} = {q.correctAnswer}
                        </span>
                      </div>

                      <div className="text-xs font-medium">
                        {isCorrect ? (
                          <span className="text-emerald-700 font-bold flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Your answer: {q.userAnswer} (Correct)
                          </span>
                        ) : isUnanswered ? (
                          <span className="text-slate-500 font-medium flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />
                            Unanswered (Time ran out)
                          </span>
                        ) : (
                          <div className="flex items-center gap-2 text-rose-700 font-bold">
                            <XCircle className="w-3.5 h-3.5 shrink-0" />
                            <span>
                              Your answer: <s className="text-rose-500">{q.userAnswer}</s> → Correct: {q.correctAnswer}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="shrink-0">
                      {isCorrect ? (
                        <span className="inline-block px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[11px] font-bold">
                          +1 pt
                        </span>
                      ) : (
                        <span className="inline-block px-2 py-0.5 rounded-md bg-slate-200 text-slate-600 text-[11px] font-bold">
                          0 pt
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Educational tip / mnemonic */}
                  {q.tip && (
                    <div className="mt-2.5 pt-2 border-t border-slate-200/60 text-[11px] text-slate-600 bg-white/70 rounded-lg p-2">
                      <span className="font-bold text-indigo-700 mr-1">Tip:</span>
                      {q.tip}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Certificate Modal */}
      <CertificateModal
        isOpen={isCertificateOpen}
        onClose={() => setIsCertificateOpen(false)}
        result={result}
      />
    </div>
  );
};
