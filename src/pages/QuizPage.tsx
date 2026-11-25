import React, { useState } from 'react';
import { Award, CheckCircle2, XCircle, RotateCcw, ArrowRight, Sparkles } from 'lucide-react';
import { QuizItem } from '../types';

interface QuizPageProps {
  darkMode: boolean;
}

const DEFAULT_QUIZ_LIST: QuizItem[] = [
  {
    id: 1,
    question: 'Bhartiya Samvidhan (Indian Constitution) kab lagu hua tha?',
    options: [
      '15 August 1947',
      '26 January 1950',
      '26 November 1949',
      '2 October 1950',
    ],
    correct: 1,
    explanation: 'Bhartiya Samvidhan 26 January 1950 ko lagu hua tha aur isi din ko Republic Day ke roop mein manaya jata hai.',
  },
  {
    id: 2,
    question: 'Saur mandal (Solar System) ka sabse bada grah (planet) kaun sa hai?',
    options: ['Mangal (Mars)', 'Shani (Saturn)', 'Brihaspati (Jupiter)', 'Budh (Mercury)'],
    correct: 2,
    explanation: 'Brihaspati (Jupiter) hamare solar system ka sabse bada grah hai.',
  },
  {
    id: 3,
    question: 'Bharat ki sabse lambi nadi kaun si hai?',
    options: ['Yamuna', 'Ganga', 'Godavari', 'Brahmaputra'],
    correct: 1,
    explanation: 'Bharat ke bhitar behne wali sabse lambi nadi Ganga hai.',
  },
  {
    id: 4,
    question: 'Pani ka rasayanik sutra (chemical formula) kya hai?',
    options: ['CO2', 'H2O', 'O2', 'NaCl'],
    correct: 1,
    explanation: 'Pani (water) ke ek anu mein hydrogen ke 2 aur oxygen ka 1 atom hota hai, isliye iska sutra H2O hai.',
  },
  {
    id: 5,
    question: 'Computer mein CPU ka poora naam kya hai?',
    options: [
      'Central Processing Unit',
      'Computer Personal Unit',
      'Central Program Utility',
      'Control Processing User',
    ],
    correct: 0,
    explanation: 'CPU ka full form Central Processing Unit hai, jise computer ka dimag bhi kaha jata hai.',
  },
];

export const QuizPage: React.FC<QuizPageProps> = ({ darkMode }) => {
  const [quizList] = useState<QuizItem[]>(DEFAULT_QUIZ_LIST);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [isAnswered, setIsAnswered] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);

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

  if (!currentQuiz) {
    return (
      <div
        className={`min-h-[calc(100vh-4rem)] flex items-center justify-center ${
          darkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'
        }`}
      >
        Loading Quiz Questions...
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen py-12 transition-colors ${
        darkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'
      }`}
    >
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-3">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-violet-600/10 text-violet-600 dark:text-violet-400 flex items-center justify-center">
            <Award className="w-6 h-6" />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight">
            Interactive GK &amp; Knowledge Quiz
          </h1>
          <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
            Test your knowledge across Indian history, science, geography, and general knowledge.
          </p>
        </div>

        {!quizCompleted ? (
          <div
            className={`p-6 sm:p-8 rounded-3xl border shadow-xl ${
              darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
            }`}
          >
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-inherit text-sm">
              <span className="uppercase tracking-wider text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                Question {currentIndex + 1} of {quizList.length}
              </span>
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  darkMode ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-700'
                }`}
              >
                Score: {score}
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold mb-6">{currentQuiz.question}</h2>

            <div className="space-y-3 mb-6">
              {currentQuiz.options.map((opt, idx) => {
                let btnStyle = darkMode
                  ? 'bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700/80'
                  : 'bg-slate-50 border-slate-200 text-slate-800 hover:bg-slate-100';

                if (isAnswered) {
                  if (idx === currentQuiz.correct) {
                    btnStyle =
                      'bg-emerald-500/20 border-emerald-500 text-emerald-500 font-semibold';
                  } else if (idx === selectedOption) {
                    btnStyle = 'bg-red-500/20 border-red-500 text-red-500 font-semibold';
                  }
                }

                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectOption(idx)}
                    disabled={isAnswered}
                    className={`w-full p-4 rounded-2xl border text-left text-sm sm:text-base font-medium transition-all flex items-center justify-between ${btnStyle}`}
                  >
                    <span className="flex items-center gap-3">
                      <span className="w-7 h-7 rounded-lg bg-indigo-500/10 text-indigo-500 flex items-center justify-center text-xs font-bold">
                        {String.fromCharCode(65 + idx)}
                      </span>
                      <span>{opt}</span>
                    </span>
                    {isAnswered && idx === currentQuiz.correct && (
                      <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                    )}
                    {isAnswered && idx === selectedOption && idx !== currentQuiz.correct && (
                      <XCircle className="w-5 h-5 text-red-500 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>

            {isAnswered && currentQuiz.explanation && (
              <div
                className={`p-4 rounded-2xl border mb-6 text-sm ${
                  darkMode
                    ? 'bg-slate-800/85 border-slate-700 text-slate-200'
                    : 'bg-indigo-50/80 border-indigo-200 text-slate-800'
                }`}
              >
                <span className="font-bold block mb-1 text-indigo-600 dark:text-indigo-400">
                  Explanation:
                </span>
                {currentQuiz.explanation}
              </div>
            )}

            {isAnswered && (
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleNext}
                  className="px-6 py-3 rounded-xl bg-indigo-600 text-white font-semibold text-sm hover:bg-indigo-500 inline-flex items-center gap-2"
                >
                  <span>{currentIndex + 1 < quizList.length ? 'Next Question' : 'View Results'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        ) : (
          <div
            className={`p-8 rounded-3xl border text-center space-y-6 shadow-xl ${
              darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
            }`}
          >
            <div className="w-16 h-16 mx-auto rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
              <Sparkles className="w-8 h-8" />
            </div>
            <h2 className="text-3xl font-extrabold">Quiz Completed!</h2>
            <p className={`text-base ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
              You scored <span className="font-bold text-indigo-500">{score}</span> out of{' '}
              <span className="font-bold">{quizList.length}</span>
            </p>
            <div className="flex justify-center pt-4">
              <button
                type="button"
                onClick={handleRestart}
                className="px-6 py-3.5 rounded-xl bg-indigo-600 text-white font-semibold text-sm hover:bg-indigo-500 inline-flex items-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Restart Quiz</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
