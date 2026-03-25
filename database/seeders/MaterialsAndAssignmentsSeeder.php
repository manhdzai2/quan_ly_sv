<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Subject;
use App\Models\Teacher;
use App\Models\Material;
use App\Models\Assignment;
use Carbon\Carbon;

class MaterialsAndAssignmentsSeeder extends Seeder
{
    public function run(): void
    {
        $subjects = Subject::all();
        $teachers = Teacher::all();

        if ($subjects->isEmpty() || $teachers->isEmpty()) {
            return;
        }

        foreach ($subjects as $subject) {
            $teacher = $teachers->random();

            // 1. Materials
            for ($i = 1; $i <= rand(2, 4); $i++) {
                Material::create([
                    'subject_id' => $subject->id,
                    'teacher_id' => $teacher->id,
                    'title' => "Tài liệu học tập: " . $subject->name . " - Phần " . $i,
                    'description' => "Nội dung bài giảng chi tiết cho môn " . $subject->name . ". Sinh viên cần tải về nghiên cứu.",
                    'file_path' => "materials/sample_" . rand(1, 10) . ".pdf",
                    'file_name' => "Tai_lieu_" . $subject->code . "_P" . $i . ".pdf",
                    'type' => ['slide', 'pdf', 'video', 'document', 'other'][rand(0, 4)],
                ]);
            }

            // 2. Assignments
            for ($j = 1; $j <= rand(1, 2); $j++) {
                Assignment::create([
                    'subject_id' => $subject->id,
                    'teacher_id' => $teacher->id,
                    'title' => "Bài tập thực hành " . $j . ": " . $subject->name,
                    'description' => "Yêu cầu thực hiện các bài tập trong chương " . $j . " và nộp lại file báo cáo (PDF/DOCX).",
                    'deadline' => Carbon::now()->addDays(rand(5, 20))->setHour(23)->setMinute(59),
                    'max_score' => 10,
                ]);
            }
        }
    }
}
