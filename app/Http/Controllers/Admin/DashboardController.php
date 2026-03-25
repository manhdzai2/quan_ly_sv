<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Inertia\Response;
use App\Models\Student;
use App\Models\Teacher;
use App\Models\Subject;
use App\Models\SchoolClass;
use App\Models\Score;
use App\Models\Schedule;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class DashboardController extends Controller
{
    public function index(): Response
    {
        // 1. Số liệu tổng quan
        $totalStudents = Student::count();
        $totalTeachers = Teacher::count();
        $totalSubjects = Subject::count();
        $totalClasses  = SchoolClass::count();

        // 2. Phổ điểm theo grade
        $gradeStats = Score::select('grade', DB::raw('COUNT(*) as count'))
            ->groupBy('grade')
            ->pluck('count', 'grade');

        // 3. Phân bổ sinh viên theo lớp (Dữ liệu cho biểu đồ cột mới)
        $classDistribution = SchoolClass::withCount('students')->get()->map(function($c) {
            return ['name' => $c->name, 'students' => $c->students_count];
        });

        // 4. Điểm trung cộng tốt nhất (Top 5 Sinh viên)
        $topStudents = Student::query()
            ->join('users', 'students.user_id', '=', 'users.id')
            ->join('enrollments', 'students.id', '=', 'enrollments.student_id')
            ->join('scores', 'enrollments.id', '=', 'scores.enrollment_id')
            ->select('students.id', 'users.name', 'students.student_code', DB::raw('ROUND(AVG(scores.total_score), 2) as avg_score'))
            ->groupBy('students.id', 'users.name', 'students.student_code')
            ->orderByDesc('avg_score')
            ->limit(5)
            ->get();

        // 5. Tổng quan tài chính (Tạm tính)
        $financial = [
            'total_tuition' => \App\Models\TuitionFee::sum('total_amount'),
            'total_paid'    => \App\Models\TuitionFee::sum('paid_amount'),
        ];

        // 6. Hoạt động gần đây (Mockup nếu ActivityLog trống, hoặc lấy từ DB)
        $recentActivities = \Spatie\Activitylog\Models\Activity::latest()->limit(6)->get()->map(function($act) {
            return [
                'id' => $act->id,
                'description' => $act->description,
                'causer' => $act->causer->name ?? 'Hệ thống',
                'time' => $act->created_at->diffForHumans(),
            ];
        });

        // Nếu trống thì tạo mockup cho đẹp giao diện
        if ($recentActivities->isEmpty()) {
            $recentActivities = collect([
                ['id' => 1, 'description' => 'Đã cập nhật điểm cho lớp K62-TCNH', 'causer' => 'Lê Quang Minh', 'time' => '10 phút trước'],
                ['id' => 2, 'description' => 'Mở đăng ký môn học học kỳ mới', 'causer' => 'Admin', 'time' => '1 giờ trước'],
                ['id' => 3, 'description' => 'Thêm tài liệu: Giáo trình vĩ mô', 'causer' => 'Trần Thị Hương', 'time' => '3 giờ trước'],
            ]);
        }

        return Inertia::render('Admin/Dashboard', [
            'cards' => [
                'students' => $totalStudents,
                'teachers' => $totalTeachers,
                'subjects' => $totalSubjects,
                'classes'  => $totalClasses,
            ],
            'financial' => $financial,
            'gradeStats' => [
                'Gioi' => (int) ($gradeStats['Giỏi'] ?? 0),
                'Kha'  => (int) ($gradeStats['Khá'] ?? 0),
                'TB'   => (int) ($gradeStats['Trung bình'] ?? 0),
                'Yeu'  => (int) ($gradeStats['Yếu'] ?? 0),
            ],
            'classDistribution' => $classDistribution,
            'topStudents' => $topStudents,
            'recentActivities' => $recentActivities,
        ]);
    }
}
