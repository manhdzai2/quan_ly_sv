<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Student;
use App\Models\TuitionFee;

/**
 * Seeder chuyên dụng: Bổ sung học phí cho TẤT CẢ sinh viên chưa có.
 */
class TuitionFeeSeeder extends Seeder
{
    public function run(): void
    {
        $students = Student::all();
        $semesters = [
            ['name' => 'HK1 - 2024/2025', 'deadline' => '2024-09-30'],
            ['name' => 'HK2 - 2024/2025', 'deadline' => '2025-02-28'],
            ['name' => 'HK1 - 2025/2026', 'deadline' => '2025-09-30'],
        ];

        $created = 0;
        foreach ($students as $student) {
            foreach ($semesters as $sem) {
                $exists = TuitionFee::where('student_id', $student->id)
                    ->where('semester', $sem['name'])
                    ->exists();
                if ($exists) continue;

                $total = round(mt_rand(7500000, 12000000) / 100000) * 100000;
                $rand  = mt_rand(1, 100);
                $paid  = $rand <= 60 ? $total : ($rand <= 80 ? $total / 2 : 0);

                TuitionFee::create([
                    'student_id'   => $student->id,
                    'semester'     => $sem['name'],
                    'total_amount' => $total,
                    'paid_amount'  => $paid,
                    'deadline'     => $sem['deadline'],
                ]);
                $created++;
            }
        }

        $this->command->info("✅ Đã tạo {$created} bản ghi học phí cho " . $students->count() . " sinh viên.");
    }
}
