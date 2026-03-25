import React, { useState } from 'react';
import TeacherLayout from '@/Layouts/TeacherLayout';
import { Head, useForm, router } from '@inertiajs/react';
import { motion } from 'framer-motion';

const typeIcons = { slide: 'slideshow', pdf: 'picture_as_pdf', video: 'videocam', document: 'description', other: 'attach_file' };
const typeColors = { slide: 'text-orange-500', pdf: 'text-rose-500', video: 'text-purple-500', document: 'text-blue-500', other: 'text-gray-500' };

export default function Index({ materials, subjects }) {
    const [showForm, setShowForm] = useState(false);
    const { data, setData, post, processing, reset } = useForm({
        subject_id: '', title: '', description: '', type: 'document', file: null,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('teacher.materials.store'), {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => { reset(); setShowForm(false); },
        });
    };

    const handleDelete = (id) => {
        if (confirm('Xóa tài liệu này?')) {
            router.delete(route('teacher.materials.destroy', id), { preserveScroll: true });
        }
    };

    const cv = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.05 } } };
    const iv = { hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0, transition: { duration: 0.3 } } };

    return (
        <motion.div variants={cv} initial="hidden" animate="visible" className="space-y-6 pb-12">
            <Head title="Học Liệu" />

            <motion.div variants={iv} className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-extrabold font-headline tracking-tight text-gray-900 dark:text-white">Học Liệu Giảng Dạy</h2>
                    <p className="text-gray-500 dark:text-slate-400 mt-1">Quản lý tài liệu cho các lớp học.</p>
                </div>
                <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-bold transition-colors shadow-sm">
                    <span className="material-symbols-outlined text-[18px]">{showForm ? 'close' : 'upload_file'}</span>
                    {showForm ? 'Đóng' : 'Tải Lên'}
                </button>
            </motion.div>

            {showForm && (
                <motion.form variants={iv} onSubmit={handleSubmit} className="bg-white dark:bg-slate-800/60 rounded-2xl p-6 border border-gray-100 dark:border-slate-700/50 shadow-sm space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <select value={data.subject_id} onChange={e => setData('subject_id', e.target.value)} required className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm font-semibold text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500/20">
                            <option value="">— Chọn môn —</option>
                            {(subjects || []).map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                        </select>
                        <input type="text" value={data.title} onChange={e => setData('title', e.target.value)} required placeholder="Tiêu đề tài liệu..." className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm font-semibold text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500/20" />
                        <select value={data.type} onChange={e => setData('type', e.target.value)} className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm font-semibold text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500/20">
                            <option value="document">Tài liệu</option>
                            <option value="slide">Slide</option>
                            <option value="pdf">PDF</option>
                            <option value="video">Video</option>
                            <option value="other">Khác</option>
                        </select>
                    </div>
                    <textarea value={data.description} onChange={e => setData('description', e.target.value)} placeholder="Mô tả ngắn (tùy chọn)..." rows={2} className="w-full bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500/20 resize-none" />
                    <div className="flex items-center justify-between">
                        <input type="file" onChange={e => setData('file', e.target.files[0])} className="text-sm text-gray-600 dark:text-slate-400 file:mr-3 file:px-4 file:py-2 file:rounded-xl file:border-0 file:bg-indigo-50 file:text-indigo-600 dark:file:bg-indigo-500/10 dark:file:text-indigo-400 file:font-bold file:text-sm file:cursor-pointer" />
                        <button type="submit" disabled={processing} className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-sm font-bold transition-colors disabled:opacity-50">
                            {processing ? 'Đang tải...' : 'Lưu Tài Liệu'}
                        </button>
                    </div>
                </motion.form>
            )}

            {/* Materials Grid */}
            <motion.div variants={iv} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {(materials || []).map((m, i) => (
                    <motion.div key={m.id} variants={iv} whileHover={{ y: -3 }} className="bg-white dark:bg-slate-800/60 rounded-2xl p-5 border border-gray-100 dark:border-slate-700/50 shadow-sm group">
                        <div className="flex items-start justify-between mb-3">
                            <div className="w-10 h-10 rounded-xl bg-gray-50 dark:bg-slate-900/50 flex items-center justify-center">
                                <span className={`material-symbols-outlined ${typeColors[m.type] || typeColors.other}`}>{typeIcons[m.type] || typeIcons.other}</span>
                            </div>
                            <button onClick={() => handleDelete(m.id)} className="opacity-0 group-hover:opacity-100 text-rose-500 hover:text-rose-600 transition-all p-1">
                                <span className="material-symbols-outlined text-[18px]">delete</span>
                            </button>
                        </div>
                        <h3 className="font-bold text-gray-900 dark:text-white text-sm mb-1 line-clamp-2">{m.title}</h3>
                        {m.description && <p className="text-xs text-gray-500 dark:text-slate-400 mb-3 line-clamp-2">{m.description}</p>}
                        <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10 px-2 py-1 rounded-lg">{m.subject?.name || ''}</span>
                            {m.file_name && (
                                <a href={`/storage/${m.file_path}`} target="_blank" className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1">
                                    <span className="material-symbols-outlined text-[14px]">download</span> Tải
                                </a>
                            )}
                        </div>
                    </motion.div>
                ))}
            </motion.div>

            {(!materials || materials.length === 0) && (
                <div className="text-center py-20 bg-white dark:bg-slate-800/60 rounded-2xl border border-gray-100 dark:border-slate-700/50">
                    <span className="material-symbols-outlined text-4xl text-gray-300 dark:text-slate-600 mb-3 block">folder_off</span>
                    <p className="text-sm font-bold text-gray-500 dark:text-slate-400">Chưa có tài liệu nào</p>
                    <p className="text-xs text-gray-400 dark:text-slate-500 mt-1">Nhấn "Tải Lên" để thêm tài liệu mới.</p>
                </div>
            )}
        </motion.div>
    );
}

Index.layout = page => <TeacherLayout>{page}</TeacherLayout>;
