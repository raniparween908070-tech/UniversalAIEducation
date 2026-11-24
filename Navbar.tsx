import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Brain, 
  MessageSquare, 
  BookOpen, 
  Languages, 
  Award, 
  Globe, 
  Mail, 
  Shield, 
  Menu, 
  X, 
  Sun, 
  Moon,
  Sparkles
} from 'lucide-react';
import { SiteSettings } from '../types';

interface NavbarProps {
  settings: SiteSettings;
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ settings, darkMode, setDarkMode }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: 'Home', path: '/', icon: Globe },
    { name: 'AI Chat', path: '/chat', icon: MessageSquare },
    { name: 'Categories', path: '/categories', icon: BookOpen },
    { name: 'Translation', path: '/translate', icon: Languages },
    { name: 'Quiz', path: '/quiz', icon: Award },
    { name: 'GK Hub', path: '/gk', icon: Sparkles },
    { name: 'Contact', path: '/contact', icon: Mail },
    { name: 'Admin', path: '/admin', icon: Shield },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className={`sticky top-0 z-50 transition-colors duration-200 border-b ${
      darkMode ? 'bg-slate-900/95 border-slate-800 text-white' : 'bg-white/95 border-slate-200 text-slate-800'
    } backdrop-blur-md`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Brand */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/30 group-hover:scale-105 transition-transform">
              <Brain className="w-6 h-6" />
            </div>
            <div>
              <span className="font-bold text-lg bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
                {settings.logoText || 'Gyan AI'}
              </span>
              <span className="block text-[10px] text-slate-400 font-medium tracking-wider uppercase">
                Universal Knowledge Portal
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    active 
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20' 
                      : darkMode 
                        ? 'text-slate-300 hover:bg-slate-800 hover:text-white' 
                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* Right Actions: Theme Toggle */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`p-2 rounded-xl border transition-colors ${
                darkMode 
                  ? 'border-slate-700 bg-slate-800 text-yellow-400 hover:bg-slate-700' 
                  : 'border-slate-200 bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
              title="Toggle Theme"
              aria-label="Toggle Theme"
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`lg:hidden p-2 rounded-xl border ${
                darkMode ? 'border-slate-700 bg-slate-800 text-white' : 'border-slate-200 bg-slate-100 text-slate-800'
              }`}
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className={`lg:hidden border-b px-4 pt-2 pb-4 space-y-1 ${
          darkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-800'
        }`}>
          {navLinks.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-base font-medium ${
                  active 
                    ? 'bg-indigo-600 text-white' 
                    : darkMode 
                      ? 'text-slate-300 hover:bg-slate-800 hover:text-white' 
                      : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <Icon className="w-5 h-5" />
                {item.name}
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
};
