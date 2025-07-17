import TotalCard from '@/components/total-card';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { ScheduleTable } from './Schedules';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

interface DashboardProps {
    teachers: number;
    subjects: number;
    availabilitys: number;
    [key: string]: unknown;
}

export default function Dashboard() {
    const { props } = usePage<DashboardProps>();
    const { teachers, subjects, availabilitys } = props;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                    <div className="relative overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                        <TotalCard title="Total Guru" length={teachers} />
                    </div>
                    <div className="relative overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                        <TotalCard title="Total Pelajaran" length={subjects} />
                    </div>
                    <div className="relative overflow-hidden rounded-xl border border-sidebar-border/70 dark:border-sidebar-border">
                        <TotalCard title="Total Guru Availabilty" length={availabilitys} />
                    </div>
                </div>
                <div className="relative min-h-[100vh] flex-1 overflow-hidden rounded-xl border border-sidebar-border/70 md:min-h-min dark:border-sidebar-border">
                    <ScheduleTable viewOnly />
                </div>
            </div>
        </AppLayout>
    );
}
