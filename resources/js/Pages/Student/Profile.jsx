import React from 'react';
import StudentLayout from '@/Layouts/StudentLayout';
import { Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';

export default function Profile({ studentInfo, enrollments }) {
    const defaultAvatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(studentInfo?.user?.name || 'S V')}&background=4647d3&color=fff&size=200&font-size=0.4&bold=true`;

    const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.05 } } };
    const itemVariants = { hidden: { opacity: 0, scale: 0.95, y: 10 }, visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.3 } } };

    return (
        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6 pb-12">
            <Head title="Hồ Sơ Của Tôi" />

            {/* Page Header */}
            <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
                <div>
                    <h2 className="text-3xl font-extrabold font-headline tracking-tight text-on-surface">Không Gian Học Vụ</h2>
                    <p className="text-on-surface-variant mt-1">Thông tin cá nhân, liên hệ và tra cứu kết quả học tập tự động.</p>
                </div>
            </motion.div>

            {/* HERO CARD (Student Banner) */}
            <motion.div variants={itemVariants} className="bg-surface-container-lowest p-8 rounded-3xl shadow-sm border border-outline-variant/5 relative overflow-hidden group">
                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-bl-full -mr-12 -mt-12 transition-transform group-hover:scale-110 pointer-events-none"></div>
                <div className="absolute top-0 right-0 w-1/2 h-full opacity-[0.02] dark:opacity-[0.01] pointer-events-none" style={{ backgroundImage: 'linear-gradient(rgba(0,0,0,1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,1) 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>

                <div className="flex flex-col md:flex-row gap-8 items-center md:items-start relative z-10 w-full">
                    <img 
                        src={defaultAvatarUrl} 
                        alt="Avatar" 
                        className="w-32 h-32 md:w-40 md:h-40 rounded-2xl border-4 border-surface shadow-lg group-hover:shadow-2xl transition-shadow duration-500 bg-surface-container"
                    />
                    
                    <div className="flex-[1] text-center md:text-left space-y-4 md:mt-4 w-full">
                        <div>
                            <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-1 block">Sinh Viên Đang Hoạt Động</span>
                            <h1 className="text-4xl font-black text-on-surface tracking-tight">
                                {studentInfo?.user?.name || 'Vô danh'}
                            </h1>
                        </div>
                        
                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface-container text-xs font-bold font-mono tracking-widest text-primary border border-outline-variant/10">
                                <span className="material-symbols-outlined text-[14px]">pin</span>
                                {studentInfo?.student_code || 'CHƯA CẤP'}
                            </span>
                            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface-container text-xs font-bold text-on-surface border border-outline-variant/10">
                                <span className="material-symbols-outlined text-[14px] text-primary">diversity_3</span>
                                Lớp: {studentInfo?.class?.name || 'Chờ xếp lớp'}
                            </span>
                            <span className="inline-flex items-center gap-2 text-xs font-bold text-on-surface-variant border border-outline-variant/5 px-2 py-1 rounded">
                                <span className="material-symbols-outlined text-[14px]">calendar_today</span>
                                {studentInfo?.dob ? new Date(studentInfo.dob).toLocaleDateString('vi-VN') : 'Chưa cập nhật'}
                            </span>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* TWO COLUMNS */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                
                {/* Contact Info */}
                <motion.div variants={itemVariants} className="lg:col-span-1 bg-surface-container-lowest p-6 rounded-3xl shadow-sm border border-outline-variant/5 relative overflow-hidden flex flex-col h-full">
                    <h3 className="text-sm font-bold text-on-surface mb-6 flex items-center gap-3 uppercase tracking-widest">
                        <div className="w-8 h-8 flex items-center justify-center bg-tertiary/10 text-tertiary rounded-lg border border-tertiary/20">
                            <span className="material-symbols-outlined text-[16px]">contact_mail</span>
                        </div>
                        Liên Hệ
                    </h3>
                    
                    <div className="space-y-6">
                        <div className="group/item">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant block mb-2 transition-colors">Địa Chỉ Email</label>
                            <div className="text-sm font-semibold text-on-surface break-all bg-surface-container px-4 py-3 rounded-xl border border-outline-variant/5 flex items-center gap-3 group-hover/item:border-primary/20 transition-colors">
                                <span className="material-symbols-outlined text-on-surface-variant text-[18px]">mail</span>
                                {studentInfo?.user?.email || 'Chưa có'}
                            </div>
                        </div>
                        <div className="group/item">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant block mb-2 transition-colors">Điện Thoại</label>
                            <div className="text-sm font-semibold text-on-surface bg-surface-container px-4 py-3 rounded-xl border border-outline-variant/5 flex items-center gap-3 group-hover/item:border-primary/20 transition-colors">
                                <span className="material-symbols-outlined text-on-surface-variant text-[18px]">smartphone</span>
                                {studentInfo?.phone || 'Chưa cung cấp'}
                            </div>
                        </div>
                        <div className="group/item">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant block mb-2 transition-colors">Thường Trú</label>
                            <div className="text-sm font-semibold text-on-surface bg-surface-container px-4 py-3 rounded-xl border border-outline-variant/5 min-h-[5rem] leading-relaxed flex items-start gap-3 group-hover/item:border-primary/20 transition-colors">
                                <span className="material-symbols-outlined text-on-surface-variant text-[18px] mt-0.5">location_on</span>
                                {studentInfo?.address || 'Chưa cập nhật'}
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Score Grid (List layout like Score/Index.jsx) */}
                <motion.div variants={containerVariants} className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-5 h-full">
                    {/* Header bar span full width */}
                    <motion.div variants={itemVariants} className="col-span-full flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 flex items-center justify-center bg-secondary/10 text-secondary rounded-xl border border-secondary/20">
                                <span className="material-symbols-outlined text-lg">school</span>
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-on-surface">Kết Quả Học Tập</h3>
                                <p className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold mt-1">Các học phần hiện tại</p>
                            </div>
                        </div>
                    </motion.div>

                    {enrollments && enrollments.length > 0 ? (
                        enrollments.map((enr, idx) => {
                            const rawCC = enr.score?.attendance_score;
                            const rawTX = enr.score?.regular_score;
                            const rawKT = enr.score?.test_score;
                            const rawGK = enr.score?.midterm_score;
                            const rawCK = enr.score?.final_score;
                            
                            const hasFullScore = rawCC != null && rawTX != null && rawKT != null && rawGK != null && rawCK != null;
                            const tk = hasFullScore 
                                ? (parseFloat(rawCC)*0.1 + parseFloat(rawTX)*0.1 + parseFloat(rawKT)*0.1 + parseFloat(rawGK)*0.2 + parseFloat(rawCK)*0.5).toFixed(1)
                                : null;

                            return (
                                <motion.div variants={itemVariants} whileHover={{ y: -4, transition: { duration: 0.2 } }} key={idx} className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm border border-outline-variant/5 hover:border-secondary/30 transition-colors group relative overflow-hidden flex flex-col h-full">
                                    <div className="absolute top-0 right-0 w-24 h-24 bg-secondary/5 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
                                    <div className="flex justify-between items-start mb-4 relative z-10 w-full">
                                        <div className="flex-1 pe-4">
                                            <h3 className="font-bold text-on-surface leading-snug group-hover:text-secondary transition-colors line-clamp-2">{enr.subject?.name}</h3>
                                            <p className="text-[10px] text-on-surface-variant font-mono tracking-widest mt-1 border border-outline-variant/10 inline-block px-1.5 py-0.5 rounded uppercase">{enr.subject?.code}</p>
                                        </div>
                                        <div className="text-right flex-shrink-0">
                                            {tk !== null ? (
                                                <div className="flex flex-col items-end">
                                                    <span className={`text-2xl font-black font-mono leading-none ${
                                                        parseFloat(tk) >= 8.0 ? 'text-secondary' 
                                                        : parseFloat(tk) >= 5.0 ? 'text-primary' 
                                                        : 'text-error'
                                                    }`}>
                                                        {tk}
                                                    </span>
                                                    <span className="text-[9px] uppercase tracking-widest font-bold text-on-surface-variant mt-1">Tổng Kết</span>
                                                </div>
                                            ) : (
                                                <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded bg-tertiary/10 text-tertiary text-[10px] font-bold tracking-wider uppercase border border-tertiary/20">
                                                    Đang chờ
                                                </span>
                                            )}
                                        </div>
                                    </div>
    
                                    <div className="grid grid-cols-5 gap-1.5 mt-auto relative z-10 pt-4 border-t border-outline-variant/5">
                                        {[{label:'CC',pct:'10%',val:rawCC},{label:'TX',pct:'10%',val:rawTX},{label:'KT',pct:'10%',val:rawKT},{label:'GK',pct:'20%',val:rawGK},{label:'CK',pct:'50%',val:rawCK}].map(d => (
                                            <div key={d.label} className="bg-surface-container rounded-lg p-1.5 text-center">
                                                <p className="text-[9px] font-bold text-on-surface-variant uppercase tracking-wider mb-0.5">{d.label} {d.pct}</p>
                                                <p className="font-mono font-bold text-sm text-on-surface">{d.val != null ? d.val : '-'}</p>
                                            </div>
                                        ))}
                                    </div>
                                </motion.div>
                            );
                        })
                    ) : (
                        <motion.div variants={itemVariants} className="col-span-full py-12 text-center bg-surface-container-lowest rounded-2xl border border-outline-variant/5">
                            <span className="material-symbols-outlined text-4xl text-on-surface-variant opacity-50 mb-3 block">find_in_page</span>
                            <h3 className="text-sm font-bold text-on-surface">Bảng Điểm Trống</h3>
                            <p className="text-xs text-on-surface-variant mt-1">Chưa có môn học kỳ này.</p>
                        </motion.div>
                    )}
                </motion.div>
            </div>
        </motion.div>
    );
}

Profile.layout = page => <StudentLayout>{page}</StudentLayout>;