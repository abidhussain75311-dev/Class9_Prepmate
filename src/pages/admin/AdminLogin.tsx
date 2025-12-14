import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, ArrowRight } from 'lucide-react';


const AdminLogin: React.FC = () => {
    const [passcode, setPasscode] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            // API URL from env
            const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
            const res = await fetch(`${API_URL}/admin/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ passcode })
            });

            const data = await res.json();

            if (data.success) {
                sessionStorage.setItem('isAdminAuthenticated', 'true');
                navigate('/admin');
            } else {
                setError('Invalid passcode. Please try again.');
                setPasscode('');
            }
        } catch (err) {
            console.error('Login error', err);
            setError('Server connection failed. Ensure backend is running.');
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center">
            <div className="bg-white p-8 rounded-xl shadow-lg border border-slate-100 w-full max-w-md">
                <div className="text-center mb-8">
                    <div className="bg-indigo-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Lock className="h-8 w-8 text-indigo-600" />
                    </div>
                    <h1 className="text-2xl font-bold text-slate-900">Admin Access</h1>
                    <p className="text-slate-500 mt-2">Enter the passcode to access the admin panel</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Passcode
                        </label>
                        <input
                            type="password"
                            value={passcode}
                            onChange={(e) => {
                                setPasscode(e.target.value);
                                setError('');
                            }}
                            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                            placeholder="Enter passcode"
                            autoFocus
                        />
                        {error && (
                            <p className="mt-2 text-sm text-red-600 animate-in slide-in-from-top-1">
                                {error}
                            </p>
                        )}
                    </div>

                    <button
                        type="submit"
                        className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 font-medium transition-colors hover:shadow-md"
                    >
                        Access Dashboard
                        <ArrowRight className="h-4 w-4" />
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <p className="text-xs text-slate-400">Default passcode: admin123</p>
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;
