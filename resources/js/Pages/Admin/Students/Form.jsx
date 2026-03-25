import React from 'react';
import AppLayout from '@/Layouts/AppLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Form({ student, classes }) {
    const isEditing = !!student;

    const { data, setData, post, put, processing, errors } = useForm({
        name: student?.user?.name || '',
        email: student?.user?.email || '',
        student_code: student?.student_code || '',
        class_id: student?.class_id || '',
        password: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isEditing) {
            put(route('admin.students.update', student.id));
        } else {
            post(route('admin.students.store'));
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-fade-in-up py-4">
            <Head title={isEditing ? 'Hồ sơ Sinh viên' : 'Thêm Sinh viên mới'} />

            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
                        {isEditing ? 'Hồ sơ cá nhân' : 'Đăng ký sinh viên mới'}
                    </h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1.5 font-medium">
                        {isEditing 
                            ? `Chỉnh sửa dữ liệu của sinh viên mã ${data.student_code}` 
                            : 'Thiết lập tài khoản đăng nhập và thông tin cơ sở cho sinh viên.'}
                    </p>
                </div>
                <Link
                    href={route('admin.students.index')}
                    className="inline-flex items-center gap-2 text-sm font-semibold text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 px-4 py-2 rounded-lg shadow-sm transition-all duration-200"
                >
                    Hủy bỏ
                </Link>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100/80 dark:border-white/5 shadow-[0_2px_12px_rgb(0,0,0,0.03)] dark:shadow-none overflow-hidden transition-colors">
                <form onSubmit={handleSubmit} className="divide-y divide-gray-100 dark:divide-gray-700/50">
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 p-8">
                        <div className="md:col-span-1">
                            <h3 className="text-base font-bold text-gray-900 dark:text-white">Thông tin đào tạo</h3>
                            <p className="mt-1.5 text-sm font-medium text-gray-500 dark:text-gray-400 leading-relaxed">
                                Mã sinh viên là mã định danh duy nhất trên toàn hệ thống. Mã này sẽ được hiển thị trên các báo cáo và bảng điểm.
                            </p>
                        </div>
                        <div className="md:col-span-2 space-y-5">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                    Mã định danh (Student Code) <span className="text-rose-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={data.student_code}
                                    onChange={e => setData('student_code', e.target.value)}
                                    className={`w-full md:max-w-md px-4 py-2.5 rounded-lg border text-sm font-mono shadow-sm bg-gray-50/50 dark:bg-gray-900/50 text-gray-900 dark:text-gray-100 outline-none transition-all duration-200 ${
                                        errors.student_code 
                                        ? 'border-rose-300 dark:border-rose-500/50 focus:ring-4 focus:ring-rose-500/20 focus:border-rose-500' 
                                        : 'border-gray-200 dark:border-gray-700 focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 hover:border-gray-300 dark:hover:border-gray-600'
                                    }`}
                                    placeholder="Ví dụ: SV250001"
                                />
                                {errors.student_code && <p className="mt-2 text-sm text-rose-500 font-medium">{errors.student_code}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                    Lớp học phần <span className="text-rose-500">*</span>
                                </label>
                                <select
                                    value={data.class_id}
                                    onChange={e => setData('class_id', e.target.value)}
                                    className={`w-full md:max-w-md px-4 py-2.5 rounded-lg border text-sm shadow-sm bg-gray-50/50 dark:bg-gray-900/50 text-gray-900 dark:text-gray-100 outline-none transition-all duration-200 ${
                                        errors.class_id 
                                        ? 'border-rose-300 dark:border-rose-500/50 focus:ring-4 focus:ring-rose-500/20 focus:border-rose-500' 
                                        : 'border-gray-200 dark:border-gray-700 focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 hover:border-gray-300 dark:hover:border-gray-600'
                                    }`}
                                >
                                    <option value="">-- Chọn lớp học --</option>
                                    {classes && classes.map(c => (
                                        <option key={c.id} value={c.id}>{c.name} - {c.description}</option>
                                    ))}
                                </select>
                                {errors.class_id && <p className="mt-2 text-sm text-rose-500 font-medium">{errors.class_id}</p>}
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 p-8 bg-gray-50/30 dark:bg-gray-800/50">
                        <div className="md:col-span-1">
                            <h3 className="text-base font-bold text-gray-900 dark:text-white">Tài khoản đăng nhập</h3>
                            <p className="mt-1.5 text-sm font-medium text-gray-500 dark:text-gray-400 leading-relaxed">
                                Tài khoản này được tự động cấp quyền <strong>Sinh Viên</strong>. Dùng email và mật khẩu bên dưới để đăng nhập xem lịch học và điểm số.
                            </p>
                        </div>
                        <div className="md:col-span-2 space-y-6">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                        Họ và Tên <span className="text-rose-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={data.name}
                                        onChange={e => setData('name', e.target.value)}
                                        className={`w-full px-4 py-2.5 rounded-lg border text-sm shadow-sm bg-gray-50/50 dark:bg-gray-900/50 text-gray-900 dark:text-gray-100 outline-none transition-all duration-200 ${
                                            errors.name 
                                            ? 'border-rose-300 dark:border-rose-500/50 focus:ring-4 focus:ring-rose-500/20 focus:border-rose-500' 
                                            : 'border-gray-200 dark:border-gray-700 focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 hover:border-gray-300 dark:hover:border-gray-600'
                                        }`}
                                        placeholder="Nguyễn Văn A"
                                    />
                                    {errors.name && <p className="mt-2 text-sm text-rose-500 font-medium">{errors.name}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                        Địa chỉ Email <span className="text-rose-500">*</span>
                                    </label>
                                    <input
                                        type="email"
                                        value={data.email}
                                        onChange={e => setData('email', e.target.value)}
                                        className={`w-full px-4 py-2.5 rounded-lg border text-sm shadow-sm bg-gray-50/50 dark:bg-gray-900/50 text-gray-900 dark:text-gray-100 outline-none transition-all duration-200 ${
                                            errors.email 
                                            ? 'border-rose-300 dark:border-rose-500/50 focus:ring-4 focus:ring-rose-500/20 focus:border-rose-500' 
                                            : 'border-gray-200 dark:border-gray-700 focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 hover:border-gray-300 dark:hover:border-gray-600'
                                        }`}
                                        placeholder="nguyenvana@university.edu.vn"
                                    />
                                    {errors.email && <p className="mt-2 text-sm text-rose-500 font-medium">{errors.email}</p>}
                                </div>
                            </div>

                            <div className="max-w-md">
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                    Mật khẩu đăng nhập
                                    {isEditing && <span className="text-gray-400 font-normal ml-1">(Bỏ trống nếu giữ nguyên)</span>}
                                    {!isEditing && <span className="text-rose-500 ml-1">*</span>}
                                </label>
                                <input
                                    type="password"
                                    value={data.password}
                                    onChange={e => setData('password', e.target.value)}
                                    className={`w-full px-4 py-2.5 rounded-lg border text-sm shadow-sm bg-gray-50/50 dark:bg-gray-900/50 text-gray-900 dark:text-gray-100 outline-none transition-all duration-200 ${
                                        errors.password 
                                        ? 'border-rose-300 dark:border-rose-500/50 focus:ring-4 focus:ring-rose-500/20 focus:border-rose-500' 
                                        : 'border-gray-200 dark:border-gray-700 focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 hover:border-gray-300 dark:hover:border-gray-600'
                                    }`}
                                    placeholder="Tối thiểu 8 ký tự"
                                />
                                {errors.password && <p className="mt-2 text-sm text-rose-500 font-medium">{errors.password}</p>}
                            </div>
                        </div>
                    </div>

                    <div className="px-8 py-5 bg-gray-50 dark:bg-gray-800/80 flex items-center justify-end gap-3 border-t border-gray-100/80 dark:border-gray-700/50">
                        <Link
                            href={route('admin.students.index')}
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
                            {isEditing ? 'Lưu cập nhật' : 'Hoàn tất đăng ký'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

Form.layout = page => <AppLayout children={page} />;