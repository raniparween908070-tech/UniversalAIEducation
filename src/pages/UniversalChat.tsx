import React, { useState, useEffect, useRef } from 'react';
import { 
  Send, 
  Trash2, 
  Plus, 
  Copy, 
  Check, 
  Bot, 
  User, 
  Sparkles, 
  MessageSquare, 
  Globe, 
  Zap,
  BookOpen
} from 'lucide-react';
import { ChatMessage, ChatSession } from '../types';
import { FormattedText } from '../components/FormattedText';

interface UniversalChatProps {
  darkMode: boolean;
}

export const UniversalChat: React.FC<UniversalChatProps> = ({ darkMode }) => {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string>('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [subject, setSubject] = useState('General Education');
  const [language, setLanguage] = useState('Auto');
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load sessions from localStorage
    const saved = localStorage.getItem('gyan_chat_sessions');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.length > 0) {
          setSessions(parsed);
          setCurrentSessionId(parsed[0].id);
          setMessages(parsed[0].messages);
          return;
        }
      } catch (e) {
        console.error(e);
      }
    }

    // Default initial session
    const newSession: ChatSession = {
      id: 'session_' + Date.now(),
      title: 'New Knowledge Session',
      messages: [
        {
          id: 'msg_1',
          role: 'assistant',
          content: 'Namaste! Welcome to Gyan AI Universal Assistant. You can ask me any question on Science, Mathematics, History, Coding, Grammar, Translation, or GK in Hindi, English, Urdu, or any language!',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ],
      updatedAt: new Date().toISOString()
    };
    setSessions([newSession]);
    setCurrentSessionId(newSession.id);
    setMessages(newSession.messages);
  }, []);

  useEffect(() => {
    if (sessions.length > 0) {
      localStorage.setItem('gyan_chat_sessions', JSON.stringify(sessions));
    }
  }, [sessions]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleNewChat = () => {
    const newSession: ChatSession = {
      id: 'session_' + Date.now(),
      title: 'New Session',
      messages: [
        {
          id: 'msg_' + Date.now(),
          role: 'assistant',
          content: 'New chat started. What would you like to explore today?',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ],
      updatedAt: new Date().toISOString()
    };
    setSessions([newSession, ...sessions]);
    setCurrentSessionId(newSession.id);
    setMessages(newSession.messages);
  };

  const handleSelectSession = (id: string) => {
    const s = sessions.find(item => item.id === id);
    if (s) {
      setCurrentSessionId(s.id);
      setMessages(s.messages);
    }
  };

  const handleDeleteSession = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = sessions.filter(s => s.id !== id);
    if (updated.length === 0) {
      const fallback: ChatSession = {
        id: 'session_' + Date.now(),
        title: 'New Session',
        messages: [{ id: 'm1', role: 'assistant', content: 'Hello! Ask anything.', timestamp: new Date().toLocaleTimeString() }],
        updatedAt: new Date().toISOString()
      };
      setSessions([fallback]);
      setCurrentSessionId(fallback.id);
      setMessages(fallback.messages);
    } else {
      setSessions(updated);
      if (currentSessionId === id) {
        setCurrentSessionId(updated[0].id);
        setMessages(updated[0].messages);
      }
    }
  };

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsgText = input.trim();
    setInput('');

    const userMessage: ChatMessage = {
      id: 'user_' + Date.now(),
      role: 'user',
      content: userMsgText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setLoading(true);

    // Update session title if first user prompt
    let sessionTitle = userMsgText.substring(0, 30) + '...';

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: userMsgText, subject, language })
      });
      const data = await res.json();

      const assistantMessage: ChatMessage = {
        id: 'asst_' + Date.now(),
        role: 'assistant',
        content: data.success ? data.answer : 'Error: ' + (data.error || 'Failed to generate response'),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      const finalMessages = [...updatedMessages, assistantMessage];
      setMessages(finalMessages);

      setSessions(sessions.map(s => {
        if (s.id === currentSessionId) {
          return {
            ...s,
            title: s.title === 'New Knowledge Session' || s.title === 'New Session' ? sessionTitle : s.title,
            messages: finalMessages,
            updatedAt: new Date().toISOString()
          };
        }
        return s;
      }));

    } catch (err: any) {
      const errMsg: ChatMessage = {
        id: 'err_' + Date.now(),
        role: 'assistant',
        content: 'Connection error. Please check your network or server status.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
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
    <div className={`min-h-[calc(100vh-4rem)] flex flex-col lg:flex-row transition-colors ${
      darkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'
    }`}>
      
      {/* Sidebar: Chat History */}
      <aside className={`w-full lg:w-80 border-r flex flex-col ${
        darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
      }`}>
        <div className="p-4 border-b border-inherit flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <h2 className="font-bold text-base">Chat History</h2>
          </div>
          <button
            onClick={handleNewChat}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 text-white font-medium text-xs hover:bg-indigo-700 transition-colors shadow-sm cursor-pointer"
          >
            <Plus className="w-4 h-4" /> New Chat
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {sessions.map(session => (
            <div
              key={session.id}
              onClick={() => handleSelectSession(session.id)}
              className={`p-3 rounded-xl text-sm font-medium cursor-pointer transition-all flex items-center justify-between group ${
                currentSessionId === session.id
                  ? 'bg-indigo-600/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/30'
                  : darkMode 
                    ? 'hover:bg-slate-800 text-slate-300' 
                    : 'hover:bg-slate-100 text-slate-700'
              }`}
            >
              <div className="truncate flex items-center gap-2">
                <Sparkles className="w-4 h-4 shrink-0 opacity-70" />
                <span className="truncate">{session.title}</span>
              </div>
              <button
                onClick={(e) => handleDeleteSession(session.id, e)}
                className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-red-500/20 text-red-500 transition-opacity"
                title="Delete Chat"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </aside>

      {/* Main Chat Area */}
      <main className="flex-1 flex flex-col h-[calc(100vh-4rem)] lg:h-auto">
        
        {/* Chat Header Toolbar */}
        <div className={`p-4 border-b flex flex-wrap items-center justify-between gap-3 ${
          darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
        }`}>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-600/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-bold text-sm sm:text-base">Gyan AI Universal Assistant</h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">Model: @cf/meta/llama-3.1-8b-instruct-fp8-fast</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium border outline-none ${
                darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-100 border-slate-300 text-slate-800'
              }`}
            >
              <option value="General Education">🧠 General Subject</option>
              <option value="Mathematics">📐 Mathematics</option>
              <option value="Science & Physics">🔬 Science & Physics</option>
              <option value="Coding & Programming">💻 Coding & Programming</option>
              <option value="Grammar & Translation">📖 Grammar & Translation</option>
              <option value="General Knowledge">🌍 General Knowledge</option>
              <option value="Islamic Education">🌙 Islamic Education</option>
              <option value="Competitive Exam">🏆 Competitive Exam</option>
            </select>

            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium border outline-none ${
                darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-100 border-slate-300 text-slate-800'
              }`}
            >
              <option value="Auto">🌐 Auto Language</option>
              <option value="Hindi">🇮🇳 Hindi (हिंदी)</option>
              <option value="English">🇬🇧 English</option>
              <option value="Urdu">🇵🇰 Urdu (اردو)</option>
            </select>
          </div>
        </div>

        {/* Message List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start gap-3.5 max-w-3xl ${
                msg.role === 'user' ? 'ml-auto flex-row-reverse' : ''
              }`}
            >
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                msg.role === 'user' 
                  ? 'bg-indigo-600 text-white shadow-md' 
                  : 'bg-violet-600/10 text-violet-600 dark:text-violet-400 border border-violet-500/20'
              }`}>
                {msg.role === 'user' ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
              </div>

              <div className={`group relative p-4 rounded-2xl text-sm leading-relaxed shadow-sm ${
                msg.role === 'user'
                  ? 'bg-indigo-600 text-white rounded-tr-none'
                  : darkMode 
                    ? 'bg-slate-900 border border-slate-800 text-slate-100 rounded-tl-none' 
                    : 'bg-white border border-slate-200 text-slate-900 rounded-tl-none'
              }`}>
                {msg.role === 'assistant' ? (
                  <FormattedText content={msg.content} />
                ) : (
                  <div className="whitespace-pre-line">{msg.content}</div>
                )}

                <div className={`mt-2 flex items-center justify-between gap-4 text-[10px] ${
                  msg.role === 'user' ? 'text-indigo-200' : 'text-slate-400'
                }`}>
                  <span>{msg.timestamp}</span>
                  {msg.role === 'assistant' && (
                    <button
                      onClick={() => handleCopy(msg.content, msg.id)}
                      className="opacity-0 group-hover:opacity-100 flex items-center gap-1 hover:text-indigo-400 transition-opacity"
                    >
                      {copiedId === msg.id ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                      {copiedId === msg.id ? 'Copied' : 'Copy'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-violet-600/10 text-violet-600 flex items-center justify-center">
                <Bot className="w-5 h-5 animate-pulse" />
              </div>
              <div className={`p-4 rounded-2xl text-sm border flex items-center gap-2 ${
                darkMode ? 'bg-slate-900 border-slate-800 text-slate-300' : 'bg-white border-slate-200 text-slate-600'
              }`}>
                <Zap className="w-4 h-4 animate-spin text-indigo-500" />
                <span>Gyan AI is analyzing your question...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Box */}
        <div className={`p-4 border-t ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
          <form onSubmit={handleSendMessage} className="flex items-center gap-2 max-w-4xl mx-auto">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything (GK, Math, Science, Translation, Coding, Essays)..."
              className={`flex-1 px-4 py-3.5 rounded-xl text-sm border outline-none ${
                darkMode ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-400' : 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-500'
              }`}
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-semibold text-sm shadow-lg shadow-indigo-600/30 hover:opacity-95 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
            >
              <Send className="w-4 h-4" /> Send
            </button>
          </form>
          <div className="text-center mt-2 text-[10px] text-slate-400">
            Powered by Cloudflare Workers AI (@cf/meta/llama-3.1-8b-instruct-fp8-fast) • Max 200 tokens
          </div>
        </div>

      </main>

    </div>
  );
};
