import React, { useState, useEffect } from 'react';
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, useSortable, arrayMove } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { Citerne, Conducteur, CiterneUpdate } from '../../types';
import { GripVertical } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

type TankerStatus = 'Disponible' | 'En livraison';

const statusToColor: Record<TankerStatus, string> = {
    'Disponible': 'bg-green-500',
    'En livraison': 'bg-blue-500',
};

const SortableTankerCard: React.FC<{ tanker: Citerne; driverName: string | null }> = ({ tanker, driverName }) => {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: tanker.id });
    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
        zIndex: isDragging ? 10 : 'auto',
    };

    return (
        <Card ref={setNodeRef} style={style} {...attributes} className="touch-none bg-white shadow-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 p-4">
                <div className="font-bold text-black">{tanker.registration}</div>
                <button {...listeners} className="p-1 text-gray-400 hover:text-gray-600 cursor-grab active:cursor-grabbing">
                    <GripVertical className="w-5 h-5" />
                </button>
            </CardHeader>
            <CardContent className="p-4 pt-0">
                <p className="text-sm text-gray-600">{driverName || 'Non assigné'}</p>
                <p className="text-xs text-gray-500 mt-2">Capacité: {tanker.capacity_liters.toLocaleString()} L</p>
            </CardContent>
        </Card>
    );
};

const TankerColumn: React.FC<{ title: TankerStatus; tankers: Citerne[]; drivers: Conducteur[] }> = ({ title, tankers, drivers }) => {
    const getDriverName = (driverId: string | null) => {
        if (driverId === null) return null;
        const driver = drivers.find(d => d.id === driverId);
        return driver ? driver.name : 'Inconnu';
    };

    return (
        <Card className="bg-white border-gray-200 shadow-sm">
            <CardHeader className="flex flex-row items-center gap-3 space-y-0 border-b px-4 py-3">
                <span className={`w-3 h-3 rounded-full ${statusToColor[title]}`}></span>
                <CardTitle className="text-base font-semibold text-gray-700">{title}</CardTitle>
                <span className="text-gray-500 font-semibold ml-auto bg-gray-100 rounded-full px-2 py-0.5 text-xs">{tankers.length}</span>
            </CardHeader>
            <CardContent className="p-4 space-y-4 min-h-[200px]">
                <SortableContext id={title} items={tankers.map(t => t.id)}>
                    {tankers.map(tanker => (
                        <SortableTankerCard key={tanker.id} tanker={tanker} driverName={getDriverName(tanker.assigned_driver_id)} />
                    ))}
                </SortableContext>
            </CardContent>
        </Card>
    );
};


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
    });

    useEffect(() => {
        setBoardState({
            'Disponible': tankers.filter(t => t.status === 'Disponible'),
            'En livraison': tankers.filter(t => t.status === 'En livraison'),
        });
    }, [tankers]);

    const findContainer = (id: string | number) => {
        if (typeof id === 'number') {
            for (const status of Object.keys(boardState) as TankerStatus[]) {
                if (boardState[status].find(item => item.id === id)) {
                    return status;
                }
            }
        }
        return id as TankerStatus;
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
        const overContainer = findContainer(over.id);

        if (!activeContainer || !overContainer || activeContainer === overContainer) {
            return;
        }

        setBoardState(prev => {
            const activeItems = prev[activeContainer];
            const overItems = prev[overContainer];
            const activeIndex = activeItems.findIndex(item => item.id === active.id);
            const overIndex = overItems.findIndex(item => item.id === over.id);

            let newBoardState = { ...prev };
            let movedItem;

            if (activeContainer === overContainer) {
                newBoardState[activeContainer] = arrayMove(overItems, activeIndex, overIndex);
            } else {
                [movedItem] = activeItems.splice(activeIndex, 1);
                if (overIndex !== -1) {
                    overItems.splice(overIndex, 0, movedItem);
                } else {
                    overItems.push(movedItem);
                }
                newBoardState[activeContainer] = [...activeItems];
                newBoardState[overContainer] = [...overItems];
            }
            
            return newBoardState;
        });

        onUpdateTanker({ id: active.id, status: overContainer });
    };


    const columns: TankerStatus[] = ['Disponible', 'En livraison'];

    if (isLoading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {columns.map(status => (
                    <div key={status} className="bg-white p-4 rounded-lg h-full space-y-4 border shadow-sm">
                        <Skeleton className="h-6 w-3/4 bg-gray-200" />
                        <Skeleton className="h-24 w-full bg-gray-200" />
                        <Skeleton className="h-24 w-full bg-gray-200" />
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div className="w-auto">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Flotte de Citernes</h2>
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                    {columns.map(status => (
                        <SortableContext key={status} items={boardState[status]?.map(c => c.id) || []}>
                            <TankerColumn
                                title={status}
                                tankers={boardState[status] || []}
                                drivers={drivers}
                            />
                        </SortableContext>
                    ))}
                </div>
            </DndContext>
        </div>
    );
};

export default TankerBoard;
