<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Submission extends Model
{
    protected $fillable = ['assignment_id', 'student_id', 'file_path', 'file_name', 'submitted_at', 'score', 'feedback', 'is_late'];

    protected $casts = [
        'submitted_at' => 'datetime',
        'is_late' => 'boolean',
        'score' => 'decimal:2',
    ];

    public function assignment(): BelongsTo { return $this->belongsTo(Assignment::class); }
    public function student(): BelongsTo { return $this->belongsTo(Student::class); }
}
