import React from 'react';
import { Link } from 'react-router-dom';
import { Book, FileText, PlusCircle, Download, Upload } from 'lucide-react';
import { useData } from '../../context/DataContext';

const AdminDashboard: React.FC = () => {
    const { data, exportData, importData } = useData();
    const fileInputRef = React.useRef<HTMLInputElement>(null);

    const [isImportModalOpen, setIsImportModalOpen] = React.useState(false);
    const [importMode, setImportMode] = React.useState<'replace' | 'merge'>('replace');
    const [pendingFileContent, setPendingFileContent] = React.useState<string | null>(null);

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const content = e.target?.result as string;
                setPendingFileContent(content);
                setIsImportModalOpen(true);
            };
            reader.readAsText(file);
        }
        // Reset input so same file can be selected again
        event.target.value = '';
    };

    const confirmImport = async () => {
        if (pendingFileContent) {
            const success = await importData(pendingFileContent, importMode);
            if (success) {
                alert('Data imported successfully!');
                setIsImportModalOpen(false);
                setPendingFileContent(null);
            } else {
                alert('Failed to import data. Invalid format or Server Error.');
            }
        }
    };

    const totalSubjects = data.subjects?.length || 0;
    const totalChapters = data.subjects?.reduce((acc, sub) => acc + (sub.chapters?.length || 0), 0) || 0;
    const totalQuestions = data.subjects?.reduce((acc, sub) =>
        acc + (sub.chapters?.reduce((cAcc, chap) => cAcc + (chap.questions?.length || 0), 0) || 0), 0
    ) || 0;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-slate-900">Admin Dashboard</h1>
                <div className="flex gap-2">
                    <button
                        onClick={exportData}
                        className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50"
                    >
                        <Download className="h-4 w-4" />
                        Export Data
                    </button>
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50"
                    >
                        <Upload className="h-4 w-4" />
                        Import Data
                    </button>
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileSelect}
                        accept=".json"
                        className="hidden"
                    />
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-slate-500">Total Subjects</p>
                            <p className="text-3xl font-bold text-slate-900 mt-1">{totalSubjects}</p>
                        </div>
                        <div className="bg-blue-50 p-3 rounded-lg">
                            <Book className="h-6 w-6 text-blue-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-slate-500">Total Chapters</p>
                            <p className="text-3xl font-bold text-slate-900 mt-1">{totalChapters}</p>
                        </div>
                        <div className="bg-purple-50 p-3 rounded-lg">
                            <FileText className="h-6 w-6 text-purple-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-slate-500">Total Questions</p>
                            <p className="text-3xl font-bold text-slate-900 mt-1">{totalQuestions}</p>
                        </div>
                        <div className="bg-green-50 p-3 rounded-lg">
                            <PlusCircle className="h-6 w-6 text-green-600" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="p-6 border-b border-slate-100">
                    <h2 className="text-lg font-semibold text-slate-900">Quick Actions</h2>
                </div>
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Link
                        to="/admin/subjects"
                        className="flex items-center p-4 border border-slate-200 rounded-lg hover:border-indigo-500 hover:bg-indigo-50 transition-all group"
                    >
                        <div className="bg-indigo-100 p-3 rounded-full mr-4 group-hover:bg-indigo-200">
                            <Book className="h-6 w-6 text-indigo-600" />
                        </div>
                        <div>
                            <h3 className="font-medium text-slate-900">Manage Subjects</h3>
                            <p className="text-sm text-slate-500">Add, edit, or remove subjects</p>
                        </div>
                    </Link>

                    <Link
                        to="/admin/subjects"
                        className="flex items-center p-4 border border-slate-200 rounded-lg hover:border-indigo-500 hover:bg-indigo-50 transition-all group"
                    >
                        <div className="bg-indigo-100 p-3 rounded-full mr-4 group-hover:bg-indigo-200">
                            <PlusCircle className="h-6 w-6 text-indigo-600" />
                        </div>
                        <div>
                            <h3 className="font-medium text-slate-900">Add Questions</h3>
                            <p className="text-sm text-slate-500">Create new MCQs or subjective questions</p>
                        </div>
                    </Link>
                </div>
            </div>

            {/* Import Modal */}
            {isImportModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl p-6 w-full max-w-md">
                        <h2 className="text-xl font-bold mb-4">Import Data</h2>
                        <p className="text-slate-600 mb-4">How would you like to import this data?</p>

                        <div className="space-y-3 mb-6">
                            <label className="flex items-start gap-3 p-3 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50">
                                <input
                                    type="radio"
                                    name="importMode"
                                    value="merge"
                                    checked={importMode === 'merge'}
                                    onChange={() => setImportMode('merge')}
                                    className="mt-1"
                                />
                                <div>
                                    <span className="block font-medium text-slate-900">Merge with existing data</span>
                                    <span className="block text-sm text-slate-500">Adds new subjects, chapters, and questions. Existing data is preserved.</span>
                                </div>
                            </label>

                            <label className="flex items-start gap-3 p-3 border border-red-200 bg-red-50 rounded-lg cursor-pointer hover:bg-red-100">
                                <input
                                    type="radio"
                                    name="importMode"
                                    value="replace"
                                    checked={importMode === 'replace'}
                                    onChange={() => setImportMode('replace')}
                                    className="mt-1"
                                />
                                <div>
                                    <span className="block font-medium text-red-900">Replace all data</span>
                                    <span className="block text-sm text-red-700">Warning: This will delete ALL existing subjects and questions.</span>
                                </div>
                            </label>
                        </div>

                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => {
                                    setIsImportModalOpen(false);
                                    setPendingFileContent(null);
                                }}
                                className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmImport}
                                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                            >
                                Import Data
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
