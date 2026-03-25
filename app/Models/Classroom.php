<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Classroom extends Model
{
    use HasFactory;

    // Các trường được phép thêm/sửa
    protected $fillable = [
        'name',
        'subject_id',
        'room',
    ];

    // Mối quan hệ: Lớp học thuộc về 1 Môn học
    public function subject()
    {
        return $this->belongsTo(Subject::class);
    }
}