-- Ajouter le champ montant_total à la table livraisons
ALTER TABLE public.livraisons 
ADD COLUMN montant_total bigint DEFAULT 0;