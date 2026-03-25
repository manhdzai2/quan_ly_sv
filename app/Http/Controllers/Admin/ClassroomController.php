<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Classroom;
use App\Models\Subject;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ClassroomController extends Controller
{
    public function index(Request $request)
    {
        // Lấy danh sách lớp kèm theo thông tin môn học (relationship 'subject')
        $classrooms = Classroom::with('subject')
            ->when($request->search, function ($query, $search) {
                $query->where('name', 'like', "%{$search}%")
                      ->orWhere('room', 'like', "%{$search}%");
            })
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('Admin/Classrooms/Index', [
            'classrooms' => $classrooms,
            'filters' => $request->only(['search'])
        ]);
    }

    public function create()
    {
        // Truyền danh sách môn học sang để làm thẻ <select>
        $subjects = Subject::orderBy('name')->get(['id', 'name', 'code']);
        
        return Inertia::render('Admin/Classrooms/Form', [
            'subjects' => $subjects
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:100|unique:classrooms',
            'subject_id' => 'required|exists:subjects,id',
            'room' => 'nullable|string|max:50',
        ]);

        Classroom::create($validated);

        return redirect()->route('admin.classrooms.index')->with('success', 'Đã tạo lớp học mới!');
    }

    public function edit(Classroom $classroom)
    {
        $subjects = Subject::orderBy('name')->get(['id', 'name', 'code']);

        return Inertia::render('Admin/Classrooms/Form', [
            'classroom' => $classroom,
            'subjects' => $subjects
        ]);
    }

    public function update(Request $request, Classroom $classroom)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:100|unique:classrooms,name,' . $classroom->id,
            'subject_id' => 'required|exists:subjects,id',
            'room' => 'nullable|string|max:50',
        ]);

        $classroom->update($validated);

        return redirect()->route('admin.classrooms.index')->with('success', 'Đã cập nhật lớp học!');
    }

    public function destroy(Classroom $classroom)
    {
        $classroom->delete();
        return back()->with('success', 'Đã xóa lớp học!');
    }
}