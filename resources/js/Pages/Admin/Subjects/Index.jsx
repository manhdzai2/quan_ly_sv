import React, { useEffect, useRef } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, router } from '@inertiajs/react';
import { debounce } from 'lodash';
import { motion } from 'framer-motion';

export default function Index({ subjects, filters }) {
    const searchRef = useRef(
        debounce((value) => {
            router.get(
                route('admin.subjects.index'),
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
            <Head title="Danh Mục Học Phần" />

            {/* Page Header */}
            <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
                <div>
                    <h2 className="text-3xl font-extrabold font-headline tracking-tight text-on-surface">Danh Mục Học Phần</h2>
                    <p className="text-on-surface-variant mt-1">Cấu trúc thư viện môn học, tín chỉ và mã học phần phục vụ đào tạo.</p>
                </div>
                <div className="flex items-center gap-3">
                    <Link href={route('admin.subjects.create')} className="px-5 py-2.5 bg-secondary text-white font-bold text-sm rounded-xl hover:bg-secondary/90 transition-colors flex items-center gap-2 shadow-[0_4px_12px_rgba(94,38,199,0.25)] hover:shadow-secondary/40">
                        <span className="material-symbols-outlined text-[18px]">add_circle</span> Thêm Môn Học
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
                        placeholder="Tìm kiếm theo mã môn học, tên môn học..." 
                        className="w-full bg-transparent border-none py-3 pl-12 pr-4 text-sm focus:ring-0 outline-none placeholder:text-on-surface-variant/50 text-on-surface font-medium"
                    />
                </div>
                <div className="hidden lg:block w-px bg-outline-variant/20 my-2 mx-1"></div>
                <div className="flex gap-2">
                    <select className="bg-surface-container-low border-none rounded-xl text-sm font-bold py-3 pl-4 pr-10 focus:ring-2 focus:ring-secondary/20 text-on-surface outline-none cursor-pointer">
                        <option>Tất cả Tín Chỉ</option>
                        <option>2 Tín Chỉ</option>
                        <option>3 Tín Chỉ</option>
                        <option>4 Tín Chỉ</option>
                    </select>
                </div>
            </motion.div>

            {/* Subjects Grid */}
            <motion.div variants={containerVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {subjects.data && subjects.data.length > 0 ? (
                    subjects.data.map(item => {
                        return (
                            <motion.div variants={itemVariants} whileHover={{ y: -4, transition: { duration: 0.2 } }} key={item.id} className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm border border-outline-variant/5 hover:border-secondary/30 transition-colors group cursor-pointer relative overflow-hidden flex flex-col h-full">
                                <div className="absolute top-0 right-0 w-24 h-24 bg-secondary/5 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
                                
                                <div className="flex justify-between items-start mb-4 relative z-10">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 rounded-xl bg-secondary/10 text-secondary font-bold flex items-center justify-center shadow-sm border border-secondary/20">
                                            <span className="material-symbols-outlined">book_4</span>
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-on-surface leading-tight group-hover:text-secondary transition-colors">{item.name}</h3>
                                            <p className="text-xs text-secondary font-mono mt-1 font-bold tracking-widest bg-secondary/10 inline-block px-2 py-0.5 rounded">{item.code}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-3 mb-6 relative z-10">
                                    <div className="flex items-center gap-2 text-sm text-on-surface-variant">
                                        <span className="material-symbols-outlined text-[16px]">toll</span>
                                        <span>Khối lượng: <strong className="text-on-surface">{item.credits} Tín chỉ</strong></span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-on-surface-variant">
                                        <span className="material-symbols-outlined text-[16px]">category</span>
                                        <span>Loại hình: Môn Bắt Buộc</span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 pt-4 border-t border-outline-variant/10 mt-auto relative z-10">
                                    <Link href={route('admin.subjects.edit', item.id)} className="flex-[3] bg-secondary/10 text-secondary hover:bg-secondary/20 py-2 rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-1">
                                        <span className="material-symbols-outlined text-[16px]">edit</span> Chỉnh sửa môn
                                    </Link>
                                    <button onClick={(e) => { e.preventDefault(); confirm(`Chắc chắn xóa ${item.name}?`) && router.delete(route('admin.subjects.destroy', item.id)); }} className="flex-[1] bg-error/10 text-error hover:bg-error/20 py-2 rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-1">
                                        <span className="material-symbols-outlined text-[16px]">delete</span>
                                    </button>
                                </div>
                            </motion.div>
                        );
                    })
                ) : (
                    <motion.div variants={itemVariants} className="col-span-full py-20 text-center bg-surface-container-lowest rounded-2xl border border-outline-variant/5">
                        <span className="material-symbols-outlined text-4xl text-on-surface-variant opacity-50 mb-3 block">auto_stories</span>
                        <h3 className="text-lg font-bold text-on-surface">Không tìm thấy học phần</h3>
                        <p className="text-sm text-on-surface-variant mt-1">Hãy thay đổi từ khóa hoặc thêm học phần mới.</p>
                    </motion.div>
                )}
            </motion.div>

        </motion.div>
    );
}

Index.layout = page => <AdminLayout>{page}</AdminLayout>;