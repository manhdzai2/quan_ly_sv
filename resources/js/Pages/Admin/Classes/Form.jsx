import React from 'react';
import AppLayout from '@/Layouts/AppLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Form({ mode, classData }) {
    const isEditing = mode === 'edit';

    const { data, setData, post, put, processing, errors } = useForm({
        name: classData?.name || '',
        description: classData?.description || '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isEditing) {
            put(route('admin.classes.update', classData.id));
        } else {
            post(route('admin.classes.store'));
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-fade-in-up py-4">
            <Head title={isEditing ? 'Sửa Lớp Cố vấn' : 'Tạo Lớp Cố vấn mới'} />

            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
                        {isEditing ? 'Chỉnh sửa Lớp Cố vấn' : 'Khởi tạo Lớp Cố vấn mới'}
                    </h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1.5 font-medium">
                        Quản lý các thông tin định danh của lớp hành chính.
                    </p>
                </div>
                <Link
                    href={route('admin.classes.index')}
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
                                Mã lớp cố vấn (Lớp Sinh viên) dùng để nhóm các sinh viên lại với nhau theo khóa đào tạo chính quy.
                            </p>
                        </div>
                        <div className="md:col-span-2 space-y-6">
                            
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                    Mã Lớp (Class Code) <span className="text-rose-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={data.name}
                                    onChange={e => setData('name', e.target.value)}
                                    className={`w-full md:max-w-md px-4 py-2.5 rounded-lg border text-sm font-mono shadow-sm bg-gray-50/50 dark:bg-gray-900/50 text-gray-900 dark:text-gray-100 outline-none transition-all duration-200 ${
                                        errors.name 
                                        ? 'border-rose-300 dark:border-rose-500/50 focus:ring-4 focus:ring-rose-500/20 focus:border-rose-500' 
                                        : 'border-gray-200 dark:border-gray-700 focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 hover:border-gray-300 dark:hover:border-gray-600'
                                    }`}
                                    placeholder="Ví dụ: K62-CNTT-01"
                                />
                                {errors.name && <p className="mt-2 text-sm text-rose-500 font-medium">{errors.name}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                    Mô tả định hướng (Không bắt buộc)
                                </label>
                                <textarea
                                    rows="4"
                                    value={data.description}
                                    onChange={e => setData('description', e.target.value)}
                                    className={`w-full px-4 py-2.5 rounded-lg border text-sm shadow-sm bg-gray-50/50 dark:bg-gray-900/50 text-gray-900 dark:text-gray-100 outline-none transition-all duration-200 ${
                                        errors.description 
                                        ? 'border-rose-300 dark:border-rose-500/50 focus:ring-4 focus:ring-rose-500/20 focus:border-rose-500' 
                                        : 'border-gray-200 dark:border-gray-700 focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 hover:border-gray-300 dark:hover:border-gray-600'
                                    }`}
                                    placeholder="Ví dụ: Lớp chất lượng cao định hướng kỹ sư Điện toán đám mây..."
                                />
                                {errors.description && <p className="mt-2 text-sm text-rose-500 font-medium">{errors.description}</p>}
                            </div>

                        </div>
                    </div>

                    <div className="px-8 py-5 bg-gray-50 dark:bg-gray-800/80 flex items-center justify-end gap-3 border-t border-gray-100/80 dark:border-gray-700/50">
                        <Link
                            href={route('admin.classes.index')}
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
                            {isEditing ? 'Lưu cập nhật' : 'Hoàn tất khởi tạo'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

Form.layout = page => <AppLayout children={page} />;