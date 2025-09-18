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

const formSchema = z.object({
  name: z.string().nonempty("Le nom est requis"),
  phone: z.string().nonempty("Le téléphone est requis"),
  status: z.enum(['available', 'on_delivery', 'maintenance']),
  avatar: z.instanceof(File).optional(),
});

interface AddNewConducteurProps {
  createConducteur: (data: ConducteurInsert) => Promise<any>;
  updateConducteur: (data: ConducteurUpdate) => Promise<any>;
  conducteurToEdit?: Conducteur | null;
  onFinished: () => void;
}

const AddNewConducteur: React.FC<AddNewConducteurProps> = ({ createConducteur, updateConducteur, conducteurToEdit, onFinished }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [avatarPreview, setAvatarPreview] = React.useState<string | null>(null);
  const isEditMode = !!conducteurToEdit;

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
      form.reset(conducteurToEdit);
      setAvatarPreview(conducteurToEdit.avatar_url || null);
      setIsOpen(true);
    }
  }, [conducteurToEdit, form]);

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      // Reset form and avatar when closing
      form.reset(defaultValues);
      setAvatarPreview(null);
      // Clear edit mode if we're not editing anymore
      if (!conducteurToEdit) {
        onFinished();
      }
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
    let avatarUrl: string | undefined = conducteurToEdit?.avatar_url;

    if (values.avatar) {
      const file = values.avatar;
      const filePath = `avatars/${Date.now()}-${file.name}`;
      const { data, error } = await supabase.storage
        .from('images')
        .upload(filePath, file);

      if (error) {
        console.error("Error uploading avatar:", error);
        return;
      }

      const { data: { publicUrl } } = supabase.storage.from('images').getPublicUrl(data.path);
      avatarUrl = publicUrl;
    }

    const success = isEditMode
      ? await updateConducteur({ id: conducteurToEdit.id, name: values.name, phone: values.phone, status: values.status, avatar_url: avatarUrl })
      : await createConducteur({ name: values.name, phone: values.phone, status: values.status, avatar_url: avatarUrl });

    if (success) {
      form.reset();
      setAvatarPreview(null);
      setIsOpen(false);
      onFinished();
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
          <SheetTitle>{isEditMode ? 'Modifier le conducteur' : 'Ajouter un nouveau conducteur'}</SheetTitle>
          <SheetDescription>
            {isEditMode ? "Modifiez les informations du conducteur." : "Remplissez les informations du nouveau conducteur."}
          </SheetDescription>
        </SheetHeader>
        <div className="flex-grow overflow-y-auto">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleFormSubmit)} className="flex flex-col h-full">
              <ScrollArea className="flex-grow px-6">
                <div className="py-4 space-y-6">
                  <div className="flex flex-col items-center space-y-4">
                    <Avatar className="h-24 w-24">
                      <AvatarImage src={avatarPreview || undefined} />
                      <AvatarFallback>
                        <User className="h-12 w-12" />
                      </AvatarFallback>
                    </Avatar>
                    <FormField
                      control={form.control}
                      name="avatar"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input id="avatar-upload" type="file" className="sr-only" onChange={handleAvatarChange} accept="image/*" />
                          </FormControl>
                          <Button asChild variant="outline">
                            <label htmlFor="avatar-upload">Changer l'avatar</label>
                          </Button>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nom complet</FormLabel>
                        <FormControl>
                          <Input placeholder="Ex: Jean Dupont" {...field} />
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
                        <FormLabel>Téléphone</FormLabel>
                        <FormControl>
                          <Input placeholder="Ex: +221 77 123 45 67" {...field} />
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
                  <Button type="button" variant="outline" onClick={() => handleOpenChange(false)}>
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

export default AddNewConducteur;