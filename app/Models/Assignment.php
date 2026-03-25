<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Assignment extends Model
{
    protected $fillable = ['subject_id', 'teacher_id', 'title', 'description', 'file_path', 'file_name', 'deadline', 'max_score', 'is_locked'];

    protected $casts = [
        'deadline' => 'datetime',
        'is_locked' => 'boolean',
        'max_score' => 'decimal:2',
    ];

    public function subject(): BelongsTo { return $this->belongsTo(Subject::class); }
    public function teacher(): BelongsTo { return $this->belongsTo(Teacher::class); }
    public function submissions(): HasMany { return $this->hasMany(Submission::class); }
}
