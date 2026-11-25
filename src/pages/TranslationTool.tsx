import React, { useState } from 'react';
import { Languages, ArrowRightLeft, Copy, Check, Trash2, Sparkles, Zap } from 'lucide-react';

interface TranslationToolProps {
  darkMode: boolean;
}

export const TranslationTool: React.FC<TranslationToolProps> = ({ darkMode }) => {
  const [sourceText, setSourceText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [sourceLang, setSourceLang] = useState('Auto');
  const [targetLang, setTargetLang] = useState('Hindi');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const languages = [
    { code: 'Auto', name: 'Auto Detect' },
    { code: 'Hindi', name: 'Hindi (हिंदी)' },
    { code: 'English', name: 'English' },
    { code: 'Urdu', name: 'Urdu (اردو)' },
    { code: 'Arabic', name: 'Arabic (العربية)' },
    { code: 'French', name: 'French (Français)' },
    { code: 'Spanish', name: 'Spanish (Español)' },
    { code: 'German', name: 'German (Deutsch)' },
    { code: 'Sanskrit', name: 'Sanskrit (संस्कृतम्)' }
  ];

  const handleSwap = () => {
    if (sourceLang !== 'Auto') {
      const temp = sourceLang;
      setSourceLang(targetLang);
      setTargetLang(temp);
      setSourceText(translatedText);
      setTranslatedText(sourceText);
    }
  };

  const handleTranslate = async () => {
    if (!sourceText.trim() || loading) return;

    setLoading(true);
    setTranslatedText('');

try {
        const res = await fetch('/api/ai/translate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: sourceText, sourceLang, targetLang }),
        });

        const rawText = await res.text();

        if (!res.ok) {
          setTranslatedText(`Error (${res.status}): ${rawText || 'Server error'}`);
          return;
        }

        if (!rawText.trim()) {
          setTranslatedText('Error: Server se khali response aaya');
          return;
        }

        const data = JSON.parse(rawText);
        if (data.success && data.translation) {
          setTranslatedText(data.translation);
        } else {
          setTranslatedText('Error: ' + (data.error || 'Translation failed'));
        }
      } catch (err: any) {
        setTranslatedText('Network error: ' + err.message);
      } finally {
        setLoading(false);
}
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(translatedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`min-h-screen py-12 transition-colors ${darkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto">
            <Languages className="w-6 h-6" />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight">Multilingual AI Translation Portal</h1>
          <p className={`text-sm sm:text-base ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
            Translate educational texts, essays, sentences, and notes between Hindi, English, Urdu, and other supported languages instantly.
          </p>
        </div>

        {/* Translation Box */}
        <div className={`p-6 sm:p-8 rounded-3xl border shadow-xl ${
          darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
        }`}>
          
          {/* Controls Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-inherit">
            <div className="flex items-center gap-3">
              <select
                value={sourceLang}
                onChange={(e) => setSourceLang(e.target.value)}
                className={`px-3 py-2 rounded-xl text-sm font-semibold border outline-none ${
                  darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-100 border-slate-300 text-slate-800'
                }`}
              >
                {languages.map(l => (
                  <option key={l.code} value={l.code}>{l.name}</option>
                ))}
              </select>

              <button
                onClick={handleSwap}
                className={`p-2 rounded-xl border transition-colors ${
                  darkMode ? 'border-slate-700 bg-slate-800 text-indigo-400 hover:bg-slate-700' : 'border-slate-200 bg-slate-100 text-indigo-600 hover:bg-slate-200'
                }`}
                title="Swap Languages"
              >
                <ArrowRightLeft className="w-4 h-4" />
              </button>

              <select
                value={targetLang}
                onChange={(e) => setTargetLang(e.target.value)}
                className={`px-3 py-2 rounded-xl text-sm font-semibold border outline-none ${
                  darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-100 border-slate-300 text-slate-800'
                }`}
              >
                {languages.filter(l => l.code !== 'Auto').map(l => (
                  <option key={l.code} value={l.code}>{l.name}</option>
                ))}
              </select>
            </div>

            <button
              onClick={() => { setSourceText(''); setTranslatedText(''); }}
              className="text-xs text-slate-500 hover:text-red-500 flex items-center gap-1 font-medium"
            >
              <Trash2 className="w-3.5 h-3.5" /> Clear All
            </button>
          </div>

          {/* Text Areas Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Source Input */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Source Text</label>
              <textarea
                rows={6}
                value={sourceText}
                onChange={(e) => setSourceText(e.target.value)}
                placeholder="Enter text to translate..."
                className={`w-full p-4 rounded-2xl text-sm border outline-none resize-none ${
                  darkMode ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-400' : 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-500'
                }`}
              />
            </div>

            {/* Translated Output */}
            <div className="space-y-2 relative">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">Translated Output</label>
                {translatedText && (
                  <button
                    onClick={handleCopy}
                    className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold flex items-center gap-1 hover:underline"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                    {copied ? 'Copied' : 'Copy'}
                  </button>
                )}
              </div>
              <div className={`w-full h-36 p-4 rounded-2xl text-sm border overflow-y-auto whitespace-pre-line ${
                darkMode ? 'bg-slate-800/80 border-slate-700 text-indigo-100' : 'bg-indigo-50/50 border-slate-300 text-indigo-950'
              }`}>
                {loading ? (
                  <span className="flex items-center gap-2 text-slate-400">
                    <Zap className="w-4 h-4 animate-spin text-indigo-500" /> Translating...
                  </span>
                ) : (
                  translatedText || 'Translation will appear here...'
                )}
              </div>
            </div>

          </div>

          {/* Action Button */}
          <div className="mt-6 flex justify-end">
            <button
              onClick={handleTranslate}
              disabled={loading || !sourceText.trim()}
              className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-semibold text-sm shadow-lg shadow-indigo-600/30 hover:opacity-95 flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4" /> Translate Now
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
