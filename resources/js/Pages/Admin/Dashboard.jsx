import React from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, AreaChart, Area, LineChart, Line
} from 'recharts';

export default function Dashboard({
    auth,
    cards = {},
    financial = { total_tuition: 0, total_paid: 0 },
    gradeStats = {},
    classDistribution = [],
    topStudents = [],
    recentActivities = []
}) {
    const user = auth?.user;

    // Chuẩn bị Data cho Pie Chart - Xếp loại Sinh viên
    const pieData = [
        { name: 'Giỏi', value: gradeStats.Gioi || 0, color: '#4F46E5' },
        { name: 'Khá', value: gradeStats.Kha || 0, color: '#8B5CF6' },
        { name: 'Trung bình', value: gradeStats.TB || 0, color: '#EC4899' },
        { name: 'Yếu', value: gradeStats.Yeu || 0, color: '#EF4444' },
    ].filter(i => i.value > 0);

    if (pieData.length === 0) pieData.push({ name: 'Chưa có dữ liệu', value: 1, color: '#E5E7EB' });

    // Animation Variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
    };

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="p-6 space-y-8 bg-gray-50 dark:bg-[#0b1326] min-h-screen"
        >
            <Head title="Admin Dashboard" />

            {/* Header / Quick Actions */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-4xl font-black text-gray-900 dark:text-white leading-tight tracking-tight">
                        Đại Học <span className="text-indigo-600 dark:text-primary">Lumina</span>
                    </h2>
                    <p className="text-gray-500 dark:text-slate-300 mt-2 font-medium">Chào mừng trở lại, {user?.name}. Đây là phân tích hệ thống thời gian thực.</p>
                </div>
                <div className="flex flex-wrap gap-3">
                    <Link href={route('admin.students.create')} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition-all shadow-lg shadow-indigo-200 dark:shadow-none font-medium text-sm">
                        <span className="material-symbols-outlined text-sm">person_add</span>
                        Thêm Sinh Viên
                    </Link>
                    <Link href={route('admin.classes.create')} className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 text-gray-700 dark:text-gray-200 rounded-xl transition-all font-medium text-sm">
                        <span className="material-symbols-outlined text-sm">group_add</span>
                        Mở Lớp Mới
                    </Link>
                </div>
            </div>

            {/* Top KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: 'Sinh Viên', value: cards.students, icon: 'groups', color: 'indigo', link: 'admin.students.index' },
                    { label: 'Giảng Viên', value: cards.teachers, icon: 'school', color: 'purple', link: 'admin.teachers.index' },
                    { label: 'Khối Lớp', value: cards.classes, icon: 'door_open', color: 'amber', link: 'admin.classes.index' },
                    { label: 'Học Phần', value: cards.subjects, icon: 'book', color: 'rose', link: 'admin.subjects.index' },
                ].map((card, idx) => (
                    <motion.div key={idx} variants={itemVariants}>
                        <Link
                            href={route(card.link)}
                            className="block group bg-white dark:bg-[#161f36] p-6 rounded-3xl border border-gray-100 dark:border-white/5 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                        >
                            <div className="flex justify-between items-start mb-6">
                                <div className={`w-12 h-12 rounded-2xl bg-${card.color}-500/10 flex items-center justify-center text-${card.color}-600 dark:text-${card.color}-400 shadow-inner`}>
                                    <span className="material-symbols-outlined text-2xl">{card.icon}</span>
                                </div>
                                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-300 group-hover:text-primary transition-colors flex items-center gap-1">
                                    Chi tiết <span className="material-symbols-outlined text-xs">arrow_forward</span>
                                </span>
                            </div>
                            <div className="space-y-1">
                                <p className="text-xs font-bold text-slate-500 dark:text-slate-300 uppercase tracking-wider">{card.label}</p>
                                <div className="flex items-baseline gap-2">
                                    <h3 className="text-4xl font-black text-slate-900 dark:text-white">{(card.value || 0).toLocaleString()}</h3>
                                </div>
                            </div>
                        </Link>
                    </motion.div>
                ))}
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Phân bổ SV theo Lớp */}
                <motion.div variants={itemVariants} className="lg:col-span-2 bg-white dark:bg-[#161f36] p-8 rounded-3xl border border-gray-100 dark:border-white/5 shadow-sm">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Quy mô các Ngành/Lớp</h3>
                            <p className="text-sm text-gray-500">Phân bổ sinh viên dựa trên sĩ số thực tế</p>
                        </div>
                    </div>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={classDistribution} margin={{ top: 0, right: 0, left: -25, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" opacity={0.3} />
                                <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} dy={10} />
                                <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                                <Tooltip
                                    cursor={{ fill: 'rgba(79, 70, 229, 0.05)' }}
                                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }}
                                />
                                <Bar dataKey="students" name="Sĩ số" fill="#4F46E5" radius={[6, 6, 0, 0]} barSize={40} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>

                {/* Phổ điểm & Xếp loại */}
                <motion.div variants={itemVariants} className="bg-white dark:bg-[#161f36] p-8 rounded-3xl border border-gray-100 dark:border-white/5 shadow-sm flex flex-col">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">Cơ cấu Học lực</h3>
                    <p className="text-sm text-gray-500 mb-8">Thống kê xếp loại toàn hệ thống</p>

                    <div className="flex-1 min-h-[220px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={pieData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={70}
                                    outerRadius={95}
                                    paddingAngle={8}
                                    dataKey="value"
                                    stroke="none"
                                >
                                    {pieData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mt-6">
                        {pieData.map((item, i) => (
                            <div key={i} className="flex items-center gap-3">
                                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                                <span className="text-xs font-bold text-gray-600 dark:text-gray-400 uppercase">{item.name}</span>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>

            {/* Bottom Row: Top Students & Activities */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Top Students Table */}
                <motion.div variants={itemVariants} className="lg:col-span-2 bg-white dark:bg-[#161f36] rounded-3xl border border-gray-100 dark:border-white/5 shadow-sm overflow-hidden">
                    <div className="p-8 border-b border-gray-50 dark:border-white/5 flex items-center justify-between">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            <span className="material-symbols-outlined text-amber-500">military_tech</span>
                            Top 5 Sinh Viên Xuất Sắc
                        </h3>
                        <Link href={route('admin.scores.index')} className="text-sm font-bold text-indigo-600 dark:text-primary hover:underline">Chi tiết bảng điểm</Link>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="text-xs text-slate-500 dark:text-slate-300 uppercase font-bold tracking-wider">
                                <tr>
                                    <th className="px-5 py-4 text-left">Sinh viên</th>
                                    <th className="px-5 py-4 text-center">GPA</th>
                                    <th className="px-5 py-4 text-right">Hành động</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                                {topStudents.map((item, idx) => (
                                        <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group">
                                            <td className="px-5 py-4 leading-none">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold shadow-sm">
                                                        {item.name?.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <Link href={route('admin.students.show', item.id)} className="text-sm font-bold text-slate-900 dark:text-white hover:text-primary transition-colors block leading-tight mb-1">
                                                            {item.name}
                                                        </Link>
                                                        <span className="text-[10px] font-mono font-bold text-slate-400 dark:text-slate-400 uppercase tracking-wider">{item.student_code}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-5 py-4 text-center">
                                                <span className={`px-3 py-1.5 rounded-lg text-sm font-black font-mono ${
                                                    item.gpa >= 3.6 ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20' : 
                                                    'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20'
                                                }`}>
                                                    {parseFloat(item.gpa).toFixed(2)}
                                                </span>
                                            </td>
                                            <td className="px-5 py-4 text-right">
                                                <Link href={route('admin.students.show', item.id)} className="w-8 h-8 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-400 dark:text-slate-400 hover:bg-primary hover:text-white dark:hover:bg-primary dark:hover:text-[#002113] transition-all flex items-center justify-center mx-auto lg:ml-auto lg:mr-0 inline-flex">
                                                    <span className="material-symbols-outlined text-[18px]">visibility</span>
                                                </Link>
                                            </td>
                                        </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </motion.div>

                {/* Right Column: Financial & Activities */}
                <div className="space-y-8">
                    {/* Finance Summary Card */}
                    <motion.div variants={itemVariants} className="bg-indigo-600 p-8 rounded-3xl text-white shadow-xl shadow-indigo-200 dark:shadow-none relative overflow-hidden group">
                        <div className="absolute -right-8 -top-8 w-32 h-32 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700"></div>
                        <h3 className="text-sm font-bold opacity-80 uppercase tracking-widest mb-4">Tổng Thu Học Phí</h3>
                        <div className="flex items-baseline gap-2 mb-6">
                            <span className="text-3xl font-black">{(financial.total_paid || 0).toLocaleString()}</span>
                            <span className="text-xs opacity-70">VNĐ</span>
                        </div>
                        <div className="space-y-3">
                            <div className="flex justify-between text-xs font-bold">
                                <span>Tiến độ thu</span>
                                <span>{Math.round(((financial.total_paid || 0) / (financial.total_tuition || 1)) * 100)}%</span>
                            </div>
                            <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-white transition-all duration-1000"
                                    style={{ width: `${((financial.total_paid || 0) / (financial.total_tuition || 1)) * 100}%` }}
                                ></div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Recent Activities Feed */}
                    <motion.div variants={itemVariants} className="bg-white dark:bg-[#161f36] p-8 rounded-3xl border border-gray-100 dark:border-white/5 shadow-sm">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Hoạt Động Gần Đây</h3>
                        <div className="space-y-6">
                            {recentActivities.map((act, idx) => (
                                <div key={idx} className="flex gap-4 relative">
                                    {idx !== recentActivities.length - 1 && (
                                        <div className="absolute left-4 top-10 bottom-0 w-px bg-gray-100 dark:bg-gray-800"></div>
                                    )}
                                    <div className="w-8 h-8 rounded-xl bg-gray-50 dark:bg-gray-800 flex items-center justify-center shrink-0 border border-gray-100 dark:border-gray-700">
                                        <span className="material-symbols-outlined text-[16px] text-gray-400">monitoring</span>
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm text-gray-700 dark:text-gray-200 font-medium leading-snug">{act.description}</p>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="text-[10px] font-bold text-indigo-500 uppercase">{act.causer}</span>
                                            <span className="text-[10px] text-gray-400">•</span>
                                            <span className="text-[10px] text-gray-400">{act.time}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </div>
        </motion.div>
    );
}

Dashboard.layout = page => <AdminLayout>{page}</AdminLayout>;