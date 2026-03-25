<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Assignment;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AssignmentController extends Controller
{
    public function index(Request $request)
    {
        $assignments = Assignment::with(['subject', 'teacher.user'])
            ->when($request->search, function($q, $s) {
                $q->where('title', 'like', "%{$s}%")
                  ->orWhereHas('subject', function($sq) use ($s) {
                      $sq->where('name', 'like', "%{$s}%");
                  });
            })
            ->latest()
            ->paginate(50)
            ->withQueryString();

        return Inertia::render('Admin/Assignments/Index', [
            'assignments' => $assignments,
            'filters' => $request->only(['search'])
        ]);
    }

    public function destroy($id)
    {
        $assignment = Assignment::findOrFail($id);
        $assignment->delete();
        return back()->with('success', 'Đã xóa bài tập thành công!');
    }
}
