import axios from 'axios';

const createInstance = (baseURL) => {
  const instance = axios.create({
    headers: { 'Content-Type': 'application/json' },
    baseURL,
  });

  // Adjuntar token de auth si existe
  instance.interceptors.request.use((config) => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        if (user?.token) {
          config.headers.Authorization = `Bearer ${user.token}`;
        }
      } catch (e) {
        // ignorar parse errors
      }
    }
    return config;
  });

  // Devolver res.data en éxito, throw en error
  instance.interceptors.response.use(
    (res) => res.data,
    (error) => {
      // Si 401, limpiar sesión (pero no si es error de conexión)
      if (error?.response?.status === 401 && error?.response) {
        localStorage.removeItem('user');
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
      }
      // En dev mode (sin backend), ignorar errores de conexión
      if (!error?.response && error?.message === 'Network Error') {
        console.warn('Network error (backend unavailable):', error);
        return { success: false, data: [] };
      }
      throw error;
    }
  );

  return instance;
};

export default createInstance;
