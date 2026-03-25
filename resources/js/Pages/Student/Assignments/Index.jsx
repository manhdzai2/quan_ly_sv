import React, { useState } from 'react';
import StudentLayout from '@/Layouts/StudentLayout';
import { Head, useForm } from '@inertiajs/react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Index({ assignments }) {
    const [selectedId, setSelectedId] = useState(null);
    const { data, setData, post, processing, progress, reset } = useForm({ file: null });

    const openSubmit = (id) => { setSelectedId(id); reset(); };
    const closeSubmit = () => { setSelectedId(null); reset(); };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('student.assignments.submit', selectedId), { preserveScroll: true, onSuccess: () => closeSubmit() });
    };

    const cv = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.05 } } };
    const iv = { hidden: { opacity: 0, y: 15 }, visible: { opacity: 1, y: 0, transition: { duration: 0.3 } } };

    return (
        <motion.div variants={cv} initial="hidden" animate="visible" className="space-y-6 pb-12 relative">
            <Head title="Bài Tập" />

            <motion.div variants={iv} className="bg-gradient-to-r from-blue-600 to-indigo-600 p-8 rounded-3xl shadow-lg text-white mb-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
                <div className="relative z-10">
                    <h2 className="text-3xl font-black font-headline tracking-tight">Trung Tâm Bài Tập</h2>
                    <p className="text-blue-100 mt-2 font-medium">Theo dõi deadline, nộp bài tập và xem phản hồi từ giảng viên.</p>
                </div>
            </motion.div>

            <motion.div variants={cv} className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                {(assignments || []).map(a => {
                    const isDone = a.status === 'submitted' || a.status === 'late_submitted';
                    const isLate = a.status === 'overdue' || a.status === 'late_submitted';
                    
                    return (
                        <motion.div key={a.id} variants={iv} className="bg-white dark:bg-slate-800/60 rounded-2xl border border-gray-100 dark:border-slate-700/50 shadow-sm flex flex-col overflow-hidden relative group">
                            <div className={`absolute top-0 left-0 w-1 h-full ${isDone ? 'bg-emerald-500' : isLate ? 'bg-rose-500' : 'bg-amber-500'}`}></div>
                            
                            <div className="p-6">
                                <div className="flex justify-between items-start gap-4 mb-3">
                                    <h3 className="font-bold text-gray-900 dark:text-white text-lg leading-snug group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{a.title}</h3>
                                    <div className="flex-shrink-0">
                                        {a.status === 'submitted' && <span className="px-2 py-1 bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-[10px] font-black uppercase rounded-lg">Đã Nộp</span>}
                                        {a.status === 'late_submitted' && <span className="px-2 py-1 bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400 text-[10px] font-black uppercase rounded-lg">Nộp Muộn</span>}
                                        {a.status === 'pending' && <span className="px-2 py-1 bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-400 text-[10px] font-black uppercase rounded-lg">Đang Mở</span>}
                                        {a.status === 'overdue' && <span className="px-2 py-1 bg-rose-100 dark:bg-rose-500/20 text-rose-700 dark:text-rose-400 text-[10px] font-black uppercase rounded-lg">Quá Hạn</span>}
                                    </div>
                                </div>
                                
                                <p className="text-xs font-semibold text-gray-500 dark:text-slate-400 mb-4 flex items-center gap-2">
                                    <span className="bg-gray-100 dark:bg-slate-700 px-2 py-0.5 rounded text-gray-700 dark:text-slate-300">{a.subject_name}</span>
                                    <span>GV: {a.teacher_name}</span>
                                </p>
                                
                                <div className="bg-gray-50 dark:bg-slate-900/50 p-3 rounded-xl mb-4 text-xs">
                                    <div className="flex items-center gap-2 font-bold mb-1">
                                        <span className={`material-symbols-outlined text-[16px] ${isLate && !isDone ? 'text-rose-500' : 'text-gray-400'}`}>event</span>
                                        <span className={isLate && !isDone ? 'text-rose-600 dark:text-rose-400' : 'text-gray-700 dark:text-slate-300'}>Hạn chót: {a.deadline}</span>
                                    </div>
                                    {!isDone && !isLate && <div className="text-amber-600 dark:text-amber-500 font-bold ml-6">Còn lại {a.days_left} ngày</div>}
                                </div>
                                
                                <p className="text-sm text-gray-600 dark:text-slate-400 line-clamp-2">{a.description}</p>
                            </div>
                            
                            <div className="mt-auto p-4 border-t border-gray-100 dark:border-slate-700/50 bg-gray-50/50 dark:bg-slate-900/20 flex items-center justify-between">
                                {a.submission ? (
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400 mb-1">
                                            <span className="material-symbols-outlined text-[16px]">task_alt</span>
                                            <span>Đã gửi lúc {a.submission.submitted_at}</span>
                                        </div>
                                        {a.submission.score !== null ? (
                                            <div className="text-sm font-bold text-gray-900 dark:text-white">Điểm: <span className="text-indigo-600 dark:text-indigo-400 text-lg">{a.submission.score}/10</span></div>
                                        ) : (
                                            <div className="text-xs text-gray-500 dark:text-slate-500 italic">Chưa có điểm</div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="text-sm font-bold text-gray-400 dark:text-slate-500">Chưa có bài nộp</div>
                                )}
                                
                                <button onClick={() => openSubmit(a.id)} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-bold transition-all shadow-sm">
                                    {a.submission ? 'Nộp Lại' : 'Nộp Bài'}
                                </button>
                            </div>
                        </motion.div>
                    );
                })}
            </motion.div>

            {(!assignments || assignments.length === 0) && (
                <div className="text-center py-20 bg-white dark:bg-slate-800/60 rounded-2xl border border-gray-100 dark:border-slate-700/50">
                    <span className="material-symbols-outlined text-4xl text-gray-300 dark:text-slate-600 mb-3 block">assignment_turned_in</span>
                    <p className="text-sm font-bold text-gray-500 dark:text-slate-400">Hiện tại không có bài tập nào!</p>
                </div>
            )}

            {/* Upload Modal */}
            <AnimatePresence>
                {selectedId && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                        <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }} className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-3xl shadow-2xl border border-gray-100 dark:border-slate-800 overflow-hidden">
                            <div className="p-6 border-b border-gray-100 dark:border-slate-800 flex items-center justify-between">
                                <div>
                                    <h3 className="text-xl font-bold font-headline text-gray-900 dark:text-white">Nộp Bài Tập</h3>
                                    <p className="text-sm text-gray-500 dark:text-slate-400 font-medium">Chọn file để upload (Tối đa 10MB)</p>
                                </div>
                                <button onClick={closeSubmit} className="w-8 h-8 flex flex-col items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-gray-500 transition-colors">
                                    <span className="material-symbols-outlined text-[20px]">close</span>
                                </button>
                            </div>
                            
                            <form onSubmit={handleSubmit} className="p-6">
                                <div className="border-2 border-dashed border-gray-300 dark:border-slate-700 rounded-2xl p-8 flex flex-col items-center justify-center text-center hover:border-indigo-500 dark:hover:border-indigo-500 transition-colors relative group">
                                    <span className="material-symbols-outlined text-4xl text-gray-400 mb-2 group-hover:text-indigo-500 transition-colors">cloud_upload</span>
                                    <p className="text-sm font-bold text-gray-600 dark:text-slate-300">Nhấn vào đây để tải file lên</p>
                                    <p className="text-xs text-gray-400 mt-1">Hỗ trợ PDF, DOCX, ZIP, MP4...</p>
                                    <input type="file" required onChange={e => setData('file', e.target.files[0])} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                                </div>
                                
                                {data.file && (
                                    <div className="mt-4 p-3 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20 flex items-center gap-3">
                                        <span className="material-symbols-outlined text-indigo-500">draft</span>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-bold text-indigo-900 dark:text-indigo-300 truncate">{data.file.name}</p>
                                            <p className="text-xs text-indigo-600/70 dark:text-indigo-400/70">{(data.file.size / 1024 / 1024).toFixed(2)} MB</p>
                                        </div>
                                    </div>
                                )}
                                
                                {progress && <div className="mt-4 h-2 bg-gray-100 dark:bg-slate-800 rounded-full overflow-hidden"><div className="h-full bg-indigo-500 transition-all duration-300" style={{ width: `${progress.percentage}%` }}></div></div>}

                                <div className="mt-6 flex justify-end gap-3">
                                    <button type="button" onClick={closeSubmit} className="px-5 py-2.5 rounded-xl font-bold text-sm text-gray-600 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors">Hủy</button>
                                    <button type="submit" disabled={!data.file || processing} className="px-6 py-2.5 rounded-xl font-bold text-sm bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm disabled:opacity-50 transition-colors">Lưu Bài</button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}

Index.layout = page => <StudentLayout>{page}</StudentLayout>;
