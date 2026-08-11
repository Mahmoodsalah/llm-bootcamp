import React from 'react';

export type LessonContent = {
  id: string;
  title: { en: string; ar: string };
  content: { en: React.ReactNode; ar: React.ReactNode };
  math?: { en: React.ReactNode; ar: React.ReactNode };
  widget?: React.ReactNode;
};

export type ModuleDef = {
  id: string;
  title: { en: string; ar: string };
  description: { en: string; ar: string };
  lessons: LessonContent[];
  quiz: {
    question: { en: string; ar: string };
    options: { en: string[]; ar: string[] };
    correctIndex: number;
  }[];
};
