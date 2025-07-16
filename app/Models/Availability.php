<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Availability extends Model
{
    use HasFactory;

    protected $fillable = ['teacher_id', 'subject_id', 'class'];

    public function teacher()
    {
        return $this->belongsTo(Teacher::class);
    }
    public function subject()
    {
        return $this->belongsTo(Subject::class);
    }
    public function schedules()
    {
        return $this->hasMany(Schedule::class, 'teacher_id', 'teacher_id');
    }
}
