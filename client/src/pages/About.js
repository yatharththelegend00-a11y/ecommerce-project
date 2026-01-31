import React from 'react';
import { Container, Typography, Paper, Box, Divider } from '@mui/material';

const About = () => {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: '#fafafa',
        py: { xs: 4, md: 8 },
      }}
    >
      <Container maxWidth="md">
        <Paper
          elevation={0}
          sx={{
            p: { xs: 3, md: 5 },
            borderRadius: 0,
            background: '#ffffff',
          }}
        >
          <Typography
            variant="h3"
            fontWeight={700}
            gutterBottom
            sx={{ letterSpacing: 0.5 }}
          >
            About Us
          </Typography>

          <Divider sx={{ my: 3 }} />

          <Typography
            paragraph
            color="text.secondary"
            sx={{ lineHeight: 1.8, fontSize: '1.05rem' }}
          >
            Welcome to <strong>Click Basket</strong>, your trusted destination for
            thoughtfully curated products across fashion, electronics, shoes,
            and accessories.
          </Typography>

          <Typography
            paragraph
            color="text.secondary"
            sx={{ lineHeight: 1.8, fontSize: '1.05rem' }}
          >
            We focus on quality, reliability, and a smooth shopping experience.
            Every product is selected with care to ensure it fits seamlessly
            into your everyday lifestyle.
          </Typography>

          <Typography
            paragraph
            color="text.secondary"
            sx={{ lineHeight: 1.8, fontSize: '1.05rem' }}
          >
            Our mission is simple — provide premium products, transparent pricing,
            and dependable customer support, all in one modern shopping platform.
          </Typography>

          <Divider sx={{ my: 4 }} />

          <Box>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Contact Information
            </Typography>

            <Typography color="text.secondary">
              Email: clickbasket2026@gmail.com 
            </Typography>
            <Typography color="text.secondary">
              Phone: +91 7073939242 , +91 6378028489
            </Typography>
            <Typography color="text.secondary">
              Location: H N 604 
Om nagar Shastri Nagar Ajmer Raj - 305001
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default About;
