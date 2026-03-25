import React from 'react';
import AppLayout from '@/Layouts/AppLayout';
import { Head, Link } from '@inertiajs/react';

export default function Show({ teacher, courses }) {
    const user = teacher?.user;

    return (
        <div className="space-y-8 animate-fade-in-up pb-12 max-w-6xl mx-auto">
            <Head title={`Chi tiết: ${user?.name}`} />

            <div className="flex items-center justify-between">
                <Link href={route('admin.teachers.index')} className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 dark:text-outline hover:text-indigo-600 dark:hover:text-primary transition-colors">
                    <span className="material-symbols-outlined text-lg">arrow_back</span>
                    Quay lại danh sách
                </Link>
                <Link href={route('admin.teachers.edit', teacher.id)} className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 dark:bg-primary text-white dark:text-on-primary rounded-xl text-sm font-bold hover:-translate-y-0.5 transition-all shadow-lg shadow-indigo-500/20">
                    <span className="material-symbols-outlined text-lg">edit</span>
                    Chỉnh sửa
                </Link>
            </div>

            {/* Profile Card */}
            <div className="bg-white dark:bg-surface-container-low rounded-2xl border border-gray-200 dark:border-outline-variant/10 shadow-sm overflow-hidden">
                <div className="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-primary/10 dark:to-transparent p-8 flex flex-col md:flex-row gap-6 items-center md:items-start">
                    <div className="w-20 h-20 rounded-2xl bg-purple-600 dark:bg-primary flex items-center justify-center text-white text-3xl font-black shadow-lg">
                        {user?.name?.charAt(0) || 'G'}
                    </div>
                    <div className="text-center md:text-left flex-1">
                        <h1 className="text-2xl font-black text-gray-900 dark:text-white">{user?.name}</h1>
                        <div className="flex flex-wrap items-center gap-3 mt-3 justify-center md:justify-start">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white dark:bg-surface-container-highest text-xs font-bold text-gray-600 dark:text-on-surface border border-gray-200 dark:border-outline-variant/10 shadow-sm">
                                <span className="material-symbols-outlined text-[14px] text-indigo-600 dark:text-primary">badge</span>
                                Mã GV: {teacher.id}
                            </span>
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-50 dark:bg-secondary/10 text-xs font-bold text-emerald-600 dark:text-secondary border border-emerald-200 dark:border-secondary/20">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-secondary"></span>
                                Đang hoạt động
                            </span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-gray-100 dark:divide-outline-variant/10">
                    {[
                        { icon: 'mail', label: 'Email', value: user?.email || 'Chưa có' },
                        { icon: 'smartphone', label: 'Số điện thoại', value: teacher.phone || 'Chưa cung cấp' },
                        { icon: 'menu_book', label: 'Số học phần phụ trách', value: `${courses?.length || 0} học phần` },
                    ].map((item, i) => (
                        <div key={i} className="p-5 text-center">
                            <span className="material-symbols-outlined text-gray-400 dark:text-outline text-2xl mb-2 block">{item.icon}</span>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500 dark:text-outline mb-1">{item.label}</p>
                            <p className="text-sm font-bold text-gray-900 dark:text-white">{item.value}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Teaching Subjects */}
            <div className="bg-white dark:bg-surface-container-low rounded-2xl border border-gray-200 dark:border-outline-variant/10 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-200 dark:border-outline-variant/10 bg-gray-50/50 dark:bg-surface-container-low/30 flex items-center gap-3">
                    <div className="w-10 h-10 bg-indigo-50 dark:bg-primary/10 rounded-xl flex items-center justify-center text-indigo-600 dark:text-primary">
                        <span className="material-symbols-outlined">menu_book</span>
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-gray-900 dark:text-white">Học Phần Đang Phụ Trách</h2>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500 dark:text-outline">Tổng: {courses?.length || 0} học phần</p>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left whitespace-nowrap">
                        <thead>
                            <tr className="bg-gray-50 dark:bg-surface-container-low/50 border-b border-gray-200 dark:border-outline-variant/10">
                                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-500 dark:text-outline">Tên Học Phần</th>
                                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-500 dark:text-outline w-28">Mã HP</th>
                                <th className="px-6 py-4 text-center text-[10px] font-bold uppercase tracking-widest text-gray-500 dark:text-outline w-20">Tín Chỉ</th>
                                <th className="px-6 py-4 text-center text-[10px] font-bold uppercase tracking-widest text-gray-500 dark:text-outline w-28">Số SV</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-outline-variant/5">
                            {courses && courses.length > 0 ? courses.map((c, idx) => (
                                <tr key={idx} className="hover:bg-gray-50/50 dark:hover:bg-white/5 transition-colors">
                                    <td className="px-6 py-4 text-sm font-bold text-gray-900 dark:text-white">{c.subject_name}</td>
                                    <td className="px-6 py-4">
                                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 bg-gray-100 dark:bg-surface-container-highest border border-gray-200 dark:border-outline-variant/10 rounded text-gray-600 dark:text-outline">{c.subject_code}</span>
                                    </td>
                                    <td className="px-6 py-4 text-center text-sm font-mono font-bold text-gray-500 dark:text-outline-variant">{c.credits}</td>
                                    <td className="px-6 py-4 text-center">
                                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-primary/10 text-xs font-bold text-indigo-600 dark:text-primary border border-indigo-100 dark:border-primary/20">
                                            <span className="material-symbols-outlined text-[14px]">groups</span>
                                            {c.total_students}
                                        </span>
                                    </td>
                                </tr>
                            )) : (
                                <tr><td colSpan="4" className="px-6 py-12 text-center text-gray-400 dark:text-outline text-sm">Chưa có học phần nào</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

Show.layout = page => <AppLayout children={page} />;
