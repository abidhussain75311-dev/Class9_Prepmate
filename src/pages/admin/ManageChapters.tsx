import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Plus, Edit2, Trash2, ArrowLeft, FileText, HelpCircle } from 'lucide-react';
import { useData } from '../../context/DataContext';

const ManageChapters: React.FC = () => {
    const { subjectId } = useParams<{ subjectId: string }>();
    const navigate = useNavigate();
    const { data, addChapter, updateChapter, deleteChapter } = useData();

    const subject = data.subjects.find(s => s.id === subjectId);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [chapterTitle, setChapterTitle] = useState('');

    if (!subject) {
        return <div>Subject not found</div>;
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (chapterTitle.trim()) {
            if (editingId) {
                updateChapter(subject.id, editingId, chapterTitle.trim());
            } else {
                addChapter(subject.id, chapterTitle.trim());
            }
            closeModal();
        }
    };

    const openAddModal = () => {
        setEditingId(null);
        setChapterTitle('');
        setIsModalOpen(true);
    };

    const openEditModal = (id: string, title: string) => {
        setEditingId(id);
        setChapterTitle(title);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingId(null);
        setChapterTitle('');
    };

    const handleDelete = (chapterId: string) => {
        if (window.confirm('Are you sure you want to delete this chapter? All questions within it will be lost.')) {
            deleteChapter(subject.id, chapterId);
        }
    };

    return (
        <div className="space-y-6">
            <button
                onClick={() => navigate('/admin/subjects')}
                className="flex items-center text-slate-500 hover:text-slate-900 transition-colors"
            >
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back to Subjects
            </button>

            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">{subject.name} - Chapters</h1>
                    <p className="text-slate-500">Manage chapters and questions for {subject.name}</p>
                </div>
                <button
                    onClick={openAddModal}
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                    <Plus className="h-4 w-4" />
                    Add Chapter
                </button>
            </div>

            <div className="space-y-4">
                {(subject.chapters || []).length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-xl border border-dashed border-slate-300">
                        <p className="text-slate-500">No chapters yet. Click "Add Chapter" to get started.</p>
                    </div>
                ) : (
                    (subject.chapters || []).map((chapter) => (
                        <div key={chapter.id} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="bg-purple-50 p-3 rounded-lg">
                                    <FileText className="h-6 w-6 text-purple-600" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-slate-900">{chapter.title}</h3>
                                    <p className="text-slate-500 text-sm">
                                        {(chapter.questions || []).length} Questions
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <Link
                                    to={`/admin/subjects/${subject.id}/chapters/${chapter.id}/questions`}
                                    className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 rounded-lg hover:bg-indigo-100 transition-colors"
                                >
                                    <HelpCircle className="h-4 w-4" />
                                    Manage Questions
                                </Link>
                                <div className="h-8 w-px bg-slate-200"></div>
                                <button
                                    onClick={() => openEditModal(chapter.id, chapter.title)}
                                    className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                                >
                                    <Edit2 className="h-4 w-4" />
                                </button>
                                <button
                                    onClick={() => handleDelete(chapter.id)}
                                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl p-6 w-full max-w-md">
                        <h2 className="text-xl font-bold mb-4">{editingId ? 'Edit Chapter' : 'Add New Chapter'}</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-slate-700 mb-1">Chapter Title</label>
                                <input
                                    type="text"
                                    value={chapterTitle}
                                    onChange={(e) => setChapterTitle(e.target.value)}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                    placeholder="e.g. Kinematics"
                                    autoFocus
                                />
                            </div>
                            <div className="flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                                >
                                    {editingId ? 'Save Changes' : 'Create Chapter'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageChapters;
