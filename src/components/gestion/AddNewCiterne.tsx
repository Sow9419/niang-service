import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetDescription, SheetFooter } from '@/components/ui/sheet';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { ScrollArea } from '@/components/ui/scroll-area';
import { PlusCircle } from 'lucide-react';
import type { Citerne, CiterneInsert, CiterneUpdate, Conducteur } from '@/types';

const formSchema = z.object({
  registration: z.string().nonempty("L'immatriculation est requise"),
  capacity_liters: z.number().min(1, "La capacité doit être supérieure à 0"),
  status: z.enum(['Disponible', 'En livraison', 'En maintenance']),
  assigned_driver_id: z.string().nullable().optional(),
});

interface AddNewCiterneProps {
  createCiterne: (data: CiterneInsert) => Promise<any>;
  updateCiterne: (data: CiterneUpdate) => Promise<any>;
  citerneToEdit?: Citerne | null;
  drivers: Conducteur[];
  onFinished: () => void;
}

const AddNewCiterne: React.FC<AddNewCiterneProps> = ({ createCiterne, updateCiterne, citerneToEdit, drivers, onFinished }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const isEditMode = !!citerneToEdit;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      registration: '',
      capacity_liters: 10000,
      status: 'Disponible',
      assigned_driver_id: null,
    },
  });

  useEffect(() => {
    if (citerneToEdit) {
      form.reset({
        ...citerneToEdit,
        assigned_driver_id: citerneToEdit.assigned_driver_id || null,
      });
      setIsOpen(true);
    } else {
      form.reset({
        registration: '',
        capacity_liters: 10000,
        status: 'Disponible',
        assigned_driver_id: null,
      });
    }
  }, [citerneToEdit, form]);

  const handleFormSubmit = async (values: z.infer<typeof formSchema>) => {
    const data = {
        ...values,
        assigned_driver_id: values.assigned_driver_id === '' ? null : values.assigned_driver_id,
    };

    const success = isEditMode
      ? await updateCiterne({ ...data, id: citerneToEdit!.id })
      : await createCiterne(data as CiterneInsert);

    if (success) {
      form.reset();
      setIsOpen(false);
      onFinished();
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button className='bg-orange-400 hover:bg-orange-500 text-white rounded-full shadow-lg' onClick={() => setIsOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Ajouter une Citerne
        </Button>
      </SheetTrigger>
      <SheetContent className="flex flex-col w-full sm:max-w-lg h-full p-0">
        <SheetHeader className="px-6 pt-6">
          <SheetTitle>{isEditMode ? 'Modifier la citerne' : 'Ajouter une nouvelle citerne'}</SheetTitle>
          <SheetDescription>
            {isEditMode ? "Modifiez les informations de la citerne ci-dessous." : "Remplissez les informations de la nouvelle citerne."}
          </SheetDescription>
        </SheetHeader>
        <div className="flex-grow overflow-y-auto">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleFormSubmit)} className="flex flex-col h-full">
              <ScrollArea className="flex-grow px-6">
                <div className="py-4 space-y-6">
                  <FormField
                    control={form.control}
                    name="registration"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Immatriculation</FormLabel>
                        <FormControl>
                          <Input placeholder="Ex: DK-1234-AB" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="capacity_liters"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Capacité (Litres)</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} onChange={e => field.onChange(Number(e.target.value))} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Statut</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Sélectionner un statut" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Disponible">Disponible</SelectItem>
                            <SelectItem value="En livraison">En livraison</SelectItem>
                            <SelectItem value="En maintenance">En maintenance</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="assigned_driver_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Conducteur assigné</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value || ''}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Sélectionner un conducteur" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="">Non assigné</SelectItem>
                            {drivers.map(driver => (
                              <SelectItem key={driver.id} value={driver.id}>
                                {driver.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </ScrollArea>
              <SheetFooter className="px-6 py-4 mt-auto border-t bg-background sticky bottom-0">
                <div className="flex justify-end space-x-4 w-full">
                  <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
                    Annuler
                  </Button>
                  <Button type="submit">
                    {isEditMode ? 'Enregistrer les modifications' : 'Enregistrer'}
                  </Button>
                </div>
              </SheetFooter>
            </form>
          </Form>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default AddNewCiterne;
