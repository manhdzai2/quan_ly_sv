import React from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link } from '@inertiajs/react';

export default function Show({ student }) {
    const user = student?.user;
    const enrollments = student?.enrollments || [];

    const handleExportExcel = async () => {
        if (!enrollments || enrollments.length === 0) return alert("Không có dữ liệu.");
        const XLSX = await import('xlsx');
        const exportData = enrollments.map((enr, i) => ({
            "STT": i + 1,
            "Mã Học Phần": enr.subject?.code || '',
            "Tên Học Phần": enr.subject?.name || '',
            "Số Tín Chỉ": enr.subject?.credits || enr.subject?.credit || '',
            "Giảng Viên": enr.teacher?.user?.name || '',
            "Chuyên Cần": enr.score?.attendance_score ?? '-',
            "Giữa Kỳ": enr.score?.midterm_score ?? '-',
            "Cuối Kỳ": enr.score?.final_score ?? '-',
            "Tổng Kết": enr.score?.total_score ?? '-',
            "Xếp Loại": enr.score?.grade || 'Chờ'
        }));
        const worksheet = XLSX.utils.json_to_sheet(exportData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "BangDiem");
        XLSX.writeFile(workbook, `Bang_Diem_${student.student_code}.xlsx`);
    };

    const handleExportPDF = async () => {
        if (!enrollments || enrollments.length === 0) return alert("Không có dữ liệu.");
        const { default: jsPDF } = await import('jspdf');
        await import('jspdf-autotable');
        const doc = new jsPDF();
        
        doc.text(`Bang Diem Sinh Vien: ${(student?.user?.name || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D')}`, 14, 15);
        doc.text(`Ma Sinh Vien: ${student?.student_code || ''}`, 14, 22);

        const tableColumn = ["STT", "Ma HP", "Ten Mon", "GV", "CC", "GK", "CK", "Tong Ket", "Xep Loai"];
        const tableRows = [];

        enrollments.forEach((enr, i) => {
            const data = [
                i + 1,
                enr.subject?.code || '',
                (enr.subject?.name || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D'),
                (enr.teacher?.user?.name || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D'),
                enr.score?.attendance_score ?? '-',
                enr.score?.midterm_score ?? '-',
                enr.score?.final_score ?? '-',
                enr.score?.total_score ?? '-',
                (enr.score?.grade || 'Cho').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D')
            ];
            tableRows.push(data);
        });

        doc.autoTable({
            head: [tableColumn],
            body: tableRows,
            startY: 30,
        });
        doc.save(`Bang_Diem_${student.student_code}.pdf`);
    };

    return (
        <div className="space-y-8 animate-fade-in-up pb-12 max-w-6xl mx-auto">
            <Head title={`Chi tiết: ${user?.name}`} />

            {/* Back + Header */}
            <div className="flex items-center justify-between">
                <Link href={route('admin.students.index')} className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 dark:text-outline hover:text-indigo-600 dark:hover:text-primary transition-colors">
                    <span className="material-symbols-outlined text-lg">arrow_back</span>
                    Quay lại danh sách
                </Link>
                <Link href={route('admin.students.edit', student.id)} className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 dark:bg-primary text-white dark:text-on-primary rounded-xl text-sm font-bold hover:-translate-y-0.5 transition-all shadow-lg shadow-indigo-500/20">
                    <span className="material-symbols-outlined text-lg">edit</span>
                    Chỉnh sửa
                </Link>
            </div>

            {/* Profile Card */}
            <div className="bg-white dark:bg-surface-container-low rounded-2xl border border-gray-200 dark:border-outline-variant/10 shadow-sm overflow-hidden">
                <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-primary/10 dark:to-transparent p-8 flex flex-col md:flex-row gap-6 items-center md:items-start">
                    <div className="w-20 h-20 rounded-2xl bg-indigo-600 dark:bg-primary flex items-center justify-center text-white text-3xl font-black shadow-lg">
                        {user?.name?.charAt(0) || 'S'}
                    </div>
                    <div className="text-center md:text-left flex-1">
                        <h1 className="text-2xl font-black text-gray-900 dark:text-white">{user?.name}</h1>
                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mt-3">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white dark:bg-surface-container-highest text-xs font-bold font-mono text-indigo-600 dark:text-primary border border-indigo-200 dark:border-primary/20 shadow-sm">
                                <span className="material-symbols-outlined text-[14px]">pin</span>
                                {student.student_code}
                            </span>
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white dark:bg-surface-container-highest text-xs font-bold text-gray-600 dark:text-on-surface border border-gray-200 dark:border-outline-variant/10 shadow-sm">
                                <span className="material-symbols-outlined text-[14px] text-emerald-600 dark:text-secondary">diversity_3</span>
                                Lớp: {student.class?.name || 'Chưa xếp'}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Info Grid */}
                <div className="grid grid-cols-1 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-gray-100 dark:divide-outline-variant/10 p-0">
                    {[
                        { icon: 'mail', label: 'Email', value: user?.email || 'Chưa có' },
                        { icon: 'smartphone', label: 'Số điện thoại', value: student.phone || 'Chưa cung cấp' },
                        { icon: 'cake', label: 'Ngày sinh', value: student.dob ? new Date(student.dob).toLocaleDateString('vi-VN') : 'Chưa có' },
                        { icon: student.gender === 'male' ? 'male' : 'female', label: 'Giới tính', value: student.gender === 'male' ? 'Nam' : student.gender === 'female' ? 'Nữ' : 'Khác' },
                    ].map((item, i) => (
                        <div key={i} className="p-5 text-center">
                            <span className="material-symbols-outlined text-gray-400 dark:text-outline text-2xl mb-2 block">{item.icon}</span>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500 dark:text-outline mb-1">{item.label}</p>
                            <p className="text-sm font-bold text-gray-900 dark:text-white">{item.value}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Address */}
            {student.address && (
                <div className="bg-white dark:bg-surface-container-low rounded-xl border border-gray-200 dark:border-outline-variant/10 shadow-sm p-5 flex items-start gap-3">
                    <span className="material-symbols-outlined text-gray-400 dark:text-outline mt-0.5">location_on</span>
                    <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500 dark:text-outline mb-1">Địa chỉ thường trú</p>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{student.address}</p>
                    </div>
                </div>
            )}

            {/* Academic Transcript */}
            <div className="bg-white dark:bg-surface-container-low rounded-2xl border border-gray-200 dark:border-outline-variant/10 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-200 dark:border-outline-variant/10 bg-gray-50/50 dark:bg-surface-container-low/30 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-emerald-50 dark:bg-secondary/10 rounded-xl flex items-center justify-center text-emerald-600 dark:text-secondary">
                            <span className="material-symbols-outlined">school</span>
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Bảng Điểm Học Tập</h2>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500 dark:text-outline">{enrollments.length} học phần đăng ký</p>
                        </div>
                    </div>
                    
                    <div className="flex gap-2 relative z-10">
                        <button 
                            onClick={handleExportExcel}
                            className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 dark:bg-secondary/10 dark:hover:bg-secondary/20 dark:text-secondary rounded-lg text-xs font-bold transition-colors border border-emerald-200 dark:border-secondary/20 shadow-sm"
                        >
                            <span className="material-symbols-outlined text-[16px]">table_chart</span> Excel
                        </button>
                        <button 
                            onClick={handleExportPDF}
                            className="flex items-center gap-2 px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 dark:bg-tertiary/10 dark:hover:bg-tertiary/20 dark:text-tertiary rounded-lg text-xs font-bold transition-colors border border-rose-200 dark:border-tertiary/20 shadow-sm"
                        >
                            <span className="material-symbols-outlined text-[16px]">picture_as_pdf</span> PDF
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left whitespace-nowrap">
                        <thead>
                            <tr className="bg-gray-50 dark:bg-surface-container-low/50 border-b border-gray-200 dark:border-outline-variant/10">
                                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-500 dark:text-outline">Học Phần</th>
                                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-gray-500 dark:text-outline">Giảng Viên</th>
                                <th className="px-6 py-4 text-center text-[10px] font-bold uppercase tracking-widest text-gray-500 dark:text-outline w-20">CC</th>
                                <th className="px-6 py-4 text-center text-[10px] font-bold uppercase tracking-widest text-gray-500 dark:text-outline w-20">GK</th>
                                <th className="px-6 py-4 text-center text-[10px] font-bold uppercase tracking-widest text-gray-500 dark:text-outline w-20">CK</th>
                                <th className="px-6 py-4 text-center text-[10px] font-bold uppercase tracking-widest text-emerald-700 dark:text-secondary bg-emerald-50/50 dark:bg-secondary/5 w-24 border-l border-emerald-200 dark:border-secondary/10">Tổng kết</th>
                                <th className="px-6 py-4 text-center text-[10px] font-bold uppercase tracking-widest text-gray-500 dark:text-outline w-24">Xếp loại</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-outline-variant/5">
                            {enrollments.length > 0 ? enrollments.map((enr, idx) => (
                                <tr key={idx} className="hover:bg-gray-50/50 dark:hover:bg-white/5 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="font-bold text-gray-900 dark:text-white text-sm">{enr.subject?.name}</div>
                                        <div className="text-[10px] font-mono text-gray-500 dark:text-outline mt-0.5">{enr.subject?.code} • {enr.subject?.credits || enr.subject?.credit || '-'} TC</div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-on-surface-variant">{enr.teacher?.user?.name || 'Chưa phân công'}</td>
                                    <td className="px-6 py-4 text-center text-sm font-mono font-bold text-gray-700 dark:text-on-surface">{enr.score?.attendance_score ?? '-'}</td>
                                    <td className="px-6 py-4 text-center text-sm font-mono font-bold text-gray-700 dark:text-on-surface">{enr.score?.midterm_score ?? '-'}</td>
                                    <td className="px-6 py-4 text-center text-sm font-mono font-bold text-gray-700 dark:text-on-surface">{enr.score?.final_score ?? '-'}</td>
                                    <td className="px-6 py-4 text-center bg-emerald-50/30 dark:bg-secondary/5 border-l border-emerald-100 dark:border-secondary/10">
                                        <span className={`font-black font-mono text-sm ${
                                            (enr.score?.total_score ?? 0) >= 8.5 ? 'text-emerald-700 dark:text-secondary' :
                                            (enr.score?.total_score ?? 0) >= 5.0 ? 'text-indigo-700 dark:text-primary' :
                                            'text-rose-600 dark:text-tertiary'
                                        }`}>{enr.score?.total_score ?? '-'}</span>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                            enr.score?.grade === 'Giỏi' ? 'bg-emerald-100 text-emerald-700 dark:bg-secondary/20 dark:text-secondary' :
                                            enr.score?.grade === 'Khá' ? 'bg-indigo-100 text-indigo-700 dark:bg-primary/20 dark:text-primary' :
                                            enr.score?.grade === 'Trung bình' ? 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400' :
                                            'bg-rose-100 text-rose-700 dark:bg-tertiary/20 dark:text-tertiary'
                                        }`}>{enr.score?.grade || 'Chờ'}</span>
                                    </td>
                                </tr>
                            )) : (
                                <tr><td colSpan="7" className="px-6 py-12 text-center text-gray-400 dark:text-outline text-sm">Chưa có học phần nào</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

Show.layout = page => <AdminLayout>{page}</AdminLayout>;
