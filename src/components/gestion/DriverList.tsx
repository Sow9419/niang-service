import React from 'react';
import type { Driver } from '../../types';
import { Check, Truck, User, Edit } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';

const DriverStatusIcon: React.FC<{ status: Driver['status'] }> = ({ status }) => {
    switch (status) {
        case 'available':
            return <div className="w-8 h-8 flex items-center justify-center bg-green-300 rounded-full"><Check className="w-5 h-5 text-green-600" /></div>;
        case 'on_delivery':
            return <div className="w-8 h-8 flex items-center justify-center bg-blue-500 rounded-full"><Truck className="w-5 h-5 text-blue-600" /></div>;
        default:
            return null;
    }
};

const DriverCard: React.FC<{ driver: Driver; onEdit: (driver: Driver) => void; }> = ({ driver, onEdit }) => (
    <div className="flex items-center justify-between p-3 bg-zinc-100 rounded-lg">
        <div className="flex items-center gap-2">
            <Avatar className="h-10 w-10">
                <AvatarImage src={driver.avatar_url || undefined} alt={driver.name} />
                <AvatarFallback>
                    <User className="h-5 w-5" />
                </AvatarFallback>
            </Avatar>
            <div>
                <p className="font-semibold text-black">{driver.name}</p>
                <p className="text-sm text-muted-foreground">{driver.phone}</p>
            </div>
        </div>
        <div className="flex items-center gap-2">
            <Button className='rounded-full bg-white' size="icon" onClick={() => onEdit(driver)}>
                <Edit className="h-4 w-4 text-gray-800" />
            </Button>
            <DriverStatusIcon status={driver.status} />
        </div>
    </div>
);


const DriverList: React.FC<{ drivers: Driver[], isLoading: boolean, onEdit: (driver: Driver) => void; }> = ({ drivers, isLoading, onEdit }) => {
    if (isLoading) {
        return (
            <Card className="bg-white shadow-sm border-none w-auto">
                <CardHeader>
                    <Skeleton className="h-8 w-40 bg-gray-200" />
                </CardHeader>
                <CardContent className="space-y-2">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="flex items-center gap-4">
                            <Skeleton className="h-12 w-12 rounded-full bg-gray-200" />
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-24 bg-gray-200" />
                                <Skeleton className="h-4 w-32 bg-gray-200" />
                            </div>
                        </div>
                    ))}
                </CardContent>
            </Card>
        )
    }

    return (
        <Card className="bg-white shadow-sm w-auto border-none">
            <CardHeader>
                <CardTitle className='text-black'>Équipe de Conducteurs</CardTitle>
            </CardHeader>
            <ScrollArea className="h-[320px] w-auto">
                <CardContent className="divide-y">
                    {drivers.length > 0 ? (
                        drivers.map(driver => (
                            <DriverCard key={driver.id} driver={driver} onEdit={onEdit} />
                        ))
                    ) : (
                        <div className="text-center py-12">
                            <h3 className="text-lg font-semibold text-black">Aucun conducteur trouvé</h3>
                            <p className="text-gray-800 mt-1 text-sm">Commencez par ajouter un nouveau conducteur.</p>
                        </div>
                    )}
                </CardContent>
            </ScrollArea>
        </Card>
    );
};

export default DriverList;
