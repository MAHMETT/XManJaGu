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

    // public function generate()
    // {
    //     // Hapus jadwal lama
    //     DB::table('schedules')->truncate();

    //     // Konstanta
    //     $classes = ['10', '11', '12'];
    //     $days = range(1, 5);    // Senin–Jumat
    //     $slots = range(1, 9);    // slot 1..9
    //     $maxPerDay = 3;           // max slot per hari per mata pelajaran

    //     // Siapkan slot kosong per kelas & hari
    //     $free = [];
    //     foreach ($classes as $cls) {
    //         foreach ($days as $day) {
    //             $free[$cls][$day] = collect($slots)->shuffle()->toArray();
    //         }
    //     }

    //     // Track slot yang sudah dipakai per kelas–hari–mapel
    //     $scheduled = [];

    //     // Ambil semua availability
    //     $avails = AvailabilityModel::with(['teacher', 'subject'])
    //         ->orderBy('class')->get();

    //     try {
    //         DB::transaction(function () use ($avails, &$free, &$scheduled, $days, $maxPerDay) {
    //             foreach ($avails as $avail) {
    //                 $classId = $avail->class;
    //                 $teacherId = $avail->teacher_id;
    //                 $subjectId = $avail->subject_id;
    //                 $needed = $avail->subject->weekly_hours;

    //                 // Hitung per hari berapa sudah dijadwal
    //                 $dailyCount = array_fill_keys($days, 0);

    //                 while ($needed > 0) {
    //                     // Pilih hari acak yang belum full
    //                     $dayPool = array_filter($days, fn($d) => $dailyCount[$d] < $maxPerDay && count($free[$classId][$d]) > 0);
    //                     if (empty($dayPool)) {
    //                         throw new \Exception("Tidak ada slot kosong tersisa untuk kelas $classId");
    //                     }
    //                     $day = $dayPool[array_rand($dayPool)];

    //                     // Ambil daftar slot kosong hari itu
    //                     $slotsDay = $free[$classId][$day];

    //                     // Cek kalau sudah ada jadwal mapel ini di hari tersebut
    //                     $existing = $scheduled[$classId][$day][$subjectId] ?? [];

    //                     if (!empty($existing)) {
    //                         // Cari slot terdekat: hitung jarak minimal ke salah satu existing
    //                         $slotsWithDist = collect($slotsDay)->map(fn($s) => [
    //                             'slot' => $s,
    //                             'dist' => min(array_map(fn($e) => abs($e - $s), $existing))
    //                         ]);
    //                         // Urut naik berdasarkan jarak
    //                         $best = $slotsWithDist->sortBy('dist')->values()->first();
    //                         $slot = $best['slot'];
    //                     } else {
    //                         // Pertama kali: pilih slot random
    //                         $slot = $slotsDay[array_rand($slotsDay)];
    //                     }

    //                     // Simpan ke DB
    //                     ScheduleModel::create([
    //                         'class' => $classId,
    //                         'day' => $day,
    //                         'slot' => $slot,
    //                         'subject_id' => $subjectId,
    //                         'teacher_id' => $teacherId,
    //                     ]);

    //                     // Update struktur
    //                     $dailyCount[$day]++;
    //                     // Hapus slot dari free pool
    //                     $free[$classId][$day] = array_values(array_diff($slotsDay, [$slot]));
    //                     // Catat penggunaan mapel di hari itu
    //                     $scheduled[$classId][$day][$subjectId][] = $slot;

    //                     $needed--;
    //                 }
    //             }
    //         });
    //     } catch (\Throwable $e) {
    //         return back()->withErrors('Gagal generate jadwal: ' . $e->getMessage());
    //     }

    //     return redirect()
    //         ->route('schedules.index')
    //         ->with('success', 'Jadwal berhasil digenerate ulang!');
    // }


    // public function generate()
    // {
    //     DB::table('schedules')->truncate();

    //     // Validasi: paling tidak ada 1 availability
    //     $avails = AvailabilityModel::with(['teacher', 'subject'])
    //         ->orderBy('class')
    //         ->get();
    //     if ($avails->isEmpty()) {
    //         return back()->withErrors('Tidak ada data availability, generate dibatalkan.');
    //     }


    //     // Konstanta
    //     $classes = ['10', '11', '12'];
    //     $days = range(1, 5);      // Senin–Jumat
    //     $slots = range(1, 9);      // slot 1..9 (break di 4 & 7 pun dihitung tapi akan di-skip jika mau)

    //     // Siapkan struktur slot kosong terurut per kelas & hari
    //     $free = [];
    //     foreach ($classes as $cls) {
    //         foreach ($days as $day) {
    //             // misal skip slot istirahat (4 & 7) jika perlu:
    //             $validSlots = collect($slots)
    //                 // ->reject(fn($s) => in_array($s, [4,7]))
    //                 ->sort()
    //                 ->values()
    //                 ->toArray();
    //             $free[$cls][$day] = $validSlots;
    //         }
    //     }

    //     try {
    //         DB::transaction(function () use ($avails, &$free, $days) {
    //             foreach ($avails as $avail) {
    //                 $classId = $avail->class;
    //                 $teacher = $avail->teacher;
    //                 $subj = $avail->subject;
    //                 $remaining = $subj->weekly_hours;
    //                 // max per day misal 3 slot
    //                 $maxPerDay = 3;
    //                 // catat berapa sudah di satu hari
    //                 $dailyCount = array_fill_keys($days, 0);

    //                 // 1) Buat blok‐blok alokasi: tiap blok ≤ maxPerDay
    //                 $blocks = [];
    //                 while ($remaining > 0) {
    //                     $take = min($remaining, $maxPerDay);
    //                     $blocks[] = $take;
    //                     $remaining -= $take;
    //                 }

    //                 // 2) Untuk tiap blok: cari hari & segmen kontigu
    //                 foreach ($blocks as $blockSize) {
    //                     $placed = false;
    //                     // urut hari berdasarkan paling sedikit terpakai
    //                     $daysSorted = collect($dailyCount)
    //                         ->sort()
    //                         ->keys()
    //                         ->toArray();

    //                     foreach ($daysSorted as $day) {
    //                         // jika hari itu masih bisa muat blockSize
    //                         if ($dailyCount[$day] + $blockSize > $maxPerDay) {
    //                             continue;
    //                         }
    //                         $slotsDay = $free[$classId][$day];
    //                         // cari segmen kontigu dengan sliding window
    //                         for ($i = 0; $i <= count($slotsDay) - $blockSize; $i++) {
    //                             $seg = array_slice($slotsDay, $i, $blockSize);
    //                             // cek benar‐benar kontigu?
    //                             if ($seg === range($seg[0], $seg[0] + $blockSize - 1)) {
    //                                 // alokasi ke DB & update free + dailyCount
    //                                 foreach ($seg as $slot) {
    //                                     ScheduleModel::create([
    //                                         'class' => $classId,
    //                                         'day' => $day,
    //                                         'slot' => $slot,
    //                                         'subject_id' => $subj->id,
    //                                         'teacher_id' => $teacher->id,
    //                                     ]);
    //                                     // buang slot itu
    //                                     $free[$classId][$day] = array_diff(
    //                                         $free[$classId][$day],
    //                                         [$slot]
    //                                     );
    //                                 }
    //                                 $dailyCount[$day] += $blockSize;
    //                                 $placed = true;
    //                                 break 2; // keluar kedua loop
    //                             }
    //                         }
    //                     }

    //                     // 3) Fallback: kalau gak ketemu kontigu, taruh acak di hari bebas
    //                     if (!$placed) {
    //                         foreach ($days as $day) {
    //                             if ($dailyCount[$day] >= $maxPerDay) {
    //                                 continue;
    //                             }
    //                             $slotsDay = $free[$classId][$day];
    //                             if (count($slotsDay) < $blockSize) {
    //                                 continue;
    //                             }
    //                             // ambil blockSize slot pertama di sini
    //                             $sel = array_slice($slotsDay, 0, $blockSize);
    //                             foreach ($sel as $slot) {
    //                                 ScheduleModel::create([
    //                                     'class' => $classId,
    //                                     'day' => $day,
    //                                     'slot' => $slot,
    //                                     'subject_id' => $subj->id,
    //                                     'teacher_id' => $teacher->id,
    //                                 ]);
    //                                 $free[$classId][$day] = array_diff(
    //                                     $free[$classId][$day],
    //                                     [$slot]
    //                                 );
    //                             }
    //                             $dailyCount[$day] += $blockSize;
    //                             break;
    //                         }
    //                     }
    //                 }
    //             }
    //         });
    //     } catch (\Throwable $e) {
    //         return back()
    //             ->withErrors('Gagal generate jadwal: ' . $e->getMessage());
    //     }

    //     return redirect()
    //         ->route('schedules.index')
    //         ->with('success', 'Jadwal berhasil digenerate ulang!');
    // }


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

                    if (!empty($busy[$teacherId][$day][$slot] ?? false)) {
                        continue;
                    }

                    if ($dailyCount[$day] >= 3) {
                        continue;
                    }

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
        });

        return redirect()
            ->route('schedules.index')
            ->with('success', 'Jadwal berhasil digenerate ulang!');
    }
}
