import React from 'react';
import { Box, Typography } from '@mui/material';
import ShoppingBasketIcon from '@mui/icons-material/ShoppingBasket';
import MouseIcon from '@mui/icons-material/Mouse';

const Logo = ({ variant = 'dark' }) => {
  const mainColor = variant === 'dark' ? '#111' : '#fff';
  const accentColor = '#9c27b0';

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        cursor: 'pointer',
      }}
    >
      {/* ICON */}
      <Box sx={{ position: 'relative' }}>
        <ShoppingBasketIcon sx={{ color: mainColor, fontSize: 34 }} />
        <MouseIcon
          sx={{
            color: accentColor,
            fontSize: 18,
            position: 'absolute',
            bottom: -2,
            right: -4,
          }}
        />
      </Box>

      {/* TEXT */}
      <Box>
        <Typography
          variant="h6"
          sx={{
            fontWeight: 800,
            color: mainColor,
            lineHeight: 1,
          }}
        >
          Click
          <span style={{ color: accentColor }}>Basket</span>
        </Typography>
        <Typography
          variant="caption"
          sx={{
            color: variant === 'dark' ? '#555' : '#ddd',
            fontSize: '0.65rem',
            letterSpacing: 1,
          }}
        >
          INDIA’S CHOICE
        </Typography>
      </Box>
    </Box>
  );
};

export default Logo;
