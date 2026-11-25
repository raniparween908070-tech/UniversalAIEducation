import React, { useState } from 'react';
import { MessageSquare, Send, Copy, Check, Menu, Sun, Moon, Plus, Trash2 } from 'lucide-react';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface ChatSession {
  id: string;
  title: string;
  messages: ChatMessage[];
  updatedAt: string;
}

export interface UniversalChatProps {
  darkMode: boolean;
  onToggleDarkMode?: () => void;
}

const WORKER_URL = 'https://universal-chat-api.mdsabbir1254783.workers.dev';

export const UniversalChat: React.FC<UniversalChatProps> = ({ darkMode, onToggleDarkMode }) => {
  const [sessions, setSessions] = useState<ChatSession[]>([
    {
      id: 'session_' + Date.now(),
      title: 'New Knowledge Session',
      messages: [],
      updatedAt: new Date().toISOString(),
    },
  ]);
  const [currentSessionId, setCurrentSessionId] = useState<string>(sessions[0].id);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [subject, setSubject] = useState<string>('General');
  const [language, setLanguage] = useState<string>('Hindi');

  const handleNewChat = () => {
    const newId = 'session_' + Date.now();
    const newSession: ChatSession = {
      id: newId,
      title: 'New Knowledge Session',
      messages: [],
      updatedAt: new Date().toISOString(),
    };
    setSessions([newSession, ...sessions]);
    setCurrentSessionId(newId);
    setMessages([]);
    setSidebarOpen(false);
  };

  const handleSelectSession = (id: string) => {
    const found = sessions.find((s) => s.id === id);
    if (found) {
      setCurrentSessionId(found.id);
      setMessages(found.messages);
      setSidebarOpen(false);
    }
  };

  const handleDeleteSession = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const filtered = sessions.filter((s) => s.id !== id);
    if (filtered.length === 0) {
      const fallbackId = 'session_' + Date.now();
      const fallback: ChatSession = {
        id: fallbackId,
        title: 'New Knowledge Session',
        messages: [],
        updatedAt: new Date().toISOString(),
      };
      setSessions([fallback]);
      setCurrentSessionId(fallbackId);
      setMessages([]);
    } else {
      setSessions(filtered);
      if (currentSessionId === id) {
        setCurrentSessionId(filtered[0].id);
        setMessages(filtered[0].messages);
      }
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsgText = input.trim();
    setInput('');

    const userMessage: ChatMessage = {
      id: 'user_' + Date.now(),
      role: 'user',
      content: userMsgText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setLoading(true);

    // Update session title if first user prompt
    const sessionTitle = userMsgText.substring(0, 30) + '...';

    try {
      const res = await fetch(WORKER_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: userMsgText,
          subject,
          language,
        }),
      });

      const rawText = await res.text();
      let data: any;
      try {
        data = JSON.parse(rawText);
      } catch {
        throw new Error(`Invalid JSON (${res.status}): ${rawText.slice(0, 120)}`);
      }

      if (!res.ok) {
        throw new Error(data?.error || `HTTP ${res.status}`);
      }

      const assistantMessage: ChatMessage = {
        id: 'asst_' + Date.now(),
        role: 'assistant',
        content: data.success
          ? data.answer || data.response || 'No answer returned.'
          : 'Error: ' + (data.error || 'Failed to generate response'),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      const finalMessages = [...updatedMessages, assistantMessage];
      setMessages(finalMessages);

      setSessions(
        sessions.map((s) => {
          if (s.id === currentSessionId) {
            return {
              ...s,
              title:
                s.title === 'New Knowledge Session' || s.title === 'New Session'
                  ? sessionTitle
                  : s.title,
              messages: finalMessages,
              updatedAt: new Date().toISOString(),
            };
          }
          return s;
        })
      );
    } catch (err: any) {
      const errMsg: ChatMessage = {
        id: 'err_' + Date.now(),
        role: 'assistant',
        content: `Debug Error: ${err?.message || String(err)}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages([...updatedMessages, errMsg]);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div
      className={`min-h-[calc(100vh-4rem)] flex flex-col lg:flex-row transition-colors ${
        darkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'
      }`}
    >
      {/* Mobile Header Bar */}
      <div
        className={`lg:hidden flex items-center justify-between px-4 py-3 border-b ${
          darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
        }`}
      >
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-lg hover:bg-slate-800/10"
            aria-label="Toggle Menu"
          >
            <Menu className="w-5 h-5" />
          </button>
          <span className="font-bold">Gyan AI</span>
        </div>
        {onToggleDarkMode && (
          <button
            type="button"
            onClick={onToggleDarkMode}
            className="p-2 rounded-lg hover:bg-slate-800/10"
            aria-label="Toggle Theme"
          >
            {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        )}
      </div>

      {/* Sidebar: Chat History */}
      <aside
        className={`${
          sidebarOpen ? 'block' : 'hidden'
        } lg:flex w-full lg:w-80 border-r flex-col shrink-0 ${
          darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
        }`}
      >
        <div className="p-4 border-b border-inherit flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <h2 className="font-bold text-base">Chat History</h2>
          </div>
          <button
            type="button"
            onClick={handleNewChat}
            className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1.5 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700"
          >
            <Plus className="w-4 h-4" />
            New
          </button>
        </div>

        <div className="p-3 border-b border-inherit grid grid-cols-2 gap-2 text-xs">
          <select
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className={`px-2 py-1.5 rounded border ${
              darkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-300'
            }`}
          >
            <option value="General">General</option>
            <option value="Math">Math</option>
            <option value="Science">Science</option>
            <option value="Coding">Coding</option>
          </select>

          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className={`px-2 py-1.5 rounded border ${
              darkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-300'
            }`}
          >
            <option value="Hindi">Hindi</option>
            <option value="English">English</option>
            <option value="Hinglish">Hinglish</option>
          </select>
        </div>

        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {sessions.map((s) => (
            <div
              key={s.id}
              onClick={() => handleSelectSession(s.id)}
              className={`group flex items-center justify-between px-3 py-2.5 rounded-lg cursor-pointer text-sm ${
                s.id === currentSessionId
                  ? darkMode
                    ? 'bg-indigo-600/20 text-indigo-300'
                    : 'bg-indigo-50 text-indigo-700'
                  : 'hover:bg-slate-500/10'
              }`}
            >
              <span className="truncate pr-2">{s.title}</span>
              <button
                type="button"
                onClick={(e) => handleDeleteSession(s.id, e)}
                className="opacity-70 hover:opacity-100 p-1 text-rose-500"
                title="Delete chat"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </aside>

      {/* Main Chat Area */}
      <main className="flex-1 flex flex-col min-h-0">
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 && (
            <div
              className={`max-w-xl mx-auto mt-8 p-4 rounded-xl border text-sm ${
                darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
              }`}
            >
              New chat started. What would you like to explore today?
            </div>
          )}

          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] sm:max-w-[70%] rounded-2xl px-4 py-3 text-sm whitespace-pre-wrap ${
                  m.role === 'user'
                    ? 'bg-indigo-600 text-white'
                    : darkMode
                    ? 'bg-slate-900 border border-slate-800 text-slate-100'
                    : 'bg-white border border-slate-200 text-slate-900'
                }`}
              >
                <div>{m.content}</div>
                <div className="mt-1.5 flex items-center justify-between gap-3 text-[11px] opacity-70">
                  <span>{m.timestamp}</span>
                  {m.role === 'assistant' && (
                    <button
                      type="button"
                      onClick={() => handleCopy(m.content, m.id)}
                      className="inline-flex items-center gap-1 hover:opacity-100"
                    >
                      {copiedId === m.id ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          Copied
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          Copy
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div
                className={`rounded-2xl px-4 py-3 text-sm ${
                  darkMode ? 'bg-slate-900 text-slate-300' : 'bg-white text-slate-600'
                }`}
              >
                Thinking...
              </div>
            </div>
          )}
        </div>

        {/* Input Form */}
        <form
          onSubmit={handleSendMessage}
          className={`p-3 sm:p-4 border-t flex items-center gap-2 ${
            darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
          }`}
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask anything (GK, Math, Science, Translation, Coding, Essays)..."
            className={`flex-1 px-4 py-2.5 rounded-xl border text-sm outline-none ${
              darkMode
                ? 'bg-slate-950 border-slate-700 text-white focus:border-indigo-500'
                : 'bg-slate-50 border-slate-300 text-slate-900 focus:border-indigo-500'
            }`}
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-sm font-medium"
          >
            <Send className="w-4 h-4" />
            Send
          </button>
        </form>
      </main>
    </div>
  );
};

export default UniversalChat;
