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
          rolOriginal: data.usuario.rol
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
        // Guardamos el rol original al iniciar sesión
        setUser({
          ...data.usuario,
          rolOriginal: data.usuario.rol
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
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3000/api/auth/switch-role', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.token);
        // Mantenemos el rol original al cambiar de rol
        setUser({
          ...data.usuario,
          rolOriginal: user.rolOriginal
        });
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error al cambiar rol:', error);
      return false;
    }
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