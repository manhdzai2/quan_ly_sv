<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\Enrollment;
use Illuminate\Http\Request;
use Inertia\Inertia;

class StudentGradeController extends Controller
{
    public function index(Request $request)
    {
        $student = $request->user()->student;
        if (!$student) return redirect()->route('student.dashboard');

        // Bảng điểm chi tiết
        $enrollments = Enrollment::where('student_id', $student->id)
            ->with(['subject', 'score', 'teacher.user'])
            ->get()
            ->map(function ($enr) {
                return [
                    'id' => $enr->id,
                    'subject_name' => $enr->subject->name ?? '',
                    'subject_code' => $enr->subject->code ?? '',
                    'credits' => $enr->subject->credits ?? 0,
                    'semester' => 'Kỳ 1 - 2025/2026', // Mock semester cho current
                    'teacher_name' => $enr->teacher->user->name ?? '',
                    'score' => $enr->score ? [
                        'attendance_score' => $enr->score->attendance_score,
                        'midterm_score' => $enr->score->midterm_score,
                        'final_score' => $enr->score->final_score,
                        'total_score' => $enr->score->total_score,
                        'status' => $enr->score->total_score >= 4.0 ? 'passed' : 'failed',
                    ] : null,
                ];
            });

        $graded = $enrollments->filter(fn($e) => $e['score'] && $e['score']['total_score'] !== null);
        $totalCredits = $graded->sum('credits');
        $sumScore = $graded->sum(function($e) {
            return $e['credits'] * $e['score']['total_score'];
        });
        
        $gpa = $totalCredits > 0 ? round($sumScore / $totalCredits, 2) : 0;
        
        // Mock chart data cho Trend Line
        $trendData = [
            ['semester' => 'HK1 2023', 'gpa' => 6.5],
            ['semester' => 'HK2 2023', 'gpa' => 7.2],
            ['semester' => 'HK1 2024', 'gpa' => 7.0],
            ['semester' => 'HK2 2024', 'gpa' => 8.1],
            ['semester' => 'HK1 2025', 'gpa' => 7.4],
            ['semester' => 'HK2 2025', 'gpa' => $gpa > 0 ? $gpa : 8.2],
        ];

        return Inertia::render('Student/Grades/Index', [
            'enrollments' => $enrollments,
            'gpa' => $gpa,
            'totalCredits' => $totalCredits,
            'trendData' => $trendData,
        ]);
    }
}
