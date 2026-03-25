<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\TuitionFee;
use App\Models\Payment;
use App\Models\ServiceRequest;
use Illuminate\Http\Request;
use Inertia\Inertia;

class StudentServiceController extends Controller
{
    public function index(Request $request)
    {
        $student = $request->user()->student;
        if (!$student) return redirect()->route('student.dashboard');

        // Lấy data học phí
        $tuitions = TuitionFee::where('student_id', $student->id)
            ->orderBy('deadline', 'desc')
            ->get();

        // Lấy Lịch sử thanh toán
        $payments = Payment::where('student_id', $student->id)
            ->with('tuitionFee')
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function($p) {
                return [
                    'id' => $p->id,
                    'semester' => $p->tuitionFee->semester ?? '',
                    'amount' => $p->amount,
                    'method' => $p->payment_method,
                    'transaction_id' => $p->transaction_id,
                    'status' => $p->status,
                    'date' => $p->created_at->format('d/m/Y H:i'),
                ];
            });

        // Lấy Lịch sử yêu cầu dịch vụ
        $requests = ServiceRequest::where('student_id', $student->id)
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function($r) {
                return [
                    'id' => $r->id,
                    'service_name' => $r->service_name,
                    'request_data' => $r->request_data,
                    'note' => $r->note,
                    'status' => $r->status,
                    'response_note' => $r->response_note,
                    'date' => $r->created_at->format('d/m/Y H:i'),
                ];
            });

        // Cấu hình danh mục dịch vụ (Có required fields JSON để frontend bind UI)
        $services = [
            [
                'category' => 'Học vụ',
                'items' => [
                    [
                        'id' => 's1', 'name' => 'Xin cấp bảng điểm', 'icon' => 'receipt_long',
                        'fields' => [
                            ['name' => 'type', 'label' => 'Loại bảng điểm', 'type' => 'select', 'options' => ['Tiếng Việt', 'Tiếng Anh', 'Song ngữ']],
                            ['name' => 'quantity', 'label' => 'Số lượng bản', 'type' => 'number', 'min' => 1, 'max' => 10],
                            ['name' => 'delivery', 'label' => 'Hình thức nhận', 'type' => 'select', 'options' => ['Bản điện tử (PDF)', 'Nhận trực tiếp tại khoa', 'Gửi bưu điện']],
                        ]
                    ],
                    [
                        'id' => 's2', 'name' => 'Giấy xác nhận sinh viên', 'icon' => 'badge',
                        'fields' => [
                            ['name' => 'purpose', 'label' => 'Mục đích sử dụng', 'type' => 'select', 'options' => ['Đăng ký thực tập', 'Vay vốn sinh viên', 'Tạm hoãn nghĩa vụ quân sự', 'Khác']],
                            ['name' => 'delivery', 'label' => 'Hình thức nhận', 'type' => 'select', 'options' => ['Bản điện tử (PDF)', 'Nhận trực tiếp tại khoa']],
                        ]
                    ],
                    [
                        'id' => 's3', 'name' => 'Đăng ký học lại', 'icon' => 'history',
                        'fields' => [] // Chỉ cần note
                    ],
                ]
            ],
            [
                'category' => 'Khác',
                'items' => [
                    [
                        'id' => 's4', 'name' => 'Làm lại thẻ sinh viên', 'icon' => 'id_card',
                        'fields' => [
                            ['name' => 'reason', 'label' => 'Lý do', 'type' => 'select', 'options' => ['Bị mất', 'Bị hỏng', 'Sai thông tin']],
                        ]
                    ],
                ]
            ]
        ];

        return Inertia::render('Student/Services/Index', [
            'tuitions' => $tuitions,
            'payments' => $payments,
            'myRequests' => $requests,
            'services' => $services,
            'student' => $student->load('user')
        ]);
    }

    public function requestService(Request $request)
    {
        $request->validate([
            'service_id' => 'required',
            'service_name' => 'required',
        ]);

        $student = $request->user()->student;

        ServiceRequest::create([
            'student_id' => $student->id,
            'service_id' => $request->service_id,
            'service_name' => $request->service_name,
            'request_data' => $request->except(['service_id', 'service_name', 'note']),
            'note' => $request->note,
            'status' => 'pending',
        ]);

        return back()->with('success', 'Đã lưu yêu cầu hệ thống một cửa thành công!');
    }
}
