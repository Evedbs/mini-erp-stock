import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000/api",
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
  },
});

// --- L'INTERCEPTEUR ---
// Avant d'envoyer une requête...
api.interceptors.request.use(
  (config) => {
    // 1. Check dans le stockage du navigateur
    const token = localStorage.getItem("access_token");

    // 2. Si un token existe, on l'ajoute dans les headers
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
