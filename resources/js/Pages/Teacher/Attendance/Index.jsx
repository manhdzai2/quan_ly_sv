import React, { useState } from 'react';
import TeacherLayout from '@/Layouts/TeacherLayout';
import { Head, router, useForm } from '@inertiajs/react';
import { motion } from 'framer-motion';

const statusConfig = {
    present:           { label: 'Có mặt',     icon: 'check_circle',    color: 'bg-emerald-100 text-emerald-700 border-emerald-300 dark:bg-emerald-500/15 dark:text-emerald-400 dark:border-emerald-500/30' },
    late:              { label: 'Đi muộn',     icon: 'schedule',        color: 'bg-amber-100 text-amber-700 border-amber-300 dark:bg-amber-500/15 dark:text-amber-400 dark:border-amber-500/30' },
    absent_excused:    { label: 'Vắng CP',     icon: 'event_busy',      color: 'bg-blue-100 text-blue-700 border-blue-300 dark:bg-blue-500/15 dark:text-blue-400 dark:border-blue-500/30' },
    absent_unexcused:  { label: 'Vắng KP',     icon: 'cancel',          color: 'bg-rose-100 text-rose-700 border-rose-300 dark:bg-rose-500/15 dark:text-rose-400 dark:border-rose-500/30' },
};

export default function Index({ subjects, enrollments, selectedSubjectId, selectedDate }) {
    const [subjectId, setSubjectId] = useState(selectedSubjectId || '');
    const [date, setDate] = useState(selectedDate || new Date().toISOString().split('T')[0]);
    
    // Local state để theo dõi trạng thái từng SV
    const [records, setRecords] = useState(() => {
        if (!enrollments || enrollments.length === 0) return [];
        return enrollments.map(enr => ({
            enrollment_id: enr.enrollment_id,
            status: enr.status || 'present',
            note: enr.note || '',
        }));
    });

    const { post, processing } = useForm();

    // Khi đổi lớp hoặc ngày -> reload data
    const handleFilterChange = (newSubjectId, newDate) => {
        setSubjectId(newSubjectId);
        setDate(newDate);
        router.get(route('teacher.attendance.index'), {
            subject_id: newSubjectId,
            date: newDate,
        }, { preserveState: false });
    };

    // Cập nhật trạng thái 1 SV
    const updateStatus = (index, status) => {
        setRecords(prev => prev.map((r, i) => i === index ? { ...r, status } : r));
    };

    // Đánh dấu tất cả có mặt
    const handleMarkAllPresent = () => {
        setRecords(prev => prev.map(r => ({ ...r, status: 'present' })));
        // Gửi lên server luôn
        router.post(route('teacher.attendance.mark-all-present'), {
            date,
            enrollment_ids: records.map(r => r.enrollment_id),
        }, { preserveScroll: true });
    };

    // Lưu điểm danh hàng loạt
    const handleSave = () => {
        router.post(route('teacher.attendance.store'), {
            date,
            records,
        }, { preserveScroll: true });
    };

    const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.04 } } };
    const itemVariants = { hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0, transition: { duration: 0.3 } } };

    // Thống kê nhanh
    const presentCount = records.filter(r => r.status === 'present').length;
    const lateCount = records.filter(r => r.status === 'late').length;
    const absentCount = records.filter(r => r.status === 'absent_excused' || r.status === 'absent_unexcused').length;

    return (
        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6 pb-12">
            <Head title="Điểm Danh" />

            {/* Header */}
            <motion.div variants={itemVariants}>
                <h2 className="text-3xl font-extrabold font-headline tracking-tight text-gray-900 dark:text-white">Điểm Danh Lớp Học</h2>
                <p className="text-gray-500 dark:text-slate-400 mt-1">Chọn lớp và ngày để bắt đầu điểm danh.</p>
            </motion.div>

            {/* Filters */}
            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4">
                <select
                    value={subjectId}
                    onChange={e => handleFilterChange(e.target.value, date)}
                    className="flex-1 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm font-semibold text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
                >
                    <option value="">— Chọn lớp học —</option>
                    {(subjects || []).map(s => (
                        <option key={s.id} value={s.id}>{s.name} ({s.code})</option>
                    ))}
                </select>
                <input
                    type="date"
                    value={date}
                    onChange={e => handleFilterChange(subjectId, e.target.value)}
                    className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm font-semibold text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
                />
            </motion.div>

            {subjectId && enrollments && enrollments.length > 0 && (
                <>
                    {/* Mini Stats + Actions */}
                    <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div className="flex gap-3">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-xs font-bold border border-emerald-200 dark:border-emerald-500/20">
                                <span className="material-symbols-outlined text-[14px]">check_circle</span> Có mặt: {presentCount}
                            </span>
                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 text-xs font-bold border border-amber-200 dark:border-amber-500/20">
                                <span className="material-symbols-outlined text-[14px]">schedule</span> Muộn: {lateCount}
                            </span>
                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-50 dark:bg-rose-500/10 text-rose-700 dark:text-rose-400 text-xs font-bold border border-rose-200 dark:border-rose-500/20">
                                <span className="material-symbols-outlined text-[14px]">cancel</span> Vắng: {absentCount}
                            </span>
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={handleMarkAllPresent}
                                className="flex items-center gap-2 px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-sm font-bold transition-colors shadow-sm shadow-emerald-500/20"
                            >
                                <span className="material-symbols-outlined text-[18px]">done_all</span>
                                Tất cả có mặt
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={processing}
                                className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-bold transition-colors shadow-sm shadow-indigo-500/20 disabled:opacity-50"
                            >
                                <span className="material-symbols-outlined text-[18px]">save</span>
                                Lưu Điểm Danh
                            </button>
                        </div>
                    </motion.div>

                    {/* Attendance Grid */}
                    <motion.div variants={itemVariants} className="bg-white dark:bg-slate-800/60 rounded-2xl border border-gray-100 dark:border-slate-700/50 shadow-sm overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="bg-gray-50 dark:bg-slate-900/50 border-b border-gray-100 dark:border-slate-700/50 text-[10px] font-bold uppercase tracking-widest text-gray-500 dark:text-slate-400">
                                        <th className="px-5 py-4 w-12 text-center">STT</th>
                                        <th className="px-5 py-4">Sinh viên</th>
                                        <th className="px-3 py-4 text-center">Trạng thái</th>
                                        <th className="px-3 py-4 text-center">Tỷ lệ vắng</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50 dark:divide-slate-700/30">
                                    {enrollments.map((enr, idx) => (
                                        <motion.tr
                                            key={enr.enrollment_id}
                                            variants={itemVariants}
                                            className="hover:bg-gray-50/50 dark:hover:bg-slate-700/20 transition-colors group"
                                        >
                                            <td className="px-5 py-4 text-center text-xs font-bold text-gray-400 dark:text-slate-500">{idx + 1}</td>
                                            <td className="px-5 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-9 h-9 rounded-lg bg-gray-100 dark:bg-slate-700 flex items-center justify-center text-sm font-bold text-gray-600 dark:text-slate-300">
                                                        {enr.student_name?.charAt(0) || 'S'}
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-sm text-gray-900 dark:text-white">{enr.student_name}</p>
                                                        <p className="text-[10px] font-mono text-gray-400 dark:text-slate-500 mt-0.5">{enr.student_code}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-3 py-4">
                                                <div className="flex items-center justify-center gap-1.5 flex-wrap">
                                                    {Object.entries(statusConfig).map(([key, cfg]) => (
                                                        <button
                                                            key={key}
                                                            onClick={() => updateStatus(idx, key)}
                                                            className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-bold border transition-all ${
                                                                records[idx]?.status === key
                                                                    ? cfg.color + ' ring-2 ring-offset-1 ring-current dark:ring-offset-slate-800 scale-105 shadow-sm'
                                                                    : 'bg-gray-50 dark:bg-slate-900/30 text-gray-400 dark:text-slate-500 border-gray-200 dark:border-slate-700 hover:border-gray-300 dark:hover:border-slate-600'
                                                            }`}
                                                            title={cfg.label}
                                                        >
                                                            <span className="material-symbols-outlined text-[14px]">{cfg.icon}</span>
                                                            <span className="hidden sm:inline">{cfg.label}</span>
                                                        </button>
                                                    ))}
                                                </div>
                                            </td>
                                            <td className="px-3 py-4 text-center">
                                                {enr.absent_rate > 20 ? (
                                                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 text-xs font-bold border border-rose-200 dark:border-rose-500/20">
                                                        <span className="material-symbols-outlined text-[14px]">warning</span>
                                                        {enr.absent_rate}%
                                                    </span>
                                                ) : (
                                                    <span className="text-xs font-mono font-bold text-gray-500 dark:text-slate-400">
                                                        {enr.absent_rate}%
                                                    </span>
                                                )}
                                            </td>
                                        </motion.tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </motion.div>
                </>
            )}

            {/* Empty State */}
            {(!subjectId || !enrollments || enrollments.length === 0) && subjectId && (
                <motion.div variants={itemVariants} className="text-center py-20 bg-white dark:bg-slate-800/60 rounded-2xl border border-gray-100 dark:border-slate-700/50">
                    <span className="material-symbols-outlined text-4xl text-gray-300 dark:text-slate-600 mb-3 block">group_off</span>
                    <h3 className="text-sm font-bold text-gray-500 dark:text-slate-400">Không có sinh viên trong lớp này</h3>
                </motion.div>
            )}
        </motion.div>
    );
}

Index.layout = page => <TeacherLayout>{page}</TeacherLayout>;
