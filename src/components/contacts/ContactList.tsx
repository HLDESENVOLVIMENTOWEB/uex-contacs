import React, { useState } from 'react';
import {
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Typography,
  Menu,
  MenuItem,
  Chip,
  Box,
  Divider,
} from '@mui/material';
import {
  MoreVert as MoreVertIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Sort as SortIcon,
} from '@mui/icons-material';
import { Contact } from '../../types/contact.types';

interface ContactListProps {
  contacts: Contact[];
  onDelete: (id: string) => void;
  onEdit?: (contact: Contact) => void;
}

export const ContactList: React.FC<ContactListProps> = ({
  contacts,
  onDelete,
  onEdit,
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [sortAnchorEl, setSortAnchorEl] = useState<null | HTMLElement>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, contact: Contact) => {
    setAnchorEl(event.currentTarget);
    setSelectedContact(contact);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedContact(null);
  };

  const handleSortMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setSortAnchorEl(event.currentTarget);
  };

  const handleSortMenuClose = () => {
    setSortAnchorEl(null);
  };

  const handleSort = (order: 'asc' | 'desc') => {
    setSortOrder(order);
    handleSortMenuClose();
  };

  const formatCPF = (cpf: string) => {
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  };

  const formatPhone = (phone: string) => {
    return phone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2, alignItems: 'center' }}>
        <Typography variant="h6" component="h2">
          Contatos ({contacts.length})
        </Typography>
        <IconButton onClick={handleSortMenuOpen}>
          <SortIcon />
        </IconButton>
      </Box>

      <Menu
        anchorEl={sortAnchorEl}
        open={Boolean(sortAnchorEl)}
        onClose={handleSortMenuClose}
      >
        <MenuItem onClick={() => handleSort('asc')}>A-Z</MenuItem>
        <MenuItem onClick={() => handleSort('desc')}>Z-A</MenuItem>
      </Menu>

      <List>
        {contacts.length === 0 ? (
          <Typography color="textSecondary" align="center" sx={{ py: 4 }}>
            Nenhum contato encontrado
          </Typography>
        ) : (
          contacts
            .slice()
            .sort((a, b) => {
              const comparison = a.name.localeCompare(b.name);
              return sortOrder === 'asc' ? comparison : -comparison;
            })
            .map((contact, index) => (
              <React.Fragment key={contact.id}>
                <ListItem>
                  <ListItemText
                    primary={
                      <Typography variant="subtitle1" component="span">
                        {contact.name}
                      </Typography>
                    }
                    secondary={
                      <Box sx={{ mt: 1 }}>
                        <Chip
                          label={formatCPF(contact.cpf)}
                          size="small"
                          sx={{ mr: 1, mb: 1 }}
                        />
                        <Chip
                          label={formatPhone(contact.phone)}
                          size="small"
                          sx={{ mr: 1, mb: 1 }}
                        />
                        <Typography variant="body2" color="textSecondary">
                          {contact.address.street}, {contact.address.number}
                          {contact.address.complement && ` - ${contact.address.complement}`}
                          <br />
                          {contact.address.neighborhood}, {contact.address.city} - {contact.address.state}
                          <br />
                          CEP: {contact.address.cep}
                        </Typography>
                      </Box>
                    }
                  />
                  <ListItemSecondaryAction>
                    <IconButton
                      edge="end"
                      onClick={(e) => handleMenuOpen(e, contact)}
                    >
                      <MoreVertIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
                {index < contacts.length - 1 && <Divider />}
              </React.Fragment>
            ))
        )}
      </List>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        {onEdit && (
          <MenuItem
            onClick={() => {
              if (selectedContact && onEdit) {
                onEdit(selectedContact);
              }
              handleMenuClose();
            }}
          >
            <EditIcon sx={{ mr: 1 }} /> Editar
          </MenuItem>
        )}
        <MenuItem
          onClick={() => {
            if (selectedContact) {
              onDelete(selectedContact.id);
            }
            handleMenuClose();
          }}
        >
          <DeleteIcon sx={{ mr: 1 }} /> Excluir
        </MenuItem>
      </Menu>
    </Box>
  );
};