import React, { useState } from 'react';
import AppLayout from '@/Layouts/AppLayout';
import { Head, Link, router } from '@inertiajs/react';

export default function Index({ classrooms, filters }) {
    const [search, setSearch] = useState(filters.search || '');

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(route('admin.classrooms.index'), { search }, { preserveState: true, replace: true });
    };

    const handleDelete = (id) => {
        if (confirm('Bạn có chắc chắn muốn xóa lớp học này? Dữ liệu sinh viên trong lớp có thể bị ảnh hưởng.')) {
            router.delete(route('admin.classrooms.destroy', id));
        }
    };

    return (
        <div className="max-w-7xl mx-auto space-y-6 animate-fade-in">
            <Head title="Quản lý Lớp học" />

            {/* HEADER & TÌM KIẾM */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Quản lý Lớp học</h1>
                    <p className="text-sm text-gray-500 mt-1">Danh sách các lớp học phần được mở</p>
                </div>
                
                <div className="flex w-full md:w-auto items-center gap-3">
                    <form onSubmit={handleSearch} className="relative w-full md:w-72">
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Tìm tên lớp hoặc phòng học..."
                            className="w-full pl-10 pr-4 py-2 border-gray-300 rounded-xl shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        />
                        <svg className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                    </form>
                    
                    <Link
                        href={route('admin.classrooms.create')}
                        className="shrink-0 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl shadow-sm font-medium transition-colors flex items-center gap-2"
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
                        <span className="hidden sm:inline">Mở Lớp mới</span>
                    </Link>
                </div>
            </div>

            {/* BẢNG DỮ LIỆU */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Tên lớp</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Môn học</th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Phòng học</th>
                                <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-100">
                            {classrooms.data.length > 0 ? (
                                classrooms.data.map((classroom) => (
                                    <tr key={classroom.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="font-bold text-gray-900">{classroom.name}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            {classroom.subject ? (
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-semibold text-gray-800">{classroom.subject.name}</span>
                                                    <span className="text-xs text-gray-500 mt-0.5">Mã: {classroom.subject.code}</span>
                                                </div>
                                            ) : (
                                                <span className="text-sm text-rose-500 italic">Chưa gắn môn</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                            {classroom.room ? (
                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-gray-100 border border-gray-200">
                                                    <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                                                    {classroom.room}
                                                </span>
                                            ) : (
                                                <span className="text-gray-400">Đang cập nhật</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <div className="flex items-center justify-end gap-2">
                                                <Link href={route('admin.classrooms.edit', classroom.id)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                                                </Link>
                                                <button onClick={() => handleDelete(classroom.id)} className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors">
                                                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" className="px-6 py-12 text-center text-gray-500">
                                        Chưa có lớp học nào được mở.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

Index.layout = page => <AppLayout children={page} />;