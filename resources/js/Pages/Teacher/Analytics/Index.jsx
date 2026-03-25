import React, { useState } from 'react';
import TeacherLayout from '@/Layouts/TeacherLayout';
import { Head } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

const GRADE_COLORS = { 'Giỏi': '#10b981', 'Khá': '#3b82f6', 'Trung bình': '#f59e0b', 'Yếu': '#ef4444' };
const BAR_COLOR = '#6366f1';

export default function Index({ analytics, subjects }) {
    const [selectedSubject, setSelectedSubject] = useState(null);

    const cv = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.06 } } };
    const iv = { hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0, transition: { duration: 0.35 } } };

    const data = selectedSubject ? (analytics || []).filter(a => a.subject_id === selectedSubject) : (analytics || []);

    return (
        <motion.div variants={cv} initial="hidden" animate="visible" className="space-y-6 pb-12">
            <Head title="Phân Tích Điểm" />

            <motion.div variants={iv} className="flex items-center justify-between flex-wrap gap-3">
                <div>
                    <h2 className="text-3xl font-extrabold font-headline tracking-tight text-gray-900 dark:text-white">Phân Tích & Biểu Đồ</h2>
                    <p className="text-gray-500 dark:text-slate-400 mt-1">Phổ điểm, thống kê theo từng lớp.</p>
                </div>
                <select value={selectedSubject || ''} onChange={e => setSelectedSubject(e.target.value ? Number(e.target.value) : null)} className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm font-semibold text-gray-900 dark:text-white outline-none">
                    <option value="">Tất cả môn</option>
                    {(subjects || []).map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
            </motion.div>

            {data.map((item) => (
                <motion.div key={item.subject_id} variants={iv} className="bg-white dark:bg-slate-800/60 rounded-2xl p-6 border border-gray-100 dark:border-slate-700/50 shadow-sm space-y-5">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white">{item.subject_name}</h3>
                            <p className="text-xs font-mono text-gray-400 dark:text-slate-500">{item.subject_code} • {item.graded_count}/{item.total_students} SV có điểm</p>
                        </div>
                        <div className="flex gap-3">
                            {[
                                { label: 'TB', value: item.avg_score, color: 'text-indigo-600 dark:text-indigo-400' },
                                { label: 'Cao', value: item.max_score, color: 'text-emerald-600 dark:text-emerald-400' },
                                { label: 'Thấp', value: item.min_score, color: 'text-rose-600 dark:text-rose-400' },
                            ].map(s => (
                                <div key={s.label} className="text-center bg-gray-50 dark:bg-slate-900/50 px-3 py-2 rounded-xl border border-gray-100 dark:border-slate-700/30">
                                    <p className="text-[9px] font-bold text-gray-400 dark:text-slate-500 uppercase">{s.label}</p>
                                    <p className={`text-lg font-black font-mono ${s.color}`}>{s.value ?? '-'}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Charts */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Histogram */}
                        <div>
                            <p className="text-xs font-bold text-gray-500 dark:text-slate-400 mb-3 uppercase tracking-wider">Phổ điểm</p>
                            <ResponsiveContainer width="100%" height={220}>
                                <BarChart data={item.histogram}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.15)" />
                                    <XAxis dataKey="range" tick={{ fontSize: 11, fill: '#94a3b8' }} />
                                    <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} allowDecimals={false} />
                                    <Tooltip contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.15)', background: '#1e293b', color: '#fff', fontSize: 12 }} />
                                    <Bar dataKey="count" fill={BAR_COLOR} radius={[6, 6, 0, 0]} name="Số SV" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>

                        {/* Pie — Xếp loại */}
                        <div>
                            <p className="text-xs font-bold text-gray-500 dark:text-slate-400 mb-3 uppercase tracking-wider">Xếp loại</p>
                            <ResponsiveContainer width="100%" height={220}>
                                <PieChart>
                                    <Pie data={Object.entries(item.distribution).map(([name, value]) => ({ name, value }))} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={50} outerRadius={85} paddingAngle={3} label={({ name, value }) => value > 0 ? `${name}: ${value}` : ''} labelLine={false} style={{ fontSize: 11, fontWeight: 700 }}>
                                        {Object.entries(item.distribution).map(([name]) => (
                                            <Cell key={name} fill={GRADE_COLORS[name]} />
                                        ))}
                                    </Pie>
                                    <Legend iconType="circle" wrapperStyle={{ fontSize: 11, fontWeight: 700 }} />
                                    <Tooltip contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.15)', background: '#1e293b', color: '#fff', fontSize: 12 }} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Summary Badges */}
                    <div className="flex gap-2 flex-wrap">
                        {Object.entries(item.distribution).map(([grade, count]) => (
                            <span key={grade} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border" style={{ backgroundColor: GRADE_COLORS[grade] + '15', color: GRADE_COLORS[grade], borderColor: GRADE_COLORS[grade] + '30' }}>
                                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: GRADE_COLORS[grade] }}></span>
                                {grade}: {count} SV
                            </span>
                        ))}
                    </div>
                </motion.div>
            ))}

            {data.length === 0 && (
                <div className="text-center py-20 bg-white dark:bg-slate-800/60 rounded-2xl border border-gray-100 dark:border-slate-700/50">
                    <span className="material-symbols-outlined text-4xl text-gray-300 dark:text-slate-600 mb-3 block">analytics</span>
                    <p className="text-sm font-bold text-gray-500 dark:text-slate-400">Chưa có dữ liệu phân tích</p>
                </div>
            )}
        </motion.div>
    );
}

Index.layout = page => <TeacherLayout>{page}</TeacherLayout>;
