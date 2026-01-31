import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'light', // Standard Light Mode
    primary: {
      main: '#2874f0', // The "Flipkart Blue" (Trustworthy)
      dark: '#1e5ecc',
    },
    secondary: {
      main: '#ff9f00', // The "Offer Orange" (Excitement)
      contrastText: '#fff',
    },
    background: {
      default: '#f1f3f6', // Soft Grey (Easy on eyes)
      paper: '#ffffff',   // Pure White Cards
    },
    text: {
      primary: '#212121', // Dark Grey (Not pitch black, softer)
      secondary: '#878787',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h5: { fontWeight: 600 },
    h6: { fontWeight: 500, fontSize: '1.1rem' },
    button: { fontWeight: 600, textTransform: 'none' }, // Readable buttons
  },
  shape: {
    borderRadius: 4, // Sharp, professional corners (Standard E-com)
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#2874f0', // Solid Blue Header
          boxShadow: 'none',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 2, // Standard buttons
        },
        containedSecondary: {
          backgroundColor: '#ff9f00',
          '&:hover': { backgroundColor: '#e68e00' },
        }
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 1px 3px rgba(0,0,0,0.12)', // Subtle shadow
          transition: 'box-shadow 0.2s',
          '&:hover': {
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)', // Pop up on hover
          },
        },
      },
    },
  },
});

export default theme;