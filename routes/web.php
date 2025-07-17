<?php

use App\Http\Controllers\AvailabilityController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\LandingPageController;
use App\Http\Controllers\ScheduleController;
use App\Http\Controllers\SubjectController;
use App\Http\Controllers\TeacherController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Route::get('/', function () {
//     return Inertia::render('welcome');
// })->name('home');

Route::resource("/", LandingPageController::class)->only("index")->name('index', 'home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');

    //teacher & subject
    Route::resource('teacher', TeacherController::class)->only('index', 'create', 'store', 'edit', 'update', 'destroy');
    Route::resource('subject', SubjectController::class)->only('index', 'create', 'store', 'edit', 'update', 'destroy');
    Route::resource('availability', AvailabilityController::class)->only('index', 'create', 'store', 'destroy');

    // schedule
    Route::get('/schedules', [ScheduleController::class, 'index'])->name('schedules.index');
    Route::post('/schedules/generate', [ScheduleController::class, 'generate'])->name('schedules.generate');
    ;
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
