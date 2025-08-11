'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface InventoryItem {
  id: string;
  name: string;
  totalStock: number;
  availableStock: number;
  reservations: Reservation[];
}

interface Reservation {
  id: string;
  itemId: string;
  startTime: Date;
  endTime: Date;
  duration: string;
  customerName?: string;
  customerEmail?: string;
}

interface InventoryContextType {
  inventory: InventoryItem[];
  getAvailableStock: (itemId: string) => number;
  makeReservation: (itemId: string, duration: string, customerInfo?: { name: string; email: string }) => string | null;
  cancelReservation: (reservationId: string) => void;
  getReservations: (itemId: string) => Reservation[];
  updateStock: () => void;
}

const InventoryContext = createContext<InventoryContextType | undefined>(undefined);

const initialInventory: InventoryItem[] = [
  {
    id: 'city-bike',
    name: 'Bicicleta Paseo Urbana',
    totalStock: 50,
    availableStock: 50,
    reservations: []
  },
  {
    id: 'mountain-bike',
    name: 'Mountain Bike',
    totalStock: 20,
    availableStock: 20,
    reservations: []
  },
  {
    id: 'fat-bike',
    name: 'Fat Bike Eléctrica',
    totalStock: 4,
    availableStock: 4,
    reservations: []
  },
  {
    id: 'electric-bike',
    name: 'Bicicleta Eléctrica de Paseo',
    totalStock: 14,
    availableStock: 14,
    reservations: []
  },
  {
    id: 'electric-scooter',
    name: 'Scooter Eléctrico',
    totalStock: 16,
    availableStock: 16,
    reservations: []
  },
  {
    id: 'electric-scooter-disabled',
    name: 'Scooter para Minusválidos',
    totalStock: 6,
    availableStock: 6,
    reservations: []
  }
];

export function InventoryProvider({ children }: { children: React.ReactNode }) {
  const [inventory, setInventory] = useState<InventoryItem[]>(initialInventory);

  // Función para convertir duración a minutos
  const durationToMinutes = (duration: string): number => {
    if (duration.includes('min')) {
      return parseInt(duration.replace(' min', ''));
    }
    if (duration.includes('h')) {
      return parseInt(duration.replace('h', '')) * 60;
    }
    if (duration.includes('día') || duration.includes('Day')) {
      return 24 * 60; // 24 horas
    }
    return 60; // Por defecto 1 hora
  };

  // Función para actualizar el stock basado en reservas activas
  const updateStock = () => {
    const now = new Date();
    
    setInventory(prevInventory => 
      prevInventory.map(item => {
        // Filtrar reservas que ya han terminado
        const activeReservations = item.reservations.filter(reservation => 
          reservation.endTime > now
        );
        
        // Calcular stock disponible
        const availableStock = item.totalStock - activeReservations.length;
        
        return {
          ...item,
          reservations: activeReservations,
          availableStock: Math.max(0, availableStock)
        };
      })
    );
  };

  // Actualizar stock cada minuto
  useEffect(() => {
    const interval = setInterval(updateStock, 60000); // Cada minuto
    updateStock(); // Actualizar inmediatamente
    
    return () => clearInterval(interval);
  }, []);

  const getAvailableStock = (itemId: string): number => {
    const item = inventory.find(item => item.id === itemId);
    return item ? item.availableStock : 0;
  };

  const makeReservation = (
    itemId: string, 
    duration: string, 
    customerInfo?: { name: string; email: string }
  ): string | null => {
    const item = inventory.find(item => item.id === itemId);
    if (!item || item.availableStock <= 0) {
      return null;
    }

    const now = new Date();
    const durationMinutes = durationToMinutes(duration);
    const endTime = new Date(now.getTime() + durationMinutes * 60000);
    
    const reservationId = `${itemId}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    const newReservation: Reservation = {
      id: reservationId,
      itemId,
      startTime: now,
      endTime,
      duration,
      customerName: customerInfo?.name,
      customerEmail: customerInfo?.email
    };

    setInventory(prevInventory => 
      prevInventory.map(inventoryItem => 
        inventoryItem.id === itemId
          ? {
              ...inventoryItem,
              reservations: [...inventoryItem.reservations, newReservation],
              availableStock: inventoryItem.availableStock - 1
            }
          : inventoryItem
      )
    );

    return reservationId;
  };

  const cancelReservation = (reservationId: string) => {
    setInventory(prevInventory => 
      prevInventory.map(item => {
        const reservationIndex = item.reservations.findIndex(r => r.id === reservationId);
        if (reservationIndex !== -1) {
          const newReservations = item.reservations.filter(r => r.id !== reservationId);
          return {
            ...item,
            reservations: newReservations,
            availableStock: item.availableStock + 1
          };
        }
        return item;
      })
    );
  };

  const getReservations = (itemId: string): Reservation[] => {
    const item = inventory.find(item => item.id === itemId);
    return item ? item.reservations : [];
  };

  return (
    <InventoryContext.Provider value={{
      inventory,
      getAvailableStock,
      makeReservation,
      cancelReservation,
      getReservations,
      updateStock
    }}>
      {children}
    </InventoryContext.Provider>
  );
}

export function useInventory() {
  const context = useContext(InventoryContext);
  if (context === undefined) {
    throw new Error('useInventory must be used within an InventoryProvider');
  }
  return context;
}

export type { InventoryItem, Reservation };