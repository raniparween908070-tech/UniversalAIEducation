import React, { useState } from 'react';
import { Globe, Sparkles, BookOpen, Search, ArrowRight } from 'lucide-react';

interface GKSectionProps {
  darkMode: boolean;
}

export const GKSection: React.FC<GKSectionProps> = ({ darkMode }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const gkTopics = [
    { title: 'Indian Constitution & Polity', category: 'Indian GK', description: 'Fundamental rights, directive principles, president, parliament, and amendments.' },
    { title: 'World Geography & Rivers', category: 'World GK', description: 'Major mountain ranges, longest rivers, oceans, and continents.' },
    { title: 'Science & Physics Discoveries', category: 'Science GK', description: 'Laws of motion, electricity, periodic table elements, and space exploration.' },
    { title: 'Indian History & Freedom Struggle', category: 'History', description: 'Mughal empire, British rule, 1857 revolt, Mahatma Gandhi, and independence leaders.' },
    { title: 'Computer & Information Technology', category: 'Computer GK', description: 'Hardware, software, operating systems, internet protocols, and cybersecurity.' },
    { title: 'Current Affairs 2026', category: 'Current Affairs', description: 'Latest global events, scientific milestones, sports tournaments, and economic updates.' }
  ];

  const filteredTopics = gkTopics.filter(t => 
    t.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    t.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={`min-h-screen py-12 transition-colors ${darkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto">
            <Globe className="w-6 h-6" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">General Knowledge (GK) Hub</h1>
          <p className={`text-sm sm:text-base ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
            Master essential GK topics for competitive exams, school knowledge, and intellectual growth.
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-xl mx-auto">
          <div className={`flex items-center gap-2 px-4 py-3 rounded-2xl border shadow-sm ${
            darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
          }`}>
            <Search className="w-5 h-5 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search GK topics (e.g., Constitution, Rivers, Computer)..."
              className="w-full bg-transparent outline-none text-sm"
            />
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTopics.map((topic, idx) => (
            <div
              key={idx}
              className={`p-6 rounded-3xl border transition-all hover:-translate-y-1 hover:shadow-xl flex flex-col justify-between ${
                darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
              }`}
            >
              <div>
                <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 mb-4 border border-indigo-500/20">
                  {topic.category}
                </span>
                <h3 className="text-xl font-bold mb-3">{topic.title}</h3>
                <p className={`text-sm leading-relaxed mb-6 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                  {topic.description}
                </p>
              </div>

              <a
                href="/chat"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                Ask AI about this topic <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};
