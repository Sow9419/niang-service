-- Corrige la fonction handle_new_user pour qu'elle s'exécute avec les privilèges du créateur.
-- Cela permet de contourner la politique de sécurité (RLS) lors de la création
-- automatique d'un profil utilisateur, qui échouait car auth.uid() était null
-- dans le contexte du déclencheur (trigger).
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name, phone, company_name)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data ->> 'full_name',
    NEW.raw_user_meta_data ->> 'phone', 
    NEW.raw_user_meta_data ->> 'company_name'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;
