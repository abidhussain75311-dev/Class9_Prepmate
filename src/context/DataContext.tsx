import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { AppData, AnyQuestion, QuizResult } from '../types';
import { generateId } from '../utils/idGenerator';

interface DataContextType {
    data: AppData;
    addSubject: (name: string) => void;
    updateSubject: (id: string, name: string) => void;
    deleteSubject: (id: string) => void;
    addChapter: (subjectId: string, title: string) => void;
    updateChapter: (subjectId: string, chapterId: string, title: string) => void; // Added updateChapter
    deleteChapter: (subjectId: string, chapterId: string) => void;
    addQuestion: (subjectId: string, chapterId: string, question: Omit<AnyQuestion, 'id'>) => void;
    deleteQuestion: (subjectId: string, chapterId: string, questionId: string) => void;
    exportData: () => void;
    importData: (jsonData: string, mode?: 'replace' | 'merge') => Promise<boolean>;
    resetData: () => void;
    saveResult: (result: Omit<QuizResult, 'id' | 'date'>) => void;
    updateQuestion: (subjectId: string, chapterId: string, questionId: string, question: Omit<AnyQuestion, 'id'>) => void;
    adminPasscode: string;
    updatePasscode: (newPasscode: string) => void;
    student: any;
    login: (email: string, pass: string) => Promise<boolean>;
    signup: (name: string, email: string, pass: string) => Promise<boolean>;
    logout: () => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

const STORAGE_KEY = 'class9_prepmate_data';

const INITIAL_DATA: AppData = {
    subjects: [],
    results: []
};


export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    // We initially load empty structure, then fetch from API
    const [data, setData] = useState<AppData>(INITIAL_DATA);
    const [adminPasscode, setAdminPasscode] = useState<string>(''); // Will verify via API now, but keep state for session

    // API Base URL - Update this when tunneling or deploying
    // const API_URL = 'http://localhost:5000/api'; 
    const API_URL = 'https://solid-plums-go.loca.lt/api';

    // Fetch Initial Data
    useEffect(() => {
        fetchData();
        // Check for admin session
        const isAdmin = sessionStorage.getItem('isAdminAuthenticated');
        if (isAdmin) setAdminPasscode('SESSION_ACTIVE');
    }, []);

    const fetchData = async () => {
        try {
            const res = await fetch(`${API_URL}/subjects`);
            if (res.ok) {
                const apiData = await res.json();
                // Merge API subjects with local results (since results are still local)
                const savedResults = localStorage.getItem(STORAGE_KEY + '_results');
                const results = savedResults ? JSON.parse(savedResults) : [];

                setData({
                    subjects: apiData.subjects || [],
                    results: results
                });
            }
        } catch (err) {
            console.error('Failed to fetch data', err);
        }
    };

    // Helper to sync whole subject (Simplest migration strategy)
    // Helper to sync whole subject (Simplest migration strategy)
    const syncSubject = async (subject: any) => {
        try {
            await fetch(`${API_URL}/subjects/${subject.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(subject)
            });
            fetchData(); // Refresh state
        } catch (err) {
            console.error('Failed to sync subject', err);
        }
    };

    const addSubject = async (name: string) => {
        const newSubject = { id: generateId('sub'), name, chapters: [] };
        try {
            await fetch(`${API_URL}/subjects`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newSubject)
            });
            fetchData();
        } catch (err) {
            console.error('Failed to add subject', err);
        }
    };

    const updateSubject = (id: string, name: string) => {
        const subject = data.subjects.find(s => s.id === id);
        if (subject) {
            syncSubject({ ...subject, name });
        }
    };

    const deleteSubject = async (id: string) => {
        try {
            await fetch(`${API_URL}/subjects/${id}`, {
                method: 'DELETE'
            });
            fetchData();
        } catch (err) {
            console.error('Failed to delete subject', err);
        }
    };

    const addChapter = (subjectId: string, title: string) => {
        const subject = data.subjects.find(s => s.id === subjectId);
        if (subject) {
            const newChapter = { id: generateId('chap'), title, questions: [] };
            const updatedSubject = {
                ...subject,
                chapters: [...subject.chapters, newChapter]
            };
            syncSubject(updatedSubject);
        }
    };

    const updateChapter = (subjectId: string, chapterId: string, title: string) => {
        const subject = data.subjects.find(s => s.id === subjectId);
        if (subject) {
            const updatedSubject = {
                ...subject,
                chapters: subject.chapters.map(c => c.id === chapterId ? { ...c, title } : c)
            };
            syncSubject(updatedSubject);
        }
    };

    const deleteChapter = (subjectId: string, chapterId: string) => {
        const subject = data.subjects.find(s => s.id === subjectId);
        if (subject) {
            const updatedSubject = {
                ...subject,
                chapters: subject.chapters.filter(c => c.id !== chapterId)
            };
            syncSubject(updatedSubject);
        }
    };

    const addQuestion = (subjectId: string, chapterId: string, question: Omit<AnyQuestion, 'id'>) => {
        const subject = data.subjects.find(s => s.id === subjectId);
        if (subject) {
            const updatedSubject = {
                ...subject,
                chapters: subject.chapters.map(c => {
                    if (c.id === chapterId) {
                        return {
                            ...c,
                            questions: [...c.questions, { ...question, id: generateId('q') } as AnyQuestion]
                        };
                    }
                    return c;
                })
            };
            syncSubject(updatedSubject);
        }
    };

    const updateQuestion = (subjectId: string, chapterId: string, questionId: string, question: Omit<AnyQuestion, 'id'>) => {
        const subject = data.subjects.find(s => s.id === subjectId);
        if (subject) {
            const updatedSubject = {
                ...subject,
                chapters: subject.chapters.map(c => {
                    if (c.id === chapterId) {
                        return {
                            ...c,
                            questions: c.questions.map(q => q.id === questionId ? { ...question, id: questionId } as AnyQuestion : q)
                        };
                    }
                    return c;
                })
            };
            syncSubject(updatedSubject);
        }
    };

    const deleteQuestion = (subjectId: string, chapterId: string, questionId: string) => {
        const subject = data.subjects.find(s => s.id === subjectId);
        if (subject) {
            const updatedSubject = {
                ...subject,
                chapters: subject.chapters.map(c => {
                    if (c.id === chapterId) {
                        return {
                            ...c,
                            questions: c.questions.filter(q => q.id !== questionId)
                        };
                    }
                    return c;
                })
            };
            syncSubject(updatedSubject);
        }
    };

    const exportData = () => {
        const dataStr = JSON.stringify(data, null, 2);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `prepmate_backup_${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const importData = async (jsonData: string, _mode: 'replace' | 'merge' = 'replace'): Promise<boolean> => {
        try {
            const parsed = JSON.parse(jsonData);

            if (!parsed || !Array.isArray(parsed.subjects)) {
                return false;
            }

            // Loop through subjects and create/update them on server
            // Note: Parallel execution might be faster but serial is safer for ordering constraints if any
            for (const subject of parsed.subjects) {
                await fetch(`${API_URL}/subjects`, {
                    method: 'POST', // The backend's POST currently creates (or theoretically we might want PUT to upsert)
                    // The POST / implementation in subjects.js creates a NEW subject.
                    // If we want to UPSERT by ID, we should use PUT /:id or modify POST.
                    // However, standard POST often ignores ID or fails if unique.
                    // Let's check subjects.js again. It uses `new Subject({...})`, so it relies on MongoDB _id unless we force `id`.
                    // Our SubjectSchema has `id: String`. If we pass it, it saves it.
                    // If we run this twice, we might get duplicates with same `id` field but different `_id`.
                    // To be safe as a migration tool, let's try to DELETE first if mode is 'replace' (but that's hard individually).
                    // or just use the PUT (Sync) endpoint which I implemented which does `findOneAndUpdate`.
                    // My PUT /:id implementation: `Subject.findOne({ id: req.params.id })`. 
                    // If found, updates. If not found, returns 404 (doesn't create).

                    // So, logic should be: Try PUT. If 404, Try POST.

                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(subject)
                });
            }

            // Re-fetch to update local state
            await fetchData();
            return true;
        } catch (e) {
            console.error("Import failed", e);
            return false;
        }
    };

    const [student, setStudent] = useState<any>(null); // Ideally use StudentType

    // Check for student session
    useEffect(() => {
        const savedStudent = sessionStorage.getItem('student_session');
        if (savedStudent) {
            setStudent(JSON.parse(savedStudent));
        }
    }, []);

    const login = async (email: string, pass: string): Promise<boolean> => {
        try {
            const res = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password: pass })
            });
            const data = await res.json();
            if (res.ok) {
                setStudent(data);
                sessionStorage.setItem('student_session', JSON.stringify(data));

                // Load existing results if any from server
                if (data.results && Array.isArray(data.results)) {
                    setData(prev => ({ ...prev, results: data.results }));
                }
                return true;
            }
            return false;
        } catch (err) {
            return false;
        }
    };

    const signup = async (name: string, email: string, pass: string): Promise<boolean> => {
        try {
            const res = await fetch(`${API_URL}/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password: pass })
            });
            const data = await res.json();
            if (res.ok) {
                setStudent(data);
                sessionStorage.setItem('student_session', JSON.stringify(data));
                return true;
            }
            return false;
        } catch (err) {
            return false;
        }
    };

    const logout = () => {
        setStudent(null);
        sessionStorage.removeItem('student_session');
    };

    const saveResult = async (result: Omit<QuizResult, 'id' | 'date'>) => {
        const newResult = {
            ...result,
            id: generateId('res'),
            date: new Date().toISOString()
        } as QuizResult;

        // Optimistic UI update
        setData(prev => ({
            ...prev,
            results: [...(prev.results || []), newResult]
        }));

        // If logged in, save to server
        if (student) {
            try {
                await fetch(`${API_URL}/student/results`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email: student.email, result: newResult })
                });
            } catch (err) {
                console.error("Failed to save result to server", err);
            }
        } else {
            // Keep in local storage if guest
            const saved = JSON.parse(localStorage.getItem(STORAGE_KEY + '_results') || '[]');
            localStorage.setItem(STORAGE_KEY + '_results', JSON.stringify([...saved, newResult]));
        }
    };

    const resetData = () => {
        // API reset not implemented to avoid accidental server wipe
        alert('Reset function is disabled in server mode.');
    };

    const updatePasscode = async (newPasscode: string) => {
        try {
            await fetch(`${API_URL}/admin/update-passcode`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ newPasscode })
            });
            setAdminPasscode(newPasscode); // Optimistic update usually, but here just sync state
        } catch (err) {
            console.error("Failed to update passcode", err);
        }
    };

    return (
        <DataContext.Provider value={{
            data,
            addSubject,
            updateSubject,
            deleteSubject,
            addChapter,
            updateChapter,
            deleteChapter,
            addQuestion,
            updateQuestion,
            deleteQuestion,
            exportData,
            importData,
            resetData,
            saveResult,
            adminPasscode,
            updatePasscode,
            student,
            login,
            signup,
            logout
        }}>
            {children}
        </DataContext.Provider>
    );
};

export const useData = () => {
    const context = useContext(DataContext);
    if (context === undefined) {
        throw new Error('useData must be used within a DataProvider');
    }
    return context;
};
