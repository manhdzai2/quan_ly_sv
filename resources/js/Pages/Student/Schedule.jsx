import React from 'react';
import StudentLayout from '@/Layouts/StudentLayout';
import { Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';

export default function Schedule({ schedules }) {
    // Nhóm lịch học theo thứ trong tuần
    const groupedSchedules = schedules.reduce((acc, curr) => {
        if (!acc[curr.day]) {
            acc[curr.day] = [];
        }
        acc[curr.day].push(curr);
        return acc;
    }, {});

    const daysOfWeek = ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'Chủ nhật'];

    const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } };
    const itemVariants = { hidden: { opacity: 0, y: 15 }, visible: { opacity: 1, y: 0, transition: { duration: 0.4 } } };

    return (
        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-8 pb-12">
            <Head title="Thời Khóa Biểu" />

            <div className="flex justify-between items-end mb-6">
                <div>
                    <span className="font-['Inter'] uppercase tracking-widest text-[10px] font-bold text-primary mb-1 block">Lịch Trình Học Tập</span>
                    <h2 className="text-3xl font-extrabold tracking-tight text-on-surface">Thời Khóa Biểu Tuần</h2>
                </div>
                <Link
                    href={route('student.profile')}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-surface-container-lowest text-[10px] font-bold uppercase tracking-widest text-on-surface-variant hover:text-primary rounded-lg transition-all border border-outline-variant/10 shadow-sm group"
                >
                    <span className="material-symbols-outlined text-sm group-hover:-translate-x-1 transition-transform">badge</span>
                    Hồ Sơ Cá Nhân
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {daysOfWeek.map((dayName, index) => {
                    const daySchedules = groupedSchedules[dayName];
                    const hasClasses = daySchedules && daySchedules.length > 0;

                    return (
                        <motion.div variants={itemVariants} key={dayName} className={`bg-surface-container-lowest rounded-2xl border ${hasClasses ? 'border-primary/20 shadow-sm' : 'border-outline-variant/5 opacity-60 grayscale-[50%]'} overflow-hidden flex flex-col transition-all relative group`}>
                            
                            {hasClasses && (
                                <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-primary to-transparent opacity-50"></div>
                            )}

                            <div className={`px-6 py-5 border-b ${hasClasses ? 'bg-primary/5 border-primary/10' : 'bg-surface-container/50 border-outline-variant/5'} flex items-center justify-between`}>
                                <h3 className={`font-bold font-['Inter'] tracking-widest uppercase text-sm ${hasClasses ? 'text-primary' : 'text-on-surface-variant'}`}>
                                    {dayName}
                                </h3>
                                {hasClasses && (
                                    <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-surface-container border border-primary/20 text-xs font-bold font-mono text-on-surface shadow-sm group-hover:bg-primary group-hover:text-on-primary transition-colors">
                                        {daySchedules.length}
                                    </span>
                                )}
                            </div>

                            <div className="p-4 flex-1 flex flex-col gap-4">
                                {hasClasses ? (
                                    daySchedules.map((schedule, idx) => (
                                        <div key={idx} className="relative bg-surface p-5 rounded-xl border border-outline-variant/10 shadow-sm hover:border-primary/30 hover:shadow-md transition-all duration-300">
                                            
                                            <div className="absolute top-4 right-4">
                                                <div className="h-2 w-2 rounded-full bg-secondary shadow-[0_0_8px_rgba(78,222,163,0.8)] animate-pulse"></div>
                                            </div>
                                            
                                            <div className="text-sm font-bold text-on-surface mb-3 line-clamp-2 pr-4 leading-tight hover:text-primary transition-colors">
                                                {schedule.subject}
                                            </div>
                                            
                                            <div className="flex items-center gap-2 mb-2 text-xs font-bold font-mono text-on-surface-variant">
                                                <span className="material-symbols-outlined text-[14px] text-secondary">schedule</span>
                                                {schedule.time}
                                            </div>
                                            
                                            <div className="flex items-center gap-2 text-xs font-bold font-mono text-on-surface-variant">
                                                <span className="material-symbols-outlined text-[14px] text-tertiary">meeting_room</span>
                                                {schedule.room || 'Chưa xếp phòng'}
                                            </div>

                                            <div className="flex items-center justify-between border-t border-outline-variant/10 mt-4 pt-3">
                                                <div className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant truncate pr-2" title={schedule.instructor}>
                                                    GV: {schedule.instructor || 'Chưa phân công'}
                                                </div>
                                                <span className="shrink-0 text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded bg-surface-container border border-outline-variant/20 text-on-surface shadow-sm">
                                                    {schedule.type || 'LT'}
                                                </span>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="flex-1 flex flex-col items-center justify-center py-10 opacity-50">
                                        <span className="material-symbols-outlined text-4xl text-on-surface-variant mb-2">grid_off</span>
                                        <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Trống Lịch</span>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </motion.div>
    );
}

Schedule.layout = page => <StudentLayout children={page} />;