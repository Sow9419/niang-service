import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { PlusCircle, Edit } from 'lucide-react';
import type { Citerne, CiterneInsert, CiterneUpdate } from '@/types';

const formSchema = z.object({
  registration: z.string().nonempty("L'immatriculation est requise"),
  capacity_liters: z.number().min(1, "La capacité doit être supérieure à 0"),
  status: z.enum(['Disponible', 'En livraison', 'En maintenance']),
});

interface AddNewCiterneProps {
  createCiterne: (data: CiterneInsert) => Promise<any>;
  updateCiterne: (data: CiterneUpdate) => Promise<any>;
  citerneToEdit?: Citerne | null;
  onFinished: () => void;
}

const AddNewCiterne: React.FC<AddNewCiterneProps> = ({ createCiterne, updateCiterne, citerneToEdit, onFinished }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const isEditMode = !!citerneToEdit;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      registration: '',
      capacity_liters: 10000,
      status: 'Disponible',
    },
  });

  useEffect(() => {
    if (citerneToEdit) {
      form.reset(citerneToEdit);
      setIsOpen(true);
    } else {
      form.reset();
    }
  }, [citerneToEdit, form]);

  const handleFormSubmit = async (values: z.infer<typeof formSchema>) => {
    const success = isEditMode
      ? await updateCiterne({ ...values, id: citerneToEdit.id })
      : await createCiterne(values as any);

    if (success) {
      form.reset();
      setIsOpen(false);
      onFinished();
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Ajouter une Citerne
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>{isEditMode ? 'Modifier la citerne' : 'Ajouter une nouvelle citerne'}</SheetTitle>
        </SheetHeader>
        <div className="py-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
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
              <div className="flex justify-end space-x-4">
                <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
                  Annuler
                </Button>
                <Button type="submit">
                  {isEditMode ? 'Enregistrer les modifications' : 'Enregistrer'}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default AddNewCiterne;
