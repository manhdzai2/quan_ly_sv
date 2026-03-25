import React from 'react';
import AppLayout from '@/Layouts/AppLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Form({ classroom, subjects }) {
    const isEdit = !!classroom;

    const { data, setData, post, put, processing, errors } = useForm({
        name: classroom?.name || '',
        subject_id: classroom?.subject_id || '',
        room: classroom?.room || '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isEdit) {
            put(route('admin.classrooms.update', classroom.id));
        } else {
            post(route('admin.classrooms.store'));
        }
    };

    return (
        <div className="max-w-7xl mx-auto space-y-6 animate-fade-in">
            <Head title={isEdit ? 'Cập nhật Lớp học' : 'Mở Lớp mới'} />

            {/* HEADER */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                        {isEdit ? 'Cập nhật Lớp học' : 'Mở Lớp mới'}
                    </h1>
                </div>
                <Link
                    href={route('admin.classrooms.index')}
                    className="shrink-0 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-xl shadow-sm font-medium transition-colors"
                >
                    Quay lại
                </Link>
            </div>

            {/* FORM */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
                <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
                    
                    {/* Tên lớp */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">
                            Tên lớp / Mã lớp <span className="text-rose-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={data.name}
                            onChange={e => setData('name', e.target.value)}
                            className="block w-full rounded-xl border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="VD: Lập trình Web - N01"
                        />
                        {errors.name && <p className="mt-2 text-sm text-rose-600">{errors.name}</p>}
                    </div>

                    {/* Chọn Môn học */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">
                            Thuộc môn học <span className="text-rose-500">*</span>
                        </label>
                        <select
                            value={data.subject_id}
                            onChange={e => setData('subject_id', e.target.value)}
                            className="block w-full rounded-xl border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                        >
                            <option value="">-- Chọn môn học --</option>
                            {subjects.map(subject => (
                                <option key={subject.id} value={subject.id}>
                                    {subject.code} - {subject.name}
                                </option>
                            ))}
                        </select>
                        {errors.subject_id && <p className="mt-2 text-sm text-rose-600">{errors.subject_id}</p>}
                    </div>

                    {/* Phòng học */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Phòng học</label>
                        <input
                            type="text"
                            value={data.room}
                            onChange={e => setData('room', e.target.value)}
                            className="block w-full rounded-xl border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="VD: 302-A2"
                        />
                    </div>

                    {/* Nút Submit */}
                    <div className="pt-6 border-t border-gray-100">
                        <button
                            type="submit"
                            disabled={processing}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl shadow-sm font-semibold disabled:opacity-70"
                        >
                            {isEdit ? 'Lưu thay đổi' : 'Tạo lớp học'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

Form.layout = page => <AppLayout children={page} />;