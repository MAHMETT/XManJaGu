import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { ArrowPathIcon } from '@heroicons/react/24/outline';
import type { PageProps as InertiaPageProps } from '@inertiajs/core';
import { Head, router, usePage } from '@inertiajs/react';
import { useState } from 'react';

// --- DATA STRUKTUR YANG DIPERBAIKI ---

// 1. Representasi setiap kolom di tabel jadwal.
// Menggabungkan slot, nama, dan waktu istirahat dalam satu struktur data.
const tableColumns = [
    { type: 'slot', value: 1, time: '07:00 - 07:45' },
    { type: 'slot', value: 2, time: '07:45 - 08:30' },
    { type: 'slot', value: 3, time: '08:30 - 09:15' },
    { type: 'break', name: 'Istirahat Pagi', time: '09:15 - 09:45' },
    { type: 'slot', value: 4, time: '09:45 - 10:30' },
    { type: 'slot', value: 5, time: '10:30 - 11:15' },
    { type: 'slot', value: 6, time: '11:15 - 11:45' },
    { type: 'break', name: 'Istirahat Siang', time: '11:45 - 12:30' },
    { type: 'slot', value: 7, time: '12:30 - 13:15' },
    { type: 'slot', value: 8, time: '13:15 - 14:00' },
    { type: 'slot', value: 9, time: '14:00 - 15:15' },
] as const; // `as const` untuk type-safety yang lebih kuat

// 2. Data hari yang lebih eksplisit dengan `id` dan `name`.
const days = [
    { id: '1', name: 'Senin' },
    { id: '2', name: 'Selasa' },
    { id: '3', name: 'Rabu' },
    { id: '4', name: 'Kamis' },
    { id: '5', name: 'Jumat' },
];

// --- Tipe Data (Interfaces) ---

interface ScheduleItem {
    slot: number;
    subject: { name: string };
    teacher?: { name: string };
}

interface ClassSchedules {
    [dayId: string]: ScheduleItem[];
}

interface PageProps extends InertiaPageProps {
    schedules: Record<string, ClassSchedules>;
    flash?: { success?: string; error?: string };
}

// --- Komponen React ---

export default function ScheduleIndex() {
    const { schedules, flash } = usePage<PageProps>().props;
    const classKeys = Object.keys(schedules);
    const [activeClass, setActiveClass] = useState<string>(classKeys[0] || '');

    const handleGenerate = () => {
        if (confirm('Apakah Anda yakin ingin generate ulang jadwal? Proses ini akan menimpa jadwal yang ada.')) {
            router.post(route('schedules.generate'), undefined, {
                preserveScroll: true,
            });
        }
    };

    // Helper untuk mencari jadwal berdasarkan slot, tidak ada perubahan.
    const findItem = (list: ScheduleItem[], slot: number) => list.find((i) => i.slot === slot);

    return (
        <AppLayout breadcrumbs={[{ title: 'Jadwal Pelajaran', href: route('schedules.index') }]}>
            <Head title="Jadwal Pelajaran" />
            <div className="space-y-6 p-4 md:p-6">
                {/* Flash Messages */}
                {flash?.success && <div className="rounded-md bg-green-100 p-4 text-sm text-green-800">{flash.success}</div>}
                {flash?.error && <div className="rounded-md bg-red-100 p-4 text-sm text-red-800">{flash.error}</div>}

                {/* Header: Pemilihan Kelas dan Tombol Aksi */}
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div className="flex flex-wrap gap-2">
                        {classKeys.map((cls) => (
                            <Button key={cls} variant={activeClass === cls ? 'default' : 'outline'} onClick={() => setActiveClass(cls)}>
                                Kelas {cls}
                            </Button>
                        ))}
                    </div>
                    <div className="flex flex-wrap gap-2">
                        <Button variant="outline" onClick={handleGenerate}>
                            <ArrowPathIcon className="mr-2 h-4 w-4" /> Generate Ulang
                        </Button>
                    </div>
                </div>

                {/* Konten Jadwal */}
                {!activeClass || !schedules[activeClass] || Object.keys(schedules[activeClass]).length === 0 ? (
                    <EmptyState
                        title="Jadwal Belum Tersedia"
                        description="Silakan pilih kelas atau generate jadwal jika belum ada."
                        action={
                            <Button onClick={handleGenerate}>
                                <ArrowPathIcon className="mr-2 h-4 w-4" /> Generate Jadwal
                            </Button>
                        }
                    />
                ) : (
                    <Card>
                        <CardHeader>
                            <CardTitle>Jadwal Pelajaran Kelas {activeClass}</CardTitle>
                        </CardHeader>
                        <CardContent className="overflow-x-auto">
                            <Table className="min-w-full">
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="sticky left-0 z-10 w-[120px] bg-card">Hari</TableHead>
                                        {tableColumns.map((col, index) => (
                                            <TableHead key={index} className="min-w-[140px] text-center">
                                                <p className="">{col.type === 'slot' ? `Jam ke ${col.value}` : col.name}</p>
                                                <p className="text-sm">{col.type !== 'break' ? `${col.time}` : ''}</p>
                                            </TableHead>
                                        ))}
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {days.map((day) => {
                                        const daySchedule = schedules[activeClass]?.[day.id] || [];
                                        return (
                                            <TableRow key={day.id}>
                                                <TableCell className="sticky left-0 z-10 bg-card font-medium">{day.name}</TableCell>
                                                {tableColumns.map((col, index) => {
                                                    if (col.type === 'break') {
                                                        return (
                                                            <TableCell
                                                                key={index}
                                                                className="bg-muted/50 text-center align-middle text-sm text-muted-foreground italic"
                                                            >
                                                                {/* <div>{col.name}</div> */}
                                                                {/* <div className="text-xs font-normal">{col.time}</div> */}
                                                                {'-'}
                                                            </TableCell>
                                                        );
                                                    }

                                                    const item = findItem(daySchedule, col.value);
                                                    return (
                                                        <TableCell key={index} className="align-top">
                                                            {item ? (
                                                                <div>
                                                                    <div className="font-semibold">{item.subject.name}</div>
                                                                    <div className="text-xs text-muted-foreground">
                                                                        {item.teacher?.name || 'Belum ada guru'}
                                                                    </div>
                                                                </div>
                                                            ) : (
                                                                <div className="flex h-full items-center justify-center">
                                                                    <Badge variant="outline" className="font-normal">
                                                                        -
                                                                    </Badge>
                                                                </div>
                                                            )}
                                                        </TableCell>
                                                    );
                                                })}
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                )}
            </div>
        </AppLayout>
    );
}
