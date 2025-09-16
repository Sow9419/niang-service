import { Tables } from "./database";

export type KpiCardProps = {
    title: string;
    value: string;
    change: string;
    changeType: 'increase' | 'decrease';
    icon: React.ElementType;
};

export type Commande = Tables<'commandes'>;
export type Livraison = Tables<'livraisons'>;

export type CommandeEnCours = Pick<Commande, 'id' | 'client_id' | 'quantite_commandee' | 'prix_total'> & {
    clients: { nom: string } | null;
};

export type LivraisonRecente = Pick<Livraison, 'id' | 'commande_id' | 'statut' | 'date_livraison'> & {
    commandes: {
        quantite_commandee: number | null;
        clients: { nom: string } | null;
    } | null;
};

export type DonutChartData = {
    name: string;
    value: number;
}[];

export type BarChartData = {
    name: string;
    value: number;
}[];
