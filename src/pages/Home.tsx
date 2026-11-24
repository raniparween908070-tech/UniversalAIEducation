import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Sparkles, 
  Send, 
  Globe, 
  Calculator, 
  Atom, 
  Code, 
  BookOpen, 
  Award, 
  Moon, 
  HelpCircle, 
  ArrowRight, 
  CheckCircle2, 
  Languages,
  Brain,
  ShieldCheck,
  Zap,
  ChevronRight
} from 'lucide-react';
import { SiteSettings, Category, QuestionItem } from '../types';
import { FormattedText } from '../components/FormattedText';

interface HomeProps {
  settings: SiteSettings;
  darkMode: boolean;
}

export const Home: React.FC<HomeProps> = ({ settings, darkMode }) => {
  const [prompt, setPrompt] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('General');
  const [loading, setLoading] = useState(false);
  const [answerResult, setAnswerResult] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [questions, setQuestions] = useState<QuestionItem[]>([]);
  const [openAccordion, setOpenAccordion] = useState<number | null>(0);
  const navigate = useNavigate();

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

  const handleAskAI = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setLoading(true);
    setAnswerResult(null);

    try {
      const apiKey =
        (import.meta as any).env?.VITE_GEMINI_API_KEY ||
        (import.meta as any).env?.GEMINI_API_KEY ||
        (typeof process !== 'undefined' ? (process as any).env?.GEMINI_API_KEY : '');

      if (!apiKey) {
        setAnswerResult('Error: Gemini API key missing. Netlify Environment Variables mein VITE_GEMINI_API_KEY set karein.');
        return;
      }

      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent?key=${encodeURIComponent(apiKey)}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: `Subject: ${selectedSubject}\nQuestion: ${prompt}\nAnswer clearly and helpfully.`,
                  },
                ],
              },
            ],
          }),
        }
      );

      const data = await res.json();
      if (!res.ok) {
        setAnswerResult('Error: ' + (data?.error?.message || 'Failed to get AI response'));
        return;
      }

      const text =
        data?.candidates?.[0]?.content?.parts
          ?.map((p: { text?: string }) => p.text || '')
          .join('')
          .trim() || 'No response received.';

      setAnswerResult(text);
    } catch (err: any) {
      setAnswerResult('Network error: ' + (err?.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };


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

  return (
    <div className={`min-h-screen transition-colors ${darkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
      
      {/* Hero Section */}
      <section className="relative overflow-hidden py-16 lg:py-24 border-b border-slate-800/20">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/15 via-violet-900/10 to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 shadow-sm">
              <Sparkles className="w-4 h-4" />
              <span>Universal AI Knowledge Portal • Powered by Cloudflare AI</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
              {settings.heroHeading || 'Discover Knowledge & AI Solutions for Any Subject'}
            </h1>

            <p className={`text-lg sm:text-xl leading-relaxed ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
              {settings.heroDescription || 'Ask any question in Hindi, English, Urdu, or any language. Science, Mathematics, Coding, Grammar, GK, and more.'}
            </p>

            {/* Universal AI Ask Box on Home */}
            <div className={`mt-8 p-3 sm:p-4 rounded-2xl shadow-xl border backdrop-blur-md ${
              darkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-white/90 border-slate-200'
            }`}>
              <form onSubmit={handleAskAI} className="space-y-3">
                <div className="flex flex-col sm:flex-row items-center gap-2">
                  <select
                    value={selectedSubject}
                    onChange={(e) => setSelectedSubject(e.target.value)}
                    className={`w-full sm:w-48 px-3.5 py-3 rounded-xl text-sm font-medium border outline-none cursor-pointer ${
                      darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-100 border-slate-300 text-slate-800'
                    }`}
                  >
                    <option value="General">🧠 General Q&A</option>
                    <option value="Mathematics">📐 Mathematics</option>
                    <option value="Science">🔬 Science & Physics</option>
                    <option value="Coding">💻 Coding & Tech</option>
                    <option value="Grammar">📖 Grammar & Translation</option>
                    <option value="GK">🌍 General Knowledge</option>
                    <option value="History">🏛️ History & Geography</option>
                    <option value="Islamic">🌙 Islamic Education</option>
                  </select>

                  <input
                    type="text"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Ask any question (e.g. Bharat ka samvidhan kab lagu hua? / Explain quantum physics / 25 * 35)..."
                    className={`flex-1 w-full px-4 py-3 rounded-xl text-sm border outline-none ${
                      darkMode ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-400' : 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-500'
                    }`}
                  />

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-semibold text-sm shadow-lg shadow-indigo-600/30 hover:opacity-95 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
                  >
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <Zap className="w-4 h-4 animate-spin" /> Thinking...
                      </span>
                    ) : (
                      <>
                        <Send className="w-4 h-4" /> Ask AI
                      </>
                    )}
                  </button>
                </div>
              </form>

              {/* Instant Answer Box if computed */}
              {answerResult && (
                <div className={`mt-4 p-5 rounded-xl border text-left animate-fadeIn ${
                  darkMode ? 'bg-slate-800/80 border-indigo-500/30 text-indigo-100' : 'bg-indigo-50/80 border-indigo-200 text-indigo-900'
                }`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400">
                      <Brain className="w-4 h-4" /> Gyan AI Instant Answer
                    </span>
                    <button
                      onClick={() => navigate('/chat')}
                      className="text-xs text-indigo-600 dark:text-indigo-400 font-medium hover:underline flex items-center gap-1"
                    >
                      Open in Full Chat <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="text-sm sm:text-base leading-relaxed">
                    <FormattedText content={answerResult} />
                  </div>
                </div>
              )}
            </div>

            {/* Key features badges */}
            <div className="flex flex-wrap justify-center gap-4 pt-4 text-xs font-medium text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Hindi, English & Urdu Support</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> All Subjects & Classes</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-500" /> Interactive Quizzes & Translation</span>
            </div>

          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
          <div>
            <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">Explore Disciplines</span>
            <h2 className="text-3xl font-extrabold tracking-tight mt-1">Universal Education Categories</h2>
          </div>
          <Link to="/categories" className="mt-4 md:mt-0 text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1">
            View All Categories <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              to={`/categories`}
              className={`p-6 rounded-2xl border transition-all duration-200 hover:-translate-y-1 hover:shadow-xl group ${
                darkMode 
                  ? 'bg-slate-900 border-slate-800 hover:border-indigo-500/50' 
                  : 'bg-white border-slate-200 hover:border-indigo-500/50 shadow-sm'
              }`}
            >
              <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                {getCategoryIcon(cat.icon)}
              </div>
              <h3 className="text-lg font-bold mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                {cat.name}
              </h3>
              <p className={`text-xs leading-relaxed ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                {cat.description}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* Translation & Quiz Banner Section */}
      <section className={`py-16 border-y ${darkMode ? 'bg-slate-900/50 border-slate-800' : 'bg-slate-100 border-slate-200'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Translation Promo */}
            <div className={`p-8 rounded-3xl border flex flex-col justify-between ${
              darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-md'
            }`}>
              <div>
                <div className="w-12 h-12 rounded-2xl bg-indigo-600/10 text-indigo-600 flex items-center justify-center mb-6">
                  <Languages className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-bold mb-3">Multilingual Translation Tool</h3>
                <p className={`text-sm mb-6 ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                  Translate texts instantly between Hindi, English, Urdu, French, Spanish, and other major languages with high accuracy and context preservation.
                </p>
              </div>
              <Link
                to="/translate"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-indigo-600 text-white font-semibold text-sm hover:bg-indigo-700 transition-colors w-fit"
              >
                Launch Translator <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Quiz Promo */}
            <div className={`p-8 rounded-3xl border flex flex-col justify-between ${
              darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-md'
            }`}>
              <div>
                <div className="w-12 h-12 rounded-2xl bg-violet-600/10 text-violet-600 flex items-center justify-center mb-6">
                  <Award className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-bold mb-3">Interactive GK & Quiz Center</h3>
                <p className={`text-sm mb-6 ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                  Test your knowledge across Indian history, science, geography, and competitive exam questions with instant scoring and detailed explanations.
                </p>
              </div>
              <Link
                to="/quiz"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-violet-600 text-white font-semibold text-sm hover:bg-violet-700 transition-colors w-fit"
              >
                Start Quiz Now <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* Popular Knowledge Questions Accordion */}
      <section className="py-16 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">Frequently Asked</span>
          <h2 className="text-3xl font-extrabold tracking-tight mt-1">Popular Knowledge & Questions</h2>
        </div>

        <div className="space-y-4">
          {questions.map((q, idx) => (
            <div
              key={q.id}
              className={`rounded-2xl border overflow-hidden transition-all ${
                darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
              }`}
            >
              <button
                onClick={() => setOpenAccordion(openAccordion === idx ? null : idx)}
                className="w-full px-6 py-4 text-left flex items-center justify-between font-semibold text-base focus:outline-none"
              >
                <span className="flex items-center gap-3">
                  <span className="w-7 h-7 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-xs font-bold">
                    {idx + 1}
                  </span>
                  {q.question}
                </span>
                <span className={`transform transition-transform ${openAccordion === idx ? 'rotate-180' : ''}`}>
                  ▼
                </span>
              </button>
              {openAccordion === idx && (
                <div className={`px-6 pb-5 pt-2 text-sm leading-relaxed border-t ${
                  darkMode ? 'border-slate-800 text-slate-300 bg-slate-950/40' : 'border-slate-100 text-slate-600 bg-slate-50'
                }`}>
                  <p>{q.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

    </div>
  );
};
