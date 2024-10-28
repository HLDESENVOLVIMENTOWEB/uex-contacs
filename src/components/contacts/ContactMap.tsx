import React, { useEffect, useRef, useState } from 'react';
import { Box, CircularProgress, Alert } from '@mui/material';
import { Address, Contact } from '../../types/contact.types';
import { GOOGLE_MAPS_API_KEY } from 'utils/constants';

interface ContactMapProps {
  contacts: Contact[];
}

export const ContactMap: React.FC<ContactMapProps> = ({ contacts }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapsLoaded, setMapsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);

  useEffect(() => {
    const loadGoogleMaps = () => {
      if (!document.querySelector('script[src*="maps.googleapis.com"]')) {
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places`;
        script.async = true;
        script.onload = () => setMapsLoaded(true);
        script.onerror = () => setError('Erro ao carregar o Google Maps');
        document.head.appendChild(script);
      } else {
        setMapsLoaded(true);
      }
    };

    loadGoogleMaps();
  }, []);

  useEffect(() => {
    if (!mapsLoaded || !mapRef.current) return;

    const initializeMap = () => {
      if (!mapRef.current) return;

      const defaultCenter = { lat: -14.235004, lng: -51.92528 }; // Centro do Brasil
      
      mapInstanceRef.current = new google.maps.Map(mapRef.current, {
        zoom: 4,
        center: defaultCenter,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false
      });
    };

    initializeMap();
  }, [mapsLoaded]);

  useEffect(() => {
    if (!mapsLoaded || !mapInstanceRef.current) return;

    // Limpar marcadores existentes
    markersRef.current.forEach(marker => marker.setMap(null));
    markersRef.current = [];

    // Criar novos marcadores
    const bounds = new google.maps.LatLngBounds();
    let hasValidLocations = false;

    contacts.forEach(contact => {
      if (contact.location) {
        try {
          const { latitude: lat, longitude: lng } = contact.location;
          const position = { lat, lng };
          const marker = new google.maps.Marker({
            position,
            map: mapInstanceRef.current!,
            title: contact.name
          });

          const infoWindow = new google.maps.InfoWindow({
            content: `
              <div style="padding: 8px">
                <h3 style="margin: 0 0 8px 0">${contact.name}</h3>
                <p style="margin: 0">${formatAddress(contact.address)}</p>
              </div>
            `
          });

          marker.addListener('click', () => {
            infoWindow.open(mapInstanceRef.current!, marker);
          });

          markersRef.current.push(marker);
          bounds.extend(position);
          hasValidLocations = true;
        } catch (error) {
          console.error('Erro ao processar localização:', error);
        }
      }
    });

    // Ajustar o mapa para mostrar todos os marcadores
    if (hasValidLocations) {
      mapInstanceRef.current!.fitBounds(bounds);
      // Se houver apenas um marcador, zoom mais próximo
      if (markersRef.current.length === 1) {
        mapInstanceRef.current!.setZoom(15);
      }
    }
  }, [contacts, mapsLoaded]);

  const formatAddress = (address: Address): string => {
    return `${address.street}, ${address.number}${address.complement ? ` - ${address.complement}` : ''}, ${address.neighborhood}, ${address.city} - ${address.state}, ${address.cep}`;
  };

  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 2 }}>
        {error}
      </Alert>
    );
  }

  if (!mapsLoaded) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box
      ref={mapRef}
      sx={{
        width: '100%',
        height: '600px',
        borderRadius: 1,
        overflow: 'hidden'
      }}
    />
  );
};