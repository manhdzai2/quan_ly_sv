import React, { useState } from 'react';
import StudentLayout from '@/Layouts/StudentLayout';
import { Head } from '@inertiajs/react';
import { motion } from 'framer-motion';

const iconMap = {
    pdf: { i: 'picture_as_pdf', c: 'text-rose-500 bg-rose-50 dark:bg-rose-500/10' },
    doc: { i: 'description', c: 'text-blue-500 bg-blue-50 dark:bg-blue-500/10' },
    docx: { i: 'description', c: 'text-blue-500 bg-blue-50 dark:bg-blue-500/10' },
    ppt: { i: 'slideshow', c: 'text-orange-500 bg-orange-50 dark:bg-orange-500/10' },
    pptx: { i: 'slideshow', c: 'text-orange-500 bg-orange-50 dark:bg-orange-500/10' },
    xls: { i: 'table_view', c: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-500/10' },
    xlsx: { i: 'table_view', c: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-500/10' },
    mp4: { i: 'play_circle', c: 'text-purple-500 bg-purple-50 dark:bg-purple-500/10' },
    default: { i: 'draft', c: 'text-gray-500 bg-gray-50 dark:bg-slate-700/50' }
};

export default function Index({ materials }) {
    const [filter, setFilter] = useState('');
    const cv = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.05 } } };
    const iv = { hidden: { opacity: 0, y: 15 }, visible: { opacity: 1, y: 0, transition: { duration: 0.3 } } };

    const filtered = (materials || []).filter(m => filter === '' || (m.subject_name && m.subject_name.toLowerCase().includes(filter.toLowerCase())));

    return (
        <motion.div variants={cv} initial="hidden" animate="visible" className="space-y-6 pb-12">
            <Head title="Học Liệu" />

            {/* Header & Filter */}
            <motion.div variants={iv} className="flex flex-col md:flex-row md:items-end justify-between gap-4 bg-white dark:bg-slate-800/60 p-6 rounded-3xl border border-gray-100 dark:border-slate-700/50 shadow-sm">
                <div>
                    <h2 className="text-3xl font-black font-headline tracking-tight text-gray-900 dark:text-white">Kho Học Liệu</h2>
                    <p className="text-gray-500 dark:text-slate-400 mt-1 font-medium">Tài liệu, giáo trình và bài giảng từ điện toán đám mây.</p>
                </div>
                <div className="relative max-w-xs w-full">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">search</span>
                    <input 
                        type="text" 
                        placeholder="Tìm theo môn học..." 
                        value={filter}
                        onChange={e => setFilter(e.target.value)}
                        className="w-full pl-11 pr-4 py-3 bg-gray-50 dark:bg-slate-900 border-none rounded-xl text-sm font-semibold text-gray-900 dark:text-white focus:ring-2 focus:ring-violet-500 transition-shadow outline-none"
                    />
                </div>
            </motion.div>

            {/* Grid */}
            <motion.div variants={cv} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filtered.map(m => {
                    const iconCfg = iconMap[m.file_type?.toLowerCase()] || iconMap.default;
                    const mbSize = (m.file_size / 1024 / 1024).toFixed(2);
                    
                    return (
                        <motion.div key={m.id} variants={iv} className="group bg-white dark:bg-slate-800/60 rounded-2xl p-5 border border-gray-100 dark:border-slate-700/50 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden flex flex-col h-full">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-violet-500/5 to-transparent rounded-bl-full pointer-events-none"></div>
                            
                            <div className="flex gap-4">
                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 ${iconCfg.c}`}>
                                    <span className="material-symbols-outlined text-[28px]">{iconCfg.i}</span>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-bold text-gray-900 dark:text-white text-base leading-tight group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors line-clamp-2" title={m.title}>{m.title}</h3>
                                    <p className="text-[11px] font-bold text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-500/10 px-2 py-0.5 rounded-md inline-block mt-2 mb-1 truncate max-w-full">{m.subject_name}</p>
                                    <p className="text-xs text-gray-500 dark:text-slate-400 truncate flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">person</span> {m.teacher_name}</p>
                                </div>
                            </div>
                            
                            {m.description && <p className="text-sm text-gray-600 dark:text-slate-400 mt-4 line-clamp-2 mt-auto">{m.description}</p>}
                            
                            <div className="mt-5 pt-4 border-t border-gray-100 dark:border-slate-700/50 flex items-center justify-between">
                                <div className="flex items-center gap-2 text-xs font-semibold text-gray-400 dark:text-slate-500">
                                    <span className="uppercase">{m.file_type}</span> • <span>{mbSize} MB</span>
                                </div>
                                <a href={route('student.materials.download', m.id)} className="w-9 h-9 flex items-center justify-center bg-gray-50 hover:bg-violet-600 dark:bg-slate-700 dark:hover:bg-violet-600 text-gray-600 hover:text-white dark:text-slate-300 rounded-xl transition-all duration-300 tooltip" title="Tải xuống">
                                    <span className="material-symbols-outlined text-[20px]">download</span>
                                </a>
                            </div>
                        </motion.div>
                    );
                })}
            </motion.div>

            {filtered.length === 0 && (
                <div className="text-center py-24 bg-white dark:bg-slate-800/60 rounded-3xl border border-gray-100 dark:border-slate-700/50 text-gray-400 dark:text-slate-500">
                    <span className="material-symbols-outlined text-5xl mb-3 block opacity-50">folder_open</span>
                    <p className="text-base font-bold">Không tìm thấy tài liệu nào</p>
                </div>
            )}
        </motion.div>
    );
}

Index.layout = page => <StudentLayout>{page}</StudentLayout>;
