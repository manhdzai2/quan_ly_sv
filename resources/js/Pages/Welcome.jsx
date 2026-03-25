import { Link, Head } from '@inertiajs/react';

export default function Welcome({ auth }) {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center">
            <Head title="Trang chủ" />
            
            <div className="text-center">
                <h1 className="text-4xl md:text-5xl font-extrabold text-indigo-600 mb-4 shadow-sm">
                    Student Management System
                </h1>
                <p className="text-gray-500 mb-8 text-lg">
                    Hệ thống quản lý sinh viên thông minh và hiện đại
                </p>

                {/* Kiểm tra nếu đã đăng nhập rồi thì hiện nút Vào hệ thống, chưa thì hiện Đăng nhập */}
                {auth.user ? (
                    <Link
                        href="/dashboard" 
                        className="inline-block px-8 py-3 bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-700 transition-colors shadow-lg hover:shadow-xl"
                    >
                        Vào bảng điều khiển
                    </Link>
                ) : (
                    <Link
                        href={route('login')}
                        className="inline-block px-8 py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-colors shadow-lg hover:shadow-xl"
                    >
                        Đăng nhập ngay
                    </Link>
                )}
            </div>
        </div>
    );
}