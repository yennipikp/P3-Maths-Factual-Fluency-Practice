/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { TableSelector } from './components/TableSelector';
import { QuizSprint } from './components/QuizSprint';
import { ResultsView } from './components/ResultsView';
import { MultiplicationChartModal } from './components/MultiplicationChartModal';
import { RecordsModal } from './components/RecordsModal';
import { Question, QuizResult, TableSelection } from './types/quiz';
import { generate60Questions, getSavedBestScores, saveBestScore } from './utils/quizGenerator';
import { sounds } from './utils/audio';

export default function App() {
  const [view, setView] = useState<'select' | 'quiz' | 'results'>('select');
  const [selectedTable, setSelectedTable] = useState<TableSelection>('6');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [result, setResult] = useState<QuizResult | null>(null);
  const [bestScores, setBestScores] = useState<Record<TableSelection, number>>({
    '6': 0,
    '7': 0,
    '8': 0,
    '9': 0,
    'mix': 0,
  });
  const [isNewRecord, setIsNewRecord] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [isStudyModalOpen, setIsStudyModalOpen] = useState<boolean>(false);
  const [isRecordsModalOpen, setIsRecordsModalOpen] = useState<boolean>(false);

  // Load saved high scores on mount
  useEffect(() => {
    setBestScores(getSavedBestScores());
    setSoundEnabled(sounds.enabled);
  }, []);

  const handleToggleSound = () => {
    const updated = sounds.toggle();
    setSoundEnabled(updated);
  };

  const handleStartQuiz = (overrideTable?: TableSelection) => {
    const targetTable = overrideTable || selectedTable;
    if (overrideTable) {
      setSelectedTable(overrideTable);
    }
    const newQuestions = generate60Questions(targetTable);
    setQuestions(newQuestions);
    setResult(null);
    setIsNewRecord(false);
    setView('quiz');
  };

  const handleQuizComplete = (completedQuestions: Question[], totalTimeSpentSeconds: number) => {
    // Calculate total score out of 60
    const correctCount = completedQuestions.filter(
      (q) => q.userAnswer !== null && q.userAnswer === q.correctAnswer
    ).length;

    const attemptedCount = completedQuestions.filter((q) => q.userAnswer !== null).length;
    const accuracyPercent =
      attemptedCount > 0 ? Math.round((correctCount / completedQuestions.length) * 100) : 0;

    // Calculate best streak
    let currentRun = 0;
    let maxRun = 0;
    completedQuestions.forEach((q) => {
      if (q.userAnswer !== null && q.userAnswer === q.correctAnswer) {
        currentRun++;
        if (currentRun > maxRun) maxRun = currentRun;
      } else {
        currentRun = 0;
      }
    });

    const avgSpeed =
      attemptedCount > 0 ? Number((totalTimeSpentSeconds / attemptedCount).toFixed(1)) : 0;

    // Check personal best
    const beaten = saveBestScore(selectedTable, correctCount);
    setIsNewRecord(beaten);
    setBestScores(getSavedBestScores());

    const finalResult: QuizResult = {
      tableSelection: selectedTable,
      totalQuestions: 60,
      score: correctCount,
      accuracyPercent,
      totalTimeSpentSeconds,
      averageTimePerQuestion: avgSpeed,
      bestStreak: maxRun,
      questions: completedQuestions,
      completedAt: new Date().toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      }),
    };

    setResult(finalResult);
    setView('results');
  };

  const handleRetry = () => {
    handleStartQuiz();
  };

  const handleChooseAnotherTable = () => {
    setView('select');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Top Navigation */}
      <Header
        soundEnabled={soundEnabled}
        onToggleSound={handleToggleSound}
        onOpenStudyModal={() => setIsStudyModalOpen(true)}
        onOpenRecordsModal={() => setIsRecordsModalOpen(true)}
        isPracticing={view === 'quiz'}
      />

      {/* Main View Area */}
      <main className="flex-1 pb-12">
        {view === 'select' && (
          <TableSelector
            selectedTable={selectedTable}
            onSelectTable={setSelectedTable}
            onStartQuiz={() => handleStartQuiz()}
            bestScores={bestScores}
            onOpenStudyModal={() => setIsStudyModalOpen(true)}
          />
        )}

        {view === 'quiz' && (
          <QuizSprint
            selection={selectedTable}
            questions={questions}
            onComplete={handleQuizComplete}
            onExit={() => setView('select')}
          />
        )}

        {view === 'results' && result && (
          <ResultsView
            result={result}
            isNewRecord={isNewRecord}
            onRetry={handleRetry}
            onChooseAnotherTable={handleChooseAnotherTable}
          />
        )}
      </main>

      {/* Modals */}
      <MultiplicationChartModal
        isOpen={isStudyModalOpen}
        onClose={() => setIsStudyModalOpen(false)}
        onSelectTableAndStart={(tbl) => {
          setSelectedTable(tbl);
          handleStartQuiz(tbl);
        }}
      />

      <RecordsModal
        isOpen={isRecordsModalOpen}
        onClose={() => setIsRecordsModalOpen(false)}
        bestScores={bestScores}
        onSelectTable={(tbl) => {
          setSelectedTable(tbl);
          handleStartQuiz(tbl);
        }}
      />

      {/* Quiet Footer */}
      <footer className="w-full border-t border-slate-200 bg-white py-6 px-4 text-center text-xs text-slate-500">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="font-medium">
            Times Table Turbo · Primary 3 Multiplication Fluency Practice
          </p>
          <div className="flex items-center gap-2">
            <span>Tables: 6, 7, 8, 9 & Mix (1–10)</span>
            <span aria-hidden="true">·</span>
            <span>60 Questions</span>
            <span aria-hidden="true">·</span>
            <span>2-Minute Set Timer</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
