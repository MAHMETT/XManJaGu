import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { ArrowPathIcon, ListBulletIcon, ViewColumnsIcon } from '@heroicons/react/24/outline';
import type { PageProps as InertiaPageProps } from '@inertiajs/core';
import { Head, router, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';

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
] as const;

const days = [
    { id: '1', name: 'Senin' },
    { id: '2', name: 'Selasa' },
    { id: '3', name: 'Rabu' },
    { id: '4', name: 'Kamis' },
    { id: '5', name: 'Jumat' },
];

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

// Tipe untuk tampilan tabel
type TableViewType = 'horizontal' | 'vertical';

// --- Komponen React ---

export default function ScheduleIndex() {
    return (
        <AppLayout breadcrumbs={[{ title: 'Jadwal Pelajaran', href: route('schedules.index') }]}>
            <Head title="Jadwal Pelajaran" />
            <ScheduleTable />
        </AppLayout>
    );
}

export const ScheduleTable = ({ viewOnly = false }: { viewOnly?: boolean }) => {
    const { schedules, flash } = usePage<PageProps>().props;
    const classKeys = Object.keys(schedules);
    const [activeClass, setActiveClass] = useState<string>(classKeys[0] || '');

    // State untuk tampilan tabel
    const [tableView, setTableView] = useState<TableViewType>('horizontal');

    // Load preferensi tampilan dari localStorage
    useEffect(() => {
        const savedView = localStorage.getItem('scheduleTableView');
        if (savedView === 'horizontal' || savedView === 'vertical') {
            setTableView(savedView);
        }
    }, []);

    // Simpan preferensi tampilan ke localStorage
    const saveTableViewPreference = (viewType: TableViewType) => {
        setTableView(viewType);
        localStorage.setItem('scheduleTableView', viewType);
    };

    const handleGenerate = () => {
        if (viewOnly == false) {
            return null;
        } else {
            if (confirm('Apakah Anda yakin ingin generate ulang jadwal? Proses ini akan menimpa jadwal yang ada.')) {
                router.get(route('schedules.index'), undefined, {
                    preserveScroll: true,
                });
            }
        }
    };
    // Helper untuk mencari jadwal berdasarkan slot
    const findItem = (list: ScheduleItem[], slot: number) => list.find((i) => i.slot === slot);

    // Komponen untuk tampilan horizontal (default)
    const renderHorizontalView = () => (
        <Table className="scrollbar-none min-w-full">
            <TableHeader>
                <TableRow>
                    <TableHead className="sticky left-0 z-10 w-[120px] bg-card">Hari</TableHead>
                    {tableColumns.map((col, index) => (
                        <TableHead key={index} className="min-w-[140px] text-center">
                            <p className="font-medium">{col.type === 'slot' ? `Jam ke ${col.value}` : col.name}</p>
                            <p className="text-sm text-muted-foreground">{col.type !== 'break' ? `${col.time}` : ''}</p>
                        </TableHead>
                    ))}
                </TableRow>
            </TableHeader>
            <TableBody>
                {days.map((day) => {
                    const daySchedule = schedules[activeClass]?.[day.id] || [];
                    return (
                        <TableRow key={day.id} className="hover:bg-muted/10">
                            <TableCell className="sticky left-0 z-10 bg-card font-medium">{day.name}</TableCell>
                            {tableColumns.map((col, index) => {
                                if (col.type === 'break') {
                                    return (
                                        <TableCell key={index} className="bg-muted/30 text-center align-middle text-sm text-muted-foreground">
                                            <div className="font-medium">{col.name}</div>
                                            <div className="text-xs">{col.time}</div>
                                        </TableCell>
                                    );
                                }

                                const item = findItem(daySchedule, col.value);
                                return (
                                    <TableCell key={index} className="text-center align-top">
                                        {item ? (
                                            <div>
                                                <div className="font-semibold">{item.subject.name}</div>
                                                <div className="text-xs text-muted-foreground">{item.teacher?.name || 'Belum ada guru'}</div>
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
    );

    // Komponen untuk tampilan vertikal
    const renderVerticalView = () => (
        <Table className="scrollbar-none min-w-full">
            <TableHeader>
                <TableRow>
                    <TableHead className="sticky left-0 z-10 w-[120px] bg-card">Jam</TableHead>
                    {days.map((day) => (
                        <TableHead key={day.id} className="min-w-[140px] text-center">
                            <p className="font-medium">{day.name}</p>
                        </TableHead>
                    ))}
                </TableRow>
            </TableHeader>
            <TableBody>
                {tableColumns.map((col, colIndex) => (
                    <TableRow key={`col-${colIndex}`} className="hover:bg-muted/10">
                        <TableCell className="sticky left-0 z-10 bg-card font-medium">
                            <div className="flex flex-col">
                                <span className="font-medium">{col.type === 'slot' ? `Jam ke ${col.value}` : col.name}</span>
                                <span className="text-sm text-muted-foreground">{col.time}</span>
                            </div>
                        </TableCell>
                        {days.map((day) => {
                            const daySchedule = schedules[activeClass]?.[day.id] || [];

                            if (col.type === 'break') {
                                return (
                                    <TableCell key={`${day.id}-break`} className="bg-muted/30 text-center align-middle text-sm text-muted-foreground">
                                        <div className="font-medium">{col.name}</div>
                                        <div className="text-xs">{col.time}</div>
                                    </TableCell>
                                );
                            }

                            const item = findItem(daySchedule, col.value);
                            return (
                                <TableCell key={`${day.id}-${colIndex}`} className="text-center align-top">
                                    {item ? (
                                        <div>
                                            <div className="font-semibold">{item.subject.name}</div>
                                            <div className="text-xs text-muted-foreground">{item.teacher?.name || 'Belum ada guru'}</div>
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
                ))}
            </TableBody>
        </Table>
    );

    return (
        <div className="space-y-6 p-4 md:p-6">
            {/* Flash Messages */}
            {flash?.success && <div className="rounded-md bg-green-100 p-4 text-sm text-green-800">{flash.success}</div>}
            {flash?.error && <div className="rounded-md bg-red-100 p-4 text-sm text-red-800">{flash.error}</div>}

            {/* Header: Pemilihan Kelas dan Tombol Aksi */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="flex flex-wrap gap-2">
                    {classKeys.map((cls) => (
                        <Button
                            key={cls}
                            variant={activeClass === cls ? 'default' : 'outline'}
                            onClick={() => setActiveClass(cls)}
                            className="min-w-[80px]"
                        >
                            Kelas {cls}
                        </Button>
                    ))}
                </div>

                <div className="flex flex-wrap gap-2 max-sm:justify-between">
                    <div className="flex items-center gap-1 rounded-md border p-1">
                        <Button
                            variant={tableView === 'horizontal' ? 'default' : 'ghost'}
                            size="icon"
                            onClick={() => saveTableViewPreference('horizontal')}
                            title="Tampilan Horizontal"
                        >
                            <ListBulletIcon className="h-4 w-4" />
                        </Button>
                        <Button
                            variant={tableView === 'vertical' ? 'default' : 'ghost'}
                            size="icon"
                            onClick={() => saveTableViewPreference('vertical')}
                            title="Tampilan Vertikal"
                        >
                            <ViewColumnsIcon className="h-4 w-4" />
                        </Button>
                    </div>

                    {viewOnly ? null : (
                        <Button variant="outline" onClick={handleGenerate}>
                            <ArrowPathIcon className="mr-2 h-4 w-4" /> Generate Ulang
                        </Button>
                    )}
                </div>
            </div>

            {/* Konten Jadwal */}
            {!activeClass || !schedules[activeClass] || Object.keys(schedules[activeClass]).length === 0 ? (
                <EmptyState
                    title="Jadwal Belum Tersedia"
                    description="Silakan pilih kelas atau generate jadwal jika belum ada."
                    action={
                        viewOnly ? null : (
                            <Button onClick={handleGenerate}>
                                <ArrowPathIcon className="mr-2 h-4 w-4" /> Generate Jadwal
                            </Button>
                        )
                    }
                />
            ) : (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                            <span>Jadwal Pelajaran Kelas {activeClass}</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="custom-scrollbar overflow-x-auto">
                        {tableView === 'horizontal' ? renderHorizontalView() : renderVerticalView()}
                    </CardContent>
                </Card>
            )}
        </div>
    );
};
