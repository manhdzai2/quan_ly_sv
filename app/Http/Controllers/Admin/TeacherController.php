<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Teacher;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class TeacherController extends Controller
{
    public function index(Request $request)
    {
        $teachers = Teacher::query()
            ->with('user')
            ->when($request->search, function ($query, $search) {
                $query->where('phone', 'like', "%{$search}%")
                    ->orWhereHas('user', function ($q) use ($search) {
                        $q->where('name', 'like', "%{$search}%")
                          ->orWhere('email', 'like', "%{$search}%");
                    });
            })
            ->latest()
            ->paginate(500)
            ->withQueryString();

        return Inertia::render('Admin/Teachers/Index', [
            'teachers' => $teachers,
            'filters' => $request->only(['search'])
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Teachers/Form', ['teacher' => null]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8',
            'phone' => 'nullable|string|max:20',
        ]);

        DB::transaction(function () use ($validated) {
            $user = User::create([
                'name' => $validated['name'],
                'email' => $validated['email'],
                'password' => Hash::make($validated['password']),
                'role_id' => 2, // Giáo viên
            ]);

            Teacher::create([
                'user_id' => $user->id,
                'phone' => $validated['phone'] ?? null,
            ]);
        });

        return redirect()->route('admin.teachers.index')->with('success', 'Thêm giáo viên thành công');
    }

    public function edit($id)
    {
        $teacher = Teacher::with('user')->findOrFail($id);
        
        return Inertia::render('Admin/Teachers/Form', [
            'teacher' => $teacher
        ]);
    }

    public function show($id)
    {
        $teacher = Teacher::with('user')->findOrFail($id);

        // Lấy danh sách môn đang phụ trách + số SV
        $courses = \App\Models\Enrollment::with('subject')
            ->where('teacher_id', $teacher->id)
            ->selectRaw('subject_id, COUNT(student_id) as total_students')
            ->groupBy('subject_id')
            ->get()
            ->map(function ($enr) {
                return [
                    'subject_name' => $enr->subject->name ?? 'Chưa rõ',
                    'subject_code' => $enr->subject->code ?? '',
                    'credits' => $enr->subject->credits ?? $enr->subject->credit ?? 0,
                    'total_students' => $enr->total_students,
                ];
            });

        return Inertia::render('Admin/Teachers/Show', [
            'teacher' => $teacher,
            'courses' => $courses,
        ]);
    }

    public function update(Request $request, $id)
    {
        $teacher = Teacher::findOrFail($id);
        $user = User::findOrFail($teacher->user_id);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,' . $user->id,
            'phone' => 'nullable|string|max:20',
            'password' => 'nullable|string|min:8',
        ]);

        DB::transaction(function () use ($validated, $user, $teacher) {
            $userData = [
                'name' => $validated['name'],
                'email' => $validated['email'],
            ];
            if (!empty($validated['password'])) {
                $userData['password'] = Hash::make($validated['password']);
            }
            $user->update($userData);

            $teacher->update([
                'phone' => $validated['phone'] ?? null,
            ]);
        });

        return redirect()->route('admin.teachers.index')->with('success', 'Cập nhật thành công');
    }

    public function destroy($id)
    {
        $teacher = Teacher::findOrFail($id);
        
        DB::transaction(function () use ($teacher) {
            $user_id = $teacher->user_id;
            $teacher->delete();
            User::destroy($user_id);
        });

        return back()->with('success', 'Đã xóa giáo viên');
    }
}
