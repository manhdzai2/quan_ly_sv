<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\SchoolClass;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ClassController extends Controller
{
    public function index(Request $request)
    {
        $classes = SchoolClass::query()
            ->when($request->search, fn($q, $search) => $q->where('name', 'like', "%{$search}%"))
            ->latest()
            ->paginate(500)
            ->withQueryString();

        return Inertia::render('Admin/Classes/Index', [
            'classes' => $classes,
            'filters' => $request->only(['search'])
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Classes/Form', [
            'mode' => 'create',
            'classData' => null
        ]);
    }

    public function show($id)
    {
        $class = \App\Models\SchoolClass::findOrFail($id);

        // Danh sách sinh viên
        $students = \App\Models\Student::where('class_id', $id)
            ->join('users', 'students.user_id', '=', 'users.id')
            ->select('students.id', 'students.student_code', 'users.name', 'users.email')
            ->orderBy('users.name', 'asc')
            ->get();

        // Danh sách học phần mà sinh viên lớp này đăng ký (unique)
        $studentIds = \App\Models\Student::where('class_id', $id)->pluck('id');
        $subjects = \App\Models\Enrollment::whereIn('student_id', $studentIds)
            ->with('subject')
            ->get()
            ->pluck('subject')
            ->unique('id')
            ->map(function ($sub) use ($studentIds) {
                $enrolledCount = \App\Models\Enrollment::where('subject_id', $sub->id)
                    ->whereIn('student_id', $studentIds)
                    ->count();
                return [
                    'id' => $sub->id,
                    'name' => $sub->name,
                    'code' => $sub->code ?? '',
                    'credits' => $sub->credits ?? $sub->credit ?? 0,
                    'enrolled_count' => $enrolledCount,
                ];
            })
            ->values();

        return Inertia::render('Admin/Classes/Show', [
            'classData' => $class,
            'students' => $students,
            'subjects' => $subjects,
        ]);
    }
    
    public function store(Request $request)
    {
        $data = $request->validate(['name' => 'required|max:255', 'description' => 'nullable']);
        SchoolClass::create($data);
        return redirect()->route('admin.classes.index')->with('success', 'Tạo lớp thành công');
    }

    public function edit($id)
    {
        $class = SchoolClass::findOrFail($id);
        return Inertia::render('Admin/Classes/Form', ['mode' => 'edit', 'classData' => $class]);
    }

    public function update(Request $request, $id)
    {
        $class = SchoolClass::findOrFail($id);
        $data = $request->validate(['name' => 'required|max:255', 'description' => 'nullable']);
        $class->update($data);
        return redirect()->route('admin.classes.index')->with('success', 'Cập nhật thành công');
    }

    public function destroy($id)
    {
        SchoolClass::findOrFail($id)->delete();
        return back()->with('success', 'Đã xóa lớp');
    }
}