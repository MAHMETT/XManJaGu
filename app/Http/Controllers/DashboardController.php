<?php

namespace App\Http\Controllers;

use App\Models\Availability as AvailabilityModel;
use App\Models\Schedule as ScheduleModel;
use App\Models\Teacher as TeacherModel;
use App\Models\Subject as SubjectModel;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $schedules = ScheduleModel::with(['subject', 'teacher'])
            ->orderBy('day')
            ->orderBy('slot')
            ->get()
            ->groupBy('class')
            ->map(function ($byClass) {
                return $byClass->groupBy('day');
            });

        $teachers = TeacherModel::count();
        $subjects = SubjectModel::count();
        $availabilitys = AvailabilityModel::with('teachers', 'subjects')->count();

        return Inertia::render('dashboard', [
            'schedules' => $schedules,
            'subjects' => $subjects,
            'teachers' => $teachers,
            'availabilitys' => $availabilitys
        ]);
    }
}
