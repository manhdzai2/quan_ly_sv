import React, { useEffect, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { Link, usePage, router } from '@inertiajs/react';

export default function AppLayout({ children }) {
    const { auth, flash } = usePage().props;

    const roleName = (auth?.user?.role?.name || '').toLowerCase();
    const roleId = auth?.user?.role_id;
    const _role = roleName || (roleId === 1 ? 'admin' : roleId === 2 ? 'teacher' : roleId === 3 ? 'student' : '');

    useEffect(() => {
        if (flash?.success) {
            toast.success(flash.success, {
                style: { borderRadius: '12px', background: '#2d3449', color: '#4edea3', border: '1px solid #4edea3', fontSize: '14px', fontWeight: 'bold' },
            });
        }
        if (flash?.error) {
            toast.error(flash.error, {
                style: { borderRadius: '12px', background: '#2d3449', color: '#ffb4ab', border: '1px solid #ffb4ab', fontSize: '14px', fontWeight: 'bold' },
            });
        }
    }, [flash]);

    return (
        <div className="bg-gray-50 text-gray-900 dark:bg-background dark:text-on-surface min-h-screen font-['Inter'] selection:bg-indigo-500/30 dark:selection:bg-primary/30 flex transition-colors duration-300">
            <Sidebar role={_role} />
            
            <main className="flex-1 ml-64 min-h-screen flex flex-col relative z-0">
                <Topbar user={auth?.user} role={_role} />
                
                <div className="flex-1 mt-16 p-8 relative">
                    <div className="max-w-[1400px] mx-auto animate-fade-in-up">
                        {children}
                    </div>
                </div>
            </main>
            <Toaster position="bottom-right" />
        </div>
    );
}

function Sidebar({ role }) {
    const { url } = usePage();

    const navAdmin = [
        { title: 'Bảng Điều Khiển', href: '/admin/dashboard', icon: 'dashboard' },
        { title: 'Giảng Viên', href: '/admin/teachers', icon: 'person' },
        { title: 'Sinh Viên', href: '/admin/students', icon: 'group' },
        { title: 'Học Phần', href: '/admin/subjects', icon: 'book' },
        { title: 'Học Liệu', href: '/admin/materials', icon: 'folder_open' },
        { title: 'Bài Tập', href: '/admin/assignments', icon: 'assignment' },
        { title: 'Khóa / Ngành', href: '/admin/classes', icon: 'class' },
        { title: 'Lớp Học Phần', href: '/admin/classrooms', icon: 'meeting_room' },
    ];

    const navTeacher = [
        { title: 'Lớp Phụ Trách', href: '/teacher/enrollments', icon: 'menu_book' },
        { title: 'Học Liệu', href: '/teacher/materials', icon: 'folder_open' },
        { title: 'Bài Tập', href: '/teacher/assignments', icon: 'assignment' },
    ];

    const navStudent = [
        { title: 'Tổng Quan', href: '/student/dashboard', icon: 'dashboard' },
        { title: 'Học Liệu', href: '/student/materials', icon: 'library_books' },
        { title: 'Bài Tập', href: '/student/assignments', icon: 'assignment' },
        { title: 'Hồ Sơ Cá Nhân', href: '/student/profile', icon: 'analytics' },
        { title: 'Thời Khóa Biểu', href: '/student/schedule', icon: 'calendar_today' },
    ];

    const nav = role === 'admin' ? navAdmin : role === 'teacher' ? navTeacher : navStudent;
    const portalName = role === 'teacher' ? 'Cổng Giảng Viên' : role === 'student' ? 'Cổng Sinh Viên' : 'Cổng Quản Trị';

    return (
        <aside className="fixed left-0 top-0 h-full z-40 flex flex-col bg-white/80 dark:bg-[#0b1326]/70 backdrop-blur-xl w-64 border-r border-gray-200 dark:border-[#464555]/15 shadow-[0_8px_32px_rgba(0,0,0,0.05)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.12)] transition-colors duration-300">
            <div className="p-8 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-500 dark:from-primary dark:to-primary-container flex items-center justify-center shadow-lg shadow-indigo-500/20 dark:shadow-primary/20">
                    <span className="material-symbols-outlined text-white text-lg">school</span>
                </div>
                <div>
                    <h1 className="text-xl font-black tracking-tighter text-indigo-900 dark:text-[#c3c0ff]">The Muse</h1>
                    <p className="font-['Inter'] uppercase font-bold tracking-widest text-[0.625rem] text-gray-500 dark:text-outline">{portalName}</p>
                </div>
            </div>

            <nav className="flex-1 px-4 py-4 space-y-2">
                <div className="px-4 mb-3 font-['Inter'] uppercase tracking-widest text-[0.625rem] font-bold text-gray-400 dark:text-outline">Cấu trúc Điều hướng</div>
                {nav.map(item => {
                    const isActive = url?.startsWith(item.href);
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 active:scale-95 border-r-2 ${
                                isActive
                                    ? 'text-indigo-700 bg-indigo-50 border-indigo-500 dark:text-[#c3c0ff] dark:bg-gradient-to-r dark:from-[#c3c0ff]/10 dark:to-transparent dark:border-[#c3c0ff]'
                                    : 'text-gray-500 hover:text-indigo-600 hover:bg-gray-50 border-transparent hover:-translate-y-0.5 dark:text-[#918fa1] dark:hover:text-[#c3c0ff] dark:hover:bg-[#2d3449]/50'
                            }`}
                        >
                            <span className="material-symbols-outlined" style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}>
                                {item.icon}
                            </span>
                            <span className="font-['Inter'] uppercase font-bold tracking-widest text-[0.6875rem]">{item.title}</span>
                        </Link>
                    );
                })}
            </nav>

            <div className="p-6 border-t border-gray-100 dark:border-outline-variant/10 space-y-2">
                <Link
                    href={route('logout')}
                    method="post"
                    as="button"
                    className="w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 text-gray-500 hover:text-rose-600 hover:bg-rose-50 dark:text-outline dark:hover:text-tertiary dark:hover:bg-tertiary/10 group"
                >
                    <span className="material-symbols-outlined group-hover:rotate-180 transition-transform duration-500">logout</span>
                    <span className="font-['Inter'] uppercase font-bold tracking-widest text-[0.6875rem]">Đăng Xuất</span>
                </Link>
            </div>
        </aside>
    );
}

function Topbar({ user, role }) {
    const [isDarkMode, setIsDarkMode] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [showResults, setShowResults] = useState(false);
    const [isSearching, setIsSearching] = useState(false);
    const searchTimeoutRef = React.useRef(null);
    const searchContainerRef = React.useRef(null);

    useEffect(() => {
        const isDark = document.documentElement.classList.contains('dark');
        setIsDarkMode(isDark);
    }, []);

    // Click outside to close
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (searchContainerRef.current && !searchContainerRef.current.contains(e.target)) {
                setShowResults(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSearch = (value) => {
        setSearchQuery(value);
        if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
        
        if (value.length < 2) {
            setSearchResults([]);
            setShowResults(false);
            return;
        }

        setIsSearching(true);
        searchTimeoutRef.current = setTimeout(async () => {
            try {
                const res = await fetch(`/search?q=${encodeURIComponent(value)}`);
                const data = await res.json();
                setSearchResults(data.results || []);
                setShowResults(true);
            } catch (e) {
                setSearchResults([]);
            } finally {
                setIsSearching(false);
            }
        }, 300);
    };

    const typeLabels = { student: 'Sinh viên', teacher: 'Giảng viên', subject: 'Học phần', class: 'Lớp/Ngành' };
    const typeColors = {
        student: 'bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-secondary/10 dark:text-secondary dark:border-secondary/20',
        teacher: 'bg-purple-50 text-purple-600 border-purple-200 dark:bg-primary/10 dark:text-primary dark:border-primary/20',
        subject: 'bg-indigo-50 text-indigo-600 border-indigo-200 dark:bg-primary-container/20 dark:text-primary-fixed-dim dark:border-primary/20',
        class: 'bg-orange-50 text-orange-600 border-orange-200 dark:bg-tertiary/10 dark:text-tertiary dark:border-tertiary/20',
    };

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
        <header className="fixed top-0 right-0 left-64 z-30 flex justify-between items-center px-8 h-16 bg-white/80 dark:bg-[#0b1326]/70 backdrop-blur-xl border-b border-gray-200 dark:border-[#464555]/15 shadow-sm transition-colors duration-300">
            <div className="flex items-center gap-6">
                <div className="relative group hidden md:block" ref={searchContainerRef}>
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-gray-400 dark:text-outline text-lg group-focus-within:text-indigo-500 dark:group-focus-within:text-primary transition-colors z-10">search</span>
                    <input 
                        type="text" 
                        className="bg-gray-100/50 dark:bg-surface-container-highest/50 border-none rounded-xl pl-10 pr-4 py-2 text-sm w-80 focus:ring-1 focus:ring-indigo-500 dark:focus:ring-primary placeholder:text-gray-400 dark:placeholder:text-outline/40 font-['Inter'] transition-all text-gray-900 dark:text-on-surface outline-none"
                        placeholder="Tìm sinh viên, giảng viên, học phần..." 
                        value={searchQuery}
                        onChange={(e) => handleSearch(e.target.value)}
                        onFocus={() => searchResults.length > 0 && setShowResults(true)}
                    />

                    {/* Search Results Dropdown */}
                    {showResults && (
                        <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-surface-container-low rounded-xl border border-gray-200 dark:border-outline-variant/10 shadow-2xl overflow-hidden z-50 max-h-[400px] overflow-y-auto animate-fade-in">
                            {isSearching ? (
                                <div className="p-6 text-center">
                                    <span className="material-symbols-outlined animate-spin text-indigo-500 dark:text-primary text-2xl">progress_activity</span>
                                    <p className="text-xs text-gray-500 dark:text-outline mt-2">Đang tìm kiếm...</p>
                                </div>
                            ) : searchResults.length > 0 ? (
                                <div className="py-2">
                                    {searchResults.map((item, idx) => (
                                        <a
                                            key={idx}
                                            href={item.url}
                                            className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-surface-container-highest/50 transition-colors group/item cursor-pointer"
                                            onClick={() => { setShowResults(false); setSearchQuery(''); }}
                                        >
                                            <div className={`w-9 h-9 rounded-lg flex items-center justify-center border ${typeColors[item.type]}`}>
                                                <span className="material-symbols-outlined text-lg">{item.icon}</span>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-bold text-gray-900 dark:text-white truncate group-hover/item:text-indigo-600 dark:group-hover/item:text-primary transition-colors">{item.label}</p>
                                                <p className="text-[10px] text-gray-500 dark:text-outline truncate">{item.sub}</p>
                                            </div>
                                            <span className={`text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded border ${typeColors[item.type]}`}>
                                                {typeLabels[item.type]}
                                            </span>
                                        </a>
                                    ))}
                                </div>
                            ) : (
                                <div className="p-6 text-center">
                                    <span className="material-symbols-outlined text-3xl text-gray-300 dark:text-outline-variant mb-2 block">search_off</span>
                                    <p className="text-sm text-gray-500 dark:text-outline">Không tìm thấy kết quả cho "{searchQuery}"</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            <div className="flex items-center gap-6">
                
                {/* Theme Toggle */}
                <button 
                    onClick={toggleTheme}
                    className="text-gray-400 dark:text-outline hover:text-indigo-600 dark:hover:text-white transition-colors active:scale-95 flex items-center justify-center w-8 h-8 rounded-full hover:bg-gray-100 dark:hover:bg-white/10"
                    title={isDarkMode ? "Chuyển giao diện Sáng" : "Chuyển giao diện Tối"}
                >
                    <span className="material-symbols-outlined text-[20px]">
                        {isDarkMode ? 'light_mode' : 'dark_mode'}
                    </span>
                </button>

                <button className="text-gray-400 dark:text-outline hover:text-indigo-600 dark:hover:text-white transition-colors active:scale-95 relative group flex items-center justify-center w-8 h-8 rounded-full hover:bg-gray-100 dark:hover:bg-white/10" title="Thông báo hệ thống">
                    <span className="material-symbols-outlined text-[20px]">notifications</span>
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 dark:bg-secondary rounded-full border-2 border-white dark:border-surface animate-pulse"></span>
                </button>

                <button className="text-gray-400 dark:text-outline hover:text-indigo-600 dark:hover:text-white transition-colors active:scale-95 flex items-center justify-center w-8 h-8 rounded-full hover:bg-gray-100 dark:hover:bg-white/10" title="Cài đặt tài khoản">
                    <span className="material-symbols-outlined text-[20px]">settings</span>
                </button>

                <div className="h-8 w-[1px] bg-gray-200 dark:bg-outline-variant/20 mx-1"></div>

                <div className="flex items-center gap-3 cursor-pointer group">
                    <div className="text-right hidden sm:block">
                        <p className="text-sm font-bold text-gray-900 dark:text-on-surface leading-tight">{user?.name || 'Khách truy cập'}</p>
                        <p className="text-[0.625rem] font-black uppercase tracking-widest text-indigo-600 dark:text-primary/80">
                             {role === 'admin' ? 'Đội ngũ Quản Trị' : role === 'teacher' ? 'Cán Bộ Giảng Viên' : 'Lớp Học Viên'}
                        </p>
                    </div>
                    <div className="w-9 h-9 rounded-xl overflow-hidden border-2 border-indigo-200 dark:border-primary/30 group-hover:border-indigo-500 dark:group-hover:border-primary transition-colors bg-white dark:bg-surface-container-highest flex items-center justify-center shadow-lg shadow-indigo-500/10 dark:shadow-primary/10">
                        <span className="font-black text-indigo-600 dark:text-primary text-sm">{user?.name?.charAt(0) || 'U'}</span>
                    </div>
                </div>
            </div>
        </header>
    );
}