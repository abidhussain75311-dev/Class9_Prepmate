import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { Save, Lock, AlertCircle, CheckCircle } from 'lucide-react';

const AdminSettings: React.FC = () => {
    const { adminPasscode, updatePasscode } = useData();
    const [currentPasscode, setCurrentPasscode] = useState('');
    const [newPasscode, setNewPasscode] = useState('');
    const [confirmPasscode, setConfirmPasscode] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (currentPasscode !== adminPasscode) {
            setError('Current passcode is incorrect.');
            return;
        }

        if (newPasscode.length < 4) {
            setError('New passcode must be at least 4 characters long.');
            return;
        }

        if (newPasscode !== confirmPasscode) {
            setError('New passcodes do not match.');
            return;
        }

        updatePasscode(newPasscode);
        setSuccess('Passcode updated successfully.');
        setCurrentPasscode('');
        setNewPasscode('');
        setConfirmPasscode('');
    };

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-slate-900">Admin Settings</h1>
                <p className="text-slate-500 mt-1">Manage your admin account and preferences</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex items-center gap-3">
                    <div className="bg-indigo-50 p-2 rounded-lg">
                        <Lock className="h-5 w-5 text-indigo-600" />
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold text-slate-900">Change Admin Passcode</h2>
                        <p className="text-sm text-slate-500">Update the passcode used to access the admin panel</p>
                    </div>
                </div>

                <div className="p-6">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {error && (
                            <div className="flex items-center gap-2 p-4 bg-red-50 text-red-700 rounded-lg text-sm">
                                <AlertCircle className="h-4 w-4" />
                                {error}
                            </div>
                        )}
                        {success && (
                            <div className="flex items-center gap-2 p-4 bg-green-50 text-green-700 rounded-lg text-sm">
                                <CheckCircle className="h-4 w-4" />
                                {success}
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">
                                Current Passcode
                            </label>
                            <input
                                type="password"
                                value={currentPasscode}
                                onChange={(e) => setCurrentPasscode(e.target.value)}
                                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                                placeholder="Enter current passcode"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">
                                    New Passcode
                                </label>
                                <input
                                    type="password"
                                    value={newPasscode}
                                    onChange={(e) => setNewPasscode(e.target.value)}
                                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                                    placeholder="Enter new passcode"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">
                                    Confirm New Passcode
                                </label>
                                <input
                                    type="password"
                                    value={confirmPasscode}
                                    onChange={(e) => setConfirmPasscode(e.target.value)}
                                    className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                                    placeholder="Confirm new passcode"
                                />
                            </div>
                        </div>

                        <div className="pt-4 flex justify-end">
                            <button
                                type="submit"
                                className="flex items-center gap-2 px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium transition-colors"
                            >
                                <Save className="h-4 w-4" />
                                Update Passcode
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AdminSettings;
