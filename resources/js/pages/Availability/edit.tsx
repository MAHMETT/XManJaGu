import { FormContainer } from '@/components/forms/formContainer';
import { InputField } from '@/components/forms/inputField';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm, usePage } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard Guru',
        href: '/teacher',
    },
    {
        title: 'Tambah Guru',
        href: '/teacher/create',
    },
];

interface TeacherData {
    id: string;
    name: string;
    nip: string;
}

interface EditTeacherProps {
    teacher: TeacherData;
    [key: string]: unknown;
}

export default function EditTeacher() {
    const { props } = usePage<EditTeacherProps>();
    const { teacher } = props;

    const { data, setData, put, errors } = useForm({
        name: teacher.name,
        nip: teacher.nip,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/teacher/${teacher.id}`);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit Guru - ${teacher.name}`} />

            <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6">
                <FormContainer
                    title="Tambah Guru Baru"
                    description="Lengkapi form berikut untuk menambahkan data guru baru"
                    onSubmit={handleSubmit}
                    buttons={
                        <>
                            <Button variant="outline" asChild>
                                <a href="/teacher">Batal</a>
                            </Button>
                            <Button type="submit" variant="default">
                                Simpan Data Guru
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
                            placeholder="Masukkan nama lengkap guru"
                            required
                        />

                        <InputField
                            label="NIP"
                            id="nip"
                            value={data.nip}
                            onChange={(e) => setData('nip', e.target.value)}
                            error={errors.nip}
                            placeholder="Masukkan Nomor Induk Pegawai"
                            required
                        />
                    </div>
                </FormContainer>
            </div>
        </AppLayout>
    );
}
