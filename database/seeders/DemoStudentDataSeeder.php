<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Student;
use App\Models\Subject;
use App\Models\Teacher;
use App\Models\Enrollment;
use App\Models\Score;
use App\Models\Attendance;
use App\Models\LeaveRequest;
use App\Models\Assignment;
use App\Models\Submission;
use App\Models\TuitionFee;

class DemoStudentDataSeeder extends Seeder
{
    public function run(): void
    {
        try {
            $user = User::where('email', 'student@fbu.edu.vn')->first();
            if (!$user) {
                $this->command->error('Không tìm thấy sinh viên student@fbu.edu.vn');
                return;
            }

            $student = $user->student;
            $subjects = Subject::all();
            $teachers = Teacher::all();

            $this->command->info("Đang bổ sung dữ liệu cho sinh viên: {$user->name}");

            // 1. Đảm bảo đăng ký ít nhất 8 môn học
            $targetSubjectCount = 8;
            $currentSubjects = $student->enrollments->pluck('subject_id')->toArray();
            $notEnrolledSubjects = $subjects->whereNotIn('id', $currentSubjects);
            
            if ($notEnrolledSubjects->isNotEmpty()) {
                $neededCount = max(0, $targetSubjectCount - count($currentSubjects));
                if ($neededCount > 0) {
                    $neededSubjects = $notEnrolledSubjects->random(min($neededCount, $notEnrolledSubjects->count()));

                    foreach ($neededSubjects as $subject) {
                        Enrollment::create([
                            'student_id' => $student->id,
                            'subject_id' => $subject->id,
                            'teacher_id' => $teachers->random()->id,
                        ]);
                    }
                }
            }

            // 2. Làm giàu dữ liệu cho từng Enrollment
            $student->refresh();
            foreach ($student->enrollments as $enrollment) {
                // Đảm bảo có ít nhất 20 buổi điểm danh
                $currentAttendanceCount = Attendance::where('enrollment_id', $enrollment->id)->count();
                $neededAttendance = 20 - $currentAttendanceCount;

                for ($i = 0; $i < $neededAttendance; $i++) {
                    $date = now()->subDays($i + 1);
                    $rand = mt_rand(1, 100);
                    
                    if ($rand <= 85) $status = 'present';
                    elseif ($rand <= 92) $status = 'late';
                    elseif ($rand <= 97) $status = 'absent_excused';
                    else $status = 'absent_unexcused';

                    Attendance::create([
                        'enrollment_id' => $enrollment->id,
                        'date' => $date->format('Y-m-d'),
                        'status' => $status,
                        'note' => $status === 'absent_excused' ? 'Xin nghỉ có lý do' : null,
                    ]);
                }

                // Cập nhật/Tạo điểm số
                Score::updateOrCreate(
                    ['enrollment_id' => $enrollment->id],
                    [
                        'attendance_score' => round(mt_rand(85, 100) / 10, 1),
                        'regular_score' => round(mt_rand(75, 95) / 10, 1),
                        'test_score' => round(mt_rand(70, 90) / 10, 1),
                        'midterm_score' => round(mt_rand(75, 95) / 10, 1),
                        'final_score' => round(mt_rand(80, 100) / 10, 1),
                        'is_disqualified' => false,
                    ]
                );
            }

            // 3. Đơn xin nghỉ học
            $leaveSubjects = $student->enrollments->take(3);
            foreach ($leaveSubjects as $index => $enrollment) {
                $statuses = ['pending', 'approved', 'rejected'];
                LeaveRequest::create([
                    'student_id' => $student->id,
                    'subject_id' => $enrollment->subject_id,
                    'teacher_id' => $enrollment->teacher_id,
                    'leave_date' => now()->addDays($index + 2)->format('Y-m-d'),
                    'reason' => "Lý do xin nghỉ mẫu " . ($index + 1) . ": Em bận việc gia đình.",
                    'status' => $statuses[$index % 3],
                    'teacher_note' => $index % 3 === 1 ? 'Đã duyệt, nhớ xem bài kỹ.' : ($index % 3 === 2 ? 'Lý do không hợp lý.' : null),
                ]);
            }

            // 4. Bài tập và Nộp bài
            foreach ($student->enrollments->take(4) as $enrollment) {
                $assignment = Assignment::where('subject_id', $enrollment->subject_id)->first();
                if ($assignment) {
                    Submission::updateOrCreate(
                        ['assignment_id' => $assignment->id, 'student_id' => $student->id],
                        [
                            'submitted_at' => now()->subDays(rand(1, 5)),
                            'file_name' => "bai_tap_{$student->student_code}.pdf",
                            'is_late' => false,
                            'score' => rand(8, 10),
                            'feedback' => 'Bài làm rất tốt, trình bày sạch sẽ.',
                        ]
                    );
                }
            }

            // 5. Học phí
            $semesters = [
                ['name' => 'HK1 - 2024/2025', 'deadline' => '2024-09-30'],
                ['name' => 'HK2 - 2024/2025', 'deadline' => '2025-02-28'],
                ['name' => 'HK1 - 2025/2026', 'deadline' => '2025-09-30'],
            ];
            foreach ($semesters as $sem) {
                TuitionFee::updateOrCreate(
                    ['student_id' => $student->id, 'semester' => $sem['name']],
                    [
                        'total_amount' => 12000000,
                        'paid_amount' => 12000000,
                        'deadline' => $sem['deadline'],
                    ]
                );
            }

            $this->command->info("✅ Đã hoàn tất bổ sung dữ liệu cho sinh viên Demo.");
        } catch (\Exception $e) {
            $this->command->error("LỖI: " . $e->getMessage());
            $this->command->error("TẠI: " . $e->getFile() . ":" . $e->getLine());
        }
    }
}
