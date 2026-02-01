import React, { useEffect, useState } from 'react';
import { API_BASE_URL } from '../config';
import axios from 'axios';
import {
  Box,
  Container,
  Typography,
  Paper,
  Chip,
  Stack,
  Divider,
} from '@mui/material';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const userEmail = localStorage.getItem('user_email');

  useEffect(() => {
    axios.get(`${API_BASE_URL}/api/orders`).then((res) => {
      const myOrders = res.data.filter(
        (order) => order.user_email === userEmail
      );
      setOrders(myOrders);
    });
  }, [userEmail]);

  return (
    <Box sx={{ minHeight: '100vh', py: 6, bgcolor: '#f5f7fb' }}>
      <Container maxWidth="md">
        <Typography variant="h4" fontWeight={800} mb={4}>
          My Orders
        </Typography>

        {orders.length === 0 ? (
          <Paper sx={{ p: 4 }}>
            <Typography>You haven’t placed any orders yet.</Typography>
          </Paper>
        ) : (
          <Stack spacing={3}>
            {orders.map((order) => (
              <Paper key={order.id} sx={{ p: 3 }}>
                <Typography fontWeight={700}>
                  Order #{order.id}
                </Typography>

                <Chip
                  label={order.status}
                  color={
                    order.status === 'Confirmed'
                      ? 'success'
                      : order.status === 'Rejected'
                      ? 'error'
                      : 'warning'
                  }
                  sx={{ mt: 1 }}
                />

                <Divider sx={{ my: 2 }} />

                {order.items.map((item, i) => (
                  <Typography key={i}>
                    {item.product_name} × {item.quantity}
                  </Typography>
                ))}

                <Divider sx={{ my: 2 }} />

                <Typography fontWeight={800}>
                  Total: ₹{order.total_amount}
                </Typography>
              </Paper>
            ))}
          </Stack>
        )}
      </Container>
    </Box>
  );
};

export default Orders;
