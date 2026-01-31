import React from 'react';
import { Box, Container, Grid, Typography, Link, Divider } from '@mui/material';

const Footer = () => {
  return (
    <Box
      sx={{
        mt: 10,
        pt: 8,
        pb: 4,
        backgroundColor: '#f7f7f5', // premium off-white
        borderTop: '1px solid rgba(0,0,0,0.08)',
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={{ xs: 5, md: 8 }}>
          {/* BRAND */}
          <Grid item xs={12} md={4}>
            <Typography
              variant="h5"
              fontWeight={800}
              sx={{
                letterSpacing: 1,
                color: '#111',
              }}
            >
              ClickBasket
            </Typography>

            <Typography
              variant="body2"
              sx={{
                mt: 2,
                color: '#555',
                maxWidth: 280,
                lineHeight: 1.7,
              }}
            >
              Premium products curated for modern lifestyles.
              Thoughtful design, trusted quality, and seamless delivery.
            </Typography>
          </Grid>

          {/* LINKS */}
          <Grid item xs={12} sm={6} md={4}>
            <Typography fontWeight={700} mb={2} color="#111">
              Explore
            </Typography>

            <Box display="flex" flexDirection="column" gap={1.2}>
              <Link href="/home" underline="none" sx={linkStyle}>
                Home
              </Link>
              <Link href="/about" underline="none" sx={linkStyle}>
                About Us
              </Link>
              <Link href="/orders" underline="none" sx={linkStyle}>
                My Orders
              </Link>
              <Link href="/profile" underline="none" sx={linkStyle}>
                My Account
              </Link>
            </Box>
          </Grid>

          {/* CONTACT */}
          <Grid item xs={12} sm={6} md={4}>
            <Typography fontWeight={700} mb={2} color="#111">
              Contact
            </Typography>

            <Typography variant="body2" sx={{ color: '#555' }}>
              Ajmer, Rajasthan, India
            </Typography>

            <Typography variant="body2" sx={{ color: '#555', mt: 1 }}>
              clickbasket2026@gmail.com
            </Typography>

            <Typography variant="body2" sx={{ color: '#555', mt: 1 }}>
              +91 7073939242 , +91 6378028489
            </Typography>
          </Grid>
        </Grid>

        <Divider sx={{ my: 4 }} />

        {/* BOTTOM BAR */}
        <Box
          display="flex"
          flexDirection={{ xs: 'column', sm: 'row' }}
          justifyContent="space-between"
          alignItems="center"
          gap={2}
        >
          <Typography variant="caption" sx={{ color: '#777' }}>
            © {new Date().getFullYear()} ClickBasket. All rights reserved.
          </Typography>

          <Typography
            variant="caption"
            sx={{ color: '#777', letterSpacing: 0.5 }}
          >
            Crafted with care in India 🇮🇳
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

const linkStyle = {
  color: '#555',
  fontSize: '0.9rem',
  fontWeight: 500,
  transition: '0.2s ease',
  '&:hover': {
    color: '#111',
    paddingLeft: '6px',
  },
};

export default Footer;
