import { FormContainer } from '@/components/forms/formContainer';
import { InputField } from '@/components/forms/inputField';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard Pelajaran',
        href: '/subject',
    },
    {
        title: 'Tambah Pelajaran',
        href: '/subject/create',
    },
];

export default function CreateSubject() {
    const { data, setData, post, errors } = useForm({
        name: '',
        weekly_hours: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/subject');
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Tambah Pelajaran Baru" />

            <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6">
                <FormContainer
                    title="Tambah Pelajaran Baru"
                    description="Lengkapi form berikut untuk menambahkan data pelajaran baru"
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
                            label="Nama Pelajaran"
                            id="name"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            error={errors.name}
                            placeholder="Masukkan nama pelajaran"
                            required
                        />

                        <InputField
                            type="number"
                            label="Jam per minggu"
                            id="weekly_hours"
                            value={data.weekly_hours}
                            onChange={(e) => setData('weekly_hours', e.target.value)}
                            error={errors.weekly_hours}
                            placeholder="contoh: 1/2/3/4"
                            required
                        />
                    </div>
                </FormContainer>
            </div>
        </AppLayout>
    );
}
