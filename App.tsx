import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { UniversalChat } from './pages/UniversalChat';
import { Categories } from './pages/Categories';
import { TranslationTool } from './pages/TranslationTool';
import { QuizPage } from './pages/QuizPage';
import { GKSection } from './pages/GKSection';
import { ContactPage } from './pages/ContactPage';
import { StaticPage } from './pages/StaticPage';
import { AdminDashboard } from './pages/AdminDashboard';
import { SiteSettings } from './types';

export default function App() {
  const [darkMode, setDarkMode] = useState(true);
  const [settings, setSettings] = useState<SiteSettings>({
    siteName: 'Gyan AI - Universal AI Education & Knowledge Portal',
    tagline: 'Ask any question on any subject, language, or topic. Powered by Cloudflare AI & Advanced Knowledge Systems.',
    heroHeading: 'Discover Knowledge & AI Solutions for Any Subject',
    heroDescription: 'From Science, Mathematics, and Coding to Translation, Grammar, and General Knowledge. Ask anything in Hindi, English, Urdu, or any language.',
    logoText: 'Gyan AI 🧠',
    footerText: '© 2026 Gyan AI Portal. All rights reserved. Built for Universal Education & Knowledge Sharing.',
    contactEmail: 'support@gyanai.edu',
    contactPhone: '+91 98765 43210',
    contactAddress: 'Knowledge Tower, Cyber City, New Delhi, India',
    socialLinks: {
      facebook: 'https://facebook.com',
      twitter: 'https://twitter.com',
      youtube: 'https://youtube.com',
      telegram: 'https://telegram.org'
    }
  });

  useEffect(() => {
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => {
        if (data && data.siteName) {
          setSettings(data);
        }
      })
      .catch(err => console.error('Failed to load settings:', err));
  }, []);

  return (
    <BrowserRouter>
      <div className={`min-h-screen flex flex-col font-sans ${darkMode ? 'dark bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
        <Navbar settings={settings} darkMode={darkMode} setDarkMode={setDarkMode} />
        
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home settings={settings} darkMode={darkMode} />} />
            <Route path="/chat" element={<UniversalChat darkMode={darkMode} />} />
            <Route path="/categories" element={<Categories darkMode={darkMode} />} />
            <Route path="/translate" element={<TranslationTool darkMode={darkMode} />} />
            <Route path="/quiz" element={<QuizPage darkMode={darkMode} />} />
            <Route path="/gk" element={<GKSection darkMode={darkMode} />} />
            <Route path="/contact" element={<ContactPage settings={settings} darkMode={darkMode} />} />
            <Route path="/page/:slug" element={<StaticPage darkMode={darkMode} />} />
            <Route path="/admin" element={<AdminDashboard darkMode={darkMode} onSettingsUpdate={setSettings} />} />
          </Routes>
        </main>

        <Footer settings={settings} darkMode={darkMode} />
      </div>
    </BrowserRouter>
  );
}
