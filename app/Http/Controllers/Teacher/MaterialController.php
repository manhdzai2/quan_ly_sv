<?php

namespace App\Http\Controllers\Teacher;

use App\Http\Controllers\Controller;
use App\Models\Material;
use App\Models\Enrollment;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MaterialController extends Controller
{
    public function index(Request $request)
    {
        $teacher = $request->user()->teacher;
        if (!$teacher) return redirect()->route('teacher.dashboard');

        // Lấy danh sách môn GV đang dạy
        $subjectIds = Enrollment::where('teacher_id', $teacher->id)
            ->pluck('subject_id')->unique()->toArray();

        // Lấy tài liệu theo môn
        $materials = Material::whereIn('subject_id', $subjectIds)
            ->where('teacher_id', $teacher->id)
            ->with('subject')
            ->latest()
            ->get();

        // Danh sách môn để dropdown
        $subjects = \App\Models\Subject::whereIn('id', $subjectIds)->get(['id', 'name', 'code']);

        return Inertia::render('Teacher/Materials/Index', [
            'materials' => $materials,
            'subjects' => $subjects,
        ]);
    }

    public function store(Request $request)
    {
        $teacher = $request->user()->teacher;

        $validated = $request->validate([
            'subject_id' => 'required|exists:subjects,id',
            'title' => 'required|string|max:255',
            'description' => 'nullable|string|max:1000',
            'type' => 'required|in:slide,pdf,video,document,other',
            'file' => 'nullable|file|max:51200', // Max 50MB
        ]);

        $filePath = null;
        $fileName = null;
        if ($request->hasFile('file')) {
            $file = $request->file('file');
            $fileName = $file->getClientOriginalName();
            $filePath = $file->store('materials', 'public');
        }

        Material::create([
            'subject_id' => $validated['subject_id'],
            'teacher_id' => $teacher->id,
            'title' => $validated['title'],
            'description' => $validated['description'] ?? null,
            'type' => $validated['type'],
            'file_path' => $filePath,
            'file_name' => $fileName,
        ]);

        return back()->with('success', 'Đã tải lên tài liệu thành công!');
    }

    public function destroy($id)
    {
        $material = Material::findOrFail($id);
        
        // Xóa file nếu có
        if ($material->file_path && \Storage::disk('public')->exists($material->file_path)) {
            \Storage::disk('public')->delete($material->file_path);
        }
        
        $material->delete();
        return back()->with('success', 'Đã xóa tài liệu!');
    }
}
