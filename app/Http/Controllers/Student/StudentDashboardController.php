<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\Enrollment;
use App\Models\Schedule;
use App\Models\Attendance;
use App\Models\Assignment;
use App\Models\Submission;
use Illuminate\Http\Request;
use Inertia\Inertia;

class StudentDashboardController extends Controller
{
    public function index(Request $request)
    {
        $student = $request->user()->student;
        if (!$student) {
            return Inertia::render('Student/Dashboard', [
                'todayClasses' => [], 'stats' => [], 'deadlines' => [], 'gpa' => 0, 'totalCredits' => 0,
            ]);
        }

        $nowVn = now('Asia/Ho_Chi_Minh');
        $today = $nowVn->format('Y-m-d');
        $dayMap = [
            'Monday' => 'Thứ 2', 'Tuesday' => 'Thứ 3', 'Wednesday' => 'Thứ 4',
            'Thursday' => 'Thứ 5', 'Friday' => 'Thứ 6', 'Saturday' => 'Thứ 7', 'Sunday' => 'Chủ nhật'
        ];
        $todayVi = $dayMap[$nowVn->format('l')] ?? '';

        // Enrollments + Subject IDs
        $enrollments = Enrollment::where('student_id', $student->id)->with('score', 'subject')->get();
        $subjectIds = $enrollments->pluck('subject_id')->toArray();
        $enrollmentIds = $enrollments->pluck('id')->toArray();

        // 1. Lịch hôm nay
        $todayClasses = Schedule::where(function ($q) use ($today, $todayVi) {
                $q->whereDate('study_date', $today)->orWhere('day_of_week', $todayVi);
            })
            ->whereIn('subject_id', $subjectIds)
            ->with('subject')
            ->orderBy('start_time')
            ->get()
            ->map(fn($s) => [
                'subject_name' => $s->subject->name ?? '',
                'subject_code' => $s->subject->code ?? '',
                'room' => $s->room,
                'start_time' => \Carbon\Carbon::parse($s->start_time)->format('H:i'),
                'end_time' => \Carbon\Carbon::parse($s->end_time)->format('H:i'),
                'type' => $s->type,
            ]);

        // 2. GPA & Credits
        $totalCredits = $enrollments->sum(fn($e) => $e->subject->credits ?? 0);
        $gradedEnrollments = $enrollments->filter(fn($e) => $e->score && $e->score->total_score !== null);
        $gpa = $gradedEnrollments->count() > 0
            ? round($gradedEnrollments->avg(fn($e) => $e->score->total_score), 2)
            : 0;

        // 3. Attendance (query qua enrollment_id)
        $totalAttendance = Attendance::whereIn('enrollment_id', $enrollmentIds)->count();
        $presentAttendance = Attendance::whereIn('enrollment_id', $enrollmentIds)->whereIn('status', ['present', 'late'])->count();
        $attendanceRate = $totalAttendance > 0 ? round(($presentAttendance / $totalAttendance) * 100, 1) : 100;

        // 4. Upcoming deadlines
        $deadlines = Assignment::whereIn('subject_id', $subjectIds)
            ->where('deadline', '>', $nowVn)
            ->with('subject')
            ->orderBy('deadline')
            ->take(5)
            ->get()
            ->map(function ($a) use ($student, $nowVn) {
                $submission = Submission::where('assignment_id', $a->id)->where('student_id', $student->id)->first();
                $daysLeft = $nowVn->diffInDays($a->deadline, false);
                return [
                    'id' => $a->id,
                    'title' => $a->title,
                    'subject_name' => $a->subject->name ?? '',
                    'deadline' => $a->deadline->format('d/m H:i'),
                    'days_left' => max(0, (int) $daysLeft),
                    'submitted' => $submission !== null,
                ];
            });

        // 5. Stats
        $stats = [
            'totalSubjects' => count($subjectIds),
            'totalCredits' => $totalCredits,
            'attendanceRate' => $attendanceRate,
            'pendingAssignments' => Assignment::whereIn('subject_id', $subjectIds)
                ->where('deadline', '>', $nowVn)
                ->whereDoesntHave('submissions', fn($q) => $q->where('student_id', $student->id))
                ->count(),
        ];

        return Inertia::render('Student/Dashboard', [
            'todayClasses' => $todayClasses,
            'stats' => $stats,
            'deadlines' => $deadlines,
            'gpa' => $gpa,
            'totalCredits' => $totalCredits,
            'attendanceRate' => $attendanceRate,
            'studentName' => $student->user->name ?? 'Sinh viên',
        ]);
    }
}
