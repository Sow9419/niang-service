import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';
import type { Conducteur, ConducteurInsert, ConducteurUpdate } from '@/types/database';

export function useConducteurs() {
  const [conducteurs, setConducteurs] = useState<Conducteur[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  // Charger tous les conducteurs
  const fetchConducteurs = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('conducteurs')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setConducteurs(data || []);
    } catch (error) {
      console.error('Error fetching conducteurs:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les conducteurs",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Créer un nouveau conducteur
  const createConducteur = async (conducteurData: ConducteurInsert) => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('conducteurs')
        .insert([{ ...conducteurData, user_id: user.id }])
        .select()
        .single();

      if (error) throw error;

      setConducteurs(prev => [data, ...prev]);
      toast({
        title: "Succès",
        description: "Conducteur créé avec succès",
      });
      return data;
    } catch (error) {
      console.error('Error creating conducteur:', error);
      toast({
        title: "Erreur",
        description: "Impossible de créer le conducteur",
        variant: "destructive",
      });
      return null;
    }
  };

  // Mettre à jour un conducteur
  const updateConducteur = async (conducteurData: ConducteurUpdate) => {
    try {
      const { data, error } = await supabase
        .from('conducteurs')
        .update(conducteurData)
        .eq('id', conducteurData.id)
        .eq('user_id', user?.id)
        .select()
        .single();

      if (error) throw error;

      setConducteurs(prev => prev.map(conducteur => 
        conducteur.id === conducteurData.id ? data : conducteur
      ));
      toast({
        title: "Succès",
        description: "Conducteur mis à jour avec succès",
      });
      return data;
    } catch (error) {
      console.error('Error updating conducteur:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le conducteur",
        variant: "destructive",
      });
      return null;
    }
  };

  // Supprimer un conducteur
  const deleteConducteur = async (conducteurId: string) => {
    try {
      const { error } = await supabase
        .from('conducteurs')
        .delete()
        .eq('id', conducteurId)
        .eq('user_id', user?.id);

      if (error) throw error;

      setConducteurs(prev => prev.filter(conducteur => conducteur.id !== conducteurId));
      toast({
        title: "Succès",
        description: "Conducteur supprimé avec succès",
      });
      return true;
    } catch (error) {
      console.error('Error deleting conducteur:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le conducteur",
        variant: "destructive",
      });
      return false;
    }
  };

  useEffect(() => {
    fetchConducteurs();
  }, [user]);

  return {
    conducteurs,
    loading,
    createConducteur,
    updateConducteur,
    deleteConducteur,
    refetch: fetchConducteurs
  };
}