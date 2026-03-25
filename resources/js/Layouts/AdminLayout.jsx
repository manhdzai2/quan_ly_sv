import React, { useState, useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { Link, usePage, router } from '@inertiajs/react';

export default function AdminLayout({ children }) {
    const { auth, url, filters } = usePage().props;
    const user = auth?.user;
    const [search, setSearch] = useState(filters?.search || '');
    const [showBackToTop, setShowBackToTop] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setShowBackToTop(window.scrollY > 400);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navItems = [
        { title: 'Tổng quan', href: '/admin/dashboard', icon: 'dashboard' },
        { title: 'Sinh viên', href: '/admin/students', icon: 'group' },
        { title: 'Giảng viên', href: '/admin/teachers', icon: 'school' },
        { title: 'Khóa học', href: '/admin/classes', icon: 'menu_book' },
        { title: 'Phòng học', href: '/admin/classrooms', icon: 'meeting_room' },
        { title: 'Môn học', href: '/admin/subjects', icon: 'book' },
        { title: 'Học liệu', href: '/admin/materials', icon: 'folder_open' },
        { title: 'Bài tập', href: '/admin/assignments', icon: 'assignment' },
        { title: 'Điểm số', href: '/admin/scores', icon: 'analytics' },
    ];

    const handleGlobalSearch = (e) => {
        e.preventDefault();
        
        let targetRoute = 'admin.students.index'; // Mặc định tìm sinh viên
        
        // Nếu đang ở một trang danh sách cụ thể, tìm kiếm trên trang đó
        if (url.startsWith('/admin/teachers')) targetRoute = 'admin.teachers.index';
        else if (url.startsWith('/admin/classes')) targetRoute = 'admin.classes.index';
        else if (url.startsWith('/admin/subjects')) targetRoute = 'admin.subjects.index';
        else if (url.startsWith('/admin/scores')) targetRoute = 'admin.scores.index';
        else if (url.startsWith('/admin/students')) targetRoute = 'admin.students.index';

        router.get(route(targetRoute), { search }, { preserveState: true });
    };

    const toggleTheme = () => {
        const isDark = document.documentElement.classList.toggle('dark');
        localStorage.theme = isDark ? 'dark' : 'light';
    };

    return (
        <div className="bg-gray-50 dark:bg-[#0b1326] text-gray-900 dark:text-gray-100 selection:bg-indigo-200 dark:selection:bg-primary-container selection:text-indigo-900 font-body antialiased transition-colors duration-300">
            <div className="flex min-h-screen">
                {/* SideNavBar Component */}
                <aside className="h-screen flex-shrink-0 w-64 border-r-0 bg-slate-50 dark:bg-slate-900 flex flex-col py-6 px-4 font-headline antialiased sticky top-0 hidden md:flex">
                    <div className="mb-10 px-4">
                        <div className="leading-tight">
                            <Link href="/admin/dashboard">
                                <h1 className="text-xl font-black text-white tracking-tight">Đại Học Lumina</h1>
                            </Link>
                            <p className="text-[10px] text-slate-500 dark:text-slate-300 font-bold uppercase tracking-widest mt-1">Hệ thống Quản trị</p>
                        </div>
                    </div>
                    <nav className="flex-1 space-y-1">
                        {navItems.map(item => {
                            const isActive = url?.startsWith(item.href);
                            return (
                                <Link 
                                    key={item.href} 
                                    href={item.href} 
                                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-semibold active:scale-95 duration-150 ${isActive ? 'bg-indigo-50 dark:bg-indigo-900/40 text-indigo-700 dark:text-primary shadow-sm ring-1 ring-indigo-200/20' : 'text-slate-500 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-primary hover:bg-indigo-50/50 dark:hover:bg-indigo-900/20'}`}
                                >
                                    <span className="material-symbols-outlined" style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}>{item.icon}</span>
                                    <span className="text-sm">{item.title}</span>
                                </Link>
                            );
                        })}
                    </nav>
                    <div className="mt-auto px-2 space-y-4">
                        <Link href={route('logout')} method="post" as="button" className="w-full bg-error/10 text-error py-3 rounded-xl font-bold text-sm transition-all hover:bg-error/20 active:scale-95 flex items-center justify-center gap-2">
                            <span className="material-symbols-outlined text-[18px]">logout</span> Đăng xuất
                        </Link>
                        <div className="flex items-center gap-3 pt-6 border-t border-outline-variant/20">
                            <div className="w-10 h-10 flex-shrink-0 rounded-full font-bold bg-primary text-white flex items-center justify-center shadow-md">{user?.name?.charAt(0) || 'U'}</div>
                            <div className="overflow-hidden">
                                <p className="text-sm font-bold truncate text-on-surface">{user?.name}</p>
                                <p className="text-[10px] text-on-surface-variant uppercase tracking-widest font-bold truncate">Quản trị viên</p>
                            </div>
                        </div>
                    </div>
                </aside>

                {/* Main Content Area */}
                <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
                    {/* TopNavBar Component */}
                    <header className="h-20 w-full z-50 flex justify-between items-center px-8 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl shadow-sm dark:shadow-none font-headline tracking-tight sticky top-0">
                        <div className="flex items-center gap-8 flex-1">
                            <form onSubmit={handleGlobalSearch} className="relative w-full max-w-md hidden lg:block">
                                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant text-lg">search</span>
                                <input 
                                    type="text" 
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="w-full bg-surface-container-low border-none rounded-xl py-3 pl-11 pr-4 focus:ring-2 focus:ring-primary/20 text-sm placeholder:text-on-surface-variant/60 font-medium" 
                                    placeholder="Tìm kiếm trong hệ thống..." 
                                />
                            </form>
                        </div>
                        <div className="flex items-center gap-4">
                            <button className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-surface-container-low transition-colors text-on-surface-variant">
                                <span className="material-symbols-outlined">notifications</span>
                            </button>
                            <div className="h-8 w-px bg-outline-variant/30 mx-2"></div>
                            <button className="text-sm px-4 py-2 bg-surface-container-low font-bold text-on-surface hover:bg-surface-container transition-colors rounded-xl flex items-center gap-2" onClick={toggleTheme}>
                                <span className="material-symbols-outlined text-[18px]">dark_mode</span> Giao diện
                            </button>
                        </div>
                    </header>

                    {/* Page Content */}
                    <div className="p-8 max-w-7xl mx-auto w-full flex-1">
                        {children}
                    </div>
                </main>
            </div>
            
            {/* Back to Top Button */}
            {showBackToTop && (
                <button 
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    className="fixed bottom-8 right-8 w-12 h-12 bg-indigo-600 dark:bg-primary text-white dark:text-[#002113] rounded-2xl shadow-2xl flex items-center justify-center hover:scale-110 active:scale-90 transition-all z-[60] group"
                >
                    <span className="material-symbols-outlined font-black group-hover:-translate-y-1 transition-transform">arrow_upward</span>
                </button>
            )}

            <Toaster position="bottom-right" />
        </div>
    );
}
