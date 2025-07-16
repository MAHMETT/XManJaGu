<?php

namespace App\Http\Controllers;

use App\Models\Subject;
use App\Models\Teacher as TeacherModel;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TeacherController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // $data = TeacherModel::orderBy("name", "asc")->get();
        $data = TeacherModel::all();
        return Inertia::render("Teacher/index", [
            "data" => $data,
            "csrf_token" => csrf_token(),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render("Teacher/create");
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            "name" => "required|string|min:1|max:255",
            "nip" => "required|string|min:1|max:255|unique:teachers,nip",
        ]);

        TeacherModel::create($request->only('name', 'nip'));

        return redirect()->route("teacher.index")->with("success", "Guru berhasil ditambahkan");
    }


    /**
     * Show the form for editing the specified resource.
     */

    public function edit(TeacherModel $teacher)
    {


        return Inertia::render('Teacher/edit', [
            'teacher' => $teacher
        ]);
    }
    /**
     * Update the specified resource in storage.
     */

    public function update(Request $request, TeacherModel $teacher)
    {
        $request->validate([
            "name" => "required|string|min:1|max:255",
            "nip" => [
                'required',
                'string',
                'min:1',
                'max:255',
                'unique:teachers,nip,' . $teacher->id,
            ],
        ]);
        $teacher->update($request->only('name', 'nip'));
        return redirect()->route("teacher.index")->with("success", "Guru berhasil diupdate");
    }



    /**
     * Remove the specified resource from storage.
     */
    public function destroy(TeacherModel $teacher)
    {
        $teacher->delete();
        return redirect()->route('teacher.index')->with('success', 'Guru berhasil dihapus');
    }
}
