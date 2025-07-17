import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

interface TotalCardProps {
    icon?: React.ReactNode;
    length: string | number;
    title: string;
    footer?: string;
}

const TotalCard = ({ icon, length, title, footer = '' }: TotalCardProps) => {
    return (
        <Card className="border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
                {icon ? <div className="rounded-lg bg-primary/10 p-2 text-primary">{icon}</div> : ''}
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold text-foreground">{length !== 0 && length && length !== null ? length : 0}</div>
                {footer ? '' : <p className="mt-1 text-xs text-muted-foreground">{footer}</p>}
            </CardContent>
        </Card>
    );
};

export default TotalCard;
