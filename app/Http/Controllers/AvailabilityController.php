<?php

namespace App\Http\Controllers;

use App\Models\Availability as AvailabilityModel;
use App\Models\Subject as SubjectModel;
use App\Models\Teacher as TeacherModel;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class AvailabilityController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $data = AvailabilityModel::with('teacher', 'Subject')->get();
        return Inertia::render("Availability/index", ["data" => $data, "csrf_token" => csrf_token()]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $subjects = SubjectModel::all();
        $teacher = TeacherModel::all();
        return Inertia::render("Availability/create", ["subjects" => $subjects, "teachers" => $teacher]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        try {
            $validatedData = $request->validate([
                'teacher_id' => 'required|exists:teachers,id',
                'subject_id' => 'required|exists:subjects,id',
                'class' =>
                    'required|integer|in:10,11,12',
            ]);

            $dataExist = AvailabilityModel::where('teacher_id', $validatedData['teacher_id'])->where('subject_id', $validatedData['subject_id'])->where('class', $validatedData['class'])->exists();
            if ($dataExist) {
                return back()->withErrors(['duplicate' => 'Data availability sudah ada'])->withInput();
                // return redirect()->route("availability.index")->with("success", "Guru berhasil ditambahkan");
            }

            AvailabilityModel::create($validatedData);
            return redirect()->route("availability.index")->with("success", "Guru berhasil ditambahkan");

        } catch (\Illuminate\Validation\ValidationException $e) {
            return back()->withErrors($e->validator)->withInput();
        } catch (\Illuminate\Database\QueryException $e) {
            Log::error('DB error saat insert availability: ' . $e->getMessage());
            return back()->withErrors([
                'database' => 'Gagal menyimpan data. Silakan coba lagi.',
            ])->withInput();
        } catch (\Throwable $e) {
            Log::error('Error tak terduga: ' . $e->getMessage());
            return back()->withErrors([
                'fatal' => 'Terjadi kesalahan tak terduga.',
            ])->withInput();
        }
    }
    public function destroy(AvailabilityModel $availability)
    {
        try {
            $availability->delete();
            return redirect()->route('availability.index')->with('success', 'Berhasil menghapus data');
        } catch (\Throwable $th) {
            //throw $th;
        }
    }
}
