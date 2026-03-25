<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Student;
use App\Models\Teacher;
use App\Models\Subject;
use App\Models\SchoolClass;

class SearchController extends Controller
{
    public function search(Request $request)
    {
        $query = $request->get('q', '');
        
        if (strlen($query) < 2) {
            return response()->json(['results' => []]);
        }

        $results = [];

        // Tìm sinh viên
        $students = Student::with('user')
            ->whereHas('user', fn($q) => $q->where('name', 'like', "%{$query}%")->orWhere('email', 'like', "%{$query}%"))
            ->orWhere('student_code', 'like', "%{$query}%")
            ->limit(5)
            ->get();

        foreach ($students as $s) {
            $results[] = [
                'type' => 'student',
                'label' => $s->user->name ?? 'Sinh viên',
                'sub' => $s->student_code,
                'icon' => 'school',
                'url' => route('admin.students.show', $s->id),
            ];
        }

        // Tìm giảng viên
        $teachers = Teacher::with('user')
            ->whereHas('user', fn($q) => $q->where('name', 'like', "%{$query}%")->orWhere('email', 'like', "%{$query}%"))
            ->orWhere('phone', 'like', "%{$query}%")
            ->limit(5)
            ->get();

        foreach ($teachers as $t) {
            $results[] = [
                'type' => 'teacher',
                'label' => $t->user->name ?? 'Giảng viên',
                'sub' => $t->user->email ?? '',
                'icon' => 'supervisor_account',
                'url' => route('admin.teachers.show', $t->id),
            ];
        }

        // Tìm học phần
        $subjects = Subject::where('name', 'like', "%{$query}%")
            ->orWhere('code', 'like', "%{$query}%")
            ->limit(5)
            ->get();

        foreach ($subjects as $sub) {
            $results[] = [
                'type' => 'subject',
                'label' => $sub->name,
                'sub' => $sub->code . ' • ' . ($sub->credits ?? $sub->credit ?? '?') . ' TC',
                'icon' => 'menu_book',
                'url' => route('admin.subjects.show', $sub->id),
            ];
        }

        // Tìm lớp học
        $classes = SchoolClass::where('name', 'like', "%{$query}%")
            ->limit(5)
            ->get();

        foreach ($classes as $cl) {
            $results[] = [
                'type' => 'class',
                'label' => $cl->name,
                'sub' => $cl->description ?? 'Lớp sinh viên',
                'icon' => 'class',
                'url' => route('admin.classes.show', $cl->id),
            ];
        }

        return response()->json(['results' => $results]);
    }
}
