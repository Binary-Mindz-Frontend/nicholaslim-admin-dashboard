import React, { createContext, useContext, useEffect, useState } from 'react';
import socketService from '@/services/socketService';

interface SocketContextType {
  isRiderConnected: boolean;
  isAdminConnected: boolean;
  connectRider: (token: string) => void;
  connectAdmin: (token: string) => void;
  sendRiderLocation: (lat: number, lng: number, heading: number) => void;
  refreshOrders: () => void;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within SocketProvider');
  }
  return context;
};

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isRiderConnected, setIsRiderConnected] = useState(false);
  const [isAdminConnected, setIsAdminConnected] = useState(false);

  const connectRider = (token: string) => {
    const riderSocket = socketService.connectRider(token);
    
    riderSocket?.on('connect', () => {
      setIsRiderConnected(true);
    });

    riderSocket?.on('disconnect', () => {
      setIsRiderConnected(false);
    });

    riderSocket?.connect();
  };

  const connectAdmin = (token: string) => {
    const adminSocket = socketService.connectAdmin(token);
    
    adminSocket?.on('connect', () => {
      setIsAdminConnected(true);
    });

    adminSocket?.on('disconnect', () => {
      setIsAdminConnected(false);
    });

    adminSocket?.connect();
  };

  const sendRiderLocation = (lat: number, lng: number, heading: number) => {
    socketService.sendRiderLocation(lat, lng, heading);
  };

  const refreshOrders = () => {
    socketService.refreshOrders();
  };

  useEffect(() => {
    return () => {
      socketService.cleanup();
    };
  }, []);

  return (
    <SocketContext.Provider value={{
      isRiderConnected,
      isAdminConnected,
      connectRider,
      connectAdmin,
      sendRiderLocation,
      refreshOrders
    }}>
      {children}
    </SocketContext.Provider>
  );
};