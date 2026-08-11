import React, { useState, useEffect } from 'react';
import { useRoute, useLocation } from 'wouter';
import { modules } from '../lib/modules';
import { useStore } from '../lib/store';
import { dict } from '../lib/i18n';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ArrowRight, Calculator } from 'lucide-react';

export function ModulePage() {
  const [match, params] = useRoute('/module/:id');
  const [, setLocation] = useLocation();
  const { lang, progress, markLessonComplete, saveQuizScore } = useStore();
  const t = dict[lang];

  const mod = modules.find(m => m.id === params?.id);
  
  const [currentStep, setCurrentStep] = useState(0); // 0 to lessons.length-1, then lessons.length is quiz
  const [showMath, setShowMath] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState<number[]>([]);
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentStep]);

  if (!mod) {
    return <div className="text-center py-20">Module not found.</div>;
  }

  const isQuiz = currentStep === mod.lessons.length;
  const lesson = !isQuiz ? mod.lessons[currentStep] : null;

  const handleNext = () => {
    if (!isQuiz) {
      markLessonComplete(mod.id, lesson!.id);
      setCurrentStep(s => s + 1);
      setShowMath(false);
    }
  };

  const handleQuizSubmit = () => {
    let score = 0;
    quizAnswers.forEach((ans, i) => {
      if (ans === mod.quiz[i].correctIndex) score++;
    });
    saveQuizScore(mod.id, score);
    setQuizSubmitted(true);
  };

  return (
    <div className="max-w-4xl mx-auto pb-24">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold mb-2">{mod.title[lang]}</h1>
        <div className="flex gap-2">
          {mod.lessons.map((l, i) => (
            <div key={l.id} className={`h-2 flex-1 rounded-full ${i < currentStep ? 'bg-primary' : i === currentStep ? 'bg-primary/50' : 'bg-muted'}`} />
          ))}
          <div className={`h-2 flex-1 rounded-full ${isQuiz ? 'bg-primary' : 'bg-muted'}`} />
        </div>
      </div>

      <AnimatePresence mode="wait">
        {!isQuiz ? (
          <motion.div
            key={lesson!.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-8"
          >
            <div className="prose prose-lg dark:prose-invert max-w-none">
              <h2 className="text-2xl font-bold">{lesson!.title[lang]}</h2>
              <div className="text-lg leading-relaxed">{lesson!.content[lang]}</div>
            </div>

            {lesson!.widget && (
              <div className="my-10 bg-card border rounded-2xl p-6 shadow-sm">
                {lesson!.widget}
              </div>
            )}

            {lesson!.math && (
              <div className="border rounded-2xl overflow-hidden bg-muted/30">
                <button
                  onClick={() => setShowMath(!showMath)}
                  className="w-full px-6 py-4 flex items-center justify-between hover:bg-muted/50 transition-colors font-medium text-foreground"
                >
                  <span className="flex items-center gap-2">
                    <Calculator className="w-5 h-5 text-primary" />
                    {showMath ? t.hide_math : t.show_math}
                  </span>
                  <ChevronDown className={`w-5 h-5 transition-transform ${showMath ? 'rotate-180' : ''}`} />
                </button>
                <AnimatePresence>
                  {showMath && (
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: 'auto' }}
                      exit={{ height: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="p-6 border-t bg-card text-muted-foreground prose max-w-none">
                        {lesson!.math[lang]}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            <div className="pt-8 flex justify-end">
              <button
                onClick={handleNext}
                className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-bold rounded-xl hover:bg-primary/90 shadow-md transition-all active:scale-95"
              >
                {t.next_lesson} <ArrowRight className={`w-5 h-5 ${lang === 'ar' ? 'rotate-180' : ''}`} />
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="quiz"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card border rounded-3xl p-8 shadow-sm space-y-8"
          >
            <h2 className="text-3xl font-bold text-center">{t.quiz}</h2>
            
            <div className="space-y-10">
              {mod.quiz.map((q, i) => (
                <div key={i} className="space-y-4">
                  <p className="text-xl font-medium">{i + 1}. {q.question[lang]}</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {q.options[lang].map((opt, optIdx) => {
                      const isSelected = quizAnswers[i] === optIdx;
                      const isCorrect = optIdx === q.correctIndex;
                      const showResult = quizSubmitted;
                      
                      let btnClass = "border-2 rounded-xl p-4 text-left transition-all font-medium ";
                      if (showResult) {
                        if (isCorrect) btnClass += "bg-emerald-50 border-emerald-500 text-emerald-900";
                        else if (isSelected) btnClass += "bg-destructive/10 border-destructive text-destructive";
                        else btnClass += "border-muted text-muted-foreground opacity-50";
                      } else {
                        btnClass += isSelected 
                          ? "bg-primary/10 border-primary text-primary" 
                          : "border-muted hover:border-primary/50 text-foreground";
                      }

                      return (
                        <button
                          key={optIdx}
                          disabled={quizSubmitted}
                          onClick={() => {
                            const newAns = [...quizAnswers];
                            newAns[i] = optIdx;
                            setQuizAnswers(newAns);
                          }}
                          className={btnClass}
                        >
                          <div className="flex items-center justify-between">
                            <span>{opt}</span>
                            {showResult && isCorrect && <Check className="w-5 h-5 text-emerald-600" />}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-8 border-t flex flex-col sm:flex-row items-center justify-between gap-4">
              {!quizSubmitted ? (
                <button
                  onClick={handleQuizSubmit}
                  disabled={quizAnswers.length < mod.quiz.length}
                  className="w-full sm:w-auto px-8 py-3 bg-primary text-primary-foreground font-bold rounded-xl hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed shadow-md transition-all active:scale-95"
                >
                  {t.submit}
                </button>
              ) : (
                <>
                  <div className="text-xl font-bold text-foreground">
                    {t.score}: {quizAnswers.filter((a, i) => a === mod.quiz[i].correctIndex).length} / {mod.quiz.length}
                  </div>
                  <div className="flex gap-3 w-full sm:w-auto">
                    <button
                      onClick={() => { setQuizSubmitted(false); setQuizAnswers([]); }}
                      className="flex-1 sm:flex-none px-6 py-3 border-2 font-bold rounded-xl hover:bg-muted transition-colors"
                    >
                      {t.retake}
                    </button>
                    <button
                      onClick={() => setLocation('/')}
                      className="flex-1 sm:flex-none px-6 py-3 bg-primary text-primary-foreground font-bold rounded-xl hover:bg-primary/90 shadow-md transition-all"
                    >
                      {t.back_home}
                    </button>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ChevronDown(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="m6 9 6 6 6-6"/>
    </svg>
  );
}
