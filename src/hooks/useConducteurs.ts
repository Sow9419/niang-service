import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';
import type { Conducteur, ConducteurInsert, ConducteurUpdate } from '@/types/database';

// Function to fetch conducteurs from Supabase
const fetchConducteurs = async (userId: string) => {
  if (!userId) return [];

  const { data, error } = await supabase
    .from('conducteurs')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
};

// The main hook
export function useConducteurs() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Query to fetch the list of conducteurs
  const { data: conducteurs, isLoading, isError, error } = useQuery<Conducteur[], Error>({
    queryKey: ['conducteurs', user?.id],
    queryFn: () => fetchConducteurs(user!.id),
    enabled: !!user,
  });

  // Mutation for creating a new conducteur
  const createConducteur = useMutation({
    mutationFn: async (conducteurData: ConducteurInsert) => {
      if (!user) throw new Error("User not authenticated");
      const { data, error } = await supabase
        .from('conducteurs')
        .insert({ ...conducteurData, user_id: user.id })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast({ title: "Succès", description: "Conducteur créé avec succès." });
      queryClient.invalidateQueries({ queryKey: ['conducteurs'] });
    },
    onError: (error) => {
      toast({ title: "Erreur", description: `Impossible de créer le conducteur: ${error.message}`, variant: "destructive" });
    },
  });

  // Mutation for updating a conducteur
  const updateConducteur = useMutation({
    mutationFn: async (conducteurData: ConducteurUpdate) => {
      if (!user) throw new Error("User not authenticated");
      const { data, error } = await supabase
        .from('conducteurs')
        .update(conducteurData)
        .eq('id', conducteurData.id!)
        .eq('user_id', user.id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast({ title: "Succès", description: "Conducteur mis à jour avec succès." });
      queryClient.invalidateQueries({ queryKey: ['conducteurs'] });
    },
    onError: (error) => {
      toast({ title: "Erreur", description: `Impossible de mettre à jour le conducteur: ${error.message}`, variant: "destructive" });
    },
  });

  // Mutation for deleting a conducteur
  const deleteConducteur = useMutation({
    mutationFn: async (conducteurId: string) => {
      if (!user) throw new Error("User not authenticated");
      const { error } = await supabase
        .from('conducteurs')
        .delete()
        .eq('id', conducteurId)
        .eq('user_id', user.id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast({ title: "Succès", description: "Conducteur supprimé avec succès." });
      queryClient.invalidateQueries({ queryKey: ['conducteurs'] });
    },
    onError: (error) => {
      toast({ title: "Erreur", description: `Impossible de supprimer le conducteur: ${error.message}`, variant: "destructive" });
    },
  });

  return {
    conducteurs: conducteurs ?? [],
    isLoading,
    isError,
    error,
    createConducteur,
    updateConducteur,
    deleteConducteur,
  };
}