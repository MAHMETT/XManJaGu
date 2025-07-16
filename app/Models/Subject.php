<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Subject extends Model
{
    use HasFactory;
    // protected $table = "subjects";
    protected $fillable = ['name', 'weekly_hours'];

    public function teachers()
    {
        return $this->belongsToMany(Teacher::class);
    }

    public function schedules()
    {
        return $this->hasMany(Schedule::class);
    }

    public function availability()
    {
        return $this->hasMany(Availability::class);
    }
}
