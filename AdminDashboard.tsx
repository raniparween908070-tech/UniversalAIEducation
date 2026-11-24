import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  Lock, 
  Settings, 
  FileText, 
  BookOpen, 
  HelpCircle, 
  Award, 
  Mail, 
  Save, 
  Trash2, 
  Plus, 
  Check, 
  LogOut,
  Globe,
  LayoutDashboard
} from 'lucide-react';
import { SiteSettings, Category, QuestionItem, QuizItem, ContactMessage, PageContent } from '../types';

interface AdminDashboardProps {
  darkMode: boolean;
  onSettingsUpdate: (newSettings: SiteSettings) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ darkMode, onSettingsUpdate }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<'settings' | 'pages' | 'categories' | 'questions' | 'quiz' | 'messages'>('settings');

  // Data states
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [pages, setPages] = useState<Record<string, PageContent>>({});
  const [selectedPageSlug, setSelectedPageSlug] = useState('about');
  const [categories, setCategories] = useState<Category[]>([]);
  const [questions, setQuestions] = useState<QuestionItem[]>([]);
  const [quizList, setQuizList] = useState<QuizItem[]>([]);
  const [messages, setMessages] = useState<ContactMessage[]>([]);

  // Form editing states
  const [pageEditor, setPageEditor] = useState<PageContent>({ title: '', metaDescription: '', content: '' });
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // New question form
  const [newQ, setNewQ] = useState({ category: 'gk', question: '', answer: '' });

  // New category form
  const [newCat, setNewCat] = useState({ name: '', description: '', icon: 'Globe' });

  useEffect(() => {
    const token = localStorage.getItem('gyan_admin_token');
    if (token) {
      setIsAuthenticated(true);
      fetchAllData();
    }
  }, []);

  const fetchAllData = () => {
    fetch('/api/settings').then(res => res.json()).then(data => setSettings(data));
    fetch('/api/pages').then(res => res.json()).then(data => {
      setPages(data);
      if (data['about']) setPageEditor(data['about']);
    });
    fetch('/api/categories').then(res => res.json()).then(data => setCategories(data));
    fetch('/api/questions').then(res => res.json()).then(data => setQuestions(data));
    fetch('/api/quiz').then(res => res.json()).then(data => setQuizList(data));
    fetch('/api/contact').then(res => res.json()).then(data => setMessages(data));
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      if (data.success) {
        localStorage.setItem('gyan_admin_token', data.token);
        setIsAuthenticated(true);
        fetchAllData();
      } else {
        setLoginError(data.error || 'Invalid credentials');
      }
    } catch (err: any) {
      setLoginError('Login failed: ' + err.message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('gyan_admin_token');
    setIsAuthenticated(false);
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;
    const res = await fetch('/api/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings)
    });
    const data = await res.json();
    if (data.success) {
      onSettingsUpdate(data.settings);
      showSuccess('Settings updated successfully!');
    }
  };

  const handleSavePage = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch(`/api/pages/${selectedPageSlug}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(pageEditor)
    });
    const data = await res.json();
    if (data.success) {
      setPages({ ...pages, [selectedPageSlug]: data.page });
      showSuccess('Page updated successfully!');
    }
  };

  const handleAddQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQ.question || !newQ.answer) return;
    const res = await fetch('/api/questions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newQ)
    });
    const data = await res.json();
    if (data.success) {
      setQuestions([...questions, data.question]);
      setNewQ({ category: 'gk', question: '', answer: '' });
      showSuccess('Question added successfully!');
    }
  };

  const handleDeleteQuestion = async (id: number) => {
    const res = await fetch(`/api/questions/${id}`, { method: 'DELETE' });
    if (res.ok) {
      setQuestions(questions.filter(q => q.id !== id));
      showSuccess('Question deleted.');
    }
  };

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCat.name) return;
    const res = await fetch('/api/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newCat)
    });
    const data = await res.json();
    if (data.success) {
      setCategories([...categories, data.category]);
      setNewCat({ name: '', description: '', icon: 'Globe' });
      showSuccess('Category added successfully!');
    }
  };

  const handleDeleteCategory = async (id: string) => {
    const res = await fetch(`/api/categories/${id}`, { method: 'DELETE' });
    if (res.ok) {
      setCategories(categories.filter(c => c.id !== id));
      showSuccess('Category deleted.');
    }
  };

  const handleDeleteMessage = async (id: number) => {
    const res = await fetch(`/api/contact/${id}`, { method: 'DELETE' });
    if (res.ok) {
      setMessages(messages.filter(m => m.id !== id));
      showSuccess('Message deleted.');
    }
  };

  const showSuccess = (msg: string) => {
    setSuccessMessage(msg);
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  if (!isAuthenticated) {
    return (
      <div className={`min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 ${
        darkMode ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'
      }`}>
        <div className={`max-w-md w-full p-8 rounded-3xl border shadow-2xl ${
          darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
        }`}>
          <div className="text-center space-y-3 mb-8">
            <div className="w-14 h-14 rounded-2xl bg-indigo-600/10 text-indigo-600 flex items-center justify-center mx-auto shadow-lg">
              <Shield className="w-7 h-7" />
            </div>
            <h1 className="text-2xl font-extrabold">Admin Login</h1>
            <p className="text-xs text-slate-400">Default Credentials: admin / admin123</p>
          </div>

          {loginError && (
            <div className="mb-6 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs">
              {loginError}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase text-slate-400">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin"
                className={`w-full px-4 py-3 rounded-xl text-sm border outline-none ${
                  darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                }`}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase text-slate-400">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="admin123"
                className={`w-full px-4 py-3 rounded-xl text-sm border outline-none ${
                  darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                }`}
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-indigo-600 text-white font-semibold text-sm shadow-lg hover:bg-indigo-700 transition-colors cursor-pointer"
            >
              Login to Admin Portal
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen py-10 transition-colors ${darkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Top Header */}
        <div className={`p-6 rounded-3xl border flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm ${
          darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
        }`}>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-indigo-600/10 text-indigo-600 flex items-center justify-center">
              <LayoutDashboard className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold">Website Admin Dashboard</h1>
              <p className="text-xs text-slate-400">Manage content, pages, questions, categories, and user messages.</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-500/10 text-red-500 font-semibold text-sm hover:bg-red-500/20 transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>

        {/* Success Alert */}
        {successMessage && (
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center gap-2 text-sm animate-fadeIn">
            <Check className="w-5 h-5" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 border-b pb-4 border-inherit">
          {[
            { id: 'settings', name: 'Home & Settings', icon: Settings },
            { id: 'pages', name: 'Pages Editor', icon: FileText },
            { id: 'categories', name: 'Categories', icon: BookOpen },
            { id: 'questions', name: 'Questions Bank', icon: HelpCircle },
            { id: 'quiz', name: 'Quiz Center', icon: Award },
            { id: 'messages', name: `Inquiries (${messages.length})`, icon: Mail }
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                  activeTab === tab.id
                    ? 'bg-indigo-600 text-white shadow-md'
                    : darkMode ? 'bg-slate-900 text-slate-300 hover:bg-slate-800' : 'bg-white text-slate-700 border hover:bg-slate-100'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.name}
              </button>
            );
          })}
        </div>

        {/* TAB 1: Settings */}
        {activeTab === 'settings' && settings && (
          <div className={`p-8 rounded-3xl border shadow-xl ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
            <h2 className="text-xl font-bold mb-6">Website General Settings & Home Content</h2>
            <form onSubmit={handleSaveSettings} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase text-slate-400">Site Name / Logo Text</label>
                  <input
                    type="text"
                    value={settings.logoText}
                    onChange={(e) => setSettings({ ...settings, logoText: e.target.value })}
                    className={`w-full px-4 py-3 rounded-xl text-sm border outline-none ${darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-300'}`}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase text-slate-400">Contact Email</label>
                  <input
                    type="email"
                    value={settings.contactEmail}
                    onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
                    className={`w-full px-4 py-3 rounded-xl text-sm border outline-none ${darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-300'}`}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-slate-400">Tagline / Subtitle</label>
                <input
                  type="text"
                  value={settings.tagline}
                  onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
                  className={`w-full px-4 py-3 rounded-xl text-sm border outline-none ${darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-300'}`}
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-slate-400">Hero Heading</label>
                <input
                  type="text"
                  value={settings.heroHeading}
                  onChange={(e) => setSettings({ ...settings, heroHeading: e.target.value })}
                  className={`w-full px-4 py-3 rounded-xl text-sm border outline-none ${darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-300'}`}
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-slate-400">Hero Description</label>
                <textarea
                  rows={3}
                  value={settings.heroDescription}
                  onChange={(e) => setSettings({ ...settings, heroDescription: e.target.value })}
                  className={`w-full p-4 rounded-xl text-sm border outline-none resize-none ${darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-300'}`}
                />
              </div>

              <button
                type="submit"
                className="px-6 py-3.5 rounded-xl bg-indigo-600 text-white font-semibold text-sm hover:bg-indigo-700 flex items-center gap-2 cursor-pointer shadow-lg"
              >
                <Save className="w-4 h-4" /> Save Settings
              </button>
            </form>
          </div>
        )}

        {/* TAB 2: Pages Editor */}
        {activeTab === 'pages' && (
          <div className={`p-8 rounded-3xl border shadow-xl ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
              <h2 className="text-xl font-bold">Dynamic Pages Editor (Legal & Info)</h2>
              <select
                value={selectedPageSlug}
                onChange={(e) => {
                  const slug = e.target.value;
                  setSelectedPageSlug(slug);
                  if (pages[slug]) setPageEditor(pages[slug]);
                }}
                className={`px-4 py-2.5 rounded-xl text-sm font-semibold border outline-none ${
                  darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-100 border-slate-300 text-slate-800'
                }`}
              >
                <option value="about">About Us</option>
                <option value="privacy">Privacy Policy</option>
                <option value="disclaimer">Disclaimer</option>
                <option value="terms">Terms & Conditions</option>
                <option value="faq">FAQ</option>
              </select>
            </div>

            <form onSubmit={handleSavePage} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-slate-400">SEO Page Title</label>
                <input
                  type="text"
                  value={pageEditor.title}
                  onChange={(e) => setPageEditor({ ...pageEditor, title: e.target.value })}
                  className={`w-full px-4 py-3 rounded-xl text-sm border outline-none ${darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-300'}`}
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-slate-400">Meta Description</label>
                <input
                  type="text"
                  value={pageEditor.metaDescription}
                  onChange={(e) => setPageEditor({ ...pageEditor, metaDescription: e.target.value })}
                  className={`w-full px-4 py-3 rounded-xl text-sm border outline-none ${darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-300'}`}
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-slate-400">Page HTML / Rich Content</label>
                <textarea
                  rows={10}
                  value={pageEditor.content}
                  onChange={(e) => setPageEditor({ ...pageEditor, content: e.target.value })}
                  className={`w-full p-4 rounded-xl text-sm font-mono border outline-none ${darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-300'}`}
                />
              </div>

              <button
                type="submit"
                className="px-6 py-3.5 rounded-xl bg-indigo-600 text-white font-semibold text-sm hover:bg-indigo-700 flex items-center gap-2 cursor-pointer shadow-lg"
              >
                <Save className="w-4 h-4" /> Update & Save Page
              </button>
            </form>
          </div>
        )}

        {/* TAB 3: Categories */}
        {activeTab === 'categories' && (
          <div className="space-y-8">
            <div className={`p-8 rounded-3xl border shadow-xl ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
              <h2 className="text-xl font-bold mb-6">Add New Category</h2>
              <form onSubmit={handleAddCategory} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Category Name"
                    value={newCat.name}
                    onChange={(e) => setNewCat({ ...newCat, name: e.target.value })}
                    className={`px-4 py-3 rounded-xl text-sm border outline-none ${darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-300'}`}
                  />
                  <input
                    type="text"
                    placeholder="Description"
                    value={newCat.description}
                    onChange={(e) => setNewCat({ ...newCat, description: e.target.value })}
                    className={`px-4 py-3 rounded-xl text-sm border outline-none ${darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-300'}`}
                  />
                </div>
                <button
                  type="submit"
                  className="px-6 py-3 rounded-xl bg-indigo-600 text-white font-semibold text-sm hover:bg-indigo-700 flex items-center gap-2 cursor-pointer"
                >
                  <Plus className="w-4 h-4" /> Add Category
                </button>
              </form>
            </div>

            <div className={`p-8 rounded-3xl border shadow-xl ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
              <h2 className="text-xl font-bold mb-4">Existing Categories ({categories.length})</h2>
              <div className="space-y-3">
                {categories.map(c => (
                  <div key={c.id} className={`p-4 rounded-2xl border flex items-center justify-between ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
                    <div>
                      <h3 className="font-bold">{c.name}</h3>
                      <p className="text-xs text-slate-400">{c.description}</p>
                    </div>
                    <button
                      onClick={() => handleDeleteCategory(c.id)}
                      className="p-2 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500/20"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: Questions Bank */}
        {activeTab === 'questions' && (
          <div className="space-y-8">
            <div className={`p-8 rounded-3xl border shadow-xl ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
              <h2 className="text-xl font-bold mb-6">Add Knowledge Question</h2>
              <form onSubmit={handleAddQuestion} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Category ID (e.g. gk, science, math)"
                    value={newQ.category}
                    onChange={(e) => setNewQ({ ...newQ, category: e.target.value })}
                    className={`px-4 py-3 rounded-xl text-sm border outline-none ${darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-300'}`}
                  />
                  <input
                    type="text"
                    placeholder="Question"
                    value={newQ.question}
                    onChange={(e) => setNewQ({ ...newQ, question: e.target.value })}
                    className={`px-4 py-3 rounded-xl text-sm border outline-none ${darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-300'}`}
                  />
                </div>
                <textarea
                  rows={3}
                  placeholder="Answer"
                  value={newQ.answer}
                  onChange={(e) => setNewQ({ ...newQ, answer: e.target.value })}
                  className={`w-full p-4 rounded-xl text-sm border outline-none resize-none ${darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-300'}`}
                />
                <button
                  type="submit"
                  className="px-6 py-3 rounded-xl bg-indigo-600 text-white font-semibold text-sm hover:bg-indigo-700 flex items-center gap-2 cursor-pointer"
                >
                  <Plus className="w-4 h-4" /> Add Question
                </button>
              </form>
            </div>

            <div className={`p-8 rounded-3xl border shadow-xl ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
              <h2 className="text-xl font-bold mb-4">Questions Bank ({questions.length})</h2>
              <div className="space-y-3">
                {questions.map(q => (
                  <div key={q.id} className={`p-4 rounded-2xl border flex items-start justify-between gap-4 ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
                    <div>
                      <span className="text-xs font-bold text-indigo-400 uppercase">{q.category}</span>
                      <h3 className="font-bold text-base mt-1">{q.question}</h3>
                      <p className="text-sm text-slate-400 mt-1">{q.answer}</p>
                    </div>
                    <button
                      onClick={() => handleDeleteQuestion(q.id)}
                      className="p-2 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500/20 shrink-0"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: Quiz Center */}
        {activeTab === 'quiz' && (
          <div className={`p-8 rounded-3xl border shadow-xl ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
            <h2 className="text-xl font-bold mb-4">Quiz Questions Bank ({quizList.length})</h2>
            <p className="text-sm text-slate-400 mb-6">Manage interactive quiz questions and correct options.</p>
            <div className="space-y-4">
              {quizList.map(qz => (
                <div key={qz.id} className={`p-4 rounded-2xl border ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
                  <h3 className="font-bold">{qz.question}</h3>
                  <div className="grid grid-cols-2 gap-2 mt-2 text-xs">
                    {qz.options.map((opt, i) => (
                      <span key={i} className={`p-2 rounded border ${i === qz.correct ? 'border-emerald-500 text-emerald-400 font-bold' : darkMode ? 'border-slate-700' : 'border-slate-300'}`}>
                        {String.fromCharCode(65 + i)}: {opt}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 6: Contact Messages */}
        {activeTab === 'messages' && (
          <div className={`p-8 rounded-3xl border shadow-xl ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
            <h2 className="text-xl font-bold mb-6">User Contact Messages ({messages.length})</h2>
            {messages.length === 0 ? (
              <p className="text-sm text-slate-400">No messages in inbox.</p>
            ) : (
              <div className="space-y-4">
                {messages.map(m => (
                  <div key={m.id} className={`p-5 rounded-2xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-base">{m.name}</span>
                        <span className="text-xs text-indigo-400">({m.email})</span>
                        <span className="text-[10px] text-slate-400">{m.date}</span>
                      </div>
                      <h4 className="font-semibold text-sm text-indigo-300">Subject: {m.subject}</h4>
                      <p className="text-sm text-slate-300">{m.message}</p>
                    </div>
                    <button
                      onClick={() => handleDeleteMessage(m.id)}
                      className="p-2.5 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500/20 shrink-0"
                      title="Delete Message"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};
