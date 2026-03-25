import React, { useEffect, useRef } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, router } from '@inertiajs/react';
import { debounce } from 'lodash';
import { motion } from 'framer-motion';

export default function Index({ scores, filters }) {
    const searchRef = useRef(
        debounce((value) => {
            router.get(
                route('admin.scores.index'),
                { search: value },
                { preserveState: true, replace: true }
            );
        }, 300)
    ).current;

    useEffect(() => {
        return () => searchRef.cancel();
    }, [searchRef]);

    const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.05 } } };
    const itemVariants = { hidden: { opacity: 0, scale: 0.95, y: 10 }, visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.3 } } };

    return (
        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6 pb-12">
            <Head title="Quản Lý Điểm Số Toàn Trường" />

            {/* Page Header */}
            <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
                <div>
                    <h2 className="text-3xl font-extrabold font-headline tracking-tight text-on-surface">Tra Cứu Điểm Số</h2>
                    <p className="text-on-surface-variant mt-1">Giám sát đào tạo, tra cứu hệ số đánh giá và kết quả học tập của Sinh viên.</p>
                </div>
            </motion.div>

            {/* Filters & Search */}
            <motion.div variants={itemVariants} className="bg-surface-container-lowest p-2 rounded-2xl shadow-sm border border-outline-variant/5 flex flex-col lg:flex-row gap-2">
                <div className="flex-1 relative">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
                    <input 
                        type="text" 
                        defaultValue={filters?.search || ''}
                        onChange={(e) => searchRef(e.target.value)}
                        placeholder="Tìm kiếm sinh viên, MSG, hoặc môn học..." 
                        className="w-full bg-transparent border-none py-3 pl-12 pr-4 text-sm focus:ring-0 outline-none placeholder:text-on-surface-variant/50 text-on-surface font-medium"
                    />
                </div>
                <div className="hidden lg:block w-px bg-outline-variant/20 my-2 mx-1"></div>
                <div className="flex gap-2">
                    <select className="bg-surface-container-low border-none rounded-xl text-sm font-bold py-3 pl-4 pr-10 focus:ring-2 focus:ring-primary/20 text-on-surface outline-none cursor-pointer">
                        <option>Tất cả trạng thái</option>
                        <option>Đã có điểm</option>
                        <option>Đang chờ</option>
                    </select>
                </div>
            </motion.div>

            {/* Scores Grid */}
            <motion.div variants={containerVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {scores.data && scores.data.length > 0 ? (
                    scores.data.map(item => {
                        const rawChuyenCan = item.score?.attendance_score;
                        const rawGiuaKy = item.score?.midterm_score;
                        const rawCuoiKy = item.score?.final_score;
                        
                        const hasFullScore = rawChuyenCan !== null && rawGiuaKy !== null && rawCuoiKy !== null;
                        const tongKet = hasFullScore 
                            ? (parseFloat(rawChuyenCan) * 0.1 + parseFloat(rawGiuaKy) * 0.3 + parseFloat(rawCuoiKy) * 0.6).toFixed(1)
                            : null;

                        const nameChar = item.student?.user?.name ? item.student.user.name.charAt(0) : 'S';

                        return (
                            <motion.div variants={itemVariants} whileHover={{ y: -4, transition: { duration: 0.2 } }} key={item.id} className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm border border-outline-variant/5 hover:border-primary/30 transition-colors group relative overflow-hidden flex flex-col h-full">
                                <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
                                
                                <div className="flex justify-between items-start mb-4 relative z-10">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-[#2a2b96] text-white font-bold flex items-center justify-center text-lg shadow-md">
                                            {nameChar}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-on-surface leading-tight group-hover:text-primary transition-colors">{item.student?.user?.name || 'Vô Danh'}</h3>
                                            <p className="text-xs text-on-surface-variant font-mono mt-0.5 tracking-widest">{item.student?.student_code}</p>
                                        </div>
                                    </div>
                                    
                                    <div className="text-right">
                                        {tongKet !== null ? (
                                            <div className="flex flex-col items-end">
                                                <span className={`text-2xl font-black font-mono leading-none ${
                                                    parseFloat(tongKet) >= 8.0 ? 'text-secondary' 
                                                    : parseFloat(tongKet) >= 5.0 ? 'text-primary' 
                                                    : 'text-error'
                                                }`}>
                                                    {tongKet}
                                                </span>
                                                <span className="text-[9px] uppercase tracking-widest font-bold text-on-surface-variant mt-1">Tổng Kết</span>
                                            </div>
                                        ) : (
                                            <div className="flex flex-col items-end">
                                                <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded bg-tertiary/10 text-tertiary text-[10px] font-bold tracking-wider uppercase border border-tertiary/20">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-tertiary animate-pulse"></span>
                                                    Đang chờ
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="space-y-3 mb-6 relative z-10 flex-1">
                                    <div className="bg-surface-container-low rounded-xl p-3 border border-outline-variant/10">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="material-symbols-outlined text-[16px] text-primary">book</span>
                                            <span className="text-sm font-bold text-on-surface truncate">{item.subject?.name}</span>
                                        </div>
                                        <div className="flex items-center justify-between mt-2">
                                            <span className="text-[10px] font-mono font-bold text-on-surface-variant tracking-wider">{item.subject?.code}</span>
                                            <span className="text-[10px] text-on-surface-variant">GV: {item.teacher?.user?.name || 'Chưa phân công'}</span>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-3 gap-2 mt-4">
                                        <div className="bg-surface-container rounded-lg p-2 text-center">
                                            <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-1">CC 10%</p>
                                            <p className="font-mono font-bold text-sm text-on-surface">{rawChuyenCan !== null ? rawChuyenCan : '-'}</p>
                                        </div>
                                        <div className="bg-surface-container rounded-lg p-2 text-center">
                                            <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-1">GK 30%</p>
                                            <p className="font-mono font-bold text-sm text-on-surface">{rawGiuaKy !== null ? rawGiuaKy : '-'}</p>
                                        </div>
                                        <div className="bg-surface-container rounded-lg p-2 text-center">
                                            <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-1">CK 60%</p>
                                            <p className="font-mono font-bold text-sm text-on-surface">{rawCuoiKy !== null ? rawCuoiKy : '-'}</p>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })
                ) : (
                    <motion.div variants={itemVariants} className="col-span-full py-20 text-center bg-surface-container-lowest rounded-2xl border border-outline-variant/5">
                        <span className="material-symbols-outlined text-4xl text-on-surface-variant opacity-50 mb-3 block">analytics</span>
                        <h3 className="text-lg font-bold text-on-surface">Chưa Có Bản Ghi Hệ Số Đánh Giá</h3>
                        <p className="text-sm text-on-surface-variant mt-1">Hệ thống chưa ghi nhận thông tin học phần hoặc dữ liệu điểm số từ Giảng viên.</p>
                    </motion.div>
                )}
            </motion.div>

        </motion.div>
    );
}

Index.layout = page => <AdminLayout>{page}</AdminLayout>;
