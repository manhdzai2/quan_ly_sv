import React from 'react';
import AppLayout from '@/Layouts/AppLayout';
import { Head, Link } from '@inertiajs/react';

export default function Show({ classData, students, subjects }) {
    const totalCredits = subjects ? subjects.reduce((sum, s) => sum + (s.credits || 0), 0) : 0;

    return (
        <div className="space-y-8 animate-fade-in-up pb-12 max-w-7xl mx-auto">
            <Head title={`Chi tiết: ${classData?.name}`} />

            <div className="flex items-center justify-between">
                <Link href={route('admin.classes.index')} className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 dark:text-outline hover:text-indigo-600 dark:hover:text-primary transition-colors">
                    <span className="material-symbols-outlined text-lg">arrow_back</span>
                    Quay lại danh sách
                </Link>
            </div>

            {/* Header Card */}
            <div className="bg-white dark:bg-surface-container-low rounded-2xl border border-gray-200 dark:border-outline-variant/10 shadow-sm overflow-hidden">
                <div className="bg-gradient-to-r from-orange-50 to-amber-50 dark:from-tertiary/10 dark:to-transparent p-8 flex flex-col md:flex-row gap-6 items-center md:items-start">
                    <div className="w-16 h-16 rounded-2xl bg-orange-500 dark:bg-tertiary flex items-center justify-center text-white text-2xl font-black shadow-lg">
                        <span className="material-symbols-outlined text-3xl">class</span>
                    </div>
                    <div className="text-center md:text-left flex-1">
                        <h1 className="text-2xl font-black text-gray-900 dark:text-white">{classData?.name}</h1>
                        <p className="text-sm text-gray-600 dark:text-on-surface-variant mt-1">{classData?.description || 'Lớp sinh viên chính quy'}</p>
                    </div>
                    <div className="flex gap-4">
                        <div className="text-center px-5 py-3 bg-white dark:bg-surface-container-highest rounded-xl border border-gray-200 dark:border-outline-variant/10 shadow-sm">
                            <span className="text-2xl font-black text-indigo-600 dark:text-primary block">{students?.length || 0}</span>
                            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500 dark:text-outline">Sinh viên</span>
                        </div>
                        <div className="text-center px-5 py-3 bg-white dark:bg-surface-container-highest rounded-xl border border-gray-200 dark:border-outline-variant/10 shadow-sm">
                            <span className="text-2xl font-black text-emerald-600 dark:text-secondary block">{subjects?.length || 0}</span>
                            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500 dark:text-outline">Học phần</span>
                        </div>
                        <div className="text-center px-5 py-3 bg-white dark:bg-surface-container-highest rounded-xl border border-gray-200 dark:border-outline-variant/10 shadow-sm">
                            <span className="text-2xl font-black text-purple-600 dark:text-primary-fixed-dim block">{totalCredits}</span>
                            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500 dark:text-outline">Tín chỉ</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Subjects List */}
                <div className="bg-white dark:bg-surface-container-low rounded-2xl border border-gray-200 dark:border-outline-variant/10 shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-gray-200 dark:border-outline-variant/10 bg-gray-50/50 dark:bg-surface-container-low/30 flex items-center gap-3">
                        <div className="w-10 h-10 bg-emerald-50 dark:bg-secondary/10 rounded-xl flex items-center justify-center text-emerald-600 dark:text-secondary">
                            <span className="material-symbols-outlined">menu_book</span>
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Chương Trình Đào Tạo</h2>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500 dark:text-outline">Các môn học trong chương trình</p>
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left whitespace-nowrap">
                            <thead>
                                <tr className="bg-gray-50 dark:bg-surface-container-low/50 border-b border-gray-200 dark:border-outline-variant/10">
                                    <th className="px-6 py-3 text-[10px] font-bold uppercase tracking-widest text-gray-500 dark:text-outline">Tên Học Phần</th>
                                    <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-gray-500 dark:text-outline w-20">Mã HP</th>
                                    <th className="px-4 py-3 text-center text-[10px] font-bold uppercase tracking-widest text-gray-500 dark:text-outline w-16">TC</th>
                                    <th className="px-4 py-3 text-center text-[10px] font-bold uppercase tracking-widest text-gray-500 dark:text-outline w-16">SV</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-outline-variant/5">
                                {subjects && subjects.length > 0 ? subjects.map((sub, idx) => (
                                    <tr key={idx} className="hover:bg-gray-50/50 dark:hover:bg-white/5 transition-colors">
                                        <td className="px-6 py-3 text-sm font-bold text-gray-900 dark:text-white">{sub.name}</td>
                                        <td className="px-4 py-3">
                                            <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 bg-gray-100 dark:bg-surface-container-highest border border-gray-200 dark:border-outline-variant/10 rounded text-gray-600 dark:text-outline">{sub.code}</span>
                                        </td>
                                        <td className="px-4 py-3 text-center text-sm font-mono font-bold text-indigo-600 dark:text-primary">{sub.credits}</td>
                                        <td className="px-4 py-3 text-center text-sm font-mono text-gray-500 dark:text-outline-variant">{sub.enrolled_count}</td>
                                    </tr>
                                )) : (
                                    <tr><td colSpan="4" className="px-6 py-12 text-center text-gray-400 dark:text-outline text-sm">Chưa có môn nào</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Students List */}
                <div className="bg-white dark:bg-surface-container-low rounded-2xl border border-gray-200 dark:border-outline-variant/10 shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-gray-200 dark:border-outline-variant/10 bg-gray-50/50 dark:bg-surface-container-low/30 flex items-center gap-3">
                        <div className="w-10 h-10 bg-indigo-50 dark:bg-primary/10 rounded-xl flex items-center justify-center text-indigo-600 dark:text-primary">
                            <span className="material-symbols-outlined">groups</span>
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Danh Sách Sinh Viên</h2>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500 dark:text-outline">Sĩ số: {students?.length || 0}</p>
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left whitespace-nowrap">
                            <thead>
                                <tr className="bg-gray-50 dark:bg-surface-container-low/50 border-b border-gray-200 dark:border-outline-variant/10">
                                    <th className="px-6 py-3 text-[10px] font-bold uppercase tracking-widest text-gray-500 dark:text-outline text-center w-12">STT</th>
                                    <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-gray-500 dark:text-outline w-28">Mã SV</th>
                                    <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-gray-500 dark:text-outline">Họ và Tên</th>
                                    <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-gray-500 dark:text-outline">Email</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-outline-variant/5">
                                {students && students.length > 0 ? students.map((sv, index) => (
                                    <tr key={sv.id} className="hover:bg-gray-50/50 dark:hover:bg-white/5 transition-colors group">
                                        <td className="px-6 py-3 text-center text-sm text-gray-400 dark:text-outline-variant">{index + 1}</td>
                                        <td className="px-4 py-3">
                                            <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 bg-gray-100 dark:bg-surface-container-highest border border-gray-200 dark:border-outline-variant/10 rounded text-indigo-600 dark:text-primary">{sv.student_code}</span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <Link href={route('admin.students.show', sv.id)} className="text-sm font-bold text-gray-900 dark:text-white hover:text-indigo-600 dark:hover:text-primary transition-colors">
                                                {sv.name}
                                            </Link>
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-500 dark:text-outline-variant">{sv.email}</td>
                                    </tr>
                                )) : (
                                    <tr><td colSpan="4" className="px-6 py-12 text-center text-gray-400 dark:text-outline text-sm">Chưa có sinh viên nào</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}

Show.layout = page => <AppLayout children={page} />;