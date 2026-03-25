<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Enrollment;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ScoreController extends Controller
{
    public function index(Request $request)
    {
        $scores = Enrollment::with(['student.user', 'subject', 'teacher.user', 'score'])
            ->when($request->search, function ($query, $search) {
                $query->whereHas('student', function ($q) use ($search) {
                    $q->where('student_code', 'like', "%{$search}%")
                      ->orWhereHas('user', function ($q2) use ($search) {
                          $q2->where('name', 'like', "%{$search}%");
                      });
                })->orWhereHas('subject', function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%");
                });
            })
            ->latest()
            ->paginate(500)
            ->withQueryString();

        return Inertia::render('Admin/Scores/Index', [
            'scores' => $scores,
            'filters' => $request->only(['search'])
        ]);
    }
}
