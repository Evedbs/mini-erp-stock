import { useEffect, useState } from "react";
import api from "../services/api";
import type { Product } from "../types/product";

const ProductList = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadProducts = () => {
    api
      .get("/products/")
      .then((response) => {
        setProducts(response.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Erreur API:", err);
        setError("Impossible de charger les stocks.");
        setLoading(false);
      });
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleDelete = (id: number) => {
    if (!window.confirm("Es-tu sûre de vouloir supprimer ce produit ?")) return;
    api
      .delete(`/products/${id}/`)
      .then(() => setProducts(products.filter((p) => p.id !== id)))
      .catch(() => alert("Impossible de supprimer."));
  };

  const updateStock = async (product: Product, amount: number) => {
    let reason = amount > 0 ? "Entrée rapide" : "Sortie rapide";

    try {
      await api.post("/movements/", {
        product: product.id,
        quantity: amount,
        reason: reason,
      });

      loadProducts();
    } catch (error) {
      console.error(error);
      alert("Erreur lors du mouvement de stock");
    }
  };

  // --- CALCULS DASHBOARD ---
  const totalItems = products.length;
  const totalStockValue = products.reduce((acc, product) => {
    return acc + parseFloat(product.price) * product.stock_quantity;
  }, 0);

  if (loading)
    return (
      <div className="p-10 text-center text-gray-500">
        Chargement de l'entrepôt...
      </div>
    );
  if (error)
    return (
      <div className="p-10 text-center text-red-500 font-bold">{error}</div>
    );

  return (
    <div className="space-y-8">
      {/* DASHBOARD */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm font-medium uppercase tracking-wider">
              Références
            </p>
            <p className="text-3xl font-extrabold text-gray-800 mt-1">
              {totalItems}
            </p>
          </div>
          <div className="bg-blue-50 p-3 rounded-full text-blue-600 text-2xl">
            📦
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm font-medium uppercase tracking-wider">
              Valorisation Stock
            </p>
            <p className="text-3xl font-extrabold text-gray-800 mt-1">
              {totalStockValue.toLocaleString("fr-FR", {
                style: "currency",
                currency: "EUR",
              })}
            </p>
          </div>
          <div className="bg-green-50 p-3 rounded-full text-green-600 text-2xl">
            💰
          </div>
        </div>
      </div>

      {/* TABLEAU */}
      <div className="bg-white shadow-sm rounded-xl overflow-hidden border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                SKU
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                Produit
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                Prix
              </th>
              <th className="px-6 py-4 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">
                Gestion Stock
              </th>
              <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {products.map((product) => (
              <tr
                key={product.id}
                className="hover:bg-gray-50 transition duration-150"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="font-mono text-xs font-semibold bg-gray-100 text-gray-600 px-2 py-1 rounded">
                    {product.sku}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-gray-900">
                    {product.name}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {product.price} €
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center justify-center space-x-4">
                    <button
                      onClick={() => updateStock(product, -1)}
                      className="w-8 h-8 flex items-center justify-center rounded-full bg-red-100 text-red-600 hover:bg-red-200 font-bold transition"
                    >
                      -
                    </button>

                    <span
                      className={`w-12 text-center font-bold ${
                        product.stock_quantity <= 5
                          ? "text-red-600"
                          : "text-gray-800"
                      }`}
                    >
                      {product.stock_quantity}
                    </span>

                    <button
                      onClick={() => updateStock(product, 1)}
                      className="w-8 h-8 flex items-center justify-center rounded-full bg-green-100 text-green-600 hover:bg-green-200 font-bold transition"
                    >
                      +
                    </button>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="text-red-400 hover:text-red-700 transition"
                  >
                    Supprimer
                  </button>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center py-10 text-gray-400">
                  Aucun produit trouvé
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductList;
