<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\Material;
use App\Models\Enrollment;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;

class StudentMaterialController extends Controller
{
    public function index(Request $request)
    {
        $student = $request->user()->student;
        if (!$student) return redirect()->route('student.dashboard');

        $subjectIds = Enrollment::where('student_id', $student->id)->pluck('subject_id')->toArray();

        $materials = Material::whereIn('subject_id', $subjectIds)
            ->with(['subject', 'teacher.user'])
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function($m) {
                return [
                    'id' => $m->id,
                    'title' => $m->title,
                    'description' => $m->description,
                    'file_path' => $m->file_path,
                    'file_type' => $m->file_type,
                    'file_size' => $m->file_size,
                    'subject_name' => $m->subject->name ?? '',
                    'teacher_name' => $m->teacher->user->name ?? '',
                    'created_at' => $m->created_at->format('d/m/Y H:i'),
                ];
            });

        return Inertia::render('Student/Materials/Index', [
            'materials' => $materials
        ]);
    }

    public function download($id)
    {
        $material = Material::findOrFail($id);

        $student = auth()->user()->student;
        $isEnrolled = Enrollment::where('student_id', $student->id)
            ->where('subject_id', $material->subject_id)
            ->exists();

        abort_if(!$isEnrolled, 403, 'Bạn không có quyền tải tài liệu này.');

        return Storage::disk('public')->download($material->file_path);
    }
}
