import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit2, Trash2, ChevronRight, Book } from 'lucide-react';
import { useData } from '../../context/DataContext';

const ManageSubjects: React.FC = () => {
    const { data, addSubject, updateSubject, deleteSubject } = useData();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [subjectName, setSubjectName] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (subjectName.trim()) {
            if (editingId) {
                updateSubject(editingId, subjectName.trim());
            } else {
                addSubject(subjectName.trim());
            }
            closeModal();
        }
    };

    const openAddModal = () => {
        setEditingId(null);
        setSubjectName('');
        setIsModalOpen(true);
    };

    const openEditModal = (id: string, name: string) => {
        setEditingId(id);
        setSubjectName(name);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingId(null);
        setSubjectName('');
    };

    const handleDelete = (id: string) => {
        if (window.confirm('Are you sure you want to delete this subject? All chapters and questions within it will be lost.')) {
            deleteSubject(id);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Manage Subjects</h1>
                    <p className="text-slate-500">Create and manage subjects for the curriculum</p>
                </div>
                <button
                    onClick={openAddModal}
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                    <Plus className="h-4 w-4" />
                    Add Subject
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {data.subjects.map((subject) => (
                    <div key={subject.id} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col">
                        <div className="flex justify-between items-start mb-4">
                            <div className="bg-indigo-50 p-3 rounded-lg">
                                <Book className="h-6 w-6 text-indigo-600" />
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => openEditModal(subject.id, subject.name)}
                                    className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                                >
                                    <Edit2 className="h-4 w-4" />
                                </button>
                                <button
                                    onClick={() => handleDelete(subject.id)}
                                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            </div>
                        </div>

                        <h3 className="text-lg font-semibold text-slate-900 mb-2">{subject.name}</h3>
                        <p className="text-slate-500 text-sm mb-6">
                            {(subject.chapters || []).length} Chapters • {(subject.chapters || []).reduce((acc, c) => acc + (c.questions || []).length, 0)} Questions
                        </p>

                        <Link
                            to={`/admin/subjects/${subject.id}`}
                            className="mt-auto flex items-center justify-center gap-2 w-full py-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
                        >
                            Manage Chapters
                            <ChevronRight className="h-4 w-4" />
                        </Link>
                    </div>
                ))}
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl p-6 w-full max-w-md">
                        <h2 className="text-xl font-bold mb-4">{editingId ? 'Edit Subject' : 'Add New Subject'}</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-slate-700 mb-1">Subject Name</label>
                                <input
                                    type="text"
                                    value={subjectName}
                                    onChange={(e) => setSubjectName(e.target.value)}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                    placeholder="e.g. Physics"
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
                                    {editingId ? 'Save Changes' : 'Create Subject'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ManageSubjects;
