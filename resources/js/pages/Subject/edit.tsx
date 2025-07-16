import { FormContainer } from '@/components/forms/formContainer';
import { InputField } from '@/components/forms/inputField';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm, usePage } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard Pelajaran',
        href: '/subject',
    },
    {
        title: 'Edit Pelajaran',
        href: '/subject/create',
    },
];

interface SubjectData {
    id: string;
    name: string;
    weekly_hours: number;
}

interface EditSubjectProps {
    subject: SubjectData;
    [key: string]: unknown;
}

export default function EditSubject() {
    const { props } = usePage<EditSubjectProps>();
    const { subject } = props;

    // --- DEBUGGING ---
    console.log('Props received:', props);
    console.log('Subject data received:', subject);
    // --- AKHIR KODE DEBUGGING ---

    // Validasi weekly_hours itu null atau nggak
    const initialWeeklyHours = subject.weekly_hours == null ? 0 : subject.weekly_hours;

    const { data, setData, put, errors } = useForm({
        name: subject.name,
        weekly_hours: initialWeeklyHours,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/subject/${subject.id}`);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit Pelajaran - ${subject.name}`} />

            <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6">
                <FormContainer
                    title="Tambah Pelajaran Baru"
                    description="Lengkapi form berikut untuk menambahkan data Pelajaran baru"
                    onSubmit={handleSubmit}
                    buttons={
                        <>
                            <Button variant="outline" asChild>
                                <a href="/subject">Batal</a>
                            </Button>
                            <Button type="submit" variant="default">
                                Simpan Data Pelajaran
                            </Button>
                        </>
                    }
                >
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <InputField
                            label="Nama Lengkap"
                            id="name"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            error={errors.name}
                            placeholder="Masukkan nama lengkap Pelajaran"
                            required
                        />

                        <InputField
                            type="number"
                            label="weekly_hours"
                            id="weekly_hours"
                            value={data.weekly_hours}
                            onChange={(e) => {
                                const valueAsString = e.target.value;
                                const parsedValue = parseInt(valueAsString);
                                setData('weekly_hours', parsedValue);
                            }}
                            error={errors.weekly_hours}
                            placeholder="Masukkan Nomor Induk Pegawai"
                            required
                        />
                    </div>
                </FormContainer>
            </div>
        </AppLayout>
    );
}
