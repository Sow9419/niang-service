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

import { useAuth } from './useAuth';

export function useDashboardAnalytics(period: Period = 'Mois') {
    const { user } = useAuth();
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
        if (!user) return;

        const fetchData = async () => {
            setIsLoading(true);
            try {
                const { data, error } = await supabase.rpc('get_dashboard_analytics', {
                    p_period: period,
                    p_user_id: user.id
                });

                if (error) {
                    throw error;
                }

                const { kpiData: kpi, commandesEnCours, livraisonsRecentes, donutChartData, barChartData } = data;

                setKpiData({
                    revenue: kpi.current_revenue,
                    volume: kpi.current_volume,
                    orders: kpi.orders_in_progress,
                    deliveries: kpi.current_deliveries,
                    revenueChange: calculateChange(kpi.current_revenue, kpi.previous_revenue),
                    volumeChange: calculateChange(kpi.current_volume, kpi.previous_volume),
                    ordersChange: 0, // This was 0 in the original code
                    deliveriesChange: calculateChange(kpi.current_deliveries, kpi.previous_deliveries),
                });

                setCommandesEnCours(commandesEnCours || []);
                setLivraisonsRecentes(livraisonsRecentes || []);
                setDonutChartData(donutChartData || []);
                setBarChartData(barChartData || []);

            } catch (error) {
                console.error("Error fetching dashboard data:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [period, user]);

    return { kpiData, commandesEnCours, livraisonsRecentes, donutChartData, barChartData, isLoading };
}

