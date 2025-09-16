import React, { useState, useEffect } from 'react';
import type { Livraison } from '../../types';

const InputField = ({ label, id, ...props }: { label: string; id: string; [key: string]: any }) => (
    <div className="flex-1 min-w-[200px]">
        <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
        <input id={id} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500" {...props} />
    </div>
);

const SelectField = ({ label, id, children, ...props }: { label: string; id: string; children: React.ReactNode; [key: string]: any }) => (
     <div className="flex-1 min-w-[200px]">
        <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
        <select id={id} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500 bg-white" {...props}>
            {children}
        </select>
    </div>
);

interface CreateDeliveryFormProps {
    onClose: () => void;
    deliveryData: Livraison | null;
}

const CreateDeliveryForm: React.FC<CreateDeliveryFormProps> = ({ onClose, deliveryData }) => {
    const [formData, setFormData] = useState({
        commande_order_number: '',
        client: '',
        commande_quantity: '',
        citerne: 'Citerne 1',
        volume_livre: '',
        volume_manquant: '',
        date_livraison: new Date().toISOString().split('T')[0],
        status: 'Non Livré',
        payment_status: 'NON PAYÉ',
    });

    // In a real app, this would be fetched from an API
    const mockCommandes = [
        { order_number: '#1256', client: 'Client E', quantity: 8000 },
        { order_number: '#1255', client: 'Client D', quantity: 5000 },
        { order_number: '#1254', client: 'Client B', quantity: 5500 },
        { order_number: '#1253', client: 'Client A', quantity: 10000 },
        { order_number: '#1252', client: 'Client C', quantity: 8000 },
        { order_number: '#1251', client: 'Client F', quantity: 3000 },
        { order_number: '#1250', client: 'Client G', quantity: 12000 },
    ];

    useEffect(() => {
        if (deliveryData) {
            const relatedCommande = mockCommandes.find(c => c.order_number === deliveryData.commande_order_number);
            setFormData({
                commande_order_number: deliveryData.commande_order_number,
                client: deliveryData.client,
                commande_quantity: String(relatedCommande?.quantity || ''),
                citerne: deliveryData.citerne,
                volume_livre: String(deliveryData.volume_livre),
                volume_manquant: String(deliveryData.volume_manquant),
                date_livraison: deliveryData.date_livraison.split('/').reverse().join('-'),
                status: deliveryData.status,
                payment_status: deliveryData.payment_status,
            });
        }
    }, [deliveryData]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { id, value } = e.target;
        
        if (id === 'volume_manquant') {
            const manquant = Number(value) || 0;
            const quantity = Number(formData.commande_quantity) || 0;
            const livre = Math.max(0, quantity - manquant); // Prevent negative delivered volume
            setFormData(prev => ({ 
                ...prev, 
                volume_manquant: value,
                volume_livre: String(livre)
            }));
        } else {
            setFormData(prev => ({ ...prev, [id]: value }));
        }
    };

    const handleCommandeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedCommande = mockCommandes.find(c => c.order_number === e.target.value);
        if (selectedCommande) {
            setFormData(prev => ({
                ...prev,
                commande_order_number: selectedCommande.order_number,
                client: selectedCommande.client,
                commande_quantity: String(selectedCommande.quantity),
                volume_manquant: '0',
                volume_livre: String(selectedCommande.quantity), // Initially, delivered is full quantity
            }));
        } else {
             setFormData(prev => ({
                ...prev,
                commande_order_number: '',
                client: '',
                commande_quantity: '',
                volume_livre: '',
                volume_manquant: '',
            }));
        }
    };
    
    const isEditing = deliveryData !== null;
    const formTitle = isEditing ? 'Modifier la livraison' : 'Enregistrer une nouvelle livraison';

    return (
        <section className="bg-white p-6 rounded-2xl shadow-sm mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">{formTitle}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                <SelectField label="Commande associée" id="commande_order_number" value={formData.commande_order_number} onChange={handleCommandeChange}>
                    <option value="">Sélectionner une commande</option>
                    {mockCommandes.map(c => <option key={c.order_number} value={c.order_number}>{`${c.order_number} - ${c.client}`}</option>)}
                </SelectField>
                <InputField label="Client" id="client" value={formData.client} disabled className="bg-gray-100" />
                <InputField label="Quantité commandée (L)" id="commande_quantity" value={formData.commande_quantity} disabled className="bg-gray-100" />
                 <SelectField label="Citerne utilisée" id="citerne" value={formData.citerne} onChange={handleChange}>
                    <option>Citerne 1</option>
                    <option>Citerne 2</option>
                    <option>Citerne 3</option>
                    <option>Citerne 4</option>
                </SelectField>
                <InputField 
                    label="Volume manquant (L)" 
                    id="volume_manquant" 
                    type="number" 
                    placeholder="Ex: 50"
                    value={formData.volume_manquant}
                    onChange={handleChange} 
                />
                <InputField 
                    label="Volume livré (L)" 
                    id="volume_livre" 
                    type="number" 
                    placeholder="Ex: 5000" 
                    value={formData.volume_livre} 
                    disabled
                    className="bg-gray-100"
                />
                 <InputField 
                    label="Date de livraison" 
                    id="date_livraison" 
                    type="date"
                    value={formData.date_livraison}
                    onChange={handleChange} 
                />
            </div>
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                <SelectField label="Statut de la livraison" id="status" value={formData.status} onChange={handleChange}>
                    <option value="Non Livré">Non Livré</option>
                    <option value="Livré">Livré</option>
                    <option value="Annulée">Annulée</option>
                </SelectField>
                <SelectField label="Statut du paiement" id="payment_status" value={formData.payment_status} onChange={handleChange}>
                    <option value="NON PAYÉ">NON PAYÉ</option>
                    <option value="PAYÉ">PAYÉ</option>
                </SelectField>
            </div>
            <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-4">
                <button 
                    onClick={onClose}
                    className="w-full sm:w-auto px-6 py-2 border border-gray-300 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                >
                    Annuler
                </button>
                <button className="w-full sm:w-auto px-6 py-2 bg-orange-500 text-white rounded-lg text-sm font-semibold hover:bg-orange-600 transition-colors shadow-sm">
                    {isEditing ? 'Mettre à jour' : 'Enregistrer la livraison'}
                </button>
            </div>
        </section>
    );
};

export default CreateDeliveryForm;