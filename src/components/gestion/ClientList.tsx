import React from 'react';
import type { Client } from '../../types';
import { User, Edit } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';

const ClientCard: React.FC<{ client: Client; onEdit: (client: Client) => void; }> = ({ client, onEdit }) => (
    <div className="flex items-center justify-between p-3 bg-zinc-100 rounded-lg">
        <div className="flex items-center gap-4">
            <Avatar className="h-10 w-10">
                <AvatarFallback>
                    <User className="h-5 w-5" />
                </AvatarFallback>
            </Avatar>
            <div>
                <p className="font-semibold text-black">{client.name}</p>
                <p className="text-sm text-muted-foreground">{client.phone}</p>
            </div>
        </div>
        <Button className='rounded-full bg-white' size="icon" onClick={() => onEdit(client)}>
            <Edit className="h-4 w-4 text-black" />
        </Button>
    </div>
);


const ClientList: React.FC<{ clients: Client[], isLoading: boolean, onEdit: (client: Client) => void; }> = ({ clients, isLoading, onEdit }) => {
    if (isLoading) {
        return (
            <Card className="bg-white shadow-sm border-none w-auto">
                <CardHeader>
                    <Skeleton className="h-8 w-40 bg-gray-200" />
                </CardHeader>
                <CardContent className="space-y-4">
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
                <CardTitle className='text-black'>Clients</CardTitle>
            </CardHeader>
            <ScrollArea className="h-[320px]">
                <CardContent className="divide-y">
                    {clients.length > 0 ? (
                        clients.map(client => (
                            <ClientCard key={client.id} client={client} onEdit={onEdit} />
                        ))
                    ) : (
                        <div className="text-center py-12">
                            <h3 className="text-lg font-semibold text-black">Aucun client trouvé</h3>
                            <p className="text-gray-800 mt-1 text-sm">Commencez par ajouter un nouveau client.</p>
                        </div>
                    )}
                </CardContent>
            </ScrollArea>
        </Card>
    );
};

export default ClientList;