<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreScoreRequest extends FormRequest
{
    public function authorize(): bool
    {
        // Có thể kiểm tra quyền: return $this->user()?->isTeacher() || $this->user()?->isAdmin();
        return true;
    }

    public function rules(): array
    {
        return [
            'enrollment_id'    => ['required', 'exists:enrollments,id'],
            'attendance_score' => ['required', 'numeric', 'between:0,10'],
            'midterm_score'    => ['required', 'numeric', 'between:0,10'],
            'final_score'      => ['required', 'numeric', 'between:0,10'],
        ];
    }

    public function messages(): array
    {
        return [
            'enrollment_id.required' => 'Thiếu enrollment_id.',
            'enrollment_id.exists'   => 'Enrollment không tồn tại.',
            '*.numeric'              => 'Điểm phải là số.',
            '*.between'              => 'Điểm phải trong khoảng 0 đến 10.',
        ];
    }
}
