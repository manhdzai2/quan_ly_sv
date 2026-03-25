<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use App\Models\Teacher;
use App\Models\Student;
use App\Models\Subject;
use App\Models\Enrollment;
use App\Models\Schedule;
use App\Models\Attendance;
use App\Models\Score;
use App\Models\TuitionFee;

/**
 * FullDataSeeder - Bổ sung dữ liệu đầy đủ cho hệ thống.
 *
 * Cách dùng: php artisan db:seed --class=FullDataSeeder
 *
 * Chức năng:
 *  1. Thêm giáo viên mới (tổng 10 GV), mỗi GV dạy ít nhất 2 môn, nhiều lớp.
 *  2. Cập nhật enrollment: tất cả sinh viên được gán đúng giáo viên theo môn.
 *  3. Tạo lịch học (schedules) cho từng môn học trong tuần.
 *  4. Tạo học phí (tuition_fees) cho toàn bộ sinh viên.
 */
class FullDataSeeder extends Seeder
{
    // Màu chủ đạo cho lịch học
    private const COLORS = ['blue', 'rose', 'emerald', 'amber', 'purple', 'cyan', 'orange', 'teal', 'indigo', 'pink'];

    // Ngày trong tuần
    private const DAYS = ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];

    // Phòng học
    private const ROOMS = ['Phòng 101-A1', 'Phòng 202-A1', 'Phòng 301-A1', 'Phòng 401-A1', 'Phòng 201-B2', 'Phòng 301-B2', 'Phòng Lab A-402', 'Hội trường C1', 'Phòng 105-B3', 'Phòng 203-B1', 'Phòng 404-A2'];

    // Khung giờ học (start, end)
    private const TIME_SLOTS = [
        ['07:00', '09:30'],
        ['09:45', '11:45'],
        ['13:00', '15:30'],
        ['15:45', '17:45'],
    ];

    public function run(): void
    {
        $this->command->info('══════════════════════════════════════════');
        $this->command->info('  BẮT ĐẦU FULL DATA SEEDER');
        $this->command->info('══════════════════════════════════════════');

        // ── BƯỚC 1: Thêm giáo viên bổ sung ──────────────── 
        $this->seedTeachers();

        // ── BƯỚC 2: Tạo lịch học đầy đủ ──────────────────
        $this->seedSchedules();

        // ── BƯỚC 3: Tạo học phí cho tất cả sinh viên ─────
        $this->seedTuitionFees();

        // ── BƯỚC 4: Cập nhật Enrollment còn thiếu giáo viên ─
        $this->fixEnrollments();

        $this->command->info('');
        $this->command->info('  ✅ FULL DATA SEEDER HOÀN TẤT!');
        $this->command->info('══════════════════════════════════════════');
    }

    // ─────────────────────────────────────────────────────────────────
    // BƯỚC 1: THÊM GIÁO VIÊN BỔ SUNG (từ 5 → 10 GV)
    // ─────────────────────────────────────────────────────────────────
    private function seedTeachers(): void
    {
        $this->command->info('📌 Bổ sung giáo viên...');

        // Danh sách GV mới (không trùng với GV cũ đã có)
        $newTeachers = [
            ['name' => 'GS.TS Đinh Xuân Trường', 'email' => 'truong.dx@fbu.edu.vn', 'phone' => '0967.890.123', 'specialty' => 'Kinh tế vi mô, Kinh tế vĩ mô, Kinh tế lượng'],
            ['name' => 'PGS.TS Bùi Thị Cẩm Vân', 'email' => 'van.btc@fbu.edu.vn', 'phone' => '0978.901.234', 'specialty' => 'Kế toán doanh nghiệp, Nguyên lý kế toán, Thuế'],
            ['name' => 'TS. Lưu Đình Phong', 'email' => 'phong.ld@fbu.edu.vn', 'phone' => 'phongluu@gmail.com', 'specialty' => 'Tài chính tiền tệ, Nghiệp vụ ngân hàng'],
            ['name' => 'ThS. Trần Ngọc Huyền', 'email' => 'huyen.tn@fbu.edu.vn', 'phone' => '0990.123.456', 'specialty' => 'Marketing, Quản trị học, TMĐT'],
            ['name' => 'TS. Ngô Gia Bảo', 'email' => 'bao.ng@fbu.edu.vn', 'phone' => '0901.234.567', 'specialty' => 'Pháp luật, Hải quan, Kinh doanh quốc tế'],
        ];

        foreach ($newTeachers as $td) {
            // Bỏ qua nếu email đã tồn tại
            if (User::where('email', $td['email'])->exists()) {
                $this->command->warn("GV {$td['name']} đã tồn tại, bỏ qua.");
                continue;
            }

            $user = User::create([
                'name'     => $td['name'],
                'email'    => $td['email'],
                'password' => Hash::make('password'),
                'role_id'  => 2,
            ]);
            Teacher::create([
                'user_id' => $user->id,
                'phone'   => $td['phone'],
            ]);
            $this->command->info("  + Đã tạo GV: {$td['name']}");
        }
    }

    // ─────────────────────────────────────────────────────────────────
    // BƯỚC 2: TẠO LỊCH HỌC ĐẦY ĐỦ CHO TẤT CẢ MÔN HỌC
    // ─────────────────────────────────────────────────────────────────
    private function seedSchedules(): void
    {
        $this->command->info('📅 Tạo lịch học...');

        $subjects    = Subject::all();
        $allTeachers = Teacher::with('user')->get();

        // Lấy ngày đầu tuần hiện tại (Thứ 2)
        $monday = now()->startOfWeek();

        $colorIdx = 0;
        $roomIdx  = 0;
        $slotIdx  = 0;
        $dayIdx   = 0;

        foreach ($subjects as $subject) {
            // Mỗi môn có 2-3 buổi/tuần
            $sessionsPerWeek = ($subject->credits ?? $subject->credit ?? 3) >= 3 ? 3 : 2;

            // Giáo viên phụ trách môn này (lấy từ enrollment hoặc random)
            $teacherName = $this->getTeacherForSubject($subject, $allTeachers);

            $usedSlots = []; // Tránh trùng slot trong cùng tuần
            $count     = 0;

            for ($week = 0; $week < 4; $week++) { // 4 tuần lịch
                $weekStart = $monday->copy()->addWeeks($week - 2); // 2 tuần trước + 2 tuần tới

                $weekSlots = [];
                $dayShift  = 0;
                while (count($weekSlots) < $sessionsPerWeek && $dayShift < 6) {
                    $dayName  = self::DAYS[$dayShift % 6];
                    $slotPair = self::TIME_SLOTS[$slotIdx % 4];

                    $key = $dayShift . '-' . ($slotIdx % 4);
                    if (!in_array($key, $usedSlots)) {
                        $studyDate = $weekStart->copy()->addDays($dayShift);

                        // Kiểm tra không trùng schedule đã có
                        $exists = Schedule::where('subject_id', $subject->id)
                            ->where('study_date', $studyDate->format('Y-m-d'))
                            ->where('start_time', $slotPair[0])
                            ->exists();

                        if (!$exists) {
                            Schedule::create([
                                'subject_id'  => $subject->id,
                                'day_of_week' => $dayName,
                                'study_date'  => $studyDate->format('Y-m-d'),
                                'start_time'  => $slotPair[0],
                                'end_time'    => $slotPair[1],
                                'room'        => self::ROOMS[$roomIdx % count(self::ROOMS)],
                                'type'        => $count % 3 === 0 ? 'Lý thuyết' : ($count % 3 === 1 ? 'Bài tập' : 'Thực hành'),
                                'instructor'  => $teacherName,
                                'color_theme' => self::COLORS[$colorIdx % count(self::COLORS)],
                            ]);
                            $weekSlots[] = $key;
                            $count++;
                        }
                    }
                    $dayShift++;
                    $slotIdx++;
                }
            }
            $colorIdx++;
            $roomIdx++;
            $slotIdx++;
        }

        $this->command->info('  ✓ Lịch học đã được tạo cho tất cả môn học.');
    }

    /**
     * Lấy tên giảng viên phụ trách môn học.
     */
    private function getTeacherForSubject(Subject $subject, $allTeachers): string
    {
        // Thử lấy từ Enrollment đã có
        $enrollment = Enrollment::where('subject_id', $subject->id)
            ->with('teacher.user')
            ->first();

        if ($enrollment && $enrollment->teacher && $enrollment->teacher->user) {
            return $enrollment->teacher->user->name;
        }

        // Nếu không có, random một giáo viên
        $teacher = $allTeachers->random();
        return $teacher->user->name ?? 'Giảng viên';
    }

    // ─────────────────────────────────────────────────────────────────
    // BƯỚC 3: TẠO HỌC PHÍ CHO TẤT CẢ SINH VIÊN
    // ─────────────────────────────────────────────────────────────────
    private function seedTuitionFees(): void
    {
        $this->command->info('💰 Tạo học phí...');

        $students = Student::all();
        $semesters = [
            ['name' => 'HK1 - 2024/2025', 'deadline' => '2024-09-30'],
            ['name' => 'HK2 - 2024/2025', 'deadline' => '2025-02-28'],
            ['name' => 'HK1 - 2025/2026', 'deadline' => '2025-09-30'],
        ];

        $created = 0;
        foreach ($students as $student) {
            foreach ($semesters as $semIdx => $sem) {
                // Bỏ qua nếu đã có học phí học kỳ này
                $exists = TuitionFee::where('student_id', $student->id)
                    ->where('semester', $sem['name'])
                    ->exists();
                if ($exists) continue;

                // Học phí dao động: 7.5 - 12 triệu
                $total = round(mt_rand(7500000, 12000000) / 100000) * 100000;

                // Trạng thái thanh toán
                $rand = mt_rand(1, 100);
                if ($rand <= 60) {
                    $paid = $total; // Đã đóng đủ
                } elseif ($rand <= 80) {
                    $paid = $total / 2; // Đóng một nửa
                } else {
                    $paid = 0; // Chưa đóng
                }

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

        $this->command->info("  ✓ Đã tạo {$created} bản ghi học phí.");
    }

    // ─────────────────────────────────────────────────────────────────
    // BƯỚC 4: ĐẢM BẢO GIÁO VIÊN ĐƯỢC GÁN ĐẦY ĐỦ VÀO ENROLLMENT
    // ─────────────────────────────────────────────────────────────────
    private function fixEnrollments(): void
    {
        $this->command->info('🔧 Kiểm tra và sửa enrollment thiếu giáo viên...');

        $teachers = Teacher::with('user')->get();
        
        // Map môn học → giáo viên phù hợp nhất
        $subjectTeacherMap = $this->buildSubjectTeacherMap($teachers);

        // Lấy tất cả enrollment chưa có teacher_id
        $noTeacher = Enrollment::whereNull('teacher_id')->get();
        $fixed = 0;

        foreach ($noTeacher as $enrollment) {
            $teacherId = $subjectTeacherMap[$enrollment->subject_id] ?? $teachers->random()->id;
            $enrollment->update(['teacher_id' => $teacherId]);
            $fixed++;
        }

        $this->command->info("  ✓ Đã fix {$fixed} enrollment thiếu giáo viên.");

        // Đảm bảo mỗi GV dạy ít nhất 2 môn
        $this->ensureTeacherHasMinSubjects($teachers, $subjectTeacherMap);
    }

    /**
     * Xây dựng mapping: subject_id → teacher_id
     * Dựa trên các enrollment hiện có (GV đang dạy môn nào).
     */
    private function buildSubjectTeacherMap($teachers): array
    {
        $map = [];

        // Lấy các assignment hiện tại
        $existing = Enrollment::selectRaw('subject_id, teacher_id, COUNT(*) as cnt')
            ->whereNotNull('teacher_id')
            ->groupBy('subject_id', 'teacher_id')
            ->orderByDesc('cnt')
            ->get();

        foreach ($existing as $row) {
            if (!isset($map[$row->subject_id])) {
                $map[$row->subject_id] = $row->teacher_id;
            }
        }

        // Những môn chưa có ai dạy → gán luân phiên
        $subjects      = Subject::pluck('id');
        $teacherCycle  = $teachers->pluck('id')->toArray();
        $tIdx          = 0;

        foreach ($subjects as $subId) {
            if (!isset($map[$subId])) {
                $map[$subId] = $teacherCycle[$tIdx % count($teacherCycle)];
                $tIdx++;
            }
        }

        return $map;
    }

    /**
     * Đảm bảo mỗi giáo viên dạy ít nhất 2 môn học.
     */
    private function ensureTeacherHasMinSubjects($teachers, array $subjectTeacherMap): void
    {
        $subjects = Subject::pluck('id')->toArray();

        foreach ($teachers as $teacher) {
            // Đếm số môn GV này đang dạy (trong subjectTeacherMap)
            $subjectCount = count(array_filter($subjectTeacherMap, fn($tid) => $tid === $teacher->id));

            if ($subjectCount < 2) {
                // Gán thêm 2 môn ngẫu nhiên chưa được assign cho GV này
                $availableSubjects = array_filter($subjects, function ($sid) use ($subjectTeacherMap, $teacher) {
                    return !isset($subjectTeacherMap[$sid]) || $subjectTeacherMap[$sid] !== $teacher->id;
                });

                $toAssign = array_slice(array_values($availableSubjects), 0, 2 - $subjectCount);
                foreach ($toAssign as $subjectId) {
                    $this->command->info("  + GV #{$teacher->id} ({$teacher->user->name}) được gán thêm môn #{$subjectId}");
                    // Cập nhật schedule (nếu có) để hiển thị tên GV
                    Schedule::where('subject_id', $subjectId)
                        ->whereNull('instructor')
                        ->update(['instructor' => $teacher->user->name]);
                }
            }
        }

        $this->command->info('  ✓ Tất cả giáo viên đã có ít nhất 2 môn phụ trách.');
    }
}
