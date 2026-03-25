<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Schedule;
use Carbon\Carbon;

class ScheduleSeeder extends Seeder
{
    public function run()
    {
        $startOfWeek = Carbon::now()->startOfWeek(); // Lấy ngày Thứ 2 tuần này

        $schedules = [
            [
                'subject_id' => 1, // Đảm bảo bạn có môn học ID 1 trong DB
                'day_of_week' => 'Thứ 2',
                'study_date' => $startOfWeek->copy()->format('Y-m-d'),
                'start_time' => '07:00:00',
                'end_time' => '09:30:00',
                'room' => 'Phòng 301 - Tòa A',
                'type' => 'Lý thuyết',
                'instructor' => 'Giảng viên Nguyễn Văn A',
                'color_theme' => 'blue',
            ],
            [
                'subject_id' => 2, // Đảm bảo bạn có môn học ID 2
                'day_of_week' => 'Thứ 3',
                'study_date' => $startOfWeek->copy()->addDays(1)->format('Y-m-d'),
                'start_time' => '09:45:00',
                'end_time' => '12:15:00',
                'room' => 'Phòng Máy 2 - Tòa B',
                'type' => 'Thực hành',
                'instructor' => 'Giảng viên Trần Thị B',
                'color_theme' => 'emerald',
            ],
            [
                'subject_id' => 3, // Đảm bảo bạn có môn học ID 3
                'day_of_week' => 'Thứ 5',
                'study_date' => $startOfWeek->copy()->addDays(3)->format('Y-m-d'),
                'start_time' => '13:00:00',
                'end_time' => '15:30:00',
                'room' => 'Phòng 105 - Tòa C',
                'type' => 'Lý thuyết',
                'instructor' => 'Giảng viên Lê Văn C',
                'color_theme' => 'purple',
            ],
        ];

        foreach ($schedules as $schedule) {
            Schedule::create($schedule);
        }
    }
}