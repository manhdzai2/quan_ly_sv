<?php

namespace App\Http\Controllers\Teacher;

use App\Http\Controllers\Controller;
use App\Models\Assignment;
use App\Models\Submission;
use App\Models\Enrollment;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AssignmentController extends Controller
{
    public function index(Request $request)
    {
        $teacher = $request->user()->teacher;
        if (!$teacher) return redirect()->route('teacher.dashboard');

        $subjectIds = Enrollment::where('teacher_id', $teacher->id)
            ->pluck('subject_id')->unique()->toArray();

        $assignments = Assignment::whereIn('subject_id', $subjectIds)
            ->where('teacher_id', $teacher->id)
            ->with(['subject', 'submissions'])
            ->latest()
            ->get()
            ->map(function ($a) {
                return [
                    'id' => $a->id,
                    'title' => $a->title,
                    'description' => $a->description,
                    'subject_name' => $a->subject->name ?? '',
                    'subject_code' => $a->subject->code ?? '',
                    'deadline' => $a->deadline?->format('d/m/Y H:i'),
                    'deadline_raw' => $a->deadline?->toISOString(),
                    'max_score' => $a->max_score,
                    'is_locked' => $a->is_locked,
                    'file_name' => $a->file_name,
                    'file_path' => $a->file_path,
                    'total_submissions' => $a->submissions->count(),
                    'graded_count' => $a->submissions->where('score', '!=', null)->count(),
                    'is_past_deadline' => $a->deadline && $a->deadline->isPast(),
                    'created_at' => $a->created_at->format('d/m/Y'),
                ];
            });

        $subjects = \App\Models\Subject::whereIn('id', $subjectIds)->get(['id', 'name', 'code']);

        return Inertia::render('Teacher/Assignments/Index', [
            'assignments' => $assignments,
            'subjects' => $subjects,
        ]);
    }

    public function store(Request $request)
    {
        $teacher = $request->user()->teacher;

        $validated = $request->validate([
            'subject_id' => 'required|exists:subjects,id',
            'title' => 'required|string|max:255',
            'description' => 'nullable|string|max:2000',
            'deadline' => 'required|date|after:now',
            'max_score' => 'required|numeric|min:1|max:100',
            'file' => 'nullable|file|max:51200',
        ]);

        $filePath = null;
        $fileName = null;
        if ($request->hasFile('file')) {
            $file = $request->file('file');
            $fileName = $file->getClientOriginalName();
            $filePath = $file->store('assignments', 'public');
        }

        Assignment::create([
            'subject_id' => $validated['subject_id'],
            'teacher_id' => $teacher->id,
            'title' => $validated['title'],
            'description' => $validated['description'] ?? null,
            'deadline' => $validated['deadline'],
            'max_score' => $validated['max_score'],
            'file_path' => $filePath,
            'file_name' => $fileName,
        ]);

        return back()->with('success', 'Đã tạo bài tập thành công!');
    }

    public function show($id)
    {
        $assignment = Assignment::with(['subject', 'submissions.student.user'])->findOrFail($id);

        // Lấy danh sách SV đăng ký môn này
        $enrolledStudents = Enrollment::where('subject_id', $assignment->subject_id)
            ->where('teacher_id', $assignment->teacher_id)
            ->with('student.user')
            ->get()
            ->map(function ($enr) use ($assignment) {
                $submission = $assignment->submissions->where('student_id', $enr->student_id)->first();
                return [
                    'student_id' => $enr->student_id,
                    'student_name' => $enr->student->user->name ?? 'N/A',
                    'student_code' => $enr->student->student_code ?? '',
                    'submitted' => $submission !== null,
                    'submitted_at' => $submission?->submitted_at?->format('d/m/Y H:i'),
                    'is_late' => $submission?->is_late ?? false,
                    'score' => $submission?->score,
                    'feedback' => $submission?->feedback,
                    'file_name' => $submission?->file_name,
                    'submission_id' => $submission?->id,
                ];
            });

        return Inertia::render('Teacher/Assignments/Show', [
            'assignment' => [
                'id' => $assignment->id,
                'title' => $assignment->title,
                'description' => $assignment->description,
                'subject_name' => $assignment->subject->name ?? '',
                'deadline' => $assignment->deadline?->format('d/m/Y H:i'),
                'max_score' => $assignment->max_score,
                'is_locked' => $assignment->is_locked,
                'file_name' => $assignment->file_name,
            ],
            'students' => $enrolledStudents,
        ]);
    }

    public function gradeSubmission(Request $request)
    {
        $validated = $request->validate([
            'submission_id' => 'required|exists:submissions,id',
            'score' => 'required|numeric|min:0',
            'feedback' => 'nullable|string|max:1000',
        ]);

        $submission = Submission::findOrFail($validated['submission_id']);
        $submission->update([
            'score' => $validated['score'],
            'feedback' => $validated['feedback'] ?? null,
        ]);

        return back()->with('success', 'Đã chấm điểm thành công!');
    }

    public function destroy($id)
    {
        $assignment = Assignment::findOrFail($id);
        if ($assignment->file_path && \Storage::disk('public')->exists($assignment->file_path)) {
            \Storage::disk('public')->delete($assignment->file_path);
        }
        $assignment->delete();
        return back()->with('success', 'Đã xóa bài tập!');
    }
}
