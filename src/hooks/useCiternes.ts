import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';
import type { Citerne, CiterneInsert, CiterneUpdate } from '@/types/database';

export function useCiternes() {
  const [citernes, setCiternes] = useState<Citerne[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  // Charger toutes les citernes
  const fetchCiternes = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('citernes')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCiternes(data || []);
    } catch (error) {
      console.error('Error fetching citernes:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les citernes",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Créer une nouvelle citerne
  const createCiterne = async (citerneData: CiterneInsert) => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('citernes')
        .insert([{ ...citerneData, user_id: user.id }])
        .select()
        .single();

      if (error) throw error;

      setCiternes(prev => [data, ...prev]);
      toast({
        title: "Succès",
        description: "Citerne créée avec succès",
      });
      return data;
    } catch (error) {
      console.error('Error creating citerne:', error);
      toast({
        title: "Erreur",
        description: "Impossible de créer la citerne",
        variant: "destructive",
      });
      return null;
    }
  };

  // Mettre à jour une citerne
  const updateCiterne = async (citerneData: CiterneUpdate) => {
    try {
      const { data, error } = await supabase
        .from('citernes')
        .update(citerneData)
        .eq('id', citerneData.id)
        .eq('user_id', user?.id)
        .select()
        .single();

      if (error) throw error;

      setCiternes(prev => prev.map(citerne => 
        citerne.id === citerneData.id ? data : citerne
      ));
      toast({
        title: "Succès",
        description: "Citerne mise à jour avec succès",
      });
      return data;
    } catch (error) {
      console.error('Error updating citerne:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour la citerne",
        variant: "destructive",
      });
      return null;
    }
  };

  // Supprimer une citerne
  const deleteCiterne = async (citerneId: string) => {
    try {
      const { error } = await supabase
        .from('citernes')
        .delete()
        .eq('id', citerneId)
        .eq('user_id', user?.id);

      if (error) throw error;

      setCiternes(prev => prev.filter(citerne => citerne.id !== citerneId));
      toast({
        title: "Succès",
        description: "Citerne supprimée avec succès",
      });
      return true;
    } catch (error) {
      console.error('Error deleting citerne:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer la citerne",
        variant: "destructive",
      });
      return false;
    }
  };

  useEffect(() => {
    fetchCiternes();
  }, [user]);

  return {
    citernes,
    loading,
    createCiterne,
    updateCiterne,
    deleteCiterne,
    refetch: fetchCiternes
  };
}