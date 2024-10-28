import { Loader } from '@googlemaps/js-api-loader';

export interface Coordinates {
  latitude: number;
  longitude: number;
}

class MapsService {
  private geocoder: google.maps.Geocoder | null = null;
  private loader: Loader;

  constructor() {
    this.loader = new Loader({
      apiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY || '',
      version: 'weekly',
      libraries: ['places']
    });
  }

  private async initializeGeocoder() {
    if (!this.geocoder) {
      await this.loader.load();
      this.geocoder = new google.maps.Geocoder();
    }
    return this.geocoder;
  }

  public async getCoordinates(address: string): Promise<Coordinates> {
    try {
      const geocoder = await this.initializeGeocoder();
      const response = await this.geocodeAddress(geocoder, address);
      
      const firstResult = response[0];
      if (!firstResult?.geometry?.location) {
        throw new Error('Não foi possível obter as coordenadas do endereço');
      }
      
      const location = firstResult.geometry.location;
      return {
        latitude: location.lat(),
        longitude: location.lng()
      };
    } catch (error) {
      console.error('Erro ao obter coordenadas:', error);
      // Retornar coordenadas padrão para desenvolvimento
      if (process.env.NODE_ENV === 'development') {
        return {
          latitude: -23.550520,  // São Paulo coordinates
          longitude: -46.633308
        };
      }
      throw new Error('Erro ao obter coordenadas do endereço');
    }
  }

  private geocodeAddress(
    geocoder: google.maps.Geocoder, 
    address: string
  ): Promise<google.maps.GeocoderResult[]> {
    return new Promise((resolve, reject) => {
      geocoder.geocode(
        { address },
        (
          results: google.maps.GeocoderResult[] | null,
          status: google.maps.GeocoderStatus
        ) => {
          if (status === google.maps.GeocoderStatus.OK && results) {
            resolve(results);
          } else {
            reject(new Error(`Geocode falhou: ${status}`));
          }
        }
      );
    });
  }

  public static formatAddress(address: {
    street: string;
    number: string;
    city: string;
    state: string;
  }): string {
    return `${address.street}, ${address.number} - ${address.city}, ${address.state}`;
  }
}

export const mapsService = new MapsService();