<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use App\Models\Role;
use App\Models\Teacher;
use App\Models\Student;
use App\Models\SchoolClass;
use App\Models\Subject;
use App\Models\Classroom;
use App\Models\Enrollment;
use App\Models\Score;
use App\Models\Schedule;
use App\Models\Attendance;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // ══════════════════════════════════════════
        // 1. ROLES
        // ══════════════════════════════════════════
        $roles = ['admin', 'teacher', 'student'];
        foreach ($roles as $roleName) {
            Role::firstOrCreate(['name' => $roleName]);
        }

        // ══════════════════════════════════════════
        // 2. ADMIN ACCOUNT
        // ══════════════════════════════════════════
        $adminUser = User::create([
            'name' => 'Nguyễn Văn Admin',
            'email' => 'admin@fbu.edu.vn',
            'password' => Hash::make('password'),
            'role_id' => 1,
        ]);

        // ══════════════════════════════════════════
        // 3. KHÓA / NGÀNH (Classes)
        // ══════════════════════════════════════════
        $classes = [
            ['name' => 'K62-TCNH-01', 'description' => 'Khóa 62 - Tài chính Ngân hàng - Lớp 01'],
            ['name' => 'K62-KT-01', 'description' => 'Khóa 62 - Kế toán - Lớp 01'],
            ['name' => 'K62-QTKD-01', 'description' => 'Khóa 62 - Quản trị Kinh doanh - Lớp 01'],
            ['name' => 'K63-TCNH-01', 'description' => 'Khóa 63 - Tài chính Ngân hàng - Lớp 01'],
            ['name' => 'K63-KDQT-01', 'description' => 'Khóa 63 - Kinh doanh Quốc tế - Lớp 01'],
            ['name' => 'K63-TMDT-01', 'description' => 'Khóa 63 - Thương mại Điện tử - Lớp 01'],
            ['name' => 'K62-LKT-01', 'description' => 'Khóa 62 - Luật Kinh tế - Lớp 01'],
            ['name' => 'K63-CNTT-01', 'description' => 'Khóa 63 - Công nghệ Thông tin - Lớp 01'],
        ];
        $classModels = [];
        foreach ($classes as $c) {
            $classModels[] = SchoolClass::create($c);
        }

        // ══════════════════════════════════════════
        // 4. HỌC PHẦN (Subjects) — Từ FBU thực tế
        // ══════════════════════════════════════════
        $subjects = [
            // Đại cương
            ['code' => 'TRI101', 'name' => 'Triết học Mác – Lênin', 'credit' => 3, 'credits' => 3],
            ['code' => 'KTC102', 'name' => 'Kinh tế chính trị', 'credit' => 2, 'credits' => 2],
            ['code' => 'PLD103', 'name' => 'Pháp luật đại cương', 'credit' => 2, 'credits' => 2],
            ['code' => 'TCC104', 'name' => 'Toán cao cấp', 'credit' => 3, 'credits' => 3],
            ['code' => 'XST105', 'name' => 'Xác suất thống kê', 'credit' => 3, 'credits' => 3],
            ['code' => 'THC106', 'name' => 'Tin học cơ bản', 'credit' => 2, 'credits' => 2],
            ['code' => 'ENG107', 'name' => 'Tiếng Anh', 'credit' => 3, 'credits' => 3],

            // Cơ sở ngành
            ['code' => 'KTV201', 'name' => 'Kinh tế vi mô', 'credit' => 3, 'credits' => 3],
            ['code' => 'KVM202', 'name' => 'Kinh tế vĩ mô', 'credit' => 3, 'credits' => 3],
            ['code' => 'NLK203', 'name' => 'Nguyên lý kế toán', 'credit' => 3, 'credits' => 3],
            ['code' => 'TCT204', 'name' => 'Tài chính – tiền tệ', 'credit' => 3, 'credits' => 3],
            ['code' => 'QTH205', 'name' => 'Quản trị học', 'credit' => 2, 'credits' => 2],
            ['code' => 'MKT206', 'name' => 'Marketing căn bản', 'credit' => 2, 'credits' => 2],
            ['code' => 'KTL207', 'name' => 'Kinh tế lượng', 'credit' => 3, 'credits' => 3],

            // Chuyên ngành TC-NH
            ['code' => 'NVN301', 'name' => 'Nghiệp vụ ngân hàng thương mại', 'credit' => 3, 'credits' => 3],
            ['code' => 'TDN302', 'name' => 'Tín dụng ngân hàng', 'credit' => 3, 'credits' => 3],
            ['code' => 'PTC303', 'name' => 'Phân tích báo cáo tài chính', 'credit' => 3, 'credits' => 3],
            ['code' => 'QTR304', 'name' => 'Quản trị rủi ro tài chính', 'credit' => 3, 'credits' => 3],
            ['code' => 'TTC305', 'name' => 'Thị trường chứng khoán', 'credit' => 2, 'credits' => 2],
            ['code' => 'TTQ306', 'name' => 'Thanh toán quốc tế', 'credit' => 2, 'credits' => 2],

            // Chuyên ngành TC Doanh nghiệp
            ['code' => 'QTT401', 'name' => 'Quản trị tài chính doanh nghiệp', 'credit' => 3, 'credits' => 3],
            ['code' => 'DTT402', 'name' => 'Đầu tư tài chính', 'credit' => 3, 'credits' => 3],
            ['code' => 'THU403', 'name' => 'Thuế', 'credit' => 2, 'credits' => 2],
            ['code' => 'HQU404', 'name' => 'Hải quan', 'credit' => 2, 'credits' => 2],

            // Giai đoạn cuối
            ['code' => 'TTN501', 'name' => 'Thực tập tốt nghiệp', 'credit' => 5, 'credits' => 5],
            ['code' => 'KLT502', 'name' => 'Khóa luận tốt nghiệp', 'credit' => 5, 'credits' => 5],
        ];
        $subjectModels = [];
        foreach ($subjects as $s) {
            $subjectModels[] = Subject::create($s);
        }

        // ══════════════════════════════════════════
        // 5. GIẢNG VIÊN (5 Teachers)
        // ══════════════════════════════════════════
        $teachersData = [
            ['name' => 'PGS.TS Trần Thị Hương', 'email' => 'huong.tt@fbu.edu.vn', 'phone' => '0912.345.678'],
            ['name' => 'TS. Lê Quang Minh', 'email' => 'minh.lq@fbu.edu.vn', 'phone' => '0923.456.789'],
            ['name' => 'ThS. Phạm Thanh Tùng', 'email' => 'tung.pt@fbu.edu.vn', 'phone' => '0934.567.890'],
            ['name' => 'TS. Nguyễn Hoàng Anh', 'email' => 'anh.nh@fbu.edu.vn', 'phone' => '0945.678.901'],
            ['name' => 'ThS. Vũ Thị Lan', 'email' => 'lan.vt@fbu.edu.vn', 'phone' => '0956.789.012'],
        ];
        $teacherModels = [];
        foreach ($teachersData as $td) {
            $user = User::create([
                'name' => $td['name'],
                'email' => $td['email'],
                'password' => Hash::make('password'),
                'role_id' => 2,
            ]);
            $teacherModels[] = Teacher::create([
                'user_id' => $user->id,
                'phone' => $td['phone'],
            ]);
        }

        // ══════════════════════════════════════════
        // 6. SINH VIÊN (15 Students)
        // ══════════════════════════════════════════
        $studentsData = [
            ['name' => 'Nguyễn Văn An', 'email' => 'an.nv@sv.fbu.edu.vn', 'code' => 'SV2024001', 'class' => 0, 'dob' => '2004-03-15', 'gender' => 'male', 'phone' => '0901.111.001', 'address' => '12 Phố Trần Hưng Đạo, Hoàn Kiếm, Hà Nội'],
            ['name' => 'Trần Thị Bích Ngọc', 'email' => 'ngoc.ttb@sv.fbu.edu.vn', 'code' => 'SV2024002', 'class' => 0, 'dob' => '2004-07-22', 'gender' => 'female', 'phone' => '0901.111.002', 'address' => '45 Đường Láng, Đống Đa, Hà Nội'],
            ['name' => 'Phạm Đức Huy', 'email' => 'huy.pd@sv.fbu.edu.vn', 'code' => 'SV2024003', 'class' => 0, 'dob' => '2004-01-10', 'gender' => 'male', 'phone' => '0901.111.003', 'address' => '8 Nguyễn Trãi, Thanh Xuân, Hà Nội'],
            ['name' => 'Lê Hoàng Mai', 'email' => 'mai.lh@sv.fbu.edu.vn', 'code' => 'SV2024004', 'class' => 1, 'dob' => '2004-05-18', 'gender' => 'female', 'phone' => '0901.111.004', 'address' => '23 Phạm Văn Đồng, Cầu Giấy, Hà Nội'],
            ['name' => 'Vũ Minh Quang', 'email' => 'quang.vm@sv.fbu.edu.vn', 'code' => 'SV2024005', 'class' => 1, 'dob' => '2004-11-30', 'gender' => 'male', 'phone' => '0901.111.005', 'address' => '67 Hoàng Quốc Việt, Bắc Từ Liêm, Hà Nội'],
            ['name' => 'Đỗ Thị Hà', 'email' => 'ha.dt@sv.fbu.edu.vn', 'code' => 'SV2024006', 'class' => 1, 'dob' => '2004-09-08', 'gender' => 'female', 'phone' => '0901.111.006', 'address' => '101 Xuân Thủy, Cầu Giấy, Hà Nội'],
            ['name' => 'Hoàng Anh Tuấn', 'email' => 'tuan.ha@sv.fbu.edu.vn', 'code' => 'SV2024007', 'class' => 2, 'dob' => '2004-02-14', 'gender' => 'male', 'phone' => '0901.111.007', 'address' => '33 Giải Phóng, Hai Bà Trưng, Hà Nội'],
            ['name' => 'Ngô Thùy Linh', 'email' => 'linh.nt@sv.fbu.edu.vn', 'code' => 'SV2024008', 'class' => 2, 'dob' => '2004-12-25', 'gender' => 'female', 'phone' => '0901.111.008', 'address' => '55 Tây Sơn, Đống Đa, Hà Nội'],
            ['name' => 'Bùi Thanh Sơn', 'email' => 'son.bt@sv.fbu.edu.vn', 'code' => 'SV2024009', 'class' => 3, 'dob' => '2005-04-20', 'gender' => 'male', 'phone' => '0901.111.009', 'address' => '78 Nguyễn Chí Thanh, Ba Đình, Hà Nội'],
            ['name' => 'Trịnh Minh Châu', 'email' => 'chau.tm@sv.fbu.edu.vn', 'code' => 'SV2024010', 'class' => 3, 'dob' => '2005-06-12', 'gender' => 'female', 'phone' => '0901.111.010', 'address' => '90 Lê Văn Lương, Thanh Xuân, Hà Nội'],
            ['name' => 'Đặng Quốc Bảo', 'email' => 'bao.dq@sv.fbu.edu.vn', 'code' => 'SV2024011', 'class' => 4, 'dob' => '2005-08-05', 'gender' => 'male', 'phone' => '0901.111.011', 'address' => '15 Kim Mã, Ba Đình, Hà Nội'],
            ['name' => 'Phan Thị Yến Nhi', 'email' => 'nhi.pty@sv.fbu.edu.vn', 'code' => 'SV2024012', 'class' => 4, 'dob' => '2005-10-17', 'gender' => 'female', 'phone' => '0901.111.012', 'address' => '42 Bà Triệu, Hoàn Kiếm, Hà Nội'],
            ['name' => 'Lý Minh Đức', 'email' => 'duc.lm@sv.fbu.edu.vn', 'code' => 'SV2024013', 'class' => 5, 'dob' => '2005-01-28', 'gender' => 'male', 'phone' => '0901.111.013', 'address' => '29 Thái Hà, Đống Đa, Hà Nội'],
            ['name' => 'Cao Thị Phương', 'email' => 'phuong.ct@sv.fbu.edu.vn', 'code' => 'SV2024014', 'class' => 6, 'dob' => '2004-04-02', 'gender' => 'female', 'phone' => '0901.111.014', 'address' => '18 Chùa Bộc, Đống Đa, Hà Nội'],
            ['name' => 'Tạ Hữu Long', 'email' => 'long.th@sv.fbu.edu.vn', 'code' => 'SV2024015', 'class' => 7, 'dob' => '2005-03-09', 'gender' => 'male', 'phone' => '0901.111.015', 'address' => '61 Trần Duy Hưng, Cầu Giấy, Hà Nội'],
        ];

        // Tài khoản Student Demo để test
        $demoStudentUser = User::create([
            'name' => 'Nguyễn Văn An',
            'email' => 'student@fbu.edu.vn',
            'password' => Hash::make('password'),
            'role_id' => 3,
        ]);
        $demoStudent = Student::create([
            'user_id' => $demoStudentUser->id,
            'student_code' => 'SV2024001',
            'class_id' => $classModels[0]->id,
            'dob' => '2004-03-15',
            'gender' => 'male',
            'phone' => '0901.111.001',
            'address' => '12 Phố Trần Hưng Đạo, Hoàn Kiếm, Hà Nội',
        ]);

        $studentModels = [$demoStudent];

        // Tạo 14 sinh viên còn lại (bỏ index 0 vì đã tạo demo ở trên)
        for ($i = 1; $i < count($studentsData); $i++) {
            $sd = $studentsData[$i];
            $user = User::create([
                'name' => $sd['name'],
                'email' => $sd['email'],
                'password' => Hash::make('password'),
                'role_id' => 3,
            ]);
            $studentModels[] = Student::create([
                'user_id' => $user->id,
                'student_code' => $sd['code'],
                'class_id' => $classModels[$sd['class']]->id,
                'dob' => $sd['dob'],
                'gender' => $sd['gender'],
                'phone' => $sd['phone'],
                'address' => $sd['address'],
            ]);
        }

        // ══════════════════════════════════════════
        // 7. CLASSROOMS (Lớp Học Phần)
        // ══════════════════════════════════════════
        $classroomData = [
            ['name' => 'TCNH-N01', 'subject_id' => $subjectModels[14]->id, 'room' => 'Phòng 301-A1'],
            ['name' => 'TCNH-N02', 'subject_id' => $subjectModels[15]->id, 'room' => 'Phòng 302-A1'],
            ['name' => 'KTV-N01', 'subject_id' => $subjectModels[7]->id, 'room' => 'Phòng 201-B2'],
            ['name' => 'TCC-N01', 'subject_id' => $subjectModels[3]->id, 'room' => 'Hội trường C1'],
            ['name' => 'PTC-N01', 'subject_id' => $subjectModels[16]->id, 'room' => 'Phòng Lab A-402'],
            ['name' => 'XST-N01', 'subject_id' => $subjectModels[4]->id, 'room' => 'Phòng 105-B3'],
            ['name' => 'MKT-N01', 'subject_id' => $subjectModels[12]->id, 'room' => 'Phòng 404-A2'],
            ['name' => 'QTH-N01', 'subject_id' => $subjectModels[11]->id, 'room' => 'Phòng 203-B1'],
        ];
        foreach ($classroomData as $cr) {
            Classroom::create($cr);
        }

        // ══════════════════════════════════════════
        // 8. ENROLLMENTS + SCORES
        // ══════════════════════════════════════════

        // Mapping giảng viên -> môn chính
        // teacherModels[0] = Trần Thị Hương -> TC, NVN, TDN
        // teacherModels[1] = Lê Quang Minh -> Toán, XST, KTL
        // teacherModels[2] = Phạm Thanh Tùng -> KTV, KVM, NLK
        // teacherModels[3] = Nguyễn Hoàng Anh -> PTC, QTR, TTC
        // teacherModels[4] = Vũ Thị Lan -> MKT, QTH, THC

        $teacherSubjectMap = [
            // subjectIndex => teacherIndex
            0 => 1, 1 => 2, 2 => 2, 3 => 1, 4 => 1, 5 => 4, 6 => 4,
            7 => 2, 8 => 2, 9 => 2, 10 => 0, 11 => 4, 12 => 4, 13 => 1,
            14 => 0, 15 => 0, 16 => 3, 17 => 3, 18 => 3, 19 => 0,
            20 => 3, 21 => 3, 22 => 0, 23 => 0,
        ];

        // Mỗi sinh viên đăng ký 4-6 môn
        $enrollmentSets = [
            // student index => [subject indices]
            0  => [3, 4, 7, 8, 14, 15],   // An (TC-NH) - Toán, XST, KTV, KVM, NVN, TDN
            1  => [3, 4, 7, 8, 9, 10],    // Ngọc
            2  => [0, 3, 6, 7, 11, 12],   // Huy
            3  => [3, 4, 9, 10, 11, 12],  // Mai (Kế toán)
            4  => [0, 6, 7, 8, 9],        // Quang
            5  => [3, 4, 9, 10, 16],      // Hà
            6  => [0, 6, 11, 12, 7, 8],   // Tuấn (QTKD)
            7  => [3, 4, 11, 12, 13],     // Linh
            8  => [7, 8, 14, 15, 16],     // Sơn  (K63-TCNH)
            9  => [3, 4, 7, 8, 18],       // Châu
            10 => [0, 6, 7, 8, 19],       // Bảo  (KDQT)
            11 => [3, 4, 12, 11, 18],     // Nhi
            12 => [5, 6, 7, 8, 12],       // Đức  (TMDT)
            13 => [0, 2, 6, 7, 8],        // Phương (Luật KT)
            14 => [5, 6, 7, 8, 13],       // Long (CNTT)
        ];

        foreach ($enrollmentSets as $studentIdx => $subjectIdxs) {
            foreach ($subjectIdxs as $subjectIdx) {
                $teacherIdx = $teacherSubjectMap[$subjectIdx] ?? 0;
                
                $enrollment = Enrollment::create([
                    'student_id' => $studentModels[$studentIdx]->id,
                    'subject_id' => $subjectModels[$subjectIdx]->id,
                    'teacher_id' => $teacherModels[$teacherIdx]->id,
                ]);

                $regular = round(mt_rand(50, 95) / 10, 1);
                $test = round(mt_rand(40, 95) / 10, 1);

                Score::create([
                    'enrollment_id' => $enrollment->id,
                    'attendance_score' => $attendance,
                    'regular_score' => $regular,
                    'test_score' => $test,
                    'midterm_score' => $midterm,
                    'final_score' => $final,
                ]);
            }
        }

        // ══════════════════════════════════════════
        // 9. SCHEDULES (Lịch học cho sinh viên)
        // ══════════════════════════════════════════
        $scheduleData = [
            // ── PGS.TS Trần Thị Hương (GV Demo - dạy NVN, TDN, TCT, TTQ) ──
            // Thứ 2
            ['subject_id' => $subjectModels[14]->id, 'day_of_week' => 'Thứ 2', 'study_date' => '2026-03-23', 'start_time' => '07:00', 'end_time' => '09:30', 'room' => 'Phòng 301-A1', 'type' => 'Lý thuyết', 'instructor' => 'PGS.TS Trần Thị Hương', 'color_theme' => 'rose'],
            ['subject_id' => $subjectModels[10]->id, 'day_of_week' => 'Thứ 2', 'study_date' => '2026-03-23', 'start_time' => '13:00', 'end_time' => '15:00', 'room' => 'Phòng 302-A1', 'type' => 'Lý thuyết', 'instructor' => 'PGS.TS Trần Thị Hương', 'color_theme' => 'orange'],
            // Thứ 3
            ['subject_id' => $subjectModels[15]->id, 'day_of_week' => 'Thứ 3', 'study_date' => '2026-03-24', 'start_time' => '07:00', 'end_time' => '09:30', 'room' => 'Phòng 302-A1', 'type' => 'Lý thuyết', 'instructor' => 'PGS.TS Trần Thị Hương', 'color_theme' => 'orange'],
            // Thứ 4
            ['subject_id' => $subjectModels[14]->id, 'day_of_week' => 'Thứ 4', 'study_date' => '2026-03-25', 'start_time' => '07:00', 'end_time' => '09:30', 'room' => 'Phòng 301-A1', 'type' => 'Thực hành', 'instructor' => 'PGS.TS Trần Thị Hương', 'color_theme' => 'rose'],
            ['subject_id' => $subjectModels[19]->id, 'day_of_week' => 'Thứ 4', 'study_date' => '2026-03-25', 'start_time' => '13:00', 'end_time' => '15:30', 'room' => 'Phòng 404-A2', 'type' => 'Lý thuyết', 'instructor' => 'PGS.TS Trần Thị Hương', 'color_theme' => 'purple'],
            // Thứ 5
            ['subject_id' => $subjectModels[15]->id, 'day_of_week' => 'Thứ 5', 'study_date' => '2026-03-26', 'start_time' => '13:00', 'end_time' => '15:30', 'room' => 'Phòng 302-A1', 'type' => 'Bài tập', 'instructor' => 'PGS.TS Trần Thị Hương', 'color_theme' => 'orange'],
            // Thứ 6
            ['subject_id' => $subjectModels[14]->id, 'day_of_week' => 'Thứ 6', 'study_date' => '2026-03-27', 'start_time' => '07:00', 'end_time' => '09:30', 'room' => 'Phòng 301-A1', 'type' => 'Lý thuyết', 'instructor' => 'PGS.TS Trần Thị Hương', 'color_theme' => 'rose'],

            // ── TS. Lê Quang Minh (Toán, XST) ──
            ['subject_id' => $subjectModels[3]->id, 'day_of_week' => 'Thứ 2', 'study_date' => '2026-03-23', 'start_time' => '07:00', 'end_time' => '09:30', 'room' => 'Hội trường C1', 'type' => 'Lý thuyết', 'instructor' => 'TS. Lê Quang Minh', 'color_theme' => 'blue'],
            ['subject_id' => $subjectModels[3]->id, 'day_of_week' => 'Thứ 5', 'study_date' => '2026-03-26', 'start_time' => '07:00', 'end_time' => '09:30', 'room' => 'Hội trường C1', 'type' => 'Bài tập', 'instructor' => 'TS. Lê Quang Minh', 'color_theme' => 'blue'],
            ['subject_id' => $subjectModels[4]->id, 'day_of_week' => 'Thứ 3', 'study_date' => '2026-03-24', 'start_time' => '09:45', 'end_time' => '11:45', 'room' => 'Phòng 105-B3', 'type' => 'Lý thuyết', 'instructor' => 'TS. Lê Quang Minh', 'color_theme' => 'purple'],
            ['subject_id' => $subjectModels[4]->id, 'day_of_week' => 'Thứ 6', 'study_date' => '2026-03-27', 'start_time' => '09:45', 'end_time' => '11:45', 'room' => 'Phòng 105-B3', 'type' => 'Bài tập', 'instructor' => 'TS. Lê Quang Minh', 'color_theme' => 'purple'],

            // ── ThS. Phạm Thanh Tùng (KTV, KVM) ──
            ['subject_id' => $subjectModels[7]->id, 'day_of_week' => 'Thứ 2', 'study_date' => '2026-03-23', 'start_time' => '13:00', 'end_time' => '15:00', 'room' => 'Phòng 201-B2', 'type' => 'Lý thuyết', 'instructor' => 'ThS. Phạm Thanh Tùng', 'color_theme' => 'emerald'],
            ['subject_id' => $subjectModels[7]->id, 'day_of_week' => 'Thứ 4', 'study_date' => '2026-03-25', 'start_time' => '13:00', 'end_time' => '15:00', 'room' => 'Phòng 201-B2', 'type' => 'Thảo luận', 'instructor' => 'ThS. Phạm Thanh Tùng', 'color_theme' => 'emerald'],
            ['subject_id' => $subjectModels[8]->id, 'day_of_week' => 'Thứ 3', 'study_date' => '2026-03-24', 'start_time' => '13:00', 'end_time' => '15:30', 'room' => 'Phòng 203-B1', 'type' => 'Lý thuyết', 'instructor' => 'ThS. Phạm Thanh Tùng', 'color_theme' => 'amber'],

            // ── TS. Nguyễn Hoàng Anh (PTC, TTC) ──
            ['subject_id' => $subjectModels[18]->id, 'day_of_week' => 'Thứ 7', 'study_date' => '2026-03-28', 'start_time' => '07:00', 'end_time' => '09:30', 'room' => 'Phòng Lab A-402', 'type' => 'Lý thuyết', 'instructor' => 'TS. Nguyễn Hoàng Anh', 'color_theme' => 'cyan'],
        ];

        foreach ($scheduleData as $sd) {
            Schedule::create($sd);
        }

        // ══════════════════════════════════════════
        // 10. ATTENDANCE (Điểm danh mẫu - 10 buổi gần nhất)
        // ══════════════════════════════════════════
        $allEnrollments = Enrollment::all();
        $statuses = ['present', 'present', 'present', 'present', 'present', 'present', 'late', 'absent_excused', 'absent_unexcused', 'present'];
        
        // Tạo 10 buổi điểm danh cho mỗi enrollment (từ 10 ngày trước đến hôm qua)
        for ($day = 10; $day >= 1; $day--) {
            $date = now()->subDays($day)->format('Y-m-d');
            
            foreach ($allEnrollments as $enrollment) {
                // Random trạng thái nhưng thiên về "present" (70%)
                $rand = mt_rand(1, 100);
                if ($rand <= 70) {
                    $status = 'present';
                } elseif ($rand <= 80) {
                    $status = 'late';
                } elseif ($rand <= 90) {
                    $status = 'absent_excused';
                } else {
                    $status = 'absent_unexcused';
                }

                Attendance::create([
                    'enrollment_id' => $enrollment->id,
                    'date' => $date,
                    'status' => $status,
                    'note' => $status === 'absent_excused' ? 'Có đơn xin phép' : ($status === 'late' ? 'Đến muộn 10 phút' : null),
                ]);
            }
        }

        // ══════════════════════════════════════════
        // 11. MATERIALS (Tài liệu mẫu)
        // ══════════════════════════════════════════
        $materialsData = [
            ['subject_id' => $subjectModels[14]->id, 'teacher_id' => $teacherModels[0]->id, 'title' => 'Slide Chương 1 - Tổng quan NVNH', 'description' => 'Bài giảng PowerPoint chương 1: Tổng quan về nghiệp vụ ngân hàng thương mại', 'type' => 'slide'],
            ['subject_id' => $subjectModels[14]->id, 'teacher_id' => $teacherModels[0]->id, 'title' => 'Giáo trình NVNH TM (PDF)', 'description' => 'Giáo trình chính thức môn Nghiệp vụ Ngân hàng Thương mại', 'type' => 'pdf'],
            ['subject_id' => $subjectModels[15]->id, 'teacher_id' => $teacherModels[0]->id, 'title' => 'Tài liệu tham khảo - Tín dụng NH', 'description' => 'Bộ tài liệu tham khảo về nghiệp vụ tín dụng ngân hàng hiện đại', 'type' => 'document'],
            ['subject_id' => $subjectModels[10]->id, 'teacher_id' => $teacherModels[0]->id, 'title' => 'Video bài giảng - Tài chính tiền tệ', 'description' => 'Video bài giảng trực tuyến chương 2: Hệ thống tiền tệ', 'type' => 'video'],
        ];
        foreach ($materialsData as $md) {
            \App\Models\Material::create($md);
        }

        // ══════════════════════════════════════════
        // 12. ASSIGNMENTS & SUBMISSIONS (Bài tập mẫu)
        // ══════════════════════════════════════════
        $assignment1 = \App\Models\Assignment::create([
            'subject_id' => $subjectModels[14]->id,
            'teacher_id' => $teacherModels[0]->id,
            'title' => 'Bài tập Chương 1 - Phân tích NVNH',
            'description' => 'Phân tích hoạt động huy động vốn của một NHTM cụ thể. Yêu cầu: Báo cáo 3-5 trang, trích dẫn số liệu năm gần nhất.',
            'deadline' => now('Asia/Ho_Chi_Minh')->addDays(7),
            'max_score' => 10,
        ]);

        $assignment2 = \App\Models\Assignment::create([
            'subject_id' => $subjectModels[15]->id,
            'teacher_id' => $teacherModels[0]->id,
            'title' => 'Case Study - Tín dụng doanh nghiệp',
            'description' => 'Nghiên cứu quy trình cho vay tín dụng đối với doanh nghiệp vừa và nhỏ. Nộp file Word hoặc PDF.',
            'deadline' => now('Asia/Ho_Chi_Minh')->addDays(14),
            'max_score' => 10,
        ]);

        // Tạo submissions mẫu (một số SV đã nộp)
        $studentsInNVN = Enrollment::where('subject_id', $subjectModels[14]->id)
            ->where('teacher_id', $teacherModels[0]->id)
            ->pluck('student_id');

        foreach ($studentsInNVN->take(3) as $idx => $studentId) {
            \App\Models\Submission::create([
                'assignment_id' => $assignment1->id,
                'student_id' => $studentId,
                'submitted_at' => now('Asia/Ho_Chi_Minh')->subDays(rand(1, 3)),
                'file_name' => 'bai_tap_ch1_sv' . ($idx + 1) . '.docx',
                'is_late' => $idx === 2, // SV thứ 3 nộp muộn
                'score' => $idx === 0 ? 8.5 : null, // SV đầu tiên đã được chấm
                'feedback' => $idx === 0 ? 'Bài viết tốt, phân tích số liệu chi tiết.' : null,
            ]);
        }

        // ══════════════════════════════════════════
        // 13. ANNOUNCEMENTS (Thông báo mẫu)
        // ══════════════════════════════════════════
        \App\Models\Announcement::create([
            'teacher_id' => $teacherModels[0]->id,
            'subject_id' => $subjectModels[14]->id,
            'title' => 'Lịch thi giữa kỳ NVNH',
            'content' => 'Kỳ thi giữa kỳ môn Nghiệp vụ Ngân hàng Thương mại sẽ diễn ra vào ngày 01/04/2026 tại Phòng 301-A1. Sinh viên mang theo thẻ SV và bút.',
            'priority' => 'important',
        ]);
        \App\Models\Announcement::create([
            'teacher_id' => $teacherModels[0]->id,
            'subject_id' => null,
            'title' => 'Hạn chót nộp điểm HK1',
            'content' => 'Tất cả giảng viên vui lòng hoàn thành nhập điểm trước 15/04/2026. Điểm sẽ được khóa sau ngày này.',
            'priority' => 'urgent',
        ]);
        \App\Models\Announcement::create([
            'teacher_id' => $teacherModels[0]->id,
            'subject_id' => $subjectModels[15]->id,
            'title' => 'Tài liệu ôn tập Tín dụng NH',
            'content' => 'Sinh viên có thể tải tài liệu ôn tập tại mục Học liệu. Nội dung ôn tập bao gồm Chương 1-4.',
            'priority' => 'normal',
        ]);

        // ══════════════════════════════════════════
        // 14. LEAVE REQUESTS (Đơn xin nghỉ mẫu)
        // ══════════════════════════════════════════
        $leaveStudents = Enrollment::where('teacher_id', $teacherModels[0]->id)
            ->pluck('student_id')->unique()->values()->take(4);

        if ($leaveStudents->count() >= 4) {
            \App\Models\LeaveRequest::create([
                'student_id' => $leaveStudents[0], 'subject_id' => $subjectModels[14]->id,
                'teacher_id' => $teacherModels[0]->id, 'leave_date' => now('Asia/Ho_Chi_Minh')->addDays(2),
                'reason' => 'Em bị ốm, có giấy khám bệnh. Xin phép nghỉ buổi học ngày mai.', 'status' => 'pending',
            ]);
            \App\Models\LeaveRequest::create([
                'student_id' => $leaveStudents[1], 'subject_id' => $subjectModels[15]->id,
                'teacher_id' => $teacherModels[0]->id, 'leave_date' => now('Asia/Ho_Chi_Minh')->addDays(3),
                'reason' => 'Em có lịch thi chứng chỉ TOEIC vào sáng thứ Năm, xin phép vắng buổi học.', 'status' => 'pending',
            ]);
            \App\Models\LeaveRequest::create([
                'student_id' => $leaveStudents[2], 'subject_id' => $subjectModels[14]->id,
                'teacher_id' => $teacherModels[0]->id, 'leave_date' => now('Asia/Ho_Chi_Minh')->subDays(5),
                'reason' => 'Em về quê có việc gia đình gấp, xin phép nghỉ 1 buổi.', 'status' => 'approved',
                'teacher_note' => 'Đã duyệt, nhớ bổ sung bài.',
            ]);
            \App\Models\LeaveRequest::create([
                'student_id' => $leaveStudents[3], 'subject_id' => $subjectModels[15]->id,
                'teacher_id' => $teacherModels[0]->id, 'leave_date' => now('Asia/Ho_Chi_Minh')->subDays(3),
                'reason' => 'Em muốn nghỉ để ôn thi môn khác.', 'status' => 'rejected',
                'teacher_note' => 'Không hợp lệ, vui lòng đến lớp đầy đủ.',
            ]);
        }

        // ══════════════════════════════════════════
        // LOG THÔNG TIN ĐĂNG NHẬP
        // ══════════════════════════════════════════
        $this->command->info('');
        $this->command->info('══════════════════════════════════════════');
        $this->command->info('  ĐÃ TẠO DỮ LIỆU THÀNH CÔNG!');
        $this->command->info('══════════════════════════════════════════');
        $this->command->info('');
        $this->command->info('  📋 TÀI KHOẢN ĐĂNG NHẬP:');
        $this->command->info('  ─────────────────────────');
        $this->command->info('  🔑 Admin:    admin@fbu.edu.vn / password');
        $this->command->info('  🔑 Giảng viên: huong.tt@fbu.edu.vn / password');
        $this->command->info('  🔑 Sinh viên:  student@fbu.edu.vn / password');
        $this->command->info('');
        $this->command->info('  📊 DỮ LIỆU:');
        $this->command->info('  ─────────────');
        $this->command->info('  • 8 Khóa/Ngành');
        $this->command->info('  • 26 Học phần');
        $this->command->info('  • 5 Giảng viên');
        $this->command->info('  • 15 Sinh viên');
        $this->command->info('  • 8 Lớp học phần');
        $this->command->info('  • 12 Lịch học/tuần');
        $this->command->info('  • Điểm số đầy đủ cho tất cả enrollment');
        $this->command->info('');
    }
}