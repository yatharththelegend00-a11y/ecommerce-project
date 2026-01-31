import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Box,
  IconButton,
  Badge,
  Container,
  Drawer,
  List,
  ListItemText,
  Divider,
  ListItemButton,
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import MenuIcon from '@mui/icons-material/Menu';
import { useCart } from '../context/CartContext';
import Logo from './Logo';

const Navbar = () => {
  const { cart } = useCart();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const token = localStorage.getItem('token');
  const isGuest = localStorage.getItem('guest') === 'true';
  const role = localStorage.getItem('role');
  const userName = localStorage.getItem('user_name') || 'User';

  const closeDrawer = () => setOpen(false);

  const handleLogout = () => {
    localStorage.clear();
    closeDrawer();
    navigate('/login');
    window.location.reload();
  };

  return (
    <>
      {/* ================= NAVBAR ================= */}
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          background: 'rgba(255,255,255,0.95)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid rgba(0,0,0,0.06)',
        }}
      >
        <Container maxWidth="xl">
          <Toolbar
            sx={{
              minHeight: 72,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            {/* LOGO */}
            <Link to="/home" style={{ textDecoration: 'none' }}>
              <Logo variant="dark" />
            </Link>

            {/* CART + MENU */}
            <Box display="flex" alignItems="center">
              <IconButton component={Link} to="/cart">
                <Badge badgeContent={cart.length} color="error">
                  <ShoppingCartIcon />
                </Badge>
              </IconButton>

              <IconButton onClick={() => setOpen(true)}>
                <MenuIcon />
              </IconButton>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      {/* ================= DRAWER ================= */}
      <Drawer anchor="right" open={open} onClose={closeDrawer}>
        <Box sx={{ width: 260, pt: 1 }}>
          <List>
            <ListItemButton component={Link} to="/home" onClick={closeDrawer}>
              <ListItemText primary="Home" />
            </ListItemButton>

            <ListItemButton component={Link} to="/about" onClick={closeDrawer}>
              <ListItemText primary="About Us" />
            </ListItemButton>

            {token && (
              <ListItemButton
                component={Link}
                to="/orders"
                onClick={closeDrawer}
              >
                <ListItemText primary="My Orders" />
              </ListItemButton>
            )}

            {token && (
              <ListItemButton
                component={Link}
                to="/profile"
                onClick={closeDrawer}
              >
                <ListItemText
                  primary={`Profile (${userName.split(' ')[0]})`}
                />
              </ListItemButton>
            )}

            {token && role === 'admin' && (
              <ListItemButton
                component={Link}
                to="/admin"
                onClick={closeDrawer}
              >
                <ListItemText primary="Seller Hub" />
              </ListItemButton>
            )}

            <Divider sx={{ my: 1 }} />

            {!token && !isGuest && (
              <ListItemButton
                component={Link}
                to="/login"
                onClick={closeDrawer}
              >
                <ListItemText primary="Login" />
              </ListItemButton>
            )}

            {isGuest && (
              <ListItemText
                sx={{ px: 2, py: 1, color: 'text.secondary' }}
                primary="Guest User"
                secondary="Limited access"
              />
            )}

            {token && (
              <ListItemButton onClick={handleLogout}>
                <ListItemText primary="Logout" />
              </ListItemButton>
            )}
          </List>
        </Box>
      </Drawer>
    </>
  );
};

export default Navbar;
