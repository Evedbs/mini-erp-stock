import { useEffect, useState } from "react";
import api from "../services/api";
import type { StockMovement } from "../types/restaurant";

interface Props {
  refreshTrigger: number;
}

const MovementHistory = ({ refreshTrigger }: Props) => {
  const [movements, setMovements] = useState<StockMovement[]>([]);
  const [loading, setLoading] = useState(true);

  const handleExport = async () => {
    try {
      const response = await api.get("/movements/export_csv/", {
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "historique_stock.csv");
      document.body.appendChild(link);
      link.click();

      // Nettoyage
      link.remove();
    } catch (error) {
      console.error("Erreur lors de l'export", error);
      alert("Impossible de télécharger le CSV");
    }
  };

  useEffect(() => {
    api
      .get("/movements/")
      .then((res) => {
        setMovements(res.data);
        setLoading(false);
      })
      .catch((err) => console.error(err));
  }, [refreshTrigger]);

  if (loading)
    return (
      <div className="text-gray-500 text-sm">Chargement de l'historique...</div>
    );

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden mt-8">
      <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
        <h3 className="text-lg font-bold text-gray-800">
          📜 Journal des Mouvements
        </h3>
        <button
          onClick={handleExport}
          className="bg-green-600 hover:bg-green-700 text-white text-sm font-bold py-2 px-4 rounded flex items-center gap-2 transition"
        >
          📥 Exporter CSV
        </button>
        <span className="text-xs text-gray-500 uppercase tracking-wide">
          Dernières activités
        </span>
      </div>

      <div className="overflow-x-auto max-h-96">
        {" "}
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50 sticky top-0">
            <tr>
              <th className="px-6 py-3 text-left font-medium text-gray-500 uppercase">
                Date
              </th>
              <th className="px-6 py-3 text-left font-medium text-gray-500 uppercase">
                Utilisateur
              </th>
              <th className="px-6 py-3 text-left font-medium text-gray-500 uppercase">
                Action
              </th>
              <th className="px-6 py-3 text-left font-medium text-gray-500 uppercase">
                Ingrédient
              </th>
              <th className="px-6 py-3 text-right font-medium text-gray-500 uppercase">
                Quantité
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {movements.map((move) => {
              const isPositive = move.quantity > 0;
              const dateObj = new Date(move.created_at);

              return (
                <tr key={move.id} className="hover:bg-gray-50">
                  <td className="px-6 py-3 text-gray-500 whitespace-nowrap">
                    {dateObj.toLocaleDateString()}{" "}
                    <span className="text-xs text-gray-400">
                      {dateObj.toLocaleTimeString()}
                    </span>
                  </td>
                  <td className="px-6 py-3 font-medium text-gray-700">
                    <span className="bg-gray-100 px-2 py-1 rounded text-xs border border-gray-200">
                      {move.user}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-gray-600">{move.reason}</td>
                  <td className="px-6 py-3 font-medium text-gray-800">
                    {move.ingredient_name}
                  </td>
                  <td
                    className={`px-6 py-3 text-right font-bold ${
                      isPositive ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {isPositive ? "+" : ""}
                    {move.quantity}
                  </td>
                </tr>
              );
            })}
            {movements.length === 0 && (
              <tr>
                <td colSpan={5} className="p-8 text-center text-gray-400">
                  Aucun historique disponible.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MovementHistory;
