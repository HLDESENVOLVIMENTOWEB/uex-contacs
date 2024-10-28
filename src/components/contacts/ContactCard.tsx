import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  IconButton,
  Collapse,
  Box,
  Chip,
  Tooltip,
  Menu,
  MenuItem,
  Grid,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Phone as PhoneIcon,
  Map as MapIcon,
  MoreVert as MoreVertIcon,
  ExpandMore as ExpandMoreIcon,
  ContentCopy as CopyIcon,
  WhatsApp as WhatsAppIcon,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { Contact } from '../../types/contact.types';
import AddressFormatter from '../../utils/address.formatter';

interface ContactCardProps {
  contact: Contact;
  onEdit?: (contact: Contact) => void;
  onDelete?: (contactId: string) => void;
  onShowOnMap?: (contact: Contact) => void;
}

const ExpandButton = styled(IconButton)<{ expanded: boolean }>(({ theme, expanded }) => ({
  transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
}));

export const ContactCard: React.FC<ContactCardProps> = ({
  contact,
  onEdit,
  onDelete,
  onShowOnMap,
}) => {
  const [expanded, setExpanded] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const formatCPF = (cpf: string): string => {
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  };

  const formatPhone = (phone: string): string => {
    return phone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  };

  const handleCopyContact = () => {
    const contactInfo = `
Nome: ${contact.name}
CPF: ${formatCPF(contact.cpf)}
Telefone: ${formatPhone(contact.phone)}
Endereço: ${AddressFormatter.formatFullAddress(contact.address)}
    `.trim();

    navigator.clipboard.writeText(contactInfo);
    handleMenuClose();
  };

  const handleWhatsAppClick = () => {
    const phone = contact.phone.replace(/\D/g, '');
    window.open(`https://wa.me/55${phone}`, '_blank');
    handleMenuClose();
  };

  return (
    <Card sx={{ width: '100%', mb: 2 }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box>
            <Typography variant="h6" component="div">
              {contact.name}
            </Typography>
            <Grid container spacing={1} sx={{ mt: 1 }}>
              <Grid item>
                <Chip
                  label={formatCPF(contact.cpf)}
                  size="small"
                  color="primary"
                  variant="outlined"
                />
              </Grid>
              <Grid item>
                <Chip
                  icon={<PhoneIcon />}
                  label={formatPhone(contact.phone)}
                  size="small"
                  color="secondary"
                  variant="outlined"
                  onClick={handleWhatsAppClick}
                />
              </Grid>
            </Grid>
          </Box>
          <Box>
            <IconButton onClick={handleMenuClick}>
              <MoreVertIcon />
            </IconButton>
          </Box>
        </Box>
      </CardContent>

      <CardActions disableSpacing>
        {onShowOnMap && (
          <Tooltip title="Ver no mapa">
            <IconButton onClick={() => onShowOnMap(contact)}>
              <MapIcon />
            </IconButton>
          </Tooltip>
        )}
        <Box sx={{ ml: 'auto' }}>
          <ExpandButton
            expanded={expanded}
            onClick={handleExpandClick}
            aria-expanded={expanded}
            aria-label="mostrar mais"
          >
            <ExpandMoreIcon />
          </ExpandButton>
        </Box>
      </CardActions>

      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            Endereço:
          </Typography>
          {AddressFormatter.formatMultilineAddress(contact.address).map((line, index) => (
            <Typography key={index} variant="body2" color="text.secondary">
              {line}
            </Typography>
          ))}
          
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Latitude: {contact.location.latitude}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Longitude: {contact.location.longitude}
            </Typography>
          </Box>
        </CardContent>
      </Collapse>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        {onEdit && (
          <MenuItem onClick={() => {
            onEdit(contact);
            handleMenuClose();
          }}>
            <EditIcon fontSize="small" sx={{ mr: 1 }} />
            Editar
          </MenuItem>
        )}
        <MenuItem onClick={handleWhatsAppClick}>
          <WhatsAppIcon fontSize="small" sx={{ mr: 1 }} />
          Abrir WhatsApp
        </MenuItem>
        <MenuItem onClick={handleCopyContact}>
          <CopyIcon fontSize="small" sx={{ mr: 1 }} />
          Copiar dados
        </MenuItem>
        {onDelete && (
          <MenuItem
            onClick={() => {
              onDelete(contact.id);
              handleMenuClose();
            }}
            sx={{ color: 'error.main' }}
          >
            <DeleteIcon fontSize="small" sx={{ mr: 1 }} />
            Excluir
          </MenuItem>
        )}
      </Menu>
    </Card>
  );
};

export default ContactCard;