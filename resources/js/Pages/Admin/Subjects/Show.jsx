import React from 'react';
import AppLayout from '@/Layouts/AppLayout';
import { Head, Link } from '@inertiajs/react';

export default function Show({ subjectData, enrollments }) {
    // Tính toán thống kê nhanh
    const stats = React.useMemo(() => {
        if (!enrollments || enrollments.length === 0) return null;
        const total = enrollments.length;
        let sum = 0;
        let pass = 0;
        let count = 0;

        enrollments.forEach(enr => {
            if (enr.score && enr.score.total_score !== null) {
                sum += parseFloat(enr.score.total_score);
                count++;
                if (parseFloat(enr.score.total_score) >= 4.0) pass++;
            }
        });

        return {
            total,
            avg: count > 0 ? (sum / count).toFixed(2) : '0.00',
            passRate: total > 0 ? ((pass / total) * 100).toFixed(1) : '0.0'
        };
    }, [enrollments]);

    return (
        <div className="space-y-8 animate-fade-in pb-12 max-w-7xl mx-auto">
            <Head title={`Học Phần: ${subjectData.name}`} />

            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-5">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-rose-500 to-orange-500 dark:from-tertiary dark:to-tertiary-container flex items-center justify-center text-white text-3xl font-black shadow-xl shadow-rose-500/20">
                        {subjectData.name?.charAt(0) || 'S'}
                    </div>
                    <div>
                        <Link
                            href={route('admin.subjects.index')}
                            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-outline hover:text-rose-600 dark:hover:text-tertiary transition-colors mb-1"
                        >
                            <span className="material-symbols-outlined text-sm">arrow_back</span>
                            Kho Học Phần
                        </Link>
                        <h2 className="text-3xl font-black text-gray-900 dark:text-white leading-tight">
                            {subjectData.name}
                        </h2>
                        <div className="flex items-center gap-3 mt-1">
                            <span className="px-2.5 py-0.5 rounded-lg bg-rose-50 dark:bg-tertiary/10 border border-rose-100 dark:border-tertiary/20 text-[10px] font-bold text-rose-600 dark:text-tertiary tracking-widest uppercase font-mono">
                                {subjectData.code}
                            </span>
                            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500 dark:text-outline">
                                {subjectData.credits || subjectData.credit} Tín Chỉ Hệ Thống
                            </span>
                        </div>
                    </div>
                </div>

                <div className="flex gap-4">
                    <div className="bg-white dark:bg-surface-container-low p-4 rounded-xl border border-gray-200 dark:border-outline-variant/10 shadow-sm min-w-[120px] text-center border-b-2 border-rose-500">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500 dark:text-outline mb-1">Sinh Viên</p>
                        <p className="text-2xl font-black text-gray-900 dark:text-white">{stats?.total || 0}</p>
                    </div>
                    <div className="bg-white dark:bg-surface-container-low p-4 rounded-xl border border-gray-200 dark:border-outline-variant/10 shadow-sm min-w-[120px] text-center border-b-2 border-emerald-500">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500 dark:text-outline mb-1">Tỷ Lệ Đạt</p>
                        <p className="text-2xl font-black text-emerald-600 dark:text-secondary">{stats?.passRate || 0}%</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Main Content - Student List */}
                <div className="lg:col-span-8 space-y-6">
                    {/* Student List */}
                    <div className="glass-card bg-white dark:bg-transparent rounded-2xl overflow-hidden shadow-sm dark:shadow-2xl border border-gray-200 dark:border-outline-variant/10">
                        <div className="p-6 border-b border-gray-200 dark:border-outline-variant/10 bg-gray-50/50 dark:bg-surface-container-low/30 flex items-center justify-between">
                            <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-widest">Danh Sách Học Viên Đăng Ký</h3>
                            <span className="text-[10px] font-bold text-gray-400 dark:text-outline italic">Dữ liệu thời gian thực</span>
                        </div>
                        
                        <div className="overflow-x-auto">
                            <table className="w-full text-left whitespace-nowrap">
                                <thead>
                                    <tr className="bg-gray-50 dark:bg-surface-container-low/50 border-b border-gray-200 dark:border-outline-variant/10">
                                        <th className="px-6 py-4 font-['Inter'] uppercase tracking-widest text-[10px] font-bold text-gray-500 dark:text-outline">Mã SV</th>
                                        <th className="px-6 py-4 font-['Inter'] uppercase tracking-widest text-[10px] font-bold text-gray-500 dark:text-outline">Họ và Tên</th>
                                        <th className="px-6 py-4 font-['Inter'] uppercase tracking-widest text-[10px] font-bold text-gray-500 dark:text-outline text-center">Điểm TB</th>
                                        <th className="px-6 py-4 font-['Inter'] uppercase tracking-widest text-[10px] font-bold text-gray-500 dark:text-outline text-right">Giảng Viên</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 dark:divide-outline-variant/5">
                                    {enrollments && enrollments.length > 0 ? (
                                        enrollments.map((enr, idx) => (
                                            <tr key={idx} className="hover:bg-gray-50/50 dark:hover:bg-white/5 transition-colors group">
                                                <td className="px-6 py-4 font-mono text-xs font-bold text-rose-600 dark:text-tertiary">{enr.student_code}</td>
                                                <td className="px-6 py-4">
                                                    <div className="font-bold text-gray-900 dark:text-white text-sm tracking-wide group-hover:text-rose-600 dark:group-hover:text-tertiary transition-colors">{enr.student_name}</div>
                                                    <div className="text-[10px] text-gray-500 dark:text-outline">{enr.student_email}</div>
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    <span className="font-mono font-black text-sm text-gray-900 dark:text-white">{enr.score?.total_score || '--'}</span>
                                                </td>
                                                <td className="px-6 py-4 text-right italic text-xs text-gray-500">{enr.teacher_name}</td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr><td colSpan="4" className="px-6 py-12 text-center text-gray-400">Chưa có sinh viên</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Materials Section */}
                    <div className="glass-card bg-white dark:bg-transparent rounded-2xl overflow-hidden shadow-sm dark:shadow-2xl border border-gray-200 dark:border-outline-variant/10">
                        <div className="p-6 border-b border-gray-200 dark:border-outline-variant/10 bg-gray-50/50 dark:bg-surface-container-low/30 flex items-center justify-between">
                            <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-widest flex items-center gap-2">
                                <span className="material-symbols-outlined text-lg">folder_open</span> Học Liệu Môn Học
                            </h3>
                        </div>
                        <div className="p-6">
                            {materials && materials.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {materials.map(m => (
                                        <div key={m.id} className="p-4 rounded-xl border border-gray-100 dark:border-outline-variant/10 bg-gray-50 dark:bg-white/5 flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-lg bg-indigo-500/10 text-indigo-500 flex items-center justify-center">
                                                <span className="material-symbols-outlined">description</span>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-bold text-sm text-gray-900 dark:text-white truncate">{m.title}</p>
                                                <p className="text-[10px] text-gray-500">GV: {m.teacher?.user?.name}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-center py-8 text-gray-400 text-xs italic font-bold uppercase tracking-widest">Chưa có học liệu</p>
                            )}
                        </div>
                    </div>

                    {/* Assignments Section */}
                    <div className="glass-card bg-white dark:bg-transparent rounded-2xl overflow-hidden shadow-sm dark:shadow-2xl border border-gray-200 dark:border-outline-variant/10">
                        <div className="p-6 border-b border-gray-200 dark:border-outline-variant/10 bg-gray-50/50 dark:bg-surface-container-low/30 flex items-center justify-between">
                            <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-widest flex items-center gap-2">
                                <span className="material-symbols-outlined text-lg">assignment</span> Bài Tập Đánh Giá
                            </h3>
                        </div>
                        <div className="p-6">
                            {assignments && assignments.length > 0 ? (
                                <div className="space-y-4">
                                    {assignments.map(a => (
                                        <div key={a.id} className="p-4 rounded-xl border border-gray-100 dark:border-outline-variant/10 bg-gray-50 dark:bg-white/5 flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                                                    <span className="material-symbols-outlined">task</span>
                                                </div>
                                                <div>
                                                    <p className="font-bold text-sm text-gray-900 dark:text-white">{a.title}</p>
                                                    <p className="text-[10px] text-gray-500 italic">Hạn chót: {new Date(a.deadline).toLocaleDateString('vi-VN')}</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <span className="text-[10px] font-bold bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 px-2 py-0.5 rounded-full uppercase">Đang mở</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-center py-8 text-gray-400 text-xs italic font-bold uppercase tracking-widest">Chưa có bài tập</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Sidebar Info */}
                <div className="lg:col-span-4 space-y-6">
                    <div className="glass-card bg-white dark:bg-surface-container-low rounded-2xl p-6 border border-gray-200 dark:border-outline-variant/10 shadow-sm">
                        <h4 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-outline mb-4 flex items-center gap-2">
                            <span className="material-symbols-outlined text-sm">info</span>
                            Thông Tin Cấu Trình
                        </h4>
                        <div className="space-y-4">
                            <div>
                                <p className="text-[10px] font-bold text-gray-500 dark:text-outline uppercase tracking-tighter">Tên Chính Thức</p>
                                <p className="text-sm font-bold text-gray-900 dark:text-white capitalize">{subjectData.name}</p>
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-gray-500 dark:text-outline uppercase tracking-tighter">Số Tín Chỉ Quy Đổi</p>
                                <p className="text-sm font-black text-rose-600 dark:text-tertiary">{subjectData.credits || subjectData.credit} TC</p>
                            </div>
                            <div className="pt-4 border-t border-gray-100 dark:border-outline-variant/10">
                                <Link
                                    href={route('admin.subjects.edit', subjectData.id)}
                                    className="w-full flex items-center justify-center gap-2 bg-gray-900 dark:bg-surface-container-highest text-white py-3 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-black dark:hover:bg-white dark:hover:text-black transition-all active:scale-95 shadow-lg shadow-black/10"
                                >
                                    <span className="material-symbols-outlined text-lg">edit</span>
                                    Chỉnh Sửa Học Phần
                                </Link>
                            </div>
                        </div>
                    </div>

                    <div className="glass-card bg-gradient-to-br from-indigo-600 to-purple-700 dark:from-primary dark:to-primary-container rounded-2xl p-6 text-white shadow-xl shadow-indigo-500/20">
                        <h4 className="text-[10px] font-bold uppercase tracking-widest opacity-70 mb-4">Ghi Chú Đào Tạo</h4>
                        <p className="text-xs font-medium leading-relaxed opacity-90">
                            Học phần này đóng vai trò quan trọng trong khung chương trình. Yêu cầu giảng viên cập nhật điểm số đúng hạn định kỳ sau mỗi học phần.
                        </p>
                        <div className="mt-6 pt-5 border-t border-white/10 flex items-center justify-between">
                            <div className="text-center">
                                <p className="text-lg font-black">{stats?.avg || '0.00'}</p>
                                <p className="text-[8px] font-bold uppercase opacity-60">Điểm TB Môn</p>
                            </div>
                            <div className="w-[1px] h-6 bg-white/20"></div>
                            <div className="text-center">
                                <p className="text-lg font-black">{stats?.passRate || 0}%</p>
                                <p className="text-[8px] font-bold uppercase opacity-60">Tỷ lệ qua môn</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

Show.layout = page => <AppLayout children={page} />;