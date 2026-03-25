import React from 'react';
import TeacherLayout from '@/Layouts/TeacherLayout';
import { Head, Link, usePage } from '@inertiajs/react';

export default function Index({ courses }) {
    const { auth } = usePage().props;
    const user = auth?.user;

    const activeClasses = courses?.length || 0;
    const totalStudents = courses?.reduce((sum, c) => sum + (c.total_students || 0), 0) || 0;

    return (
        <div className="animate-fade-in space-y-8">
            <Head title="Lớp học được giao" />

            {/* Welcome Banner */}
            <div className="bg-gradient-to-r from-primary to-secondary text-on-primary rounded-3xl p-8 mb-8 shadow-lg relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-black font-headline tracking-tight mb-2">Chào mừng trở lại, {user?.name || 'Giảng viên'}!</h1>
                        <p className="text-on-primary/80 font-medium">Thầy/Cô có {activeClasses} lớp học được phân công trong học kỳ này.</p>
                    </div>
                </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-surface-container-lowest p-5 rounded-2xl shadow-sm border border-outline-variant/10 flex items-center gap-4 hover:border-primary/20 transition-colors">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                        <span className="material-symbols-outlined text-2xl">class</span>
                    </div>
                    <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Lớp học hiện tại</p>
                        <p className="text-2xl font-black text-on-surface leading-none mt-1">{activeClasses}</p>
                    </div>
                </div>
                <div className="bg-surface-container-lowest p-5 rounded-2xl shadow-sm border border-outline-variant/10 flex items-center gap-4 hover:border-secondary/20 transition-colors">
                    <div className="w-12 h-12 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center">
                        <span className="material-symbols-outlined text-2xl">groups</span>
                    </div>
                    <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Tổng Sinh Viên</p>
                        <p className="text-2xl font-black text-on-surface leading-none mt-1">{totalStudents}</p>
                    </div>
                </div>
            </div>

            {/* Section Title */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-xl font-bold font-headline text-on-surface">Lớp học được giao</h2>
                    <p className="text-sm text-on-surface-variant font-medium">Chọn một lớp để quản lý điểm số và chuyên cần</p>
                </div>
            </div>

            {/* Classes Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {courses && courses.length > 0 ? (
                    courses.map((course, index) => (
                        <div key={index} className="bg-surface-container-lowest rounded-3xl border border-outline-variant/10 hover:border-primary/30 transition-all duration-300 group overflow-hidden flex flex-col shadow-sm hover:shadow-xl hover:-translate-y-1 focus-within:ring-2 focus-within:ring-primary relative">
                            {/* Card Header Pattern */}
                            <div className="h-24 bg-surface-container-low transition-colors relative overflow-hidden group-hover:bg-primary/5">
                                <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)', backgroundSize: '16px 16px', color: 'var(--tw-colors-primary)' }}></div>
                                <div className="absolute -bottom-6 left-6 w-14 h-14 bg-surface-container-lowest rounded-2xl flex items-center justify-center shadow-lg border border-outline-variant/10 z-10">
                                    <span className="material-symbols-outlined text-primary text-2xl group-hover:scale-110 transition-transform">menu_book</span>
                                </div>
                            </div>
                            
                            <div className="p-6 pt-10 flex-1 flex flex-col relative z-20">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="text-lg font-bold text-on-surface leading-tight group-hover:text-primary transition-colors font-headline pr-8">
                                        {course.subject_name}
                                    </h3>
                                    <span className="absolute top-10 right-6 text-on-surface-variant group-hover:text-primary transition-colors opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0">
                                        <span className="material-symbols-outlined">arrow_outward</span>
                                    </span>
                                </div>
                                
                                <div className="flex items-center gap-2 mb-6">
                                    <span className="text-xs font-mono font-bold text-on-surface-variant bg-surface-container-high px-2 py-1 rounded-md">{course.subject_id}</span>
                                    <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-1 rounded-md uppercase tracking-wider">{course.credit} Tín chỉ</span>
                                </div>

                                <div className="grid grid-cols-2 gap-4 mb-6 pt-4 border-t border-outline-variant/10">
                                    <div>
                                        <p className="text-[10px] uppercase font-bold text-on-surface-variant tracking-widest mb-1">Sĩ số</p>
                                        <p className="text-sm font-bold text-on-surface flex items-center gap-1.5">
                                            <span className="material-symbols-outlined text-[16px] text-secondary">group</span> 
                                            {course.total_students} Sinh viên
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] uppercase font-bold text-on-surface-variant tracking-widest mb-1">Học kỳ</p>
                                        <p className="text-sm font-bold text-on-surface">{course.semester}</p>
                                    </div>
                                </div>

                                <div className="mt-auto">
                                    <Link
                                        href={route('teacher.enrollments.show', [course.subject_id, course.semester])}
                                        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-surface-container-low text-on-surface hover:bg-primary hover:text-on-primary font-bold text-sm tracking-wide rounded-xl transition-all"
                                    >
                                        Quản lý Điểm
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="col-span-full py-20 text-center bg-surface-container-lowest rounded-3xl border border-outline-variant/10">
                        <span className="material-symbols-outlined text-4xl text-on-surface-variant opacity-50 mb-3 block">event_busy</span>
                        <h3 className="text-lg font-bold text-on-surface mb-1">Chưa có Phân công</h3>
                        <p className="text-sm text-on-surface-variant">Thầy/Cô chưa được phân công lớp nào trong học kỳ hiện tại.</p>
                    </div>
                )}
            </div>
        </div>
    );
}

Index.layout = page => <TeacherLayout>{page}</TeacherLayout>;