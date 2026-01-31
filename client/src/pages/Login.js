import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  Divider,
  Stack,
} from '@mui/material';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import Logo from '../components/Logo';

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  /* ================= NORMAL LOGIN ================= */
  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const res = await axios.post('/api/login', {
        email,
        password,
      });

      localStorage.setItem('token', res.data.token);
      localStorage.setItem('role', res.data.role);
      localStorage.setItem('user_email', res.data.email);
      localStorage.setItem('user_name', res.data.name);
      localStorage.removeItem('guest');

      navigate('/home');
      window.location.reload();
    } catch {
      setError('Invalid email or password');
    }
  };

  /* ================= GOOGLE LOGIN ================= */
  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const decoded = jwtDecode(credentialResponse.credential);

      const res = await axios.post('/api/google-login', {
        email: decoded.email,
        name: decoded.name,
        googleId: decoded.sub,
      });

      localStorage.setItem('token', res.data.token);
      localStorage.setItem('role', res.data.role || 'customer');
      localStorage.setItem('user_email', decoded.email);
      localStorage.setItem('user_name', decoded.name);
      localStorage.removeItem('guest');

      navigate('/home');
      window.location.reload();
    } catch {
      setError('Google login failed');
    }
  };

  /* ================= GUEST LOGIN ================= */
  const handleGuest = () => {
    localStorage.setItem('guest', 'true');
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('user_email');
    localStorage.removeItem('user_name');

    navigate('/home');
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(180deg,#f9fafb 0%,#eef2f7 100%)',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <Container maxWidth="sm">
        <Paper
          sx={{
            p: 4,
            borderRadius: 4,
            boxShadow: '0 20px 50px rgba(0,0,0,0.12)',
          }}
        >
          {/* ================= LOGO ================= */}
          <Stack alignItems="center" spacing={1} mb={3}>
            <Logo />
            <Typography color="text.secondary">
              Login or continue as guest
            </Typography>
          </Stack>

          {error && (
            <Typography color="error" textAlign="center" mb={2}>
              {error}
            </Typography>
          )}

          {/* ================= EMAIL LOGIN ================= */}
          <form onSubmit={handleLogin}>
            <Stack spacing={2}>
              <TextField
                label="Email"
                type="email"
                fullWidth
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <TextField
                label="Password"
                type="password"
                fullWidth
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <Button
                type="submit"
                sx={{
                  py: 1.3,
                  borderRadius: 3,
                  fontWeight: 700,
                  background: 'linear-gradient(90deg,#111,#333)',
                  color: 'white',
                }}
              >
                Login
              </Button>
            </Stack>
          </form>

          <Divider sx={{ my: 3 }}>OR</Divider>

          {/* ================= GOOGLE LOGIN ================= */}
          <Box display="flex" justifyContent="center">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => setError('Google login failed')}
              theme="filled_blue"
              shape="pill"
              size="large"
            />
          </Box>

          {/* ================= GUEST BUTTON ================= */}
          <Button
            fullWidth
            sx={{
              mt: 3,
              py: 1.2,
              borderRadius: 3,
              fontWeight: 700,
              bgcolor: '#111',
              color: 'white',
              '&:hover': { bgcolor: '#000' },
            }}
            onClick={handleGuest}
          >
            Continue as Guest
          </Button>

          <Divider sx={{ my: 3 }} />

          {/* ================= REGISTER ================= */}
          <Typography variant="body2" textAlign="center">
            New here?{' '}
            <Link
              to="/register"
              style={{
                color: '#111',
                fontWeight: 600,
                textDecoration: 'none',
              }}
            >
              Create an account
            </Link>
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
};

export default Login;
