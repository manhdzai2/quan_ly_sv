<?php

namespace App\Http\Controllers\Teacher;

use App\Http\Controllers\Controller;
use App\Models\Enrollment;
use App\Models\Schedule;
use App\Models\Score;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TeacherDashboardController extends Controller
{
    public function index(Request $request)
    {
        $teacher = $request->user()->teacher;

        if (!$teacher) {
            return Inertia::render('Teacher/Dashboard', [
                'todaySchedules' => [],
                'stats' => ['totalClasses' => 0, 'totalStudents' => 0, 'pendingGrades' => 0, 'avgAttendance' => 0],
                'todoItems' => [],
                'announcements' => [],
            ]);
        }

        // 1. Lịch giảng dạy hôm nay (dùng timezone VN tường minh)
        $nowVn = now('Asia/Ho_Chi_Minh');
        $today = $nowVn->format('Y-m-d');
        $dayMap = [
            'Monday' => 'Thứ 2', 'Tuesday' => 'Thứ 3', 'Wednesday' => 'Thứ 4',
            'Thursday' => 'Thứ 5', 'Friday' => 'Thứ 6', 'Saturday' => 'Thứ 7', 'Sunday' => 'Chủ nhật'
        ];
        $todayVi = $dayMap[$nowVn->format('l')] ?? '';

        // Lấy subject_ids mà teacher đang dạy
        $subjectIds = Enrollment::where('teacher_id', $teacher->id)
            ->pluck('subject_id')
            ->unique()
            ->values()
            ->toArray();

        // Query schedule: lấy theo day_of_week HOẶC study_date = hôm nay
        // Và chỉ lấy môn mà GV này đang dạy
        $todaySchedules = Schedule::where(function ($q) use ($today, $todayVi) {
                $q->whereDate('study_date', $today)
                  ->orWhere('day_of_week', $todayVi);
            })
            ->whereIn('subject_id', $subjectIds)
            ->with('subject')
            ->orderBy('start_time')
            ->get()
            ->map(function ($s) {
                return [
                    'id' => $s->id,
                    'subject_name' => $s->subject->name ?? '',
                    'subject_code' => $s->subject->code ?? '',
                    'room' => $s->room,
                    'start_time' => \Carbon\Carbon::parse($s->start_time)->format('H:i'),
                    'end_time' => \Carbon\Carbon::parse($s->end_time)->format('H:i'),
                    'type' => $s->type,
                    'color_theme' => $s->color_theme ?? 'blue',
                ];
            });

        // 2. Thống kê nhanh
        $enrollments = Enrollment::where('teacher_id', $teacher->id)->with('score')->get();
        $totalStudents = $enrollments->count();
        $totalClasses = $enrollments->pluck('subject_id')->unique()->count();
        
        // SV chưa có đủ điểm
        $pendingGrades = $enrollments->filter(function ($enr) {
            return !$enr->score || $enr->score->total_score === null;
        })->count();

        // Tỷ lệ chuyên cần trung bình (dựa trên attendance_score)
        $avgAttendance = $enrollments->filter(fn($e) => $e->score && $e->score->attendance_score !== null)
            ->avg(fn($e) => $e->score->attendance_score) ?? 0;

        $stats = [
            'totalClasses' => $totalClasses,
            'totalStudents' => $totalStudents,
            'pendingGrades' => $pendingGrades,
            'avgAttendance' => round($avgAttendance * 10, 1), // scale 0-10 -> 0-100%
        ];

        // 3. Todo items
        $todoItems = [];
        if ($pendingGrades > 0) {
            $todoItems[] = [
                'icon' => 'grading',
                'text' => "Còn {$pendingGrades} sinh viên chưa chấm đủ điểm",
                'type' => 'warning',
            ];
        }

        // SV vắng quá 20% (giả lập dựa trên attendance_score < 5)
        $lowAttendance = $enrollments->filter(function ($enr) {
            return $enr->score && $enr->score->attendance_score !== null && $enr->score->attendance_score < 5;
        });
        if ($lowAttendance->count() > 0) {
            $todoItems[] = [
                'icon' => 'warning',
                'text' => "{$lowAttendance->count()} sinh viên có chuyên cần dưới 50%",
                'type' => 'error',
            ];
        }

        // 4. Thông báo hệ thống (hardcoded mẫu)
        $announcements = [
            ['title' => 'Kỳ thi giữa kỳ bắt đầu từ 01/04/2026', 'date' => '20/03/2026', 'type' => 'info'],
            ['title' => 'Hạn chót nộp bảng điểm cuối kỳ: 15/04/2026', 'date' => '18/03/2026', 'type' => 'warning'],
            ['title' => 'Hệ thống bảo trì 00:00 - 06:00 ngày 25/03', 'date' => '22/03/2026', 'type' => 'info'],
        ];

        return Inertia::render('Teacher/Dashboard', [
            'todaySchedules' => $todaySchedules,
            'stats' => $stats,
            'todoItems' => $todoItems,
            'announcements' => $announcements,
        ]);
    }
}
