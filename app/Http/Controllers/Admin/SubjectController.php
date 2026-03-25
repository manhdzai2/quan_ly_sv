<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Subject;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SubjectController extends Controller
{
    public function index(Request $request)
    {
        $subjects = Subject::query()
            ->when($request->search, function ($query, $search) {
                $query->where('name', 'like', "%{$search}%")
                      ->orWhere('code', 'like', "%{$search}%");
            })
            ->latest()
            ->paginate(500)
            ->withQueryString();

        return Inertia::render('Admin/Subjects/Index', [
            'subjects' => $subjects,
            'filters' => $request->only(['search'])
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Subjects/Form');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'code' => 'required|string|max:50|unique:subjects',
            'name' => 'required|string|max:255',
            'credits' => 'required|integer|min:1|max:10',
        ]);

        Subject::create($validated);

        return redirect()->route('admin.subjects.index')->with('success', 'Đã thêm môn học mới!');
    }

    public function edit(Subject $subject)
    {
        return Inertia::render('Admin/Subjects/Form', [
            'subject' => $subject
        ]);
    }

    public function update(Request $request, Subject $subject)
    {
        $validated = $request->validate([
            'code' => 'required|string|max:50|unique:subjects,code,' . $subject->id,
            'name' => 'required|string|max:255',
            'credits' => 'required|integer|min:1|max:10',
        ]);

        $subject->update($validated);

        return redirect()->route('admin.subjects.index')->with('success', 'Đã cập nhật môn học!');
    }

    public function show($id)
    {
        $subject = Subject::with(['enrollments.student.user', 'enrollments.teacher.user'])->findOrFail($id);
        
        $materials = \App\Models\Material::with('teacher.user')
            ->where('subject_id', $id)
            ->get();

        $assignments = \App\Models\Assignment::with('teacher.user')
            ->where('subject_id', $id)
            ->get();

        $enrollments = $subject->enrollments->map(function ($enr) {
            return [
                'student_code' => $enr->student->student_code ?? '',
                'student_name' => $enr->student->user->name ?? 'N/A',
                'student_email' => $enr->student->user->email ?? '',
                'teacher_name' => $enr->teacher->user->name ?? 'Chưa rõ',
                'score' => $enr->score,
            ];
        });

        return Inertia::render('Admin/Subjects/Show', [
            'subjectData' => $subject,
            'enrollments' => $enrollments,
            'materials' => $materials,
            'assignments' => $assignments
        ]);
    }
}