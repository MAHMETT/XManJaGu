<?php

namespace App\Http\Controllers;

use App\Models\Subject as SubjectModel;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SubjectController extends Controller
{
    public function index()
    {
        $data = SubjectModel::all();
        return Inertia::render('Subject/index', [
            'data' => $data,
            'csrf_token' => csrf_token(),
        ]);
    }

    public function create()
    {
        return Inertia::render('Subject/create');
    }

    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'name' => 'required',
            'weekly_hours' => 'required|integer|min:1',
        ]);

        SubjectModel::create($validatedData);

        return redirect()->route('subject.index')->with('success', 'Mata pelajaran berhasil ditambahkan');
    }

    public function edit(SubjectModel $subject)
    {
        return Inertia::render("Subject/edit", [
            'subject' => $subject,
        ]);
    }

    public function update(Request $request, SubjectModel $subject)
    {
        $validatedData = $request->validate([
            'name' => 'required',
            'weekly_hours' => 'required|integer|min:1',
        ]);
        $subject->update($validatedData);
        return redirect()->route("subject.index")->with("success", "Subject berhasil diupdate");
    }

    public function destroy(SubjectModel $subject)
    {
        $subject->delete();
        return redirect()->route('subject.index')->with('success', 'Mata pelajaran berhasil dihapus');
    }

}
