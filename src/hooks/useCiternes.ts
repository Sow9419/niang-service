import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';
import type { Citerne, CiterneInsert, CiterneUpdate } from '@/types/database';

// Function to fetch citernes from Supabase
const fetchCiternes = async (userId: string) => {
  if (!userId) return [];

  const { data, error } = await supabase
    .from('citernes')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
};

// The main hook
export function useCiternes() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Query to fetch the list of citernes
  const { data: citernes, isLoading, isError, error } = useQuery<Citerne[], Error>({
    queryKey: ['citernes', user?.id],
    queryFn: () => fetchCiternes(user!.id),
    enabled: !!user,
  });

  // Mutation for creating a new citerne
  const createCiterne = useMutation({
    mutationFn: async (citerneData: CiterneInsert) => {
      if (!user) throw new Error("User not authenticated");
      const { data, error } = await supabase
        .from('citernes')
        .insert({ ...citerneData, user_id: user.id })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast({ title: "Succès", description: "Citerne créée avec succès." });
      queryClient.invalidateQueries({ queryKey: ['citernes'] });
    },
    onError: (error) => {
      toast({ title: "Erreur", description: `Impossible de créer la citerne: ${error.message}`, variant: "destructive" });
    },
  });

  // Mutation for updating a citerne
  const updateCiterne = useMutation({
    mutationFn: async (citerneData: CiterneUpdate) => {
      if (!user) throw new Error("User not authenticated");
      const { data, error } = await supabase
        .from('citernes')
        .update(citerneData)
        .eq('id', citerneData.id!)
        .eq('user_id', user.id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast({ title: "Succès", description: "Citerne mise à jour avec succès." });
      queryClient.invalidateQueries({ queryKey: ['citernes'] });
    },
    onError: (error) => {
      toast({ title: "Erreur", description: `Impossible de mettre à jour la citerne: ${error.message}`, variant: "destructive" });
    },
  });

  // Mutation for deleting a citerne
  const deleteCiterne = useMutation({
    mutationFn: async (citerneId: string) => {
      if (!user) throw new Error("User not authenticated");
      const { error } = await supabase
        .from('citernes')
        .delete()
        .eq('id', citerneId)
        .eq('user_id', user.id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast({ title: "Succès", description: "Citerne supprimée avec succès." });
      queryClient.invalidateQueries({ queryKey: ['citernes'] });
    },
    onError: (error) => {
      toast({ title: "Erreur", description: `Impossible de supprimer la citerne: ${error.message}`, variant: "destructive" });
    },
  });

  return {
    citernes: citernes ?? [],
    isLoading,
    isError,
    error,
    createCiterne,
    updateCiterne,
    deleteCiterne,
  };
}