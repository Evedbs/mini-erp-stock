import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000/api",
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
  },
});

// 1. Intercepteur de REQUÊTE (On ajoute le token)
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 2. Intercepteur de RÉPONSE (Nouveau !)
// Si Django répond 401 (Non autorisé), on déconnecte l'utilisateur
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Le token est invalide ou expiré
      console.warn("Session expirée, déconnexion...");
      localStorage.removeItem("access_token");

      // On recharge la page pour revenir au Login
      // (Ou on pourrait utiliser une méthode de callback si on voulait être plus propre en React pur,
      // mais window.location.reload est radical et efficace ici)
      window.location.href = "/";
    }
    return Promise.reject(error);
  }
);

export default api;
