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
    bar_chart_data_json JSONB;
BEGIN
    -- Determine date ranges for KPIs
    CASE p_period
        WHEN 'Jour' THEN
            v_start_date := CURRENT_DATE;
            v_prev_start_date := v_start_date - INTERVAL '1 day';
            v_prev_end_date := v_start_date;
        WHEN 'Semaine' THEN
            v_start_date := date_trunc('week', CURRENT_DATE);
            v_prev_start_date := v_start_date - INTERVAL '1 week';
            v_prev_end_date := v_start_date;
        ELSE -- 'Mois'
            v_start_date := date_trunc('month', CURRENT_DATE);
            v_prev_start_date := v_start_date - INTERVAL '1 month';
            v_prev_end_date := v_start_date;
    END CASE;

    -- Generate Bar Chart Data based on period
    IF p_period = 'Jour' THEN
        SELECT jsonb_agg(q.day_data)
        INTO bar_chart_data_json
        FROM (
            SELECT jsonb_build_object('name', to_char(d.day, 'Dy'), 'value', COALESCE(SUM(l.montant_total), 0)) as day_data
            FROM generate_series(CURRENT_DATE - INTERVAL '6 days', CURRENT_DATE, '1 day'::interval) as d(day)
            LEFT JOIN livraisons l ON l.date_livraison::date = d.day::date AND l.status = 'Livré'
            GROUP BY d.day
            ORDER BY d.day
        ) q;
    ELSIF p_period = 'Semaine' THEN
        SELECT jsonb_agg(q.week_data)
        INTO bar_chart_data_json
        FROM (
            SELECT jsonb_build_object('name', 'S' || to_char(d.week, 'W'), 'value', COALESCE(SUM(l.montant_total), 0)) as week_data
            FROM generate_series(date_trunc('week', CURRENT_DATE) - INTERVAL '3 weeks', date_trunc('week', CURRENT_DATE), '1 week'::interval) as d(week)
            LEFT JOIN livraisons l ON date_trunc('week', l.date_livraison::date) = d.week AND l.status = 'Livré'
            GROUP BY d.week
            ORDER BY d.week
        ) q;
    ELSE -- 'Mois'
        SELECT jsonb_agg(q.month_data)
        INTO bar_chart_data_json
        FROM (
            SELECT jsonb_build_object('name', to_char(d.month, 'Mon'), 'value', COALESCE(SUM(l.montant_total), 0)) as month_data
            FROM generate_series(date_trunc('month', CURRENT_DATE) - INTERVAL '11 months', date_trunc('month', CURRENT_DATE), '1 month'::interval) as d(month)
            LEFT JOIN livraisons l ON date_trunc('month', l.date_livraison::date) = d.month AND l.status = 'Livré'
            GROUP BY d.month
            ORDER BY d.month
        ) q;
    END IF;

    -- Consolidate all data into a single JSON object
    WITH kpi_data AS (
        SELECT
            (SELECT COALESCE(SUM(montant_total), 0) FROM livraisons WHERE status = 'Livré' AND date_livraison >= v_start_date) AS current_revenue,
            (SELECT COALESCE(SUM(montant_total), 0) FROM livraisons WHERE status = 'Livré' AND date_livraison >= v_prev_start_date AND date_livraison < v_prev_end_date) AS previous_revenue,
            (SELECT COALESCE(SUM(volume_livre), 0) FROM livraisons WHERE status = 'Livré' AND date_livraison >= v_start_date) AS current_volume,
            (SELECT COALESCE(SUM(volume_livre), 0) FROM livraisons WHERE status = 'Livré' AND date_livraison >= v_prev_start_date AND date_livraison < v_prev_end_date) AS previous_volume,
            (SELECT COUNT(*) FROM commandes WHERE status = 'Non Livré') AS orders_in_progress,
            (SELECT COUNT(*) FROM livraisons WHERE status = 'Livré' AND date_livraison >= v_start_date) AS current_deliveries,
            (SELECT COUNT(*) FROM livraisons WHERE status = 'Livré' AND date_livraison >= v_prev_start_date AND date_livraison < v_prev_end_date) AS previous_deliveries
    ),
    recent_commandes AS (
        SELECT c.id, c.status, c.quantity, c.estimated_amount, jsonb_build_object('name', cl.name) as clients
        FROM commandes c
        JOIN clients cl ON c.client_id = cl.id
        WHERE c.status IN ('Non Livré', 'Livré')
        ORDER BY c.created_at DESC
        LIMIT 3
    ),
    recent_livraisons AS (
        SELECT l.id, l.status, l.date_livraison, l.volume_livre,
               jsonb_build_object('quantity', c.quantity, 'clients', jsonb_build_object('name', cl.name)) as commandes
        FROM livraisons l
        JOIN commandes c ON l.commande_id = c.id
        JOIN clients cl ON c.client_id = cl.id
        WHERE l.status = 'Livré'
        ORDER BY l.date_livraison DESC
        LIMIT 3
    ),
    donut_data AS (
        SELECT
            (SELECT COALESCE(SUM(volume_livre), 0) FROM livraisons WHERE status = 'Livré' AND date_livraison >= v_start_date) AS volume_livre,
            (SELECT COALESCE(SUM(volume_manquant), 0) FROM livraisons WHERE date_livraison >= v_start_date) AS volume_manquant
    )
    SELECT jsonb_build_object(
        'kpiData', (SELECT to_jsonb(kpi_data.*) FROM kpi_data),
        'commandesEnCours', COALESCE((SELECT jsonb_agg(to_jsonb(rc.*)) FROM recent_commandes rc), '[]'::jsonb),
        'livraisonsRecentes', COALESCE((SELECT jsonb_agg(to_jsonb(rl.*)) FROM recent_livraisons rl), '[]'::jsonb),
        'donutChartData', (SELECT jsonb_build_array(
                                jsonb_build_object('name', 'Volume livré', 'value', dd.volume_livre),
                                jsonb_build_object('name', 'Volume manquant', 'value', dd.volume_manquant)
                           ) FROM donut_data dd),
        'barChartData', COALESCE(bar_chart_data_json, '[]'::jsonb)
    ) INTO result;

    RETURN result;
END;
$$;
