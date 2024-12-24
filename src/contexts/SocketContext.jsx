import { createContext, useContext } from 'react';
import { useAuth } from './AuthContext';
import { useSocket } from '../hooks/useSocket';

const SocketContext = createContext(null);

export const useSocketContext = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
  const { user } = useAuth();
  const socketState = useSocket(user);

  return (
    <SocketContext.Provider value={socketState}>
      {children}
    </SocketContext.Provider>
  );
};