import React from 'react';
import { ArrowLeft, TrendingUp, Award, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { useData } from '../../context/DataContext';

const Analytics: React.FC = () => {
    const { data } = useData();
    const results = data.results || [];

    // Calculate aggregate stats
    const totalQuizzes = results.length;
    const averageScore = totalQuizzes > 0
        ? Math.round(results.reduce((acc, curr) => acc + curr.percentage, 0) / totalQuizzes)
        : 0;

    // Data for charts
    const progressData = results.map(r => ({
        date: new Date(r.date).toLocaleDateString(),
        score: r.percentage,
        original: r
    })).slice(-10); // Last 10 attempts

    const subjectPerformance = data.subjects.map(sub => {
        const subResults = results.filter(r => r.subjectId === sub.id);
        const avg = subResults.length > 0
            ? Math.round(subResults.reduce((acc, r) => acc + r.percentage, 0) / subResults.length)
            : 0;
        return {
            name: sub.name,
            average: avg,
            attempts: subResults.length
        };
    }).filter(s => s.attempts > 0);

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3">
                <Link to="/" className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors">
                    <ArrowLeft className="h-5 w-5" />
                </Link>
                <h1 className="text-2xl font-bold text-slate-900">Performance Analytics</h1>
            </div>

            {totalQuizzes === 0 ? (
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center">
                    <TrendingUp className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-slate-900">No Data Yet</h3>
                    <p className="text-slate-500 mb-6">Take some quizzes to see your performance metrics!</p>
                    <Link to="/" className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
                        Start Learning
                    </Link>
                </div>
            ) : (
                <div className="space-y-6">
                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-indigo-100 rounded-lg">
                                    <Award className="h-6 w-6 text-indigo-600" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-slate-500">Average Score</p>
                                    <p className="text-2xl font-bold text-slate-900">{averageScore}%</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-green-100 rounded-lg">
                                    <TrendingUp className="h-6 w-6 text-green-600" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-slate-500">Total Quizzes</p>
                                    <p className="text-2xl font-bold text-slate-900">{totalQuizzes}</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-blue-100 rounded-lg">
                                    <Calendar className="h-6 w-6 text-blue-600" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-slate-500">Last Active</p>
                                    <p className="text-lg font-bold text-slate-900">
                                        {new Date(results[results.length - 1].date).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Charts */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Progress Chart */}
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                            <h2 className="text-lg font-semibold text-slate-900 mb-6">Recent Progress</h2>
                            <div className="h-64">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={progressData}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                                        <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} tickLine={false} />
                                        <YAxis stroke="#94a3b8" fontSize={12} domain={[0, 100]} tickLine={false} />
                                        <Tooltip
                                            contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                                        />
                                        <Line
                                            type="monotone"
                                            dataKey="score"
                                            stroke="#4f46e5"
                                            strokeWidth={3}
                                            dot={{ r: 4, strokeWidth: 2, fill: '#fff' }}
                                            activeDot={{ r: 6, fill: '#4f46e5' }}
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Subject Breakdown */}
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                            <h2 className="text-lg font-semibold text-slate-900 mb-6">Topic Strength</h2>
                            <div className="h-64">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={subjectPerformance}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                        <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} />
                                        <YAxis stroke="#94a3b8" fontSize={12} domain={[0, 100]} tickLine={false} />
                                        <Tooltip
                                            cursor={{ fill: '#f8fafc' }}
                                            contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                                        />
                                        <Bar dataKey="average" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Analytics;
