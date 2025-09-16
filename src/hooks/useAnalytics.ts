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

      // Paralléliser toutes les requêtes
      const [
        commandesData,
        livraisonsData,
        conducteursData,
        citernesData
      ] = await Promise.all([
        supabase
          .from('commandes')
          .select('status, estimated_amount')
          .eq('user_id', user.id),
        
        supabase
          .from('livraisons')
          .select('status, payment_status, volume_livre, volume_manquant')
          .eq('user_id', user.id),
        
        supabase
          .from('conducteurs')
          .select('status')
          .eq('user_id', user.id),
        
        supabase
          .from('citernes')
          .select('status')
          .eq('user_id', user.id)
      ]);

      const commandes = commandesData.data || [];
      const livraisons = livraisonsData.data || [];
      const conducteurs = conducteursData.data || [];
      const citernes = citernesData.data || [];

      // Calculer les statistiques
      const dashboardStats: DashboardStats = {
        // Statistiques des commandes
        totalCommandes: commandes.length,
        commandesEnCours: commandes.filter(c => c.status === 'Non Livré').length,
        commandesLivrees: commandes.filter(c => c.status === 'Livré').length,
        commandesAnnulees: commandes.filter(c => c.status === 'Annulée').length,

        // Statistiques des livraisons
        totalLivraisons: livraisons.length,
        livraisonsEnCours: livraisons.filter(l => l.status === 'Non Livré').length,
        livraisonsLivrees: livraisons.filter(l => l.status === 'Livré').length,

        // Statistiques financières
        montantTotal: commandes.reduce((sum, c) => sum + (c.estimated_amount || 0), 0),
        montantPaye: livraisons
          .filter(l => l.payment_status === 'PAYÉ')
          .reduce((sum, l) => {
            const commande = commandes.find(c => c.status === 'Livré');
            return sum + (commande?.estimated_amount || 0);
          }, 0),
        montantEnAttente: livraisons
          .filter(l => l.payment_status === 'NON PAYÉ')
          .reduce((sum, l) => {
            const commande = commandes.find(c => c.status === 'Livré');
            return sum + (commande?.estimated_amount || 0);
          }, 0),

        // Statistiques de volume
        volumeTotalLivre: livraisons.reduce((sum, l) => sum + (l.volume_livre || 0), 0),
        volumeTotalManquant: livraisons.reduce((sum, l) => sum + (l.volume_manquant || 0), 0),

        // Statistiques des conducteurs
        conducteursDisponibles: conducteurs.filter(c => c.status === 'available').length,

        // Statistiques des citernes
        citernes: {
          total: citernes.length,
          disponibles: citernes.filter(c => c.status === 'Disponible').length,
          enLivraison: citernes.filter(c => c.status === 'En livraison').length,
          enMaintenance: citernes.filter(c => c.status === 'En maintenance').length,
        }
      };

      setStats(dashboardStats);
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