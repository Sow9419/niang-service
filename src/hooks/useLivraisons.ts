import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';
import type { Livraison, LivraisonInsert, LivraisonUpdate } from '@/types/database';

export function useLivraisons() {
  const [livraisons, setLivraisons] = useState<Livraison[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  // Charger toutes les livraisons avec les détails
  const fetchLivraisons = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('livraisons')
        .select(`
          *,
          commandes:commande_id (
            id,
            order_number,
            product,
            quantity,
            estimated_amount,
            clients:client_id (
              id,
              name,
              contact_person
            )
          ),
          citernes:citerne_id (
            id,
            registration,
            capacity_liters,
            conducteurs:assigned_driver_id (
              id,
              name,
              phone
            )
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setLivraisons(data || []);
    } catch (error) {
      console.error('Error fetching livraisons:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les livraisons",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Créer une nouvelle livraison
  const createLivraison = async (livraisonData: LivraisonInsert, commandeQuantity: number) => {
    if (!user) return null;

    try {
      // Calculer automatiquement le volume livré
      const volumeLivre = commandeQuantity - livraisonData.volume_manquant;
      
      const { data, error } = await supabase
        .from('livraisons')
        .insert([{ 
          ...livraisonData, 
          volume_livre: volumeLivre,
          user_id: user.id 
        }])
        .select(`
          *,
          commandes:commande_id (
            id,
            order_number,
            product,
            quantity,
            estimated_amount,
            clients:client_id (
              id,
              name,
              contact_person
            )
          ),
          citernes:citerne_id (
            id,
            registration,
            capacity_liters,
            conducteurs:assigned_driver_id (
              id,
              name,
              phone
            )
          )
        `)
        .single();

      if (error) throw error;

      // Mettre à jour le statut de la commande
      await supabase
        .from('commandes')
        .update({ status: data.status })
        .eq('id', data.commande_id);

      setLivraisons(prev => [data, ...prev]);
      toast({
        title: "Succès",
        description: "Livraison créée avec succès",
      });
      return data;
    } catch (error) {
      console.error('Error creating livraison:', error);
      toast({
        title: "Erreur",
        description: "Impossible de créer la livraison",
        variant: "destructive",
      });
      return null;
    }
  };

  // Mettre à jour une livraison
  const updateLivraison = async (livraisonData: LivraisonUpdate, commandeQuantity?: number) => {
    try {
      // Recalculer le volume livré si volume_manquant est modifié
      const updateData = { ...livraisonData };
      if (commandeQuantity && livraisonData.volume_manquant !== undefined) {
        updateData.volume_livre = commandeQuantity - livraisonData.volume_manquant;
      }

      const { data, error } = await supabase
        .from('livraisons')
        .update(updateData)
        .eq('id', livraisonData.id)
        .eq('user_id', user?.id)
        .select(`
          *,
          commandes:commande_id (
            id,
            order_number,
            product,
            quantity,
            estimated_amount,
            clients:client_id (
              id,
              name,
              contact_person
            )
          ),
          citernes:citerne_id (
            id,
            registration,
            capacity_liters,
            conducteurs:assigned_driver_id (
              id,
              name,
              phone
            )
          )
        `)
        .single();

      if (error) throw error;

      // Synchroniser le statut avec la commande si modifié
      if (livraisonData.status) {
        await supabase
          .from('commandes')
          .update({ status: livraisonData.status })
          .eq('id', data.commande_id);
      }

      setLivraisons(prev => prev.map(livraison => 
        livraison.id === livraisonData.id ? data : livraison
      ));
      toast({
        title: "Succès",
        description: "Livraison mise à jour avec succès",
      });
      return data;
    } catch (error) {
      console.error('Error updating livraison:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour la livraison",
        variant: "destructive",
      });
      return null;
    }
  };

  // Supprimer une livraison
  const deleteLivraison = async (livraisonId: number) => {
    try {
      const { error } = await supabase
        .from('livraisons')
        .delete()
        .eq('id', livraisonId)
        .eq('user_id', user?.id);

      if (error) throw error;

      setLivraisons(prev => prev.filter(livraison => livraison.id !== livraisonId));
      toast({
        title: "Succès",
        description: "Livraison supprimée avec succès",
      });
      return true;
    } catch (error) {
      console.error('Error deleting livraison:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer la livraison",
        variant: "destructive",
      });
      return false;
    }
  };

  // Calculer le volume livré
  const calculateVolumeLivre = (quantiteCommande: number, volumeManquant: number) => {
    return quantiteCommande - volumeManquant;
  };

  useEffect(() => {
    fetchLivraisons();
  }, [user]);

  return {
    livraisons,
    loading,
    createLivraison,
    updateLivraison,
    deleteLivraison,
    calculateVolumeLivre,
    refetch: fetchLivraisons
  };
}