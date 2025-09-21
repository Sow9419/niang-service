
import React from 'react';
import type { Citerne, Conducteur } from '../../types';
import { MoreHorizontal, Pencil, Trash2, Truck } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

interface TankerBoardProps {
  tankers: Citerne[];
  drivers: Conducteur[];
  isLoading: boolean;
  onEdit: (tanker: Citerne) => void;
  onDelete: (tankerId: string) => void;
}

const TankerBoard: React.FC<TankerBoardProps> = ({ tankers, drivers, isLoading, onEdit, onDelete }) => {

  const getDriverName = (driverId: string | null) => {
    if (!driverId) return <span className="text-gray-500">Non assigné</span>;
    const driver = drivers.find(d => d.id === driverId);
    return driver ? driver.name : <span className="text-gray-500">Inconnu</span>;
  };

  const statusBadge = (status: Citerne['status']) => {
    switch (status) {
      case 'Disponible':
        return <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">{status}</Badge>;
      case 'En livraison':
        return <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">{status}</Badge>;
      case 'En maintenance':
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-200">{status}</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader className='bg-white'>
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-64 mt-2" />
        </CardHeader>
        <CardContent className='bg-white'>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center space-x-4">
                <Skeleton className="h-10 w-full rounded-md" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-sm border-none bg-white">
      <CardHeader>
        <CardTitle className="text-black">Gestion de la Flotte</CardTitle>
        <p className="text-gray-700 text-sm">Liste complète de vos citernes.</p>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader >
            <TableRow>
              <TableHead className="text-gray-700">Immatriculation</TableHead>
              <TableHead className="text-gray-700">Conducteur Assigné</TableHead>
              <TableHead className="text-gray-700">Capacité (L)</TableHead>
              <TableHead className="text-gray-700">Statut</TableHead>
              <TableHead className="text-right text-gray-700">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tankers.length > 0 ? (
              tankers.map((tanker) => (
                <TableRow key={tanker.id} className="hover:bg-gray-200 border-b-gray-400">
                  <TableCell className="font-medium text-black">{tanker.registration}</TableCell>
                  <TableCell className="text-black">{getDriverName(tanker.assigned_driver_id)}</TableCell>
                  <TableCell className="text-black">{tanker.capacity_liters.toLocaleString('fr-FR')}</TableCell>
                  <TableCell>{statusBadge(tanker.status)}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Ouvrir le menu</span>
                          <MoreHorizontal className="h-4 w-4 text-black" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className='bg-white border-none shadow-md'>
                        <DropdownMenuItem onClick={() => onEdit(tanker)}>
                          <Pencil className="mr-2 h-4 w-4 text-black" />
                          <span className="text-black">Modifier</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onDelete(tanker.id)} className="text-red-600">
                          <Trash2 className="mr-2 h-4 w-4" />
                          <span>Supprimer</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center text-gray-700">
                  <div className="flex flex-col items-center justify-center">
                    <Truck className="w-10 h-10 mb-2 text-gray-400" />
                    <span className="font-medium">Aucune citerne trouvée.</span>
                    <span className="text-sm">Commencez par en ajouter une.</span>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default TankerBoard;
