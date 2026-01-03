import { useState } from "react";
import DishList from "./components/DishList";
import IngredientList from "./components/IngredientList";
import StockReception from "./components/StockReception";
import MovementHistory from "./components/MovementHistory";
import Login from "./components/Login";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return !!localStorage.getItem("access_token");
  });

  const [refreshKey, setRefreshKey] = useState(0);

  const refreshAll = () => setRefreshKey((prev) => prev + 1);

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    setIsAuthenticated(false);
  };

  if (!isAuthenticated)
    return <Login onLoginSuccess={() => setIsAuthenticated(true)} />;

  return (
    <div className="min-h-screen bg-gray-100 p-8 pb-20">
      {" "}
      <div className="max-w-7xl mx-auto space-y-8">
        <header className="flex justify-between items-center bg-white p-6 rounded-lg shadow-sm sticky top-0 z-10 border-b border-gray-200">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              👨‍🍳 Chef's ERP{" "}
              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full font-normal">
                v1.0
              </span>
            </h1>
            <p className="text-gray-500 text-sm">
              Gestion Restaurant & Food Cost
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="text-red-500 border border-red-200 px-4 py-2 rounded-lg hover:bg-red-50 transition text-sm font-medium"
          >
            Déconnexion
          </button>
        </header>

        <main className="space-y-8">
          <DishList onSale={refreshAll} />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <StockReception onStockUpdate={refreshAll} />
            </div>

            <div className="lg:col-span-2">
              <IngredientList refreshTrigger={refreshKey} />
            </div>
          </div>

          <MovementHistory refreshTrigger={refreshKey} />
        </main>
      </div>
    </div>
  );
}

export default App;
