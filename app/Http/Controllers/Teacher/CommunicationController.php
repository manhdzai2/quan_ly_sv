<?php

namespace App\Http\Controllers\Teacher;

use App\Http\Controllers\Controller;
use App\Models\Announcement;
use App\Models\LeaveRequest;
use App\Models\Enrollment;
use App\Models\Attendance;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CommunicationController extends Controller
{
    // ═══════════════════════════════════
    // THÔNG BÁO LỚP HỌC
    // ═══════════════════════════════════
    public function announcements(Request $request)
    {
        $teacher = $request->user()->teacher;
        if (!$teacher) return redirect()->route('teacher.dashboard');

        $subjectIds = Enrollment::where('teacher_id', $teacher->id)
            ->pluck('subject_id')->unique()->toArray();

        $announcements = Announcement::where('teacher_id', $teacher->id)
            ->with('subject')
            ->latest()
            ->get()
            ->map(fn($a) => [
                'id' => $a->id,
                'title' => $a->title,
                'content' => $a->content,
                'subject_name' => $a->subject->name ?? 'Toàn hệ thống',
                'priority' => $a->priority,
                'is_pinned' => $a->is_pinned,
                'created_at' => $a->created_at->format('d/m/Y H:i'),
            ]);

        $subjects = \App\Models\Subject::whereIn('id', $subjectIds)->get(['id', 'name', 'code']);

        return Inertia::render('Teacher/Communication/Announcements', [
            'announcements' => $announcements,
            'subjects' => $subjects,
        ]);
    }

    public function storeAnnouncement(Request $request)
    {
        $teacher = $request->user()->teacher;

        $validated = $request->validate([
            'subject_id' => 'nullable|exists:subjects,id',
            'title' => 'required|string|max:255',
            'content' => 'required|string|max:5000',
            'priority' => 'required|in:normal,important,urgent',
        ]);

        Announcement::create([
            'teacher_id' => $teacher->id,
            'subject_id' => $validated['subject_id'] ?: null,
            'title' => $validated['title'],
            'content' => $validated['content'],
            'priority' => $validated['priority'],
        ]);

        return back()->with('success', 'Đã đăng thông báo!');
    }

    public function destroyAnnouncement($id)
    {
        Announcement::findOrFail($id)->delete();
        return back()->with('success', 'Đã xóa thông báo!');
    }

    // ═══════════════════════════════════
    // ĐƠN XIN NGHỈ HỌC
    // ═══════════════════════════════════
    public function leaveRequests(Request $request)
    {
        $teacher = $request->user()->teacher;
        if (!$teacher) return redirect()->route('teacher.dashboard');

        $requests = LeaveRequest::where('teacher_id', $teacher->id)
            ->with(['student.user', 'subject'])
            ->latest()
            ->get()
            ->map(fn($r) => [
                'id' => $r->id,
                'student_name' => $r->student->user->name ?? 'N/A',
                'student_code' => $r->student->student_code ?? '',
                'subject_name' => $r->subject->name ?? '',
                'leave_date' => $r->leave_date->format('d/m/Y'),
                'reason' => $r->reason,
                'status' => $r->status,
                'teacher_note' => $r->teacher_note,
                'created_at' => $r->created_at->format('d/m/Y H:i'),
            ]);

        return Inertia::render('Teacher/Communication/LeaveRequests', [
            'leaveRequests' => $requests,
        ]);
    }

    public function updateLeaveRequest(Request $request, $id)
    {
        $validated = $request->validate([
            'status' => 'required|in:approved,rejected',
            'teacher_note' => 'nullable|string|max:500',
        ]);

        $leaveRequest = LeaveRequest::findOrFail($id);
        $leaveRequest->update([
            'status' => $validated['status'],
            'teacher_note' => $validated['teacher_note'] ?? null,
        ]);

        // PHỤC HỒI ĐIỂM DANH (Nếu được phê duyệt)
        if ($validated['status'] === 'approved') {
            $enrollment = Enrollment::where('student_id', $leaveRequest->student_id)
                ->where('subject_id', $leaveRequest->subject_id)
                ->first();

            if ($enrollment) {
                Attendance::updateOrCreate(
                    [
                        'enrollment_id' => $enrollment->id,
                        'date'          => $leaveRequest->leave_date->format('Y-m-d'),
                    ],
                    [
                        'status' => 'absent_excused',
                        'note'   => "Đã phục hồi từ đơn xin nghỉ (ID: {$leaveRequest->id})"
                    ]
                );
            }
        }

        $statusText = $validated['status'] === 'approved' ? 'phê duyệt' : 'từ chối';
        return back()->with('success', "Đã {$statusText} đơn xin nghỉ!");
    }
}
