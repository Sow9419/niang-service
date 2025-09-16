import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';
import type { Commande, CommandeInsert, CommandeUpdate, Client } from '@/types/database';

export function useCommandes() {
  const [commandes, setCommandes] = useState<Commande[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  // Charger toutes les commandes avec les détails client
  const fetchCommandes = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('commandes')
        .select(`
          *,
          clients:client_id (
            id,
            name,
            contact_person,
            email,
            phone,
            address
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCommandes(data || []);
    } catch (error) {
      console.error('Error fetching commandes:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les commandes",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Créer une nouvelle commande
  const createCommande = async (commandeData: CommandeInsert) => {
    if (!user) return null;

    try {
      // Générer un numéro de commande unique
      const orderNumber = `CMD-${Date.now()}`;
      
      const { data, error } = await supabase
        .from('commandes')
        .insert([{ 
          ...commandeData, 
          user_id: user.id,
          order_number: orderNumber 
        }])
        .select(`
          *,
          clients:client_id (
            id,
            name,
            contact_person,
            email,
            phone,
            address
          )
        `)
        .single();

      if (error) throw error;

      setCommandes(prev => [data, ...prev]);
      toast({
        title: "Succès",
        description: "Commande créée avec succès",
      });
      return data;
    } catch (error) {
      console.error('Error creating commande:', error);
      toast({
        title: "Erreur",
        description: "Impossible de créer la commande",
        variant: "destructive",
      });
      return null;
    }
  };

  // Mettre à jour une commande
  const updateCommande = async (commandeData: CommandeUpdate) => {
    try {
      const { data, error } = await supabase
        .from('commandes')
        .update(commandeData)
        .eq('id', commandeData.id)
        .eq('user_id', user?.id)
        .select(`
          *,
          clients:client_id (
            id,
            name,
            contact_person,
            email,
            phone,
            address
          )
        `)
        .single();

      if (error) throw error;

      setCommandes(prev => prev.map(commande => 
        commande.id === commandeData.id ? data : commande
      ));
      toast({
        title: "Succès",
        description: "Commande mise à jour avec succès",
      });
      return data;
    } catch (error) {
      console.error('Error updating commande:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour la commande",
        variant: "destructive",
      });
      return null;
    }
  };

  // Supprimer une commande
  const deleteCommande = async (commandeId: number) => {
    try {
      const { error } = await supabase
        .from('commandes')
        .delete()
        .eq('id', commandeId)
        .eq('user_id', user?.id);

      if (error) throw error;

      setCommandes(prev => prev.filter(commande => commande.id !== commandeId));
      toast({
        title: "Succès",
        description: "Commande supprimée avec succès",
      });
      return true;
    } catch (error) {
      console.error('Error deleting commande:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer la commande",
        variant: "destructive",
      });
      return false;
    }
  };

  // Calculer le montant estimé d'une commande
  const calculateEstimatedAmount = (quantity: number, unitPrice: number) => {
    return quantity * unitPrice;
  };

  useEffect(() => {
    fetchCommandes();
  }, [user]);

  return {
    commandes,
    loading,
    createCommande,
    updateCommande,
    deleteCommande,
    calculateEstimatedAmount,
    refetch: fetchCommandes
  };
}