import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Paper,
  TextField,
  Box,
  Tab,
  Tabs,
  Fab,
  CircularProgress,
  Alert
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { ContactList } from '../components/contacts/ContactList';
import { ContactMap } from '../components/contacts/ContactMap';
import { ContactForm } from '../components/contacts/ContactForm';
import { useContacts } from '../hooks/useContacts';
import { Contact } from 'types/contact.types';

const Contacts: React.FC = () => {
  const {
    contacts,
    loading,
    error,
    addContact,
    deleteContact,
    searchContacts
  } = useContacts();

  const [filteredContacts, setFilteredContacts] = useState(contacts);
  const [searchTerm, setSearchTerm] = useState('');
  const [tabValue, setTabValue] = useState(0);
  const [isFormOpen, setIsFormOpen] = useState(false);

  useEffect(() => {
    if (searchTerm) {
      setFilteredContacts(searchContacts(searchTerm));
    } else {
      setFilteredContacts(contacts);
    }
  }, [searchTerm, contacts, searchContacts]);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleAddContact = async (newContact: Omit<Contact, 'id' | 'userId' | 'createdAt'>) => {
    try {
      await addContact(newContact);
      setIsFormOpen(false);
    } catch (error) {
      // O erro já está sendo tratado no useContacts
      console.error('Erro ao adicionar contato:', error);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
              <Tabs 
                value={tabValue} 
                onChange={(_, newValue) => setTabValue(newValue)}
              >
                <Tab label="Lista" />
                <Tab label="Mapa" />
              </Tabs>
            </Box>

            <Box sx={{ mb: 3 }}>
              <TextField
                fullWidth
                label="Buscar por nome ou CPF"
                value={searchTerm}
                onChange={handleSearch}
                variant="outlined"
              />
            </Box>

            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            {tabValue === 0 ? (
              <ContactList
                contacts={filteredContacts}
                onDelete={deleteContact}
              />
            ) : (
              <ContactMap contacts={filteredContacts} />
            )}
          </Paper>
        </Grid>
      </Grid>

      <Fab
        color="primary"
        sx={{ position: 'fixed', bottom: 16, right: 16 }}
        onClick={() => setIsFormOpen(true)}
      >
        <AddIcon />
      </Fab>

      <ContactForm
        open={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSave={handleAddContact}
      />
    </Container>
  );
};

export default Contacts;