import React, { useState } from 'react';
import TeacherLayout from '@/Layouts/TeacherLayout';
import { Head, Link, router } from '@inertiajs/react';
import { motion } from 'framer-motion';

export default function Show({ assignment, students }) {
    const [grading, setGrading] = useState({}); // { submission_id: { score, feedback } }

    const handleGrade = (submissionId) => {
        const data = grading[submissionId];
        if (!data || data.score === undefined) return alert('Vui lòng nhập điểm!');
        
        router.post(route('teacher.assignments.grade'), {
            submission_id: submissionId,
            score: data.score,
            feedback: data.feedback || '',
        }, { preserveScroll: true });
    };

    const cv = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.04 } } };
    const iv = { hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0, transition: { duration: 0.3 } } };

    const submittedCount = (students || []).filter(s => s.submitted).length;
    const notSubmittedCount = (students || []).length - submittedCount;

    return (
        <motion.div variants={cv} initial="hidden" animate="visible" className="space-y-6 pb-12">
            <Head title={assignment?.title || 'Chi tiết Bài tập'} />

            {/* Back */}
            <motion.div variants={iv}>
                <Link href="/teacher/assignments" className="inline-flex items-center gap-1 text-sm font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 transition-colors">
                    <span className="material-symbols-outlined text-[18px]">arrow_back</span> Quay lại
                </Link>
            </motion.div>

            {/* Assignment Info */}
            <motion.div variants={iv} className="bg-white dark:bg-slate-800/60 rounded-2xl p-6 border border-gray-100 dark:border-slate-700/50 shadow-sm">
                <div className="flex items-start justify-between">
                    <div>
                        <h2 className="text-xl font-extrabold text-gray-900 dark:text-white">{assignment?.title}</h2>
                        <div className="flex flex-wrap gap-3 mt-2">
                            <span className="text-xs font-bold bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 px-3 py-1 rounded-lg">{assignment?.subject_name}</span>
                            <span className="text-xs text-gray-500 dark:text-slate-400 flex items-center gap-1">
                                <span className="material-symbols-outlined text-[14px]">schedule</span> Hạn: {assignment?.deadline}
                            </span>
                            <span className="text-xs text-gray-500 dark:text-slate-400">Điểm tối đa: {assignment?.max_score}</span>
                        </div>
                        {assignment?.description && (
                            <p className="text-sm text-gray-600 dark:text-slate-300 mt-3 leading-relaxed">{assignment.description}</p>
                        )}
                    </div>
                </div>

                {/* Mini Stats */}
                <div className="flex gap-3 mt-4">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-xs font-bold border border-emerald-200 dark:border-emerald-500/20">
                        <span className="material-symbols-outlined text-[14px]">check_circle</span> Đã nộp: {submittedCount}
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-50 dark:bg-rose-500/10 text-rose-700 dark:text-rose-400 text-xs font-bold border border-rose-200 dark:border-rose-500/20">
                        <span className="material-symbols-outlined text-[14px]">cancel</span> Chưa nộp: {notSubmittedCount}
                    </span>
                </div>
            </motion.div>

            {/* Students Table */}
            <motion.div variants={iv} className="bg-white dark:bg-slate-800/60 rounded-2xl border border-gray-100 dark:border-slate-700/50 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-50 dark:bg-slate-900/50 border-b border-gray-100 dark:border-slate-700/50 text-[10px] font-bold uppercase tracking-widest text-gray-500 dark:text-slate-400">
                                <th className="px-5 py-4 w-12 text-center">STT</th>
                                <th className="px-5 py-4">Sinh viên</th>
                                <th className="px-4 py-4 text-center">Trạng thái</th>
                                <th className="px-4 py-4 text-center">Thời gian nộp</th>
                                <th className="px-4 py-4 text-center">Điểm</th>
                                <th className="px-4 py-4 text-center">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50 dark:divide-slate-700/30">
                            {(students || []).map((s, idx) => (
                                <tr key={idx} className="hover:bg-gray-50/50 dark:hover:bg-slate-700/20 transition-colors">
                                    <td className="px-5 py-4 text-center text-xs font-bold text-gray-400">{idx + 1}</td>
                                    <td className="px-5 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-slate-700 flex items-center justify-center text-sm font-bold text-gray-600 dark:text-slate-300">{s.student_name?.charAt(0)}</div>
                                            <div>
                                                <p className="font-bold text-sm text-gray-900 dark:text-white">{s.student_name}</p>
                                                <p className="text-[10px] font-mono text-gray-400">{s.student_code}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-4 text-center">
                                        {s.submitted ? (
                                            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold ${s.is_late ? 'bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400' : 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'}`}>
                                                <span className="material-symbols-outlined text-[14px]">{s.is_late ? 'schedule' : 'check_circle'}</span>
                                                {s.is_late ? 'Muộn' : 'Đã nộp'}
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 text-xs font-bold">
                                                <span className="material-symbols-outlined text-[14px]">cancel</span> Chưa nộp
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-4 py-4 text-center text-xs font-mono text-gray-500 dark:text-slate-400">{s.submitted_at || '-'}</td>
                                    <td className="px-4 py-4 text-center">
                                        {s.submitted && s.submission_id ? (
                                            <input
                                                type="number" min="0" max={assignment?.max_score} step="0.5"
                                                value={grading[s.submission_id]?.score ?? s.score ?? ''}
                                                onChange={e => setGrading(prev => ({ ...prev, [s.submission_id]: { ...prev[s.submission_id], score: e.target.value } }))}
                                                className="w-16 px-2 py-1.5 text-center text-sm font-mono border border-gray-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-indigo-500/20"
                                                placeholder="—"
                                            />
                                        ) : <span className="text-xs text-gray-400">—</span>}
                                    </td>
                                    <td className="px-4 py-4 text-center">
                                        {s.submitted && s.submission_id && (
                                            <button onClick={() => handleGrade(s.submission_id)} className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition-colors">
                                                Chấm
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </motion.div>
        </motion.div>
    );
}

Show.layout = page => <TeacherLayout>{page}</TeacherLayout>;
