import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  CircularProgress,
  Alert,
  Box,
  Typography,
} from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';
import { Contact, ContactFormData, Location } from '../../types/contact.types';
import { viaCepService } from '../../services/viacep.service';
import { mapsService } from '../../services/maps.service';
import { validateCPF } from '../../utils/cpf.validator';

const formatCEP = (cep: string): string => {
  const cleaned = cep.replace(/\D/g, '');
  return cleaned.replace(/(\d{5})(\d{3})/, '$1-$2');
};

const validateCEP = (cep: string): boolean => {
  const cleaned = cep.replace(/\D/g, '');
  return cleaned.length === 8;
};

interface ContactFormProps {
  open: boolean;
  onClose: () => void;
  onSave: (contact: Contact) => void;
  initialData?: Contact;
}

const INITIAL_FORM_STATE: ContactFormData = {
  name: '',
  cpf: '',
  phone: '',
  cep: '',
  street: '',
  number: '',
  complement: '',
  neighborhood: '',
  city: '',
  state: '',
};

export const ContactForm: React.FC<ContactFormProps> = ({
  open,
  onClose,
  onSave,
  initialData
}) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [addressLoading, setAddressLoading] = useState(false);
  const [formData, setFormData] = useState<ContactFormData>(INITIAL_FORM_STATE);


  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        cpf: initialData.cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4'),
        phone: initialData.phone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3'),
        cep: initialData.address.cep.replace(/(\d{5})(\d{3})/, '$1-$2'),
        street: initialData.address.street,
        number: initialData.address.number,
        complement: initialData.address.complement || '',
        neighborhood: initialData.address.neighborhood,
        city: initialData.address.city,
        state: initialData.address.state,
      });
    } else {
      setFormData(INITIAL_FORM_STATE);
    }
    setError('');
  }, [initialData, open]);


const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    let formattedValue = value;
    
    switch (name) {
      case 'cpf':
        formattedValue = value
          .replace(/\D/g, '')
          .replace(/(\d{3})(\d)/, '$1.$2')
          .replace(/(\d{3})(\d)/, '$1.$2')
          .replace(/(\d{3})(\d{1,2})/, '$1-$2')
          .replace(/(-\d{2})\d+?$/, '$1');
        break;
      case 'phone':
        formattedValue = value
          .replace(/\D/g, '')
          .replace(/(\d{2})(\d)/, '($1) $2')
          .replace(/(\d{5})(\d)/, '$1-$2')
          .replace(/(-\d{4})\d+?$/, '$1');
        break;
      case 'cep':
        formattedValue = formatCEP(value);
        break;
    }

    setFormData(prev => ({
      ...prev,
      [name]: formattedValue
    }));

    if (name === 'cep' && formattedValue.replace(/\D/g, '').length === 8) {
      void searchAddress(formattedValue);
    }
  };

  const searchAddress = async (cep: string) => {
    try {
      setAddressLoading(true);
      setError('');
      const address = await viaCepService.getAddressByCEP(cep.replace(/\D/g, ''));
      
      setFormData(prev => ({
        ...prev,
        street: address.street,
        neighborhood: address.neighborhood,
        city: address.city,
        state: address.state,
      }));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao buscar endereço. Verifique o CEP informado.');
    } finally {
      setAddressLoading(false);
    }
  };

  const validateForm = (): boolean => {
    if (!formData.name.trim()) {
      setError('Nome é obrigatório');
      return false;
    }

    if (!validateCPF(formData.cpf.replace(/\D/g, ''))) {
      setError('CPF inválido');
      return false;
    }

    if (formData.phone.replace(/\D/g, '').length < 11) {
      setError('Telefone inválido');
      return false;
    }

    if (!validateCEP(formData.cep)) {
      setError('CEP inválido');
      return false;
    }

    if (!formData.street || !formData.number || !formData.neighborhood || !formData.city || !formData.state) {
      setError('Todos os campos do endereço são obrigatórios, exceto complemento');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validateForm() || !user) {
      return;
    }

    try {
      setLoading(true);

      let coordinates: Location;
      try {
        const address = `${formData.street}, ${formData.number} - ${formData.city}, ${formData.state}`;
        const coords = await mapsService.getCoordinates(address);
        coordinates = {
          latitude: coords.latitude,
          longitude: coords.longitude
        };
      } catch (err) {
        console.warn('Erro ao obter coordenadas, usando localização padrão:', err);
        coordinates = {
          latitude: -23.550520,
          longitude: -46.633308
        };
      }

      const contactData: Contact = {
        id: initialData?.id || crypto.randomUUID(),
        userId: user.id,
        name: formData.name,
        email: `${formData.cpf.replace(/\D/g, '')}@contact.com`,
        cpf: formData.cpf.replace(/\D/g, ''),
        phone: formData.phone.replace(/\D/g, ''),
        address: {
          cep: formData.cep.replace(/\D/g, ''),
          street: formData.street,
          number: formData.number,
          complement: formData.complement,
          neighborhood: formData.neighborhood,
          city: formData.city,
          state: formData.state,
        },
        location: coordinates,
        createdAt: initialData?.createdAt || new Date(),
      };

      onSave(contactData);
      onClose();
    } catch (err) {
      setError('Erro ao salvar contato. Verifique os dados e tente novamente.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>
        {initialData ? 'Editar Contato' : 'Novo Contato'}
      </DialogTitle>

      <DialogContent>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                Dados Pessoais
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Nome completo"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="CPF"
                name="cpf"
                value={formData.cpf}
                onChange={handleChange}
                required
                inputProps={{ maxLength: 14 }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Telefone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                inputProps={{ maxLength: 15 }}
              />
            </Grid>

            <Grid item xs={12} sx={{ mt: 2 }}>
              <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                Endereço
              </Typography>
            </Grid>

            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="CEP"
                name="cep"
                value={formData.cep}
                onChange={handleChange}
                required
                inputProps={{ maxLength: 9 }}
                InputProps={{
                  endAdornment: addressLoading && (
                    <CircularProgress size={20} />
                  ),
                }}
              />
            </Grid>

            <Grid item xs={12} sm={8}>
              <TextField
                fullWidth
                label="Rua"
                name="street"
                value={formData.street}
                onChange={handleChange}
                required
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Número"
                name="number"
                value={formData.number}
                onChange={handleChange}
                required
              />
            </Grid>

            <Grid item xs={12} sm={8}>
              <TextField
                fullWidth
                label="Complemento"
                name="complement"
                value={formData.complement}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Bairro"
                name="neighborhood"
                value={formData.neighborhood}
                onChange={handleChange}
                required
              />
            </Grid>

            <Grid item xs={12} sm={5}>
              <TextField
                fullWidth
                label="Cidade"
                name="city"
                value={formData.city}
                onChange={handleChange}
                required
              />
            </Grid>

            <Grid item xs={12} sm={3}>
              <TextField
                fullWidth
                label="Estado"
                name="state"
                value={formData.state}
                onChange={handleChange}
                required
              />
            </Grid>
          </Grid>
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>
          Cancelar
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={loading}
        >
          {loading ? (
            <>
              <CircularProgress size={20} sx={{ mr: 1 }} />
              Salvando...
            </>
          ) : (
            'Salvar'
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
};