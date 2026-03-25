<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Attendance extends Model
{
    protected $fillable = [
        'enrollment_id',
        'date',
        'status', // present, absent_excused, absent_unexcused, late
        'note',
    ];

    protected $casts = [
        'date' => 'date',
    ];

    // Liên kết: Điểm danh thuộc về 1 Enrollment (SV + Môn)
    public function enrollment(): BelongsTo
    {
        return $this->belongsTo(Enrollment::class);
    }
}
