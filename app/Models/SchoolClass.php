<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class SchoolClass extends Model
{
    protected $table = 'classes';

    protected $fillable = ['name', 'description'];

    public function students(): HasMany
    {
        return $this->hasMany(Student::class, 'class_id');
    }
}
