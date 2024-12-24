import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      verificarToken(token);
    } else {
      setLoading(false);
    }
  }, []);

  const verificarToken = async (token) => {
    try {
      const response = await fetch('http://localhost:3000/api/auth/verificar', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        // Guardamos el rol original al iniciar sesión
        setUser({
          ...data.usuario,
          rolOriginal: data.usuario.rol,
          // El rol actual será igual al rol original inicialmente
          rolActual: data.usuario.rol
        });
      } else {
        localStorage.removeItem('token');
      }
    } catch (error) {
      console.error('Error al verificar token:', error);
      localStorage.removeItem('token');
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    try {
      const response = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.token);
        // Guardamos tanto el rol original como el rol actual
        setUser({
          ...data.usuario,
          rolOriginal: data.usuario.rol,
          rolActual: data.usuario.rol
        });
        navigate('/dashboard');
        return { success: true };
      } else {
        return { success: false, error: data.mensaje };
      }
    } catch (error) {
      return { success: false, error: 'Error al iniciar sesión' };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    navigate('/login');
  };

  const switchRole = async () => {
    // Solo cambiamos el rolActual, manteniendo el rolOriginal
    if (user.rolOriginal === 'admin') {
      setUser(prev => ({
        ...prev,
        rolActual: prev.rolActual === 'admin' ? 'usuario' : 'admin'
      }));
      return true;
    }
    return false;
  };

  const value = {
    user,
    login,
    logout,
    loading,
    switchRole
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};