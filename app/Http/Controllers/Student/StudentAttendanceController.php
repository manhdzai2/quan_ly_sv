<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\Attendance;
use App\Models\Enrollment;
use App\Models\LeaveRequest;
use Illuminate\Http\Request;
use Inertia\Inertia;

class StudentAttendanceController extends Controller
{
    public function index(Request $request)
    {
        $student = $request->user()->student;
        if (!$student) return redirect()->route('student.dashboard');

        $enrollments = Enrollment::where('student_id', $student->id)
            ->with('subject', 'teacher.user')
            ->get();

        // Điểm danh theo từng môn (query qua enrollment_id)
        $attendanceBySubject = $enrollments->map(function ($enr) {
            $records = Attendance::where('enrollment_id', $enr->id)
                ->orderBy('date', 'desc')
                ->get();

            $total = $records->count();
            $present = $records->where('status', 'present')->count();
            $late = $records->where('status', 'late')->count();
            $absentExcused = $records->where('status', 'absent_excused')->count();
            $absentUnexcused = $records->where('status', 'absent_unexcused')->count();
            $rate = $total > 0 ? round(($present + $late) / $total * 100, 1) : 100;

            return [
                'subject_id' => $enr->subject_id,
                'subject_name' => $enr->subject->name ?? '',
                'subject_code' => $enr->subject->code ?? '',
                'teacher_name' => $enr->teacher->user->name ?? '',
                'total' => $total,
                'present' => $present,
                'late' => $late,
                'absent_excused' => $absentExcused,
                'absent_unexcused' => $absentUnexcused,
                'rate' => $rate,
                'warning' => $rate < 80,
                'records' => $records->map(fn($r) => [
                    'date' => $r->date->format('d/m/Y'),
                    'status' => $r->status,
                    'note' => $r->note,
                ]),
            ];
        });

        return Inertia::render('Student/Attendance/Index', [
            'attendanceBySubject' => $attendanceBySubject,
        ]);
    }

    public function requestLeave(Request $request)
    {
        $student = $request->user()->student;

        $validated = $request->validate([
            'subject_id' => 'required|exists:subjects,id',
            'leave_date' => 'required|date|after_or_equal:today',
            'reason' => 'required|string|max:500',
        ]);

        $enrollment = Enrollment::where('student_id', $student->id)
            ->where('subject_id', $validated['subject_id'])
            ->first();

        if (!$enrollment) return back()->with('error', 'Bạn không đăng ký môn này.');

        LeaveRequest::create([
            'student_id' => $student->id,
            'subject_id' => $validated['subject_id'],
            'teacher_id' => $enrollment->teacher_id,
            'leave_date' => $validated['leave_date'],
            'reason' => $validated['reason'],
        ]);

        return back()->with('success', 'Đã gửi đơn xin nghỉ!');
    }
}
