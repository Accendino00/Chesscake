import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import PersonIcon from "@mui/icons-material/Person";
import InsertChartIcon from "@mui/icons-material/InsertChart";
import GroupIcon from '@mui/icons-material/Group';
import LoginIcon from '@mui/icons-material/Login';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import Cookies from 'js-cookie';
import { StyledListItem } from './NavbarStyles';
import Divider from '@mui/material/Divider'; // Added Divider import


const icons = {
  PlayCircleIcon: <PlayCircleIcon />,
  LoginIcon: <LoginIcon />,
  PersonIcon: <PersonIcon />,
  LeaderboardIcon: <InsertChartIcon />,
  GroupIcon: <GroupIcon />,
};

const NavbarData = [
  {
    title: " Really Bad Chess",
    icon: "PlayCircleIcon",
    link: "/play/reallybadchess/",
  },
  {
    title: " Kriegspiel",
    icon: "PlayCircleIcon",
    link: "/play/kriegspiel/",
  },
  {
    title: " Account",
    icon: "PersonIcon",
    link: "/play/account/",
  },
  {
    title: " Leaderboard",
    icon: "LeaderboardIcon",
    link: "/play/leaderboard/",
  },
  {
    title: " Login",
    icon: "LoginIcon",
    link: "/login/",
  },
];

const StyledDrawer = styled(Drawer)(({ theme }) => ({
  '& .MuiDrawer-paper': {
    width: 60, // Initial width with just icons
    overflowX: 'hidden',
    whiteSpace: 'nowrap',
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    [theme.breakpoints.up('sm')]: {
      width: 60, // Same as initial width
    },
  },
  '& .MuiDrawer-paper:hover': {
    width: 240, // Expanded width
  },
}));

function isLocationActive(itemlink) {
  const regex = new RegExp('^' + itemlink);
  return regex.test(window.location.pathname);
}

function Navbar({ loginStatus }) {

  const navigate = useNavigate();
  const [openDialog, setOpenDialog] = useState(false);

  const handleLogoutClick = () => {
    setOpenDialog(true);
  };

  const handleLogoutConfirm = () => {
    Cookies.remove('token');
    navigate('/');
  };

  let indexOfList = 0;

  return (
    <StyledDrawer variant="permanent">
      {/* Link alle altre pagine */}
      <List>
        <StyledListItem
          key={indexOfList++}
          onClick={() => navigate('/play')}
          className="navbarListItem"
        >
          <ListItemIcon>
            <img src="/iconQueen@0.25x.png" alt="Chess Cake" style={{ width: 24, height: 24 }} />
          </ListItemIcon>
          <Box sx={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
            <ListItemText primary="Chess Cake" />
          </Box>
        </StyledListItem>
        <Divider />
        {NavbarData.map((item, index) => {
          if ((loginStatus === false && item.title === " Account") ||
            (loginStatus === false && item.title === " Mob Play") ||
            (loginStatus === false && item.title === " Kriegspiel") ||
            (loginStatus === true && item.title === " Login")) {
            return null;
          }
          return (
            <StyledListItem
              key={indexOfList++}
              onClick={() => navigate(item.link)}
              selected={isLocationActive(item.link)}
              className="navbarListItem"
            >
              <ListItemIcon>
                {icons[item.icon]}
              </ListItemIcon>
              <Box sx={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
                <ListItemText secondary={item.title} />
              </Box>
            </StyledListItem>
          );
        })}
        {/* Logout button */}
        {loginStatus && (
          <StyledListItem
            key={indexOfList++}
            onClick={handleLogoutClick}
            className="navbarListItem"
          >
            <ListItemIcon>
              <ExitToAppIcon />
            </ListItemIcon>
            <Box sx={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
              <ListItemText secondary="Logout" />
            </Box>
          </StyledListItem>
        )}
      </List>
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
      >
        <DialogContent>
          <DialogContentText>
            Are you sure you want to logout?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>No</Button>
          <Button onClick={handleLogoutConfirm} autoFocus>
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </StyledDrawer>
  );
}

export default Navbar;