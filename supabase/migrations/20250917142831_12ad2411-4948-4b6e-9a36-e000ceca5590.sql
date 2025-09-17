-- Corriger la fonction trigger pour la sécurité
CREATE OR REPLACE FUNCTION public.create_delivery_for_order()
RETURNS TRIGGER 
LANGUAGE plpgsql 
SECURITY DEFINER 
SET search_path = public
AS $$
BEGIN
  -- Créer automatiquement une livraison pour la nouvelle commande
  INSERT INTO public.livraisons (
    commande_id,
    user_id,
    status,
    payment_status,
    volume_livre,
    volume_manquant
  ) VALUES (
    NEW.id,
    NEW.user_id,
    'Non Livré',
    'NON PAYÉ',
    0,
    0
  );
  
  RETURN NEW;
END;
$$;