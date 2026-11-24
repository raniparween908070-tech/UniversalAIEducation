import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { PageContent } from '../types';
import { ShieldCheck } from 'lucide-react';

interface StaticPageProps {
  darkMode: boolean;
}

const FALLBACK_PAGES: Record<string, { title: string; subtitle: string; content: string }> = {
  about: {
    title: 'About Us',
    subtitle: 'Universal AI Education & Knowledge Portal',
    content: `
      <p>Welcome to <strong>Universal AI Education</strong>! Our platform is built to make learning, translation, quizzes, and knowledge exploration simple, accessible, and interactive for students and curious minds.</p>
      <h3>What We Offer</h3>
      <ul>
        <li><strong>AI Chat &amp; Knowledge Assistance:</strong> Ask questions across subjects and topics to understand concepts clearly.</li>
        <li><strong>Quizzes &amp; GK Practice:</strong> Test your knowledge and build exam readiness with interactive practice sections.</li>
        <li><strong>Multilingual Translation &amp; Categories:</strong> Explore structured categories and translate text easily.</li>
      </ul>
      <p>Our goal is to provide helpful educational tools in a clean and user-friendly interface.</p>
    `,
  },
  privacy: {
    title: 'Privacy Policy',
    subtitle: 'How we handle information on Universal AI Education',
    content: `
      <p>Your privacy matters to us. This Privacy Policy explains how <strong>Universal AI Education</strong> handles information when you visit our website.</p>
      <h3>Information We Collect</h3>
      <p>We do not require unnecessary personal registration just to browse our educational tools. Basic technical details (such as browser type, device type, and general usage patterns) may be processed to keep the site fast, secure, and functional.</p>
      <h3>Cookies &amp; Advertising</h3>
      <p>We or third-party service providers (including analytics or advertising partners such as Google AdSense in the future) may use cookies or similar technologies to improve site performance, remember preferences, and serve relevant ads according to applicable policies.</p>
      <p>You can manage or disable cookies anytime through your browser settings.</p>
    `,
  },
  disclaimer: {
    title: 'Disclaimer',
    subtitle: 'Important information regarding AI outputs and educational content',
    content: `
      <p>The tools, quizzes, translations, and AI-generated responses on <strong>Universal AI Education</strong> are provided for general educational and informational purposes only.</p>
      <h3>AI Accuracy Notice</h3>
      <p>AI systems can occasionally generate incomplete, outdated, or inaccurate information. Please double-check important facts, study materials, exam details, or translations from official and reliable sources before making decisions.</p>
      <p>We are not liable for any loss or reliance placed solely on automated responses without independent verification.</p>
    `,
  },
  terms: {
    title: 'Terms & Conditions',
    subtitle: 'Guidelines for using Universal AI Education',
    content: `
      <p>By accessing and using <strong>Universal AI Education</strong>, you agree to use the platform responsibly and lawfully.</p>
      <ul>
        <li>Use educational tools, quizzes, and chat features for lawful personal learning and reference.</li>
        <li>Do not attempt to disrupt, abuse, scrape excessively, or compromise the availability or security of the website.</li>
        <li>Site features, layouts, and policies may be updated from time to time without prior notice.</li>
      </ul>
    `,
  },
  faq: {
    title: 'FAQ & Support',
    subtitle: 'Common questions about using the platform',
    content: `
      <h3>Is this platform free to use?</h3>
      <p>Yes, our core AI learning tools, categories, translator, and quiz features are available for users to explore.</p>
      <h3>Can I rely 100% on AI answers for exams?</h3>
      <p>AI is great for quick explanations and practice, but always verify key facts and syllabus details with official textbooks or teachers.</p>
      <h3>How can I reach out for feedback or support?</h3>
      <p>You can visit our Contact page or reach out via our support email listed on the site.</p>
    `,
  },
};

export const StaticPage: React.FC<StaticPageProps> = ({ darkMode }) => {
  const { slug } = useParams<{ slug: string }>();
  const [page, setPage] = useState<PageContent | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cleanSlug = (slug || '').toLowerCase();
    const fallback = FALLBACK_PAGES[cleanSlug];

    if (!cleanSlug) {
      setPage(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    fetch(`/api/pages/${cleanSlug}`)
      .then((res) => {
        if (!res.ok) throw new Error('Page not found');
        return res.json();
      })
      .then((data) => {
        if (data && (data.title || data.content)) {
          setPage(data);
        } else if (fallback) {
          setPage({
            title: fallback.title,
            subtitle: fallback.subtitle,
            content: fallback.content,
          } as PageContent);
        } else {
          setPage(null);
        }
        setLoading(false);
      })
      .catch(() => {
        if (fallback) {
          setPage({
            title: fallback.title,
            subtitle: fallback.subtitle,
            content: fallback.content,
          } as PageContent);
        } else {
          setPage(null);
        }
        setLoading(false);
      });
  }, [slug]);

  if (loading) {
    return (
      <div
        className={`min-h-[calc(100vh-4rem)] flex items-center justify-center ${
          darkMode ? 'bg-slate-950 text-slate-300' : 'bg-slate-50 text-slate-700'
        }`}
      >
        Loading page content...
      </div>
    );
  }

  if (!page) {
    return (
      <div
        className={`min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center px-4 text-center ${
          darkMode ? 'bg-slate-950 text-slate-200' : 'bg-slate-50 text-slate-800'
        }`}
      >
        <h1 className="text-2xl font-bold mb-2">Page Not Found</h1>
        <p className="text-sm text-slate-400">
          The requested page does not exist or has been removed.
        </p>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen py-16 transition-colors ${
        darkMode ? 'bg-slate-950 text-slate-200' : 'bg-slate-50 text-slate-800'
      }`}
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-3">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-indigo-600/10 text-indigo-600 flex items-center justify-center">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            {page.title}
          </h1>
          {page.subtitle && (
            <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
              {page.subtitle}
            </p>
          )}
        </div>

        <div
          className={`p-8 sm:p-12 rounded-3xl border shadow-xl prose max-w-none ${
            darkMode
              ? 'bg-slate-900 border-slate-800 text-slate-200'
              : 'bg-white border-slate-200 text-slate-800'
          }`}
        >
          <div dangerouslySetInnerHTML={{ __html: page.content }} />
        </div>
      </div>
    </div>
  );
};
