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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { PlusCircle, User } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import type { Conducteur, ConducteurInsert, ConducteurUpdate } from '@/types';
import { UseMutationResult } from '@tanstack/react-query';

const formSchema = z.object({
  name: z.string().nonempty("Le nom est requis"),
  phone: z.string().nonempty("Le téléphone est requis"),
  status: z.enum(['available', 'on_delivery', 'maintenance']),
  avatar: z.instanceof(File).optional(),
});

interface AddNewConducteurProps {
  createConducteur: UseMutationResult<any, Error, ConducteurInsert, unknown>;
  updateConducteur: UseMutationResult<any, Error, ConducteurUpdate, unknown>;
  conducteurToEdit?: Conducteur | null;
  onFinished: () => void;
}

const AddNewConducteur: React.FC<AddNewConducteurProps> = ({ createConducteur, updateConducteur, conducteurToEdit, onFinished }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [avatarPreview, setAvatarPreview] = React.useState<string | null>(null);
  const isEditMode = !!conducteurToEdit;
  const isSubmitting = createConducteur.isPending || updateConducteur.isPending;

  const defaultValues = {
    name: '',
    phone: '',
    status: 'available' as const,
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  useEffect(() => {
    if (conducteurToEdit) {
      form.reset({
        name: conducteurToEdit.name,
        phone: conducteurToEdit.phone || '',
        status: conducteurToEdit.status,
      });
      setAvatarPreview(conducteurToEdit.avatar_url || null);
      setIsOpen(true);
    } else {
        form.reset(defaultValues);
    }
  }, [conducteurToEdit, form]);

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      form.reset(defaultValues);
      setAvatarPreview(null);
      onFinished();
    }
  };

  const handleNewConducteur = () => {
    form.reset(defaultValues);
    setAvatarPreview(null);
    setIsOpen(true);
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarPreview(URL.createObjectURL(file));
      form.setValue('avatar', file);
    }
  };

  const handleFormSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
        let avatar_url: string | undefined = conducteurToEdit?.avatar_url;

        if (values.avatar) {
            const file = values.avatar;
            const filePath = `avatars/${Date.now()}-${file.name}`;
            const { data, error } = await supabase.storage.from('images').upload(filePath, file);

            if (error) throw error;

            const { data: { publicUrl } } = supabase.storage.from('images').getPublicUrl(data.path);
            avatar_url = publicUrl;
        }

        const submissionData = {
            name: values.name,
            phone: values.phone,
            status: values.status,
            avatar_url: avatar_url,
        };

        if (isEditMode) {
            await updateConducteur.mutateAsync({ ...submissionData, id: conducteurToEdit.id });
        } else {
            await createConducteur.mutateAsync(submissionData);
        }

        form.reset(defaultValues);
        setAvatarPreview(null);
        setIsOpen(false);
        onFinished();
    } catch (error) {
        console.error("Failed to save conducteur:", error);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={handleOpenChange}>
      <SheetTrigger asChild>
        <Button 
          className='bg-accent hover:bg-accent/90 text-accent-foreground rounded-full shadow-lg'
          onClick={handleNewConducteur}
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Ajouter un Conducteur
        </Button>
      </SheetTrigger>
      <SheetContent className="flex flex-col w-full sm:max-w-lg h-full p-0">
        <SheetHeader className="px-6 pt-6">
          <SheetTitle className='text-black'>{isEditMode ? 'Modifier le conducteur' : 'Ajouter un nouveau conducteur'}</SheetTitle>
          <SheetDescription className='text-gray-700'>
            {isEditMode ? "Modifiez les informations du conducteur." : "Remplissez les informations du nouveau conducteur."}
          </SheetDescription>
        </SheetHeader>
        <div className="flex-grow overflow-y-auto">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleFormSubmit)} className="flex flex-col h-full">
              <ScrollArea className="flex-grow px-6">
                <div className="py-4 space-y-3">
                  {/* ... Form fields remain the same ... */}
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className='text-gray-700'>Nom complet</FormLabel>
                        <FormControl>
                          <Input placeholder="Ex: Jean Dupont" {...field} className='text-gray-700 border-2 border-gray-600' />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className='text-gray-700'>Téléphone</FormLabel>
                        <FormControl>
                          <Input placeholder="Ex: +221 77 123 45 67" {...field} className='text-gray-700 border-2 border-gray-600' />
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
                        <FormLabel className='text-gray-700'>Statut</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className='text-gray-700 border-2 border-gray-600'>
                              <SelectValue placeholder="Sélectionner un statut" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="available">Disponible</SelectItem>
                            <SelectItem value="on_delivery">En livraison</SelectItem>
                            <SelectItem value="maintenance">En maintenance</SelectItem>
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
                  <Button type="button" className='text-gray-700 bg-white'  onClick={() => handleOpenChange(false)} disabled={isSubmitting}>
                    Annuler
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Enregistrement...' : (isEditMode ? 'Enregistrer les modifications' : 'Enregistrer')}
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

export default AddNewConducteur;