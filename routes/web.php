<?php

use App\Http\Controllers\ProfileController; // Của Breeze
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Khai báo các Controllers của Admin
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\SubjectController;
use App\Http\Controllers\Admin\ClassController;
use App\Http\Controllers\Admin\StudentController;
use App\Http\Controllers\Admin\TeacherController;
use App\Http\Controllers\Admin\ClassroomController;
use App\Http\Controllers\Admin\ScoreController;

// Khai báo Controller của Teacher
use App\Http\Controllers\Teacher\EnrollmentController;

// Khai báo Controller của Student
use App\Http\Controllers\Student\ProfileController as StudentProfileController;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
*/

// 1. TRANG CHỦ
Route::get('/', function () {
    return redirect()->route('login');
});

// 2. DASHBOARD CHUNG (Người điều phối giao thông)
Route::get('/dashboard', function () {
    $user = auth()->user();

    // Ép kiểu role_id về số nguyên để tránh lỗi so sánh sai kiểu dữ liệu
    $roleId = (int) $user->role_id;

    // Phân luồng dựa theo role_id (1: Admin, 2: Teacher, 3: Student)
    if ($roleId === 1) {
        return redirect()->route('admin.dashboard');
    } elseif ($roleId === 2) {
        return redirect()->route('teacher.dashboard');
    } elseif ($roleId === 3) {
        return redirect()->route('student.dashboard');
    }

    // Nếu không thuộc role nào ở trên thì cho vào trang mặc định
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

// 3. NHÓM ROUTE YÊU CẦU ĐĂNG NHẬP (Cài đặt tài khoản chung)
Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // Global Search API
    Route::get('/search', [\App\Http\Controllers\SearchController::class, 'search'])->name('global.search');
});

// 4. NHÓM ROUTE DÀNH RIÊNG CHO ADMIN
Route::middleware(['auth', 'ensure.admin'])
    ->prefix('admin')
    ->name('admin.')
    ->group(function () {
        Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
        Route::resource('subjects', SubjectController::class);
        Route::resource('classes', ClassController::class);
        Route::resource('students', StudentController::class);
        Route::resource('teachers', TeacherController::class);
        Route::resource('classrooms', ClassroomController::class);
        Route::resource('scores', ScoreController::class)->only(['index']);
        Route::resource('materials', \App\Http\Controllers\Admin\MaterialController::class)->only(['index', 'destroy']);
        Route::resource('assignments', \App\Http\Controllers\Admin\AssignmentController::class)->only(['index', 'destroy']);
    });

// 5. NHÓM ROUTE DÀNH CHO TEACHER
Route::middleware(['auth'])->prefix('teacher')->name('teacher.')->group(function () {
    Route::get('/dashboard', [\App\Http\Controllers\Teacher\TeacherDashboardController::class, 'index'])->name('dashboard');
    Route::get('/enrollments', [EnrollmentController::class, 'index'])->name('enrollments.index');
    Route::get('/enrollments/{subject_id}/{semester}', [EnrollmentController::class, 'show'])->name('enrollments.show');
    Route::post('/enrollments/update-score', [EnrollmentController::class, 'updateScore'])->name('enrollments.update-score');
    Route::get('/attendance', [\App\Http\Controllers\Teacher\AttendanceController::class, 'index'])->name('attendance.index');
    Route::post('/attendance', [\App\Http\Controllers\Teacher\AttendanceController::class, 'store'])->name('attendance.store');
    Route::post('/attendance/mark-all-present', [\App\Http\Controllers\Teacher\AttendanceController::class, 'markAllPresent'])->name('attendance.mark-all-present');
    Route::get('/students/{id}', [EnrollmentController::class, 'studentProfile'])->name('students.profile');
    Route::get('/materials', [\App\Http\Controllers\Teacher\MaterialController::class, 'index'])->name('materials.index');
    Route::post('/materials', [\App\Http\Controllers\Teacher\MaterialController::class, 'store'])->name('materials.store');
    Route::delete('/materials/{id}', [\App\Http\Controllers\Teacher\MaterialController::class, 'destroy'])->name('materials.destroy');
    Route::get('/assignments', [\App\Http\Controllers\Teacher\AssignmentController::class, 'index'])->name('assignments.index');
    Route::post('/assignments', [\App\Http\Controllers\Teacher\AssignmentController::class, 'store'])->name('assignments.store');
    Route::get('/assignments/{id}', [\App\Http\Controllers\Teacher\AssignmentController::class, 'show'])->name('assignments.show');
    Route::post('/assignments/grade', [\App\Http\Controllers\Teacher\AssignmentController::class, 'gradeSubmission'])->name('assignments.grade');
    Route::delete('/assignments/{id}', [\App\Http\Controllers\Teacher\AssignmentController::class, 'destroy'])->name('assignments.destroy');
    Route::get('/analytics', [\App\Http\Controllers\Teacher\GradeAnalyticsController::class, 'index'])->name('analytics.index');
    Route::get('/announcements', [\App\Http\Controllers\Teacher\CommunicationController::class, 'announcements'])->name('announcements.index');
    Route::post('/announcements', [\App\Http\Controllers\Teacher\CommunicationController::class, 'storeAnnouncement'])->name('announcements.store');
    Route::delete('/announcements/{id}', [\App\Http\Controllers\Teacher\CommunicationController::class, 'destroyAnnouncement'])->name('announcements.destroy');
    Route::get('/leave-requests', [\App\Http\Controllers\Teacher\CommunicationController::class, 'leaveRequests'])->name('leave-requests.index');
    Route::put('/leave-requests/{id}', [\App\Http\Controllers\Teacher\CommunicationController::class, 'updateLeaveRequest'])->name('leave-requests.update');
});

// 6. NHÓM ROUTE DÀNH CHO STUDENT
Route::middleware(['auth'])->prefix('student')->name('student.')->group(function () {
    Route::get('/dashboard', [\App\Http\Controllers\Student\StudentDashboardController::class, 'index'])->name('dashboard');
    Route::get('/profile', [StudentProfileController::class, 'index'])->name('profile');
    Route::get('/schedule', [StudentProfileController::class, 'schedule'])->name('schedule');
    Route::get('/support', [StudentProfileController::class, 'support'])->name('support');
    Route::get('/attendance', [\App\Http\Controllers\Student\StudentAttendanceController::class, 'index'])->name('attendance.index');
    Route::post('/attendance/leave', [\App\Http\Controllers\Student\StudentAttendanceController::class, 'requestLeave'])->name('attendance.leave');
    Route::get('/materials', [\App\Http\Controllers\Student\StudentMaterialController::class, 'index'])->name('materials.index');
    Route::get('/materials/{id}/download', [\App\Http\Controllers\Student\StudentMaterialController::class, 'download'])->name('materials.download');
    Route::get('/assignments', [\App\Http\Controllers\Student\StudentAssignmentController::class, 'index'])->name('assignments.index');
    Route::post('/assignments/{id}/submit', [\App\Http\Controllers\Student\StudentAssignmentController::class, 'submit'])->name('assignments.submit');
    Route::get('/grades', [\App\Http\Controllers\Student\StudentGradeController::class, 'index'])->name('grades.index');
    Route::get('/services', [\App\Http\Controllers\Student\StudentServiceController::class, 'index'])->name('services.index');
    Route::post('/services/request', [\App\Http\Controllers\Student\StudentServiceController::class, 'requestService'])->name('services.request');
});

// 7. CÁC ROUTE AUTH (Breeze)
require __DIR__.'/auth.php';