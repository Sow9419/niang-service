import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';
import type { Client, ClientInsert, ClientUpdate } from '@/types/database';

export function useClients() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  // Charger tous les clients
  const fetchClients = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setClients(data || []);
    } catch (error) {
      console.error('Error fetching clients:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les clients",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Créer un nouveau client
  const createClient = async (clientData: ClientInsert) => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('clients')
        .insert([{ ...clientData, user_id: user.id }])
        .select()
        .single();

      if (error) throw error;

      setClients(prev => [data, ...prev]);
      toast({
        title: "Succès",
        description: "Client créé avec succès",
      });
      return data;
    } catch (error) {
      console.error('Error creating client:', error);
      toast({
        title: "Erreur",
        description: "Impossible de créer le client",
        variant: "destructive",
      });
      return null;
    }
  };

  // Mettre à jour un client
  const updateClient = async (clientData: ClientUpdate) => {
    try {
      const { data, error } = await supabase
        .from('clients')
        .update(clientData)
        .eq('id', clientData.id)
        .eq('user_id', user?.id)
        .select()
        .single();

      if (error) throw error;

      setClients(prev => prev.map(client => 
        client.id === clientData.id ? data : client
      ));
      toast({
        title: "Succès",
        description: "Client mis à jour avec succès",
      });
      return data;
    } catch (error) {
      console.error('Error updating client:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le client",
        variant: "destructive",
      });
      return null;
    }
  };

  // Supprimer un client
  const deleteClient = async (clientId: string) => {
    try {
      const { error } = await supabase
        .from('clients')
        .delete()
        .eq('id', clientId)
        .eq('user_id', user?.id);

      if (error) throw error;

      setClients(prev => prev.filter(client => client.id !== clientId));
      toast({
        title: "Succès",
        description: "Client supprimé avec succès",
      });
      return true;
    } catch (error) {
      console.error('Error deleting client:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le client",
        variant: "destructive",
      });
      return false;
    }
  };

  useEffect(() => {
    fetchClients();
  }, [user]);

  return {
    clients,
    loading,
    createClient,
    updateClient,
    deleteClient,
    refetch: fetchClients
  };
}