import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2, AlertCircle } from 'lucide-react';
import { SiteSettings } from '../types';

interface ContactPageProps {
  settings: SiteSettings;
  darkMode: boolean;
}

export const ContactPage: React.FC<ContactPageProps> = ({ settings, darkMode }) => {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      setErrorMsg('Please fill in all required fields.');
      return;
    }

    setLoading(true);
    setSuccessMsg(null);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (data.success) {
        setSuccessMsg('Your message has been sent successfully! Our admin team will review it shortly.');
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        setErrorMsg(data.error || 'Failed to send message.');
      }
    } catch (err: any) {
      setErrorMsg('Network error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen py-12 transition-colors ${darkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto">
            <Mail className="w-6 h-6" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">Contact Us</h1>
          <p className={`text-sm sm:text-base ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
            Have questions, feedback, or inquiries regarding Gyan AI Portal? Send us a message below.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Contact Info Cards */}
          <div className="space-y-6">
            
            <div className={`p-6 rounded-3xl border flex items-start gap-4 ${
              darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
            }`}>
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center shrink-0">
                <MapPin className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-base mb-1">Our Location</h3>
                <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                  {settings.contactAddress || 'Knowledge Tower, Cyber City, New Delhi, India'}
                </p>
              </div>
            </div>

            <div className={`p-6 rounded-3xl border flex items-start gap-4 ${
              darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
            }`}>
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center shrink-0">
                <Mail className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-base mb-1">Email Us</h3>
                <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                  {settings.contactEmail || 'support@gyanai.edu'}
                </p>
              </div>
            </div>

            <div className={`p-6 rounded-3xl border flex items-start gap-4 ${
              darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
            }`}>
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center shrink-0">
                <Phone className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-base mb-1">Call Us</h3>
                <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                  {settings.contactPhone || '+91 98765 43210'}
                </p>
              </div>
            </div>

          </div>

          {/* Contact Form */}
          <div className={`lg:col-span-2 p-8 rounded-3xl border shadow-xl ${
            darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
          }`}>
            
            {successMsg && (
              <div className="mb-6 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center gap-3 text-sm">
                <CheckCircle2 className="w-5 h-5 shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            {errorMsg && (
              <div className="mb-6 p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400 flex items-center gap-3 text-sm">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold">Your Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter your full name"
                    className={`w-full px-4 py-3.5 rounded-xl text-sm border outline-none ${
                      darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                    }`}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold">Your Email *</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="Enter your email address"
                    className={`w-full px-4 py-3.5 rounded-xl text-sm border outline-none ${
                      darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                    }`}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold">Subject</label>
                <input
                  type="text"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  placeholder="Subject of your message"
                  className={`w-full px-4 py-3.5 rounded-xl text-sm border outline-none ${
                    darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                  }`}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold">Message *</label>
                <textarea
                  rows={5}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Write your message here..."
                  className={`w-full p-4 rounded-xl text-sm border outline-none resize-none ${
                    darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                  }`}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-semibold text-sm shadow-lg shadow-indigo-600/30 hover:opacity-95 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
              >
                <Send className="w-4 h-4" /> {loading ? 'Sending Message...' : 'Submit Message'}
              </button>
            </form>

          </div>

        </div>

      </div>
    </div>
  );
};
