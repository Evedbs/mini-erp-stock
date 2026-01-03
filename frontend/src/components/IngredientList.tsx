import { useEffect, useState } from "react";
import api from "../services/api";
import type { Ingredient } from "../types/restaurant";

interface Props {
  refreshTrigger: number;
}

const IngredientList = ({ refreshTrigger }: Props) => {
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);

  useEffect(() => {
    api.get("/ingredients/").then((res) => setIngredients(res.data));
  }, [refreshTrigger]);

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden mt-8">
      <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
        <h3 className="text-lg font-bold text-gray-800">
          📦 État du Stock (Cuisine)
        </h3>
      </div>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Ingrédient
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              En Stock
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Unité
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {ingredients.map((ing) => (
            <tr key={ing.id}>
              <td className="px-6 py-4 font-medium text-gray-900">
                {ing.name}
              </td>
              <td className="px-6 py-4">
                <span
                  className={`font-bold ${
                    ing.stock_quantity < 0 ? "text-red-600" : "text-gray-800"
                  }`}
                >
                  {ing.stock_quantity.toFixed(3)}
                </span>
              </td>
              <td className="px-6 py-4 text-gray-500">{ing.unit}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default IngredientList;
