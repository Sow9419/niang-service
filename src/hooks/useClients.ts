import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';
import type { Client, ClientInsert, ClientUpdate } from '@/types/database';

// Function to fetch clients from Supabase
const fetchClients = async (userId: string) => {
  if (!userId) return [];

  const { data, error } = await supabase
    .from('clients')
    .select('*')
    .eq('user_id', userId) // FIX: Added user_id filter for security
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
};

// The main hook
export function useClients() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Query to fetch the list of clients
  const { data: clients, isLoading, isError, error } = useQuery<Client[], Error>({
    queryKey: ['clients', user?.id],
    queryFn: () => fetchClients(user!.id),
    enabled: !!user,
  });

  // Mutation for creating a new client
  const createClient = useMutation({
    mutationFn: async (clientData: ClientInsert) => {
      if (!user) throw new Error("User not authenticated");
      const { data, error } = await supabase
        .from('clients')
        .insert({ ...clientData, user_id: user.id })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast({ title: "Succès", description: "Client créé avec succès." });
      queryClient.invalidateQueries({ queryKey: ['clients'] });
    },
    onError: (error) => {
      toast({ title: "Erreur", description: `Impossible de créer le client: ${error.message}`, variant: "destructive" });
    },
  });

  // Mutation for updating a client
  const updateClient = useMutation({
    mutationFn: async (clientData: ClientUpdate) => {
      if (!user) throw new Error("User not authenticated");
      const { data, error } = await supabase
        .from('clients')
        .update(clientData)
        .eq('id', clientData.id!)
        .eq('user_id', user.id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast({ title: "Succès", description: "Client mis à jour avec succès." });
      queryClient.invalidateQueries({ queryKey: ['clients'] });
    },
    onError: (error) => {
      toast({ title: "Erreur", description: `Impossible de mettre à jour le client: ${error.message}`, variant: "destructive" });
    },
  });

  // Mutation for deleting a client
  const deleteClient = useMutation({
    mutationFn: async (clientId: string) => {
      if (!user) throw new Error("User not authenticated");
      const { error } = await supabase
        .from('clients')
        .delete()
        .eq('id', clientId)
        .eq('user_id', user.id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast({ title: "Succès", description: "Client supprimé avec succès." });
      queryClient.invalidateQueries({ queryKey: ['clients'] });
    },
    onError: (error) => {
      toast({ title: "Erreur", description: `Impossible de supprimer le client: ${error.message}`, variant: "destructive" });
    },
  });

  return {
    clients: clients ?? [],
    isLoading,
    isError,
    error,
    createClient,
    updateClient,
    deleteClient,
  };
}
