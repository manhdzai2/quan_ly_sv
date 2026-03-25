import React, { useState } from 'react';
import StudentLayout from '@/Layouts/StudentLayout';
import { Head, useForm } from '@inertiajs/react';
import { motion } from 'framer-motion';

const statusMap = { present: { label: 'Có mặt', icon: 'check_circle', color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-500/10' }, late: { label: 'Muộn', icon: 'schedule', color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-500/10' }, absent_excused: { label: 'Vắng CP', icon: 'event_busy', color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-500/10' }, absent_unexcused: { label: 'Vắng KP', icon: 'cancel', color: 'text-rose-500', bg: 'bg-rose-50 dark:bg-rose-500/10' } };

export default function Index({ attendanceBySubject }) {
    const [expandedSubject, setExpandedSubject] = useState(null);
    const [showLeaveForm, setShowLeaveForm] = useState(false);
    const { data, setData, post, processing, reset } = useForm({ subject_id: '', leave_date: '', reason: '' });

    const handleLeave = (e) => {
        e.preventDefault();
        post(route('student.attendance.leave'), { preserveScroll: true, onSuccess: () => { reset(); setShowLeaveForm(false); } });
    };

    const cv = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.05 } } };
    const iv = { hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0, transition: { duration: 0.3 } } };

    return (
        <motion.div variants={cv} initial="hidden" animate="visible" className="space-y-6 pb-12">
            <Head title="Điểm Danh" />

            <motion.div variants={iv} className="flex items-center justify-between flex-wrap gap-3">
                <div>
                    <h2 className="text-3xl font-extrabold font-headline tracking-tight text-gray-900 dark:text-white">Lịch Sử Điểm Danh</h2>
                    <p className="text-gray-500 dark:text-slate-400 mt-1">Xem chuyên cần và gửi đơn xin nghỉ.</p>
                </div>
                <button onClick={() => setShowLeaveForm(!showLeaveForm)} className="flex items-center gap-2 px-5 py-2.5 bg-violet-600 hover:bg-violet-700 text-white rounded-xl text-sm font-bold transition-colors shadow-sm">
                    <span className="material-symbols-outlined text-[18px]">{showLeaveForm ? 'close' : 'edit_note'}</span>
                    {showLeaveForm ? 'Đóng' : 'Xin Nghỉ'}
                </button>
            </motion.div>

            {/* Warning Bars */}
            {(attendanceBySubject || []).filter(s => s.warning).map(s => (
                <motion.div key={s.subject_id} variants={iv} className="flex items-center gap-3 px-4 py-3 bg-rose-50 dark:bg-rose-500/10 rounded-xl border border-rose-200 dark:border-rose-500/20">
                    <span className="material-symbols-outlined text-rose-500">warning</span>
                    <span className="text-sm font-bold text-rose-700 dark:text-rose-400">⚠️ <b>{s.subject_name}</b>: chuyên cần {s.rate}% — DƯỚI 80%! Có nguy cơ cấm thi.</span>
                </motion.div>
            ))}

            {/* Leave Request Form */}
            {showLeaveForm && (
                <motion.form variants={iv} onSubmit={handleLeave} className="bg-white dark:bg-slate-800/60 rounded-2xl p-6 border border-gray-100 dark:border-slate-700/50 shadow-sm space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <select value={data.subject_id} onChange={e => setData('subject_id', e.target.value)} required className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm font-semibold text-gray-900 dark:text-white outline-none">
                            <option value="">— Chọn môn —</option>
                            {(attendanceBySubject || []).map(s => <option key={s.subject_id} value={s.subject_id}>{s.subject_name}</option>)}
                        </select>
                        <input type="date" value={data.leave_date} onChange={e => setData('leave_date', e.target.value)} required className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm font-semibold text-gray-900 dark:text-white outline-none" />
                        <input type="text" value={data.reason} onChange={e => setData('reason', e.target.value)} required placeholder="Lý do xin nghỉ..." className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm font-semibold text-gray-900 dark:text-white outline-none" />
                    </div>
                    <div className="flex justify-end">
                        <button type="submit" disabled={processing} className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-sm font-bold transition-colors disabled:opacity-50">Gửi Đơn</button>
                    </div>
                </motion.form>
            )}

            {/* Subject Cards */}
            {(attendanceBySubject || []).map(subj => (
                <motion.div key={subj.subject_id} variants={iv} className="bg-white dark:bg-slate-800/60 rounded-2xl border border-gray-100 dark:border-slate-700/50 shadow-sm overflow-hidden">
                    <button onClick={() => setExpandedSubject(expandedSubject === subj.subject_id ? null : subj.subject_id)} className="w-full flex items-center justify-between p-5 hover:bg-gray-50/50 dark:hover:bg-slate-700/20 transition-colors text-left">
                        <div className="flex items-center gap-4">
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-black text-lg ${subj.warning ? 'bg-rose-100 dark:bg-rose-500/15 text-rose-600' : 'bg-emerald-100 dark:bg-emerald-500/15 text-emerald-600'}`}>
                                {subj.rate}%
                            </div>
                            <div>
                                <p className="font-bold text-sm text-gray-900 dark:text-white">{subj.subject_name}</p>
                                <p className="text-[10px] text-gray-400 dark:text-slate-500">{subj.subject_code} • GV: {subj.teacher_name}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="hidden md:flex gap-2">
                                <span className="text-[10px] px-2 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold">✅ {subj.present}</span>
                                <span className="text-[10px] px-2 py-1 rounded-lg bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold">⏰ {subj.late}</span>
                                <span className="text-[10px] px-2 py-1 rounded-lg bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 font-bold">❌ {subj.absent_excused + subj.absent_unexcused}</span>
                            </div>
                            <span className={`material-symbols-outlined text-gray-400 transition-transform ${expandedSubject === subj.subject_id ? 'rotate-180' : ''}`}>expand_more</span>
                        </div>
                    </button>
                    {expandedSubject === subj.subject_id && (
                        <div className="border-t border-gray-100 dark:border-slate-700/30 p-4">
                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
                                {[{ label: 'Có mặt', val: subj.present, c: 'emerald' }, { label: 'Muộn', val: subj.late, c: 'amber' }, { label: 'Vắng CP', val: subj.absent_excused, c: 'blue' }, { label: 'Vắng KP', val: subj.absent_unexcused, c: 'rose' }].map(s => (
                                    <div key={s.label} className={`text-center p-3 rounded-xl bg-${s.c}-50 dark:bg-${s.c}-500/10 border border-${s.c}-200/50 dark:border-${s.c}-500/20`}>
                                        <p className={`text-lg font-black text-${s.c}-600 dark:text-${s.c}-400`}>{s.val}</p>
                                        <p className="text-[9px] font-bold text-gray-500 dark:text-slate-400 uppercase">{s.label}</p>
                                    </div>
                                ))}
                            </div>
                            <div className="space-y-1 max-h-60 overflow-y-auto">
                                {(subj.records || []).map((r, i) => {
                                    const cfg = statusMap[r.status] || statusMap.present;
                                    return (
                                        <div key={i} className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700/20 transition-colors">
                                            <span className={`material-symbols-outlined text-[18px] ${cfg.color}`}>{cfg.icon}</span>
                                            <span className="text-sm font-mono text-gray-600 dark:text-slate-300 w-24">{r.date}</span>
                                            <span className={`text-xs font-bold px-2 py-0.5 rounded-lg ${cfg.bg} ${cfg.color}`}>{cfg.label}</span>
                                            {r.note && <span className="text-xs text-gray-400 dark:text-slate-500 italic">— {r.note}</span>}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </motion.div>
            ))}

            {(!attendanceBySubject || attendanceBySubject.length === 0) && (
                <div className="text-center py-20 bg-white dark:bg-slate-800/60 rounded-2xl border border-gray-100 dark:border-slate-700/50">
                    <span className="material-symbols-outlined text-4xl text-gray-300 dark:text-slate-600 mb-3 block">how_to_reg</span>
                    <p className="text-sm font-bold text-gray-500 dark:text-slate-400">Chưa có dữ liệu điểm danh</p>
                </div>
            )}
        </motion.div>
    );
}

Index.layout = page => <StudentLayout>{page}</StudentLayout>;
