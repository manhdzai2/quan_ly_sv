import React, { useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { Link, usePage } from '@inertiajs/react';

export default function TeacherLayout({ children }) {
    const { auth, url, flash } = usePage().props;
    const user = auth?.user;
    const [isDarkMode, setIsDarkMode] = useState(true);

    useEffect(() => {
        if (flash?.success) toast.success(flash.success, { style: { borderRadius: '12px', background: '#1a1b2e', color: '#4edea3', border: '1px solid #4edea3', fontSize: '14px', fontWeight: 'bold' }, duration: 3000 });
        if (flash?.error) toast.error(flash.error, { style: { borderRadius: '12px', background: '#1a1b2e', color: '#ffb4ab', border: '1px solid #ffb4ab', fontSize: '14px', fontWeight: 'bold' }, duration: 4000 });
    }, [flash]);

    useEffect(() => {
        setIsDarkMode(document.documentElement.classList.contains('dark'));
    }, []);

    const navItems = [
        { title: 'Bảng Điều Khiển', href: '/teacher/dashboard', icon: 'dashboard' },
        { title: 'Lớp Giảng Dạy', href: '/teacher/enrollments', icon: 'menu_book' },
        { title: 'Điểm Danh', href: '/teacher/attendance', icon: 'fact_check' },
        { title: 'Học Liệu', href: '/teacher/materials', icon: 'folder_open' },
        { title: 'Bài Tập', href: '/teacher/assignments', icon: 'assignment' },
        { title: 'Phân Tích', href: '/teacher/analytics', icon: 'bar_chart' },
        { title: 'Thông Báo', href: '/teacher/announcements', icon: 'campaign' },
        { title: 'Đơn Nghỉ', href: '/teacher/leave-requests', icon: 'event_busy' },
    ];

    const toggleTheme = () => {
        const html = document.documentElement;
        if (html.classList.contains('dark')) {
            html.classList.remove('dark');
            localStorage.theme = 'light';
            setIsDarkMode(false);
        } else {
            html.classList.add('dark');
            localStorage.theme = 'dark';
            setIsDarkMode(true);
        }
    };

    return (
        <div className="bg-gray-50 dark:bg-[#0b1326] text-gray-900 dark:text-gray-100 selection:bg-indigo-200 dark:selection:bg-primary-container font-body antialiased transition-colors duration-300">
            <div className="flex min-h-screen">
                {/* Sidebar */}
                <aside className="h-screen flex-shrink-0 w-64 bg-slate-50 dark:bg-slate-900 flex flex-col py-6 px-4 font-headline antialiased sticky top-0 hidden md:flex">
                    <div className="mb-10 px-4">
                        <h1 className="text-2xl font-bold text-indigo-700 dark:text-indigo-300 tracking-tight">Đại Học Lumina</h1>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-body">Cổng Giảng Viên & Quản lý</p>
                    </div>

                    <nav className="flex-1 space-y-1.5">
                        {navItems.map(item => {
                            const isActive = url?.startsWith(item.href);
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                                        isActive
                                            ? 'bg-indigo-100 dark:bg-indigo-500/15 text-indigo-700 dark:text-indigo-300 shadow-sm'
                                            : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-indigo-600 dark:hover:text-indigo-300'
                                    }`}
                                >
                                    <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}>
                                        {item.icon}
                                    </span>
                                    {item.title}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* User & Actions */}
                    <div className="border-t border-slate-200 dark:border-slate-700 pt-4 space-y-2">
                        <div className="flex items-center gap-3 px-4 py-2 mb-2">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 text-white font-bold flex items-center justify-center text-sm shadow">
                                {user?.name?.charAt(0) || 'U'}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-bold text-slate-800 dark:text-slate-200 truncate">{user?.name || 'Giảng viên'}</p>
                                <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">{user?.email || ''}</p>
                            </div>
                        </div>
                        <button onClick={toggleTheme} className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                            <span className="material-symbols-outlined text-[20px]">{isDarkMode ? 'light_mode' : 'dark_mode'}</span>
                            {isDarkMode ? 'Giao diện Sáng' : 'Giao diện Tối'}
                        </button>
                        <Link
                            href={route('logout')}
                            method="post"
                            as="button"
                            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors"
                        >
                            <span className="material-symbols-outlined text-[20px]">logout</span>
                            Đăng Xuất
                        </Link>
                    </div>
                </aside>

                {/* Main Content */}
                <main className="flex-1 min-h-screen">
                    <div className="p-6 md:p-8 max-w-[1400px] mx-auto">
                        {children}
                    </div>
                </main>
            </div>
            <Toaster position="bottom-right" />
        </div>
    );
}
