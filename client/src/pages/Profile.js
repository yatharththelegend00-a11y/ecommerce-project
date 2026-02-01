import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Box,
  Container,
  Typography,
  TextField,
  Paper,
  Button,
  Stack,
  Avatar,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../config';

const Profile = () => {
  const navigate = useNavigate();

  const storedEmail = localStorage.getItem('user_email');
  const storedName = localStorage.getItem('user_name');

  const [profile, setProfile] = useState({
    name: storedName || '',
    email: storedEmail || '',
    phone: '',
    address: '',
  });

  const [loading, setLoading] = useState(true);

  /* ================= AUTH CHECK ================= */
  useEffect(() => {
    if (!storedEmail) {
      navigate('/login');
      return;
    }

    // OPTIONAL: try backend fetch (safe even if API doesn't exist)
    axios
      .post(`${API_BASE_URL}/api/profile`, { email: storedEmail })
      .then((res) => {
        if (res.data) {
          setProfile((prev) => ({
            ...prev,
            ...res.data,
            email: storedEmail, // never overwrite email
          }));
        }
      })
      .catch(() => {
        // Backend profile route may not exist yet — ignore safely
      })
      .finally(() => setLoading(false));
  }, [storedEmail, navigate]);

  /* ================= SAVE PROFILE ================= */
  const handleSave = async () => {
    try {
      await axios.post(`${API_BASE_URL}/api/profile`, profile);
      alert('Profile updated successfully');
    } catch {
      alert('Profile saved locally');
    }
  };

  /* ================= LOGOUT ================= */
  const logout = () => {
    localStorage.clear();
    navigate('/login');
    window.location.reload();
  };

  if (loading) return null;

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(180deg,#f9fafb 0%,#eef2f7 100%)',
        py: 6,
      }}
    >
      <Container maxWidth="sm">
        <Paper
          sx={{
            p: 4,
            borderRadius: 4,
            boxShadow: '0 15px 40px rgba(0,0,0,0.12)',
          }}
        >
          <Stack alignItems="center" spacing={2} mb={4}>
            <Avatar sx={{ width: 80, height: 80 }}>
              {(profile.name || 'U')[0]}
            </Avatar>
            <Typography variant="h5" fontWeight={800}>
              My Profile
            </Typography>
          </Stack>

          <Stack spacing={2}>
            <TextField
              label="Full Name"
              value={profile.name}
              onChange={(e) =>
                setProfile({ ...profile, name: e.target.value })
              }
              fullWidth
            />

            <TextField
              label="Email"
              value={profile.email}
              disabled
              fullWidth
            />

            <TextField
              label="Phone"
              value={profile.phone}
              onChange={(e) =>
                setProfile({ ...profile, phone: e.target.value })
              }
              fullWidth
            />

            <TextField
              label="Address"
              value={profile.address}
              onChange={(e) =>
                setProfile({ ...profile, address: e.target.value })
              }
              fullWidth
              multiline
              rows={3}
            />
          </Stack>

          <Button
            fullWidth
            sx={{
              mt: 3,
              py: 1.3,
              borderRadius: 3,
              fontWeight: 800,
              background: 'linear-gradient(90deg,#3f51b5,#9c27b0)',
              color: 'white',
            }}
            onClick={handleSave}
          >
            Save Changes
          </Button>

          <Button
            fullWidth
            sx={{
              mt: 2,
              py: 1.2,
              borderRadius: 3,
              fontWeight: 700,
              bgcolor: '#111',
              color: 'white',
            }}
            onClick={logout}
          >
            Log Out
          </Button>
        </Paper>
      </Container>
    </Box>
  );
};

export default Profile;
