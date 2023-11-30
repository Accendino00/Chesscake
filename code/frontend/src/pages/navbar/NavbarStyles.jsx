import { styled } from '@mui/material/styles';
import ListItem from '@mui/material/ListItem';

export const StyledListItem = styled(ListItem)(({ theme }) => ({
  '&:hover': {
    filter: 'brightness(0.95)', // Grey tint on hover
    backdropFilter: 'brightness(0.95)', // Grey tint on hover
  },
  '&.Mui-selected': {
    backgroundColor: 'rgba(0, 0, 0, 0.1)', // Yellow tint on select #02bbfc
    color: 'black',
  },
  '&': {
    cursor: 'pointer', // Yellow tint on select
  },
  // Imposto la scritta dei testi
  '& .MuiListItemText-primary': {
    fontWeight: 'bold',
    fontFamily: 'Lato, sans-serif',
    fontSize: '1.2rem',
  },
  '& .MuiListItemText-secondary': {
    fontFamily: 'Lato, sans-serif',
    fontSize: '1em',
  },
  // Imposto il colore delle icone a nero
  '& .MuiListItemIcon-root': {
    color: '#1976d2',
  },
}));