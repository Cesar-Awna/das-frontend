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
        // Usar token si existe, o generar uno dummy para dev
        const token = user?.token || 'dev-token';
        config.headers.Authorization = `Bearer ${token}`;
      } catch (e) {
        console.warn('Error parsing user:', e);
      }
    }
    return config;
  });

  // Devolver res.data en éxito, throw en error
  instance.interceptors.response.use(
    (res) => res.data,
    (error) => {
      console.log('Axios error:', { status: error?.response?.status, message: error?.message, hasResponse: !!error?.response });

      // Si 401, limpiar sesión (pero no si es error de conexión)
      if (error?.response?.status === 401 && error?.response) {
        console.warn('401 Unauthorized, clearing session');
        localStorage.removeItem('user');
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
      }
      // En dev mode (sin backend), ignorar errores de conexión
      if (!error?.response) {
        console.warn('Network error (no response):', error?.message);
        return { success: false, data: [] };
      }
      throw error;
    }
  );

  return instance;
};

export default createInstance;
