// Types pour les enums de la base de données
export type TypeProduit = 'Essence' | 'Gasoil';
export type StatutCommun = 'Non Livré' | 'Livré' | 'Annulée';
export type StatutPaiement = 'PAYÉ' | 'NON PAYÉ';
export type StatutConducteur = 'available' | 'on_delivery' | 'maintenance';
export type StatutCiterne = 'Disponible' | 'En livraison' | 'En maintenance';

// Types pour les tables
export interface Client {
  id: string;
  created_at: string;
  updated_at: string;
  name: string;
  contact_person?: string;
  email?: string;
  phone?: string;
  address?: string;
  user_id?: string;
}

export interface Conducteur {
  id: string;
  created_at: string;
  updated_at: string;
  name: string;
  phone?: string;
  avatar_url?: string;
  status: StatutConducteur;
  user_id?: string;
}

export interface Citerne {
  id: string;
  created_at: string;
  updated_at: string;
  registration: string;
  capacity_liters?: number;
  status: StatutCiterne;
  assigned_driver_id?: string;
  user_id?: string;
}

export interface Commande {
  id: number;
  created_at: string;
  updated_at: string;
  order_number: string;
  client_id: string;
  product: TypeProduit;
  quantity: number;
  unit_price: number;
  estimated_amount: number;
  order_date: string;
  status: StatutCommun;
  user_id?: string;
  clients?: Client;
}

export interface Livraison {
  id: number;
  created_at: string;
  updated_at: string;
  commande_id: number;
  citerne_id?: string | null;
  volume_livre: number;
  volume_manquant: number;
  montant_total: number;
  date_livraison?: string | null;
  status: StatutCommun;
  payment_status: StatutPaiement;
  user_id?: string;
  commandes?: Commande;
  citernes?: Citerne | null;
}

// Types pour les insertions (sans id, dates auto)
export type ClientInsert = Omit<Client, 'id' | 'created_at' | 'updated_at'>;
export type ConducteurInsert = Omit<Conducteur, 'id' | 'created_at' | 'updated_at'>;
export type CiterneInsert = Omit<Citerne, 'id' | 'created_at' | 'updated_at'>;
export type CommandeInsert = Omit<Commande, 'id' | 'created_at' | 'updated_at'>;
export type LivraisonInsert = Omit<Livraison, 'id' | 'created_at' | 'updated_at'>;

// Types pour les mises à jour (tous optionnels sauf id)
export type ClientUpdate = Partial<Omit<Client, 'id' | 'created_at'>> & { id: string };
export type ConducteurUpdate = Partial<Omit<Conducteur, 'id' | 'created_at'>> & { id: string };
export type CiterneUpdate = Partial<Omit<Citerne, 'id' | 'created_at'>> & { id: string };
export type CommandeUpdate = Partial<Omit<Commande, 'id' | 'created_at'>> & { id: number };
export type LivraisonUpdate = Partial<Omit<Livraison, 'id' | 'created_at'>> & { id: number };