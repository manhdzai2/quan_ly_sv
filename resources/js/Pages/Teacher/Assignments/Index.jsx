import React, { useState } from 'react';
import TeacherLayout from '@/Layouts/TeacherLayout';
import { Head, Link, useForm, router } from '@inertiajs/react';
import { motion } from 'framer-motion';

export default function Index({ assignments, subjects }) {
    const [showForm, setShowForm] = useState(false);
    const { data, setData, post, processing, reset } = useForm({
        subject_id: '', title: '', description: '', deadline: '', max_score: '10', file: null,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('teacher.assignments.store'), {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => { reset(); setShowForm(false); },
        });
    };

    const handleDelete = (id) => {
        if (confirm('Xóa bài tập này?')) {
            router.delete(route('teacher.assignments.destroy', id), { preserveScroll: true });
        }
    };

    const cv = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.05 } } };
    const iv = { hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0, transition: { duration: 0.3 } } };

    return (
        <motion.div variants={cv} initial="hidden" animate="visible" className="space-y-6 pb-12">
            <Head title="Bài Tập" />

            <motion.div variants={iv} className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-extrabold font-headline tracking-tight text-gray-900 dark:text-white">Quản Lý Bài Tập</h2>
                    <p className="text-gray-500 dark:text-slate-400 mt-1">Tạo bài tập, đặt deadline, theo dõi bài nộp.</p>
                </div>
                <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-bold transition-colors shadow-sm">
                    <span className="material-symbols-outlined text-[18px]">{showForm ? 'close' : 'add_circle'}</span>
                    {showForm ? 'Đóng' : 'Tạo Bài Tập'}
                </button>
            </motion.div>

            {showForm && (
                <motion.form variants={iv} onSubmit={handleSubmit} className="bg-white dark:bg-slate-800/60 rounded-2xl p-6 border border-gray-100 dark:border-slate-700/50 shadow-sm space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <select value={data.subject_id} onChange={e => setData('subject_id', e.target.value)} required className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm font-semibold text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500/20">
                            <option value="">— Chọn môn —</option>
                            {(subjects || []).map(s => <option key={s.id} value={s.id}>{s.name} ({s.code})</option>)}
                        </select>
                        <input type="text" value={data.title} onChange={e => setData('title', e.target.value)} required placeholder="Tên bài tập..." className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm font-semibold text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500/20" />
                    </div>
                    <textarea value={data.description} onChange={e => setData('description', e.target.value)} placeholder="Yêu cầu bài tập..." rows={3} className="w-full bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500/20 resize-none" />
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="text-xs font-bold text-gray-500 dark:text-slate-400 mb-1 block">Hạn nộp</label>
                            <input type="datetime-local" value={data.deadline} onChange={e => setData('deadline', e.target.value)} required className="w-full bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm font-semibold text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500/20" />
                        </div>
                        <div>
                            <label className="text-xs font-bold text-gray-500 dark:text-slate-400 mb-1 block">Điểm tối đa</label>
                            <input type="number" min="1" max="100" value={data.max_score} onChange={e => setData('max_score', e.target.value)} className="w-full bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm font-semibold text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500/20" />
                        </div>
                        <div>
                            <label className="text-xs font-bold text-gray-500 dark:text-slate-400 mb-1 block">File đề bài</label>
                            <input type="file" onChange={e => setData('file', e.target.files[0])} className="w-full text-sm text-gray-600 dark:text-slate-400 file:mr-2 file:px-3 file:py-2 file:rounded-xl file:border-0 file:bg-indigo-50 file:text-indigo-600 dark:file:bg-indigo-500/10 dark:file:text-indigo-400 file:font-bold file:text-xs file:cursor-pointer" />
                        </div>
                    </div>
                    <div className="flex justify-end">
                        <button type="submit" disabled={processing} className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-sm font-bold transition-colors disabled:opacity-50">
                            {processing ? 'Đang tạo...' : 'Tạo Bài Tập'}
                        </button>
                    </div>
                </motion.form>
            )}

            {/* Assignments List */}
            <motion.div variants={iv} className="space-y-3">
                {(assignments || []).map((a) => (
                    <motion.div key={a.id} variants={iv} whileHover={{ x: 3 }} className="bg-white dark:bg-slate-800/60 rounded-2xl p-5 border border-gray-100 dark:border-slate-700/50 shadow-sm group flex items-center gap-5">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${a.is_past_deadline ? 'bg-rose-50 dark:bg-rose-500/10' : 'bg-emerald-50 dark:bg-emerald-500/10'}`}>
                            <span className={`material-symbols-outlined text-xl ${a.is_past_deadline ? 'text-rose-500' : 'text-emerald-500'}`}>{a.is_past_deadline ? 'event_busy' : 'assignment'}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                            <Link href={route('teacher.assignments.show', a.id)} className="font-bold text-gray-900 dark:text-white text-sm hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">{a.title}</Link>
                            <div className="flex flex-wrap gap-3 mt-1.5">
                                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10 px-2 py-0.5 rounded-lg">{a.subject_name}</span>
                                <span className="text-xs text-gray-500 dark:text-slate-400 flex items-center gap-1">
                                    <span className="material-symbols-outlined text-[14px]">schedule</span> {a.deadline}
                                </span>
                                <span className="text-xs text-gray-500 dark:text-slate-400 flex items-center gap-1">
                                    <span className="material-symbols-outlined text-[14px]">group</span> {a.total_submissions} nộp / {a.graded_count} chấm
                                </span>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all">
                            <Link href={route('teacher.assignments.show', a.id)} className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 transition-colors">
                                <span className="material-symbols-outlined text-[18px]">visibility</span>
                            </Link>
                            <button onClick={() => handleDelete(a.id)} className="p-2 rounded-lg bg-rose-50 dark:bg-rose-500/10 text-rose-500 hover:bg-rose-100 transition-colors">
                                <span className="material-symbols-outlined text-[18px]">delete</span>
                            </button>
                        </div>
                    </motion.div>
                ))}
            </motion.div>

            {(!assignments || assignments.length === 0) && (
                <div className="text-center py-20 bg-white dark:bg-slate-800/60 rounded-2xl border border-gray-100 dark:border-slate-700/50">
                    <span className="material-symbols-outlined text-4xl text-gray-300 dark:text-slate-600 mb-3 block">assignment_late</span>
                    <p className="text-sm font-bold text-gray-500 dark:text-slate-400">Chưa có bài tập nào</p>
                    <p className="text-xs text-gray-400 dark:text-slate-500 mt-1">Nhấn "Tạo Bài Tập" để bắt đầu.</p>
                </div>
            )}
        </motion.div>
    );
}

Index.layout = page => <TeacherLayout>{page}</TeacherLayout>;
