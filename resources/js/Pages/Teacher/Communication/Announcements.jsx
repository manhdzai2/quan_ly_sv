import React, { useState } from 'react';
import TeacherLayout from '@/Layouts/TeacherLayout';
import { Head, useForm, router } from '@inertiajs/react';
import { motion } from 'framer-motion';

const priorityConfig = {
    normal: { label: 'Bình thường', icon: 'info', bg: 'bg-blue-50 dark:bg-blue-500/10', text: 'text-blue-600 dark:text-blue-400', border: 'border-blue-200 dark:border-blue-500/20' },
    important: { label: 'Quan trọng', icon: 'priority_high', bg: 'bg-amber-50 dark:bg-amber-500/10', text: 'text-amber-600 dark:text-amber-400', border: 'border-amber-200 dark:border-amber-500/20' },
    urgent: { label: 'Khẩn cấp', icon: 'warning', bg: 'bg-rose-50 dark:bg-rose-500/10', text: 'text-rose-600 dark:text-rose-400', border: 'border-rose-200 dark:border-rose-500/20' },
};

export default function Announcements({ announcements, subjects }) {
    const [showForm, setShowForm] = useState(false);
    const { data, setData, post, processing, reset } = useForm({
        subject_id: '', title: '', content: '', priority: 'normal',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('teacher.announcements.store'), {
            preserveScroll: true,
            onSuccess: () => { reset(); setShowForm(false); },
        });
    };

    const handleDelete = (id) => {
        if (confirm('Xóa thông báo này?')) {
            router.delete(route('teacher.announcements.destroy', id), { preserveScroll: true });
        }
    };

    const cv = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.05 } } };
    const iv = { hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0, transition: { duration: 0.3 } } };

    return (
        <motion.div variants={cv} initial="hidden" animate="visible" className="space-y-6 pb-12">
            <Head title="Thông Báo" />

            <motion.div variants={iv} className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-extrabold font-headline tracking-tight text-gray-900 dark:text-white">Thông Báo Lớp Học</h2>
                    <p className="text-gray-500 dark:text-slate-400 mt-1">Đăng thông báo cho sinh viên.</p>
                </div>
                <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-bold transition-colors shadow-sm">
                    <span className="material-symbols-outlined text-[18px]">{showForm ? 'close' : 'add_circle'}</span>
                    {showForm ? 'Đóng' : 'Đăng Thông Báo'}
                </button>
            </motion.div>

            {showForm && (
                <motion.form variants={iv} onSubmit={handleSubmit} className="bg-white dark:bg-slate-800/60 rounded-2xl p-6 border border-gray-100 dark:border-slate-700/50 shadow-sm space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <select value={data.subject_id} onChange={e => setData('subject_id', e.target.value)} className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm font-semibold text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500/20">
                            <option value="">Toàn hệ thống</option>
                            {(subjects || []).map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                        </select>
                        <input type="text" value={data.title} onChange={e => setData('title', e.target.value)} required placeholder="Tiêu đề thông báo..." className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm font-semibold text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500/20" />
                        <select value={data.priority} onChange={e => setData('priority', e.target.value)} className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm font-semibold text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500/20">
                            <option value="normal">🔵 Bình thường</option>
                            <option value="important">🟡 Quan trọng</option>
                            <option value="urgent">🔴 Khẩn cấp</option>
                        </select>
                    </div>
                    <textarea value={data.content} onChange={e => setData('content', e.target.value)} required placeholder="Nội dung thông báo..." rows={4} className="w-full bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500/20 resize-none" />
                    <div className="flex justify-end">
                        <button type="submit" disabled={processing} className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-sm font-bold transition-colors disabled:opacity-50">
                            {processing ? 'Đang đăng...' : 'Đăng Thông Báo'}
                        </button>
                    </div>
                </motion.form>
            )}

            <motion.div variants={iv} className="space-y-3">
                {(announcements || []).map((a) => {
                    const cfg = priorityConfig[a.priority] || priorityConfig.normal;
                    return (
                        <motion.div key={a.id} variants={iv} className="bg-white dark:bg-slate-800/60 rounded-2xl p-5 border border-gray-100 dark:border-slate-700/50 shadow-sm group">
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex items-start gap-4 flex-1 min-w-0">
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${cfg.bg} border ${cfg.border}`}>
                                        <span className={`material-symbols-outlined text-lg ${cfg.text}`}>{cfg.icon}</span>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 flex-wrap mb-1">
                                            <h3 className="font-bold text-sm text-gray-900 dark:text-white">{a.title}</h3>
                                            <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-lg ${cfg.bg} ${cfg.text} border ${cfg.border}`}>{cfg.label}</span>
                                        </div>
                                        <p className="text-sm text-gray-600 dark:text-slate-300 leading-relaxed mb-2">{a.content}</p>
                                        <div className="flex gap-3 text-[10px] text-gray-400 dark:text-slate-500">
                                            <span>{a.subject_name}</span>
                                            <span>•</span>
                                            <span>{a.created_at}</span>
                                        </div>
                                    </div>
                                </div>
                                <button onClick={() => handleDelete(a.id)} className="opacity-0 group-hover:opacity-100 text-rose-500 hover:text-rose-600 transition-all p-1 flex-shrink-0">
                                    <span className="material-symbols-outlined text-[18px]">delete</span>
                                </button>
                            </div>
                        </motion.div>
                    );
                })}
            </motion.div>

            {(!announcements || announcements.length === 0) && (
                <div className="text-center py-20 bg-white dark:bg-slate-800/60 rounded-2xl border border-gray-100 dark:border-slate-700/50">
                    <span className="material-symbols-outlined text-4xl text-gray-300 dark:text-slate-600 mb-3 block">campaign</span>
                    <p className="text-sm font-bold text-gray-500 dark:text-slate-400">Chưa có thông báo nào</p>
                </div>
            )}
        </motion.div>
    );
}

Announcements.layout = page => <TeacherLayout>{page}</TeacherLayout>;
