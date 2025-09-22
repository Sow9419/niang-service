import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';

export interface DashboardStats {
  totalCommandes: number;
  commandesEnCours: number;
  commandesLivrees: number;
  commandesAnnulees: number;
  totalLivraisons: number;
  livraisonsEnCours: number;
  livraisonsLivrees: number;
  montantTotal: number;
  montantPaye: number;
  montantEnAttente: number;
  volumeTotalLivre: number;
  volumeTotalManquant: number;
  conducteursDisponibles: number;
  citernes: {
    total: number;
    disponibles: number;
    enLivraison: number;
    enMaintenance: number;
  };
}

export function useAnalytics() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchAnalytics = async () => {
    if (!user) return;

    try {
      setLoading(true);

      const { data, error } = await supabase.rpc('get_analytics_stats', { p_user_id: user.id });

      if (error) {
        throw error;
      }

      setStats(data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les statistiques",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [user]);

  return {
    stats,
    loading,
    refetch: fetchAnalytics
  };
}