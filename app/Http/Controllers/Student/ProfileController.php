<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\Schedule;
use Carbon\Carbon;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Facades\Auth;

class ProfileController extends Controller
{
    public function index(): Response
    {
        $student = Auth::user()->student()->with([
            'user',
            'class',
            'enrollments.subject',
            'enrollments.score'
        ])->first();

        // Nâng cấp: Chặn ngay nếu không tìm thấy profile sinh viên
        abort_if(!$student, 403, 'Không tìm thấy hồ sơ sinh viên hợp lệ.');

        return Inertia::render('Student/Profile', [
            'studentInfo' => $student,
            'enrollments' => $student->enrollments, // Không cần toán tử 3 ngôi nữa vì đã chặn null ở trên
        ]);
    }

    public function schedule(): Response
    {
        $student = Auth::user()->student;

        // Nâng cấp: Bảo vệ code không bị crash nếu $student là null
        abort_if(!$student, 403, 'Không tìm thấy hồ sơ sinh viên hợp lệ.');

        // 1. Tìm tất cả các ID môn học mà sinh viên này đang đăng ký
        $subjectIds = $student->enrollments()->pluck('subject_id');

        // 2. Lấy lịch học của các môn đó từ Database
        $schedules = Schedule::with('subject')
            ->whereIn('subject_id', $subjectIds)
            ->orderBy('study_date')
            ->orderBy('start_time')
            ->get()
            ->map(function ($sched) {
                return [
                    'day' => $sched->day_of_week,
                    'date' => Carbon::parse($sched->study_date)->format('d/m/Y'),
                    'time' => Carbon::parse($sched->start_time)->format('H:i') . ' - ' . Carbon::parse($sched->end_time)->format('H:i'),
                    'subject' => $sched->subject->name ?? 'Chưa rõ môn',
                    'room' => $sched->room,
                    'type' => $sched->type,
                    'instructor' => $sched->instructor,
                    'color' => 'bg-' . $sched->color_theme . '-50 border-' . $sched->color_theme . '-200 text-' . $sched->color_theme . '-700'
                ];
            });

        return Inertia::render('Student/Schedule', [
            'schedules' => $schedules
        ]);
    }

    public function support(): Response
    {
        $student = Auth::user()->student()->with('user')->first();

        // Bảo vệ code không bị crash nếu $student là null
        abort_if(!$student, 403, 'Không tìm thấy hồ sơ sinh viên hợp lệ.');

        return Inertia::render('Student/Support', [
            'studentInfo' => $student
        ]);
    }
}