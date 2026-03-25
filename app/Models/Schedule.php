<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Schedule extends Model
{
    use HasFactory;

    protected $guarded = []; // Cho phép lưu tất cả các cột

    // Liên kết: Lịch học thuộc về 1 Môn học
    public function subject()
    {
        return $this->belongsTo(Subject::class);
    }
}