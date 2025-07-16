import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DeleteConfirmation } from '@/components/ui/delete-confirmation';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { LanguageIcon, PencilIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import { Head, Link, usePage } from '@inertiajs/react';
import { useState } from 'react';

interface SubjectData {
    id: string;
    name: string;
    weekly_hours: number;
    created_at: string;
    updated_at: string;
}

interface CustomPageProps {
    data: SubjectData[];
    csrf_token?: string;
    [key: string]: unknown;
    // flash?: { success?: string };
    flash?: { success?: string; error?: string };
    errors?: Record<string, string[]>;
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Pelajaran',
        href: '/subject',
    },
];

export default function IndexSubject() {
    const { props } = usePage<CustomPageProps>();
    const { data } = props;
    const csrfToken = props.csrf_token;

    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard Pelajaran" />

            <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6">
                {/* Statistik Header */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    <Card className="border-border">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">Total Pelajaran</CardTitle>
                            <div className="rounded-lg bg-primary/10 p-2 text-primary">
                                <LanguageIcon className="h-5 w-5" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-foreground">{data.length}</div>
                            <p className="mt-1 text-xs text-muted-foreground">Seluruh Pelajaran terdaftar</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Daftar Pelajaran Section */}
                <Card className="border-border">
                    <div className="flex flex-col items-start justify-between gap-4 p-6 md:flex-row md:items-center md:gap-0">
                        <div>
                            <h1 className="text-lg font-semibold text-foreground">Daftar Pelajaran</h1>
                            <p className="mt-1 text-sm text-muted-foreground">Manajemen data Pelajaran dan informasi pengajar</p>
                        </div>

                        <Button asChild>
                            <Link href="/subject/create">
                                <PlusIcon className="mr-2 h-4 w-4" />
                                Tambah Pelajaran
                            </Link>
                        </Button>
                    </div>

                    <div className="border-t border-border" />

                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[40%]">Nama Pelajaran</TableHead>
                                <TableHead>jam</TableHead>
                                <TableHead className="text-right">Aksi</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {data.map((d) => (
                                <TableRow key={d.id} className="hover:bg-muted/50">
                                    <TableCell className="font-medium">
                                        <div className="flex items-center gap-3">
                                            <Avatar>
                                                <AvatarImage alt={d.name} />
                                                <AvatarFallback className="bg-primary/10 text-primary">
                                                    {d.name.charAt(0).toUpperCase()}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <div className="text-foreground">{d.name}</div>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-muted-foreground">{d.weekly_hours || '-'} jam/minggu</TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button variant="outline" size="icon" asChild>
                                                <Link href={`/subject/${d.id}/edit`}>
                                                    <PencilIcon className="h-4 w-4" />
                                                </Link>
                                            </Button>
                                            <Button
                                                variant="destructive"
                                                size="icon"
                                                type="button"
                                                onClick={() => {
                                                    setShowDeleteConfirm(true);
                                                }}
                                            >
                                                <TrashIcon className="h-4 w-4" />
                                            </Button>
                                            <DeleteConfirmation
                                                action={`/subject/${d.id}`}
                                                isOpen={showDeleteConfirm}
                                                csrfToken={`${csrfToken}`}
                                                onClose={() => setShowDeleteConfirm(false)}
                                                message={`Apakah anda yakin ingin menghapus data pelajaran ${d.name}`}
                                            />
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Card>
            </div>
        </AppLayout>
    );
}
