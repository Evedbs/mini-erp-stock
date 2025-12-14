import { useState } from "react";
import ProductList from "./components/ProductList";
import ProductForm from "./components/ProductForm";
import Login from "./components/Login";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    const token = localStorage.getItem("access_token");
    return !!token; // Retourne true si le token existe, sinon false
  });

  const [refreshKey, setRefreshKey] = useState(0);

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    // Se déconnecter = Jeter le token
    localStorage.removeItem("access_token");
    setIsAuthenticated(false);
  };

  const handleProductAdded = () => {
    setRefreshKey((prev) => prev + 1);
  };

  if (!isAuthenticated) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-10">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              📦 Mini ERP Stock
            </h1>
            <p className="text-gray-500 text-sm">Connecté en tant qu'Admin</p>
          </div>

          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded text-sm"
          >
            Déconnexion
          </button>
        </header>

        <main>
          <ProductForm onProductAdded={handleProductAdded} />
          <ProductList key={refreshKey} />
        </main>
      </div>
    </div>
  );
}

export default App;
