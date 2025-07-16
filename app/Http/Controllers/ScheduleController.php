<?php

namespace App\Http\Controllers;

use App\Models\Availability as AvailabilityModel;
use App\Models\Schedule as ScheduleModel;
use App\Models\Subject as SubjectModel;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class ScheduleController extends Controller
{
    /**
     * Tampilkan jadwal per kelas, hari, dan slot
     */
    public function index()
    {
        // Ambil semua jadwal, group by class → day → slot
        $schedules = ScheduleModel::with(['subject', 'teacher'])
            ->orderBy('day')
            ->orderBy('slot')
            ->get()
            ->groupBy('class')
            ->map(function ($byClass) {
                return $byClass->groupBy('day');
            });

        return Inertia::render('Schedules/index', [
            'schedules' => $schedules,
        ]);
    }

    /**
     * Generate ulang semua jadwal untuk kelas 10,11,12
     */
    public function generate()
    {
        // Hapus jadwal lama
        DB::table('schedules')->truncate();

        // Definisi kelas, hari, dan slot (9 slot per hari, dengan 2 break)
        $classes = ['10', '11', '12'];
        $days = range(1, 5);    // 1 = Senin ... 5 = Jumat
        $slots = range(1, 9);    // slot 1..3, break, 4..6, break, 7..9

        // Siapkan semua slot kosong per kelas
        $availableSlots = [];
        foreach ($classes as $class) {
            $availableSlots[$class] = [];
            foreach ($days as $day) {
                foreach ($slots as $slot) {
                    $availableSlots[$class][] = ['day' => $day, 'slot' => $slot];
                }
            }
            shuffle($availableSlots[$class]);
        }

        // Track penggunaan guru: [teacher_id][day][slot] => true
        $busy = [];

        // Ambil semua availability (teacher–subject–class)
        $avails = AvailabilityModel::with(['teacher', 'subject'])
            ->orderBy('class')
            ->get();

        DB::transaction(function () use ($avails, &$availableSlots, &$busy) {
            foreach ($avails as $avail) {
                $teacherId = $avail->teacher_id;
                $subject = $avail->subject;
                $class = $avail->class;
                $needed = $subject->weekly_hours;

                // Buat counter per hari agar tidak semua di satu hari
                $dailyCount = array_fill(1, 5, 0);

                while ($needed > 0 && count($availableSlots[$class])) {
                    // Ambil slot acak
                    $slotInfo = array_shift($availableSlots[$class]);
                    $day = $slotInfo['day'];
                    $slot = $slotInfo['slot'];

                    // Cek apakah guru sudah sibuk di hari/slot ini (kelas lain)
                    if (!empty($busy[$teacherId][$day][$slot] ?? false)) {
                        // conflict, skip slot ini
                        continue;
                    }

                    // Batasi maksimum 1 jam per hari per guru per subject
                    if ($dailyCount[$day] >= 1) {
                        // sudah dapat 1 slot hari ini, cari hari lain
                        continue;
                    }

                    // Simpan schedule
                    Schedulemodel::create([
                        'class' => $class,
                        'day' => $day,
                        'slot' => $slot,
                        'subject_id' => $subject->id,
                        'teacher_id' => $teacherId,
                    ]);

                    // Tandai guru sibuk di slot ini
                    $busy[$teacherId][$day][$slot] = true;

                    // Hitung usage
                    $dailyCount[$day]++;
                    $needed--;
                }
            }

            // Untuk slot yang masih kosong (tidak dialokasikan oleh availability apa pun),
            // kita bisa isi hanya subject saja atau biarkan kosong sesuai kebutuhan.
            // Contoh: isi semua slot kosong dengan subject berlabel '—'
            // foreach ($availableSlots as $class => $slotsLeft) {
            //     foreach ($slotsLeft as $slotInfo) {
            //         Schedule::create([
            //             'class'      => $class,
            //             'day'        => $slotInfo['day'],
            //             'slot'       => $slotInfo['slot'],
            //             'subject_id' => null,
            //             'teacher_id' => null,
            //         ]);
            //     }
            // }
        });

        return redirect()
            ->route('schedules.index')
            ->with('success', 'Jadwal berhasil digenerate ulang!');
    }
}
