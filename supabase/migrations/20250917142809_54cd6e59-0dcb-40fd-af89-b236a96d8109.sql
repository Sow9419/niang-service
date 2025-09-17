-- Modifier la table livraisons pour permettre des valeurs nullable lors de la création automatique
ALTER TABLE public.livraisons 
ALTER COLUMN citerne_id DROP NOT NULL,
ALTER COLUMN volume_livre DROP NOT NULL,
ALTER COLUMN volume_manquant DROP NOT NULL,
ALTER COLUMN date_livraison DROP NOT NULL;

-- Créer une fonction trigger pour créer automatiquement une livraison
CREATE OR REPLACE FUNCTION public.create_delivery_for_order()
RETURNS TRIGGER AS $$
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
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Créer le trigger qui s'exécute après l'insertion d'une commande
CREATE TRIGGER create_delivery_after_order_insert
  AFTER INSERT ON public.commandes
  FOR EACH ROW
  EXECUTE FUNCTION public.create_delivery_for_order();