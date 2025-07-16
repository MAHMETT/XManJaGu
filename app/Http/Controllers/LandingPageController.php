<?php

namespace App\Http\Controllers;

use App\Models\Schedule as ScheduleModel;
use Inertia\Inertia;
class LandingPageController extends Controller
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

        return Inertia::render('welcome', [
            'schedules' => $schedules,
        ]);
    }
}
