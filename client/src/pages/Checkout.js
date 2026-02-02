import React, { useState } from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  TextField,
  Paper,
  Button,
  Divider,
  CircularProgress,
} from '@mui/material';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../config';

/* ================= RAZORPAY LOADER ================= */
const loadRazorpay = () =>
  new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });

const Checkout = () => {
  const { cart, clearCart } = useCart();
  const navigate = useNavigate();

  const storedEmail = localStorage.getItem('user_email') || '';

  const [loading, setLoading] = useState(false);
  const [pinLoading, setPinLoading] = useState(false);
  const [pinError, setPinError] = useState('');
  const [formError, setFormError] = useState('');

  const [form, setForm] = useState({
    name: '',
    email: storedEmail,
    address: '',
    city: '',
    state: '',
    pincode: '',
    phone: '',
  });

  const total = cart.reduce(
    (sum, item) => sum + Number(item.price) * (item.quantity || 1),
    0
  );

  /* ================= PIN LOOKUP ================= */
  const handlePincodeChange = async (e) => {
    const value = e.target.value.replace(/\D/g, '');
    setForm((prev) => ({ ...prev, pincode: value }));
    setPinError('');

    if (value.length === 6) {
      try {
        setPinLoading(true);
        const res = await axios.get(
          `https://api.postalpincode.in/pincode/${value}`
        );
        const data = res.data[0];
        if (data.Status === 'Success') {
          setForm((prev) => ({
            ...prev,
            city: data.PostOffice[0].District,
            state: data.PostOffice[0].State,
          }));
        } else {
          setPinError('Invalid PIN code');
        }
      } catch {
        setPinError('Unable to fetch location');
      } finally {
        setPinLoading(false);
      }
    }
  };

  /* ================= VALIDATION ================= */
  const validateForm = () => {
    const { name, email, address, city, state, pincode, phone } = form;
    if (!name || !email || !address || !city || !state || !pincode || !phone) {
      setFormError('All fields are mandatory');
      return false;
    }
    setFormError('');
    return true;
  };

  /* ================= PLACE ORDER ================= */
  const placeOrder = async (method = 'COD', paymentId = 'COD') => {
    if (!validateForm()) return;

    try {
      setLoading(true);
      await axios.post(`${API_BASE_URL}/api/orders`, {
        email: form.email,
        user_name: form.name,
        phone: form.phone,
        address: form.address,
        city: form.city,
        state: form.state,
        pincode: form.pincode,
        items: cart,
        total_amount: total,
        paymentId,
        payment_method: method,
      });

      clearCart();
      navigate('/orders');
    } catch {
      alert('Order failed');
    } finally {
      setLoading(false);
    }
  };

  /* ================= ONLINE PAYMENT ================= */
  const payOnline = async () => {
    const loaded = await loadRazorpay();
    if (!loaded) return alert('Razorpay failed to load');

    const { data: order } = await axios.post(`${API_BASE_URL}/api/payment/create-order`, {
      amount: total,
    });

    const options = {
      key: 'rzp_test_S8uQnPyJjjj7xR',
      amount: order.amount,
      currency: 'INR',
      name: 'Click Basket',
      order_id: order.id,
      handler: (res) =>
        placeOrder('ONLINE', res.razorpay_payment_id),
      theme: { color: '#111' },
    };

    new window.Razorpay(options).open();
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#fafafa', py: 6 }}>
      <Container maxWidth="lg">
        <Typography variant="h4" fontWeight={800} mb={4}>
          Checkout
        </Typography>

        {formError && (
          <Typography color="error.main" mb={2}>
            {formError}
          </Typography>
        )}

        <Grid container spacing={4}>
          {/* ADDRESS */}
          <Grid item xs={12} md={7}>
            <Paper sx={{ p: 4, borderRadius: 0 }}>
              <Typography fontWeight={700} mb={2}>
                Shipping Details
              </Typography>

              <Grid container spacing={2}>
                {['name', 'email', 'address', 'phone'].map((f) => (
                  <Grid item xs={12} key={f}>
                    <TextField
                      fullWidth
                      label={f.toUpperCase()}
                      value={form[f]}
                      onChange={(e) =>
                        setForm({ ...form, [f]: e.target.value })
                      }
                    />
                  </Grid>
                ))}

                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="PIN CODE"
                    value={form.pincode}
                    onChange={handlePincodeChange}
                    error={!!pinError}
                    helperText={pinError}
                    InputProps={{
                      endAdornment: pinLoading && (
                        <CircularProgress size={18} />
                      ),
                    }}
                  />
                </Grid>

                <Grid item xs={6}>
                  <TextField fullWidth label="CITY" value={form.city} disabled />
                </Grid>

                <Grid item xs={12}>
                  <TextField fullWidth label="STATE" value={form.state} disabled />
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          {/* SUMMARY */}
          <Grid item xs={12} md={5}>
            <Paper sx={{ p: 4, borderRadius: 0 }}>
              <Typography fontWeight={700}>Order Summary</Typography>
              <Divider sx={{ my: 2 }} />

              {cart.map((item, i) => (
                <Typography key={i}>
                  {item.name} × {item.quantity || 1}
                </Typography>
              ))}

              <Divider sx={{ my: 2 }} />

              <Typography fontWeight={800}>Total: ₹{total}</Typography>

              <Button
                fullWidth
                sx={{ mt: 3, borderRadius: 0 }}
                variant="contained"
                disabled={loading}
                onClick={() => placeOrder()}
              >
                Cash on Delivery
              </Button>

              <Button
                fullWidth
                sx={{ mt: 2, borderRadius: 0 }}
                variant="outlined"
                onClick={payOnline}
              >
                Pay Online
              </Button>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Checkout;
