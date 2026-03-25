import React from 'react';
import TeacherLayout from '@/Layouts/TeacherLayout';
import { Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';

export default function Profile({ student }) {
    const user = student?.user;
    const enrollments = student?.enrollments || [];

    const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.06 } } };
    const itemVariants = { hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0, transition: { duration: 0.35 } } };

    const gradeColor = (total) => {
        if (total >= 8.5) return 'text-emerald-600 dark:text-emerald-400';
        if (total >= 7.0) return 'text-blue-600 dark:text-blue-400';
        if (total >= 5.5) return 'text-amber-600 dark:text-amber-400';
        return 'text-rose-600 dark:text-rose-400';
    };

    return (
        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6 pb-12">
            <Head title={`Hồ sơ - ${user?.name || 'Sinh viên'}`} />

            {/* Back */}
            <motion.div variants={itemVariants}>
                <Link href="/teacher/enrollments" className="inline-flex items-center gap-1 text-sm font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors">
                    <span className="material-symbols-outlined text-[18px]">arrow_back</span>
                    Quay lại danh sách
                </Link>
            </motion.div>

            {/* Student Card */}
            <motion.div variants={itemVariants} className="bg-white dark:bg-slate-800/60 rounded-2xl p-6 border border-gray-100 dark:border-slate-700/50 shadow-sm">
                <div className="flex items-center gap-5">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white text-2xl font-black shadow-lg shadow-indigo-500/20">
                        {user?.name?.charAt(0) || 'S'}
                    </div>
                    <div>
                        <h2 className="text-xl font-extrabold text-gray-900 dark:text-white">{user?.name || 'N/A'}</h2>
                        <div className="flex flex-wrap gap-3 mt-2">
                            <span className="text-xs font-bold bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 px-3 py-1 rounded-lg border border-indigo-200 dark:border-indigo-500/20">{student?.student_code}</span>
                            <span className="text-xs font-bold bg-gray-50 dark:bg-slate-700 text-gray-600 dark:text-slate-300 px-3 py-1 rounded-lg border border-gray-200 dark:border-slate-600">
                                {student?.class?.name || 'Chưa phân lớp'}
                            </span>
                            <span className="text-xs font-bold bg-gray-50 dark:bg-slate-700 text-gray-600 dark:text-slate-300 px-3 py-1 rounded-lg border border-gray-200 dark:border-slate-600">
                                📧 {user?.email || ''}
                            </span>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Academic Results */}
            <motion.div variants={itemVariants} className="bg-white dark:bg-slate-800/60 rounded-2xl p-6 border border-gray-100 dark:border-slate-700/50 shadow-sm">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Kết Quả Học Tập</h3>

                {enrollments.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {enrollments.map((enr, idx) => {
                            const score = enr.score;
                            const total = score?.total_score;
                            return (
                                <div key={idx} className="p-4 rounded-xl border border-gray-100 dark:border-slate-700/30 bg-gray-50 dark:bg-slate-900/40">
                                    <div className="flex justify-between items-start mb-3">
                                        <div>
                                            <p className="font-bold text-sm text-gray-900 dark:text-white">{enr.subject?.name || 'N/A'}</p>
                                            <p className="text-[10px] font-mono text-gray-400 dark:text-slate-500 mt-0.5">{enr.subject?.code || ''}</p>
                                        </div>
                                        {total !== null && total !== undefined && (
                                            <span className={`text-2xl font-black ${gradeColor(total)}`}>{total}</span>
                                        )}
                                    </div>
                                    {score && (
                                        <div className="flex gap-1.5 flex-wrap">
                                            {[
                                                { label: 'CC', value: score.attendance_score },
                                                { label: 'TX', value: score.regular_score },
                                                { label: 'KT', value: score.test_score },
                                                { label: 'GK', value: score.midterm_score },
                                                { label: 'CK', value: score.final_score },
                                            ].map(s => (
                                                <div key={s.label} className="text-center bg-white dark:bg-slate-800 px-2.5 py-1.5 rounded-lg border border-gray-200 dark:border-slate-700">
                                                    <p className="text-[9px] font-bold text-gray-400 dark:text-slate-500 uppercase">{s.label}</p>
                                                    <p className="text-sm font-mono font-bold text-gray-900 dark:text-white mt-0.5">{s.value ?? '-'}</p>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <p className="text-sm text-gray-500 dark:text-slate-400 text-center py-8">Sinh viên chưa đăng ký học phần nào.</p>
                )}
            </motion.div>
        </motion.div>
    );
}

Profile.layout = page => <TeacherLayout>{page}</TeacherLayout>;
