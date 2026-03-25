<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\Assignment;
use App\Models\Enrollment;
use App\Models\Submission;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;

class StudentAssignmentController extends Controller
{
    public function index(Request $request)
    {
        $student = $request->user()->student;
        if (!$student) return redirect()->route('student.dashboard');

        $nowVn = now('Asia/Ho_Chi_Minh');
        $subjectIds = Enrollment::where('student_id', $student->id)->pluck('subject_id')->toArray();

        // Load assignments with submissions
        $assignments = Assignment::whereIn('subject_id', $subjectIds)
            ->with(['subject', 'teacher.user', 'submissions' => function($q) use ($student) {
                $q->where('student_id', $student->id);
            }])
            ->orderBy('deadline', 'asc')
            ->get()
            ->map(function($a) use ($nowVn) {
                $submission = $a->submissions->first();
                $isLate = $nowVn->greaterThan($a->deadline);
                $daysLeft = $nowVn->diffInDays($a->deadline, false);
                
                $statusType = 'pending'; // chưa nộp, còn hạn
                if ($submission) {
                    $statusType = $submission->submitted_at->greaterThan($a->deadline) ? 'late_submitted' : 'submitted';
                } elseif ($isLate) {
                    $statusType = 'overdue'; // chưa nộp, quá hạn
                }

                return [
                    'id' => $a->id,
                    'title' => $a->title,
                    'description' => $a->description,
                    'deadline' => $a->deadline->format('d/m/Y H:i'),
                    'days_left' => max(0, (int) $daysLeft),
                    'is_late' => $isLate,
                    'subject_name' => $a->subject->name ?? '',
                    'teacher_name' => $a->teacher->user->name ?? '',
                    'status' => $statusType,
                    'submission' => $submission ? [
                        'file_path' => $submission->file_path,
                        'file_type' => $submission->file_type,
                        'submitted_at' => \Carbon\Carbon::parse($submission->submitted_at)->format('d/m/Y H:i'),
                        'score' => $submission->score,
                        'feedback' => $submission->feedback,
                    ] : null
                ];
            });

        return Inertia::render('Student/Assignments/Index', [
            'assignments' => $assignments
        ]);
    }

    public function submit(Request $request, $id)
    {
        $request->validate([
            'file' => 'required|file|max:10240', // max 10MB
        ]);

        $assignment = Assignment::findOrFail($id);
        $student = $request->user()->student;

        // Check enrolled
        $isEnrolled = Enrollment::where('student_id', $student->id)
            ->where('subject_id', $assignment->subject_id)
            ->exists();
        abort_if(!$isEnrolled, 403, 'Bạn không thể nộp bài tập môn này.');

        $file = $request->file('file');
        $extension = $file->getClientOriginalExtension();
        $filename = 'sub_' . time() . '_' . \Str::random(5) . '.' . $extension;
        $path = $file->storeAs('submissions', $filename, 'public');

        Submission::updateOrCreate(
            ['assignment_id' => $assignment->id, 'student_id' => $student->id],
            [
                'file_path' => $path,
                'file_type' => strtolower($extension),
                'file_size' => $file->getSize(),
                'submitted_at' => now('Asia/Ho_Chi_Minh'),
            ]
        );

        return back()->with('success', 'Nộp bài thành công!');
    }
}
