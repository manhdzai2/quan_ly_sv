import React from 'react';
import TeacherLayout from '@/Layouts/TeacherLayout';
import { Head, router } from '@inertiajs/react';
import { motion } from 'framer-motion';

const statusConfig = {
    pending: { label: 'Chờ duyệt', icon: 'hourglass_top', bg: 'bg-amber-50 dark:bg-amber-500/10', text: 'text-amber-600 dark:text-amber-400', border: 'border-amber-200 dark:border-amber-500/20' },
    approved: { label: 'Đã duyệt', icon: 'check_circle', bg: 'bg-emerald-50 dark:bg-emerald-500/10', text: 'text-emerald-600 dark:text-emerald-400', border: 'border-emerald-200 dark:border-emerald-500/20' },
    rejected: { label: 'Từ chối', icon: 'cancel', bg: 'bg-rose-50 dark:bg-rose-500/10', text: 'text-rose-600 dark:text-rose-400', border: 'border-rose-200 dark:border-rose-500/20' },
};

export default function LeaveRequests({ leaveRequests }) {
    const handleAction = (id, status) => {
        const note = status === 'rejected' ? prompt('Lý do từ chối (tùy chọn):') : null;
        router.put(route('teacher.leave-requests.update', id), {
            status,
            teacher_note: note || '',
        }, { preserveScroll: true });
    };

    const cv = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.05 } } };
    const iv = { hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0, transition: { duration: 0.3 } } };

    const pending = (leaveRequests || []).filter(r => r.status === 'pending');
    const processed = (leaveRequests || []).filter(r => r.status !== 'pending');

    return (
        <motion.div variants={cv} initial="hidden" animate="visible" className="space-y-6 pb-12">
            <Head title="Đơn Xin Nghỉ" />

            <motion.div variants={iv}>
                <h2 className="text-3xl font-extrabold font-headline tracking-tight text-gray-900 dark:text-white">Đơn Xin Nghỉ Học</h2>
                <p className="text-gray-500 dark:text-slate-400 mt-1">Phê duyệt hoặc từ chối đơn xin nghỉ của sinh viên.</p>
            </motion.div>

            {/* Pending badge */}
            {pending.length > 0 && (
                <motion.div variants={iv} className="flex items-center gap-2 px-4 py-2.5 bg-amber-50 dark:bg-amber-500/10 rounded-xl border border-amber-200 dark:border-amber-500/20">
                    <span className="material-symbols-outlined text-amber-500">notifications_active</span>
                    <span className="text-sm font-bold text-amber-700 dark:text-amber-400">Có {pending.length} đơn chờ phê duyệt</span>
                </motion.div>
            )}

            {/* Pending Requests */}
            {pending.length > 0 && (
                <motion.div variants={iv} className="space-y-3">
                    <h3 className="text-sm font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wider">Chờ xử lý</h3>
                    {pending.map((r) => (
                        <motion.div key={r.id} variants={iv} className="bg-white dark:bg-slate-800/60 rounded-2xl p-5 border border-amber-200/50 dark:border-amber-500/20 shadow-sm">
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex items-start gap-4 flex-1">
                                    <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-500/10 flex items-center justify-center flex-shrink-0 border border-amber-200 dark:border-amber-500/20">
                                        <span className="material-symbols-outlined text-amber-500">person</span>
                                    </div>
                                    <div>
                                        <p className="font-bold text-sm text-gray-900 dark:text-white">{r.student_name} <span className="text-[10px] font-mono text-gray-400 ml-1">{r.student_code}</span></p>
                                        <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5">{r.subject_name} • Ngày nghỉ: <b>{r.leave_date}</b></p>
                                        <p className="text-sm text-gray-600 dark:text-slate-300 mt-2 leading-relaxed bg-gray-50 dark:bg-slate-900/40 px-3 py-2 rounded-lg">"{r.reason}"</p>
                                        <p className="text-[10px] text-gray-400 dark:text-slate-500 mt-2">Gửi lúc: {r.created_at}</p>
                                    </div>
                                </div>
                                <div className="flex gap-2 flex-shrink-0">
                                    <button onClick={() => handleAction(r.id, 'approved')} className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1">
                                        <span className="material-symbols-outlined text-[16px]">check</span> Duyệt
                                    </button>
                                    <button onClick={() => handleAction(r.id, 'rejected')} className="px-4 py-2 bg-rose-500 hover:bg-rose-600 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1">
                                        <span className="material-symbols-outlined text-[16px]">close</span> Từ chối
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            )}

            {/* Processed Requests */}
            {processed.length > 0 && (
                <motion.div variants={iv} className="space-y-3">
                    <h3 className="text-sm font-bold text-gray-500 dark:text-slate-400 uppercase tracking-wider">Đã xử lý</h3>
                    {processed.map((r) => {
                        const cfg = statusConfig[r.status];
                        return (
                            <motion.div key={r.id} variants={iv} className="bg-white dark:bg-slate-800/60 rounded-2xl p-4 border border-gray-100 dark:border-slate-700/50 shadow-sm opacity-80">
                                <div className="flex items-center gap-4">
                                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${cfg.bg} border ${cfg.border}`}>
                                        <span className={`material-symbols-outlined text-[18px] ${cfg.text}`}>{cfg.icon}</span>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-bold text-sm text-gray-900 dark:text-white">{r.student_name} — {r.subject_name}</p>
                                        <p className="text-xs text-gray-500 dark:text-slate-400">Ngày: {r.leave_date} • {r.reason}</p>
                                    </div>
                                    <span className={`text-xs font-bold px-3 py-1 rounded-lg ${cfg.bg} ${cfg.text} border ${cfg.border}`}>{cfg.label}</span>
                                </div>
                                {r.teacher_note && <p className="text-xs text-gray-500 dark:text-slate-400 mt-2 ml-13 italic">Ghi chú: {r.teacher_note}</p>}
                            </motion.div>
                        );
                    })}
                </motion.div>
            )}

            {(!leaveRequests || leaveRequests.length === 0) && (
                <div className="text-center py-20 bg-white dark:bg-slate-800/60 rounded-2xl border border-gray-100 dark:border-slate-700/50">
                    <span className="material-symbols-outlined text-4xl text-gray-300 dark:text-slate-600 mb-3 block">event_available</span>
                    <p className="text-sm font-bold text-gray-500 dark:text-slate-400">Không có đơn xin nghỉ nào</p>
                </div>
            )}
        </motion.div>
    );
}

LeaveRequests.layout = page => <TeacherLayout>{page}</TeacherLayout>;
