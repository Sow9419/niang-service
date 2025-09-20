import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';
import type { Commande, CommandeInsert, CommandeUpdate } from '@/types/database';

const ITEMS_PER_PAGE = 5;

// Interface for filters to be passed to the hook
export interface CommandeFilters {
  searchTerm?: string;
  status?: string;
  page: number;
}

// Function to fetch commandes from Supabase
const fetchCommandes = async (userId: string, filters: CommandeFilters) => {
  if (!userId) {
    return { data: [], count: 0 };
  }

  let query = supabase
    .from('commandes')
    .select(`
      *,
      clients (
        id,
        name,
        contact_person,
        email,
        phone,
        address,
        created_at,
        updated_at
      )
    `, { count: 'exact' })
    .eq('user_id', userId);

  // Apply filters
  if (filters.status && filters.status !== 'Tous') {
    query = query.eq('status', filters.status as any);
  }

  if (filters.searchTerm) {
    query = query.or(`order_number.ilike.%${filters.searchTerm}%,clients.name.ilike.%${filters.searchTerm}%`);
  }

  // Apply pagination
  const startIndex = (filters.page - 1) * ITEMS_PER_PAGE;
  query = query.range(startIndex, startIndex + ITEMS_PER_PAGE - 1);

  // Order by creation date
  query = query.order('created_at', { ascending: false });

  const { data, error, count } = await query;

  if (error) {
    // Note: The .or() filter on a joined table might fail if not structured perfectly.
    // If it fails, we try again without the client name search for resilience.
    if (error.message.includes('missing FROM-clause entry for table')) {
        console.warn("Query failed with client name search, retrying without it.");
        const fallbackQuery = supabase
            .from('commandes')
            .select('*, clients(*)', { count: 'exact' })
            .eq('user_id', userId)
            .ilike('order_number', `%${filters.searchTerm}%`)
            .range(startIndex, startIndex + ITEMS_PER_PAGE - 1)
            .order('created_at', { ascending: false });

        const { data: fallbackData, error: fallbackError, count: fallbackCount } = await fallbackQuery;
        if (fallbackError) throw fallbackError;
        return { data: fallbackData, count: fallbackCount ?? 0 };
    }
    throw error;
  }

  return { data, count: count ?? 0 };
};


// The main hook
export function useCommandes(filters: CommandeFilters) {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Query to fetch the list of commandes
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['commandes', user?.id, filters],
    queryFn: () => fetchCommandes(user!.id, filters),
    enabled: !!user, // Only run the query if the user is authenticated
  });

  // Mutation for creating a new commande
  const createCommande = useMutation({
    mutationFn: async (commandeData: CommandeInsert) => {
      if (!user) throw new Error("User not authenticated");
      const { data, error } = await supabase
        .from('commandes')
        .insert([{ ...commandeData, user_id: user.id }])
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast({ title: "Succès", description: "Commande créée avec succès." });
      // When a commande is created, invalidate the 'commandes' query to refetch the list
      queryClient.invalidateQueries({ queryKey: ['commandes'] });
    },
    onError: (error) => {
      toast({ title: "Erreur", description: `Impossible de créer la commande: ${error.message}`, variant: "destructive" });
    },
  });

  // Mutation for updating a commande
  const updateCommande = useMutation({
    mutationFn: async (commandeData: CommandeUpdate) => {
      if (!user) throw new Error("User not authenticated");
      const { data, error } = await supabase
        .from('commandes')
        .update(commandeData)
        .eq('id', commandeData.id!)
        .eq('user_id', user.id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast({ title: "Succès", description: "Commande mise à jour avec succès." });
      // Invalidate to refetch the list
      queryClient.invalidateQueries({ queryKey: ['commandes'] });
    },
    onError: (error) => {
      toast({ title: "Erreur", description: `Impossible de mettre à jour la commande: ${error.message}`, variant: "destructive" });
    },
  });

  // Mutation for deleting a commande
  const deleteCommande = useMutation({
    mutationFn: async (commandeId: number) => {
      if (!user) throw new Error("User not authenticated");
      const { error } = await supabase
        .from('commandes')
        .delete()
        .eq('id', commandeId)
        .eq('user_id', user.id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast({ title: "Succès", description: "Commande supprimée avec succès." });
      // Invalidate to refetch the list
      queryClient.invalidateQueries({ queryKey: ['commandes'] });
    },
    onError: (error) => {
      toast({ title: "Erreur", description: `Impossible de supprimer la commande: ${error.message}`, variant: "destructive" });
    },
  });

  return {
    commandes: data?.data ?? [],
    totalCount: data?.count ?? 0,
    isLoading,
    isError,
    error,
    createCommande,
    updateCommande,
    deleteCommande,
    itemsPerPage: ITEMS_PER_PAGE,
  };
}