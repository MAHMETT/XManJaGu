import { FormContainer } from '@/components/forms/formContainer';
import { SelectInputField } from '@/components/forms/selectInputField';
// import { SelectInputField } from '@/components/forms/selectInputField';
import { Button } from '@/components/ui/button';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm, usePage } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Guru Availability',
        href: '/availability',
    },
    {
        title: 'Tambah Guru Availability',
        href: '/availability/create',
    },
];

const Class: ClassData[] = [
    {
        id: 11,
        name: 10,
    },
    {
        id: 12,
        name: 11,
    },
    {
        id: 13,
        name: 12,
    },
];

interface ClassData {
    id: number;
    name: number;
}

interface DefaultData {
    id: string;
    name: string;
}

interface AvailabilityProps {
    teachers: DefaultData[];
    subjects: DefaultData[];
    [key: string]: unknown;
}

export default function CreateTeacher() {
    const { props } = usePage<AvailabilityProps>();
    const { subjects, teachers } = props;

    const { post, errors, setData } = useForm<{
        class: number;
        teacher_id: string;
        subject_id: string;
    }>({
        class: 10,
        teacher_id: '',
        subject_id: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/availability');
    };

    console.log(teachers);
    console.log(subjects);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Tambah Guru Availability" />

            <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6">
                <FormContainer
                    title="Tambah Guru Availability Baru"
                    description="Lengkapi form berikut untuk menambahkan data guru availability baru"
                    onSubmit={handleSubmit}
                    buttons={
                        <>
                            <Button variant="outline" asChild>
                                <a href="/availability">Batal</a>
                            </Button>
                            <Button type="submit" variant="default">
                                Simpan Data Guru Availability
                            </Button>
                        </>
                    }
                >
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <SelectInputField
                            name={'teacher_id'}
                            options={teachers}
                            label="Guru"
                            required
                            error={errors.teacher_id}
                            onChange={(e) => setData('teacher_id', e.target.value)}
                        />
                        <SelectInputField
                            name={'subject_id'}
                            options={subjects}
                            label="Pelajaran"
                            required
                            error={errors.subject_id}
                            onChange={(e) => setData('subject_id', e.target.value)}
                        />
                        <SelectInputField
                            name={'class'}
                            options={Class}
                            label="Kelas"
                            required
                            error={errors.class}
                            defaultValue={10}
                            onChange={(e) => setData('class', Number(e.target.value))}
                        />
                    </div>
                </FormContainer>
            </div>
        </AppLayout>
    );
}
