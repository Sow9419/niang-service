
import { useState } from "react";
import { Droplets, Wallet, ListOrdered, Truck, Plus } from "lucide-react";
import BarChartComponent from "@/components/dasboard/BarChartComponent";
import DonutChartComponent from "@/components/dasboard/DonutChartComponent";
import KpiCard from "@/components/dasboard/KpiCard";
import OngoingOrders from "@/components/dasboard/OngoingOrders";
import RecentDeliveries from "@/components/dasboard/RecentDeliveries";
import { useDashboardAnalytics, Period } from "@/hooks/useDashboardAnalytics";
import { Navigate, useNavigate } from "react-router-dom";

export default function Dashboard() {
    const [activeTab, setActiveTab] = useState<Period>('Mois');
    const navigator = useNavigate();
    const { 
        kpiData,
        commandesEnCours,
        livraisonsRecentes,
        donutChartData,
        barChartData,
        isLoading 
    } = useDashboardAnalytics(activeTab);

    const kpiTitlePeriod = `(${activeTab})`;

    return (
        <div className="space-y-8">
            {/* Header */}
            <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white p-4 rounded-2xl shadow-sm">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Tableau de Bord en Temps Réel</h1>
                </div>
                <button onClick={() => navigator('/orders')} className="flex items-center gap-2 bg-orange-500 text-white font-semibold px-4 py-2.5 rounded-xl shadow-md hover:bg-orange-600 transition-colors duration-300 mt-4 sm:mt-0">
                    <Plus className="w-5 h-5" />
                    <span>Nouvelle Commande</span>
                </button>
            </header>

            {/* KPI Section */}
            <div className=" p-0 rounded-2xl shadow-sm">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4 sm:mb-0">
                        Indicateurs Clés de Performance
                    </h2>
                    <div className="flex items-center bg-white p-1 rounded-full">
                        {(['Jour', 'Semaine', 'Mois'] as Period[]).map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-4 py-1.5 text-sm font-semibold rounded-full transition-colors duration-300 ${
                                    activeTab === tab ? 'bg-black text-white shadow-sm' : 'text-gray-900 hover:bg-gray-200'
                                }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                </div>
                
                {/* KPI Cards */}
                <div className="grid gap-6 grid-cols-2 md:grid-cols-2 lg:grid-cols-4">
                    <KpiCard 
                        title={`Chiffre d'affaires ${kpiTitlePeriod}`}
                        value={`${kpiData.revenue.toLocaleString('fr-FR')} CFA`}
                        change={kpiData.revenueChange.toString()}
                        changeType={kpiData.revenueChange >= 0 ? 'increase' : 'decrease'}
                        icon={Wallet}
                    />
                    <KpiCard 
                        title={`Volume livré ${kpiTitlePeriod}`}
                        value={`${kpiData.volume.toLocaleString('fr-FR')} L`}
                        change={kpiData.volumeChange.toString()}
                        changeType={kpiData.volumeChange >= 0 ? 'increase' : 'decrease'}
                        icon={Droplets}
                    />
                    <KpiCard 
                        title="Commandes en cours"
                        value={kpiData.orders.toString()}
                        change={kpiData.ordersChange.toString()}
                        changeType={kpiData.ordersChange >= 0 ? 'increase' : 'decrease'}
                        icon={ListOrdered}
                    />
                    <KpiCard 
                        title={`Livraisons ${kpiTitlePeriod}`}
                        value={kpiData.deliveries.toString()}
                        change={kpiData.deliveriesChange.toString()}
                        changeType={kpiData.deliveriesChange >= 0 ? 'increase' : 'decrease'}
                        icon={Truck}
                    />
                </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                <div className="lg:col-span-2">
                    <BarChartComponent data={barChartData} isLoading={isLoading} period={activeTab} />
                </div>
                <div className="lg:col-span-1">
                    <DonutChartComponent data={donutChartData} isLoading={isLoading} />
                </div>
            </div>

            {/* Recent Activities */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 pb-20 md:pb-0 lg:pb-0">
                <div className="lg:col-span-2">
                    <RecentDeliveries deliveries={livraisonsRecentes} isLoading={isLoading} />
                </div>
                <div className="lg:col-span-1">
                    <OngoingOrders orders={commandesEnCours} isLoading={isLoading} />
                </div>
            </div>
        </div>
    );
}

