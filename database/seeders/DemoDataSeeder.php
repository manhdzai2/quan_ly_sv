<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class DemoDataSeeder extends Seeder
{
    public function run(): void
    {
        $now = Carbon::now();

        // 1. Tìm đúng tài khoản Sinh viên "Student Demo" (Mã SV001) của bạn
        $student = DB::table('students')->where('student_code', 'SV001')->first();

        if (!$student) {
            echo "⚠️ Không tìm thấy Sinh viên có mã SV001. Bạn hãy kiểm tra lại TestUserSeeder nhé.\n";
            return;
        }

        // Lấy đại 1 Giảng viên có sẵn trong DB (nếu có)
        $teacher = DB::table('teachers')->first();
        $teacherId = $teacher ? $teacher->id : null;

        // 2. Tạo 3 Môn học
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
                'subject_code' => $sub['code'], // Hoặc đổi thành 'code' nếu DB bạn tên vậy
                'created_at' => $now, 'updated_at' => $now
            ]);
        }

        // 3. Đăng ký môn học & Nhập điểm (Đã bỏ cột 'semester')
        $scoresData = [
            ['att' => 9.0, 'mid' => 8.5, 'fin' => 8.0], // Môn 1: Giỏi (A)
            ['att' => 8.0, 'mid' => 6.0, 'fin' => 5.5], // Môn 2: Trung bình (C)
            ['att' => 10.0, 'mid' => 4.0, 'fin' => 3.0], // Môn 3: Trượt (F)
        ];

        foreach ($subjectIds as $index => $subId) {
            $enrollmentId = DB::table('enrollments')->insertGetId([
                'student_id' => $student->id,
                'subject_id' => $subId,
                'teacher_id' => $teacherId,
                // Không gọi cột semester nữa để tránh lỗi SQL
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

        echo "✅ Đã bơm dữ liệu môn học và điểm cho SV001 thành công!\n";
    }
}