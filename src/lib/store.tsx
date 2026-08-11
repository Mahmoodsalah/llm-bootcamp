import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';

type Progress = {
  completedLessons: string[];
  quizScores: Record<string, number>;
};

type StoreState = {
  lang: 'en' | 'ar';
  setLang: (lang: 'en' | 'ar') => void;
  progress: Progress;
  markLessonComplete: (moduleId: string, lessonId: string) => void;
  saveQuizScore: (moduleId: string, score: number) => void;
};

const StoreContext = createContext<StoreState | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<'en' | 'ar'>('en');
  const [progress, setProgress] = useState<Progress>({ completedLessons: [], quizScores: {} });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const savedLang = localStorage.getItem('llm-academy-lang') as 'en' | 'ar';
    if (savedLang) setLangState(savedLang);

    const savedProgress = localStorage.getItem('llm-academy-progress');
    if (savedProgress) setProgress(JSON.parse(savedProgress));
    
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
      document.documentElement.lang = lang;
    }
  }, [lang, mounted]);

  const setLang = (l: 'en' | 'ar') => {
    setLangState(l);
    localStorage.setItem('llm-academy-lang', l);
  };

  const markLessonComplete = (moduleId: string, lessonId: string) => {
    setProgress(prev => {
      const p = { ...prev, completedLessons: [...new Set([...prev.completedLessons, `${moduleId}-${lessonId}`])] };
      localStorage.setItem('llm-academy-progress', JSON.stringify(p));
      return p;
    });
  };

  const saveQuizScore = (moduleId: string, score: number) => {
    setProgress(prev => {
      const p = { ...prev, quizScores: { ...prev.quizScores, [moduleId]: score } };
      localStorage.setItem('llm-academy-progress', JSON.stringify(p));
      return p;
    });
  };

  if (!mounted) return null;

  return (
    <StoreContext.Provider value={{ lang, setLang, progress, markLessonComplete, saveQuizScore }}>
      {children}
    </StoreContext.Provider>
  );
}

export const useStore = () => {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used within StoreProvider');
  return ctx;
};

// Use this component to wrap English technical terms in Arabic text.
export const Eng = ({ children }: { children: React.ReactNode }) => (
  <span dir="ltr" className="inline-block font-mono text-[0.9em] font-semibold text-primary px-1.5 py-0.5 bg-primary/5 rounded-md border border-primary/10 align-baseline mx-1">
    {children}
  </span>
);
