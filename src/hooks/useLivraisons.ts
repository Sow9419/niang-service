import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';
import type { Livraison, LivraisonInsert, LivraisonUpdate } from '@/types/database';

const fetchLivraisons = async (userId: string) => {
  if (!userId) return [];

  const { data, error } = await supabase
    .from('livraisons')
    .select(`
      *,
      commandes (
        *,
        clients (*)
      ),
      citernes (
        *,
        conducteurs (*)
      )
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
};

export function useLivraisons() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: livraisons, isLoading, isError, error } = useQuery<Livraison[], Error>({
    queryKey: ['livraisons', user?.id],
    queryFn: () => fetchLivraisons(user!.id),
    enabled: !!user,
  });

  const createLivraison = useMutation({
    mutationFn: async (livraisonData: LivraisonInsert) => {
      if (!user) throw new Error("User not authenticated");

      const { data, error } = await supabase
        .from('livraisons')
        .insert({ ...livraisonData, user_id: user.id })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      toast({ title: "Succès", description: "Livraison créée avec succès." });
      queryClient.invalidateQueries({ queryKey: ['livraisons'] });
      // Also invalidate commandes as their status might change
      queryClient.invalidateQueries({ queryKey: ['commandes'] });
      queryClient.invalidateQueries({ queryKey: ['allCommandes'] });
    },
    onError: (error) => {
      toast({ title: "Erreur", description: `Impossible de créer la livraison: ${error.message}`, variant: "destructive" });
    },
  });

  const updateLivraison = useMutation({
    mutationFn: async (livraisonData: LivraisonUpdate) => {
      if (!user) throw new Error("User not authenticated");

      const { data, error } = await supabase
        .from('livraisons')
        .update(livraisonData)
        .eq('id', livraisonData.id!)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: async (data) => {
      toast({ title: "Succès", description: "Livraison mise à jour avec succès." });

      // Synchronize the command status if the delivery status was changed
      if (data.status && data.commande_id) {
        await supabase
          .from('commandes')
          .update({ status: data.status })
          .eq('id', data.commande_id);
      }

      queryClient.invalidateQueries({ queryKey: ['livraisons'] });
      queryClient.invalidateQueries({ queryKey: ['commandes'] });
      queryClient.invalidateQueries({ queryKey: ['allCommandes'] });
    },
    onError: (error) => {
      toast({ title: "Erreur", description: `Impossible de mettre à jour la livraison: ${error.message}`, variant: "destructive" });
    },
  });

  const deleteLivraison = useMutation({
    mutationFn: async (livraisonId: number) => {
      if (!user) throw new Error("User not authenticated");
      const { error } = await supabase
        .from('livraisons')
        .delete()
        .eq('id', livraisonId)
        .eq('user_id', user.id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast({ title: "Succès", description: "Livraison supprimée avec succès." });
      queryClient.invalidateQueries({ queryKey: ['livraisons'] });
    },
    onError: (error) => {
      toast({ title: "Erreur", description: `Impossible de supprimer la livraison: ${error.message}`, variant: "destructive" });
    },
  });

  return {
    livraisons: livraisons ?? [],
    isLoading,
    isError,
    error,
    createLivraison,
    updateLivraison,
    deleteLivraison,
  };
}