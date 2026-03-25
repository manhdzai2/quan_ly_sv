<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\Student;
use App\Models\SchoolClass;
use App\Models\Schedule;
use App\Models\Enrollment;
use Carbon\Carbon;

// Find ALL students who have enrollments
$students = Student::whereHas('enrollments')->get();

if ($students->count() > 0) {
    
    $class = SchoolClass::firstOrCreate(
        ['name' => 'K62-CNTT-01'],
        ['description' => 'Lớp chất lượng cao Kỹ sư Phần mềm']
    );

    foreach ($students as $student) {
        echo "Processing student ID: " . $student->id . "\n";
        
        $student->class_id = $class->id;
        $student->dob = '2004-05-15';
        $student->gender = 'male';
        $student->phone = '0987.654.321';
        $student->address = 'Tòa nhà Viettel, Quận Cầu Giấy, Hà Nội';
        $student->save();
        echo "  - Info updated.\n";

        $enrollments = $student->enrollments;
        
        $subjectIds = $enrollments->pluck('subject_id')->toArray();
        if (class_exists(Schedule::class)) {
            Schedule::whereIn('subject_id', $subjectIds)->delete();

            $days = ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6'];
            $colors = ['indigo', 'emerald', 'blue', 'orange', 'purple'];
            
            foreach($enrollments as $idx => $enr) {
                $day = $days[$idx % count($days)];
                $color = $colors[$idx % count($colors)];
                
                Schedule::create([
                    'subject_id' => $enr->subject_id,
                    'day_of_week' => $day,
                    'study_date' => Carbon::now()->startOfWeek()->addDays($idx)->format('Y-m-d'),
                    'start_time' => '07:30:00',
                    'end_time' => '11:00:00',
                    'room' => 'P. 30' . rand(1, 9) . '-A4',
                    'type' => 'Lý thuyết',
                    'instructor' => 'Giảng viên Nguyễn Văn ' . chr(65 + $idx),
                    'color_theme' => $color
                ]);
            }
            echo "  - Seeded " . $enrollments->count() . " schedules.\n";
        }
    }
} else {
    echo "No students with enrollments found in DB.\n";
}
echo "Seeding completed!\n";
