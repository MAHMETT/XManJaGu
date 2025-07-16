// src/components/OneTimeWelcomePopup.tsx

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { RocketLaunchIcon } from '@heroicons/react/24/outline';
import { useEffect, useState } from 'react';

// Nama kunci untuk disimpan di localStorage.
// Sebaiknya unik untuk setiap pop-up.
const STORAGE_KEY = 'welcomePopupShown_v1';

export function OneTimeWelcomePopup() {
    const [isOpen, setIsOpen] = useState(false);

    // useEffect ini hanya berjalan sekali saat komponen pertama kali dimuat.
    useEffect(() => {
        // Cek apakah kunci sudah ada di localStorage.
        const hasBeenShown = localStorage.getItem(STORAGE_KEY);

        // Jika belum pernah ditampilkan (!hasBeenShown), maka buka dialog.
        if (!hasBeenShown) {
            // Memberi sedikit jeda agar tidak terlalu mendadak muncul.
            const timer = setTimeout(() => {
                setIsOpen(true);
            }, 1500); // Muncul setelah 1.5 detik

            return () => clearTimeout(timer);
        }
    }, []); // Array dependensi kosong memastikan ini hanya berjalan sekali.

    const handleClose = () => {
        // 1. Tandai bahwa pop-up sudah ditampilkan di localStorage.
        localStorage.setItem(STORAGE_KEY, 'true');
        // 2. Tutup dialog.
        setIsOpen(false);
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className="sm:max-w-md" onInteractOutside={(e) => e.preventDefault()}>
                <DialogHeader>
                    <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                        <RocketLaunchIcon className="h-6 w-6 text-primary" />
                    </div>
                    <DialogTitle className="text-center text-xl">Selamat Datang di Aplikasi Manajemen Jadwal Guru!</DialogTitle>
                    <DialogDescription className="text-center">
                        Kami senang Anda bergabung. Jelajahi fitur-fitur baru yang telah kami siapkan untuk mempermudah mengelola jadwal anda.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="mt-4">
                    <Button type="button" className="w-full" onClick={handleClose}>
                        Mengerti, Lanjutkan
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
