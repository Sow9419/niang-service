import React, { useState, useEffect } from 'react';
import type { Citerne, Conducteur } from '../../types';
import { Truck, User, Droplets, ChevronDown } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Button } from '@/components/ui/button';

type TankerStatus = 'Disponible' | 'En livraison';

const statusConfig: Record<TankerStatus, {
  color: string;
  bg: string;
  icon: React.ReactNode;
}> = {
    'Disponible': {
        color: 'text-emerald-700',
        bg: 'bg-white/80',
        icon: <Truck className="w-4 h-4" />
    },
    'En livraison': {
        color: 'text-blue-700',
        bg: 'bg-white',
        icon: <Droplets className="w-4 h-4" />
    },
};

const TankerListItem: React.FC<{ tanker: Citerne; driverName: string | null }> = ({ tanker, driverName }) => {
    return (
        <Card className="bg-zinc-100 hover:bg-gray-50/80 border-none rounded-lg hover:shadow-md transition-all duration-300 ease-out">
            <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-white shadow-sm">
                        <Truck className="w-6 h-6 text-black" />
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-900 text-lg tracking-tight">
                            {tanker.registration}
                        </h3>
                        <div className="flex items-center mt-1 space-x-2">
                            <User className="w-3.5 h-3.5 text-gray-500" />
                            <span className="text-sm font-medium text-gray-600">
                                {driverName || 'Non assigné'}
                            </span>
                        </div>
                    </div>
                </div>
                <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1 text-gray-600">
                        <Droplets className="w-4 h-4 text-blue-500" />
                        <span className="text-sm font-medium">
                            {tanker.capacity_liters.toLocaleString()} L
                        </span>
                    </div>
                    <Badge variant="outline" className="text-xs font-medium bg-gray-50 text-gray-700 border-gray-200">
                        Citerne
                    </Badge>
                </div>
            </CardContent>
        </Card>
    );
};

const TankerStatusSection: React.FC<{ title: TankerStatus; tankers: Citerne[]; drivers: Conducteur[] }> = ({ title, tankers, drivers }) => {
    const [isOpen, setIsOpen] = useState(true);
    const config = statusConfig[title];

    const getDriverName = (driverId: string | null) => {
        if (driverId === null) return null;
        const driver = drivers.find(d => d.id === driverId);
        return driver ? driver.name : 'Inconnu';
    };

    return (
        <Collapsible open={isOpen} onOpenChange={setIsOpen} className="w-full ">
            <CollapsibleTrigger asChild className='border-2 border-gray-200 rounded-lg'>
                <div className={`
                    flex items-center justify-between w-full p-4 rounded-lg cursor-pointer
                    ${config.bg} transition-colors duration-200
                `}>
                    <div className="flex items-center space-x-3">
                        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-black shadow-sm">
                            {config.icon}
                        </div>
                        <h2 className={`text-lg font-bold ${config.color}`}>{title}</h2>
                        <Badge variant="secondary" className="font-semibold">{tankers.length}</Badge>
                    </div>
                    <Button size="sm" className="w-9 p-0 group bg-zinc-100">
                        <ChevronDown className={`h-5 w-5 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                        <span className="sr-only">Toggle</span>
                    </Button>
                </div>
            </CollapsibleTrigger>
            <CollapsibleContent className="pt-4 space-y-3">
                {tankers.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-24 p-6 rounded-xl border-2 border-dashed border-gray-200 bg-gray-50/50 text-gray-500">
                        <Truck className="w-8 h-8 mb-2 opacity-40" />
                        <p className="text-sm font-medium">Aucune citerne dans cette catégorie</p>
                    </div>
                ) : (
                    tankers.map(tanker => (
                        <TankerListItem
                            key={tanker.id}
                            tanker={tanker}
                            driverName={getDriverName(tanker.assigned_driver_id)}
                        />
                    ))
                )}
            </CollapsibleContent>
        </Collapsible>
    );
};


interface TankerBoardProps {
  tankers: Citerne[];
  drivers: Conducteur[];
  isLoading: boolean;
}

const TankerBoard: React.FC<TankerBoardProps> = ({ tankers, drivers, isLoading }) => {
    const [boardState, setBoardState] = useState<Record<TankerStatus, Citerne[]>>({
        'Disponible': [],
        'En livraison': [],
    });

    useEffect(() => {
        setBoardState({
            'Disponible': tankers.filter(t => t.status === 'Disponible'),
            'En livraison': tankers.filter(t => t.status === 'En livraison'),
        });
    }, [tankers]);

    const totalTankers = tankers.length;
    const availableTankers = boardState['Disponible'].length;

    if (isLoading) {
        return (
            <div className="w-full space-y-6">
                <div className="flex items-center justify-between">
                    <Skeleton className="h-8 w-64 bg-gray-200" />
                    <Skeleton className="h-6 w-32 bg-gray-200" />
                </div>
                <div className="space-y-4">
                    <Skeleton className="h-20 w-full bg-gray-200 rounded-xl" />
                    <Skeleton className="h-20 w-full bg-gray-200 rounded-xl" />
                </div>
            </div>
        );
    }

    return (
        <div className="w-full space-y-6 bg-white p-6 rounded-lg shadow-sm">
            {/* En-tête principal */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                        Gestion de la Flotte
                    </h1>
                    <p className="text-gray-600 mt-1 font-medium">
                        Liste des citernes par statut
                    </p>
                </div>
            </div>

            {/* Collapsible List */}
            <div className="space-y-4">
                <TankerStatusSection
                    title="Disponible"
                    tankers={boardState['Disponible']}
                    drivers={drivers}
                />
                <TankerStatusSection
                    title="En livraison"
                    tankers={boardState['En livraison']}
                    drivers={drivers}
                />
            </div>
        </div>
    );
};

export default TankerBoard;