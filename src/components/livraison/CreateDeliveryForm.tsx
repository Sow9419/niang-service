import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import type { Livraison, Commande, Citerne, LivraisonUpdate } from '@/types';

const formSchema = z.object({
  commande_id: z.number().positive("La commande est requise"),
  citerne_id: z.number().positive("La citerne est requise"),
  volume_manquant: z.number().min(0, "Le volume manquant ne peut pas être négatif"),
  date_livraison: z.string().nonempty("La date de livraison est requise"),
  status: z.enum(['Non Livré', 'Livré', 'Annulée']),
  payment_status: z.enum(['NON PAYÉ', 'PAYÉ']),
});

interface CreateDeliveryFormProps {
  onClose: () => void;
  onSubmit: (data: LivraisonUpdate) => void;
  deliveryData: Livraison | null;
  commandes: Commande[];
  citernes: Citerne[];
}

const CreateDeliveryForm: React.FC<CreateDeliveryFormProps> = ({ onClose, onSubmit, deliveryData, commandes, citernes }) => {
  const isEditMode = !!deliveryData;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      volume_manquant: 0,
      date_livraison: new Date().toISOString().split('T')[0],
      status: 'Non Livré',
      payment_status: 'NON PAYÉ',
    },
  });

  const { watch, setValue } = form;
  const selectedCommandeId = watch('commande_id');
  const volumeManquant = watch('volume_manquant');

  const selectedCommande = commandes.find(c => c.id === selectedCommandeId);
  const volumeLivre = selectedCommande ? selectedCommande.quantity - (volumeManquant || 0) : 0;

  useEffect(() => {
    if (deliveryData) {
      form.reset({
        commande_id: deliveryData.commande_id,
        citerne_id: deliveryData.citerne_id,
        volume_manquant: deliveryData.volume_manquant,
        date_livraison: new Date(deliveryData.date_livraison).toISOString().split('T')[0],
        status: deliveryData.status,
        payment_status: deliveryData.payment_status,
      });
    }
  }, [deliveryData, form]);

  const handleFormSubmit = (values: z.infer<typeof formSchema>) => {
    onSubmit({ ...values, volume_livre: volumeLivre });
  };

  return (
    <section className="bg-white p-6 rounded-2xl shadow-sm mb-8">
      <h2 className="text-xl font-semibold text-gray-800 mb-6">
        {isEditMode ? 'Modifier la livraison' : 'Enregistrer une nouvelle livraison'}
      </h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <FormField
              control={form.control}
              name="commande_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Commande associée</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value?.toString()} disabled={isEditMode}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner une commande" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {commandes.map((commande) => (
                        <SelectItem key={commande.id} value={commande.id.toString()}>
                          {`${commande.order_number} - ${commande.clients.name}`}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormItem>
              <FormLabel>Client</FormLabel>
              <Input value={selectedCommande?.clients.name || ''} disabled className="bg-gray-100" />
            </FormItem>
            <FormItem>
              <FormLabel>Quantité commandée (L)</FormLabel>
              <Input value={selectedCommande?.quantity.toLocaleString('fr-FR') || ''} disabled className="bg-gray-100" />
            </FormItem>
            <FormField
              control={form.control}
              name="citerne_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Citerne utilisée</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value?.toString()}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner une citerne" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {citernes.map((citerne) => (
                        <SelectItem key={citerne.id} value={citerne.id.toString()}>
                          {citerne.registration}
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
              name="volume_manquant"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Volume manquant (L)</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} onChange={e => field.onChange(Number(e.target.value))} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormItem>
              <FormLabel>Volume livré (L)</FormLabel>
              <Input value={volumeLivre.toLocaleString('fr-FR')} disabled className="bg-gray-100" />
            </FormItem>
            <FormField
              control={form.control}
              name="date_livraison"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date de livraison</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Statut de la livraison</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
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
            <FormField
              control={form.control}
              name="payment_status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Statut du paiement</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner un statut" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="NON PAYÉ">NON PAYÉ</SelectItem>
                      <SelectItem value="PAYÉ">PAYÉ</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Annuler
            </Button>
            <Button type="submit">
              {isEditMode ? 'Mettre à jour' : 'Enregistrer la livraison'}
            </Button>
          </div>
        </form>
      </Form>
    </section>
  );
};

export default CreateDeliveryForm;