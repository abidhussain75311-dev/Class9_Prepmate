export type QuestionType = 'MCQ' | 'SHORT' | 'LONG';

export interface Question {
    id: string;
    type: QuestionType;
    text: string;
    marks?: number;
}

export interface MCQ extends Question {
    type: 'MCQ';
    options: string[];
    correctIndex: number;
    explanation?: string;
}

export interface ShortQuestion extends Question {
    type: 'SHORT';
    answerKey: string;
}

export interface LongQuestion extends Question {
    type: 'LONG';
    answerKey: string; // Key points or model answer
}

export type AnyQuestion = MCQ | ShortQuestion | LongQuestion;

export interface Chapter {
    id: string;
    title: string;
    questions: AnyQuestion[];
}

export interface Subject {
    id: string;
    name: string;
    chapters: Chapter[];
}

export interface QuizResult {
    id: string;
    subjectId: string;
    chapterId: string;
    score: number;
    totalQuestions: number;
    percentage: number;
    date: string;
}

export interface AppData {
    subjects: Subject[];
    results: QuizResult[]; // Store student performance
}
