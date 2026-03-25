import React from 'react';
import TeacherLayout from '@/Layouts/TeacherLayout';
import { Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';

export default function Dashboard({ todaySchedules, stats, todoItems, announcements }) {
    const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.06 } } };
    const itemVariants = { hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0, transition: { duration: 0.35 } } };

    const timeColors = {
        blue: 'from-blue-500 to-indigo-600',
        green: 'from-emerald-500 to-teal-600',
        purple: 'from-purple-500 to-violet-600',
        orange: 'from-orange-500 to-amber-600',
        red: 'from-rose-500 to-red-600',
    };

    return (
        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-8 pb-12">
            <Head title="Dashboard Giảng Viên" />

            {/* Page Header */}
            <motion.div variants={itemVariants}>
                <h2 className="text-3xl font-extrabold font-headline tracking-tight text-gray-900 dark:text-white">
                    Xin chào, <span className="text-indigo-600 dark:text-indigo-400">Giảng viên</span> 👋
                </h2>
                <p className="text-gray-500 dark:text-slate-400 mt-1">Tổng quan lớp học và công việc hôm nay.</p>
            </motion.div>

            {/* Stats Cards */}
            <motion.div variants={itemVariants} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { label: 'Tổng lớp', value: stats?.totalClasses || 0, icon: 'school', color: 'text-indigo-600 dark:text-indigo-400', bg: 'bg-indigo-50 dark:bg-indigo-500/10' },
                    { label: 'Tổng sinh viên', value: stats?.totalStudents || 0, icon: 'groups', color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-500/10' },
                    { label: 'Chờ chấm điểm', value: stats?.pendingGrades || 0, icon: 'pending_actions', color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-500/10' },
                    { label: 'Chuyên cần TB', value: `${stats?.avgAttendance || 0}%`, icon: 'trending_up', color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-500/10' },
                ].map((s, i) => (
                    <motion.div key={i} whileHover={{ y: -3 }} className="bg-white dark:bg-slate-800/60 rounded-2xl p-5 border border-gray-100 dark:border-slate-700/50 shadow-sm">
                        <div className="flex items-center justify-between mb-3">
                            <div className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center`}>
                                <span className={`material-symbols-outlined text-xl ${s.color}`}>{s.icon}</span>
                            </div>
                        </div>
                        <p className="text-2xl font-black text-gray-900 dark:text-white">{s.value}</p>
                        <p className="text-xs font-semibold text-gray-500 dark:text-slate-400 mt-1 uppercase tracking-wider">{s.label}</p>
                    </motion.div>
                ))}
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Today's Schedule Timeline */}
                <motion.div variants={itemVariants} className="lg:col-span-2 bg-white dark:bg-slate-800/60 rounded-2xl p-6 border border-gray-100 dark:border-slate-700/50 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center">
                                <span className="material-symbols-outlined text-indigo-600 dark:text-indigo-400 text-lg">calendar_today</span>
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Lịch Giảng Dạy Hôm Nay</h3>
                                <p className="text-[10px] uppercase tracking-widest text-gray-500 dark:text-slate-400 font-bold">
                                    {new Date().toLocaleDateString('vi-VN', { weekday: 'long', day: 'numeric', month: 'numeric', year: 'numeric' })}
                                </p>
                            </div>
                        </div>
                    </div>

                    {todaySchedules && todaySchedules.length > 0 ? (
                        <div className="space-y-3">
                            {todaySchedules.map((s, idx) => (
                                <motion.div
                                    key={idx}
                                    whileHover={{ x: 4 }}
                                    className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 dark:bg-slate-900/50 border border-gray-100 dark:border-slate-700/30 group hover:border-indigo-200 dark:hover:border-indigo-500/30 transition-colors"
                                >
                                    <div className={`w-1.5 h-14 rounded-full bg-gradient-to-b ${timeColors[s.color_theme] || timeColors.blue}`}></div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-bold text-gray-900 dark:text-white text-sm truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{s.subject_name}</p>
                                        <div className="flex items-center gap-3 mt-1.5">
                                            <span className="text-xs text-gray-500 dark:text-slate-400 flex items-center gap-1">
                                                <span className="material-symbols-outlined text-[14px]">schedule</span>
                                                {s.start_time} - {s.end_time}
                                            </span>
                                            <span className="text-xs text-gray-500 dark:text-slate-400 flex items-center gap-1">
                                                <span className="material-symbols-outlined text-[14px]">location_on</span>
                                                {s.room}
                                            </span>
                                        </div>
                                    </div>
                                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg border ${
                                        s.type === 'Lý thuyết' ? 'bg-blue-50 text-blue-600 border-blue-200 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20' 
                                        : 'bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20'
                                    }`}>
                                        {s.type}
                                    </span>
                                </motion.div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <span className="material-symbols-outlined text-4xl text-gray-300 dark:text-slate-600 mb-3 block">event_available</span>
                            <p className="text-sm font-bold text-gray-500 dark:text-slate-400">Không có lịch giảng dạy hôm nay</p>
                            <p className="text-xs text-gray-400 dark:text-slate-500 mt-1">Hãy tận hưởng ngày nghỉ! 🎉</p>
                        </div>
                    )}
                </motion.div>

                {/* Right Column: Todo + Announcements */}
                <div className="space-y-6">
                    {/* Todo Items */}
                    <motion.div variants={itemVariants} className="bg-white dark:bg-slate-800/60 rounded-2xl p-6 border border-gray-100 dark:border-slate-700/50 shadow-sm">
                        <div className="flex items-center gap-3 mb-5">
                            <div className="w-9 h-9 rounded-lg bg-amber-50 dark:bg-amber-500/10 flex items-center justify-center">
                                <span className="material-symbols-outlined text-amber-600 dark:text-amber-400 text-lg">checklist</span>
                            </div>
                            <h3 className="font-bold text-gray-900 dark:text-white">Cần xử lý</h3>
                        </div>

                        {todoItems && todoItems.length > 0 ? (
                            <div className="space-y-2.5">
                                {todoItems.map((item, idx) => (
                                    <div key={idx} className={`flex items-start gap-3 p-3 rounded-lg border ${
                                        item.type === 'error' 
                                            ? 'bg-rose-50 dark:bg-rose-500/5 border-rose-200 dark:border-rose-500/20' 
                                            : 'bg-amber-50 dark:bg-amber-500/5 border-amber-200 dark:border-amber-500/20'
                                    }`}>
                                        <span className={`material-symbols-outlined text-lg mt-0.5 ${
                                            item.type === 'error' ? 'text-rose-500' : 'text-amber-500'
                                        }`}>{item.icon}</span>
                                        <p className="text-sm font-medium text-gray-700 dark:text-slate-300">{item.text}</p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-6">
                                <span className="material-symbols-outlined text-3xl text-emerald-400 mb-2 block">task_alt</span>
                                <p className="text-sm text-gray-500 dark:text-slate-400">Không có việc cần xử lý!</p>
                            </div>
                        )}
                    </motion.div>

                    {/* Announcements */}
                    <motion.div variants={itemVariants} className="bg-white dark:bg-slate-800/60 rounded-2xl p-6 border border-gray-100 dark:border-slate-700/50 shadow-sm">
                        <div className="flex items-center gap-3 mb-5">
                            <div className="w-9 h-9 rounded-lg bg-purple-50 dark:bg-purple-500/10 flex items-center justify-center">
                                <span className="material-symbols-outlined text-purple-600 dark:text-purple-400 text-lg">campaign</span>
                            </div>
                            <h3 className="font-bold text-gray-900 dark:text-white">Thông Báo</h3>
                        </div>

                        <div className="space-y-3">
                            {(announcements || []).map((a, idx) => (
                                <div key={idx} className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 dark:bg-slate-900/40 border border-gray-100 dark:border-slate-700/30">
                                    <span className={`material-symbols-outlined text-lg mt-0.5 ${
                                        a.type === 'warning' ? 'text-amber-500' : 'text-indigo-500'
                                    }`}>{a.type === 'warning' ? 'priority_high' : 'info'}</span>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-gray-700 dark:text-slate-300 leading-snug">{a.title}</p>
                                        <p className="text-[10px] text-gray-400 dark:text-slate-500 mt-1 font-mono">{a.date}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Quick Actions */}
            <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Link href="/teacher/enrollments" className="flex items-center gap-4 p-5 bg-white dark:bg-slate-800/60 rounded-2xl border border-gray-100 dark:border-slate-700/50 shadow-sm hover:border-indigo-200 dark:hover:border-indigo-500/30 transition-all group">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                        <span className="material-symbols-outlined text-white text-xl">grading</span>
                    </div>
                    <div>
                        <p className="font-bold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">Nhập Điểm</p>
                        <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5">Chấm điểm cho lớp học</p>
                    </div>
                </Link>
                <Link href="/teacher/attendance" className="flex items-center gap-4 p-5 bg-white dark:bg-slate-800/60 rounded-2xl border border-gray-100 dark:border-slate-700/50 shadow-sm hover:border-emerald-200 dark:hover:border-emerald-500/30 transition-all group">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                        <span className="material-symbols-outlined text-white text-xl">fact_check</span>
                    </div>
                    <div>
                        <p className="font-bold text-gray-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">Điểm Danh</p>
                        <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5">Chốt điểm danh hôm nay</p>
                    </div>
                </Link>
                <Link href="/teacher/enrollments" className="flex items-center gap-4 p-5 bg-white dark:bg-slate-800/60 rounded-2xl border border-gray-100 dark:border-slate-700/50 shadow-sm hover:border-blue-200 dark:hover:border-blue-500/30 transition-all group">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-500/20">
                        <span className="material-symbols-outlined text-white text-xl">description</span>
                    </div>
                    <div>
                        <p className="font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">Danh Sách Lớp</p>
                        <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5">Xem lớp học phụ trách</p>
                    </div>
                </Link>
            </motion.div>
        </motion.div>
    );
}

Dashboard.layout = page => <TeacherLayout>{page}</TeacherLayout>;
