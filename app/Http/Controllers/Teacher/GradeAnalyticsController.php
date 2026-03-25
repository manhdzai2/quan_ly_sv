<?php

namespace App\Http\Controllers\Teacher;

use App\Http\Controllers\Controller;
use App\Models\Enrollment;
use App\Models\Score;
use Illuminate\Http\Request;
use Inertia\Inertia;

class GradeAnalyticsController extends Controller
{
    public function index(Request $request)
    {
        $teacher = $request->user()->teacher;
        if (!$teacher) return redirect()->route('teacher.dashboard');

        $subjectIds = Enrollment::where('teacher_id', $teacher->id)
            ->pluck('subject_id')->unique()->toArray();

        $subjects = \App\Models\Subject::whereIn('id', $subjectIds)->get(['id', 'name', 'code']);

        // Lấy tất cả điểm theo từng môn
        $analytics = [];
        foreach ($subjects as $subject) {
            $enrollments = Enrollment::where('teacher_id', $teacher->id)
                ->where('subject_id', $subject->id)
                ->with('score', 'student.user')
                ->get();

            $scores = $enrollments->filter(fn($e) => $e->score && $e->score->total_score !== null);

            // Phân bổ xếp loại
            $distribution = ['Giỏi' => 0, 'Khá' => 0, 'Trung bình' => 0, 'Yếu' => 0];
            $scoreValues = [];

            foreach ($scores as $e) {
                $total = $e->score->total_score;
                $scoreValues[] = $total;
                if ($total >= 8.5) $distribution['Giỏi']++;
                elseif ($total >= 7.0) $distribution['Khá']++;
                elseif ($total >= 5.0) $distribution['Trung bình']++;
                else $distribution['Yếu']++;
            }

            $analytics[] = [
                'subject_id' => $subject->id,
                'subject_name' => $subject->name,
                'subject_code' => $subject->code,
                'total_students' => $enrollments->count(),
                'graded_count' => $scores->count(),
                'avg_score' => $scores->count() > 0 ? round($scores->avg(fn($e) => $e->score->total_score), 2) : null,
                'max_score' => $scores->count() > 0 ? $scores->max(fn($e) => $e->score->total_score) : null,
                'min_score' => $scores->count() > 0 ? $scores->min(fn($e) => $e->score->total_score) : null,
                'distribution' => $distribution,
                'histogram' => $this->buildHistogram($scoreValues),
            ];
        }

        return Inertia::render('Teacher/Analytics/Index', [
            'analytics' => $analytics,
            'subjects' => $subjects,
        ]);
    }

    private function buildHistogram(array $scores): array
    {
        // Phổ điểm theo khoảng 0-1, 1-2, ..., 9-10
        $bins = [];
        for ($i = 0; $i < 10; $i++) {
            $label = $i . '-' . ($i + 1);
            $bins[] = [
                'range' => $label,
                'count' => count(array_filter($scores, fn($s) => $s >= $i && $s < ($i + 1))),
            ];
        }
        // Gộp 9-10 (bao gồm điểm 10)
        $bins[9]['count'] += count(array_filter($scores, fn($s) => $s == 10));
        return $bins;
    }
}
