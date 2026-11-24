import React, { useState, useEffect } from 'react';
import { Award, CheckCircle2, XCircle, RotateCcw, ArrowRight, Sparkles } from 'lucide-react';
import { QuizItem } from '../types';

interface QuizPageProps {
  darkMode: boolean;
}

export const QuizPage: React.FC<QuizPageProps> = ({ darkMode }) => {
  const [quizList, setQuizList] = useState<QuizItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [isAnswered, setIsAnswered] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);

  useEffect(() => {
    fetch('/api/quiz')
      .then(res => res.json())
      .then(data => setQuizList(data))
      .catch(err => console.error(err));
  }, []);

  const currentQuiz = quizList[currentIndex];

  const handleSelectOption = (idx: number) => {
    if (isAnswered) return;
    setSelectedOption(idx);
    setIsAnswered(true);
    if (idx === currentQuiz.correct) {
      setScore(score + 1);
    }
  };

  const handleNext = () => {
    if (currentIndex + 1 < quizList.length) {
      setCurrentIndex(currentIndex + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setQuizCompleted(true);
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setScore(0);
    setIsAnswered(false);
    setQuizCompleted(false);
  };

  if (quizList.length === 0) {
    return (
      <div className={`min-h-[calc(100vh-4rem)] flex items-center justify-center ${darkMode ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'}`}>
        Loading Quiz Questions...
      </div>
    );
  }

  const percentage = Math.round((score / quizList.length) * 100);

  return (
    <div className={`min-h-screen py-12 transition-colors ${darkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-violet-600/10 text-violet-600 dark:text-violet-400 flex items-center justify-center mx-auto">
            <Award className="w-6 h-6" />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight">Interactive GK & Knowledge Quiz</h1>
          <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
            Test your knowledge across Indian history, science, geography, and competitive exam questions.
          </p>
        </div>

        {!quizCompleted ? (
          <div className={`p-6 sm:p-8 rounded-3xl border shadow-xl ${
            darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
          }`}>
            
            {/* Progress Header */}
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-inherit text-sm font-semibold">
              <span className="text-indigo-600 dark:text-indigo-400 uppercase tracking-wider text-xs">
                Question {currentIndex + 1} of {quizList.length}
              </span>
              <span className={`px-3 py-1 rounded-full text-xs ${
                darkMode ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-700'
              }`}>
                Score: {score}
              </span>
            </div>

            {/* Question */}
            <h2 className="text-xl sm:text-2xl font-bold mb-6">{currentQuiz.question}</h2>

            {/* Options */}
            <div className="space-y-3 mb-6">
              {currentQuiz.options.map((opt, idx) => {
                let btnStyle = darkMode ? 'bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700' : 'bg-slate-50 border-slate-300 text-slate-800 hover:bg-slate-100';
                
                if (isAnswered) {
                  if (idx === currentQuiz.correct) {
                    btnStyle = 'bg-emerald-500/20 border-emerald-500 text-emerald-400 font-bold';
                  } else if (idx === selectedOption) {
                    btnStyle = 'bg-red-500/20 border-red-500 text-red-400 font-bold';
                  }
                }

                return (
                  <button
                    key={idx}
                    onClick={() => handleSelectOption(idx)}
                    disabled={isAnswered}
                    className={`w-full p-4 rounded-2xl border text-left text-sm sm:text-base font-medium transition-all flex items-center justify-between cursor-pointer ${btnStyle}`}
                  >
                    <span className="flex items-center gap-3">
                      <span className="w-7 h-7 rounded-lg bg-indigo-500/10 text-indigo-500 flex items-center justify-center text-xs font-bold shrink-0">
                        {String.fromCharCode(65 + idx)}
                      </span>
                      {opt}
                    </span>
                    {isAnswered && idx === currentQuiz.correct && <CheckCircle2 className="w-5 h-5 text-emerald-500" />}
                    {isAnswered && idx === selectedOption && idx !== currentQuiz.correct && <XCircle className="w-5 h-5 text-red-500" />}
                  </button>
                );
              })}
            </div>

            {/* Explanation if answered */}
            {isAnswered && (
              <div className={`p-4 rounded-2xl border mb-6 text-sm animate-fadeIn ${
                darkMode ? 'bg-slate-800/85 border-slate-700 text-slate-200' : 'bg-indigo-50/80 border-indigo-200 text-indigo-950'
              }`}>
                <span className="font-bold block mb-1 text-indigo-600 dark:text-indigo-400">Explanation:</span>
                {currentQuiz.explanation}
              </div>
            )}

            {/* Next Button */}
            {isAnswered && (
              <div className="flex justify-end">
                <button
                  onClick={handleNext}
                  className="px-6 py-3 rounded-xl bg-indigo-600 text-white font-semibold text-sm hover:bg-indigo-700 flex items-center gap-2 cursor-pointer shadow-lg"
                >
                  {currentIndex + 1 < quizList.length ? 'Next Question' : 'View Results'} <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}

          </div>
        ) : (
          /* Quiz Results View */
          <div className={`p-8 rounded-3xl border text-center space-y-6 shadow-xl ${
            darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
          }`}>
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto">
              <Sparkles className="w-8 h-8" />
            </div>

            <h2 className="text-3xl font-extrabold">Quiz Completed!</h2>
            <p className={`text-base ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
              You scored <span className="font-bold text-indigo-500">{score}</span> out of <span className="font-bold">{quizList.length}</span> ({percentage}%)
            </p>

            <div className="flex justify-center pt-4">
              <button
                onClick={handleRestart}
                className="px-6 py-3.5 rounded-xl bg-indigo-600 text-white font-semibold text-sm hover:bg-indigo-700 flex items-center gap-2 cursor-pointer shadow-lg"
              >
                <RotateCcw className="w-4 h-4" /> Restart Quiz
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
