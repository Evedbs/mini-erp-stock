import { useEffect, useState } from "react";
import api from "../services/api";
import type { Dish } from "../types/restaurant";

interface Props {
  onSale: () => void;
}

const DishList = ({ onSale }: Props) => {
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setError(null);
    setLoading(true);

    api
      .get("/dishes/")
      .then((res) => {
        setDishes(res.data);
      })
      .catch((err) => {
        console.error("Erreur API:", err);
        if (err.response) {
          setError(
            `Erreur serveur: ${err.response.status} - ${err.response.statusText}`
          );
        } else if (err.request) {
          setError(
            "Impossible de contacter le serveur. Vérifie que Docker tourne."
          );
        } else {
          setError("Erreur inconnue.");
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const handleSell = async (id: number, name: string) => {
    try {
      await api.post(`/dishes/${id}/register_sale/`, { quantity: 1 });

      onSale();

      alert(`✅ Vente de "${name}" enregistrée ! Le stock a été déduit.`);
    } catch (error) {
      console.error(error);
      alert("❌ Erreur lors de la vente. Vérifie la console.");
    }
  };

  if (loading)
    return (
      <div className="p-10 text-center text-gray-500">
        Chargement du menu...
      </div>
    );

  if (error)
    return (
      <div className="p-10 text-center">
        <div className="text-red-500 font-bold mb-2">
          Oups ! Une erreur est survenue :
        </div>
        <div className="bg-red-100 text-red-700 p-4 rounded border border-red-300 inline-block">
          {error}
        </div>
      </div>
    );

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
        <h3 className="text-lg font-bold text-gray-800">
          🍽️ Carte & Rentabilité
        </h3>
        <span className="text-sm text-gray-500">{dishes.length} Plats</span>
      </div>

      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Plat
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Prix Vente
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Coût Matière
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Marge Brute
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Ratio
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Action
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {dishes.map((dish) => {
            const ratio = (dish.food_cost / parseFloat(dish.sale_price)) * 100;
            const isBadRatio = ratio > 30;

            return (
              <tr key={dish.id} className="hover:bg-gray-50 transition">
                <td className="px-6 py-4 font-medium text-gray-900">
                  {dish.name}
                </td>
                <td className="px-6 py-4 text-gray-600">{dish.sale_price} €</td>
                <td className="px-6 py-4 text-orange-600 font-medium">
                  -{dish.food_cost} €
                </td>
                <td className="px-6 py-4 text-green-600 font-bold text-lg">
                  {dish.margin} €
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`px-2 py-1 text-xs rounded-full font-bold ${
                      isBadRatio
                        ? "bg-red-100 text-red-800"
                        : "bg-green-100 text-green-800"
                    }`}
                  >
                    {isNaN(ratio) ? "0%" : ratio.toFixed(1) + "%"}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button
                    onClick={() => handleSell(dish.id, dish.name)}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded text-xs shadow-md active:transform active:scale-95 transition-all"
                  >
                    Vendre 1
                  </button>
                </td>
              </tr>
            );
          })}
          {dishes.length === 0 && (
            <tr>
              <td colSpan={6} className="p-8 text-center text-gray-400">
                Aucun plat trouvé dans le menu.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default DishList;
