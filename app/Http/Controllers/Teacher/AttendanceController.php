<?php

namespace App\Http\Controllers\Teacher;

use App\Http\Controllers\Controller;
use App\Models\Attendance;
use App\Models\Enrollment;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AttendanceController extends Controller
{
    /**
     * Trang điểm danh: chọn lớp + ngày → danh sách SV
     */
    public function index(Request $request)
    {
        $teacher = $request->user()->teacher;
        if (!$teacher) {
            return Inertia::render('Teacher/Attendance/Index', [
                'subjects' => [],
                'enrollments' => [],
                'selectedSubjectId' => null,
                'selectedDate' => now()->format('Y-m-d'),
            ]);
        }

        $subjectId = $request->input('subject_id');
        $date = $request->input('date', now()->format('Y-m-d'));

        // Danh sách môn đang dạy (để dropdown chọn)
        $subjects = Enrollment::where('teacher_id', $teacher->id)
            ->with('subject')
            ->get()
            ->pluck('subject')
            ->unique('id')
            ->values();

        // Danh sách SV trong lớp đã chọn + trạng thái điểm danh
        $enrollments = [];
        if ($subjectId) {
            $enrollments = Enrollment::where('teacher_id', $teacher->id)
                ->where('subject_id', $subjectId)
                ->with(['student.user'])
                ->get()
                ->map(function ($enr) use ($date) {
                    $attendance = Attendance::where('enrollment_id', $enr->id)
                        ->where('date', $date)
                        ->first();

                    // Đếm tổng buổi & buổi vắng
                    $totalSessions = Attendance::where('enrollment_id', $enr->id)->count();
                    $absentCount = Attendance::where('enrollment_id', $enr->id)
                        ->whereIn('status', ['absent_excused', 'absent_unexcused'])
                        ->count();

                    return [
                        'enrollment_id' => $enr->id,
                        'student_name' => $enr->student->user->name ?? 'N/A',
                        'student_code' => $enr->student->student_code ?? '',
                        'status' => $attendance->status ?? null,
                        'note' => $attendance->note ?? '',
                        'total_sessions' => $totalSessions,
                        'absent_count' => $absentCount,
                        'absent_rate' => $totalSessions > 0 ? round(($absentCount / $totalSessions) * 100, 1) : 0,
                    ];
                });
        }

        return Inertia::render('Teacher/Attendance/Index', [
            'subjects' => $subjects,
            'enrollments' => $enrollments,
            'selectedSubjectId' => $subjectId,
            'selectedDate' => $date,
        ]);
    }

    /**
     * Lưu điểm danh hàng loạt
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'date' => 'required|date',
            'records' => 'required|array',
            'records.*.enrollment_id' => 'required|exists:enrollments,id',
            'records.*.status' => 'required|in:present,absent_excused,absent_unexcused,late',
            'records.*.note' => 'nullable|string|max:255',
        ]);

        foreach ($validated['records'] as $record) {
            Attendance::updateOrCreate(
                [
                    'enrollment_id' => $record['enrollment_id'],
                    'date' => $validated['date'],
                ],
                [
                    'status' => $record['status'],
                    'note' => $record['note'] ?? null,
                ]
            );
        }

        return back()->with('success', 'Đã lưu điểm danh thành công!');
    }

    /**
     * Đánh dấu tất cả có mặt
     */
    public function markAllPresent(Request $request)
    {
        $validated = $request->validate([
            'date' => 'required|date',
            'enrollment_ids' => 'required|array',
            'enrollment_ids.*' => 'exists:enrollments,id',
        ]);

        foreach ($validated['enrollment_ids'] as $enrollmentId) {
            Attendance::updateOrCreate(
                [
                    'enrollment_id' => $enrollmentId,
                    'date' => $validated['date'],
                ],
                ['status' => 'present']
            );
        }

        return back()->with('success', 'Đã đánh dấu tất cả có mặt!');
    }
}
