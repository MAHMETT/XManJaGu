import { useEffect } from 'react';

export function useLockBodyScroll(locked: boolean = true) {
    useEffect(() => {
        if (locked) {
            // Save original body style
            const originalStyle = window.getComputedStyle(document.body).overflow;

            // Lock scroll
            document.body.style.overflow = 'hidden';

            // Re-enable scrolling when component unmounts
            return () => {
                document.body.style.overflow = originalStyle;
            };
        }
    }, [locked]);
}
