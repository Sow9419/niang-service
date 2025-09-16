import React, { useState, useEffect } from 'react';
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, useSortable, arrayMove } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { Citerne, Conducteur, CiterneUpdate } from '../../types';
import { GripVertical } from 'lucide-react';

type TankerStatus = 'Disponible' | 'En livraison' | 'En maintenance';

const statusToColor: Record<TankerStatus, string> = {
    'Disponible': 'bg-green-500',
    'En livraison': 'bg-blue-500',
    'En maintenance': 'bg-yellow-500',
};

const SortableTankerCard: React.FC<{ tanker: Citerne; driverName: string | null }> = ({ tanker, driverName }) => {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: tanker.id });
    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        <div ref={setNodeRef} style={style} {...attributes} className="bg-white p-4 rounded-xl shadow-sm border touch-none">
            <div className="flex justify-between items-start">
                <h4 className="font-bold text-lg text-gray-800">{tanker.registration}</h4>
                <button {...listeners} className="p-1 text-gray-400 hover:text-gray-600 cursor-grab active:cursor-grabbing">
                    <GripVertical className="w-5 h-5" />
                </button>
            </div>
            <p className="text-gray-500 mt-2 text-sm">{driverName || 'Non assigné'}</p>
            <p className="text-xs text-gray-400 mt-2">Capacité: {tanker.capacity_liters.toLocaleString()} L</p>
        </div>
    );
};

const TankerColumn: React.FC<{ title: TankerStatus; tankers: Citerne[]; drivers: Conducteur[] }> = ({ title, tankers, drivers }) => {
    const { setNodeRef } = useSortable({ id: title });

    const getDriverName = (driverId: number | null) => {
        if (driverId === null) return null;
        const driver = drivers.find(d => d.id === driverId);
        return driver ? driver.name : 'Inconnu';
    };

    return (
        <div className="bg-gray-50/60 p-4 rounded-2xl h-full">
            <div className="flex items-center gap-3 mb-4">
                <span className={`w-3 h-3 rounded-full ${statusToColor[title]}`}></span>
                <h3 className="font-bold text-lg text-gray-800">{title}</h3>
                <span className="text-gray-400 font-semibold">{tankers.length}</span>
            </div>
            <SortableContext id={title} items={tankers.map(t => t.id)}>
                <div className="space-y-4">
                    {tankers.map(tanker => (
                        <SortableTankerCard key={tanker.id} tanker={tanker} driverName={getDriverName(tanker.assigned_driver_id)} />
                    ))}
                </div>
            </SortableContext>
        </div>
    );
};

import { Skeleton } from '@/components/ui/skeleton';

interface TankerBoardProps {
  tankers: Citerne[];
  drivers: Conducteur[];
  onUpdateTanker: (data: CiterneUpdate) => Promise<any>;
  isLoading: boolean;
}

const TankerBoard: React.FC<TankerBoardProps> = ({ tankers, drivers, onUpdateTanker, isLoading }) => {
    const [boardState, setBoardState] = useState<Record<TankerStatus, Citerne[]>>({
        'Disponible': [],
        'En livraison': [],
        'En maintenance': [],
    });

    useEffect(() => {
        setBoardState({
            'Disponible': tankers.filter(t => t.status === 'Disponible'),
            'En livraison': tankers.filter(t => t.status === 'En livraison'),
            'En maintenance': tankers.filter(t => t.status === 'En maintenance'),
        });
    }, [tankers]);

    const findContainer = (id: string | number) => {
        for (const status of Object.keys(boardState) as TankerStatus[]) {
            if (boardState[status].find(item => item.id === id)) {
                return status;
            }
        }
    };

    const sensors = useSensors(
        useSensor(PointerSensor, {
          activationConstraint: {
            distance: 8,
          },
        })
    );

    const handleDragEnd = (event: any) => {
        const { active, over } = event;
        if (!over) return;

        const activeContainer = findContainer(active.id);
        const overContainer = findContainer(over.id) || over.id as TankerStatus;

        if (!activeContainer || !overContainer || activeContainer === overContainer) {
            return;
        }

        setBoardState(prev => {
            const activeItems = prev[activeContainer];
            const overItems = prev[overContainer];
            const activeIndex = activeItems.findIndex(item => item.id === active.id);

            const [movedItem] = activeItems.splice(activeIndex, 1);
            overItems.push(movedItem);

            return { ...prev };
        });

        onUpdateTanker({ id: active.id, status: overContainer });
    };


    const columns: TankerStatus[] = ['Disponible', 'En livraison', 'En maintenance'];

    if (isLoading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {columns.map(status => (
                    <div key={status} className="bg-gray-50/60 p-4 rounded-2xl h-full space-y-4">
                        <Skeleton className="h-6 w-3/4" />
                        <Skeleton className="h-24 w-full" />
                        <Skeleton className="h-24 w-full" />
                    </div>
                ))}
            </div>
        );
    }

    if (tankers.length === 0) {
        return (
            <div className="text-center py-12 border-2 border-dashed rounded-2xl">
                <h3 className="text-xl font-semibold">Aucune citerne enregistrée</h3>
                <p className="text-muted-foreground mt-2">Commencez par ajouter une nouvelle citerne à votre flotte.</p>
            </div>
        )
    }

    return (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {columns.map(status => (
                    <TankerColumn
                        key={status}
                        title={status}
                        tankers={boardState[status]}
                        drivers={drivers}
                    />
                ))}
            </div>
        </DndContext>
    );
};

export default TankerBoard;
