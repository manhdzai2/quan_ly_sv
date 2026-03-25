<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Student;
use App\Models\TuitionFee;
use App\Models\Payment;
use App\Models\ServiceRequest;
use Carbon\Carbon;

class TuitionServiceSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Lấy student mẫu (student@fbu.edu.vn)
        $student = Student::whereHas('user', function ($q) {
            $q->where('email', 'student@fbu.edu.vn');
        })->first();

        if (!$student) {
            $this->command->info('Không tìm thấy student@fbu.edu.vn');
            return;
        }

        // Xóa dữ liệu cũ
        TuitionFee::where('student_id', $student->id)->delete();
        ServiceRequest::where('student_id', $student->id)->delete();

        // 1. Tạo Học phí (Tuition Fees)
        $tuition1 = TuitionFee::create([
            'student_id' => $student->id,
            'semester' => 'Học kỳ 1 - 2025/2026',
            'total_amount' => 12500000,
            'paid_amount' => 12500000,
            'deadline' => Carbon::create(2025, 9, 15),
        ]);

        $tuition2 = TuitionFee::create([
            'student_id' => $student->id,
            'semester' => 'Học kỳ 2 - 2025/2026',
            'total_amount' => 13200000,
            'paid_amount' => 5000000, // Thanh toán 1 phần
            'deadline' => Carbon::create(2026, 2, 15),
        ]);

        // 2. Tạo Lịch sử thanh toán (Payments)
        Payment::create([
            'student_id' => $student->id,
            'tuition_fee_id' => $tuition1->id,
            'amount' => 12500000,
            'payment_method' => 'Chuyển khoản / M-Code',
            'transaction_id' => 'MB' . time() . '123',
            'status' => 'success',
            'created_at' => Carbon::create(2025, 8, 20, 10, 30, 0)
        ]);

        Payment::create([
            'student_id' => $student->id,
            'tuition_fee_id' => $tuition2->id,
            'amount' => 5000000,
            'payment_method' => 'Thanh toán trực tiếp',
            'transaction_id' => 'TM' . time() . '456',
            'status' => 'success',
            'created_at' => Carbon::create(2026, 1, 10, 14, 15, 0)
        ]);
        
        // Cố ý tạo 1 payment thất bại
        Payment::create([
            'student_id' => $student->id,
            'tuition_fee_id' => $tuition2->id,
            'amount' => 8200000,
            'payment_method' => 'Chuyển khoản / M-Code',
            'transaction_id' => 'MB' . time() . 'ERROR',
            'status' => 'failed',
            'created_at' => Carbon::now()->subDays(2)
        ]);

        // 3. Tạo Yêu cầu dịch vụ (Service Requests)
        ServiceRequest::create([
            'student_id' => $student->id,
            'service_id' => 's1', // Xin bảng điểm
            'service_name' => 'Xin cấp bảng điểm',
            'request_data' => [
                'type' => 'Tiếng Việt',
                'quantity' => 2,
                'delivery' => 'Nhận trực tiếp tại Phòng Đào tạo',
            ],
            'note' => 'Cấp bảng điểm đến hết HK1 năm học 2025-2026 để bổ sung hồ sơ học bổng.',
            'status' => 'completed',
            'response_note' => 'Đã cấp xong, sinh viên vui lòng mang theo thẻ SV lên phòng 102 để nhận.',
            'created_at' => Carbon::now()->subDays(10)
        ]);

        ServiceRequest::create([
            'student_id' => $student->id,
            'service_id' => 's2', // Giấy xác nhận
            'service_name' => 'Giấy xác nhận sinh viên',
            'request_data' => [
                'purpose' => 'Đăng ký thực tập',
                'delivery' => 'Bản điện tử (PDF có chữ ký số)',
            ],
            'note' => null,
            'status' => 'processing',
            'created_at' => Carbon::now()->subHours(5)
        ]);
        
        $this->command->info('Nạp dữ liệu Học phí, Thanh toán và Dịch vụ thành công!');
    }
}
