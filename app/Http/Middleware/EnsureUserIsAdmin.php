<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class EnsureUserIsAdmin
{
    public function handle(Request $request, Closure $next)
    {
        // Ép kiểu role_id về integer (int) để so sánh chắc chắn, tránh lỗi chuỗi "1" khác số 1
        if (!Auth::check() || (int) Auth::user()->role_id !== 1) {
            $currentRole = Auth::check() ? (Auth::user()->role_id ?? 'NULL') : 'Chưa đăng nhập';
            abort(403, 'BẠN KHÔNG CÓ QUYỀN TRUY CẬP KHU VỰC NÀY. Role ID hiện tại của bạn đang là: ' . $currentRole);
        }
        
        return $next($request);
    }
}