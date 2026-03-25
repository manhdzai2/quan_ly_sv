<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreEnrollmentRequest extends FormRequest
{
    public function authorize(): bool
    {
        // Teacher/Admin tạo enrollment
        return true;
    }

    public function rules(): array
    {
        return [
            'student_id' => ['required', 'exists:students,id'],
            'subject_id' => ['required', 'exists:subjects,id'],
            'teacher_id' => ['nullable', 'exists:teachers,id'],
            'term'       => ['nullable', 'string', 'max:50',
                Rule::unique('enrollments')->where(function ($q) {
                    return $q->where('student_id', $this->input('student_id'))
                             ->where('subject_id', $this->input('subject_id'));
                })
            ],
        ];
    }
}
