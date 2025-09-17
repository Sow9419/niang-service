import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Client, ClientInsert, ClientUpdate } from '@/types';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from './useAuth';

export function useClients() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();

  const fetchClients = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching clients:', error);
      toast({
        title: "Erreur lors de la récupération des clients",
        description: error.message,
        variant: "destructive",
      });
    } else {
      setClients(data || []);
    }
    setLoading(false);
  }, [toast]);

  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  const createClient = async (clientData: ClientInsert) => {
    const { data, error } = await supabase
      .from('clients')
      .insert(clientData)
      .select()
      .single();

    if (error) {
      console.error('Error creating client:', error);
      toast({
        title: "Erreur lors de la création du client",
        description: error.message,
        variant: "destructive",
      });
      return null;
    } else {
      if (data) {
        setClients(prevClients => [data, ...prevClients]);
        toast({
          title: "Client créé",
          description: "Le nouveau client a été ajouté avec succès.",
        });
        return data;
      }
      return null;
    }
  };

  const updateClient = async (clientData: ClientUpdate) => {
    if (!user) return null;
    try {
      const { data, error } = await supabase
        .from('clients')
        .update(clientData)
        .eq('id', clientData.id)
        .eq('user_id', user.id)
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

  const deleteClient = async (clientId: string) => {
    if (!user) return false;
    try {
      const { error } = await supabase
        .from('clients')
        .delete()
        .eq('id', clientId)
        .eq('user_id', user.id);

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

  return { clients, loading, createClient, updateClient, deleteClient, fetchClients };
}
