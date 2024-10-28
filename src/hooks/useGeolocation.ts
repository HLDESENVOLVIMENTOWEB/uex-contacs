import { useState, useCallback } from 'react';
import { mapsService } from '../services/maps.service';

interface Coordinates {
  latitude: number;
  longitude: number;
}

interface UseGeolocationReturn {
  getCoordinates: (address: string) => Promise<Coordinates>;
  loading: boolean;
  error: string | null;
}

export const useGeolocation = (): UseGeolocationReturn => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getCoordinates = useCallback(async (address: string): Promise<Coordinates> => {
    try {
      setLoading(true);
      setError(null);
      
      const coordinates = await mapsService.getCoordinates(address);
      return coordinates;
    } catch (err) {
      const errorMessage = 'Não foi possível obter as coordenadas do endereço';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    getCoordinates,
    loading,
    error
  };
};

// Função auxiliar para formatar endereço
export const formatAddressForGeocoding = (address: {
  street: string;
  number: string;
  city: string;
  state: string;
}): string => {
  return `${address.street}, ${address.number} - ${address.city}, ${address.state}`;
};