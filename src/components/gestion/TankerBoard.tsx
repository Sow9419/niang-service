import React from 'react';
import type { Tanker, Driver } from '../../types';
import { Edit, Trash2 } from 'lucide-react';

const TankerCard: React.FC<{ tanker: Tanker; driverName: string | null }> = ({ tanker, driverName }) => (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200/80">
        <div className="flex justify-between items-start">
            <h4 className="font-bold text-lg text-gray-800">{tanker.registration}</h4>
            <div className="flex items-center gap-2">
                <button className="text-gray-400 hover:text-gray-600"><Edit className="w-4 h-4" /></button>
                <button className="text-gray-400 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
            </div>
        </div>
        <p className="text-gray-500 mt-2 text-sm">{driverName || 'Non assigné'}</p>
    </div>
);

const TankerColumn: React.FC<{ title: string; count: number; tankers: Tanker[]; drivers: Driver[]; color: string; }> = ({ title, count, tankers, drivers, color }) => {
    const getDriverName = (driverId: number | null) => {
        if (driverId === null) return null;
        const driver = drivers.find(d => d.id === driverId);
        return driver ? driver.name : 'Inconnu';
    };

    return (
        <div>
            <div className="flex items-center gap-3 mb-4">
                <span className={`w-3 h-3 rounded-full ${color}`}></span>
                <h3 className="font-bold text-lg text-gray-800">{title}</h3>
                <span className="text-gray-400 font-semibold">{count}</span>
            </div>
            <div className="space-y-4">
                {tankers.map(tanker => (
                    <TankerCard key={tanker.id} tanker={tanker} driverName={getDriverName(tanker.driverId)} />
                ))}
            </div>
        </div>
    );
};


const TankerBoard: React.FC<{ tankers: Tanker[]; drivers: Driver[] }> = ({ tankers, drivers }) => {
    const availableTankers = tankers.filter(t => t.status === 'Disponible');
    const onDeliveryTankers = tankers.filter(t => t.status === 'En livraison');
    const inMaintenanceTankers = tankers.filter(t => t.status === 'En maintenance');

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            <TankerColumn title="Disponible" count={availableTankers.length} tankers={availableTankers} drivers={drivers} color="bg-green-500" />
            <TankerColumn title="En livraison" count={onDeliveryTankers.length} tankers={onDeliveryTankers} drivers={drivers} color="bg-blue-500" />
            <TankerColumn title="En maintenance" count={inMaintenanceTankers.length} tankers={inMaintenanceTankers} drivers={drivers} color="bg-yellow-500" />
        </div>
    );
};

export default TankerBoard;
