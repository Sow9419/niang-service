import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { CommandeEnCours, LivraisonRecente, DonutChartData, BarChartData } from '@/types';

export type Period = 'Jour' | 'Semaine' | 'Mois';

const calculateChange = (current: number, previous: number) => {
    if (previous === 0) return current > 0 ? 100 : 0;
    return parseFloat((((current - previous) / previous) * 100).toFixed(1));
};

const getDates = (period: Period) => {
    const today = new Date();
    let start, p_start, p_end;

    switch (period) {
        case 'Jour':
            start = new Date(today.setHours(0, 0, 0, 0));
            p_start = new Date(new Date().setDate(start.getDate() - 1));
            p_end = start;
            break;
        case 'Semaine':
            const dayOfWeek = today.getDay();
            start = new Date(today.setDate(today.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1)));
            start.setHours(0, 0, 0, 0);
            p_start = new Date(new Date().setDate(start.getDate() - 7));
            p_end = start;
            break;
        case 'Mois':
        default:
            start = new Date(today.getFullYear(), today.getMonth(), 1);
            p_start = new Date(today.getFullYear(), today.getMonth() - 1, 1);
            p_end = start;
            break;
    }
    return { 
        start: start.toISOString(), 
        p_start: p_start.toISOString(), 
        p_end: p_end.toISOString() 
    };
}

export function useDashboardAnalytics(period: Period = 'Mois') {
    const [kpiData, setKpiData] = useState({
        revenue: 0, volume: 0, orders: 0, deliveries: 0,
        revenueChange: 0, volumeChange: 0, ordersChange: 0, deliveriesChange: 0,
    });
    const [commandesEnCours, setCommandesEnCours] = useState<CommandeEnCours[]>([]);
    const [livraisonsRecentes, setLivraisonsRecentes] = useState<LivraisonRecente[]>([]);
    const [donutChartData, setDonutChartData] = useState<DonutChartData>([]);
    const [barChartData, setBarChartData] = useState<BarChartData>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const { start, p_start, p_end } = getDates(period);

                const p1 = supabase.from('livraisons').select('montant_total').eq('status', 'Livré').gte('created_at', start);
                const p2 = supabase.from('livraisons').select('montant_total').eq('status', 'Livré').gte('created_at', p_start).lt('created_at', p_end);
                const p3 = supabase.from('livraisons').select('volume_livre').eq('status', 'Livré').gte('date_livraison', start);
                const p4 = supabase.from('livraisons').select('volume_livre').eq('status', 'Livré').gte('date_livraison', p_start).lt('date_livraison', p_end);
                const p5 = supabase.from('commandes').select('id', { count: 'exact' }).in('status', ['Non Livré']);
                const p6 = supabase.from('livraisons').select('id', { count: 'exact' }).eq('status', 'Livré').gte('date_livraison', start);
                const p7 = supabase.from('livraisons').select('id', { count: 'exact' }).eq('status', 'Livré').gte('date_livraison', p_start).lt('date_livraison', p_end);
                const p8 = supabase.from('commandes').select(`id, status, quantity, estimated_amount, clients ( name )`).in('status', ['Non Livré', 'Livré']).order('created_at', { ascending: false }).limit(3);
                const p9 = supabase.from('livraisons').select(`id, status, date_livraison, volume_livre, commandes ( quantity, clients ( name ) )`).eq('status', 'Livré').order('date_livraison', { ascending: false }).limit(3);

                const [ 
                    currentRevenueRes, previousRevenueRes, currentVolumeRes, previousVolumeRes, 
                    ordersRes, currentDeliveriesRes, previousDeliveriesRes, commandesRes, livraisonsRes
                ] = await Promise.all([p1, p2, p3, p4, p5, p6, p7, p8, p9]);

                const currentRevenue = currentRevenueRes.data?.reduce((sum, item) => sum + (item.montant_total || 0), 0) || 0;
                const previousRevenue = previousRevenueRes.data?.reduce((sum, item) => sum + (item.montant_total || 0), 0) || 0;
                const currentVolume = currentVolumeRes.data?.reduce((sum, item) => sum + (item.volume_livre || 0), 0) || 0;
                const previousVolume = previousVolumeRes.data?.reduce((sum, item) => sum + (item.volume_livre || 0), 0) || 0;
                
                setKpiData({
                    revenue: currentRevenue,
                    volume: currentVolume,
                    orders: ordersRes.count || 0,
                    deliveries: currentDeliveriesRes.count || 0,
                    revenueChange: calculateChange(currentRevenue, previousRevenue),
                    volumeChange: calculateChange(currentVolume, previousVolume),
                    ordersChange: 0, 
                    deliveriesChange: calculateChange(currentDeliveriesRes.count || 0, previousDeliveriesRes.count || 0),
                });

                if (commandesRes.error) throw commandesRes.error;
                setCommandesEnCours(commandesRes.data as CommandeEnCours[]);

                if (livraisonsRes.error) throw livraisonsRes.error;
                setLivraisonsRecentes(livraisonsRes.data as LivraisonRecente[]);

                // Calculer le volume manquant total depuis les livraisons
                const totalVolumeManquant = await supabase
                    .from('livraisons')
                    .select('volume_manquant')
                    .gte('created_at', start);
                
                const volumeManquant = totalVolumeManquant.data?.reduce((sum, item) => sum + (item.volume_manquant || 0), 0) || 0;

                setDonutChartData([
                    { name: 'Volume livré', value: currentVolume },
                    { name: 'Volume manquant', value: volumeManquant },
                ]);

                // Données pour le graphique en barres (chiffre d'affaires par jour de la semaine)
                const dailyRevenueData = [];
                const days = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
                
                for (let i = 0; i < 7; i++) {
                    const dayStart = new Date();
                    dayStart.setDate(dayStart.getDate() - (6 - i));
                    dayStart.setHours(0, 0, 0, 0);
                    
                    const dayEnd = new Date(dayStart);
                    dayEnd.setHours(23, 59, 59, 999);

                    const dayRevenue = await supabase
                        .from('livraisons')
                        .select('montant_total')
                        .eq('status', 'Livré')
                        .gte('date_livraison', dayStart.toISOString().split('T')[0])
                        .lte('date_livraison', dayEnd.toISOString().split('T')[0]);

                    const revenue = dayRevenue.data?.reduce((sum: number, item: any) => {
                        return sum + (item.montant_total || 0);
                    }, 0) || 0;

                    dailyRevenueData.push({
                        name: days[dayStart.getDay()],
                        value: revenue
                    });
                }

                setBarChartData(dailyRevenueData);

            } catch (error) {
                console.error("Error fetching dashboard data:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [period]);

    return { kpiData, commandesEnCours, livraisonsRecentes, donutChartData, barChartData, isLoading };
}
