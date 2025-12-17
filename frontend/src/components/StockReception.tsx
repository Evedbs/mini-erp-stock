import { useEffect, useState } from "react";
import api from "../services/api";
import type { Ingredient } from "../types/restaurant";

interface Props {
  onStockUpdate: () => void;
}

const StockReception = ({ onStockUpdate }: Props) => {
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [selectedId, setSelectedId] = useState<string>("");
  const [quantity, setQuantity] = useState<string>("");
  const [newPrice, setNewPrice] = useState<string>("");

  useEffect(() => {
    // On charge la liste pour le menu déroulant
    api.get("/ingredients/").then((res) => setIngredients(res.data));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedId || !quantity) return;

    try {
      await api.post(`/ingredients/${selectedId}/receive_stock/`, {
        quantity: parseFloat(quantity),
        new_price: newPrice ? parseFloat(newPrice) : null,
      });

      alert("📦 Réception enregistrée !");

      // Reset du formulaire
      setQuantity("");
      setNewPrice("");
      onStockUpdate(); // On rafraîchit la liste des stocks
    } catch (error) {
      console.error(error);
      alert("Erreur lors de la réception.");
    }
  };

  return (
    <div className="bg-white shadow rounded-lg p-6 mb-8 border-l-4 border-blue-500">
      <h3 className="text-lg font-bold text-gray-800 mb-4">
        🚚 Réception de Marchandise (Achat)
      </h3>

      <form onSubmit={handleSubmit} className="flex flex-wrap gap-4 items-end">
        {/* Choix de l'ingrédient */}
        <div className="flex-1 min-w-[200px]">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Ingrédient reçu
          </label>
          <select
            className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
            value={selectedId}
            onChange={(e) => setSelectedId(e.target.value)}
            required
          >
            <option value="">-- Choisir --</option>
            {ingredients.map((ing) => (
              <option key={ing.id} value={ing.id}>
                {ing.name} (Actuel: {ing.cost_per_unit}€ / {ing.unit})
              </option>
            ))}
          </select>
        </div>

        {/* Quantité */}
        <div className="w-32">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Quantité (+)
          </label>
          <input
            type="number"
            step="0.01"
            className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="Ex: 5"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            required
          />
        </div>

        {/* Nouveau Prix (Optionnel) */}
        <div className="w-32">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nouv. Prix (€)
          </label>
          <input
            type="number"
            step="0.01"
            className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="Optionnel"
            value={newPrice}
            onChange={(e) => setNewPrice(e.target.value)}
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded transition h-10 mb-[1px]"
        >
          Valider Réception
        </button>
      </form>
    </div>
  );
};

export default StockReception;
