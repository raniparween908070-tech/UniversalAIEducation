import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { PageContent } from '../types';
import { ShieldCheck, Sparkles } from 'lucide-react';

interface StaticPageProps {
  darkMode: boolean;
}

export const StaticPage: React.FC<StaticPageProps> = ({ darkMode }) => {
  const { slug } = useParams<{ slug: string }>();
  const [page, setPage] = useState<PageContent | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    fetch(`/api/pages/${slug}`)
      .then(res => {
        if (!res.ok) throw new Error('Page not found');
        return res.json();
      })
      .then(data => {
        setPage(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [slug]);

  if (loading) {
    return (
      <div className={`min-h-[calc(100vh-4rem)] flex items-center justify-center ${darkMode ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'}`}>
        Loading page content...
      </div>
    );
  }

  if (!page) {
    return (
      <div className={`min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center p-6 ${darkMode ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'}`}>
        <h1 className="text-2xl font-bold mb-2">Page Not Found</h1>
        <p className="text-sm text-slate-400">The requested page does not exist or has been removed.</p>
      </div>
    );
  }

  return (
    <div className={`min-h-screen py-16 transition-colors ${darkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        <div className="text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">{page.title}</h1>
          <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>{page.metaDescription}</p>
        </div>

        <div className={`p-8 sm:p-12 rounded-3xl border shadow-xl prose max-w-none ${
          darkMode ? 'bg-slate-900 border-slate-800 text-slate-200' : 'bg-white border-slate-200 text-slate-800'
        }`}>
          <div dangerouslySetInnerHTML={{ __html: page.content }} />
        </div>

      </div>
    </div>
  );
};
