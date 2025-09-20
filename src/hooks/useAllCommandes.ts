import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import type { Commande } from '@/types/database';

const fetchAllCommandes = async (userId: string) => {
  if (!userId) return [];

  const { data, error } = await supabase
    .from('commandes')
    .select(`
      *,
      clients (
        id,
        name,
        contact_person,
        email,
        phone,
        address,
        created_at,
        updated_at
      )
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return data || [];
};

export function useAllCommandes() {
  const { user } = useAuth();

  return useQuery<Commande[], Error>({
    queryKey: ['allCommandes', user?.id],
    queryFn: () => fetchAllCommandes(user!.id),
    enabled: !!user,
  });
}
