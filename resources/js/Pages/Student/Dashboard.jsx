import React from 'react';
import StudentLayout from '@/Layouts/StudentLayout';
import { Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';

/* ─── SVG Progress Ring ──────────────────────── */
function ProgressRing({ value, max, size = 120, stroke = 10, color = '#8b5cf6', label, sublabel }) {
    const radius = (size - stroke) / 2;
    const circ = 2 * Math.PI * radius;
    const pct = max > 0 ? Math.min(value / max, 1) : 0;
    return (
        <div className="flex flex-col items-center">
            <svg width={size} height={size} className="-rotate-90">
                <circle cx={size/2} cy={size/2} r={radius} fill="none" stroke="currentColor" strokeWidth={stroke} className="text-gray-200 dark:text-slate-700/50" />
                <circle cx={size/2} cy={size/2} r={radius} fill="none" stroke={color} strokeWidth={stroke} strokeDasharray={circ} strokeDashoffset={circ * (1 - pct)} strokeLinecap="round" className="transition-all duration-1000 ease-out" />
            </svg>
            <div className="absolute flex flex-col items-center justify-center" style={{ width: size, height: size }}>
                <span className="text-2xl font-black font-mono" style={{ color }}>{typeof value === 'number' ? value : '-'}</span>
                {sublabel && <span className="text-[9px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wider">{sublabel}</span>}
            </div>
            {label && <p className="text-xs font-bold text-gray-500 dark:text-slate-400 mt-2">{label}</p>}
        </div>
    );
}

export default function Dashboard({ todayClasses, stats, deadlines, gpa, totalCredits, attendanceRate, studentName }) {
    const cv = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.06 } } };
    const iv = { hidden: { opacity: 0, y: 14 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [.25,.46,.45,.94] } } };

    const greeting = (() => {
        const h = new Date().getHours();
        if (h < 12) return 'Chào buổi sáng';
        if (h < 18) return 'Chào buổi chiều';
        return 'Chào buổi tối';
    })();

    return (
        <motion.div variants={cv} initial="hidden" animate="visible" className="space-y-6 pb-12">
            <Head title="Tổng Quan" />

            {/* ═══ HERO BANNER ═══ */}
            <motion.div variants={iv} className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-violet-600 via-indigo-600 to-purple-700 p-6 lg:p-8 text-white shadow-xl shadow-indigo-500/15">
                <div className="absolute top-0 right-0 w-72 h-72 bg-white/5 rounded-full -mr-20 -mt-20"></div>
                <div className="absolute bottom-0 left-0 w-40 h-40 bg-white/5 rounded-full -ml-10 -mb-10"></div>
                <div className="relative z-10 flex items-center justify-between flex-wrap gap-6">
                    <div>
                        <p className="text-violet-200 text-sm font-semibold">{greeting} 👋</p>
                        <h1 className="text-2xl lg:text-3xl font-extrabold tracking-tight mt-1">{studentName}</h1>
                        <p className="text-violet-200/80 text-sm mt-2">Hôm nay bạn có <b className="text-white">{(todayClasses || []).length} ca học</b> và <b className="text-white">{stats?.pendingAssignments || 0} bài tập</b> chưa nộp.</p>
                    </div>
                    <div className="flex gap-4 lg:gap-6">
                        <div className="relative">
                            <ProgressRing value={gpa || 0} max={10} size={100} stroke={8} color="#fbbf24" sublabel="/ 10" />
                            <p className="text-xs font-bold text-center text-violet-200 mt-1">GPA</p>
                        </div>
                        <div className="relative">
                            <ProgressRing value={attendanceRate || 0} max={100} size={100} stroke={8} color={attendanceRate >= 80 ? '#34d399' : '#f87171'} sublabel="%" />
                            <p className="text-xs font-bold text-center text-violet-200 mt-1">Chuyên cần</p>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* ═══ STATS CARDS ═══ */}
            <motion.div variants={iv} className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
                {[
                    { icon: 'menu_book', label: 'Số môn', value: stats?.totalSubjects || 0, color: 'from-violet-500 to-indigo-600' },
                    { icon: 'school', label: 'Tín chỉ', value: totalCredits || 0, color: 'from-blue-500 to-cyan-500' },
                    { icon: 'assignment_late', label: 'Chưa nộp', value: stats?.pendingAssignments || 0, color: 'from-amber-500 to-orange-500' },
                    { icon: 'how_to_reg', label: 'Chuyên cần', value: `${attendanceRate || 0}%`, color: 'from-emerald-500 to-teal-500' },
                ].map(s => (
                    <motion.div key={s.label} variants={iv} whileHover={{ y: -3 }} className="bg-white dark:bg-slate-800/60 rounded-2xl p-4 border border-gray-100 dark:border-slate-700/50 shadow-sm">
                        <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center mb-3`}>
                            <span className="material-symbols-outlined text-white text-lg">{s.icon}</span>
                        </div>
                        <p className="text-xl font-black text-gray-900 dark:text-white font-mono">{s.value}</p>
                        <p className="text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wider mt-0.5">{s.label}</p>
                    </motion.div>
                ))}
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
                {/* ═══ LỊCH HÔM NAY ═══ */}
                <motion.div variants={iv} className="bg-white dark:bg-slate-800/60 rounded-2xl p-5 border border-gray-100 dark:border-slate-700/50 shadow-sm">
                    <div className="flex items-center gap-2 mb-4">
                        <span className="material-symbols-outlined text-violet-500">today</span>
                        <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">Lịch hôm nay</h3>
                    </div>
                    {(todayClasses || []).length > 0 ? (
                        <div className="space-y-3">
                            {todayClasses.map((c, i) => (
                                <div key={i} className="flex items-center gap-4 p-3 rounded-xl bg-gray-50 dark:bg-slate-900/40 border border-gray-100 dark:border-slate-700/30">
                                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex flex-col items-center justify-center text-white flex-shrink-0">
                                        <span className="text-sm font-black">{c.start_time}</span>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-bold text-sm text-gray-900 dark:text-white truncate">{c.subject_name}</p>
                                        <div className="flex items-center gap-2 mt-0.5">
                                            <span className="text-[10px] text-gray-400 dark:text-slate-500 flex items-center gap-0.5">
                                                <span className="material-symbols-outlined text-[12px]">location_on</span> {c.room}
                                            </span>
                                            <span className="text-[10px] text-gray-400 dark:text-slate-500">{c.start_time} - {c.end_time}</span>
                                            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-violet-50 dark:bg-violet-500/10 text-violet-600 dark:text-violet-400">{c.type}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8">
                            <span className="material-symbols-outlined text-3xl text-gray-300 dark:text-slate-600">event_available</span>
                            <p className="text-sm text-gray-400 dark:text-slate-500 mt-2 font-semibold">Không có lịch hôm nay 🎉</p>
                        </div>
                    )}
                </motion.div>

                {/* ═══ DEADLINES SẮP TỚI ═══ */}
                <motion.div variants={iv} className="bg-white dark:bg-slate-800/60 rounded-2xl p-5 border border-gray-100 dark:border-slate-700/50 shadow-sm">
                    <div className="flex items-center gap-2 mb-4">
                        <span className="material-symbols-outlined text-amber-500">timer</span>
                        <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">Hạn chót sắp tới</h3>
                    </div>
                    {(deadlines || []).length > 0 ? (
                        <div className="space-y-3">
                            {deadlines.map((d) => (
                                <div key={d.id} className="flex items-center gap-4 p-3 rounded-xl bg-gray-50 dark:bg-slate-900/40 border border-gray-100 dark:border-slate-700/30 group">
                                    <div className={`w-12 h-12 rounded-xl flex flex-col items-center justify-center flex-shrink-0 font-black text-xs ${d.days_left <= 2 ? 'bg-rose-100 dark:bg-rose-500/15 text-rose-600 dark:text-rose-400' : 'bg-amber-100 dark:bg-amber-500/15 text-amber-600 dark:text-amber-400'}`}>
                                        <span className="text-lg font-black">{d.days_left}</span>
                                        <span className="text-[8px] uppercase">ngày</span>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-bold text-sm text-gray-900 dark:text-white truncate">{d.title}</p>
                                        <div className="flex items-center gap-2 mt-0.5">
                                            <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10 px-1.5 py-0.5 rounded">{d.subject_name}</span>
                                            <span className="text-[10px] text-gray-400 dark:text-slate-500 flex items-center gap-0.5">
                                                <span className="material-symbols-outlined text-[12px]">schedule</span> {d.deadline}
                                            </span>
                                        </div>
                                    </div>
                                    {d.submitted ? (
                                        <span className="px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold flex items-center gap-1 flex-shrink-0">
                                            <span className="material-symbols-outlined text-[14px]">check_circle</span> Đã nộp
                                        </span>
                                    ) : (
                                        <span className="px-2.5 py-1 rounded-lg bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 text-[10px] font-bold flex-shrink-0">Chưa nộp</span>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8">
                            <span className="material-symbols-outlined text-3xl text-gray-300 dark:text-slate-600">task_alt</span>
                            <p className="text-sm text-gray-400 dark:text-slate-500 mt-2 font-semibold">Không có deadline nào sắp tới!</p>
                        </div>
                    )}
                </motion.div>
            </div>
        </motion.div>
    );
}

Dashboard.layout = page => <StudentLayout>{page}</StudentLayout>;
