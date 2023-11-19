import { styled } from '@mui/material/styles';
import ListItem from '@mui/material/ListItem';

export const StyledListItem = styled(ListItem)(({ theme }) => ({
  '&:hover': {
    backgroundColor: 'rgba(0, 0, 0, 0.1)', // Grey tint on hover
  },
  '&.Mui-selected': {
    backgroundColor: '#ffcd00', // Yellow tint on select #02bbfc
    color: 'black',
  },
  '&': {
    cursor: 'pointer', // Yellow tint on select
  },
  // Imposto la scritta dei testi
  '& .MuiListItemText-primary': {
    fontWeight: 'bold',
    fontFamily: 'Lato, sans-serif',
  },
  // Imposto il colore delle icone a nero
  '& .MuiListItemIcon-root': {
    color: '#046695',
  },
}));