<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use App\Models\Teacher;
use App\Models\Subject;
use App\Models\Enrollment;
use Faker\Factory as Faker;
use Illuminate\Support\Str;

class TeacherDataSeeder extends Seeder
{
    public function run(): void
    {
        $faker = Faker::create('vi_VN');
        $subjects = Subject::all();

        $titles = ['PGS.TS', 'TS', 'ThS', 'ThS', 'TS'];
        $surnames = ['Nguyễn', 'Trần', 'Lê', 'Phạm', 'Hoàng', 'Phan', 'Vũ', 'Đặng', 'Bùi', 'Đỗ', 'Hồ', 'Ngô'];
        $middleNames = ['Văn', 'Thị', 'Đức', 'Quang', 'Hồng', 'Minh', 'Anh', 'Thanh', 'Hữu'];
        $lastNames = ['Hương', 'Minh', 'Tùng', 'Anh', 'Lan', 'Sơn', 'Quân', 'Phương', 'Linh', 'Dũng', 'Tiến', 'Hà'];

        $this->command->info('Đang tạo thêm 11 giảng viên mới...');

        for ($i = 0; $i < 11; $i++) {
            $title = $faker->randomElement($titles);
            $surname = $faker->randomElement($surnames);
            $middle = $faker->randomElement($middleNames);
            $last = $faker->randomElement($lastNames);
            
            $fullName = "{$title} {$surname} {$middle} {$last}";
            $email = Str::slug($surname . '.' . $last . '.' . rand(10, 99)) . '@fbu.edu.vn';

            $user = User::create([
                'name' => $fullName,
                'email' => $email,
                'password' => Hash::make('password'),
                'role_id' => 2, // Teacher
            ]);

            Teacher::create([
                'user_id' => $user->id,
                'phone' => '09' . rand(10000000, 99999999),
            ]);
        }

        $allTeachers = Teacher::all();
        $this->command->info('Tổng số giảng viên hiện có: ' . $allTeachers->count());

        // Phân phối lại môn học cho các giáo viên (mỗi giáo viên 1-3 môn)
        $this->command->info('Đang phân bổ lại môn học cho đội ngũ giảng viên...');
        
        foreach ($subjects as $subject) {
            $randomTeacher = $allTeachers->random();
            
            // Cập nhật các enrollment hiện tại của môn này sang giáo viên mới (ngẫu nhiên)
            Enrollment::where('subject_id', $subject->id)
                ->update(['teacher_id' => $randomTeacher->id]);
        }

        $this->command->info('Hoàn tất! Hệ thống đã có đội ngũ giảng viên hùng hậu.');
    }
}
