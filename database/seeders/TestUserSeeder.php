<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Carbon\Carbon;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Xóa dữ liệu cũ (để test không bị trùng lặp)
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        DB::table('scores')->truncate();
        DB::table('enrollments')->truncate();
        DB::table('subjects')->truncate();
        DB::table('students')->truncate();
        DB::table('teachers')->truncate();
        DB::table('users')->truncate();
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');

        $password = Hash::make('123456');
        $now = Carbon::now();

        // 1. Tạo 1 tài khoản Admin
        DB::table('users')->insert([
            'name' => 'Quản Trị Viên',
            'email' => 'admin@example.com',
            'password' => $password,
            'role_id' => 1,
            'created_at' => $now, 'updated_at' => $now
        ]);

        // 2. Tạo 1 tài khoản Giảng viên
        $teacherUserId = DB::table('users')->insertGetId([
            'name' => 'ThS. Nguyễn Văn Giảng Viên',
            'email' => 'teacher@example.com',
            'password' => $password,
            'role_id' => 2,
            'created_at' => $now, 'updated_at' => $now
        ]);
        
        $teacherId = DB::table('teachers')->insertGetId([
            'user_id' => $teacherUserId,
            'teacher_code' => 'GV001',
            'department' => 'Khoa Công nghệ Thông tin',
            'created_at' => $now, 'updated_at' => $now
        ]);

        // 3. Tạo 1 tài khoản Sinh viên
        $studentUserId = DB::table('users')->insertGetId([
            'name' => 'Trần Sinh Viên Test',
            'email' => 'student@example.com',
            'password' => $password,
            'role_id' => 3,
            'created_at' => $now, 'updated_at' => $now
        ]);

        $studentId = DB::table('students')->insertGetId([
            'user_id' => $studentUserId,
            'student_code' => 'SV2026001',
            'class_id' => null, // Tạm thời để null nếu bạn chưa có bảng classes
            'created_at' => $now, 'updated_at' => $now
        ]);

        // 4. Tạo 3 Môn học (Subjects)
        $subjects = [
            ['name' => 'Lập trình Web với Laravel', 'credits' => 3, 'code' => 'WEB101'],
            ['name' => 'Cơ sở dữ liệu MySQL', 'credits' => 3, 'code' => 'DB201'],
            ['name' => 'Cấu trúc dữ liệu & Giải thuật', 'credits' => 4, 'code' => 'DSA301'],
        ];
        
        $subjectIds = [];
        foreach ($subjects as $sub) {
            $subjectIds[] = DB::table('subjects')->insertGetId([
                'name' => $sub['name'],
                'credits' => $sub['credits'],
                'subject_code' => $sub['code'],
                'created_at' => $now, 'updated_at' => $now
            ]);
        }

        // 5. Đăng ký môn học (Enrollments) & Cho điểm luôn (Scores)
        $scoresData = [
            ['att' => 9.0, 'mid' => 8.5, 'fin' => 8.0], // Môn 1: Giỏi
            ['att' => 8.0, 'mid' => 6.0, 'fin' => 5.5], // Môn 2: Trung bình
            ['att' => 10.0, 'mid' => 4.0, 'fin' => 3.0], // Môn 3: Trượt (Để test màu đỏ)
        ];

        foreach ($subjectIds as $index => $subId) {
            $enrollmentId = DB::table('enrollments')->insertGetId([
                'student_id' => $studentId,
                'subject_id' => $subId,
                'teacher_id' => $teacherId,
                'semester' => 'Học kỳ 1 - 2026',
                'created_at' => $now, 'updated_at' => $now
            ]);

            DB::table('scores')->insert([
                'enrollment_id' => $enrollmentId,
                'attendance_score' => $scoresData[$index]['att'],
                'midterm_score' => $scoresData[$index]['mid'],
                'final_score' => $scoresData[$index]['fin'],
                'created_at' => $now, 'updated_at' => $now
            ]);
        }
    }
}