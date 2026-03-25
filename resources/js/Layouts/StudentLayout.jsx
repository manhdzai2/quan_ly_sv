import React, { useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { Link, usePage } from '@inertiajs/react';

export default function StudentLayout({ children }) {
    const { auth, url, flash } = usePage().props;
    const user = auth?.user;
    const [sidebarOpen, setSidebarOpen] = useState(false);

    useEffect(() => {
        if (flash?.success) toast.success(flash.success, { style: { borderRadius: '12px', background: '#1a1b2e', color: '#4edea3', border: '1px solid #4edea3', fontSize: '14px', fontWeight: 'bold' }, duration: 3000 });
        if (flash?.error) toast.error(flash.error, { style: { borderRadius: '12px', background: '#1a1b2e', color: '#ffb4ab', border: '1px solid #ffb4ab', fontSize: '14px', fontWeight: 'bold' }, duration: 4000 });
    }, [flash]);

    const navItems = [
        { title: 'Tổng Quan', href: '/student/dashboard', icon: 'space_dashboard' },
        { title: 'Hồ Sơ', href: '/student/profile', icon: 'person' },
        { title: 'Lịch Học', href: '/student/schedule', icon: 'calendar_month' },
        { title: 'Điểm Danh', href: '/student/attendance', icon: 'how_to_reg' },
        { title: 'Học Liệu', href: '/student/materials', icon: 'library_books' },
        { title: 'Bài Tập', href: '/student/assignments', icon: 'assignment' },
        { title: 'Điểm Số', href: '/student/grades', icon: 'school' },
        { title: 'Dịch Vụ', href: '/student/services', icon: 'support_agent' },
    ];

    const toggleTheme = () => {
        const isDark = document.documentElement.classList.toggle('dark');
        localStorage.theme = isDark ? 'dark' : 'light';
    };

    return (
        <div className="bg-gray-50 dark:bg-[#0b1326] text-gray-900 dark:text-gray-100 font-body min-h-screen antialiased transition-colors duration-300 flex">
            {/* Mobile Overlay */}
            {sidebarOpen && <div className="fixed inset-0 bg-black/40 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />}

            {/* ══════════════════ SIDEBAR ══════════════════ */}
            <aside className={`fixed lg:sticky top-0 h-screen w-[260px] bg-[#0d1530] z-50 flex flex-col transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
                {/* Brand */}
                <div className="px-6 h-20 flex items-center gap-3 border-b border-white/5 flex-shrink-0">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                        <span className="material-symbols-outlined text-white text-lg">school</span>
                    </div>
                    <div>
                        <span className="text-base font-extrabold text-white tracking-tight font-headline block leading-tight">Đại Học Lumina</span>
                        <span className="text-[10px] text-slate-500 tracking-wider uppercase">Học tập & phát triển</span>
                    </div>
                </div>

                {/* Nav */}
                <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
                    {navItems.map(item => {
                        const isActive = url?.startsWith(item.href);
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setSidebarOpen(false)}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 group ${isActive ? 'bg-gradient-to-r from-violet-600/20 to-indigo-600/10 text-violet-400 shadow-sm border border-violet-500/10' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
                            >
                                <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}>{item.icon}</span>
                                {item.title}
                                {isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-violet-400 shadow-sm shadow-violet-400/50"></div>}
                            </Link>
                        );
                    })}
                </nav>

                {/* User + Actions */}
                <div className="border-t border-white/5 p-4 space-y-3 flex-shrink-0">
                    <div className="flex items-center gap-3 px-2">
                        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-sm">
                            {user?.name?.charAt(0) || 'S'}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-white truncate">{user?.name || 'Sinh viên'}</p>
                            <p className="text-[10px] text-slate-500 truncate">{user?.email}</p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <button onClick={toggleTheme} className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 text-xs font-semibold transition-colors">
                            <span className="material-symbols-outlined text-[16px]">dark_mode</span> Giao diện
                        </button>
                        <Link href={route('logout')} method="post" as="button" className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 text-xs font-semibold transition-colors">
                            <span className="material-symbols-outlined text-[16px]">logout</span> Thoát
                        </Link>
                    </div>
                </div>
            </aside>

            {/* ══════════════════ MAIN ══════════════════ */}
            <div className="flex-1 min-w-0 flex flex-col">
                {/* Mobile TopBar */}
                <header className="lg:hidden sticky top-0 z-30 h-16 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl flex items-center justify-between px-4 border-b border-gray-100 dark:border-slate-800">
                    <button onClick={() => setSidebarOpen(true)} className="p-2 -ml-1 rounded-lg text-gray-600 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800">
                        <span className="material-symbols-outlined">menu</span>
                    </button>
                    <span className="text-sm font-extrabold text-indigo-600 dark:text-indigo-400 font-headline">Đại Học Lumina</span>
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xs">{user?.name?.charAt(0) || 'S'}</div>
                </header>

                <main className="flex-1 p-4 lg:p-8 max-w-[1400px] w-full mx-auto">
                    {children}
                </main>
            </div>
            <Toaster position="bottom-right" />
        </div>
    );
}
