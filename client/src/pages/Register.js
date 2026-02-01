import React, { useState } from 'react';
import {
  Container,
  TextField,
  Button,
  Typography,
  Paper,
  Box,
  Alert,
  Divider,
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import ShoppingBasketIcon from '@mui/icons-material/ShoppingBasket';
import { API_BASE_URL } from '../config';

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      await axios.post(`${API_BASE_URL}/api/register`, formData);
      setSuccess('Account created successfully! Redirecting to login...');
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed');
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: '#f1f3f6',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Container maxWidth="xs">
        <Paper sx={{ p: 4, borderRadius: 3, textAlign: 'center' }}>
          {/* LOGO */}
          <Box display="flex" justifyContent="center" gap={1} mb={1}>
            <ShoppingBasketIcon sx={{ fontSize: 40, color: '#2874f0' }} />
            <Typography
              variant="h4"
              fontWeight="bold"
              sx={{ color: '#2874f0' }}
            >
              Click<span style={{ color: '#ff9f00' }}>Basket</span>
            </Typography>
          </Box>

          <Typography
            variant="body2"
            color="text.secondary"
            mb={3}
          >
            Create your account to start shopping
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {success && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {success}
            </Alert>
          )}

          {/* REGISTER FORM */}
          <Box
            component="form"
            onSubmit={handleRegister}
            sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
          >
            <TextField
              label="Full Name"
              name="name"
              fullWidth
              required
              onChange={handleChange}
            />

            <TextField
              label="Email Address"
              name="email"
              type="email"
              fullWidth
              required
              onChange={handleChange}
            />

            <TextField
              label="Password"
              name="password"
              type="password"
              fullWidth
              required
              onChange={handleChange}
            />

            <Button
              type="submit"
              variant="contained"
              size="large"
              sx={{
                bgcolor: '#fb641b',
                fontWeight: 'bold',
                py: 1.3,
              }}
            >
              Create Account
            </Button>
          </Box>

          <Divider sx={{ my: 3 }} />

          {/* LOGIN LINK */}
          <Typography variant="body2" color="text.secondary">
            Already have an account?{' '}
            <Link
              to="/login"
              style={{
                color: '#2874f0',
                fontWeight: 'bold',
                textDecoration: 'none',
              }}
            >
              Login
            </Link>
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
};

export default Register;
