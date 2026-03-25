<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Teacher;
use App\Models\Student;
use App\Models\Subject;
use App\Models\Enrollment;
use App\Models\Score;
use Illuminate\Support\Facades\Hash;

class TestDataSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Tìm hoặc tạo tài khoản Teacher (dùng tài khoản bạn đang đăng nhập)
        $teacherUser = User::firstOrCreate(
            ['email' => 'teacher@example.com'], // Đổi lại email nếu bạn đang dùng email khác
            [
                'name' => 'Giảng viên Test',
                'password' => Hash::make('password'), // Mật khẩu là: password
                'role_id' => 2, // Role 2 là Teacher
            ]
        );

        $teacher = Teacher::firstOrCreate(['user_id' => $teacherUser->id]);

        // 2. Tạo một vài Môn học (Subjects)
        $subjects = [
            Subject::firstOrCreate(['name' => 'Lập trình Web với Laravel', 'credit' => 3]),
            Subject::firstOrCreate(['name' => 'Phát triển Frontend với ReactJS', 'credit' => 4]),
            Subject::firstOrCreate(['name' => 'Cơ sở dữ liệu nâng cao', 'credit' => 3]),
        ];

        // 3. Tạo 10 Sinh viên test (Students)
        $students = [];
        for ($i = 1; $i <= 10; $i++) {
            $studentUser = User::firstOrCreate(
                ['email' => "student{$i}@example.com"],
                [
                    'name' => "Sinh viên số {$i}",
                    'password' => Hash::make('password'),
                    'role_id' => 3, // Role 3 là Student
                ]
            );

            $students[] = Student::firstOrCreate(
                ['user_id' => $studentUser->id],
                ['student_code' => "SV2024" . str_pad($i, 3, '0', STR_PAD_LEFT)] // Tạo mã: SV2024001...
            );
        }

        // 4. Phân công sinh viên vào các lớp của Giảng viên này (Enrollments)
        foreach ($subjects as $index => $subject) {
            // Lớp 1 có 10 SV, Lớp 2 có 7 SV, Lớp 3 có 5 SV để dữ liệu nhìn tự nhiên
            $studentCount = $index === 0 ? 10 : ($index === 1 ? 7 : 5); 
            
            for ($j = 0; $j < $studentCount; $j++) {
                $enrollment = Enrollment::firstOrCreate([
                    'teacher_id' => $teacher->id,
                    'subject_id' => $subject->id,
                    'student_id' => $students[$j]->id,
                ]);

                // 5. Thêm sẵn một vài điểm ngẫu nhiên cho lớp đầu tiên để test giao diện
                if ($index === 0 && $j < 5) {
                    Score::firstOrCreate(
                        ['enrollment_id' => $enrollment->id],
                        [
                            'attendance_score' => rand(7, 10),
                            'midterm_score' => rand(5, 9),
                            // Để trống điểm cuối kỳ để test chức năng nhập điểm
                        ]
                    );
                }
            }
        }

        $this->command->info('Đã tạo thành công dữ liệu Test: Môn học, Sinh viên và Lớp học!');
    }
}