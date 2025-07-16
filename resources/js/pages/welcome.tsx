import { OneTimeWelcomePopup } from '@/components/oneTimePopUpWelcome';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { type SharedData } from '@/types';
import { ListBulletIcon, ViewColumnsIcon } from '@heroicons/react/24/outline';
import type { PageProps as InertiaPageProps } from '@inertiajs/core';
import { Head, Link, usePage } from '@inertiajs/react';
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

export default function Welcome() {
    const { auth } = usePage<SharedData>().props;
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

    // Helper untuk mencari jadwal berdasarkan slot
    const findItem = (list: ScheduleItem[], slot: number) => list.find((i) => i.slot === slot);

    // Komponen untuk tampilan horizontal (default)
    const renderHorizontalView = () => (
        <Table className="min-w-full">
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
        <Table className="min-w-full">
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
        <>
            <Head title="Welcome">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
            </Head>
            <OneTimeWelcomePopup />
            <div className="flex min-h-screen flex-col items-center bg-[#FDFDFC] p-6 text-[#1b1b18] lg:justify-center lg:p-8 dark:bg-[#0a0a0a]">
                <header className="mb-6 w-full max-w-[335px] text-sm not-has-[nav]:hidden lg:max-w-4xl">
                    <nav className="flex items-center justify-between gap-4">
                        <h1 className="text-lg font-bold text-[#1b1b18] dark:text-[#EDEDEC]">XManJaGu</h1>
                        {auth.user ? (
                            <Link
                                href={route('dashboard')}
                                className="inline-block rounded-sm border border-[#19140035] px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#1915014a] dark:border-[#3E3E3A] dark:text-[#EDEDEC] dark:hover:border-[#62605b]"
                            >
                                Dashboard
                            </Link>
                        ) : (
                            <>
                                <Link
                                    href={route('login')}
                                    className="inline-block rounded-sm border border-transparent px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#19140035] dark:text-[#EDEDEC] dark:hover:border-[#3E3E3A]"
                                >
                                    Log in
                                </Link>
                                <Link
                                    href={route('register')}
                                    className="inline-block rounded-sm border border-[#19140035] px-5 py-1.5 text-sm leading-normal text-[#1b1b18] hover:border-[#1915014a] dark:border-[#3E3E3A] dark:text-[#EDEDEC] dark:hover:border-[#62605b]"
                                >
                                    Register
                                </Link>
                            </>
                        )}
                    </nav>
                </header>
                <div className="flex w-7/10 items-center justify-center opacity-100 transition-opacity duration-750 lg:grow starting:opacity-0">
                    <div className="min-w-full space-y-6 p-4 md:p-6">
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
                            </div>
                        </div>

                        {/* Konten Jadwal */}
                        {!activeClass || !schedules[activeClass] || Object.keys(schedules[activeClass]).length === 0 ? (
                            <EmptyState title="Jadwal Belum Tersedia" description="Silakan pilih kelas atau generate jadwal jika belum ada." />
                        ) : (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center justify-between">
                                        <span>Jadwal Pelajaran Kelas {activeClass}</span>
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="custom-scrollbar flex justify-center overflow-x-auto">
                                    {tableView === 'horizontal' ? renderHorizontalView() : renderVerticalView()}
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>
                <div className="hidden h-14.5 lg:block"></div>
            </div>
        </>
    );
}
