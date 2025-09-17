export * from './database';

export type KpiCardProps = {
    title: string;
    value: string;
    change: string;
    changeType: 'increase' | 'decrease';
    icon: React.ElementType;
};

export type DonutChartData = {
    name: string;
    value: number;
}[];

export type BarChartData = {
    name: string;
    value: number;
}[];

// Types pour UI
export type CommandeStatus = 'Non Livré' | 'Livré' | 'Annulée';
export type LivraisonStatus = 'Non Livré' | 'Livré' | 'Annulée';
export type LivraisonPaymentStatus = 'PAYÉ' | 'NON PAYÉ';
import type { Conducteur } from './database';
export type Driver = Conducteur;

// Types pour Dashboard
export interface CommandeEnCours {
  id: number;
  status: CommandeStatus;
  quantity: number;
  estimated_amount: number;
  clients: { name: string };
}

export interface LivraisonRecente {
  id: number;
  status: LivraisonStatus;
  date_livraison: string;
  commandes: {
    quantity: number;
    clients: { name: string };
  };
}
