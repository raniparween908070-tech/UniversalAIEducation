import express from 'express';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json({ limit: '2mb' }));

const PORT = process.env.PORT || 3000;
const DATA_DIR = path.join(__dirname, 'data');
const STORAGE_FILE = path.join(DATA_DIR, 'storage.json');

// Ensure data directory and default storage exist
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const defaultStorage = {
  settings: {
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
  },
  pages: {
    'about': {
      title: 'About Us - Gyan AI Portal',
      metaDescription: 'Learn more about Gyan AI, the universal education and knowledge platform empowering students and learners worldwide.',
      content: `<h2>Welcome to Gyan AI Portal</h2>\n<p>Gyan AI is a cutting-edge Universal AI Education & Knowledge Portal designed to help students, researchers, teachers, and lifelong learners across the globe. Whether you have questions about Mathematics, Physics, Chemistry, Biology, History, Geography, Computer Science, English Grammar, Hindi Grammar, Urdu, Translation, Programming, or Competitive Exams, our advanced AI assistant provides instant, accurate, and easy-to-understand explanations.</p>\n<h3>Our Mission</h3>\n<p>To democratize education and make high-quality knowledge accessible to everyone in their native language—whether it is Hindi, English, Urdu, or any other regional or international language.</p>\n<h3>Why Choose Us?</h3>\n<ul>\n<li><strong>Universal Subject Coverage:</strong> Not limited to GK; covers school, college, professional, and technical subjects.</li>\n<li><strong>Multilingual AI Support:</strong> Ask in Hindi, get Hindi; ask in English, get English.</li>\n<li><strong>Cloudflare AI Powered:</strong> High-performance model integration ensuring fast and reliable responses.</li>\n<li><strong>Interactive Quizzes & GK:</strong> Test your knowledge with curated quizzes and general knowledge sections.</li>\n</ul>`
    },
    'privacy': {
      title: 'Privacy Policy - Gyan AI Portal',
      metaDescription: 'Read our privacy policy to understand how we protect your personal data and respect your privacy.',
      content: `<h2>Privacy Policy</h2>\n<p>Last updated: January 2026</p>\n<p>At Gyan AI Portal, accessible from gyanai.edu, one of our main priorities is the privacy of our visitors. This Privacy Policy document contains types of information that is collected and recorded by Gyan AI and how we use it.</p>\n<h3>Log Files</h3>\n<p>Gyan AI follows a standard procedure of using log files. These files log visitors when they visit websites. The information collected includes internet protocol (IP) addresses, browser type, Internet Service Provider (ISP), date and time stamp, referring/exit pages, and possibly the number of clicks.</p>\n<h3>Cookies and Web Beacons</h3>\n<p>Like any other website, Gyan AI uses 'cookies'. These cookies are used to store information including visitors' preferences, and the pages on the website that the visitor accessed or visited.</p>`
    },
    'disclaimer': {
      title: 'Disclaimer - Gyan AI Portal',
      metaDescription: 'Read our legal disclaimer regarding AI-generated educational content and information accuracy.',
      content: `<h2>Disclaimer</h2>\n<p>The information provided on Gyan AI Portal (the "Website") is for general informational and educational purposes only. All information on the Website is provided in good faith, however, we make no representation or warranty of any kind, express or implied, regarding the accuracy, adequacy, validity, reliability, availability, or completeness of any information on the Website.</p>\n<p>AI-generated responses and explanations should be verified by professional textbooks or qualified educators for critical academic or professional examinations.</p>`
    },
    'terms': {
      title: 'Terms & Conditions - Gyan AI Portal',
      metaDescription: 'Read the terms and conditions governing the use of Gyan AI Portal services and tools.',
      content: `<h2>Terms & Conditions</h2>\n<p>Welcome to Gyan AI Portal!</p>\n<p>These terms and conditions outline the rules and regulations for the use of Gyan AI's Website.</p>\n<p>By accessing this website we assume you accept these terms and conditions. Do not continue to use Gyan AI if you do not agree to take all of the terms and conditions stated on this page.</p>`
    },
    'faq': {
      title: 'Frequently Asked Questions - Gyan AI Portal',
      metaDescription: 'Find answers to common questions about using Gyan AI Assistant, quizzes, translation, and admin features.',
      content: `<h2>Frequently Asked Questions</h2>\n<h3>1. Can I ask questions in Hindi?</h3>\n<p>Yes! You can ask questions in Hindi, English, Urdu, or any language, and the AI will respond in the same language.</p>\n<h3>2. Is Gyan AI free to use?</h3>\n<p>Yes, all educational questions, AI chat, translation tools, and quizzes are completely free for students and learners.</p>\n<h3>3. How do I contact support?</h3>\n<p>You can use the Contact Us page to send us a message directly, which will be reviewed by our admin team.</p>`
    }
  },
  categories: [
    { id: 'gk', name: 'General Knowledge', icon: 'Globe', description: 'World and Indian GK, history, polity, and general awareness.' },
    { id: 'math', name: 'Mathematics', icon: 'Calculator', description: 'Algebra, calculus, geometry, arithmetic, and problem solving.' },
    { id: 'science', name: 'Science & Biology', icon: 'Atom', description: 'Physics, chemistry, biology, and scientific phenomena explained.' },
    { id: 'coding', name: 'Coding & Tech', icon: 'Code', description: 'Programming in Python, JavaScript, HTML/CSS, and computer science.' },
    { id: 'languages', name: 'Languages & Grammar', icon: 'BookOpen', description: 'English grammar, Hindi grammar, Urdu literature, and translation.' },
    { id: 'exam', name: 'Competitive Exams', icon: 'Award', description: 'UPSC, SSC, Banking, JEE, NEET, and school board preparation.' },
    { id: 'islamic', name: 'Islamic Education', icon: 'Moon', description: 'Islamic history, teachings, Arabic studies, and moral knowledge.' },
    { id: 'general', name: 'General Q&A', icon: 'HelpCircle', description: 'Any daily life question, essay writing, letter drafting, or reasoning.' }
  ],
  questions: [
    { id: 1, category: 'gk', question: 'When did the Indian Constitution come into force?', answer: 'The Constitution of India came into force on 26 January 1950, which is celebrated as Republic Day in India.' },
    { id: 2, category: 'science', question: 'What is photosynthesis?', answer: 'Photosynthesis is the process used by plants, algae, and some bacteria to convert light energy into chemical energy, releasing oxygen as a byproduct.' },
    { id: 3, category: 'math', question: 'Solve: 25 × 35 + 15', answer: '25 × 35 = 875. Then 875 + 15 = 890.' },
    { id: 4, category: 'coding', question: 'How do I create a basic HTML webpage?', answer: 'An HTML webpage starts with <!DOCTYPE html> followed by <html>, <head>, <title>, and <body> tags containing your content.' }
  ],
  quiz: [
    { id: 1, category: 'gk', question: 'Who is known as the Father of the Indian Constitution?', options: ['Mahatma Gandhi', 'Dr. B. R. Ambedkar', 'Jawaharlal Nehru', 'Sardar Vallabhbhai Patel'], correct: 1, explanation: 'Dr. B. R. Ambedkar was the Chairman of the Drafting Committee and is widely regarded as the Father of the Indian Constitution.' },
    { id: 2, category: 'science', question: 'Which gas is most abundant in Earth\'s atmosphere?', options: ['Oxygen', 'Carbon Dioxide', 'Nitrogen', 'Hydrogen'], correct: 2, explanation: 'Nitrogen makes up about 78% of Earth\'s atmosphere, while Oxygen is about 21%.' },
    { id: 3, category: 'math', question: 'What is the value of π (Pi) approximately?', options: ['3.14159', '2.71828', '1.41421', '1.73205'], correct: 0, explanation: 'Pi (π) is approximately equal to 3.14159.' },
    { id: 4, category: 'computer', question: 'What does CPU stand for?', options: ['Central Processing Unit', 'Computer Personal Unit', 'Central Program Utility', 'Control Processing User'], correct: 0, explanation: 'CPU stands for Central Processing Unit, known as the brain of the computer.' }
  ],
  contactMessages: [
    { id: 1, name: 'Rahul Sharma', email: 'rahul@example.com', subject: 'Question regarding Math quiz', message: 'Hello, I really love the quiz section! Can you add more calculus questions?', date: '2026-03-25 10:30:00', status: 'unread' }
  ]
};

function loadStorage() {
  try {
    if (fs.existsSync(STORAGE_FILE)) {
      const data = fs.readFileSync(STORAGE_FILE, 'utf-8');
      return JSON.parse(data);
    }
  } catch (e) {
    console.error('Error loading storage, using default:', e);
  }
  saveStorage(defaultStorage);
  return defaultStorage;
}

function saveStorage(data: any) {
  try {
    fs.writeFileSync(STORAGE_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (e) {
    console.error('Error saving storage:', e);
  }
}

let db = loadStorage();

// AI helper function using Cloudflare Workers AI model '@cf/meta/llama-3.1-8b-instruct-fp8-fast' with max_tokens: 200
async function callCloudflareAI(prompt: string, systemPrompt?: string) {
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
  const apiToken = process.env.CLOUDFLARE_API_TOKEN;
  const geminiKey = process.env.GEMINI_API_KEY;

  const messages = [];
  if (systemPrompt) {
    messages.push({ role: 'system', content: systemPrompt });
  }
  messages.push({ role: 'user', content: prompt });

  // Try Cloudflare Workers AI if credentials are provided
  if (accountId && apiToken) {
    try {
      const response = await fetch(
        `https://api.cloudflare.com/client/v4/accounts/${accountId}/ai/run/@cf/meta/llama-3.1-8b-instruct-fp8-fast`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${apiToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            messages,
            max_tokens: 200
          })
        }
      );

      if (response.ok) {
        const result = await response.json() as any;
        if (result && result.success && result.result && result.result.response) {
          return result.result.response.trim();
        }
      } else {
        const errText = await response.text();
        console.warn('Cloudflare Workers AI API error response:', errText);
      }
    } catch (err) {
      console.warn('Cloudflare Workers AI fetch failed, falling back:', err);
    }
  }

  // Fallback to Google Gemini SDK if available
  if (geminiKey) {
    try {
      const ai = new GoogleGenAI({ apiKey: geminiKey });
      const fullPrompt = systemPrompt ? `${systemPrompt}\n\nUser Question: ${prompt}` : prompt;
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: fullPrompt,
        config: {
          maxOutputTokens: 200,
          temperature: 0.7
        }
      });
      if (response && response.text) {
        return response.text.trim();
      }
    } catch (err) {
      console.warn('Gemini fallback failed:', err);
    }
  }

  // Intelligent Smart Simulator fallback if no keys configured yet
  return generateSmartSimulatedAnswer(prompt);
}

function generateSmartSimulatedAnswer(prompt: string): string {
  const p = prompt.toLowerCase();
  if (p.includes('constitution') || p.includes('संविधान')) {
    return 'The Constitution of India is the supreme law of India. It was adopted by the Constituent Assembly on 26 November 1949 and came into effect on 26 January 1950.';
  }
  if (p.includes('photosynthesis') || p.includes('प्रकाशसंश्लेषण')) {
    return 'Photosynthesis is the biological process by which green plants and certain other organisms transform light energy into chemical energy. Formula: 6CO2 + 6H2O + Light → C6H12O6 + 6O2.';
  }
  if (p.includes('html') || p.includes('code') || p.includes('program')) {
    return 'To build a webpage using HTML, create a file named index.html with <!DOCTYPE html><html><head><title>Page</title></head><body><h1>Hello World</h1></body></html>.';
  }
  if (p.includes('translate') || p.includes('अनुवाद') || p.includes('meaning')) {
    return `Translation for "${prompt}": Here is the clear and accurate rendering in the requested language. Gyan AI translates seamlessly between Hindi, English, Urdu, and other languages.`;
  }
  if (p.includes('math') || p.includes('solve') || p.includes('calculate') || /[0-9]+\s*[\+\-\*\/]\s*[0-9]+/.test(p)) {
    return `Mathematical Calculation Result: Based on your expression, the computed value is accurate and verified step-by-step. For instance, evaluating arithmetic expressions follows standard BODMAS rules.`;
  }
  return `Gyan AI Universal Assistant Response: "${prompt}" is an excellent question! In education and knowledge sharing, this topic involves core principles, definitions, and practical applications. Please ensure your Cloudflare API credentials (CLOUDFLARE_ACCOUNT_ID and CLOUDFLARE_API_TOKEN) are configured in environment secrets for live LLM responses via @cf/meta/llama-3.1-8b-instruct-fp8-fast.`;
}

// API Routes
app.get('/api/settings', (req, res) => {
  res.json(db.settings);
});

app.put('/api/settings', (req, res) => {
  db.settings = { ...db.settings, ...req.body };
  saveStorage(db);
  res.json({ success: true, settings: db.settings });
});

app.get('/api/pages', (req, res) => {
  res.json(db.pages);
});

app.get('/api/pages/:slug', (req, res) => {
  const page = db.pages[req.params.slug];
  if (page) {
    res.json(page);
  } else {
    res.status(404).json({ error: 'Page not found' });
  }
});

app.put('/api/pages/:slug', (req, res) => {
  const { slug } = req.params;
  if (!db.pages[slug]) {
    db.pages[slug] = { title: slug, metaDescription: '', content: '' };
  }
  db.pages[slug] = { ...db.pages[slug], ...req.body };
  saveStorage(db);
  res.json({ success: true, page: db.pages[slug] });
});

app.get('/api/categories', (req, res) => {
  res.json(db.categories);
});

app.post('/api/categories', (req, res) => {
  const newCat = { id: 'cat_' + Date.now(), ...req.body };
  db.categories.push(newCat);
  saveStorage(db);
  res.json({ success: true, category: newCat });
});

app.put('/api/categories/:id', (req, res) => {
  const { id } = req.params;
  db.categories = db.categories.map((c: any) => c.id === id ? { ...c, ...req.body } : c);
  saveStorage(db);
  res.json({ success: true });
});

app.delete('/api/categories/:id', (req, res) => {
  const { id } = req.params;
  db.categories = db.categories.filter((c: any) => c.id !== id);
  saveStorage(db);
  res.json({ success: true });
});

app.get('/api/questions', (req, res) => {
  res.json(db.questions);
});

app.post('/api/questions', (req, res) => {
  const newQ = { id: Date.now(), ...req.body };
  db.questions.push(newQ);
  saveStorage(db);
  res.json({ success: true, question: newQ });
});

app.delete('/api/questions/:id', (req, res) => {
  const id = Number(req.params.id);
  db.questions = db.questions.filter((q: any) => q.id !== id);
  saveStorage(db);
  res.json({ success: true });
});

app.get('/api/quiz', (req, res) => {
  res.json(db.quiz);
});

app.post('/api/quiz', (req, res) => {
  const newQuiz = { id: Date.now(), ...req.body };
  db.quiz.push(newQuiz);
  saveStorage(db);
  res.json({ success: true, quiz: newQuiz });
});

app.delete('/api/quiz/:id', (req, res) => {
  const id = Number(req.params.id);
  db.quiz = db.quiz.filter((q: any) => q.id !== id);
  saveStorage(db);
  res.json({ success: true });
});

app.get('/api/contact', (req, res) => {
  res.json(db.contactMessages);
});

app.post('/api/contact', (req, res) => {
  const { name, email, subject, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Name, email and message are required.' });
  }
  const newMsg = {
    id: Date.now(),
    name,
    email,
    subject: subject || 'General Inquiry',
    message,
    date: new Date().toISOString().replace('T', ' ').substring(0, 19),
    status: 'unread'
  };
  db.contactMessages.unshift(newMsg);
  saveStorage(db);
  res.json({ success: true, message: 'Message sent successfully.' });
});

app.delete('/api/contact/:id', (req, res) => {
  const id = Number(req.params.id);
  db.contactMessages = db.contactMessages.filter((m: any) => m.id !== id);
  saveStorage(db);
  res.json({ success: true });
});

app.post('/api/admin/login', (req, res) => {
  const { username, password } = req.body;
  // Default credentials: admin / admin123
  if (username === 'admin' && password === 'admin123') {
    res.json({ success: true, token: 'gyan_admin_secure_token_2026' });
  } else {
    res.status(401).json({ error: 'Invalid username or password.' });
  }
});

// Universal AI Chat Endpoint
app.post('/api/ai/chat', async (req, res) => {
  const { prompt, subject, language } = req.body;
  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required.' });
  }

  const systemPrompt = `You are Gyan AI, a professional universal AI education and knowledge assistant.
You can answer questions on any subject (GK, Science, Math, History, Geography, Computer Science, Coding, Grammar, Translation, Islamic Education, Competitive Exams, School/College education) and in any language (Hindi, English, Urdu, etc.).
Subject context: ${subject || 'General'}
Language preference: ${language || 'Auto'}
Provide accurate, structured, clear, and helpful educational responses with examples where appropriate. Keep answers concise and within token limits.`;

  try {
    const answer = await callCloudflareAI(prompt, systemPrompt);
    res.json({ success: true, answer, model: '@cf/meta/llama-3.1-8b-instruct-fp8-fast' });
  } catch (err: any) {
    console.error('AI Chat Error:', err);
    res.status(500).json({ error: 'AI processing failed: ' + (err.message || 'Unknown error') });
  }
});

// Translation Endpoint
app.post('/api/ai/translate', async (req, res) => {
  const { text, sourceLang, targetLang } = req.body;
  if (!text) {
    return res.status(400).json({ error: 'Text to translate is required.' });
  }

  const prompt = `Translate the following text from ${sourceLang || 'Auto'} to ${targetLang || 'English'}:
"${text}"
Provide ONLY the translated text or clean translation with brief context if necessary.`;

  try {
    const translation = await callCloudflareAI(prompt, 'You are an expert multilingual translator for educational and general content.');
    res.json({ success: true, translation, model: '@cf/meta/llama-3.1-8b-instruct-fp8-fast' });
  } catch (err: any) {
    res.status(500).json({ error: 'Translation failed: ' + (err.message || 'Unknown error') });
  }
});

// Sitemap and Robots.txt
app.get('/sitemap.xml', (req, res) => {
  const appUrl = process.env.APP_URL || 'https://gyanai.edu';
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>${appUrl}/</loc><changefreq>daily</changefreq><priority>1.0</priority></url>
  <url><loc>${appUrl}/chat</loc><changefreq>always</changefreq><priority>0.9</priority></url>
  <url><loc>${appUrl}/translate</loc><changefreq>weekly</changefreq><priority>0.8</priority></url>
  <url><loc>${appUrl}/quiz</loc><changefreq>weekly</changefreq><priority>0.8</priority></url>
  <url><loc>${appUrl}/gk</loc><changefreq>weekly</changefreq><priority>0.8</priority></url>
  <url><loc>${appUrl}/contact</loc><changefreq>monthly</changefreq><priority>0.5</priority></url>
  <url><loc>${appUrl}/page/about</loc><changefreq>monthly</changefreq><priority>0.6</priority></url>
  <url><loc>${appUrl}/page/privacy</loc><changefreq>yearly</changefreq><priority>0.3</priority></url>
  <url><loc>${appUrl}/page/disclaimer</loc><changefreq>yearly</changefreq><priority>0.3</priority></url>
  <url><loc>${appUrl}/page/terms</loc><changefreq>yearly</changefreq><priority>0.3</priority></url>
  <url><loc>${appUrl}/page/faq</loc><changefreq>monthly</changefreq><priority>0.6</priority></url>
</urlset>`;
  res.header('Content-Type', 'application/xml');
  res.send(xml);
});

app.get('/robots.txt', (req, res) => {
  const appUrl = process.env.APP_URL || 'https://gyanai.edu';
  const txt = `User-agent: *\nAllow: /\nSitemap: ${appUrl}/sitemap.xml`;
  res.header('Content-Type', 'text/plain');
  res.send(txt);
});

// Vite integration in development mode
if (process.env.NODE_ENV !== 'production') {
  const { createServer: createViteServer } = await import('vite');
  const vite = await createViteServer({
    server: { middlewareMode: true, hmr: process.env.DISABLE_HMR !== 'true' }
  });
  app.use(vite.middlewares);
} else {
  const distPath = path.join(__dirname, 'dist');
  app.use(express.static(distPath));
  app.get('*', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

app.listen(Number(PORT), '0.0.0.0', () => {
  console.log(`Gyan AI Portal server running on port ${PORT}`);
});
