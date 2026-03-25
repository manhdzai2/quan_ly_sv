import React, { useEffect, useRef } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, router } from '@inertiajs/react';
import { debounce } from 'lodash';
import { motion } from 'framer-motion';

export default function Index({ classrooms, filters }) {
    const searchRef = useRef(
        debounce((value) => {
            router.get(
                route('admin.classrooms.index'),
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
            <Head title="Ma Trận Lớp Học Thuật" />

            {/* Page Header */}
            <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
                <div>
                    <h2 className="text-3xl font-extrabold font-headline tracking-tight text-on-surface">Lớp Học Phần</h2>
                    <p className="text-on-surface-variant mt-1">Cấu trúc phòng ban và quản lý vật chất cho từng môn học thực tế.</p>
                </div>
                <div className="flex items-center gap-3">
                    <Link href={route('admin.classrooms.create')} className="px-5 py-2.5 bg-[#848BFF] text-white font-bold text-sm rounded-xl hover:bg-[#848BFF]/90 transition-colors flex items-center gap-2 shadow-[0_4px_12px_rgba(132,139,255,0.25)] hover:shadow-[#848BFF]/40">
                        <span className="material-symbols-outlined text-[18px]">meeting_room</span> Mở Lớp Học
                    </Link>
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
                        placeholder="Tìm kiếm theo mã cấp lớp hoặc phòng học..." 
                        className="w-full bg-transparent border-none py-3 pl-12 pr-4 text-sm focus:ring-0 outline-none placeholder:text-on-surface-variant/50 text-on-surface font-medium"
                    />
                </div>
            </motion.div>

            {/* Classrooms Grid */}
            <motion.div variants={containerVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {classrooms.data && classrooms.data.length > 0 ? (
                    classrooms.data.map(item => {
                        return (
                            <motion.div variants={itemVariants} whileHover={{ y: -4, transition: { duration: 0.2 } }} key={item.id} className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm border border-outline-variant/5 hover:border-[#848BFF]/50 transition-colors group cursor-pointer relative overflow-hidden flex flex-col h-full">
                                <div className="absolute top-0 right-0 w-24 h-24 bg-[#848BFF]/5 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
                                
                                <div className="flex justify-between items-start mb-4 relative z-10">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 rounded-xl bg-[#848BFF]/10 text-[#848BFF] font-bold flex items-center justify-center shadow-sm border border-[#848BFF]/20">
                                            <span className="material-symbols-outlined font-black">door_front</span>
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-on-surface leading-tight group-hover:text-[#848BFF] transition-colors font-mono tracking-widest">{item.name}</h3>
                                            <p className="text-xs text-[#848BFF] mt-1 font-bold inline-block rounded">{item.room || "Cơ sở ẩn"}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-3 mb-6 relative z-10 mt-2">
                                    <div className="flex items-center gap-2 text-sm text-on-surface-variant">
                                        <span className="material-symbols-outlined text-[16px]">book</span>
                                        <span className="truncate flex-1 font-bold text-on-surface">{item.subject?.name || 'Chưa định danh môn học'}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-on-surface-variant">
                                        <span className="material-symbols-outlined text-[16px]">location_on</span>
                                        <span className="truncate">Vị trí: {item.room}</span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 pt-4 border-t border-outline-variant/10 mt-auto relative z-10">
                                    <Link href={route('admin.classrooms.edit', item.id)} className="flex-[3] bg-[#848BFF]/10 text-[#5c65fb] dark:text-[#a0a6ff] hover:bg-[#848BFF]/20 py-2 rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-1">
                                        <span className="material-symbols-outlined text-[16px]">edit</span> Chi tiết Phòng
                                    </Link>
                                    <button onClick={(e) => { e.preventDefault(); confirm(`Xóa phòng học ${item.name}?`) && router.delete(route('admin.classrooms.destroy', item.id)); }} className="flex-[1] bg-error/10 text-error hover:bg-error/20 py-2 rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-1">
                                        <span className="material-symbols-outlined text-[16px]">delete</span>
                                    </button>
                                </div>
                            </motion.div>
                        );
                    })
                ) : (
                    <motion.div variants={itemVariants} className="col-span-full py-20 text-center bg-surface-container-lowest rounded-2xl border border-outline-variant/5">
                        <span className="material-symbols-outlined text-4xl text-on-surface-variant opacity-50 mb-3 block">event_seat</span>
                        <h3 className="text-lg font-bold text-on-surface">Không tìm thấy mã cấp lớp</h3>
                        <p className="text-sm text-on-surface-variant mt-1">Hệ thống chưa có room nào được setup. Vui lòng thêm mới.</p>
                    </motion.div>
                )}
            </motion.div>

            {/* Pagination Component */}
            <Pagination links={classrooms.links} />

        </motion.div>
    );
}

Index.layout = page => <AdminLayout>{page}</AdminLayout>;

function Pagination({ links }) {
    if (!links || links.length <= 3) return null;

    return (
        <div className="flex justify-center mt-8">
            <div className="inline-flex bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/5 p-1">
                {links.map((link, index) => {
                    const label = link.label.replace('&laquo;', '').replace('&raquo;', '').trim() || (link.label.includes('laquo') ? 'Trước' : 'Sau');
                    
                    if (!link.url) {
                        return (
                            <span key={index} className="px-4 py-2 text-sm font-bold text-on-surface-variant/50 cursor-not-allowed">
                                {label}
                            </span>
                        );
                    }
                    
                    return (
                        <Link
                            key={index}
                            href={link.url}
                            className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${
                                link.active 
                                    ? 'bg-[#848BFF] text-white' 
                                    : 'text-on-surface hover:bg-surface-container'
                            }`}
                        >
                            {label}
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
