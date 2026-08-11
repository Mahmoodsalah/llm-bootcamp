import React from 'react';
import { Link } from 'wouter';
import { modules } from '../lib/modules';
import { useStore } from '../lib/store';
import { dict } from '../lib/i18n';
import { CheckCircle2, ChevronRight, Lock } from 'lucide-react';
import { motion } from 'framer-motion';

export function Home() {
  const { lang, progress } = useStore();
  const t = dict[lang];

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-16 space-y-4">
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-foreground">
          {t.academy}
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          {t.tagline}
        </p>
      </div>

      <div className="grid gap-6">
        {modules.map((mod, index) => {
          const isComplete = progress.quizScores[mod.id] !== undefined;
          const score = progress.quizScores[mod.id];

          return (
            <Link key={mod.id} href={`/module/${mod.id}`}>
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="group relative block p-6 sm:p-8 bg-card rounded-2xl border shadow-sm hover:shadow-md transition-all cursor-pointer overflow-hidden"
              >
                <div className="absolute inset-y-0 left-0 w-1 bg-primary transform scale-y-0 group-hover:scale-y-100 transition-transform origin-top" />
                
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-bold text-primary tracking-wider uppercase">
                        {t.module} {index + 1}
                      </span>
                      {isComplete && (
                        <span className="flex items-center gap-1 text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          {t.completed} ({score}/{mod.quiz.length})
                        </span>
                      )}
                    </div>
                    <h2 className="text-2xl font-bold text-card-foreground">
                      {mod.title[lang]}
                    </h2>
                    <p className="text-muted-foreground line-clamp-2 max-w-xl">
                      {mod.description[lang]}
                    </p>
                  </div>
                  
                  <div className="flex-shrink-0 flex items-center justify-end">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                      <ChevronRight className={`w-6 h-6 ${lang === 'ar' ? 'rotate-180' : ''}`} />
                    </div>
                  </div>
                </div>
              </motion.div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
