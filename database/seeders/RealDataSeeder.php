<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use App\Models\Student;
use App\Models\SchoolClass;
use App\Models\Subject;
use App\Models\Teacher;
use App\Models\Enrollment;
use App\Models\Score;
use App\Models\Attendance;
use App\Models\TuitionFee;
use Faker\Factory as Faker;
use Illuminate\Support\Str;

class RealDataSeeder extends Seeder
{
    public function run(): void
    {
        $faker = Faker::create('vi_VN');
        $classes = SchoolClass::all();
        $subjects = Subject::all();
        $teachers = Teacher::all();

        if ($classes->isEmpty() || $subjects->isEmpty() || $teachers->isEmpty()) {
            $this->command->error('Vui lòng chạy DatabaseSeeder trước để có dữ liệu cơ sở (Classes, Subjects, Teachers).');
            return;
        }

        $surnames = ['Nguyễn', 'Trần', 'Lê', 'Phạm', 'Hoàng', 'Phan', 'Vũ', 'Đặng', 'Bùi', 'Đỗ', 'Hồ', 'Ngô', 'Dương', 'Lý'];
        $middleNamesMale = ['Văn', 'Hữu', 'Đức', 'Minh', 'Quang', 'Anh', 'Mạnh', 'Tuấn', 'Tùng'];
        $middleNamesFemale = ['Thị', 'Ngọc', 'Bích', 'Thu', 'Hồng', 'Minh', 'Thanh', 'Diệu'];
        $firstNamesMale = ['An', 'Bình', 'Cường', 'Dũng', 'Đông', 'Giang', 'Hùng', 'Huy', 'Khải', 'Long', 'Minh', 'Nam', 'Phúc', 'Quân', 'Sơn', 'Thắng', 'Tiến', 'Trung', 'Tuấn', 'Việt'];
        $firstNamesFemale = ['Anh', 'Bích', 'Chi', 'Diệp', 'Đào', 'Hà', 'Hoa', 'Hương', 'Lan', 'Linh', 'Mai', 'Ngọc', 'Nhi', 'Oanh', 'Phương', 'Quỳnh', 'Thảo', 'Trang', 'Vân', 'Yến'];

        $countCreated = 0;
        $studentCodeIndex = 100;

        foreach ($classes as $class) {
            $currentCount = Student::where('class_id', $class->id)->count();
            $needed = 30 - $currentCount;

            if ($needed <= 0) {
                continue;
            }

            $this->command->info("Đang tạo thêm {$needed} sinh viên cho lớp {$class->name}...");

            for ($i = 0; $i < $needed; $i++) {
                $isMale = $faker->boolean(60);
                $surname = $faker->randomElement($surnames);
                $middleName = $isMale ? $faker->randomElement($middleNamesMale) : $faker->randomElement($middleNamesFemale);
                $firstName = $isMale ? $faker->randomElement($firstNamesMale) : $faker->randomElement($firstNamesFemale);
                
                $fullName = "{$surname} {$middleName} {$firstName}";
                $emailName = Str::slug($firstName . '.' . $surname . '.' . rand(100, 999));
                $email = "{$emailName}@sv.fbu.edu.vn";

                $user = User::create([
                    'name' => $fullName,
                    'email' => $email,
                    'password' => Hash::make('password'),
                    'role_id' => 3,
                ]);

                $studentCode = "SV2024" . str_pad($studentCodeIndex++, 3, '0', STR_PAD_LEFT);
                $student = Student::create([
                    'user_id' => $user->id,
                    'student_code' => $studentCode,
                    'class_id' => $class->id,
                    'dob' => $faker->date('Y-m-d', '2006-12-31'),
                    'gender' => $isMale ? 'male' : 'female',
                    'phone' => '09' . rand(10000000, 99999999),
                    'address' => $faker->address,
                ]);

                // Tạo học phí cho 3 học kỳ
                $semesters = [
                    ['name' => 'HK1 - 2024/2025', 'deadline' => '2024-09-30'],
                    ['name' => 'HK2 - 2024/2025', 'deadline' => '2025-02-28'],
                    ['name' => 'HK1 - 2025/2026', 'deadline' => '2025-09-30'],
                ];
                foreach ($semesters as $sem) {
                    $total = round(mt_rand(7500000, 12000000) / 100000) * 100000;
                    $randPaid = mt_rand(1, 100);
                    $paid = $randPaid <= 60 ? $total : ($randPaid <= 80 ? $total / 2 : 0);
                    TuitionFee::create([
                        'student_id'   => $student->id,
                        'semester'     => $sem['name'],
                        'total_amount' => $total,
                        'paid_amount'  => $paid,
                        'deadline'     => $sem['deadline'],
                    ]);
                }

                $randomSubjects = $subjects->random(rand(4, 6));
                foreach ($randomSubjects as $subject) {
                    $teacher = $teachers->random();
                    
                    $enrollment = Enrollment::create([
                        'student_id' => $student->id,
                        'subject_id' => $subject->id,
                        'teacher_id' => $teacher->id,
                    ]);

                    // 1. Tạo 15 buổi điểm danh
                    $unexcusedCount = 0;
                    for ($d = 1; $d <= 15; $d++) {
                        $date = now()->subDays($d);
                        $rand = mt_rand(1, 100);
                        
                        if ($rand <= 80) $status = 'present';
                        elseif ($rand <= 88) $status = 'late';
                        elseif ($rand <= 94) $status = 'absent_excused';
                        else {
                            $status = 'absent_unexcused';
                            $unexcusedCount++;
                        }

                        Attendance::create([
                            'enrollment_id' => $enrollment->id,
                            'date' => $date->format('Y-m-d'),
                            'status' => $status,
                            'note' => $status === 'absent_excused' ? 'Có phép' : null
                        ]);
                    }

                    $isDisqualified = $unexcusedCount > 3;

                    // 2. Điểm số
                    $dist = mt_rand(1, 100);
                    if ($dist <= 15) { // Giỏi
                        $base = 8.5; $range = 1.4;
                    } elseif ($dist <= 50) { // Khá
                        $base = 7.0; $range = 1.4;
                    } elseif ($dist <= 85) { // Trung bình
                        $base = 5.0; $range = 1.9;
                    } else { // Yếu
                        $base = 2.0; $range = 2.9;
                    }

                    $att_score = round(mt_rand(70, 100) / 10, 1);
                    $reg_score = round(($base + (mt_rand(0, 100) / 100 * $range)), 1);
                    $test_score = round(($base + (mt_rand(0, 100) / 100 * $range)), 1);
                    $mid_score = round(($base + (mt_rand(0, 100) / 100 * $range)), 1);
                    $fin_score = round(($base + (mt_rand(0, 100) / 100 * $range)), 1);

                    Score::create([
                        'enrollment_id' => $enrollment->id,
                        'attendance_score' => $att_score,
                        'regular_score' => $reg_score,
                        'test_score' => $test_score,
                        'midterm_score' => $mid_score,
                        'final_score' => $fin_score,
                        'is_disqualified' => $isDisqualified,
                    ]);
                }
                $countCreated++;
            }
        }

        $this->command->info("Thành công! Đã tạo {$countCreated} sinh viên.");
    }
}
