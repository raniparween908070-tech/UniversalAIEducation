import React from 'react';
import { Link } from 'react-router-dom';
import { Brain, Mail, Phone, MapPin, Heart, Globe, ArrowRight } from 'lucide-react';
import { SiteSettings } from '../types';

interface FooterProps {
  settings: SiteSettings;
  darkMode: boolean;
}

export const Footer: React.FC<FooterProps> = ({ settings, darkMode }) => {
  return (
    <footer className={`border-t transition-colors ${
      darkMode ? 'bg-slate-950 border-slate-800 text-slate-300' : 'bg-slate-900 border-slate-800 text-slate-300'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          
          {/* Column 1: Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-lg">
                <Brain className="w-6 h-6" />
              </div>
              <span className="font-bold text-xl text-white">
                {settings.logoText || 'Gyan AI'}
              </span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              {settings.tagline || 'Universal AI Education & Knowledge Portal for students, researchers, and lifelong learners in any language.'}
            </p>
            <div className="flex items-center gap-3 pt-2 text-slate-400">
              <span className="text-xs bg-indigo-950 text-indigo-300 px-2.5 py-1 rounded-full border border-indigo-800">
                Cloudflare Workers AI
              </span>
              <span className="text-xs bg-violet-950 text-violet-300 px-2.5 py-1 rounded-full border border-violet-800">
                Llama 3.1 8B FP8
              </span>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="text-white font-semibold text-base mb-4 flex items-center gap-2">
              <Globe className="w-4 h-4 text-indigo-400" />
              Quick Portals
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/chat" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <ArrowRight className="w-3.5 h-3.5 text-indigo-400" /> Universal AI Chat
                </Link>
              </li>
              <li>
                <Link to="/categories" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <ArrowRight className="w-3.5 h-3.5 text-indigo-400" /> Education Categories
                </Link>
              </li>
              <li>
                <Link to="/translate" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <ArrowRight className="w-3.5 h-3.5 text-indigo-400" /> Multilingual Translation
                </Link>
              </li>
              <li>
                <Link to="/quiz" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <ArrowRight className="w-3.5 h-3.5 text-indigo-400" /> GK Quiz Center
                </Link>
              </li>
              <li>
                <Link to="/gk" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <ArrowRight className="w-3.5 h-3.5 text-indigo-400" /> General Knowledge Hub
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Legal & Help */}
          <div>
            <h3 className="text-white font-semibold text-base mb-4">Legal & Information</h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/page/about" className="hover:text-white transition-colors">About Us</Link>
              </li>
              <li>
                <Link to="/page/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
              </li>
              <li>
                <Link to="/page/disclaimer" className="hover:text-white transition-colors">Disclaimer</Link>
              </li>
              <li>
                <Link to="/page/terms" className="hover:text-white transition-colors">Terms & Conditions</Link>
              </li>
              <li>
                <Link to="/page/faq" className="hover:text-white transition-colors">FAQ & Support</Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white transition-colors">Contact Us</Link>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>{settings.footerText || '© 2026 Gyan AI Portal. All rights reserved.'}</p>
          <div className="flex items-center gap-1">
            <span>Crafted with</span>
            <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" />
            <span>for Universal Education & Knowledge</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
