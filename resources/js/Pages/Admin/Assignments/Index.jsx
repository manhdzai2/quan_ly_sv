import React from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, router } from '@inertiajs/react';

export default function Index({ assignments, filters }) {
    const handleDelete = (id) => {
        if (confirm('Bạn có chắc chắn muốn xóa bài tập này?')) {
            router.delete(route('admin.assignments.destroy', id));
        }
    };

    return (
        <div className="space-y-6">
            <Head title="Quản lý Bài tập" />
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tight">Toàn bộ Bài tập</h2>
            </div>

            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-gray-100 dark:border-slate-800">
                                <th className="px-4 py-3 text-[10px] font-bold uppercase text-gray-400">Tiêu đề</th>
                                <th className="px-4 py-3 text-[10px] font-bold uppercase text-gray-400">Môn học</th>
                                <th className="px-4 py-3 text-[10px] font-bold uppercase text-gray-400">Giảng viên</th>
                                <th className="px-4 py-3 text-[10px] font-bold uppercase text-gray-400">Hạn chót</th>
                                <th className="px-4 py-3 text-[10px] font-bold uppercase text-gray-400 text-right">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50 dark:divide-slate-800/50">
                            {assignments.data.map(a => (
                                <tr key={a.id} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                                    <td className="px-4 py-4">
                                        <p className="font-bold text-sm text-gray-900 dark:text-white">{a.title}</p>
                                    </td>
                                    <td className="px-4 py-4 italic text-sm text-gray-500">
                                        {a.subject?.name}
                                    </td>
                                    <td className="px-4 py-4 text-sm text-gray-600 dark:text-slate-400 font-medium">
                                        {a.teacher?.user?.name}
                                    </td>
                                    <td className="px-4 py-4 text-xs font-bold text-rose-500">
                                        {new Date(a.deadline).toLocaleString('vi-VN')}
                                    </td>
                                    <td className="px-4 py-4 text-right">
                                        <button onClick={() => handleDelete(a.id)} className="text-rose-500 hover:text-rose-700 transition-colors">
                                            <span className="material-symbols-outlined">delete</span>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

Index.layout = page => <AdminLayout children={page} />;
