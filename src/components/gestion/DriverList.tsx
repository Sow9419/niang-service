import React from 'react';
import type { Driver } from '../../types';
import { Check, Truck, Wrench, User } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';

const DriverStatusIcon: React.FC<{ status: Driver['status'] }> = ({ status }) => {
    switch (status) {
        case 'available':
            return <div className="w-8 h-8 flex items-center justify-center bg-green-100 rounded-full"><Check className="w-5 h-5 text-green-600" /></div>;
        case 'on_delivery':
            return <div className="w-8 h-8 flex items-center justify-center bg-blue-100 rounded-full"><Truck className="w-5 h-5 text-blue-600" /></div>;
        case 'maintenance':
            return <div className="w-8 h-8 flex items-center justify-center bg-yellow-100 rounded-full"><Wrench className="w-5 h-5 text-yellow-600" /></div>;
        default:
            return null;
    }
};

const DriverCard: React.FC<{ driver: Driver }> = ({ driver }) => (
    <div className="flex items-center justify-between p-3 bg-gray-50/50 hover:bg-gray-100/80 rounded-xl transition-colors duration-200">
        <div className="flex items-center gap-4">
            <Avatar className="h-12 w-12">
                <AvatarImage src={driver.avatar_url || undefined} alt={driver.name} />
                <AvatarFallback>
                    <User className="h-6 w-6" />
                </AvatarFallback>
            </Avatar>
            <div>
                <p className="font-bold text-gray-800">{driver.name}</p>
                <p className="text-sm text-gray-500">{driver.phone}</p>
            </div>
        </div>
        <DriverStatusIcon status={driver.status} />
    </div>
);


const DriverList: React.FC<{ drivers: Driver[], isLoading: boolean }> = ({ drivers, isLoading }) => {
    if (isLoading) {
        return (
            <div className="bg-white p-6 rounded-2xl shadow-sm h-full space-y-3">
                <div className="flex justify-between items-center mb-6">
                    <Skeleton className="h-8 w-40" />
                    <Skeleton className="h-6 w-20" />
                </div>
                <div className="space-y-3">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="flex items-center gap-4">
                            <Skeleton className="h-12 w-12 rounded-full" />
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-24" />
                                <Skeleton className="h-4 w-32" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )
    }

    if (drivers.length === 0) {
        return (
            <div className="bg-white p-6 rounded-2xl shadow-sm h-full text-center py-12 border-2 border-dashed">
                 <h3 className="text-xl font-semibold">Aucun conducteur trouvé</h3>
                <p className="text-muted-foreground mt-2">Commencez par ajouter un nouveau conducteur à votre équipe.</p>
            </div>
        )
    }

    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm h-full">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Conducteurs</h2>
                <span className="text-gray-500 font-semibold">{drivers.length} actifs</span>
            </div>
            <div className="space-y-3">
                {drivers.map(driver => (
                    <DriverCard key={driver.id} driver={driver} />
                ))}
            </div>
        </div>
    );
};

export default DriverList;
