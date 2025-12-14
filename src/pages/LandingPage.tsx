import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, CheckCircle, BarChart2, Zap, ArrowRight, GraduationCap, PlayCircle, FileText } from 'lucide-react';

const LandingPage: React.FC = () => {
    return (
        <div className="min-h-screen bg-slate-50 font-sans">
            {/* Hero Section */}
            <header className="bg-white">
                <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="bg-indigo-600 p-2 rounded-lg">
                            <BookOpen className="h-6 w-6 text-white" />
                        </div>
                        <span className="font-bold text-xl text-slate-900">Class 9 PrepMate</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <Link to="/login" className="px-5 py-2.5 bg-indigo-600 text-white rounded-full font-medium hover:bg-indigo-700 transition-all hover:shadow-lg hover:scale-105 active:scale-95 flex items-center gap-2">
                            Student Login
                            <ArrowRight className="h-4 w-4" />
                        </Link>
                    </div>
                </nav>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
                    <div className="text-center max-w-3xl mx-auto">
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 leading-tight mb-6">
                            Master Your Studies with <span className="text-indigo-600">Confidence</span>
                        </h1>
                        <p className="text-xl text-slate-600 mb-10 leading-relaxed">
                            The ultimate practice companion for Class 9 students.
                            Take quizzes, track progress, and ace your exams with our comprehensive question bank.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link to="/signup" className="w-full sm:w-auto px-8 py-4 bg-indigo-600 text-white rounded-xl font-bold text-lg hover:bg-indigo-700 transition-all hover:shadow-xl hover:-translate-y-1 flex items-center justify-center gap-2">
                                <GraduationCap className="h-5 w-5" />
                                Start Practicing Now (Sign Up)
                            </Link>
                        </div>
                    </div>
                </div>
            </header>

            {/* Features Grid */}
            <section className="py-20 bg-slate-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-slate-900 mb-4">Why Choose PrepMate?</h2>
                        <p className="text-slate-500 max-w-2xl mx-auto">Everything you need to excel in your exams, all in one place.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[
                            {
                                icon: <CheckCircle className="h-6 w-6 text-green-600" />,
                                title: "Detailed Questions",
                                desc: "Comprehensive question bank covering all major chapters and topics."
                            },
                            {
                                icon: <PlayCircle className="h-6 w-6 text-blue-600" />,
                                title: "Practice Mode",
                                desc: "Learn at your own pace with instant feedback and explanations."
                            },
                            {
                                icon: <Zap className="h-6 w-6 text-amber-600" />,
                                title: "Exam Simulation",
                                desc: "Test yourself under timed conditions to build exam temperament."
                            },
                            {
                                icon: <BarChart2 className="h-6 w-6 text-purple-600" />,
                                title: "Performance Analytics",
                                desc: "Track your scores and identify areas for improvement."
                            }
                        ].map((feature, idx) => (
                            <div key={idx} className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-slate-100">
                                <div className="bg-slate-50 w-12 h-12 rounded-xl flex items-center justify-center mb-6">
                                    {feature.icon}
                                </div>
                                <h3 className="text-lg font-bold text-slate-900 mb-3">{feature.title}</h3>
                                <p className="text-slate-500 leading-relaxed text-sm">{feature.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Start Guide */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <div>
                            <h2 className="text-3xl font-bold text-slate-900 mb-6">Five Steps to Success</h2>
                            <p className="text-slate-500 mb-10 text-lg">Follow this simple guide to get the most out of your study sessions.</p>

                            <div className="space-y-8">
                                {[
                                    { step: "01", title: "Select Your Subject", desc: "Choose from our available subjects to start your journey." },
                                    { step: "02", title: "Choose a Chapter", desc: "Pick a specific chapter you want to focus on." },
                                    { step: "03", title: "Pick Your Mode", desc: "Select 'Practice' for learning or 'Exam' for testing." },
                                    { step: "04", title: "Take the Quiz", desc: "Answer diverse questions designed to challenge you." },
                                    { step: "05", title: "Review Results", desc: "Analyze your performance and learn from mistakes." }
                                ].map((step, idx) => (
                                    <div key={idx} className="flex gap-6">
                                        <div className="bg-indigo-50 w-12 h-12 rounded-full flex-shrink-0 flex items-center justify-center font-bold text-indigo-600">
                                            {step.step}
                                        </div>
                                        <div>
                                            <h4 className="text-lg font-bold text-slate-900 mb-2">{step.title}</h4>
                                            <p className="text-slate-500">{step.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-12">
                                <Link to="/student" className="inline-flex items-center gap-2 text-indigo-600 font-bold hover:text-indigo-700 transition-colors">
                                    Start Your First Session <ArrowRight className="h-5 w-5" />
                                </Link>
                            </div>
                        </div>
                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-tr from-indigo-100 to-purple-100 rounded-3xl transform rotate-3 scale-105"></div>
                            <div className="relative bg-white p-8 rounded-3xl shadow-xl border border-slate-100">
                                <div className="space-y-4">
                                    <div className="flex items-center gap-4 mb-6">
                                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                                            <FileText className="h-6 w-6 text-green-600" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-slate-900">Quiz Summary</h3>
                                            <p className="text-xs text-slate-500">Recent Activity</p>
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <div className="h-2 bg-slate-100 rounded-full w-3/4"></div>
                                        <div className="h-2 bg-slate-100 rounded-full w-full"></div>
                                        <div className="h-2 bg-slate-100 rounded-full w-5/6"></div>
                                    </div>
                                    <div className="pt-6 grid grid-cols-2 gap-4">
                                        <div className="bg-slate-50 p-4 rounded-xl text-center">
                                            <p className="text-2xl font-bold text-indigo-600">85%</p>
                                            <p className="text-xs text-slate-500">Average Score</p>
                                        </div>
                                        <div className="bg-slate-50 p-4 rounded-xl text-center">
                                            <p className="text-2xl font-bold text-indigo-600">12</p>
                                            <p className="text-xs text-slate-500">Quizzes Taken</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-slate-900 text-slate-400 py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-2">
                        <div className="bg-slate-800 p-2 rounded-lg">
                            <BookOpen className="h-5 w-5 text-indigo-400" />
                        </div>
                        <span className="font-bold text-white text-lg">Class 9 PrepMate</span>
                    </div>
                    <div className="flex items-center gap-6">
                        <Link to="/admin/login" className="text-sm text-slate-500 hover:text-indigo-400 transition-colors">
                            Admin Login
                        </Link>
                        <p className="text-sm">© {new Date().getFullYear()} All rights reserved. Local Edition.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
