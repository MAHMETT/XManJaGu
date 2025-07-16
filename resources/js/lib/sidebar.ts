import { NavItem } from '@/types';
import { CalendarHeartIcon, LayoutGrid, LucideLanguages, User, User2Icon } from 'lucide-react';

export const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
        icon: LayoutGrid,
    },
    {
        title: 'Schedule',
        href: '/schedules',
        icon: CalendarHeartIcon,
    },
    {
        title: 'Availability',
        href: '/availability',
        icon: User2Icon,
    },
];

export const masterNavItems: NavItem[] = [
    {
        title: 'Teacher',
        href: '/teacher',
        icon: User,
    },
    {
        title: 'Subject',
        href: '/subject',
        icon: LucideLanguages,
    },
];

export const footerNavItems: NavItem[] = [];
