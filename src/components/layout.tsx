import React from 'react';
import { useStore } from '../lib/store';
import { dict } from '../lib/i18n';
import { Link, useLocation } from 'wouter';
import { BrainCircuit, Globe, Home } from 'lucide-react';

export function Layout({ children }: { children: React.ReactNode }) {
  const { lang, setLang } = useStore();
  const t = dict[lang];
  const [location] = useLocation();

  return (
    <div className="min-h-[100dvh] flex flex-col bg-background text-foreground">
      <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-primary-foreground shadow-sm">
              <BrainCircuit className="w-6 h-6" />
            </div>
            <div className="hidden sm:block">
              <h1 className="font-bold text-lg leading-tight tracking-tight">{t.academy}</h1>
            </div>
          </Link>

          <div className="flex items-center gap-4">
            {location !== '/' && (
              <Link href="/" className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground">
                <Home className="w-4 h-4" />
                <span className="hidden sm:inline">{t.back_home}</span>
              </Link>
            )}
            <button
              onClick={() => setLang(lang === 'en' ? 'ar' : 'en')}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg border bg-card hover:bg-muted transition-colors font-medium text-sm shadow-sm"
            >
              <Globe className="w-4 h-4" />
              {lang === 'en' ? 'عربي' : 'English'}
            </button>
          </div>
        </div>
      </header>
      <main className="flex-1 container mx-auto px-4 py-8 sm:py-12">
        {children}
      </main>
      <footer className="border-t bg-card/60 px-4 py-8 sm:py-10">
        <div className="container mx-auto flex flex-col items-center gap-3 text-center">
          <p className="text-sm font-semibold text-muted-foreground">Powered by BootcampAI</p>
          <img
            src={`${import.meta.env.BASE_URL}bootcampai-logo.png`}
            alt="BootcampAI"
            className="h-auto w-full max-w-[220px] object-contain"
          />
        </div>
      </footer>
    </div>
  );
}
