import React, { useState, useMemo } from 'react';

const InputField = ({ label, id, ...props }) => (
    <div className="flex-1 min-w-[200px]">
        <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
        <input id={id} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500" {...props} />
    </div>
);

const SelectField = ({ label, id, children, ...props }) => (
     <div className="flex-1 min-w-[200px]">
        <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
        <select id={id} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-orange-500 focus:border-orange-500 bg-white" {...props}>
            {children}
        </select>
    </div>
);

const CreateOrderForm: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const [quantity, setQuantity] = useState(5000);
    const [unitPrice, setUnitPrice] = useState(850);

    const estimatedAmount = useMemo(() => {
        return (quantity * unitPrice).toLocaleString('fr-FR');
    }, [quantity, unitPrice]);

    return (
        <section className="bg-white p-6 rounded-2xl shadow-sm mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">Créer une nouvelle commande</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                <InputField label="Numéro de commande" id="order-number" placeholder="Ex: CMD-2024-001" />
                <SelectField label="Client associé" id="client">
                    <option>Client A</option>
                    <option>Client B</option>
                    <option>Client C</option>
                </SelectField>
                <SelectField label="Type de produit" id="product-type">
                    <option>Essence</option>
                    <option>Gasoil</option>
                </SelectField>
                <InputField 
                    label="Quantité commandée (L)" 
                    id="quantity" 
                    type="number" 
                    placeholder="Ex: 5000" 
                    value={quantity} 
                    onChange={(e) => setQuantity(Number(e.target.value))} 
                />
                <InputField 
                    label="Prix unitaire (FCFA/L)" 
                    id="unit-price" 
                    type="number" 
                    placeholder="Ex: 850"
                    value={unitPrice}
                    onChange={(e) => setUnitPrice(Number(e.target.value))} 
                />
                <InputField label="Montant estimé (FCFA)" id="estimated-amount" value={estimatedAmount} disabled className="bg-gray-100" />
            </div>
             <div className="mb-6">
                <SelectField label="Statut de la commande" id="status">
                    <option>Non Livré</option>
                    <option>Livré</option>
                    <option>Annulée</option>
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
                    Enregistrer la commande
                </button>
            </div>
        </section>
    );
};

export default CreateOrderForm;