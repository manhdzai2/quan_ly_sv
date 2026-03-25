<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateScoreRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'attendance_score' => ['sometimes', 'numeric', 'between:0,10'],
            'midterm_score'    => ['sometimes', 'numeric', 'between:0,10'],
            'final_score'      => ['sometimes', 'numeric', 'between:0,10'],
        ];
    }

    public function messages(): array
    {
        return [
            '*.numeric'  => 'Điểm phải là số.',
            '*.between'  => 'Điểm phải trong khoảng 0 đến 10.',
        ];
    }
}
