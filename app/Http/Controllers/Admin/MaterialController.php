<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Material;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MaterialController extends Controller
{
    public function index(Request $request)
    {
        $materials = Material::with(['subject', 'teacher.user'])
            ->when($request->search, function($q, $s) {
                $q->where('title', 'like', "%{$s}%")
                  ->orWhereHas('subject', function($sq) use ($s) {
                      $sq->where('name', 'like', "%{$s}%");
                  });
            })
            ->latest()
            ->paginate(50)
            ->withQueryString();

        return Inertia::render('Admin/Materials/Index', [
            'materials' => $materials,
            'filters' => $request->only(['search'])
        ]);
    }

    public function destroy($id)
    {
        $material = Material::findOrFail($id);
        $material->delete();
        return back()->with('success', 'Đã xóa học liệu thành công!');
    }
}
