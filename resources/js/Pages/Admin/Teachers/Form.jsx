import React from 'react';
import AppLayout from '@/Layouts/AppLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Form({ teacher }) {
    const isEditing = !!teacher;

    const { data, setData, post, put, processing, errors } = useForm({
        name: teacher?.user?.name || '',
        email: teacher?.user?.email || '',
        phone: teacher?.phone || '',
        password: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isEditing) {
            put(route('admin.teachers.update', teacher.id));
        } else {
            post(route('admin.teachers.store'));
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-fade-in py-8">
            <Head title={isEditing ? 'Chỉnh sửa Giáo viên' : 'Thêm Giáo viên mới'} />

            {/* HEADER */}
            <div className="flex items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 tracking-tight">
                        {isEditing ? 'Hồ sơ Giảng viên' : 'Tạo mới Giảng viên'}
                    </h1>
                    <p className="text-sm text-gray-500 mt-2 font-medium">
                        {isEditing ? `Cập nhật dữ liệu cho giảng viên ${data.name}` : 'Thiết lập tài khoản và định danh cho giảng viên mới.'}
                    </p>
                </div>
                <Link
                    href={route('admin.teachers.index')}
                    className="inline-flex items-center justify-center gap-2 bg-white/80 backdrop-blur-md border border-gray-200 hover:border-indigo-300 text-gray-700 hover:text-indigo-600 px-5 py-2.5 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 font-semibold group"
                >
                    <svg className="w-5 h-5 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                    Quay lại
                </Link>
            </div>

            {/* FORM */}
            <div className="bg-white/80 backdrop-blur-2xl rounded-[2rem] shadow-2xl shadow-indigo-100/50 border border-white overflow-hidden relative">
                {/* Decorative blob top right */}
                <div className="absolute top-0 right-0 -mt-16 -mr-16 w-64 h-64 bg-gradient-to-br from-indigo-400 to-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 pointer-events-none"></div>
                {/* Decorative blob bottom left */}
                <div className="absolute bottom-0 left-0 -mb-16 -ml-16 w-64 h-64 bg-gradient-to-br from-blue-400 to-teal-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 pointer-events-none"></div>

                <form onSubmit={handleSubmit} className="p-8 md:p-12 space-y-8 relative z-10">
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        {/* Cột 1: Thông tin tài khoản */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-3 bg-indigo-50 rounded-2xl text-indigo-600">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                                </div>
                                <h3 className="text-xl font-bold text-gray-800">Thông tin Tài khoản</h3>
                            </div>
                            
                            <div className="space-y-5">
                                <div className="group">
                                    <label className="block text-sm font-semibold text-gray-700 mb-1.5 transition-colors group-focus-within:text-indigo-600">Họ và Tên <span className="text-rose-500">*</span></label>
                                    <input
                                        type="text"
                                        value={data.name}
                                        onChange={e => setData('name', e.target.value)}
                                        className={`w-full px-4 py-3 rounded-2xl shadow-sm outline-none transition-all duration-300 ${errors.name ? 'border-rose-300 bg-rose-50 focus:ring-4 focus:ring-rose-500/20 focus:border-rose-500' : 'border-gray-200 bg-gray-50/50 focus:bg-white focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500'}`}
                                        placeholder="VD: TS. Nguyễn Văn A"
                                    />
                                    {errors.name && <p className="mt-2 text-sm text-rose-500 font-medium">{errors.name}</p>}
                                </div>

                                <div className="group">
                                    <label className="block text-sm font-semibold text-gray-700 mb-1.5 transition-colors group-focus-within:text-indigo-600">Email Truy Cập <span className="text-rose-500">*</span></label>
                                    <input
                                        type="email"
                                        value={data.email}
                                        onChange={e => setData('email', e.target.value)}
                                        className={`w-full px-4 py-3 rounded-2xl shadow-sm outline-none transition-all duration-300 ${errors.email ? 'border-rose-300 bg-rose-50 focus:ring-4 focus:ring-rose-500/20 focus:border-rose-500' : 'border-gray-200 bg-gray-50/50 focus:bg-white focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500'}`}
                                        placeholder="VD: gv.nguyena@university.edu"
                                    />
                                    {errors.email && <p className="mt-2 text-sm text-rose-500 font-medium">{errors.email}</p>}
                                </div>

                                <div className="group">
                                    <label className="block text-sm font-semibold text-gray-700 mb-1.5 transition-colors group-focus-within:text-indigo-600">
                                        Mật khẩu {isEditing && <span className="text-gray-400 font-normal ml-1">(Bỏ trống nếu giữ nguyên)</span>} {!isEditing && <span className="text-rose-500">*</span>}
                                    </label>
                                    <input
                                        type="password"
                                        value={data.password}
                                        onChange={e => setData('password', e.target.value)}
                                        className={`w-full px-4 py-3 rounded-2xl shadow-sm outline-none transition-all duration-300 ${errors.password ? 'border-rose-300 bg-rose-50 focus:ring-4 focus:ring-rose-500/20 focus:border-rose-500' : 'border-gray-200 bg-gray-50/50 focus:bg-white focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500'}`}
                                        placeholder="********"
                                    />
                                    {errors.password && <p className="mt-2 text-sm text-rose-500 font-medium">{errors.password}</p>}
                                </div>
                            </div>
                        </div>

                        {/* Cột 2: Thông tin liên lạc */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-3 bg-purple-50 rounded-2xl text-purple-600">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                                </div>
                                <h3 className="text-xl font-bold text-gray-800">Liên hệ & Định danh</h3>
                            </div>
                            
                            <div className="space-y-5">
                                <div className="group">
                                    <label className="block text-sm font-semibold text-gray-700 mb-1.5 transition-colors group-focus-within:text-purple-600">Số điện thoại</label>
                                    <input
                                        type="text"
                                        value={data.phone}
                                        onChange={e => setData('phone', e.target.value)}
                                        className={`w-full px-4 py-3 rounded-2xl shadow-sm outline-none transition-all duration-300 ${errors.phone ? 'border-rose-300 bg-rose-50 focus:ring-4 focus:ring-rose-500/20 focus:border-rose-500' : 'border-gray-200 bg-gray-50/50 focus:bg-white focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500'}`}
                                        placeholder="0912 345 678"
                                    />
                                    {errors.phone && <p className="mt-2 text-sm text-rose-500 font-medium">{errors.phone}</p>}
                                </div>
                                
                                <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-[1.5rem] p-6 mt-6 border border-white shadow-inner">
                                    <div className="flex gap-4">
                                        <div className="bg-white p-2.5 rounded-xl shadow-sm h-11 w-11 flex items-center justify-center shrink-0 text-indigo-500">
                                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-indigo-900 mb-1">Cấp quyền Tự động</h4>
                                            <p className="text-sm text-indigo-800/80 leading-relaxed">
                                                Tài khoản này sẽ tự động được gán quyền <strong>Teacher (Role ID: 2)</strong>. Giảng viên có thể đăng nhập ngay lập tức để thực hiện công tác quản lý điểm và lớp học.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* NÚT SUBMIT */}
                    <div className="pt-8 mt-10 border-t border-gray-100 flex justify-end gap-4">
                        <Link
                            href={route('admin.teachers.index')}
                            className="px-6 py-3 text-gray-700 bg-gray-100/50 border border-gray-200 rounded-2xl hover:bg-gray-100 font-bold transition-all duration-300"
                        >
                            Hủy bỏ
                        </Link>
                        <button
                            type="submit"
                            disabled={processing}
                            className="inline-flex items-center justify-center gap-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-8 py-3 rounded-2xl shadow-xl shadow-indigo-500/30 hover:shadow-indigo-500/50 transition-all duration-300 transform hover:-translate-y-1 font-bold disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
                        >
                            {processing && (
                                <svg className="animate-spin -ml-1 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            )}
                            {isEditing ? 'Lưu thay đổi' : 'Hoàn tất & Lưu'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

Form.layout = page => <AppLayout children={page} />;
