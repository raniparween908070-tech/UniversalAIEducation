export interface SiteSettings {
  siteName: string;
  tagline: string;
  heroHeading: string;
  heroDescription: string;
  logoText: string;
  footerText: string;
  contactEmail: string;
  contactPhone: string;
  contactAddress: string;
  socialLinks: {
    facebook: string;
    twitter: string;
    youtube: string;
    telegram: string;
  };
}

export interface PageContent {
  title: string;
  metaDescription: string;
  content: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  description: string;
}

export interface QuestionItem {
  id: number;
  category: string;
  question: string;
  answer: string;
}

export interface QuizItem {
  id: number;
  category: string;
  question: string;
  options: string[];
  correct: number;
  explanation: string;
}

export interface ContactMessage {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  date: string;
  status: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  subject?: string;
}

export interface ChatSession {
  id: string;
  title: string;
  messages: ChatMessage[];
  updatedAt: string;
}
