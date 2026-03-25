import React from 'react';
import StudentLayout from '@/Layouts/StudentLayout';
import { Head } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';

export default function Index({ enrollments, gpa, totalCredits, trendData }) {
    const cv = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.05 } } };
    const iv = { hidden: { opacity: 0, y: 15 }, visible: { opacity: 1, y: 0, transition: { duration: 0.3 } } };

    return (
        <motion.div variants={cv} initial="hidden" animate="visible" className="space-y-6 pb-12">
            <Head title="Điểm Số" />

            {/* Header & Stats */}
            <motion.div variants={iv} className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                <div className="lg:col-span-2 bg-gradient-to-br from-[#0d1530] to-indigo-900 border border-white/5 rounded-3xl p-8 shadow-xl relative overflow-hidden flex flex-col justify-center">
                    <div className="absolute top-0 right-0 w-80 h-80 bg-violet-500/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
                    <div className="relative z-10">
                        <h2 className="text-3xl font-black font-headline tracking-tight text-white">Kết Quả Học Tập</h2>
                        <p className="text-indigo-200 mt-2 font-medium">Bảng điểm tích lũy và đánh giá quá trình học.</p>
                        
                        <div className="flex flex-wrap gap-6 mt-6">
                            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 flex items-center gap-4 border border-white/10">
                                <span className="material-symbols-outlined text-4xl text-amber-400">social_leaderboard</span>
                                <div>
                                    <p className="text-[10px] uppercase tracking-wider font-bold text-indigo-200">GPA Tích Lũy</p>
                                    <p className="text-2xl font-black text-white font-mono">{gpa || 0} <span className="text-sm text-indigo-300">/ 10</span></p>
                                </div>
                            </div>
                            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 flex items-center gap-4 border border-white/10">
                                <span className="material-symbols-outlined text-4xl text-emerald-400">verified</span>
                                <div>
                                    <p className="text-[10px] uppercase tracking-wider font-bold text-indigo-200">Tín Chỉ Đạt</p>
                                    <p className="text-2xl font-black text-white font-mono">{totalCredits || 0}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Trend Chart */}
                <div className="bg-white dark:bg-slate-800/60 rounded-3xl border border-gray-100 dark:border-slate-700/50 shadow-sm p-5 h-[240px] flex flex-col">
                    <h3 className="text-xs font-bold font-headline uppercase tracking-wider text-gray-500 dark:text-slate-400 mb-4">Biểu đồ GPA</h3>
                    <div className="flex-1 w-full min-h-0">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={trendData || []} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorGpa" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" opacity={0.5} />
                                <XAxis dataKey="semester" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} domain={[0, 10]} />
                                <Tooltip 
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                    itemStyle={{ color: '#8b5cf6', fontWeight: 'bold' }}
                                />
                                <Area type="monotone" dataKey="gpa" name="GPA" stroke="#8b5cf6" strokeWidth={3} fillOpacity={1} fill="url(#colorGpa)" activeDot={{ r: 6, strokeWidth: 0 }} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </motion.div>

            {/* Bảng điểm chi tiết */}
            <motion.div variants={iv} className="bg-white dark:bg-slate-800/60 rounded-3xl border border-gray-100 dark:border-slate-700/50 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-100 dark:border-slate-700/50 flex items-center justify-between">
                    <h3 className="text-lg font-black font-headline text-gray-900 dark:text-white">Chi Tiết Điểm Số</h3>
                    <span className="px-3 py-1 bg-gray-100 dark:bg-slate-700 rounded-lg text-xs font-bold text-gray-600 dark:text-slate-300">Học kỳ 1 - 2025/2026</span>
                </div>
                
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50/50 dark:bg-slate-900/40">
                                <th className="p-4 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-slate-400">Môn Học</th>
                                <th className="p-4 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-slate-400 text-center">Tín Chỉ</th>
                                <th className="p-4 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-slate-400 text-center">Chuyên cần (10%)</th>
                                <th className="p-4 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-slate-400 text-center">Giữa kỳ (20%)</th>
                                <th className="p-4 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-slate-400 text-center">Cuối kỳ (70%)</th>
                                <th className="p-4 text-xs font-bold uppercase tracking-wider text-gray-900 dark:text-white text-center">Tổng Kết</th>
                                <th className="p-4 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-slate-400 text-center">Kết Quả</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-slate-700/50">
                            {(enrollments || []).map(e => {
                                const s = e.score;
                                const isPassed = s?.status === 'passed';
                                const hasScore = s && s.total_score !== null;
                                
                                return (
                                    <tr key={e.id} className="hover:bg-gray-50/50 dark:hover:bg-slate-800/40 transition-colors">
                                        <td className="p-4">
                                            <p className="font-bold text-sm text-gray-900 dark:text-white">{e.subject_name}</p>
                                            <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5">{e.subject_code} • GV: {e.teacher_name}</p>
                                        </td>
                                        <td className="p-4 text-center font-bold text-gray-600 dark:text-slate-300">{e.credits}</td>
                                        
                                        <td className="p-4 text-center text-sm">{s?.attendance_score ?? '-'}</td>
                                        <td className="p-4 text-center text-sm">{s?.midterm_score ?? '-'}</td>
                                        <td className="p-4 text-center text-sm">{s?.final_score ?? '-'}</td>
                                        
                                        <td className="p-4 text-center">
                                            {hasScore ? (
                                                <span className={`text-base font-black font-mono ${isPassed ? 'text-indigo-600 dark:text-indigo-400' : 'text-rose-600 dark:text-rose-400'}`}>
                                                    {s.total_score}
                                                </span>
                                            ) : (
                                                <span className="text-gray-400">-</span>
                                            )}
                                        </td>
                                        <td className="p-4 text-center">
                                            {hasScore ? (
                                                <span className={`inline-flex items-center gap-1 px-2.5 py-1 text-[10px] font-black uppercase rounded-lg ${isPassed ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400' : 'bg-rose-100 dark:bg-rose-500/20 text-rose-700 dark:text-rose-400'}`}>
                                                    {isPassed ? 'Đạt' : 'Hỏng'}
                                                </span>
                                            ) : (
                                                <span className="text-[10px] font-bold uppercase text-gray-400">Đang học</span>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                    
                    {(!enrollments || enrollments.length === 0) && (
                        <div className="text-center py-16 text-gray-400 dark:text-slate-500">
                            Không có dữ liệu điểm số.
                        </div>
                    )}
                </div>
            </motion.div>
        </motion.div>
    );
}

Index.layout = page => <StudentLayout>{page}</StudentLayout>;
