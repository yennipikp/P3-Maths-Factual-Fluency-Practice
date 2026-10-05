import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Timer, ArrowRight, CornerDownLeft, Delete, Flame, AlertCircle, CheckCircle, Flag, Clock } from 'lucide-react';
import { Question, TableSelection } from '../types/quiz';
import { sounds } from '../utils/audio';

interface QuizSprintProps {
  selection: TableSelection;
  questions: Question[];
  onComplete: (completedQuestions: Question[], totalTimeSpentSeconds: number) => void;
  onExit: () => void;
}

// Exactly 2 minutes (120 seconds) for the ENTIRE 60-question practice set
const TOTAL_SET_TIME_SECONDS = 120;

export const QuizSprint: React.FC<QuizSprintProps> = ({
  selection,
  questions: initialQuestions,
  onComplete,
  onExit,
}) => {
  const [questions, setQuestions] = useState<Question[]>(initialQuestions);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [inputValue, setInputValue] = useState<string>('');
  const [timeLeft, setTimeLeft] = useState<number>(TOTAL_SET_TIME_SECONDS);
  const [currentStreak, setCurrentStreak] = useState<number>(0);
  const [maxStreak, setMaxStreak] = useState<number>(0);
  const [showConfirmSubmit, setShowConfirmSubmit] = useState<boolean>(false);

  // References to keep timer decoupled from re-renders and question advances
  const startTimeRef = useRef<number>(Date.now());
  const timerIdRef = useRef<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const isFinishedRef = useRef<boolean>(false);

  const questionsRef = useRef<Question[]>(initialQuestions);
  const currentIndexRef = useRef<number>(0);
  const inputValueRef = useRef<string>('');
  const onCompleteRef = useRef(onComplete);

  // Keep mutable refs in sync with state
  questionsRef.current = questions;
  currentIndexRef.current = currentIndex;
  inputValueRef.current = inputValue;
  onCompleteRef.current = onComplete;

  const currentQuestion = questions[currentIndex];
  const totalQuestions = questions.length;

  // Format time MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Safe submission handler for the entire practice set
  const submitPracticeSet = useCallback((reason: 'time_up' | 'user_finish') => {
    if (isFinishedRef.current) return;
    isFinishedRef.current = true;

    if (timerIdRef.current) {
      clearInterval(timerIdRef.current);
      timerIdRef.current = null;
    }

    // Save pending answer into the current question before submitting
    const latestQuestions = [...questionsRef.current];
    const currentIdx = currentIndexRef.current;
    const currentInput = inputValueRef.current.trim();

    if (currentInput !== '') {
      const parsed = parseInt(currentInput, 10);
      if (!isNaN(parsed)) {
        latestQuestions[currentIdx] = {
          ...latestQuestions[currentIdx],
          userAnswer: parsed,
        };
      }
    }

    const elapsedSeconds = Math.min(
      TOTAL_SET_TIME_SECONDS,
      Math.max(1, Math.round((Date.now() - startTimeRef.current) / 1000))
    );

    if (reason === 'time_up') {
      sounds.playTimeUp();
    } else {
      sounds.playVictory();
    }

    onCompleteRef.current(latestQuestions, elapsedSeconds);
  }, []);

  // Set-level 2-minute countdown timer:
  // Starts ONCE when this practice set mounts, and ticks continuously for all 60 questions!
  useEffect(() => {
    startTimeRef.current = Date.now();
    isFinishedRef.current = false;

    timerIdRef.current = window.setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
      const remaining = Math.max(0, TOTAL_SET_TIME_SECONDS - elapsed);
      setTimeLeft(remaining);

      // Warning ticks in the final 10 seconds of the set
      if (remaining <= 10 && remaining > 0) {
        sounds.playCountdownTick(remaining <= 3);
      }

      if (remaining <= 0) {
        if (timerIdRef.current) {
          clearInterval(timerIdRef.current);
          timerIdRef.current = null;
        }
        submitPracticeSet('time_up');
      }
    }, 250);

    return () => {
      if (timerIdRef.current) {
        clearInterval(timerIdRef.current);
        timerIdRef.current = null;
      }
    };
  }, [submitPracticeSet]);

  // Keep input focused whenever moving between questions
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [currentIndex]);

  // Sync input value when changing question index
  useEffect(() => {
    const q = questions[currentIndex];
    setInputValue(q.userAnswer !== null ? String(q.userAnswer) : '');
  }, [currentIndex, questions]);

  // Advance to next question or submit answer
  const advanceWithAnswer = (rawAnswer: string) => {
    const parsed = rawAnswer.trim() === '' ? null : parseInt(rawAnswer, 10);
    const isValidNumber = parsed !== null && !isNaN(parsed);

    // Save answer into state
    const updated = [...questions];
    updated[currentIndex] = {
      ...updated[currentIndex],
      userAnswer: isValidNumber ? parsed : null,
    };
    setQuestions(updated);

    // Check streak
    if (isValidNumber && parsed === currentQuestion.correctAnswer) {
      const newStreak = currentStreak + 1;
      setCurrentStreak(newStreak);
      if (newStreak > maxStreak) setMaxStreak(newStreak);
      if (newStreak % 5 === 0) {
        sounds.playStreakChime();
      } else {
        sounds.playSubmit();
      }
    } else {
      if (isValidNumber) {
        setCurrentStreak(0);
      }
      sounds.playTap();
    }

    // Move to next question or complete practice set if at Q60
    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex((prev) => prev + 1);
      setInputValue('');
    } else {
      // Reached question 60
      submitPracticeSet('user_finish');
    }
  };

  const handleKeypadPress = (val: string) => {
    sounds.playTap();
    if (val === 'backspace') {
      setInputValue((prev) => prev.slice(0, -1));
    } else if (val === 'enter') {
      advanceWithAnswer(inputValue);
    } else {
      // Limit to 3 digits (max possible is 12 × 12 = 144)
      if (inputValue.length < 3) {
        const nextVal = inputValue + val;
        setInputValue(nextVal);
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      advanceWithAnswer(inputValue);
    }
  };

  const handleSkip = () => {
    sounds.playTap();
    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  // Timer color states for the 2-minute practice set
  const isUrgent = timeLeft <= 15;
  const isWarning = timeLeft <= 40 && timeLeft > 15;
  const progressRatio = timeLeft / TOTAL_SET_TIME_SECONDS;
  const answeredCount = questions.filter((q) => q.userAnswer !== null).length;

  return (
    <div className="max-w-4xl mx-auto px-4 py-4 sm:py-6 space-y-6">
      {/* Top HUD: Table title, Set Timer, and Controls */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Table Badge & Progress */}
        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
          <div className="space-y-0.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600 block">
              {selection === 'mix' ? 'Grand Mix (6, 7, 8 & 9)' : `Table of ${selection}`}
            </span>
            <div className="flex items-center gap-2">
              <span className="font-heading font-black text-lg sm:text-xl text-slate-900">
                Question {currentIndex + 1}
              </span>
              <span className="text-xs font-semibold text-slate-400">
                of {totalQuestions}
              </span>
            </div>
          </div>

          {currentStreak >= 3 && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-xs font-bold animate-pulse-fast">
              <Flame className="w-4 h-4 fill-amber-500 text-amber-500" />
              <span>{currentStreak} Streak!</span>
            </div>
          )}
        </div>

        {/* 2-Minute Set Timer (Applies to the entire 60 questions) */}
        <div className="flex items-center gap-4">
          <div
            className={`flex items-center gap-2.5 px-5 py-2.5 rounded-2xl border-2 transition-all ${
              isUrgent
                ? 'bg-rose-50 border-rose-500 text-rose-600 animate-pulse-fast shadow-md shadow-rose-200'
                : isWarning
                ? 'bg-amber-50 border-amber-500 text-amber-700 shadow-xs'
                : 'bg-emerald-50 border-emerald-500 text-emerald-700 shadow-xs'
            }`}
          >
            <Timer className={`w-5 h-5 ${isUrgent ? 'animate-spin' : ''}`} />
            <div className="flex flex-col text-left">
              <div className="flex items-baseline gap-1">
                <span className="font-mono font-black text-2xl sm:text-3xl tabular-nums leading-none">
                  {formatTime(timeLeft)}
                </span>
                <span className="text-[10px] font-bold text-slate-400 font-mono">/ 2:00</span>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                Set Timer (All 60 Qs)
              </span>
            </div>
          </div>

          {/* Early Submit button */}
          <button
            type="button"
            onClick={() => setShowConfirmSubmit(true)}
            className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-xl border border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <Flag className="w-3.5 h-3.5" />
            Finish Set
          </button>
        </div>
      </div>

      {/* Set Timer Progress Bar */}
      <div className="space-y-1">
        <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 px-1">
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-indigo-600" />
            Practice Set Countdown (2 Minutes Total)
          </span>
          <span className="font-mono tabular-nums text-slate-600">
            {timeLeft}s remaining for this 60-question set
          </span>
        </div>
        <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-300 ${
              isUrgent ? 'bg-rose-500' : isWarning ? 'bg-amber-500' : 'bg-emerald-500'
            }`}
            style={{ width: `${progressRatio * 100}%` }}
          />
        </div>
      </div>

      {/* Main Flashcard Arena */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border-2 border-indigo-100 shadow-xl shadow-indigo-100/50 flex flex-col items-center justify-center relative overflow-hidden">
        {/* Subtle background math watermark shape */}
        <div className="absolute top-2 left-6 text-indigo-50 font-black text-9xl select-none pointer-events-none -z-0">
          ×
        </div>

        {/* Big Math Question Display */}
        <div className="relative z-10 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 my-4 w-full">
          <div className="flex items-center gap-4 text-slate-800 font-heading font-black text-5xl sm:text-7xl lg:text-8xl tracking-tight select-none">
            <span className="tabular-nums">{currentQuestion.factorA}</span>
            <span className="text-indigo-600 font-sans">×</span>
            <span className="tabular-nums">{currentQuestion.factorB}</span>
            <span className="text-slate-400">=</span>
          </div>

          {/* Big Input Box */}
          <div className="relative">
            <input
              ref={inputRef}
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              autoFocus
              value={inputValue}
              onChange={(e) => {
                const val = e.target.value.replace(/[^0-9]/g, '');
                if (val.length <= 3) {
                  setInputValue(val);
                }
              }}
              onKeyDown={handleKeyDown}
              placeholder="?"
              className="w-32 sm:w-40 h-20 sm:h-24 text-center font-heading font-black text-4xl sm:text-6xl text-indigo-700 bg-indigo-50/60 rounded-2xl border-3 border-indigo-500 focus:border-indigo-600 focus:ring-4 focus:ring-indigo-200 outline-none tabular-nums transition-all placeholder:text-slate-300"
            />
          </div>
        </div>

        {/* Helper subtext */}
        <p className="text-xs text-slate-400 font-medium text-center mt-2 flex items-center gap-1.5">
          <span>Press</span>
          <kbd className="px-2 py-0.5 rounded bg-slate-100 border border-slate-300 text-slate-700 font-mono text-[11px] font-bold">
            Enter ↵
          </kbd>
          <span>or tap</span>
          <span className="text-indigo-600 font-bold">Next</span>
          <span>to advance!</span>
        </p>

        {/* Action Row */}
        <div className="flex items-center gap-3 mt-6 w-full max-w-sm">
          <button
            type="button"
            onClick={handleSkip}
            className="flex-1 py-3 px-4 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
          >
            Skip for now ➔
          </button>

          <button
            type="button"
            onClick={() => advanceWithAnswer(inputValue)}
            className="flex-2 py-3 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-heading font-black text-base shadow-md shadow-indigo-300 flex items-center justify-center gap-2 transition-all active:scale-98"
          >
            <span>Next Fact</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* On-screen Numeric Keypad for tablets / touch / fast mouse */}
      <div className="bg-slate-100/90 rounded-2xl p-3 sm:p-4 max-w-md mx-auto border border-slate-200 shadow-xs">
        <div className="grid grid-cols-3 gap-2">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
            <button
              key={digit}
              type="button"
              onClick={() => handleKeypadPress(digit)}
              className="h-12 sm:h-14 rounded-xl bg-white border border-slate-200 font-heading font-black text-xl sm:text-2xl text-slate-800 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-300 active:scale-95 shadow-xs transition-all cursor-pointer"
            >
              {digit}
            </button>
          ))}
          <button
            type="button"
            onClick={() => handleKeypadPress('backspace')}
            className="h-12 sm:h-14 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center hover:bg-rose-100 active:scale-95 transition-all cursor-pointer"
            title="Delete"
          >
            <Delete className="w-6 h-6" />
          </button>
          <button
            type="button"
            onClick={() => handleKeypadPress('0')}
            className="h-12 sm:h-14 rounded-xl bg-white border border-slate-200 font-heading font-black text-xl sm:text-2xl text-slate-800 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-300 active:scale-95 shadow-xs transition-all cursor-pointer"
          >
            0
          </button>
          <button
            type="button"
            onClick={() => handleKeypadPress('enter')}
            className="h-12 sm:h-14 rounded-xl bg-indigo-600 border border-indigo-600 text-white font-heading font-bold text-sm flex items-center justify-center gap-1 hover:bg-indigo-700 active:scale-95 shadow-sm transition-all cursor-pointer"
            title="Next Question"
          >
            <span>Next</span>
            <CornerDownLeft className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 60 Questions Progress Tracker Strip */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-2.5">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="font-heading font-bold text-slate-700">Question Map</span>
            <span className="text-slate-400">·</span>
            <span className="text-slate-500 font-semibold font-mono tabular-nums">
              {answeredCount} / {totalQuestions} Answered
            </span>
          </div>
          <div className="flex items-center gap-3 text-[11px] text-slate-500">
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-600 inline-block" />
              Answered
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block" />
              Current
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-200 inline-block" />
              Unanswered
            </span>
          </div>
        </div>

        {/* 60 interactive dots */}
        <div className="grid grid-cols-12 sm:grid-cols-20 gap-1.5 max-h-24 overflow-y-auto p-1 bg-slate-50 rounded-xl">
          {questions.map((q, idx) => {
            const isCurrent = idx === currentIndex;
            const isAnswered = q.userAnswer !== null;

            return (
              <button
                key={q.id}
                type="button"
                onClick={() => {
                  sounds.playTap();
                  setCurrentIndex(idx);
                }}
                className={`h-6 rounded-md font-mono text-[10px] font-bold flex items-center justify-center transition-all ${
                  isCurrent
                    ? 'bg-amber-400 text-slate-950 ring-2 ring-amber-500 font-black scale-110 z-10'
                    : isAnswered
                    ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                    : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                }`}
                title={`Question ${idx + 1}: ${q.factorA} × ${q.factorB}`}
              >
                {idx + 1}
              </button>
            );
          })}
        </div>
      </div>

      {/* Confirmation Modal when student clicks Finish Early */}
      {showConfirmSubmit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-pop-in">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center gap-3 text-amber-600">
              <AlertCircle className="w-6 h-6 shrink-0" />
              <h3 className="font-heading font-black text-lg text-slate-900">
                Submit Practice Set Now?
              </h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              You still have <strong className="text-indigo-600">{formatTime(timeLeft)}</strong> left on the set timer and have answered <strong className="text-indigo-600">{answeredCount} of 60</strong> questions.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowConfirmSubmit(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
              >
                Keep Going
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowConfirmSubmit(false);
                  submitPracticeSet('user_finish');
                }}
                className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-sm transition-colors"
              >
                Submit Practice Set
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
