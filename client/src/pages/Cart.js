import React from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  IconButton,
  Button,
  Divider,
  Stack,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../config';

const Cart = () => {
  const { cart, removeFromCart } = useCart();
  const navigate = useNavigate();

  const total = cart.reduce(
    (sum, item) => sum + Number(item.price) * (item.quantity || 1),
    0
  );

  if (cart.length === 0) {
    return (
      <Container sx={{ py: 12, textAlign: 'center' }}>
        <Typography variant="h4" fontWeight={700}>
          Your cart is empty
        </Typography>
        <Typography color="text.secondary" mt={1}>
          Add something beautiful to continue.
        </Typography>

        <Button
          sx={{
            mt: 4,
            px: 5,
            py: 1.2,
            borderRadius: 0,
            bgcolor: '#111',
            color: 'white',
            '&:hover': { bgcolor: '#000' },
          }}
          onClick={() => navigate('/home')}
        >
          Continue Shopping
        </Button>
      </Container>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#fafafa', py: 6 }}>
      <Container maxWidth="md">
        <Typography variant="h4" fontWeight={800} mb={4}>
          Shopping Cart
        </Typography>

        <Stack spacing={3}>
          {cart.map((item, index) => (
            <Paper
              key={index}
              sx={{
                p: 3,
                display: 'flex',
                gap: 3,
                alignItems: 'center',
                borderRadius: 0,
              }}
            >
              <Box
                component="img"
                src={item.image}
                alt={item.name}
                sx={{
                  width: 90,
                  height: 90,
                  objectFit: 'contain',
                  bgcolor: '#f2f2f2',
                }}
              />

              <Box flexGrow={1}>
                <Typography fontWeight={600}>{item.name}</Typography>
                {(item.color || item.size) && (
                  <Typography variant="body2" color="text.secondary">
                    {item.color} {item.size && `• ${item.size}`}
                  </Typography>
                )}
                <Typography fontWeight={700} mt={0.5}>
                  ₹{item.price}
                </Typography>
              </Box>

              <IconButton
                color="error"
                onClick={() => removeFromCart(index)}
              >
                <DeleteIcon />
              </IconButton>
            </Paper>
          ))}
        </Stack>

        {/* SUMMARY */}
        <Paper sx={{ mt: 5, p: 4, borderRadius: 0 }}>
          <Typography variant="h6" fontWeight={700}>
            Order Summary
          </Typography>

          <Divider sx={{ my: 2 }} />

          <Box display="flex" justifyContent="space-between">
            <Typography>Total</Typography>
            <Typography fontWeight={800}>₹{total}</Typography>
          </Box>

          <Button
            fullWidth
            sx={{
              mt: 3,
              py: 1.4,
              borderRadius: 0,
              fontWeight: 700,
              bgcolor: '#111',
              color: 'white',
              '&:hover': { bgcolor: '#000' },
            }}
            onClick={() => navigate('/checkout')}
          >
            Proceed to Checkout
          </Button>
        </Paper>
      </Container>
    </Box>
  );
};

export default Cart;
