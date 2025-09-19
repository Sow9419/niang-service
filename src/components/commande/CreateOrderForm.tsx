import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import type { Client, Commande, CommandeInsert } from '@/types';

const formSchema = z.object({
  client_id: z.string().nonempty("Le client est requis"),
  product: z.enum(['Essence', 'Gasoil']),
  quantity: z.number().min(1, "La quantité doit être supérieure à 0"),
  unit_price: z.number().min(1, "Le prix unitaire doit être supérieur à 0"),
  status: z.enum(['Non Livré', 'Livré', 'Annulée']),
});

interface CreateOrderFormProps {
  onClose: () => void;
  onSubmit: (data: CommandeInsert) => void;
  clients: Client[];
  commande?: Commande | null;
}

const CreateOrderForm: React.FC<CreateOrderFormProps> = ({ onClose, onSubmit, clients, commande }) => {
  const isEditMode = !!commande;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      client_id: '',
      product: 'Gasoil',
      quantity: 5000,
      unit_price: 850,
      status: 'Non Livré',
    },
  });

  useEffect(() => {
    if (commande) {
      form.reset({
        client_id: commande.client_id.toString(),
        product: commande.product,
        quantity: commande.quantity,
        unit_price: commande.unit_price,
        status: commande.status,
      });
    }
  }, [commande, form]);

  const { watch } = form;
  const quantity = watch('quantity');
  const unit_price = watch('unit_price');
  const estimatedAmount = (quantity || 0) * (unit_price || 0);

  const handleFormSubmit = (values: z.infer<typeof formSchema>) => {
    onSubmit({
      ...values,
      order_number: `CMD-${Date.now()}`,
      estimated_amount: estimatedAmount,
      order_date: new Date().toISOString().split('T')[0],
    } as any);
  };

  return (
    <section className="bg-white p-6 rounded-2xl shadow-sm mb-8">
      <h2 className="text-xl font-semibold text-gray-800 mb-6">
        {isEditMode ? 'Modifier la commande' : 'Créer une nouvelle commande'}
      </h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FormField
              control={form.control}
              name="client_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-gray-700'>Client associé</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className='text-gray-900'>
                        <SelectValue placeholder="Sélectionner un client" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {clients.map((client) => (
                        <SelectItem key={client.id} value={client.id.toString()}>
                          {client.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="product"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-gray-700'>Type de produit</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className='text-gray-900'>
                        <SelectValue placeholder="Sélectionner un produit" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Essence">Essence</SelectItem>
                      <SelectItem value="Gasoil">Gasoil</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="quantity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-gray-700'>Quantité commandée (L)</FormLabel>
                  <FormControl className='text-gray-900'>
                    <Input type="number" {...field} onChange={e => field.onChange(Number(e.target.value))} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="unit_price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-gray-700'>Prix unitaire (FCFA/L)</FormLabel>
                  <FormControl className='text-gray-900'>
                    <Input type="number" {...field} onChange={e => field.onChange(Number(e.target.value))} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <div>
                <FormLabel className='text-gray-700'>Montant estimé (FCFA)</FormLabel>
                <Input value={estimatedAmount.toLocaleString('fr-FR')} disabled className="bg-gray-100 mt-2 text-gray-900" />
            </div>
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='text-gray-700'>Statut de la commande</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className='text-gray-900'>
                        <SelectValue placeholder="Sélectionner un statut" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Non Livré">Non Livré</SelectItem>
                      <SelectItem value="Livré">Livré</SelectItem>
                      <SelectItem value="Annulée">Annulée</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-4">
            <Button type="button" className='text-gray-900 bg-white border border-gray-300' onClick={onClose}>
              Annuler
            </Button>
            <Button type="submit">
              {isEditMode ? 'Enregistrer les modifications' : 'Enregistrer la commande'}
            </Button>
          </div>
        </form>
      </Form>
    </section>
  );
};

export default CreateOrderForm;