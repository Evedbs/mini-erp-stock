import { useState } from "react";
import api from "../services/api";

// On définit les props pour rafraîchir la liste après ajout
interface Props {
  onProductAdded: () => void;
}

const ProductForm = ({ onProductAdded }: Props) => {
  const [formData, setFormData] = useState({
    sku: "",
    name: "",
    price: "",
    stock_quantity: 0,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    api
      .post("/products/", formData)
      .then(() => {
        alert("Produit ajouté !");
        setFormData({ sku: "", name: "", price: "", stock_quantity: 0 });
        onProductAdded();
      })
      .catch((error) => {
        console.error(error);
        alert("Erreur lors de l'ajout (Vérifie que le SKU est unique)");
      });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mb-8 bg-white p-6 shadow-md rounded-lg"
    >
      <h2 className="text-xl font-bold mb-4 text-gray-700">
        Ajouter un produit
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* SKU */}
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2">
            SKU (Réf)
          </label>
          <input
            name="sku"
            value={formData.sku}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            type="text"
            placeholder="EX: PROD-123"
            required
          />
        </div>

        {/* NOM */}
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Nom
          </label>
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            type="text"
            placeholder="Chaise de bureau"
            required
          />
        </div>

        {/* PRIX */}
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Prix
          </label>
          <input
            name="price"
            value={formData.price}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            type="number"
            step="0.01"
            required
          />
        </div>

        {/* STOCK */}
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Stock initial
          </label>
          <input
            name="stock_quantity"
            value={formData.stock_quantity}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            type="number"
            required
          />
        </div>
      </div>

      <button
        type="submit"
        className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
      >
        Sauvegarder
      </button>
    </form>
  );
};

export default ProductForm;
