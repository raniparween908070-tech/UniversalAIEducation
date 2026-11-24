import React, { useState, useEffect } from 'react';
import { 
  Globe, 
  Calculator, 
  Atom, 
  Code, 
  BookOpen, 
  Award, 
  Moon, 
  HelpCircle, 
  Search, 
  Sparkles, 
  Send,
  CheckCircle2
} from 'lucide-react';
import { Category, QuestionItem } from '../types';
import { FormattedText } from '../components/FormattedText';

interface CategoriesProps {
  darkMode: boolean;
}

export const Categories: React.FC<CategoriesProps> = ({ darkMode }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [questions, setQuestions] = useState<QuestionItem[]>([]);
  const [selectedCat, setSelectedCat] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [aiModalQuery, setAiModalQuery] = useState('');
  const [aiAnswer, setAiAnswer] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch('/api/categories')
      .then(res => res.json())
      .then(data => setCategories(data))
      .catch(err => console.error(err));

    fetch('/api/questions')
      .then(res => res.json())
      .then(data => setQuestions(data))
      .catch(err => console.error(err));
  }, []);

  const getCategoryIcon = (iconName: string) => {
    switch (iconName) {
      case 'Globe': return <Globe className="w-6 h-6 text-indigo-500" />;
      case 'Calculator': return <Calculator className="w-6 h-6 text-violet-500" />;
      case 'Atom': return <Atom className="w-6 h-6 text-cyan-500" />;
      case 'Code': return <Code className="w-6 h-6 text-emerald-500" />;
      case 'BookOpen': return <BookOpen className="w-6 h-6 text-amber-500" />;
      case 'Award': return <Award className="w-6 h-6 text-rose-500" />;
      case 'Moon': return <Moon className="w-6 h-6 text-blue-500" />;
      default: return <HelpCircle className="w-6 h-6 text-indigo-500" />;
    }
  };

  const filteredQuestions = questions.filter(q => {
    const matchesCat = selectedCat === 'all' || q.category === selectedCat;
    const matchesQuery = q.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         q.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesQuery;
  });

  const handleAskCategoryAI = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiModalQuery.trim()) return;

    setLoading(true);
    setAiAnswer(null);

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: aiModalQuery, subject: selectedCat === 'all' ? 'General Education' : selectedCat })
      });
      const data = await res.json();
      if (data.success) {
        setAiAnswer(data.answer);
      } else {
        setAiAnswer('Error: ' + data.error);
      }
    } catch (err: any) {
      setAiAnswer('Error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen py-12 transition-colors ${darkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">Comprehensive Knowledge Index</span>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Education Categories & Q&A Bank</h1>
          <p className={`text-sm sm:text-base ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
            Explore subjects ranging from Mathematics, Physics, and Coding to Islamic Education, GK, and Grammar. Ask AI any specific question.
          </p>
        </div>

        {/* Categories Bar */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={() => setSelectedCat('all')}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
              selectedCat === 'all'
                ? 'bg-indigo-600 text-white shadow-md'
                : darkMode ? 'bg-slate-900 text-slate-300 border border-slate-800 hover:bg-slate-800' : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
            }`}
          >
            All Categories
          </button>
          {categories.map(c => (
            <button
              key={c.id}
              onClick={() => setSelectedCat(c.id)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 ${
                selectedCat === c.id
                  ? 'bg-indigo-600 text-white shadow-md'
                  : darkMode ? 'bg-slate-900 text-slate-300 border border-slate-800 hover:bg-slate-800' : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>

        {/* Search & Subject AI Ask Widget */}
        <div className={`p-6 rounded-3xl border shadow-lg ${
          darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
        }`}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Search Q&A */}
            <div className="space-y-3">
              <label className="text-sm font-bold flex items-center gap-2">
                <Search className="w-4 h-4 text-indigo-500" /> Search Existing Q&A Bank
              </label>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search questions or answers..."
                className={`w-full px-4 py-3 rounded-xl text-sm border outline-none ${
                  darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                }`}
              />
            </div>

            {/* Ask AI in this category */}
            <div className="space-y-3">
              <label className="text-sm font-bold flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-500" /> Ask AI on {selectedCat === 'all' ? 'Any Subject' : selectedCat}
              </label>
              <form onSubmit={handleAskCategoryAI} className="flex gap-2">
                <input
                  type="text"
                  value={aiModalQuery}
                  onChange={(e) => setAiModalQuery(e.target.value)}
                  placeholder="Type your question here..."
                  className={`flex-1 px-4 py-3 rounded-xl text-sm border outline-none ${
                    darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                  }`}
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-3 rounded-xl bg-indigo-600 text-white font-semibold text-sm hover:bg-indigo-700 flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  <Send className="w-4 h-4" /> Ask
                </button>
              </form>
            </div>

          </div>

          {/* AI Result if generated */}
          {aiAnswer && (
            <div className={`mt-6 p-5 rounded-2xl border ${
              darkMode ? 'bg-slate-800/80 border-indigo-500/30 text-indigo-100' : 'bg-indigo-50 border-indigo-200 text-indigo-900'
            }`}>
              <div className="flex items-center gap-2 font-bold mb-2 text-indigo-600 dark:text-indigo-400">
                <Sparkles className="w-4 h-4" /> Gyan AI Response
              </div>
              <div className="text-sm leading-relaxed">
                <FormattedText content={aiAnswer} />
              </div>
            </div>
          )}
        </div>

        {/* Questions List */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold">Matched Questions & Answers ({filteredQuestions.length})</h2>
          {filteredQuestions.length === 0 ? (
            <div className={`p-8 rounded-2xl text-center border ${
              darkMode ? 'bg-slate-900 border-slate-800 text-slate-400' : 'bg-white border-slate-200 text-slate-500'
            }`}>
              No questions found matching your search. Use the Ask AI box above to get an instant answer!
            </div>
          ) : (
            filteredQuestions.map(q => (
              <div
                key={q.id}
                className={`p-6 rounded-2xl border transition-all ${
                  darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
                }`}
              >
                <div className="flex items-center gap-2 text-xs font-semibold text-indigo-600 dark:text-indigo-400 mb-2 uppercase tracking-wider">
                  <CheckCircle2 className="w-4 h-4" /> Category: {q.category}
                </div>
                <h3 className="text-lg font-bold mb-2">{q.question}</h3>
                <p className={`text-sm leading-relaxed ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>{q.answer}</p>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
};
