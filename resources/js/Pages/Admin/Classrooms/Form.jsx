import React from 'react';
import AppLayout from '@/Layouts/AppLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Form({ classroom, subjects }) {
    const isEditing = !!classroom;

    const { data, setData, post, put, processing, errors } = useForm({
        name: classroom?.name || '',
        subject_id: classroom?.subject_id || '',
        room: classroom?.room || '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isEditing) {
            put(route('admin.classrooms.update', classroom.id));
        } else {
            post(route('admin.classrooms.store'));
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-fade-in-up py-4">
            <Head title={isEditing ? 'Sửa Lớp Học phần' : 'Tạo Lớp Học phần'} />

            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
                        {isEditing ? 'Chỉnh sửa Lớp Học phần' : 'Khởi tạo Lớp Học phần'}
                    </h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1.5 font-medium">
                        Quản lý mã lớp, liên kết học phần và điều phối phòng học.
                    </p>
                </div>
                <Link
                    href={route('admin.classrooms.index')}
                    className="inline-flex items-center gap-2 text-sm font-semibold text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 px-4 py-2 rounded-lg shadow-sm transition-all duration-200"
                >
                    Hủy bỏ
                </Link>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100/80 dark:border-white/5 shadow-[0_2px_12px_rgb(0,0,0,0.03)] dark:shadow-none overflow-hidden transition-colors">
                <form onSubmit={handleSubmit} className="divide-y divide-gray-100 dark:divide-gray-700/50">
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 p-8">
                        <div className="md:col-span-1">
                            <h3 className="text-base font-bold text-gray-900 dark:text-white">Thông tin cơ sở</h3>
                            <p className="mt-1.5 text-sm font-medium text-gray-500 dark:text-gray-400 leading-relaxed">
                                Mã lớp học phần hiển thị trên Thời khóa biểu Sinh viên và Hệ thống Đăng ký.
                            </p>
                        </div>
                        <div className="md:col-span-2 space-y-6">
                            
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                    Mã Lớp Học phần <span className="text-rose-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={data.name}
                                    onChange={e => setData('name', e.target.value)}
                                    className={`w-full px-4 py-2.5 rounded-lg border text-sm font-mono shadow-sm bg-gray-50/50 dark:bg-gray-900/50 text-gray-900 dark:text-gray-100 outline-none transition-all duration-200 ${
                                        errors.name 
                                        ? 'border-rose-300 dark:border-rose-500/50 focus:ring-4 focus:ring-rose-500/20 focus:border-rose-500' 
                                        : 'border-gray-200 dark:border-gray-700 focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 hover:border-gray-300 dark:hover:border-gray-600'
                                    }`}
                                    placeholder="Ví dụ: SE101-01"
                                />
                                {errors.name && <p className="mt-2 text-sm text-rose-500 font-medium">{errors.name}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                    Môn học Liên kết (Học Phần) <span className="text-rose-500">*</span>
                                </label>
                                <div className="relative">
                                    <select
                                        value={data.subject_id}
                                        onChange={e => setData('subject_id', e.target.value)}
                                        className={`appearance-none block w-full pl-4 pr-10 py-2.5 rounded-lg border text-sm shadow-sm bg-gray-50/50 dark:bg-gray-900/50 text-gray-900 dark:text-gray-100 outline-none transition-all duration-200 ${
                                            errors.subject_id 
                                            ? 'border-rose-300 dark:border-rose-500/50 focus:ring-4 focus:ring-rose-500/20 focus:border-rose-500' 
                                            : 'border-gray-200 dark:border-gray-700 focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 hover:border-gray-300 dark:hover:border-gray-600'
                                        }`}
                                    >
                                        <option value="">-- Chọn Môn học --</option>
                                        {subjects.map(sub => (
                                            <option key={sub.id} value={sub.id}>
                                                {sub.code} - {sub.name}
                                            </option>
                                        ))}
                                    </select>
                                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                                    </div>
                                </div>
                                {errors.subject_id && <p className="mt-2 text-sm text-rose-500 font-medium">{errors.subject_id}</p>}
                            </div>

                            <div className="max-w-md">
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                    Phòng học
                                </label>
                                <input
                                    type="text"
                                    value={data.room}
                                    onChange={e => setData('room', e.target.value)}
                                    className={`w-full px-4 py-2.5 rounded-lg border text-sm shadow-sm bg-gray-50/50 dark:bg-gray-900/50 text-gray-900 dark:text-gray-100 outline-none transition-all duration-200 ${
                                        errors.room 
                                        ? 'border-rose-300 dark:border-rose-500/50 focus:ring-4 focus:ring-rose-500/20 focus:border-rose-500' 
                                        : 'border-gray-200 dark:border-gray-700 focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 hover:border-gray-300 dark:hover:border-gray-600'
                                    }`}
                                    placeholder="Ví dụ: P.301-A4"
                                />
                                {errors.room && <p className="mt-2 text-sm text-rose-500 font-medium">{errors.room}</p>}
                            </div>

                        </div>
                    </div>

                    <div className="px-8 py-5 bg-gray-50 dark:bg-gray-800/80 flex items-center justify-end gap-3 border-t border-gray-100/80 dark:border-gray-700/50">
                        <Link
                            href={route('admin.classrooms.index')}
                            className="px-5 py-2.5 text-sm font-semibold text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 rounded-lg shadow-sm transition-all duration-200"
                        >
                            Hủy
                        </Link>
                        <button
                            type="submit"
                            disabled={processing}
                            className="inline-flex items-center justify-center gap-2 bg-gray-900 dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-200 text-white dark:text-gray-900 text-sm px-6 py-2.5 rounded-lg shadow-[0_2px_4px_rgb(0,0,0,0.1)] hover:shadow-[0_4px_8px_rgb(0,0,0,0.15)] transition-all duration-200 font-semibold active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
                        >
                            {processing && (
                                <svg className="animate-spin -ml-1 h-4 w-4 text-white dark:text-gray-900" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            )}
                            {isEditing ? 'Lưu cập nhật' : 'Tạo Lớp'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

Form.layout = page => <AppLayout children={page} />;
