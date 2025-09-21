CREATE OR REPLACE FUNCTION get_analytics_stats(p_user_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
AS $$
DECLARE
    stats JSONB;
BEGIN
    SELECT jsonb_build_object(
        'totalCommandes', (SELECT COUNT(*) FROM commandes WHERE user_id = p_user_id),
        'commandesEnCours', (SELECT COUNT(*) FROM commandes WHERE user_id = p_user_id AND status = 'Non Livré'),
        'commandesLivrees', (SELECT COUNT(*) FROM commandes WHERE user_id = p_user_id AND status = 'Livré'),
        'commandesAnnulees', (SELECT COUNT(*) FROM commandes WHERE user_id = p_user_id AND status = 'Annulée'),
        'totalLivraisons', (SELECT COUNT(*) FROM livraisons WHERE user_id = p_user_id),
        'livraisonsEnCours', (SELECT COUNT(*) FROM livraisons WHERE user_id = p_user_id AND status = 'Non Livré'),
        'livraisonsLivrees', (SELECT COUNT(*) FROM livraisons WHERE user_id = p_user_id AND status = 'Livré'),
        'montantTotal', (SELECT COALESCE(SUM(estimated_amount), 0) FROM commandes WHERE user_id = p_user_id),
        'montantPaye', (SELECT COALESCE(SUM(l.montant_total), 0) FROM livraisons l WHERE l.user_id = p_user_id AND l.payment_status = 'PAYÉ'),
        'montantEnAttente', (SELECT COALESCE(SUM(c.estimated_amount), 0) FROM commandes c JOIN livraisons l ON c.id = l.commande_id WHERE l.user_id = p_user_id AND l.payment_status = 'NON PAYÉ'),
        'volumeTotalLivre', (SELECT COALESCE(SUM(volume_livre), 0) FROM livraisons WHERE user_id = p_user_id),
        'volumeTotalManquant', (SELECT COALESCE(SUM(volume_manquant), 0) FROM livraisons WHERE user_id = p_user_id),
        'conducteursDisponibles', (SELECT COUNT(*) FROM conducteurs WHERE user_id = p_user_id AND status = 'available'),
        'citernes', (SELECT jsonb_build_object(
            'total', (SELECT COUNT(*) FROM citernes WHERE user_id = p_user_id),
            'disponibles', (SELECT COUNT(*) FROM citernes WHERE user_id = p_user_id AND status = 'Disponible'),
            'enLivraison', (SELECT COUNT(*) FROM citernes WHERE user_id = p_user_id AND status = 'En livraison'),
            'enMaintenance', (SELECT COUNT(*) FROM citernes WHERE user_id = p_user_id AND status = 'En maintenance')
        ))
    ) INTO stats;

    RETURN stats;
END;
$$;

CREATE OR REPLACE FUNCTION get_dashboard_analytics(p_period TEXT)
RETURNS JSONB
LANGUAGE plpgsql
AS $$
DECLARE
    result JSONB;
    v_start_date DATE;
    v_prev_start_date DATE;
    v_prev_end_date DATE;
BEGIN
    -- Determine date ranges based on period
    CASE p_period
        WHEN 'Jour' THEN
            v_start_date := CURRENT_DATE;
            v_prev_start_date := v_start_date - INTERVAL '1 day';
            v_prev_end_date := v_start_date;
        WHEN 'Semaine' THEN
            v_start_date := date_trunc('week', CURRENT_DATE);
            v_prev_start_date := v_start_date - INTERVAL '1 week';
            v_prev_end_date := v_start_date;
        WHEN 'Mois' THEN
            v_start_date := date_trunc('month', CURRENT_DATE);
            v_prev_start_date := v_start_date - INTERVAL '1 month';
            v_prev_end_date := v_start_date;
        ELSE
            v_start_date := date_trunc('month', CURRENT_DATE);
            v_prev_start_date := v_start_date - INTERVAL '1 month';
            v_prev_end_date := v_start_date;
    END CASE;

    WITH current_period_livraisons AS (
        SELECT montant_total, volume_livre, date_livraison FROM livraisons WHERE status = 'Livré' AND date_livraison >= v_start_date
    ),
    previous_period_livraisons AS (
        SELECT montant_total, volume_livre FROM livraisons WHERE status = 'Livré' AND date_livraison >= v_prev_start_date AND date_livraison < v_prev_end_date
    ),
    kpi_stats AS (
        SELECT
            (SELECT COALESCE(SUM(montant_total), 0) FROM current_period_livraisons) AS current_revenue,
            (SELECT COALESCE(SUM(montant_total), 0) FROM previous_period_livraisons) AS previous_revenue,
            (SELECT COALESCE(SUM(volume_livre), 0) FROM current_period_livraisons) AS current_volume,
            (SELECT COALESCE(SUM(volume_livre), 0) FROM previous_period_livraisons) AS previous_volume,
            (SELECT COUNT(*) FROM commandes WHERE status = 'Non Livré') AS orders_in_progress,
            (SELECT COUNT(*) FROM current_period_livraisons) AS current_deliveries,
            (SELECT COUNT(*) FROM previous_period_livraisons) AS previous_deliveries
    ),
    recent_commandes AS (
        SELECT c.id, c.status, c.quantity, c.estimated_amount, cl.name as client_name
        FROM commandes c
        JOIN clients cl ON c.client_id = cl.id
        WHERE c.status IN ('Non Livré', 'Livré')
        ORDER BY c.created_at DESC
        LIMIT 3
    ),
    recent_livraisons AS (
        SELECT l.id, l.status, l.date_livraison, l.volume_livre, c.quantity, cl.name as client_name
        FROM livraisons l
        JOIN commandes c ON l.commande_id = c.id
        JOIN clients cl ON c.client_id = cl.id
        WHERE l.status = 'Livré'
        ORDER BY l.date_livraison DESC
        LIMIT 3
    ),
    donut_chart AS (
        SELECT
            (SELECT COALESCE(SUM(volume_livre), 0) FROM current_period_livraisons) AS volume_livre,
            (SELECT COALESCE(SUM(volume_manquant), 0) FROM livraisons WHERE date_livraison >= v_start_date) AS volume_manquant
    ),
    bar_chart_data AS (
        SELECT
            jsonb_agg(
                jsonb_build_object('name', name, 'value', value)
            ) as data
        FROM (
            SELECT
                CASE
                    WHEN p_period = 'Jour' THEN to_char(d, 'Dy')
                    WHEN p_period = 'Semaine' THEN 'S' || to_char(d, 'W')
                    ELSE to_char(d, 'Mon')
                END as name,
                COALESCE(SUM(l.montant_total), 0) as value
            FROM
                generate_series(
                    CASE
                        WHEN p_period = 'Jour' THEN CURRENT_DATE - INTERVAL '6 days'
                        WHEN p_period = 'Semaine' THEN date_trunc('week', CURRENT_DATE) - INTERVAL '3 weeks'
                        ELSE date_trunc('month', CURRENT_DATE) - INTERVAL '11 months'
                    END,
                    CURRENT_DATE,
                    CASE
                        WHEN p_period = 'Jour' THEN '1 day'
                        WHEN p_period = 'Semaine' THEN '1 week'
                        ELSE '1 month'
                    END
                ) as d
            LEFT JOIN livraisons l ON l.date_livraison = d AND l.status = 'Livré'
            GROUP BY d
            ORDER BY d
        ) as chart_series
    )
    SELECT jsonb_build_object(
        'kpiData', (SELECT to_jsonb(kpi_stats.*) FROM kpi_stats),
        'commandesEnCours', (SELECT jsonb_agg(to_jsonb(recent_commandes.*)) FROM recent_commandes),
        'livraisonsRecentes', (SELECT jsonb_agg(to_jsonb(recent_livraisons.*)) FROM recent_livraisons),
        'donutChartData', (
            SELECT jsonb_build_array(
                jsonb_build_object('name', 'Volume livré', 'value', volume_livre),
                jsonb_build_object('name', 'Volume manquant', 'value', volume_manquant)
            )
            FROM donut_chart
        ),
        'barChartData', (SELECT data FROM bar_chart_data)
    ) INTO result;

    RETURN result;
END;
$$;
