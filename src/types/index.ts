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
