import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { PlusCircle } from 'lucide-react';
import type { Client, ClientInsert, ClientUpdate } from '@/types';
import { supabase } from '@/integrations/supabase/client';

const formSchema = z.object({
  name: z.string().nonempty("Le nom est requis"),
  phone: z.string().nonempty("Le téléphone est requis"),
  address: z.string().nonempty("L'adresse est requise"),
  contact_person: z.string().optional(),
  email: z.string().email("L'email n'est pas valide").optional(),
});

interface AddNewClientProps {
  createClient: (data: ClientInsert) => Promise<any>;
  updateClient: (data: ClientUpdate) => Promise<any>;
  clientToEdit?: Client | null;
  onFinished: () => void;
}

const AddNewClient: React.FC<AddNewClientProps> = ({ createClient, updateClient, clientToEdit, onFinished }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const isEditMode = !!clientToEdit;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      phone: '',
      address: '',
      contact_person: '',
      email: '',
    },
  });

  useEffect(() => {
    if (clientToEdit) {
      form.reset(clientToEdit);
      setIsOpen(true);
    } else {
      form.reset();
    }
  }, [clientToEdit, form]);

  const handleFormSubmit = async (values: z.infer<typeof formSchema>) => {
    const { data: { user } } = await supabase.auth.getUser();
    const success = isEditMode
      ? await updateClient({ ...values, id: clientToEdit.id, user_id: user?.id })
      : await createClient({ ...values, user_id: user?.id } as any);

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
          Ajouter un Client
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>{isEditMode ? 'Modifier le client' : 'Ajouter un nouveau client'}</SheetTitle>
        </SheetHeader>
        <div className="py-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
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
                name="contact_person"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Personne à contacter</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Jane Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: email@example.com" {...field} />
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
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Adresse</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: 123, Rue de Dakar" {...field} />
                    </FormControl>
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

export default AddNewClient;